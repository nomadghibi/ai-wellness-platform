import OpenAI from "openai";
import { PROMPTS } from "./prompts";
import { logAiRun } from "./logger";

const EMERGENCY_PATTERNS = [
  /chest\s*pain/i,
  /can'?t\s*breath/i,
  /heart\s*attack/i,
  /stroke/i,
  /suicid/i,
  /self.?harm/i,
  /kill\s*my?self/i,
  /overdos/i,
  /911|ambulance|emergency\s*room|er\s*visit/i,
  /blood\s*sugar.*(very\s*)?(high|low|crash)/i,
  /diabetic\s*coma/i,
  /seizure/i,
  /faint(ing)?|pass(ed)?\s*out|unconscious/i,
];

const MEDIUM_PATTERNS = [
  /what\s*(dose|dosage|mg)/i,
  /should\s*i\s*(take|stop|change).*(medication|medicine|drug|pill)/i,
  /prescri(be|ption)/i,
  /diagnos/i,
  /do\s*i\s*have\s*(diabetes|cancer|disorder|disease)/i,
  /eating\s*disorder|anorexia|bulimia|binge/i,
];

const SAFE_RESPONSE = {
  emergency:
    "I'm concerned about what you described. Please call emergency services or go to an emergency room immediately. I'm not able to provide medical guidance — please get help now. 🚨",
  high: "What you're describing sounds like it needs medical attention. Please contact your doctor or a healthcare professional right away. I can only help with general wellness habits. 💙",
  medium:
    "I can help with general wellness habits, but this question is outside what I can safely answer. Please consult a qualified healthcare professional for medical advice. 💙",
};

export interface SafetyResult {
  flagged: boolean;
  riskLevel: "low" | "medium" | "high" | "emergency";
  category: string | null;
  flagForAdmin: boolean;
  refusal: string | null;
}

export async function runSafetyGuard(
  message: string,
  userId: string
): Promise<SafetyResult> {
  // Tier 1: fast keyword check
  for (const pattern of EMERGENCY_PATTERNS) {
    if (pattern.test(message)) {
      await logAiRun({
        userId,
        agentName: "safety-guard-keywords",
        model: "keyword",
        promptVersion: PROMPTS.safety.version,
        status: "success",
      });
      return {
        flagged: true,
        riskLevel: "emergency",
        category: "emergency_symptoms",
        flagForAdmin: true,
        refusal: SAFE_RESPONSE.emergency,
      };
    }
  }

  for (const pattern of MEDIUM_PATTERNS) {
    if (pattern.test(message)) {
      await logAiRun({
        userId,
        agentName: "safety-guard-keywords",
        model: "keyword",
        promptVersion: PROMPTS.safety.version,
        status: "success",
      });
      return {
        flagged: true,
        riskLevel: "medium",
        category: "medical_advice_request",
        flagForAdmin: false,
        refusal: SAFE_RESPONSE.medium,
      };
    }
  }

  // Tier 2: LLM classification for ambiguous cases
  // Only run if message mentions body, health, medical terms
  const needsLlmCheck =
    /\b(pain|symptom|sick|doctor|hospital|blood|pressure|condition|disease|medication|hurt|feel\s*\w+\s*bad)\b/i.test(
      message
    );

  if (!needsLlmCheck) {
    return { flagged: false, riskLevel: "low", category: null, flagForAdmin: false, refusal: null };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const start = Date.now();

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      max_tokens: 150,
      messages: [
        { role: "system", content: PROMPTS.safety.content },
        { role: "user", content: message },
      ],
      response_format: { type: "json_object" },
    });

    await logAiRun({
      userId,
      agentName: "safety-guard",
      model: "gpt-4o-mini",
      promptVersion: PROMPTS.safety.version,
      inputTokens: res.usage?.prompt_tokens,
      outputTokens: res.usage?.completion_tokens,
      latencyMs: Date.now() - start,
      status: "success",
    });

    const parsed = JSON.parse(res.choices[0]?.message?.content ?? "{}") as {
      riskLevel?: string;
      category?: string;
      flagForAdmin?: boolean;
      safeResponse?: string | null;
    };

    const riskLevel = (parsed.riskLevel ?? "low") as SafetyResult["riskLevel"];
    const flagged = riskLevel !== "low";

    return {
      flagged,
      riskLevel,
      category: parsed.category ?? null,
      flagForAdmin: parsed.flagForAdmin ?? flagged,
      refusal: flagged
        ? (parsed.safeResponse ?? SAFE_RESPONSE[riskLevel === "medium" ? "medium" : "high"])
        : null,
    };
  } catch (err) {
    console.error("[Safety] LLM check failed — defaulting to low risk:", err);
    return { flagged: false, riskLevel: "low", category: null, flagForAdmin: false, refusal: null };
  }
}
