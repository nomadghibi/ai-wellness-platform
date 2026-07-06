import { getRedisClient } from "./redis";

// ─── In-memory fallback (dev / no Redis) ─────────────────────────────────────

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

let lastCleanup = Date.now();
function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt + 3_600_000) store.delete(key);
  }
}

function rateLimitMemory(key: string, limit: number, windowMs: number): boolean {
  maybeCleanup();
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

// ─── Redis-backed (production) ────────────────────────────────────────────────

async function rateLimitRedis(
  key: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const redis = getRedisClient()!;
  const redisKey = `rl:${key}`;
  const count = await redis.incr(redisKey);
  if (count === 1) {
    await redis.pexpire(redisKey, windowMs);
  }
  return count <= limit;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) return rateLimitMemory(key, limit, windowMs);
  try {
    return await rateLimitRedis(key, limit, windowMs);
  } catch {
    // Redis unavailable — degrade gracefully to in-memory
    return rateLimitMemory(key, limit, windowMs);
  }
}

export function rateLimitResponse() {
  return new Response(JSON.stringify({ error: "Too many requests" }), {
    status: 429,
    headers: { "Content-Type": "application/json", "Retry-After": "60" },
  });
}
