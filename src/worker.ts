/**
 * Standalone worker process — runs outside the Next.js request lifecycle.
 *
 * Local dev:    npm run worker          (loads .env.local)
 * Local watch:  npm run dev:worker      (reloads on file change)
 * Production:   npm run worker:prod     (reads env from environment)
 */
import http from "http";
import { startWorkers, closeWorkers, setupSchedulerRepeat } from "./server/notifications/worker";

const WORKER_HEALTH_PORT = parseInt(process.env.WORKER_HEALTH_PORT ?? "3001", 10);
const SHUTDOWN_TIMEOUT_MS = 30_000;

// ─── Health check server ───────────────────────────────────────────────────────

const startedAt = Date.now();

const healthServer = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        uptime: Math.floor((Date.now() - startedAt) / 1000),
        pid: process.pid,
      })
    );
  } else {
    res.writeHead(404);
    res.end();
  }
});

// ─── Graceful shutdown ─────────────────────────────────────────────────────────

let shuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  console.info(`[Worker] ${signal} received — shutting down gracefully (max ${SHUTDOWN_TIMEOUT_MS / 1000}s)`);

  healthServer.close();

  try {
    await closeWorkers(SHUTDOWN_TIMEOUT_MS);
    console.info("[Worker] All workers closed cleanly");
  } catch (err) {
    console.error("[Worker] Shutdown timeout — forcing exit:", (err as Error).message);
  }

  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

// ─── Unhandled errors — log and exit so the process manager restarts ──────────

process.on("uncaughtException", (err) => {
  console.error("[Worker] Uncaught exception:", err);
  void shutdown("uncaughtException").finally(() => process.exit(1));
});

process.on("unhandledRejection", (reason) => {
  console.error("[Worker] Unhandled rejection:", reason);
  // Log but don't crash — BullMQ job failures surface here during development
});

// ─── Startup ──────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const required = ["DATABASE_URL", "REDIS_URL"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`[Worker] Missing required env vars: ${missing.join(", ")}`);
    process.exit(1);
  }

  console.info("[Worker] Starting AI Wellness Platform worker");
  console.info(`[Worker] Node ${process.version} | PID ${process.pid}`);

  healthServer.listen(WORKER_HEALTH_PORT, () => {
    console.info(`[Worker] Health check → http://localhost:${WORKER_HEALTH_PORT}/health`);
  });

  await setupSchedulerRepeat();
  startWorkers();

  console.info("[Worker] Ready — scheduler ticks every 5 min");
}

main().catch((err) => {
  console.error("[Worker] Fatal startup error:", err);
  process.exit(1);
});
