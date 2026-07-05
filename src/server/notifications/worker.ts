import { Worker } from "bullmq";
import { getRedisConnection, QUEUE_NAMES } from "./queues";
import { runScheduler } from "./scheduler";
import { processDailyPlan, type DailyPlanJobData } from "./jobs/daily-plan";
import { processReminder, type ReminderJobData } from "./jobs/reminder";
import { processWeeklyReview, type WeeklyReviewJobData } from "./jobs/weekly-review";

export function startWorkers(): void {
  const conn = getRedisConnection();

  const schedulerWorker = new Worker(
    QUEUE_NAMES.SCHEDULER,
    async (job) => {
      if (job.name === "tick") await runScheduler();
    },
    { connection: conn, concurrency: 1 }
  );

  const dailyPlanWorker = new Worker(
    QUEUE_NAMES.DAILY_PLAN,
    async (job) => {
      await processDailyPlan(job.data as DailyPlanJobData);
    },
    { connection: conn, concurrency: 3 }
  );

  const reminderWorker = new Worker(
    QUEUE_NAMES.REMINDER,
    async (job) => {
      await processReminder(job.data as ReminderJobData);
    },
    { connection: conn, concurrency: 5 }
  );

  const weeklyReviewWorker = new Worker(
    QUEUE_NAMES.WEEKLY_REVIEW,
    async (job) => {
      await processWeeklyReview(job.data as WeeklyReviewJobData);
    },
    { connection: conn, concurrency: 2 }
  );

  for (const worker of [schedulerWorker, dailyPlanWorker, reminderWorker, weeklyReviewWorker]) {
    worker.on("completed", (job) =>
      console.info(`[Worker] ${job.queueName}/${job.name} completed`)
    );
    worker.on("failed", (job, err) =>
      console.error(`[Worker] ${job?.queueName}/${job?.name} failed:`, err.message)
    );
    worker.on("error", (err) =>
      console.error(`[Worker] connection error:`, err.message)
    );
  }

  console.info("[Worker] All workers started");

  process.on("SIGTERM", async () => {
    await Promise.all([schedulerWorker.close(), dailyPlanWorker.close(), reminderWorker.close(), weeklyReviewWorker.close()]);
    process.exit(0);
  });
}

export async function setupSchedulerRepeat(): Promise<void> {
  const { getSchedulerQueue } = await import("./queues");
  const queue = getSchedulerQueue();
  await queue.upsertJobScheduler("tick", { every: 5 * 60 * 1000 }, { name: "tick", data: {} });
  console.info("[Worker] Scheduler repeatable job set (every 5 min)");
}
