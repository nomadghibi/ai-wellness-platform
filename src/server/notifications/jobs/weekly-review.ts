import OpenAI from "openai";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  users,
  weeklyReviews,
  aiRuns,
  aiMemory,
  scheduledJobs,
  wellnessGoals,
} from "@/server/db/schema";
import { getWeeklyStats } from "@/server/wellness/logs";
import { sendWhatsAppMessage } from "@/server/whatsapp/send";
import { PROMPTS } from "@/server/ai/prompts";

export interface WeeklyReviewJobData {
  userId: string;
  phone: string;
}

function getWeekRange(): { weekStart: string; weekEnd: string } {
  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon, ...
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - daysToMonday);

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  return {
    weekStart: monday.toISOString().slice(0, 10),
    weekEnd: sunday.toISOString().slice(0, 10),
  };
}

function formatStatsForPrompt(stats: Awaited<ReturnType<typeof getWeeklyStats>>, goals: string[]): string {
  const lines = [
    `Week: ${stats.weekStart} to ${stats.weekEnd}`,
    `Goals: ${goals.join(", ") || "none set"}`,
    ``,
    `Meals logged: ${stats.mealCount}`,
    stats.mealDescriptions.length > 0
      ? `Sample meals: ${stats.mealDescriptions.slice(0, 5).join("; ")}`
      : "",
    `Water: ${stats.totalWaterMl}ml total, ${stats.daysWithWater}/7 days`,
    `Activity: ${stats.totalSteps} steps, ${stats.totalActivityMin} minutes, ${stats.daysActive}/7 days active`,
    stats.sleepEntries.length > 0
      ? `Sleep: ${stats.sleepEntries.length} nights logged, qualities: ${stats.sleepEntries.map((s) => s.quality ?? "?").join(", ")}`
      : "Sleep: not logged",
    `Habits: ${stats.habitsCompleted}/${stats.habitsTotal} completed`,
    `Check-ins: ${stats.checkinCount}/7 days`,
    stats.avgMood != null ? `Avg mood: ${stats.avgMood}/10` : "",
    stats.avgEnergy != null ? `Avg energy: ${stats.avgEnergy}/10` : "",
  ].filter(Boolean);

  return lines.join("\n");
}

const DEFAULT_REVIEW = `Here's your weekly wellness summary! 🌱

You showed up this week — and that counts. Every small action builds momentum.

Next week's focus: Stay consistent with one habit you did well this week.

Keep going! 💪`;

export async function processWeeklyReview(data: WeeklyReviewJobData): Promise<void> {
  const { userId, phone } = data;
  const { weekStart, weekEnd } = getWeekRange();
  const jobStart = Date.now();

  const [jobRow] = await db
    .insert(scheduledJobs)
    .values({ jobType: "weekly_review", userId, status: "running", scheduledAt: new Date() })
    .returning({ id: scheduledJobs.id });

  // Idempotency: skip if review already exists for this week
  const [existing] = await db
    .select({ id: weeklyReviews.id })
    .from(weeklyReviews)
    .where(and(eq(weeklyReviews.userId, userId), eq(weeklyReviews.weekStart, weekStart)))
    .limit(1);

  if (existing) {
    await db.update(scheduledJobs).set({ status: "completed", executedAt: new Date() }).where(eq(scheduledJobs.id, jobRow.id));
    console.info(`[WeeklyReview] Already generated for week ${weekStart} for ${userId}`);
    return;
  }

  try {
    const [stats, goalRows, userRow] = await Promise.all([
      getWeeklyStats(userId, weekStart, weekEnd),
      db.select({ goalType: wellnessGoals.goalType }).from(wellnessGoals)
        .where(and(eq(wellnessGoals.userId, userId), eq(wellnessGoals.status, "active"))),
      db.select({ name: users.name }).from(users).where(eq(users.id, userId)).limit(1),
    ]);

    const name = userRow[0]?.name?.split(" ")[0] ?? "there";
    const goals = goalRows.map((g) => g.goalType);
    const statsText = formatStatsForPrompt(stats, goals);

    let reviewText = DEFAULT_REVIEW;
    let reviewJson: Record<string, unknown> = {};
    let reviewAiRunId: string | undefined;
    let memorySummary: string | null = null;

    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      // 1. Generate the weekly review
      const start1 = Date.now();
      const res1 = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 500,
        messages: [
          { role: "system", content: PROMPTS.weeklyReview.content },
          { role: "user", content: `Write the weekly review for ${name}.\n\n${statsText}` },
        ],
        response_format: { type: "json_object" },
      });

      const [run1] = await db.insert(aiRuns).values({
        userId,
        agentName: "weekly-review",
        model: "gpt-4o-mini",
        promptVersion: PROMPTS.weeklyReview.version,
        inputTokens: res1.usage?.prompt_tokens,
        outputTokens: res1.usage?.completion_tokens,
        costEstimate: String(
          (res1.usage?.prompt_tokens ?? 0) * 0.00000015 +
          (res1.usage?.completion_tokens ?? 0) * 0.0000006
        ),
        latencyMs: Date.now() - start1,
        status: "success",
      }).returning({ id: aiRuns.id });

      reviewAiRunId = run1.id;

      const parsed1 = JSON.parse(res1.choices[0]?.message?.content ?? "{}") as {
        reviewText?: string;
        wins?: string[];
        challenges?: string[];
        nextWeekFocus?: string;
      };
      reviewText = parsed1.reviewText ?? DEFAULT_REVIEW;
      reviewJson = {
        wins: parsed1.wins ?? [],
        challenges: parsed1.challenges ?? [],
        nextWeekFocus: parsed1.nextWeekFocus ?? "",
      };

      // 2. Generate memory summary from the review + stats
      const memoryPrompt = `Based on this weekly wellness data and review, write a 2-3 sentence coaching memory summary that captures patterns, preferences, and areas for focus. Be specific and useful for future coaching.

Weekly data:
${statsText}

Review highlights:
Wins: ${parsed1.wins?.join("; ") ?? "none"}
Challenges: ${parsed1.challenges?.join("; ") ?? "none"}
Next week focus: ${parsed1.nextWeekFocus ?? ""}

Respond with ONLY the summary text (no JSON, no headers).`;

      const start2 = Date.now();
      const res2 = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.5,
        max_tokens: 150,
        messages: [{ role: "user", content: memoryPrompt }],
      });

      await db.insert(aiRuns).values({
        userId,
        agentName: "memory-summary",
        model: "gpt-4o-mini",
        inputTokens: res2.usage?.prompt_tokens,
        outputTokens: res2.usage?.completion_tokens,
        costEstimate: String(
          (res2.usage?.prompt_tokens ?? 0) * 0.00000015 +
          (res2.usage?.completion_tokens ?? 0) * 0.0000006
        ),
        latencyMs: Date.now() - start2,
        status: "success",
      });

      memorySummary = res2.choices[0]?.message?.content?.trim() ?? null;
    }

    // Store weekly review
    await db.insert(weeklyReviews).values({
      userId,
      weekStart,
      weekEnd,
      reviewText,
      reviewJson,
      generatedByAiRunId: reviewAiRunId,
    });

    // Store/update AI memory
    if (memorySummary) {
      const [existingMemory] = await db
        .select({ id: aiMemory.id })
        .from(aiMemory)
        .where(and(eq(aiMemory.userId, userId), eq(aiMemory.memoryType, "summary")))
        .limit(1);

      if (existingMemory) {
        await db.update(aiMemory)
          .set({ summaryText: memorySummary, updatedAt: new Date() })
          .where(eq(aiMemory.id, existingMemory.id));
      } else {
        await db.insert(aiMemory).values({
          userId,
          memoryType: "summary",
          summaryText: memorySummary,
          source: "weekly_review",
        });
      }
    }

    // Send via WhatsApp
    await sendWhatsAppMessage(phone, reviewText, userId);

    await db.update(scheduledJobs)
      .set({ status: "completed", executedAt: new Date() })
      .where(eq(scheduledJobs.id, jobRow.id));

    console.info(`[WeeklyReview] Sent to ${phone} in ${Date.now() - jobStart}ms`);
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    await db.update(scheduledJobs)
      .set({ status: "failed", executedAt: new Date(), error })
      .where(eq(scheduledJobs.id, jobRow.id));
    console.error(`[WeeklyReview] Failed for ${userId}:`, error);
    throw err;
  }
}
