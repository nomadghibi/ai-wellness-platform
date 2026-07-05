import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getReminderQueue } from "@/server/notifications/queues";
import { runScheduler } from "@/server/notifications/scheduler";
import { processDailyPlan } from "@/server/notifications/jobs/daily-plan";
import { processWeeklyReview } from "@/server/notifications/jobs/weekly-review";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

const schema = z.object({
  job: z.enum(["scheduler", "daily-plan", "reminder", "weekly-review"]),
  userId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const { job, userId } = parsed.data;

  try {
    if (job === "scheduler") {
      await runScheduler();
      return NextResponse.json({ ok: true, message: "Scheduler tick ran" });
    }

    const uid = userId;
    const userRow = uid
      ? (await db.select({ phone: users.phone }).from(users).where(eq(users.id, uid)).limit(1))[0]
      : null;

    if (job === "daily-plan") {
      if (!uid || !userRow?.phone) return NextResponse.json({ error: "userId with phone required" }, { status: 400 });
      await processDailyPlan({ userId: uid, phone: userRow.phone });
      return NextResponse.json({ ok: true, message: "Daily plan job ran" });
    }

    if (job === "weekly-review") {
      if (!uid || !userRow?.phone) return NextResponse.json({ error: "userId with phone required" }, { status: 400 });
      await processWeeklyReview({ userId: uid, phone: userRow.phone });
      return NextResponse.json({ ok: true, message: "Weekly review job ran" });
    }

    if (job === "reminder") {
      const q = getReminderQueue();
      await q.add("reminder", { userId: uid, reminderType: "hydration", message: "", phone: "" });
      return NextResponse.json({ ok: true, message: "Reminder enqueued" });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ error: "Unknown job" }, { status: 400 });
}
