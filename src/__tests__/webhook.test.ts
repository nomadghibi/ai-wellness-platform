import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { validateSignature, extractMessages } from "@/server/whatsapp/webhook";
import type { MetaWebhookPayload } from "@/server/whatsapp/types";

const META = { display_phone_number: "15550000000", phone_number_id: "123" };

describe("validateSignature", () => {
  const secret = "test_secret_123";

  function sign(body: string) {
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(body, "utf8");
    return `sha256=${hmac.digest("hex")}`;
  }

  it("accepts valid signature", () => {
    const body = JSON.stringify({ test: true });
    expect(validateSignature(body, sign(body), secret)).toBe(true);
  });

  it("rejects invalid signature", () => {
    expect(validateSignature("body", "sha256=invalid", secret)).toBe(false);
  });

  it("rejects signature without sha256= prefix", () => {
    const body = "test";
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(body, "utf8");
    expect(validateSignature(body, hmac.digest("hex"), secret)).toBe(false);
  });

  it("rejects tampered body", () => {
    const body = JSON.stringify({ amount: 100 });
    const sig = sign(body);
    expect(validateSignature(JSON.stringify({ amount: 999 }), sig, secret)).toBe(false);
  });

  it("rejects mismatched lengths (short sig)", () => {
    expect(validateSignature("body", "sha256=short", secret)).toBe(false);
  });
});

describe("extractMessages", () => {
  it("extracts text messages from payload", () => {
    const payload: MetaWebhookPayload = {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "entry1",
          changes: [
            {
              field: "messages",
              value: {
                messaging_product: "whatsapp",
                metadata: META,
                contacts: [{ profile: { name: "Alice" }, wa_id: "14155238886" }],
                messages: [
                  {
                    id: "wamid.abc123",
                    from: "14155238886",
                    timestamp: "1720000000",
                    type: "text",
                    text: { body: "Hello coach!" },
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    const result = extractMessages(payload);
    expect(result).toHaveLength(1);
    expect(result[0].waId).toBe("14155238886");
    expect(result[0].message.text?.body).toBe("Hello coach!");
  });

  it("skips non-messages changes", () => {
    const payload: MetaWebhookPayload = {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "e1",
          changes: [
            {
              field: "statuses",
              value: { messaging_product: "whatsapp", metadata: META },
            },
          ],
        },
      ],
    };
    expect(extractMessages(payload)).toHaveLength(0);
  });

  it("handles empty payload", () => {
    const payload: MetaWebhookPayload = {
      object: "whatsapp_business_account",
      entry: [],
    };
    expect(extractMessages(payload)).toHaveLength(0);
  });

  it("handles multiple messages in one payload", () => {
    const msg = (id: string, waId: string) => ({
      id,
      from: waId,
      timestamp: "1720000000",
      type: "text" as const,
      text: { body: "hi" },
    });

    const payload: MetaWebhookPayload = {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "e1",
          changes: [
            {
              field: "messages",
              value: {
                messaging_product: "whatsapp",
                metadata: META,
                messages: [msg("id1", "111"), msg("id2", "222")],
              },
            },
          ],
        },
      ],
    };

    expect(extractMessages(payload)).toHaveLength(2);
  });
});
