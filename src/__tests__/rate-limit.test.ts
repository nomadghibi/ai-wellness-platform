import { describe, it, expect, beforeEach, vi } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("allows requests within limit", () => {
    const key = `test:${Math.random()}`;
    expect(rateLimit(key, 3, 60_000)).toBe(true);
    expect(rateLimit(key, 3, 60_000)).toBe(true);
    expect(rateLimit(key, 3, 60_000)).toBe(true);
  });

  it("blocks when limit exceeded", () => {
    const key = `test:${Math.random()}`;
    rateLimit(key, 2, 60_000);
    rateLimit(key, 2, 60_000);
    expect(rateLimit(key, 2, 60_000)).toBe(false);
  });

  it("resets after window expires", () => {
    const key = `test:${Math.random()}`;
    rateLimit(key, 1, 60_000);
    expect(rateLimit(key, 1, 60_000)).toBe(false);

    vi.advanceTimersByTime(61_000);

    expect(rateLimit(key, 1, 60_000)).toBe(true);
  });

  it("tracks different keys independently", () => {
    const key1 = `test:a:${Math.random()}`;
    const key2 = `test:b:${Math.random()}`;
    rateLimit(key1, 1, 60_000);
    expect(rateLimit(key1, 1, 60_000)).toBe(false);
    expect(rateLimit(key2, 1, 60_000)).toBe(true);
  });
});
