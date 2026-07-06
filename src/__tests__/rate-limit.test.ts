import { describe, it, expect, beforeEach, vi } from "vitest";

// No REDIS_URL → falls through to in-memory implementation
vi.mock("@/lib/redis", () => ({ getRedisClient: () => null }));

import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("allows requests within limit", async () => {
    const key = `test:${Math.random()}`;
    expect(await rateLimit(key, 3, 60_000)).toBe(true);
    expect(await rateLimit(key, 3, 60_000)).toBe(true);
    expect(await rateLimit(key, 3, 60_000)).toBe(true);
  });

  it("blocks when limit exceeded", async () => {
    const key = `test:${Math.random()}`;
    await rateLimit(key, 2, 60_000);
    await rateLimit(key, 2, 60_000);
    expect(await rateLimit(key, 2, 60_000)).toBe(false);
  });

  it("resets after window expires", async () => {
    const key = `test:${Math.random()}`;
    await rateLimit(key, 1, 60_000);
    expect(await rateLimit(key, 1, 60_000)).toBe(false);

    vi.advanceTimersByTime(61_000);

    expect(await rateLimit(key, 1, 60_000)).toBe(true);
  });

  it("tracks different keys independently", async () => {
    const key1 = `test:a:${Math.random()}`;
    const key2 = `test:b:${Math.random()}`;
    await rateLimit(key1, 1, 60_000);
    expect(await rateLimit(key1, 1, 60_000)).toBe(false);
    expect(await rateLimit(key2, 1, 60_000)).toBe(true);
  });
});
