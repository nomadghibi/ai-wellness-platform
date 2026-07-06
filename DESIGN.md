# AI Wellness Platform — Design Document

## Overview

WhatsApp-first AI wellness coaching platform. Users interact via WhatsApp; the web app handles onboarding, dashboards, and settings. The platform is architected as a **multi-plugin system** — the Healthy Living Coach is plugin one.

**Primary interaction channel:** WhatsApp (Meta Cloud API)
**Secondary channel:** Web (Next.js 16, App Router)
**AI backbone:** OpenAI gpt-4o-mini

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│   WhatsApp (Meta)          Next.js Web App (Vercel)         │
└────────────┬───────────────────────────┬────────────────────┘
             │ HMAC-verified webhook      │ Next-Auth v5 JWT
             ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       API Layer (Next.js)                   │
│  /api/whatsapp/webhook   /api/logs/*   /api/profile/*       │
│  /api/auth/*             /api/user/*   /api/admin/*         │
└────────────┬───────────────────────────┬────────────────────┘
             │                           │
             ▼                           ▼
┌────────────────────────┐   ┌───────────────────────────────┐
│     AI Orchestrator    │   │         BullMQ Worker         │
│  Safety → Intent →     │   │  scheduler / daily-plan /     │
│  Agent → Actions       │   │  reminder / weekly-review     │
└────────────┬───────────┘   └───────────────┬───────────────┘
             │                               │
             ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
│         PostgreSQL (Drizzle ORM)      Redis (BullMQ)        │
└─────────────────────────────────────────────────────────────┘
```

### Process Model

Two separate processes must run in production:

| Process | Entry point | Host |
|---|---|---|
| Next.js web + API | `npm run start` | Vercel |
| BullMQ worker | `npm run worker:prod` | Render (Background Worker) |

Both read from the same PostgreSQL database and Redis instance.

---

## Data Model

### Platform core (multi-tenant capable)

```
users ──< user_organizations >── organizations
users ──< sessions
users ──< subscriptions
users ──< audit_logs
users ──< conversations ──< messages
users ──< ai_runs
users ──< ai_memory
users ──< reminders
users ──< scheduled_jobs
```

### Healthy Living plugin

```
users ──< health_profiles       (1:1, user's biometric + preference data)
users ──< wellness_goals        (N goals per user, typed)
users ──< daily_plans           (1 per user per date)
users ──< daily_checkins        (1 per user per date)
users ──< meal_logs
users ──< water_logs
users ──< activity_logs
users ──< sleep_logs
users ──< habit_logs
users ──< weekly_reviews        (1 per user per week_start)
users ──< reward_points
users ──< user_achievements >── achievements
```

### Key design decisions

- **UUIDs everywhere** — no sequential IDs leaked to clients
- **Soft delete** — user deletion anonymises PII, retains aggregate data
- `messages.providerMessageId` has a unique index — idempotency for webhook replays
- `daily_plans` and `daily_checkins` have composite unique on `(userId, date)` — one per day enforced at DB level
- `ai_runs` tracks every LLM call: model, agent, tokens, cost, latency — feeds admin cost analytics

---

## AI Pipeline

Every inbound WhatsApp message flows through a fixed pipeline:

```
Inbound message
      │
      ▼
Safety Guard ──── flagged? ──► keyword refusal (no LLM call)
      │                  └──► LLM risk tier? ──► flag message + refusal
      │ clean
      ▼
Intent Classifier (gpt-4o-mini, JSON mode)
      │
      ├── intent = medical_risk ──► hard refusal
      │
      ▼
Context Builder
  ├── health_profile
  ├── wellness_goals
  ├── last 6 messages
  ├── today's logs summary
  └── ai_memory (structured + summary)
      │
      ▼
Agent Selector
  ├── nutrition_log / nutrition_advice ──► Nutrition Coach
  ├── hydration_log / hydration_advice ──► Hydration Coach
  ├── activity_log                     ──► Walking Coach
  ├── sleep_log                        ──► Sleep Coach
  ├── habit_log                        ──► Habit Coach
  └── (all others)                     ──► Main Coach
      │
      ▼
Agent (gpt-4o-mini, JSON mode)
  returns: { reply: string, actions: Action[] }
      │
      ├── execute actions (log entries written to DB)
      └── reply sent via WhatsApp send API
```

### Safety tiers

1. **Keyword tier** (zero latency, no API) — explicit harm, crisis keywords → immediate refusal
2. **LLM tier** — intent classifier returns `medical_risk` → hard refusal, no log

### Memory

`ai_memory` table stores three types per user:
- `structured` — key/value facts (weight, dietary preference)
- `summary` — rolling conversation summary (updated periodically)
- `fact` — one-off noted facts

Context builder reads all three and injects them into every agent system prompt.

---

## Background Jobs

Worker polls Redis queues via BullMQ. Scheduler fires every 5 minutes and enqueues time-sensitive jobs.

| Queue | Trigger | Job |
|---|---|---|
| `scheduler` | every 5 min | check all users for due reminders + daily plans |
| `daily-plan` | per user, morning | generate + send AI daily plan via WhatsApp |
| `reminder` | per reminder row | send configured reminder message via WhatsApp |
| `weekly-review` | Sunday | generate + send weekly progress review |

**Reliability:**
- 3 retry attempts, exponential backoff (10s base)
- SIGTERM/SIGINT graceful shutdown — waits up to 30s for in-flight jobs
- Health check HTTP endpoint: `GET :3001/health`

---

## WhatsApp Integration

### Inbound (webhook)

```
POST /api/whatsapp/webhook
  1. HMAC-SHA256 signature verify (X-Hub-Signature-256)
  2. Idempotency check (providerMessageId unique index)
  3. Upsert conversation
  4. Persist inbound message
  5. Call orchestrate()
  6. Send reply via WhatsApp Cloud API
  7. Persist outbound message
```

### Opt-out / opt-in

- `STOP | UNSUBSCRIBE | CANCEL | QUIT` → `users.status = suspended`, phone cleared
- `START | SUBSCRIBE` → status restored to active

### Outbound

All outbound calls go through `src/server/whatsapp/send.ts` — single function wrapping the Meta Graph API.

---

## Auth

- **Next-Auth v5** with credentials provider
- **JWT sessions** (no DB session store)
- **RBAC:** `user` and `admin` roles enforced in middleware
- **Rate limits** (in-memory token bucket):
  - Register: 5 / 15 min per IP
  - Sign-in: 10 / 15 min per IP
  - Webhook: 100 / min per IP

---

## Web UI

### Route groups

```
/                          Landing page (public)
/(auth)/login              Login
/(auth)/register           Register
/(authenticated)/onboarding/disclaimer   Step 1
/(authenticated)/onboarding/profile      Step 2
/(authenticated)/onboarding/goals        Step 3
/(authenticated)/onboarding/reminders    Step 4
/(authenticated)/dashboard               Main dashboard
/(authenticated)/log                     5-tab log form
/(authenticated)/settings                Account + WhatsApp
/(legal)/privacy|terms|disclaimer        Legal pages
/admin/*                                 Admin portal (role=admin)
```

### Onboarding flow

```
New user → disclaimer (accept required) → health profile → goals → reminders → dashboard
```

Middleware redirects unauthenticated users to login. Authenticated users who haven't completed onboarding are redirected to the next incomplete step.

### Dashboard widgets

- Today's stats (meals, water, activity, sleep, checkins)
- Streak badge (consecutive active days, cross-table SQL)
- Points total
- Achievement grid (10 achievements seeded)
- Weekly review (last generated)
- WhatsApp connection status

---

## Rewards System

**Points:** 10 pts per log action (meal, water, activity, sleep, habit, checkin)

**Achievements (10 seeded):**

| Code | Trigger |
|---|---|
| `first_meal_log` | First meal logged |
| `first_water_log` | First water logged |
| `first_activity_log` | First activity logged |
| `first_sleep_log` | First sleep logged |
| `first_checkin` | First daily checkin |
| `week_streak` | 7-day active streak |
| `two_week_streak` | 14-day active streak |
| `month_streak` | 30-day active streak |
| `water_champion` | 7 consecutive days with water logs |
| `consistent_sleeper` | 7 consecutive days with sleep logs |

Achievement checks fire-and-forget after each log write — non-blocking.

---

## Admin Portal

Routes under `/admin/*`, accessible only to `role=admin` users.

| Page | Purpose |
|---|---|
| `/admin` | Overview: user count, active conversations, messages today, flagged count, AI cost, recent jobs |
| `/admin/users` | User list with status and subscription |
| `/admin/conversations` | All conversations, filterable |
| `/admin/conversations/[id]` | Full conversation thread |
| `/admin/flagged` | Safety-flagged messages for review |
| `/admin/prompts` | Prompt versions in use |
| `/admin/ai-costs` | Token + cost analytics over time |

---

## Security

- **CSP, HSTS, X-Frame-Options, X-Content-Type-Options** — set in `next.config.ts`
- **HMAC webhook verification** — rejects any request without valid `X-Hub-Signature-256`
- **Idempotency** — duplicate webhook deliveries silently ignored
- **PII handling** — phone number cleared on deletion; email + name anonymised
- **Password storage** — bcrypt hashed
- **Medical disclaimer** — required acceptance before onboarding continues; stored in `health_profiles.medicalDisclaimerAccepted`
- **Safety guard** — two-tier (keyword + LLM) runs before every AI call

---

## Environment Variables

```
DATABASE_URL                # PostgreSQL connection string
AUTH_SECRET                 # openssl rand -base64 32
REDIS_URL                   # Redis connection string
OPENAI_API_KEY              # gpt-4o-mini
WHATSAPP_VERIFY_TOKEN       # Meta webhook verification token
WHATSAPP_ACCESS_TOKEN       # Meta Graph API bearer token
WHATSAPP_PHONE_NUMBER_ID    # Meta phone number ID
WHATSAPP_APP_SECRET         # HMAC signature verification (required in prod)
APP_URL                     # Public URL of the web app
WORKER_HEALTH_PORT          # Health check port for worker (default: 3001)
```

---

## Deployment

| Component | Platform | Notes |
|---|---|---|
| Next.js web + API | Vercel | Standard Next.js deploy |
| BullMQ worker | Render (Background Worker) | `npm run worker:prod` |
| PostgreSQL | Render or Neon | Same DB for both processes |
| Redis | Render Redis or Upstash | Shared by web (rate-limit) and worker |

**First-deploy checklist:**
1. Set all env vars on both Vercel and Render
2. `npm run db:migrate` — run against production DB
3. `npm run db:seed` — seed achievement definitions
4. Configure Meta webhook URL: `https://<vercel-domain>/api/whatsapp/webhook`
5. Verify worker health: `GET <render-worker-url>:3001/health`

---

## Deferred (Phase 2+)

- Stripe subscriptions
- Password reset / magic link
- Email notifications
- Sentry error tracking
- Meal photo analysis (vision)
- Wearable integrations
- Native mobile apps
- Admin data export
