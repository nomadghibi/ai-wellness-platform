import { Queue } from "bullmq";

function redisConnection() {
  const url = new URL(process.env.REDIS_URL ?? "redis://localhost:6379");
  return {
    host: url.hostname,
    port: parseInt(url.port || "6379", 10),
    password: url.password || undefined,
    maxRetriesPerRequest: null as null,
    enableReadyCheck: false,
    lazyConnect: false,
  };
}

export const QUEUE_NAMES = {
  SCHEDULER: "scheduler",
  DAILY_PLAN: "daily-plan",
  REMINDER: "reminder",
  WEEKLY_REVIEW: "weekly-review",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export function getRedisConnection() {
  return redisConnection();
}

let _schedulerQueue: Queue | null = null;
let _dailyPlanQueue: Queue | null = null;
let _reminderQueue: Queue | null = null;
let _weeklyReviewQueue: Queue | null = null;

export function getSchedulerQueue() {
  return (_schedulerQueue ??= new Queue(QUEUE_NAMES.SCHEDULER, { connection: redisConnection() }));
}
export function getDailyPlanQueue() {
  return (_dailyPlanQueue ??= new Queue(QUEUE_NAMES.DAILY_PLAN, { connection: redisConnection() }));
}
export function getReminderQueue() {
  return (_reminderQueue ??= new Queue(QUEUE_NAMES.REMINDER, { connection: redisConnection() }));
}
export function getWeeklyReviewQueue() {
  return (_weeklyReviewQueue ??= new Queue(QUEUE_NAMES.WEEKLY_REVIEW, { connection: redisConnection() }));
}
