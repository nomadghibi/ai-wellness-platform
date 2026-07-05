# Background Worker

The AI Wellness Platform uses a standalone Node.js worker process separate from the Next.js web app. The worker handles all scheduled and async tasks via BullMQ + Redis:

| Queue | Job | Trigger |
|---|---|---|
| `scheduler` | `tick` | Every 5 minutes — checks reminders against current time |
| `daily-plan` | `daily-plan` | Scheduler enqueues when `daily_plan` reminder time matches |
| `reminder` | `reminder` | Scheduler enqueues hydration / walking / sleep reminders |
| `weekly-review` | `weekly-review` | Scheduler enqueues on Sundays when `weekly_review` reminder matches |

Each job has `attempts: 3` with exponential backoff (10s base). Failed jobs are logged to `scheduled_jobs` table.

---

## Required environment variables

Both web app and worker share the same env vars. The worker only requires:

```
DATABASE_URL        PostgreSQL connection string
REDIS_URL           Redis connection string (BullMQ)
OPENAI_API_KEY      Used by daily-plan and weekly-review jobs
WHATSAPP_ACCESS_TOKEN   Used to send WhatsApp messages
WHATSAPP_PHONE_NUMBER_ID
```

Optional:
```
WORKER_HEALTH_PORT  HTTP port for health probe (default: 3001)
```

---

## Running locally

### Terminal 1 — web app
```bash
npm run dev
```

### Terminal 2 — worker
```bash
npm run worker
# Loads .env.local automatically via tsx --env-file
```

### Auto-restart on file change (dev)
```bash
npm run dev:worker
# Uses tsx watch — restarts worker when source files change
```

### Test the health check
```bash
curl http://localhost:3001/health
# {"status":"ok","uptime":42,"pid":12345}
```

---

## Signals

| Signal | Behaviour |
|---|---|
| `SIGTERM` | Graceful shutdown — drains in-flight jobs, closes connections, exits 0 |
| `SIGINT` (Ctrl+C) | Same as SIGTERM |
| Timeout (30s) | If jobs don't drain in time, forces exit and logs timeout warning |

---

## Production deployment

The worker is a separate process from the web server. Deploy it as a second service/dyno/container pointing at the same environment variables.

### Railway

Add a second service in your Railway project:

```
Start command: npm run worker:prod
```

Set all env vars (same as web service). Railway will forward `SIGTERM` on deploy/scale-down.

### Render

Add a **Background Worker** service:

```
Build command: npm install
Start command: npm run worker:prod
```

Enable Health Check on port `$WORKER_HEALTH_PORT` at path `/health`.

### Docker (self-hosted)

```dockerfile
# Worker stage — same image as web, different CMD
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci --omit=dev
CMD ["npm", "run", "worker:prod"]
```

Run alongside your web container with the same env file:

```bash
docker run --env-file .env.production \
  -p 3001:3001 \
  your-image npm run worker:prod
```

### PM2 (VPS)

```bash
pm2 start npm --name "wellness-worker" -- run worker:prod
pm2 save
pm2 startup
```

---

## Health check

The worker exposes a lightweight HTTP server:

```
GET http://localhost:3001/health
→ 200 {"status":"ok","uptime":123,"pid":456}
```

Use this for:
- Railway / Render liveness probes
- Kubernetes `livenessProbe` / `readinessProbe`
- Uptime monitoring (e.g. Uptime Robot, Better Stack)

---

## Scaling

- One worker instance is sufficient for MVP (handles hundreds of users).
- BullMQ job IDs include `userId` + hour — duplicate scheduler ticks are idempotent.
- To scale horizontally: run multiple worker instances against the same Redis. BullMQ distributes jobs automatically.

---

## Troubleshooting

**Worker starts but no jobs run**
- Check Redis connection: `redis-cli ping`
- Check `scheduled_jobs` table for `failed` rows
- Verify users have `reminders.enabled = true` and a `phone` set

**Jobs fail with OpenAI error**
- Check `OPENAI_API_KEY` is set and valid
- Daily plan falls back to a default message if AI fails — check worker logs

**Worker won't stop cleanly**
- Default shutdown timeout is 30s. If a job exceeds that, the worker force-exits.
- Check for stuck jobs in BullMQ: `npm run db:studio` → `scheduled_jobs` table
