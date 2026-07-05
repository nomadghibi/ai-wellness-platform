import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { remindersSchema } from "@/server/wellness/validation";
import { getReminders, replaceReminders } from "@/server/wellness/profile";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userReminders = await getReminders(session.user.id);
  return NextResponse.json({ reminders: userReminders });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = remindersSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const userReminders = await replaceReminders(session.user.id, parsed.data);
  return NextResponse.json({ reminders: userReminders }, { status: 200 });
}
