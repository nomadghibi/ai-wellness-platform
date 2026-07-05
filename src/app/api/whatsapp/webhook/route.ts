import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { validateSignature, extractMessages, processInboundMessage } from "@/server/whatsapp/webhook";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import type { MetaWebhookPayload } from "@/server/whatsapp/types";

// GET — Meta hub challenge verification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.info("[WhatsApp] Webhook verified");
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// POST — inbound messages
export async function POST(request: Request) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`webhook:${ip}`, 100, 60 * 1000)) return rateLimitResponse();

  const rawBody = await request.text();

  // Signature validation (skip in dev if APP_SECRET not set)
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (appSecret) {
    const signature = request.headers.get("x-hub-signature-256") ?? "";
    if (!validateSignature(rawBody, signature, appSecret)) {
      console.warn("[WhatsApp] Invalid signature — rejecting");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  let payload: MetaWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as MetaWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.object !== "whatsapp_business_account") {
    return NextResponse.json({ status: "ignored" });
  }

  const inbound = extractMessages(payload);

  // Process each message — do NOT await all before responding (Meta times out ~5s)
  // Fire and forget; errors logged internally
  for (const { message, waId } of inbound) {
    processInboundMessage(message, waId).catch((err) =>
      console.error(`[WhatsApp] Failed to process message ${message.id}:`, err)
    );
  }

  // Always return 200 immediately so Meta doesn't retry
  return NextResponse.json({ status: "ok" });
}
