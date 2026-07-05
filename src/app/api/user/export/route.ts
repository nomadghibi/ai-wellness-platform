import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/server/db";
import {
  users,
  healthProfiles,
  wellnessGoals,
  reminders,
  mealLogs,
  waterLogs,
  activityLogs,
  sleepLogs,
  habitLogs,
  dailyCheckins,
  messages,
  rewardPoints,
  userAchievements,
  achievements,
  weeklyReviews,
} from "@/server/db/schema";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  const [
    userRow,
    profile,
    goals,
    userReminders,
    meals,
    water,
    activities,
    sleep,
    habits,
    checkins,
    userMessages,
    points,
    earnedAchievements,
    reviews,
  ] = await Promise.all([
    db
      .select({ id: users.id, name: users.name, email: users.email, createdAt: users.createdAt })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1),
    db.select().from(healthProfiles).where(eq(healthProfiles.userId, userId)).limit(1),
    db.select().from(wellnessGoals).where(eq(wellnessGoals.userId, userId)),
    db.select().from(reminders).where(eq(reminders.userId, userId)),
    db.select().from(mealLogs).where(eq(mealLogs.userId, userId)).orderBy(desc(mealLogs.loggedAt)),
    db.select().from(waterLogs).where(eq(waterLogs.userId, userId)).orderBy(desc(waterLogs.loggedAt)),
    db.select().from(activityLogs).where(eq(activityLogs.userId, userId)).orderBy(desc(activityLogs.loggedAt)),
    db.select().from(sleepLogs).where(eq(sleepLogs.userId, userId)).orderBy(desc(sleepLogs.sleepDate)),
    db.select().from(habitLogs).where(eq(habitLogs.userId, userId)).orderBy(desc(habitLogs.logDate)),
    db.select().from(dailyCheckins).where(eq(dailyCheckins.userId, userId)).orderBy(desc(dailyCheckins.checkinDate)),
    db
      .select({ direction: messages.direction, content: messages.content, messageType: messages.messageType, createdAt: messages.createdAt })
      .from(messages)
      .where(eq(messages.userId, userId))
      .orderBy(desc(messages.createdAt)),
    db.select({ points: rewardPoints.points, reason: rewardPoints.reason, createdAt: rewardPoints.createdAt }).from(rewardPoints).where(eq(rewardPoints.userId, userId)),
    db
      .select({ code: achievements.code, name: achievements.name, icon: achievements.icon, awardedAt: userAchievements.awardedAt })
      .from(userAchievements)
      .innerJoin(achievements, eq(achievements.id, userAchievements.achievementId))
      .where(eq(userAchievements.userId, userId)),
    db
      .select({ weekStart: weeklyReviews.weekStart, weekEnd: weeklyReviews.weekEnd, reviewText: weeklyReviews.reviewText, reviewJson: weeklyReviews.reviewJson, createdAt: weeklyReviews.createdAt })
      .from(weeklyReviews)
      .where(eq(weeklyReviews.userId, userId))
      .orderBy(desc(weeklyReviews.weekStart)),
  ]);

  const totalPoints = points.reduce((s, r) => s + (r.points ?? 0), 0);

  const payload = {
    exportedAt: new Date().toISOString(),
    account: userRow[0] ?? null,
    healthProfile: profile[0] ?? null,
    goals,
    reminders: userReminders,
    logs: {
      meals,
      water,
      activities,
      sleep,
      habits,
      checkins,
    },
    messages: userMessages,
    rewards: {
      totalPoints,
      pointHistory: points,
      achievements: earnedAchievements,
    },
    weeklyReviews: reviews,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="wellness-data-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
