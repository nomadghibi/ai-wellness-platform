import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/server/db";
import {
  achievements,
  userAchievements,
  rewardPoints,
  mealLogs,
  waterLogs,
  activityLogs,
  dailyCheckins,
  weeklyReviews,
} from "@/server/db/schema";

// ─── Points ───────────────────────────────────────────────────────────────────

export async function awardPoints(
  userId: string,
  points: number,
  reason: string,
  sourceTable?: string,
  sourceId?: string
) {
  await db.insert(rewardPoints).values({ userId, points, reason, sourceTable, sourceId });
}

export async function getTotalPoints(userId: string): Promise<number> {
  const [row] = await db
    .select({ total: sql<number>`coalesce(sum(${rewardPoints.points}), 0)` })
    .from(rewardPoints)
    .where(eq(rewardPoints.userId, userId));
  return Number(row?.total ?? 0);
}

// ─── Streaks ──────────────────────────────────────────────────────────────────

function daysAgo(n: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

/** Returns the current consecutive daily active streak (any log counts as active). */
export async function getActiveStreak(userId: string): Promise<number> {
  // Get distinct log dates across all log tables for this user
  const rows = await db.execute<{ log_date: string }>(sql`
    SELECT DISTINCT DATE(logged_at AT TIME ZONE 'UTC') AS log_date
    FROM meal_logs WHERE user_id = ${userId}
    UNION
    SELECT DISTINCT DATE(logged_at AT TIME ZONE 'UTC')
    FROM water_logs WHERE user_id = ${userId}
    UNION
    SELECT DISTINCT DATE(logged_at AT TIME ZONE 'UTC')
    FROM activity_logs WHERE user_id = ${userId}
    ORDER BY log_date DESC
  `);

  if (rows.rows.length === 0) return 0;

  let streak = 0;
  const today = startOfDay(new Date());
  const expected = new Date(today);

  for (const row of rows.rows) {
    const d = startOfDay(new Date(row.log_date));
    if (d.getTime() === expected.getTime()) {
      streak++;
      expected.setDate(expected.getDate() - 1);
    } else if (d.getTime() < expected.getTime()) {
      break;
    }
  }

  return streak;
}

/** Returns the current consecutive daily water log streak. */
async function getWaterStreak(userId: string): Promise<number> {
  const rows = await db.execute<{ log_date: string }>(sql`
    SELECT DISTINCT DATE(logged_at AT TIME ZONE 'UTC') AS log_date
    FROM water_logs WHERE user_id = ${userId}
    ORDER BY log_date DESC
  `);

  if (rows.rows.length === 0) return 0;

  let streak = 0;
  const today = startOfDay(new Date());
  const expected = new Date(today);

  for (const row of rows.rows) {
    const d = startOfDay(new Date(row.log_date));
    if (d.getTime() === expected.getTime()) {
      streak++;
      expected.setDate(expected.getDate() - 1);
    } else if (d.getTime() < expected.getTime()) {
      break;
    }
  }

  return streak;
}

/** Total distinct active days ever. */
async function getTotalActiveDays(userId: string): Promise<number> {
  const row = await db.execute<{ cnt: string }>(sql`
    SELECT COUNT(DISTINCT log_date) AS cnt FROM (
      SELECT DATE(logged_at AT TIME ZONE 'UTC') AS log_date FROM meal_logs WHERE user_id = ${userId}
      UNION
      SELECT DATE(logged_at AT TIME ZONE 'UTC') FROM water_logs WHERE user_id = ${userId}
      UNION
      SELECT DATE(logged_at AT TIME ZONE 'UTC') FROM activity_logs WHERE user_id = ${userId}
    ) t
  `);
  return Number(row.rows[0]?.cnt ?? 0);
}

// ─── Achievement engine ───────────────────────────────────────────────────────

async function hasAchievement(userId: string, code: string): Promise<boolean> {
  const [row] = await db
    .select({ id: userAchievements.id })
    .from(userAchievements)
    .innerJoin(achievements, eq(achievements.id, userAchievements.achievementId))
    .where(and(eq(userAchievements.userId, userId), eq(achievements.code, code)))
    .limit(1);
  return !!row;
}

async function grantAchievement(
  userId: string,
  code: string,
  bonusPoints: number
): Promise<{ granted: boolean; achievement?: typeof achievements.$inferSelect }> {
  if (await hasAchievement(userId, code)) return { granted: false };

  const [achievement] = await db
    .select()
    .from(achievements)
    .where(and(eq(achievements.code, code), eq(achievements.active, true)))
    .limit(1);

  if (!achievement) return { granted: false };

  await db.insert(userAchievements).values({
    userId,
    achievementId: achievement.id,
  });

  await awardPoints(userId, bonusPoints, `Achievement: ${achievement.name}`);
  return { granted: true, achievement };
}

export interface AchievementResult {
  granted: boolean;
  code: string;
  name: string;
  icon: string;
}

/** Run after a meal is logged. */
export async function checkMealAchievements(userId: string): Promise<AchievementResult[]> {
  const results: AchievementResult[] = [];

  const r = await grantAchievement(userId, "first_meal", 20);
  if (r.granted && r.achievement) {
    results.push({ granted: true, code: "first_meal", name: r.achievement.name, icon: r.achievement.icon ?? "🥗" });
  }

  await checkSharedAchievements(userId, results);
  return results;
}

/** Run after a water log. */
export async function checkWaterAchievements(userId: string): Promise<AchievementResult[]> {
  const results: AchievementResult[] = [];

  const r = await grantAchievement(userId, "first_water", 20);
  if (r.granted && r.achievement) {
    results.push({ granted: true, code: "first_water", name: r.achievement.name, icon: r.achievement.icon ?? "💧" });
  }

  const waterStreak = await getWaterStreak(userId);
  if (waterStreak >= 3) {
    const r3 = await grantAchievement(userId, "hydration_3day", 30);
    if (r3.granted && r3.achievement) {
      results.push({ granted: true, code: "hydration_3day", name: r3.achievement.name, icon: r3.achievement.icon ?? "🌊" });
    }
  }
  if (waterStreak >= 7) {
    const r7 = await grantAchievement(userId, "hydration_7day", 50);
    if (r7.granted && r7.achievement) {
      results.push({ granted: true, code: "hydration_7day", name: r7.achievement.name, icon: r7.achievement.icon ?? "🏆" });
    }
  }

  await checkSharedAchievements(userId, results);
  return results;
}

/** Run after an activity log. */
export async function checkActivityAchievements(
  userId: string,
  activityType: string
): Promise<AchievementResult[]> {
  const results: AchievementResult[] = [];

  if (activityType === "walking") {
    const r = await grantAchievement(userId, "first_walk", 20);
    if (r.granted && r.achievement) {
      results.push({ granted: true, code: "first_walk", name: r.achievement.name, icon: r.achievement.icon ?? "🚶" });
    }
  }

  await checkSharedAchievements(userId, results);
  return results;
}

/** Run after a check-in. */
export async function checkCheckinAchievements(userId: string): Promise<AchievementResult[]> {
  const results: AchievementResult[] = [];

  const r = await grantAchievement(userId, "first_checkin", 20);
  if (r.granted && r.achievement) {
    results.push({ granted: true, code: "first_checkin", name: r.achievement.name, icon: r.achievement.icon ?? "✅" });
  }

  await checkSharedAchievements(userId, results);
  return results;
}

/** Run after weekly review is generated. */
export async function checkWeeklyReviewAchievement(userId: string): Promise<AchievementResult[]> {
  const results: AchievementResult[] = [];
  const r = await grantAchievement(userId, "weekly_review", 25);
  if (r.granted && r.achievement) {
    results.push({ granted: true, code: "weekly_review", name: r.achievement.name, icon: r.achievement.icon ?? "📝" });
  }
  return results;
}

/** Shared checks run after every log action. */
async function checkSharedAchievements(userId: string, results: AchievementResult[]) {
  const streak = await getActiveStreak(userId);

  if (streak >= 7) {
    const r = await grantAchievement(userId, "habit_7day", 50);
    if (r.granted && r.achievement) {
      results.push({ granted: true, code: "habit_7day", name: r.achievement.name, icon: r.achievement.icon ?? "🔥" });
    }
  }

  const totalDays = await getTotalActiveDays(userId);
  if (totalDays >= 30) {
    const r = await grantAchievement(userId, "consistency_builder", 100);
    if (r.granted && r.achievement) {
      results.push({ granted: true, code: "consistency_builder", name: r.achievement.name, icon: r.achievement.icon ?? "🌟" });
    }
  }
}

// ─── Dashboard data ───────────────────────────────────────────────────────────

export async function getUserAchievements(userId: string) {
  return db
    .select({
      code: achievements.code,
      name: achievements.name,
      icon: achievements.icon,
      description: achievements.description,
      awardedAt: userAchievements.awardedAt,
    })
    .from(userAchievements)
    .innerJoin(achievements, eq(achievements.id, userAchievements.achievementId))
    .where(eq(userAchievements.userId, userId))
    .orderBy(desc(userAchievements.awardedAt));
}
