import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { users, reminders } from "@/server/db/schema";
import { getDailyPlanQueue, getReminderQueue, getWeeklyReviewQueue } from "./queues";

/**
 * Returns the current HH:MM in a given IANA timezone.
 */
function nowInTimezone(tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .format(new Date())
      .replace(/^24/, "00");
  } catch {
    return new Date().toTimeString().slice(0, 5);
  }
}

/**
 * Returns true if HH:MM strings are within `windowMin` minutes of each other.
 */
function withinWindow(scheduled: string, current: string, windowMin = 4): boolean {
  const toMins = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return (h ?? 0) * 60 + (m ?? 0);
  };
  const diff = Math.abs(toMins(scheduled) - toMins(current));
  // Handle midnight wrap (e.g. 23:58 vs 00:02)
  return Math.min(diff, 1440 - diff) <= windowMin;
}

export async function runScheduler(): Promise<void> {
  console.info("[Scheduler] Running scheduler tick");

  const allReminders = await db
    .select({
      userId: reminders.userId,
      reminderType: reminders.reminderType,
      scheduleTime: reminders.scheduleTime,
      timezone: reminders.timezone,
      channel: reminders.channel,
      phone: users.phone,
    })
    .from(reminders)
    .innerJoin(users, eq(reminders.userId, users.id))
    .where(eq(reminders.enabled, true));

  const dailyPlanQueue = getDailyPlanQueue();
  const reminderQueue = getReminderQueue();
  const weeklyReviewQueue = getWeeklyReviewQueue();
  const isSunday = new Date().getUTCDay() === 0;
  let enqueued = 0;

  for (const reminder of allReminders) {
    if (!reminder.phone) continue;

    const scheduledHHMM = String(reminder.scheduleTime).slice(0, 5);
    const currentHHMM = nowInTimezone(reminder.timezone ?? "UTC");

    if (!withinWindow(scheduledHHMM, currentHHMM)) continue;

    const jobId = `${reminder.reminderType}_${reminder.userId}_${new Date().toISOString().slice(0, 13)}`;
    const opts = { jobId, attempts: 3, backoff: { type: "exponential" as const, delay: 10000 } };

    if (reminder.reminderType === "daily_plan") {
      await dailyPlanQueue.add("daily-plan", { userId: reminder.userId, phone: reminder.phone }, opts);
    } else if (reminder.reminderType === "weekly_review") {
      // Only run on Sundays
      if (!isSunday) continue;
      await weeklyReviewQueue.add("weekly-review", { userId: reminder.userId, phone: reminder.phone }, opts);
    } else {
      await reminderQueue.add(
        "reminder",
        { userId: reminder.userId, phone: reminder.phone, reminderType: reminder.reminderType, message: "" },
        opts
      );
    }

    enqueued++;
    console.info(`[Scheduler] Enqueued ${reminder.reminderType} for user ${reminder.userId}`);
  }

  console.info(`[Scheduler] Tick complete — ${enqueued} jobs enqueued`);
}
