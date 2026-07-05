import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { messages, conversations } from "@/server/db/schema";
import type { MetaSendResponse } from "./types";

const GRAPH_API = "https://graph.facebook.com/v20.0";

export async function sendWhatsAppMessage(
  toPhone: string,
  text: string,
  userId: string
): Promise<string | null> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.warn("[WhatsApp] Missing credentials — message not sent:", text.slice(0, 50));
    return null;
  }

  const res = await fetch(`${GRAPH_API}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: toPhone,
      type: "text",
      text: { body: text },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`WhatsApp API error ${res.status}: ${JSON.stringify(err)}`);
  }

  const data = (await res.json()) as MetaSendResponse;
  const providerMessageId = data.messages?.[0]?.id ?? null;

  const conversationId = await findOrCreateConversation(userId);

  await db.insert(messages).values({
    conversationId,
    userId,
    channel: "whatsapp",
    direction: "outbound",
    content: text,
    messageType: "text",
    providerMessageId,
  });

  return providerMessageId;
}

export async function findOrCreateConversation(userId: string): Promise<string> {
  const [existing] = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(
      and(
        eq(conversations.userId, userId),
        eq(conversations.channel, "whatsapp"),
        eq(conversations.status, "active")
      )
    )
    .limit(1);

  if (existing) return existing.id;

  const [created] = await db
    .insert(conversations)
    .values({ userId, channel: "whatsapp", status: "active" })
    .returning({ id: conversations.id });

  return created.id;
}
