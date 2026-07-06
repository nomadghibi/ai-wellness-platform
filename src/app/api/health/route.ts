import { db } from "@/server/db";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return Response.json({ status: "ok", db: "ok", ts: Date.now() });
  } catch (err) {
    console.error("[Health] DB check failed:", err);
    return Response.json({ status: "degraded", db: "error", ts: Date.now() }, { status: 503 });
  }
}
