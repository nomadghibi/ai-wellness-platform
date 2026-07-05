import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { users, messages, conversations } from "@/server/db/schema";
import { findOrCreateConversation, sendWhatsAppMessage } from "./send";
import { orchestrate } from "@/server/ai/orchestrator";
import type { MetaInboundMessage, MetaWebhookPayload } from "./types";

export function validateSignature(
  rawBody: string,
  signature: string,
  appSecret: string
): boolean {
  if (!signature.startsWith("sha256=")) return false;
  const hmac = crypto.createHmac("sha256", appSecret);
  hmac.update(rawBody, "utf8");
  const computed = `sha256=${hmac.digest("hex")}`;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, "utf8"),
      Buffer.from(signature, "utf8")
    );
  } catch {
    return false;
  }
}

export function extractMessages(
  payload: MetaWebhookPayload
): { message: MetaInboundMessage; waId: string }[] {
  const results: { message: MetaInboundMessage; waId: string }[] = [];
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;
      const { messages: msgs, contacts } = change.value;
      if (!msgs) continue;
      for (const msg of msgs) {
        const contact = contacts?.find((c) => c.wa_id === msg.from);
        results.push({ message: msg, waId: contact?.wa_id ?? msg.from });
      }
    }
  }
  return results;
}

export async function processInboundMessage(
  message: MetaInboundMessage,
  waId: string
): Promise<void> {
  // Find registered user by phone
  const [user] = await db
    .select({ id: users.id, status: users.status })
    .from(users)
    .where(eq(users.phone, waId))
    .limit(1);

  if (!user || user.status !== "active") {
    console.info(`[WhatsApp] Unregistered phone ${waId} — ignoring`);
    return;
  }

  // Idempotency — skip already processed messages
  const [existing] = await db
    .select({ id: messages.id })
    .from(messages)
    .where(eq(messages.providerMessageId, message.id))
    .limit(1);

  if (existing) {
    console.info(`[WhatsApp] Duplicate message ${message.id} — skipping`);
    return;
  }

  // Only process text messages with AI; store all types
  const content =
    message.type === "text" ? (message.text?.body ?? "") : `[${message.type}]`;

  const messageType =
    message.type === "text"
      ? ("text" as const)
      : message.type === "image"
      ? ("image" as const)
      : message.type === "audio"
      ? ("audio" as const)
      : message.type === "document"
      ? ("document" as const)
      : ("text" as const);

  const conversationId = await findOrCreateConversation(user.id);

  const [stored] = await db
    .insert(messages)
    .values({
      conversationId,
      userId: user.id,
      channel: "whatsapp",
      direction: "inbound",
      content,
      messageType,
      providerMessageId: message.id,
      safetyFlag: false,
    })
    .returning({ id: messages.id });

  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));

  console.info(`[WhatsApp] Stored inbound from ${waId}: "${content.slice(0, 60)}"`);

  // Only run AI on text messages
  if (message.type !== "text" || !content.trim()) return;

  try {
    const reply = await orchestrate(user.id, conversationId, stored.id, content);
    await sendWhatsAppMessage(waId, reply, user.id);
    console.info(`[WhatsApp] Sent reply to ${waId}: "${reply.slice(0, 60)}"`);
  } catch (err) {
    console.error(`[WhatsApp] AI pipeline failed for ${waId}:`, err);
    await sendWhatsAppMessage(
      waId,
      "I'm having trouble responding right now. I've saved your message and will get back to you shortly. 💙",
      user.id
    );
  }
}
