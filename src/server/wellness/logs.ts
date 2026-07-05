import { and, between, eq, gte, lte } from "drizzle-orm";
import { db } from "@/server/db";
import {
  mealLogs,
  waterLogs,
  activityLogs,
  sleepLogs,
  habitLogs,
  dailyCheckins,
  rewardPoints,
} from "@/server/db/schema";
import type {
  MealLogInput,
  WaterLogInput,
  ActivityLogInput,
  SleepLogInput,
  HabitLogInput,
  CheckinInput,
} from "./validation";

function todayStart(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

async function award(
  userId: string,
  points: number,
  reason: string,
  sourceTable: string,
  sourceId: string
) {
  await db.insert(rewardPoints).values({
    userId,
    points,
    reason,
    sourceTable,
    sourceId,
  });
}

// ─── Meal ─────────────────────────────────────────────────────────────────────

export async function createMealLog(userId: string, data: MealLogInput) {
  const [log] = await db
    .insert(mealLogs)
    .values({
      userId,
      mealType: data.mealType,
      description: data.description,
      loggedAt: data.loggedAt ? new Date(data.loggedAt) : new Date(),
    })
    .returning();
  await award(userId, 5, "Meal logged", "meal_logs", log.id);
  return log;
}

export async function getTodayMeals(userId: string) {
  return db
    .select()
    .from(mealLogs)
    .where(and(eq(mealLogs.userId, userId), gte(mealLogs.loggedAt, todayStart())));
}

// ─── Water ────────────────────────────────────────────────────────────────────

export async function createWaterLog(userId: string, data: WaterLogInput) {
  const [log] = await db
    .insert(waterLogs)
    .values({
      userId,
      amount: String(data.amount),
      unit: data.unit,
      loggedAt: data.loggedAt ? new Date(data.loggedAt) : new Date(),
    })
    .returning();
  await award(userId, 2, "Water logged", "water_logs", log.id);
  return log;
}

export async function getTodayWater(userId: string) {
  return db
    .select()
    .from(waterLogs)
    .where(and(eq(waterLogs.userId, userId), gte(waterLogs.loggedAt, todayStart())));
}

// ─── Activity ─────────────────────────────────────────────────────────────────

export async function createActivityLog(userId: string, data: ActivityLogInput) {
  const [log] = await db
    .insert(activityLogs)
    .values({
      userId,
      activityType: data.activityType,
      durationMinutes: data.durationMinutes,
      steps: data.steps,
      intensity: data.intensity,
      notes: data.notes,
      loggedAt: data.loggedAt ? new Date(data.loggedAt) : new Date(),
    })
    .returning();
  await award(userId, 10, "Activity logged", "activity_logs", log.id);
  return log;
}

export async function getTodayActivities(userId: string) {
  return db
    .select()
    .from(activityLogs)
    .where(
      and(eq(activityLogs.userId, userId), gte(activityLogs.loggedAt, todayStart()))
    );
}

// ─── Sleep ────────────────────────────────────────────────────────────────────

export async function createSleepLog(userId: string, data: SleepLogInput) {
  const [log] = await db
    .insert(sleepLogs)
    .values({
      userId,
      sleepDate: data.sleepDate,
      bedtime: data.bedtime ? new Date(data.bedtime) : undefined,
      wakeTime: data.wakeTime ? new Date(data.wakeTime) : undefined,
      sleepQuality: data.sleepQuality,
      notes: data.notes,
    })
    .returning();
  await award(userId, 5, "Sleep logged", "sleep_logs", log.id);
  return log;
}

export async function getRecentSleep(userId: string, limit = 7) {
  return db
    .select()
    .from(sleepLogs)
    .where(eq(sleepLogs.userId, userId))
    .limit(limit);
}

// ─── Habit ────────────────────────────────────────────────────────────────────

export async function createHabitLog(userId: string, data: HabitLogInput) {
  const existing = await db
    .select({ id: habitLogs.id })
    .from(habitLogs)
    .where(
      and(
        eq(habitLogs.userId, userId),
        eq(habitLogs.habitType, data.habitType),
        eq(habitLogs.logDate, data.logDate)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const [log] = await db
      .update(habitLogs)
      .set({ completed: data.completed, notes: data.notes })
      .where(eq(habitLogs.id, existing[0].id))
      .returning();
    return { log, pointsAwarded: false };
  }

  const [log] = await db
    .insert(habitLogs)
    .values({ userId, ...data })
    .returning();

  if (data.completed) {
    await award(userId, 3, `Habit completed: ${data.habitType}`, "habit_logs", log.id);
  }
  return { log, pointsAwarded: data.completed };
}

export async function getTodayHabits(userId: string) {
  const today = new Date().toISOString().slice(0, 10);
  return db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.userId, userId), eq(habitLogs.logDate, today)));
}

// ─── Daily check-in ───────────────────────────────────────────────────────────

export async function upsertCheckin(userId: string, data: CheckinInput) {
  const existing = await db
    .select({ id: dailyCheckins.id })
    .from(dailyCheckins)
    .where(
      and(
        eq(dailyCheckins.userId, userId),
        eq(dailyCheckins.checkinDate, data.checkinDate)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const [checkin] = await db
      .update(dailyCheckins)
      .set({ mood: data.mood, energyLevel: data.energyLevel, notes: data.notes, completed: data.completed, updatedAt: new Date() })
      .where(eq(dailyCheckins.id, existing[0].id))
      .returning();
    return { checkin, pointsAwarded: false };
  }

  const [checkin] = await db
    .insert(dailyCheckins)
    .values({ userId, ...data })
    .returning();

  await award(userId, 10, "Daily check-in completed", "daily_checkins", checkin.id);
  return { checkin, pointsAwarded: true };
}

export async function getTodayCheckin(userId: string) {
  const today = new Date().toISOString().slice(0, 10);
  const [checkin] = await db
    .select()
    .from(dailyCheckins)
    .where(
      and(eq(dailyCheckins.userId, userId), eq(dailyCheckins.checkinDate, today))
    )
    .limit(1);
  return checkin ?? null;
}

// ─── Today summary (for dashboard) ───────────────────────────────────────────

export async function getTodaySummary(userId: string) {
  const [meals, water, activities, habits, checkin] = await Promise.all([
    getTodayMeals(userId),
    getTodayWater(userId),
    getTodayActivities(userId),
    getTodayHabits(userId),
    getTodayCheckin(userId),
  ]);

  const totalWaterMl = water.reduce((sum, w) => {
    const amt = parseFloat(String(w.amount));
    if (w.unit === "oz") return sum + amt * 29.574;
    if (w.unit === "cups") return sum + amt * 236.588;
    return sum + amt;
  }, 0);

  const totalSteps = activities.reduce((sum, a) => sum + (a.steps ?? 0), 0);
  const totalActivityMin = activities.reduce(
    (sum, a) => sum + (a.durationMinutes ?? 0),
    0
  );

  return {
    meals,
    water,
    activities,
    habits,
    checkin,
    totalWaterMl: Math.round(totalWaterMl),
    totalSteps,
    totalActivityMin,
    habitsCompleted: habits.filter((h) => h.completed).length,
  };
}

// ─── Weekly aggregation ───────────────────────────────────────────────────────

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  mealCount: number;
  mealDescriptions: string[];
  totalWaterMl: number;
  daysWithWater: number;
  totalSteps: number;
  totalActivityMin: number;
  daysActive: number;
  sleepEntries: { date: string; quality: string | null; notes: string | null }[];
  habitsCompleted: number;
  habitsTotal: number;
  checkinCount: number;
  avgMood: number | null;
  avgEnergy: number | null;
}

export async function getWeeklyStats(
  userId: string,
  weekStart: string,
  weekEnd: string
): Promise<WeeklyStats> {
  const start = new Date(weekStart + "T00:00:00.000Z");
  const end = new Date(weekEnd + "T23:59:59.999Z");

  const [meals, water, activities, sleepRows, habits, checkins] = await Promise.all([
    db.select({ description: mealLogs.description }).from(mealLogs)
      .where(and(eq(mealLogs.userId, userId), gte(mealLogs.loggedAt, start), lte(mealLogs.loggedAt, end))),
    db.select({ amount: waterLogs.amount, unit: waterLogs.unit, loggedAt: waterLogs.loggedAt }).from(waterLogs)
      .where(and(eq(waterLogs.userId, userId), gte(waterLogs.loggedAt, start), lte(waterLogs.loggedAt, end))),
    db.select({ steps: activityLogs.steps, durationMinutes: activityLogs.durationMinutes, loggedAt: activityLogs.loggedAt }).from(activityLogs)
      .where(and(eq(activityLogs.userId, userId), gte(activityLogs.loggedAt, start), lte(activityLogs.loggedAt, end))),
    db.select({ sleepDate: sleepLogs.sleepDate, sleepQuality: sleepLogs.sleepQuality, notes: sleepLogs.notes }).from(sleepLogs)
      .where(and(eq(sleepLogs.userId, userId), gte(sleepLogs.sleepDate, weekStart), lte(sleepLogs.sleepDate, weekEnd))),
    db.select({ completed: habitLogs.completed }).from(habitLogs)
      .where(and(eq(habitLogs.userId, userId), gte(habitLogs.logDate, weekStart), lte(habitLogs.logDate, weekEnd))),
    db.select({ mood: dailyCheckins.mood, energyLevel: dailyCheckins.energyLevel }).from(dailyCheckins)
      .where(and(eq(dailyCheckins.userId, userId), gte(dailyCheckins.checkinDate, weekStart), lte(dailyCheckins.checkinDate, weekEnd))),
  ]);

  const totalWaterMl = Math.round(water.reduce((sum, w) => {
    const amt = parseFloat(String(w.amount));
    if (w.unit === "oz") return sum + amt * 29.574;
    if (w.unit === "cups") return sum + amt * 236.588;
    return sum + amt;
  }, 0));

  const daysWithWater = new Set(water.map((w) => w.loggedAt.toISOString().slice(0, 10))).size;
  const daysActive = new Set(activities.map((a) => a.loggedAt.toISOString().slice(0, 10))).size;

  const moodsWithValues = checkins.filter((c) => c.mood != null);
  const energyWithValues = checkins.filter((c) => c.energyLevel != null);
  const avgMood = moodsWithValues.length > 0
    ? Math.round(moodsWithValues.reduce((s, c) => s + (c.mood ?? 0), 0) / moodsWithValues.length * 10) / 10
    : null;
  const avgEnergy = energyWithValues.length > 0
    ? Math.round(energyWithValues.reduce((s, c) => s + (c.energyLevel ?? 0), 0) / energyWithValues.length * 10) / 10
    : null;

  return {
    weekStart,
    weekEnd,
    mealCount: meals.length,
    mealDescriptions: meals.slice(0, 10).map((m) => m.description),
    totalWaterMl,
    daysWithWater,
    totalSteps: activities.reduce((s, a) => s + (a.steps ?? 0), 0),
    totalActivityMin: activities.reduce((s, a) => s + (a.durationMinutes ?? 0), 0),
    daysActive,
    sleepEntries: sleepRows.map((s) => ({ date: s.sleepDate, quality: s.sleepQuality, notes: s.notes })),
    habitsCompleted: habits.filter((h) => h.completed).length,
    habitsTotal: habits.length,
    checkinCount: checkins.length,
    avgMood,
    avgEnergy,
  };
}
