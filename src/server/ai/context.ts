import { and, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  healthProfiles,
  wellnessGoals,
  aiMemory,
  messages,
} from "@/server/db/schema";
import { getTodaySummary } from "@/server/wellness/logs";

export interface UserContext {
  profile: {
    ageRange?: string | null;
    weightValue?: string | null;
    weightUnit?: string | null;
    goalWeightValue?: string | null;
    dietPreference?: string | null;
    foodRestrictions?: string[] | null;
    activityLevel?: string | null;
    motivationStyle?: string | null;
    wakeTime?: string | null;
    sleepTime?: string | null;
  } | null;
  goals: { goalType: string; intensity: string | null }[];
  today: {
    mealsCount: number;
    totalWaterMl: number;
    totalSteps: number;
    totalActivityMin: number;
    habitsCompleted: number;
    checkedIn: boolean;
  };
  memorySummary: string | null;
  recentMessages: { direction: string; content: string }[];
}

export async function buildContext(
  userId: string,
  conversationId: string
): Promise<UserContext> {
  const [profileRows, goalRows, memoryRows, messageRows, todaySummary] =
    await Promise.all([
      db
        .select()
        .from(healthProfiles)
        .where(eq(healthProfiles.userId, userId))
        .limit(1),
      db
        .select({ goalType: wellnessGoals.goalType, intensity: wellnessGoals.intensity })
        .from(wellnessGoals)
        .where(and(eq(wellnessGoals.userId, userId), eq(wellnessGoals.status, "active"))),
      db
        .select({ summaryText: aiMemory.summaryText })
        .from(aiMemory)
        .where(
          and(
            eq(aiMemory.userId, userId),
            eq(aiMemory.memoryType, "summary")
          )
        )
        .orderBy(desc(aiMemory.updatedAt))
        .limit(1),
      db
        .select({ direction: messages.direction, content: messages.content })
        .from(messages)
        .where(eq(messages.conversationId, conversationId))
        .orderBy(desc(messages.createdAt))
        .limit(8),
      getTodaySummary(userId),
    ]);

  const profile = profileRows[0] ?? null;
  const memorySummary = memoryRows[0]?.summaryText ?? null;

  return {
    profile: profile
      ? {
          ageRange: profile.ageRange,
          weightValue: profile.weightValue,
          weightUnit: profile.weightUnit,
          goalWeightValue: profile.goalWeightValue,
          dietPreference: profile.dietPreference,
          foodRestrictions: profile.foodRestrictions,
          activityLevel: profile.activityLevel,
          motivationStyle: profile.motivationStyle,
          wakeTime: String(profile.wakeTime ?? "").slice(0, 5) || null,
          sleepTime: String(profile.sleepTime ?? "").slice(0, 5) || null,
        }
      : null,
    goals: goalRows,
    today: {
      mealsCount: todaySummary.meals.length,
      totalWaterMl: todaySummary.totalWaterMl,
      totalSteps: todaySummary.totalSteps,
      totalActivityMin: todaySummary.totalActivityMin,
      habitsCompleted: todaySummary.habitsCompleted,
      checkedIn: !!todaySummary.checkin?.completed,
    },
    memorySummary,
    recentMessages: messageRows.reverse().map((m) => ({
      direction: m.direction,
      content: m.content,
    })),
  };
}

export function formatContextForPrompt(ctx: UserContext): string {
  const lines: string[] = [];

  if (ctx.profile) {
    const p = ctx.profile;
    lines.push("USER PROFILE:");
    if (p.dietPreference) lines.push(`- Diet: ${p.dietPreference}`);
    if (p.activityLevel) lines.push(`- Activity level: ${p.activityLevel}`);
    if (p.motivationStyle) lines.push(`- Prefers: ${p.motivationStyle}`);
    if (p.weightValue) lines.push(`- Weight: ${p.weightValue}${p.weightUnit}`);
    if (p.wakeTime) lines.push(`- Wake: ${p.wakeTime}, Bed: ${p.sleepTime}`);
  }

  if (ctx.goals.length > 0) {
    lines.push(`\nACTIVE GOALS: ${ctx.goals.map((g) => g.goalType).join(", ")}`);
  }

  lines.push("\nTODAY SO FAR:");
  lines.push(`- Meals logged: ${ctx.today.mealsCount}`);
  lines.push(`- Water: ${ctx.today.totalWaterMl} ml`);
  lines.push(`- Steps: ${ctx.today.totalSteps}`);
  lines.push(`- Active minutes: ${ctx.today.totalActivityMin}`);
  lines.push(`- Habits completed: ${ctx.today.habitsCompleted}`);
  lines.push(`- Checked in: ${ctx.today.checkedIn ? "yes" : "no"}`);

  if (ctx.memorySummary) {
    lines.push(`\nCOACHING MEMORY:\n${ctx.memorySummary}`);
  }

  return lines.join("\n");
}
