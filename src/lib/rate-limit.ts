type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

// Cleanup entries older than 1 hour to prevent unbounded growth
let lastCleanup = Date.now();
function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt + 3_600_000) store.delete(key);
  }
}

/**
 * Returns true if the request is allowed, false if rate limited.
 * Uses a fixed window counter per key.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
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

export function rateLimitResponse() {
  return new Response(JSON.stringify({ error: "Too many requests" }), {
    status: 429,
    headers: { "Content-Type": "application/json", "Retry-After": "60" },
  });
}
