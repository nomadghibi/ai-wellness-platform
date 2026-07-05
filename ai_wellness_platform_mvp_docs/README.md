# AI Wellness Platform — Healthy Living Coach MVP Documentation Kit

Generated: 2026-07-05

## Purpose

This package is a documentation-first blueprint for building a reusable **AI Wellness Platform** with the first product/plugin being a **WhatsApp-based Healthy Living Coach MVP**.

The goal is to avoid starting with code too early. This kit gives you the planning documents needed before implementation in Claude Code, VS Code, Cursor, or any other AI coding workflow.

## Product Strategy

Build the platform as two layers:

1. **Reusable AI Wellness Platform Core**
   - Identity and authentication
   - User profiles
   - Conversation engine
   - AI orchestration
   - Memory system
   - Notifications and reminders
   - Scheduling
   - Analytics
   - Subscription foundation
   - Admin portal
   - Multi-channel messaging

2. **Healthy Living Coach Plugin**
   - Nutrition guidance
   - Hydration coaching
   - Walking/activity coaching
   - Sleep habit coaching
   - Habit accountability
   - Weekly/monthly reviews
   - Simple rewards and achievements

## Recommended MVP Promise

A WhatsApp-based AI coach that helps users build better daily wellness habits through personalized reminders, progress tracking, and weekly reviews.

## Included Documents

### Core Planning
- `01_PRD.md`
- `02_USER_STORIES.md`
- `03_FUNCTIONAL_REQUIREMENTS.md`
- `04_NON_FUNCTIONAL_REQUIREMENTS.md`
- `05_MVP_SCOPE_AND_PHASES.md`

### Technical Design
- `06_DATABASE_SCHEMA.md`
- `schema/schema.sql`
- `07_API_SPECIFICATION.md`
- `api/openapi.yaml`
- `08_BACKEND_ARCHITECTURE.md`
- `09_FRONTEND_UI_UX.md`
- `10_WHATSAPP_INTEGRATION.md`

### AI System
- `11_AI_AGENT_DEFINITIONS.md`
- `12_MEMORY_DESIGN.md`
- `13_PROMPT_LIBRARY.md`
- `prompts/`

### Product Operations
- `14_ADMIN_PORTAL.md`
- `15_REWARDS_SYSTEM.md`
- `16_ANALYTICS_AND_METRICS.md`
- `17_SUBSCRIPTION_MODEL.md`

### Production Readiness
- `18_SECURITY_REVIEW.md`
- `19_HEALTH_AI_SAFETY_POLICY.md`
- `20_TEST_PLAN.md`
- `21_DEPLOYMENT_PLAN.md`
- `22_IMPLEMENTATION_ROADMAP.md`
- `23_CLAUDE_CODE_BUILD_INSTRUCTIONS.md`

## Suggested Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, Shadcn UI
- Backend: Next.js API routes for MVP, or NestJS for larger service separation
- Database: PostgreSQL
- ORM: Drizzle
- Auth: Better Auth or Auth.js
- AI: OpenAI API first, local/open-weight LLM later
- Messaging: Meta WhatsApp Cloud API first
- Jobs: BullMQ + Redis
- Storage: Cloudflare R2
- Deployment: Vercel + Railway/Render/AWS/Azure
- CI/CD: GitHub Actions
- Monitoring: Basic logs first, then Sentry/Logtail/OpenTelemetry

## Development Rule

Do not start coding until these are reviewed:

1. PRD
2. User stories
3. Database schema
4. API specification
5. AI agent definitions
6. Memory design
7. Prompt library
8. UI/UX design
9. Backend architecture
10. Security review
11. Test plan
