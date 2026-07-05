# Implementation Roadmap

## Overall Build Order

1. Documentation package
2. Project setup
3. Database schema
4. Authentication
5. User onboarding
6. Health profile
7. Goal selection
8. Dashboard
9. WhatsApp webhook
10. AI orchestration
11. Memory system
12. Daily plan
13. Reminders
14. Weekly review
15. Rewards
16. Admin portal
17. Security/testing/deployment

## Sprint 1: Foundation

Duration: 1 week

Tasks:
- Initialize repository.
- Set up Next.js + TypeScript.
- Set up Tailwind + Shadcn.
- Set up PostgreSQL.
- Set up Drizzle.
- Add auth.
- Create basic layout.

Deliverable:
- User can register, login, logout.

## Sprint 2: Onboarding and Profile

Duration: 1 week

Tasks:
- Health disclaimer screen.
- Health profile form.
- Goal selection.
- Reminder preferences.
- Dashboard shell.

Deliverable:
- User can complete onboarding and view dashboard.

## Sprint 3: Database and Logs

Duration: 1 week

Tasks:
- Add tables for logs.
- Add API endpoints.
- Add dashboard data.
- Add rewards point events.

Deliverable:
- User logs can be created from API and shown in dashboard.

## Sprint 4: WhatsApp

Duration: 1 week

Tasks:
- Configure Meta WhatsApp Cloud API.
- Add webhook verification.
- Add inbound message handling.
- Add outbound sending.
- Map phone number to user.
- Store messages.

Deliverable:
- User can chat through WhatsApp and messages are saved.

## Sprint 5: AI Orchestration

Duration: 1 to 2 weeks

Tasks:
- Add prompt loader.
- Add intent detection.
- Add safety guard.
- Add Main Coach Agent.
- Add Nutrition/Hydration/Walking agents.
- Log AI runs.
- Parse actions from AI.

Deliverable:
- WhatsApp AI coach responds safely and can create logs.

## Sprint 6: Daily Plans and Reminders

Duration: 1 week

Tasks:
- Add BullMQ + Redis.
- Add daily plan generator.
- Add scheduled jobs.
- Send daily plan through WhatsApp.
- Add hydration/walking reminders.

Deliverable:
- User receives scheduled coaching.

## Sprint 7: Weekly Reviews and Memory

Duration: 1 week

Tasks:
- Aggregate weekly logs.
- Generate weekly review.
- Generate memory summary.
- Store ai_memory.
- Show review on dashboard.

Deliverable:
- User gets weekly progress review.

## Sprint 8: Admin Portal

Duration: 1 to 2 weeks

Tasks:
- Admin dashboard.
- User list.
- Conversation viewer.
- Flagged messages.
- Prompt version page.
- AI cost analytics.

Deliverable:
- Admin can monitor platform.

## Sprint 9: Security, Testing, Production

Duration: 1 to 2 weeks

Tasks:
- Add rate limiting.
- Add webhook signature validation.
- Add tests.
- Add error handling.
- Add deployment scripts.
- Add privacy/terms/disclaimer pages.
- Deploy staging and production.

Deliverable:
- Production-ready controlled beta.

## Realistic Timeline

Lean internal MVP:
- 6 to 8 weeks

Production-ready beta:
- 8 to 12 weeks

More polished SaaS with subscriptions and advanced admin:
- 12 to 16 weeks
