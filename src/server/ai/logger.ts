import { db } from "@/server/db";
import { aiRuns } from "@/server/db/schema";

const GPT4O_MINI_INPUT_COST = 0.00000015; // per token
const GPT4O_MINI_OUTPUT_COST = 0.0000006;

interface LogRunParams {
  userId: string;
  conversationId?: string;
  agentName: string;
  model: string;
  promptVersion?: string;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs?: number;
  status: "success" | "error";
}

export async function logAiRun(params: LogRunParams) {
  const costEstimate =
    params.inputTokens && params.outputTokens
      ? String(
          params.inputTokens * GPT4O_MINI_INPUT_COST +
            params.outputTokens * GPT4O_MINI_OUTPUT_COST
        )
      : undefined;

  await db.insert(aiRuns).values({
    userId: params.userId,
    conversationId: params.conversationId,
    agentName: params.agentName,
    model: params.model,
    promptVersion: params.promptVersion,
    inputTokens: params.inputTokens,
    outputTokens: params.outputTokens,
    costEstimate,
    latencyMs: params.latencyMs,
    status: params.status,
  });
}
