# MVP Scope and Phases

## MVP Definition

The MVP is a production-ready but narrow version of the AI Wellness Platform with the Healthy Living Coach plugin.

The MVP must prove:
- Users will complete onboarding.
- Users will connect WhatsApp.
- Users will respond to daily coaching.
- Users find weekly reviews useful.
- AI responses remain safe within wellness boundaries.

## Phase 0: Documentation

Deliverables:
- PRD
- User stories
- Database schema
- API spec
- AI agent definitions
- Memory design
- Prompt library
- UI/UX design
- Backend architecture
- Security review
- Test plan
- Implementation roadmap

Exit Criteria:
- Documents reviewed.
- Scope finalized.
- Technical stack chosen.

## Phase 1: Platform Foundation

Features:
- Next.js app setup
- PostgreSQL + Drizzle
- Authentication
- User roles
- Profile management
- Goal selection
- Basic dashboard
- Environment configuration
- Basic tests

Exit Criteria:
- User can register, log in, complete profile, and select goals.

## Phase 2: WhatsApp Integration

Features:
- WhatsApp webhook endpoint
- Signature validation
- Phone number mapping
- Opt-in flow
- Inbound/outbound message logging
- Basic manual reply test
- User opt-out

Exit Criteria:
- User can receive and send WhatsApp messages connected to their account.

## Phase 3: AI Coaching Core

Features:
- AI orchestration module
- Intent detection
- Safety guard
- Main Coach Agent
- Nutrition Agent
- Hydration Agent
- Walking Agent
- Habit Agent
- Memory retrieval
- Message response generation

Exit Criteria:
- AI can safely respond to wellness messages using user profile and goals.

## Phase 4: Daily Plan and Reminders

Features:
- Daily plan generator
- BullMQ + Redis job queue
- Scheduled reminders
- Hydration reminders
- Walking reminders
- Daily check-in logging

Exit Criteria:
- User receives daily plan and reminders at configured times.

## Phase 5: Weekly Review and Memory Summaries

Features:
- Weekly review generator
- Weekly memory summary
- Dashboard weekly review display
- WhatsApp weekly review delivery

Exit Criteria:
- System summarizes user progress weekly and stores AI memory.

## Phase 6: Rewards and Achievements

Features:
- Point rules
- Streak tracking
- Achievement badges
- Dashboard rewards display

Exit Criteria:
- User earns points and achievements based on daily actions.

## Phase 7: Admin Portal

Features:
- Admin dashboard
- User list
- Conversation viewer
- Flagged messages
- Prompt manager
- AI cost analytics
- Reminder analytics

Exit Criteria:
- Admin can monitor safety, usage, and basic platform operations.

## Phase 8: Production Readiness

Features:
- Error handling
- Logging
- Security review
- Rate limiting
- Backup strategy
- Deployment scripts
- CI/CD
- End-to-end tests
- Documentation

Exit Criteria:
- MVP is deployed and ready for controlled beta users.

## Features Delayed to Phase 2/3

- Meal photo analysis
- Wearable integrations
- Native mobile apps
- Partner portal
- Full reward marketplace
- Multi-language support
- Human coach portal
- Insurance/employer integrations
- Advanced analytics
- HIPAA/clinical-grade workflows
