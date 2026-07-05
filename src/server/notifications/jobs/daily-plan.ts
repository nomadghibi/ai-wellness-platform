import OpenAI from "openai";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  users,
  healthProfiles,
  wellnessGoals,
  dailyPlans,
  aiRuns,
  scheduledJobs,
} from "@/server/db/schema";
import { getTodaySummary } from "@/server/wellness/logs";
import { sendWhatsAppMessage } from "@/server/whatsapp/send";
import { PROMPTS } from "@/server/ai/prompts";

export interface DailyPlanJobData {
  userId: string;
  phone: string;
}

const DEFAULT_PLAN = `Good morning! Here's your wellness plan for today:

🥗 Eat a balanced breakfast with protein and vegetables
💧 Drink 8 glasses of water throughout the day
🚶 Take a 20-minute walk today
😴 Aim to wind down by your usual bedtime

You've got this! Reply to let me know how you get on.`;

async function buildPlanContext(userId: string): Promise<string> {
  const [profileRow, goalRows, todaySummary] = await Promise.all([
    db.select().from(healthProfiles).where(eq(healthProfiles.userId, userId)).limit(1),
    db
      .select({ goalType: wellnessGoals.goalType })
      .from(wellnessGoals)
      .where(and(eq(wellnessGoals.userId, userId), eq(wellnessGoals.status, "active"))),
    getTodaySummary(userId),
  ]);

  const profile = profileRow[0];
  const lines: string[] = [];

  if (profile) {
    if (profile.dietPreference) lines.push(`Diet: ${profile.dietPreference}`);
    if (profile.activityLevel) lines.push(`Activity level: ${profile.activityLevel}`);
    if (profile.wakeTime) lines.push(`Wake time: ${String(profile.wakeTime).slice(0, 5)}`);
    if (profile.sleepTime) lines.push(`Bed time: ${String(profile.sleepTime).slice(0, 5)}`);
    if (profile.motivationStyle) lines.push(`Coaching style: ${profile.motivationStyle}`);
    if (profile.weightValue && profile.goalWeightValue)
      lines.push(
        `Goal: ${profile.goalWeightValue}${profile.goalWeightUnit ?? "kg"} (currently ${profile.weightValue}${profile.weightUnit ?? "kg"})`
      );
  }

  if (goalRows.length > 0)
    lines.push(`Active goals: ${goalRows.map((g) => g.goalType).join(", ")}`);

  lines.push(
    `Yesterday: ${todaySummary.meals.length} meals, ${todaySummary.totalWaterMl}ml water, ${todaySummary.totalSteps} steps`
  );

  return lines.join("\n");
}

export async function processDailyPlan(data: DailyPlanJobData): Promise<void> {
  const { userId, phone } = data;
  const today = new Date().toISOString().slice(0, 10);
  const jobStart = Date.now();

  const [jobRow] = await db
    .insert(scheduledJobs)
    .values({ jobType: "daily_plan", userId, status: "running", scheduledAt: new Date() })
    .returning({ id: scheduledJobs.id });

  // Idempotency: skip if already generated today
  const [existingPlan] = await db
    .select({ id: dailyPlans.id })
    .from(dailyPlans)
    .where(and(eq(dailyPlans.userId, userId), eq(dailyPlans.planDate, today)))
    .limit(1);

  if (existingPlan) {
    await db
      .update(scheduledJobs)
      .set({ status: "completed", executedAt: new Date() })
      .where(eq(scheduledJobs.id, jobRow.id));
    console.info(`[DailyPlan] Already sent today for ${userId}`);
    return;
  }

  try {
    let planText = DEFAULT_PLAN;
    let planJson: Record<string, unknown> = {};
    let aiRunId: string | undefined;

    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const [context, userRow] = await Promise.all([
        buildPlanContext(userId),
        db.select({ name: users.name }).from(users).where(eq(users.id, userId)).limit(1),
      ]);
      const name = userRow[0]?.name?.split(" ")[0] ?? "there";
      const start = Date.now();

      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.8,
        max_tokens: 400,
        messages: [
          { role: "system", content: PROMPTS.dailyPlan.content },
          { role: "user", content: `Create a daily plan for ${name}.\n\n${context}` },
        ],
        response_format: { type: "json_object" },
      });

      const [runRow] = await db
        .insert(aiRuns)
        .values({
          userId,
          agentName: "daily-plan",
          model: "gpt-4o-mini",
          promptVersion: PROMPTS.dailyPlan.version,
          inputTokens: res.usage?.prompt_tokens,
          outputTokens: res.usage?.completion_tokens,
          costEstimate: String(
            (res.usage?.prompt_tokens ?? 0) * 0.00000015 +
              (res.usage?.completion_tokens ?? 0) * 0.0000006
          ),
          latencyMs: Date.now() - start,
          status: "success",
        })
        .returning({ id: aiRuns.id });

      aiRunId = runRow.id;

      const parsed = JSON.parse(res.choices[0]?.message?.content ?? "{}") as {
        planText?: string;
        planItems?: unknown[];
      };
      planText = parsed.planText ?? DEFAULT_PLAN;
      planJson = { planItems: parsed.planItems ?? [] };
    }

    await db.insert(dailyPlans).values({
      userId,
      planDate: today,
      planText,
      planJson,
      generatedByAiRunId: aiRunId,
    });

    await sendWhatsAppMessage(phone, planText, userId);

    await db
      .update(scheduledJobs)
      .set({ status: "completed", executedAt: new Date() })
      .where(eq(scheduledJobs.id, jobRow.id));

    console.info(`[DailyPlan] Sent to ${phone} in ${Date.now() - jobStart}ms`);
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    await db
      .update(scheduledJobs)
      .set({ status: "failed", executedAt: new Date(), error })
      .where(eq(scheduledJobs.id, jobRow.id));
    console.error(`[DailyPlan] Failed for ${userId}:`, error);
    throw err;
  }
}
