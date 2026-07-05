import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  healthProfiles,
  wellnessGoals,
  reminders,
} from "@/server/db/schema";
import { getTodaySummary } from "./logs";
import { getTotalPoints, getActiveStreak, getUserAchievements } from "./rewards";
import type { HealthProfileInput, GoalsInput, RemindersInput } from "./validation";

function toStr(n: number | undefined): string | undefined {
  return n !== undefined ? String(n) : undefined;
}

export async function getHealthProfile(userId: string) {
  const [profile] = await db
    .select()
    .from(healthProfiles)
    .where(eq(healthProfiles.userId, userId))
    .limit(1);
  return profile ?? null;
}

export async function upsertHealthProfile(
  userId: string,
  data: HealthProfileInput
) {
  const values = {
    ...data,
    heightValue: toStr(data.heightValue),
    weightValue: toStr(data.weightValue),
    goalWeightValue: toStr(data.goalWeightValue),
  };

  const existing = await getHealthProfile(userId);

  if (existing) {
    const [updated] = await db
      .update(healthProfiles)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(healthProfiles.userId, userId))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(healthProfiles)
    .values({ userId, ...values })
    .returning();
  return created;
}

export async function getGoals(userId: string) {
  return db
    .select()
    .from(wellnessGoals)
    .where(eq(wellnessGoals.userId, userId));
}

export async function replaceGoals(userId: string, data: GoalsInput) {
  await db.delete(wellnessGoals).where(eq(wellnessGoals.userId, userId));

  if (data.goals.length === 0) return [];

  return db
    .insert(wellnessGoals)
    .values(
      data.goals.map((g) => ({
        userId,
        ...g,
        targetValue: toStr(g.targetValue),
      }))
    )
    .returning();
}

export async function getReminders(userId: string) {
  return db
    .select()
    .from(reminders)
    .where(eq(reminders.userId, userId));
}

export async function replaceReminders(userId: string, data: RemindersInput) {
  await db.delete(reminders).where(eq(reminders.userId, userId));

  if (data.reminders.length === 0) return [];

  return db
    .insert(reminders)
    .values(data.reminders.map((r) => ({ userId, ...r })))
    .returning();
}

export async function getDashboardSummary(userId: string) {
  const [profile, goals, userReminders, totalPoints, streak, earnedAchievements, todaySummary] =
    await Promise.all([
      getHealthProfile(userId),
      getGoals(userId),
      getReminders(userId),
      getTotalPoints(userId),
      getActiveStreak(userId),
      getUserAchievements(userId),
      getTodaySummary(userId),
    ]);

  return {
    profile,
    goals,
    reminders: userReminders,
    totalPoints,
    streak,
    achievements: earnedAchievements,
    today: todaySummary,
    checkedInToday: !!todaySummary.checkin?.completed,
  };
}
