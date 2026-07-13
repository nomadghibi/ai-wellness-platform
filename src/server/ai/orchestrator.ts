import OpenAI from "openai";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { messages } from "@/server/db/schema";
import { PROMPTS } from "./prompts";
import { runSafetyGuard } from "./safety";
import { classifyIntent, selectAgent } from "./intent";
import { buildContext, formatContextForPrompt } from "./context";
import { executeActions, type Action } from "./actions";
import { logAiRun } from "./logger";

const FALLBACK_REPLY =
  "I'm having trouble responding right now. I've saved your message and will try again shortly. 💙";

const QUOTA_REPLY =
  "Your wellness coach is temporarily unavailable due to high demand. Please try again in a few hours. Your message has been saved. 💙";

interface AgentResult {
  reply: string;
  actions: Action[];
}

async function runMainAgent(
  userMessage: string,
  contextText: string,
  conversationHistory: { direction: string; content: string }[],
  userId: string,
  conversationId: string,
  agentName: string
): Promise<{ result: AgentResult; inputTokens?: number; outputTokens?: number; latencyMs: number }> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const start = Date.now();

  const chatHistory = conversationHistory.slice(-6).map((m) => ({
    role: m.direction === "inbound" ? ("user" as const) : ("assistant" as const),
    content: m.content,
  }));

  const systemContent = `${PROMPTS.mainCoach.content}\n\n${contextText}`;

  let res: Awaited<ReturnType<typeof openai.chat.completions.create>>;
  try {
    res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 400,
      messages: [
        { role: "system", content: systemContent },
        ...chatHistory,
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
    });
  } catch (err) {
    await logAiRun({ userId, conversationId, agentName, model: "gpt-4o-mini", status: "error" });
    throw err; // re-throw so orchestrate()'s catch handles quota vs generic
  }

  const latencyMs = Date.now() - start;
  const raw = res.choices[0]?.message?.content ?? "{}";

  let parsed: AgentResult;
  try {
    parsed = JSON.parse(raw) as AgentResult;
    if (typeof parsed.reply !== "string") throw new Error("No reply field");
    if (!Array.isArray(parsed.actions)) parsed.actions = [];
  } catch {
    console.error("[Orchestrator] Failed to parse agent response:", raw.slice(0, 200));
    parsed = { reply: FALLBACK_REPLY, actions: [] };
  }

  await logAiRun({
    userId,
    conversationId,
    agentName,
    model: "gpt-4o-mini",
    promptVersion: PROMPTS.mainCoach.version,
    inputTokens: res.usage?.prompt_tokens,
    outputTokens: res.usage?.completion_tokens,
    latencyMs,
    status: "success",
  });

  return {
    result: parsed,
    inputTokens: res.usage?.prompt_tokens,
    outputTokens: res.usage?.completion_tokens,
    latencyMs,
  };
}

export async function orchestrate(
  userId: string,
  conversationId: string,
  messageId: string,
  content: string
): Promise<string> {
  try {
    // 1. Safety guard always runs (keyword tier has no API dependency)
    const safety = await runSafetyGuard(content, userId);
    if (safety.flagged) {
      if (safety.flagForAdmin) {
        await db
          .update(messages)
          .set({ safetyFlag: true })
          .where(eq(messages.id, messageId));
      }
      return safety.refusal!;
    }

    // 2. Short-circuit if no API key (after safety check)
    if (!process.env.OPENAI_API_KEY) {
      console.warn("[Orchestrator] OPENAI_API_KEY not set — returning placeholder");
      return "Your AI coach is almost ready! Once configured, I'll respond here on WhatsApp. 🌱";
    }

    // 3. Classify intent
    const { intent, entities } = await classifyIntent(content, userId);

    // If AI itself flags medical risk, use safety refusal
    if (intent === "medical_risk") {
      return "I can help with general wellness habits, but for medical concerns please consult a healthcare professional. 💙";
    }

    // 4. Build context
    const context = await buildContext(userId, conversationId);
    const contextText = formatContextForPrompt(context);

    // 5. Select agent
    const agentName = selectAgent(intent);

    // 6. Augment user message with parsed entities for better AI understanding
    const enrichedMessage =
      Object.keys(entities).filter((k) => entities[k as keyof typeof entities] != null).length > 0
        ? `${content}\n[Detected: ${JSON.stringify(entities)}]`
        : content;

    // 7. Run agent
    const { result } = await runMainAgent(
      enrichedMessage,
      contextText,
      context.recentMessages,
      userId,
      conversationId,
      agentName
    );

    // 8. Execute actions (log entries)
    if (result.actions.length > 0) {
      await executeActions(userId, result.actions);
    }

    return result.reply;
  } catch (err) {
    const isQuota =
      typeof err === "object" &&
      err !== null &&
      "status" in err &&
      (err as { status: number }).status === 429 &&
      "code" in err &&
      (err as { code: string }).code === "insufficient_quota";

    console.error("[Orchestrator] Error:", isQuota ? "OpenAI quota exceeded" : err);
    await logAiRun({
      userId,
      conversationId,
      agentName: "orchestrator",
      model: "gpt-4o-mini",
      status: "error",
    });
    return isQuota ? QUOTA_REPLY : FALLBACK_REPLY;
  }
}
