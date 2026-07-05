import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { goalsSchema } from "@/server/wellness/validation";
import { getGoals, replaceGoals } from "@/server/wellness/profile";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const goals = await getGoals(session.user.id);
  return NextResponse.json({ goals });
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

  const parsed = goalsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const goals = await replaceGoals(session.user.id, parsed.data);
  return NextResponse.json({ goals }, { status: 200 });
}
