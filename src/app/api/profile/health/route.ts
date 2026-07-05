import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { healthProfileSchema } from "@/server/wellness/validation";
import { getHealthProfile, upsertHealthProfile } from "@/server/wellness/profile";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getHealthProfile(session.user.id);
  return NextResponse.json({ profile });
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

  const parsed = healthProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const profile = await upsertHealthProfile(session.user.id, parsed.data);
  return NextResponse.json({ profile }, { status: 200 });
}
