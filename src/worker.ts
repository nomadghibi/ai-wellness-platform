/**
 * Standalone worker process.
 * Run with: npm run worker
 * Env loaded via tsx --env-file=.env.local before module evaluation.
 */
import { startWorkers, setupSchedulerRepeat } from "./server/notifications/worker";

async function main() {
  console.info("[Worker] Starting AI Wellness Platform worker...");
  await setupSchedulerRepeat();
  startWorkers();
  console.info("[Worker] Ready — press Ctrl+C to stop");
}

main().catch((err) => {
  console.error("[Worker] Fatal error:", err);
  process.exit(1);
});
