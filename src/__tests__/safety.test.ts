import { describe, it, expect, vi, beforeAll } from "vitest";

// Mock DB-dependent modules before importing the module under test
vi.mock("@/server/ai/logger", () => ({ logAiRun: vi.fn().mockResolvedValue(undefined) }));
vi.mock("openai", () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: { completions: { create: vi.fn() } },
  })),
}));

import { runSafetyGuard } from "@/server/ai/safety";

const USER = "test-user-id";

describe("runSafetyGuard — keyword tier (no LLM needed)", () => {
  it("flags chest pain as emergency", async () => {
    const result = await runSafetyGuard("I have chest pain", USER);
    expect(result.flagged).toBe(true);
    expect(result.riskLevel).toBe("emergency");
    expect(result.flagForAdmin).toBe(true);
    expect(result.refusal).toContain("emergency services");
  });

  it("flags suicidal ideation as emergency", async () => {
    const result = await runSafetyGuard("I want to kill myself", USER);
    expect(result.flagged).toBe(true);
    expect(result.riskLevel).toBe("emergency");
  });

  it("flags heart attack mention as emergency", async () => {
    const result = await runSafetyGuard("I think I'm having a heart attack", USER);
    expect(result.flagged).toBe(true);
    expect(result.riskLevel).toBe("emergency");
  });

  it("flags medication dosage question as medium risk", async () => {
    const result = await runSafetyGuard("Should I stop taking my medication?", USER);
    expect(result.flagged).toBe(true);
    expect(result.riskLevel).toBe("medium");
    expect(result.flagForAdmin).toBe(false);
    expect(result.refusal).toContain("healthcare professional");
  });

  it("flags eating disorder mention as medium risk", async () => {
    const result = await runSafetyGuard("I have an eating disorder and want help", USER);
    expect(result.flagged).toBe(true);
    expect(result.riskLevel).toBe("medium");
  });

  it("allows normal wellness message", async () => {
    const result = await runSafetyGuard("I drank 2 glasses of water today!", USER);
    expect(result.flagged).toBe(false);
    expect(result.riskLevel).toBe("low");
    expect(result.refusal).toBeNull();
  });

  it("allows meal log message", async () => {
    const result = await runSafetyGuard("I had salad and grilled chicken for lunch", USER);
    expect(result.flagged).toBe(false);
    expect(result.riskLevel).toBe("low");
  });
});
