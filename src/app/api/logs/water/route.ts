import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { waterLogSchema } from "@/server/wellness/validation";
import { createWaterLog, getTodayWater } from "@/server/wellness/logs";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const water = await getTodayWater(session.user.id);
  return NextResponse.json({ water });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = waterLogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const log = await createWaterLog(session.user.id, parsed.data);
  return NextResponse.json({ log }, { status: 201 });
}
