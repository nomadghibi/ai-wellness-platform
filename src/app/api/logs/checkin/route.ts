import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkinSchema } from "@/server/wellness/validation";
import { upsertCheckin, getTodayCheckin } from "@/server/wellness/logs";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const checkin = await getTodayCheckin(session.user.id);
  return NextResponse.json({ checkin });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = checkinSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const result = await upsertCheckin(session.user.id, parsed.data);
  return NextResponse.json(result, { status: 201 });
}
