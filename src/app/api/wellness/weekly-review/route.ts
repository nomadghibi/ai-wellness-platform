import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/server/db";
import { weeklyReviews } from "@/server/db/schema";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [review] = await db
    .select()
    .from(weeklyReviews)
    .where(eq(weeklyReviews.userId, session.user.id))
    .orderBy(desc(weeklyReviews.weekStart))
    .limit(1);

  return NextResponse.json({ review: review ?? null });
}
