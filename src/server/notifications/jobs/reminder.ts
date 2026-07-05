import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { scheduledJobs } from "@/server/db/schema";
import { sendWhatsAppMessage } from "@/server/whatsapp/send";

export interface ReminderJobData {
  userId: string;
  phone: string;
  reminderType: string;
  message: string;
}

const REMINDER_MESSAGES: Record<string, string> = {
  hydration: "💧 Hydration check! Have you had enough water today? Aim for 8 glasses. Your body will thank you.",
  walking: "🚶 Time to move! A quick 10-15 minute walk can boost your energy and mood. You've got this!",
  sleep: "😴 Wind-down reminder. Start your bedtime routine soon. Good sleep = better everything tomorrow.",
  weekly_review: "📊 Your weekly review is ready! Reply 'review' to see your progress summary.",
  daily_plan: "☀️ Your daily wellness plan is ready!",
};

export async function processReminder(data: ReminderJobData): Promise<void> {
  const { userId, phone, reminderType, message } = data;
  const jobStart = Date.now();

  const [jobRow] = await db
    .insert(scheduledJobs)
    .values({ jobType: `reminder_${reminderType}`, userId, status: "running", scheduledAt: new Date() })
    .returning({ id: scheduledJobs.id });

  try {
    const text = message || REMINDER_MESSAGES[reminderType] || `⏰ Wellness reminder: ${reminderType}`;
    await sendWhatsAppMessage(phone, text, userId);

    await db
      .update(scheduledJobs)
      .set({ status: "completed", executedAt: new Date() })
      .where(eq(scheduledJobs.id, jobRow.id));

    console.info(`[Reminder] Sent ${reminderType} to ${phone} in ${Date.now() - jobStart}ms`);
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    await db
      .update(scheduledJobs)
      .set({ status: "failed", executedAt: new Date(), error })
      .where(eq(scheduledJobs.id, jobRow.id));
    console.error(`[Reminder] Failed ${reminderType} for ${userId}:`, error);
    throw err;
  }
}
