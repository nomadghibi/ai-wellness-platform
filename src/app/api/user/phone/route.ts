import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

const schema = z.object({
  // E.164 without leading + (WhatsApp format): digits only, 7–15 chars
  phone: z.string().regex(/^\d{7,15}$/, "Phone must be 7–15 digits, no spaces or +"),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db
    .select({ phone: users.phone })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  return NextResponse.json({ phone: user?.phone ?? null });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Check phone not already taken by another user
  const [taken] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.phone, parsed.data.phone))
    .limit(1);

  if (taken && taken.id !== session.user.id) {
    return NextResponse.json({ error: "Phone number already in use" }, { status: 409 });
  }

  const [updated] = await db
    .update(users)
    .set({ phone: parsed.data.phone, updatedAt: new Date() })
    .where(eq(users.id, session.user.id))
    .returning({ phone: users.phone });

  return NextResponse.json({ phone: updated.phone });
}
