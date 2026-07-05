import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export async function DELETE() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Soft-delete: mark inactive, clear PII, remove phone (breaks WhatsApp link)
  await db
    .update(users)
    .set({
      status: "inactive",
      phone: null,
      name: "Deleted User",
      email: `deleted+${session.user.id}@deleted.invalid`,
      passwordHash: "",
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ success: true });
}
