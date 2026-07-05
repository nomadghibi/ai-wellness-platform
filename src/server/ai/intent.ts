import OpenAI from "openai";
import { PROMPTS } from "./prompts";
import { logAiRun } from "./logger";

export type Intent =
  | "log_meal"
  | "log_water"
  | "log_activity"
  | "log_sleep"
  | "ask_nutrition"
  | "ask_hydration"
  | "ask_walking"
  | "ask_motivation"
  | "request_daily_plan"
  | "general_chat"
  | "medical_risk";

export interface IntentEntities {
  amount?: number | null;
  unit?: string | null;
  mealType?: "breakfast" | "lunch" | "dinner" | "snack" | null;
  activityType?: string | null;
  duration?: number | null;
  steps?: number | null;
  description?: string | null;
}

export interface IntentResult {
  intent: Intent;
  confidence: number;
  entities: IntentEntities;
}

export async function classifyIntent(
  message: string,
  userId: string
): Promise<IntentResult> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const start = Date.now();

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      max_tokens: 200,
      messages: [
        { role: "system", content: PROMPTS.intent.content },
        { role: "user", content: message },
      ],
      response_format: { type: "json_object" },
    });

    await logAiRun({
      userId,
      agentName: "intent-detection",
      model: "gpt-4o-mini",
      promptVersion: PROMPTS.intent.version,
      inputTokens: res.usage?.prompt_tokens,
      outputTokens: res.usage?.completion_tokens,
      latencyMs: Date.now() - start,
      status: "success",
    });

    const parsed = JSON.parse(res.choices[0]?.message?.content ?? "{}") as Partial<IntentResult>;

    return {
      intent: (parsed.intent as Intent) ?? "general_chat",
      confidence: parsed.confidence ?? 0.5,
      entities: parsed.entities ?? {},
    };
  } catch (err) {
    console.error("[Intent] Classification failed:", err);
    return { intent: "general_chat", confidence: 0, entities: {} };
  }
}

export function selectAgent(intent: Intent): string {
  const map: Record<Intent, string> = {
    log_meal: "nutrition-coach",
    ask_nutrition: "nutrition-coach",
    log_water: "hydration-coach",
    ask_hydration: "hydration-coach",
    log_activity: "walking-coach",
    ask_walking: "walking-coach",
    log_sleep: "sleep-coach",
    ask_motivation: "main-coach",
    request_daily_plan: "main-coach",
    general_chat: "main-coach",
    medical_risk: "main-coach",
  };
  return map[intent] ?? "main-coach";
}
