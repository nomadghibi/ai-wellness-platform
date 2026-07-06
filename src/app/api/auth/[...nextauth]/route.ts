import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { handlers } from "@/auth";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const GET = handlers.GET;

export async function POST(request: NextRequest) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  // Only rate-limit credential sign-in attempts
  if (request.nextUrl.pathname.endsWith("/callback/credentials")) {
    if (!(await rateLimit(`signin:${ip}`, 10, 15 * 60 * 1000))) return rateLimitResponse();
  }
  return handlers.POST(request);
}
