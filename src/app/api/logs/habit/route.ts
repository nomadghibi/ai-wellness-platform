import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { habitLogSchema } from "@/server/wellness/validation";
import { createHabitLog, getTodayHabits } from "@/server/wellness/logs";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const habits = await getTodayHabits(session.user.id);
  return NextResponse.json({ habits });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = habitLogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const result = await createHabitLog(session.user.id, parsed.data);
  return NextResponse.json(result, { status: 201 });
}
