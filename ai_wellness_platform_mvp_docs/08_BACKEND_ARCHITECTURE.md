# Backend Architecture

## Recommended MVP Architecture

Use a modular monorepo or organized single repository.

Recommended structure:

```text
/apps
  /web
    Next.js frontend and route handlers
/packages
  /db
    Drizzle schema, migrations, database client
  /auth
    Auth helpers, session logic, roles
  /ai
    AI orchestration, agents, guardrails, prompt loader
  /wellness
    Wellness plugin logic
  /messaging
    WhatsApp integration and future channel abstraction
  /notifications
    Reminder scheduling and job queue
  /shared
    Shared types, validation schemas, utilities
```

## Simpler MVP Alternative

If you want faster implementation:

```text
/src
  /app
  /components
  /server
    /db
    /auth
    /ai
    /wellness
    /whatsapp
    /notifications
    /admin
  /lib
  /prompts
```

## Backend Modules

### Auth Module

Responsibilities:
- Register
- Login
- Logout
- Session validation
- Password reset later
- Role-based access

### User/Profile Module

Responsibilities:
- User profile CRUD
- Wellness profile CRUD
- Goal CRUD
- Reminder preferences

### Conversation Module

Responsibilities:
- Create conversations
- Store messages
- Map messages to channels
- Track direction, status, provider IDs

### WhatsApp Module

Responsibilities:
- Webhook verification
- Signature validation
- Inbound message parsing
- Outbound message sending
- Opt-in/opt-out
- Provider error handling

### AI Orchestration Module

Responsibilities:
- Intent detection
- Retrieve user context
- Retrieve memory
- Select agent
- Run safety guard
- Run LLM
- Parse tool/actions
- Store AI run logs
- Store response
- Return reply

### Wellness Module

Responsibilities:
- Daily plan generation
- Meal logs
- Water logs
- Activity logs
- Sleep logs
- Habit logs
- Weekly reviews
- Rewards triggers

### Notification Module

Responsibilities:
- Reminder schedules
- BullMQ job creation
- Job execution
- Retry handling
- Delivery logging

### Admin Module

Responsibilities:
- User management
- Conversation viewer
- Flagged messages
- Analytics
- Prompt management
- AI cost reports

## AI Processing Flow

```text
Inbound WhatsApp Message
        ↓
Verify webhook
        ↓
Find user by phone
        ↓
Store inbound message
        ↓
Classify intent
        ↓
Load profile + daily data + memory summary
        ↓
Run safety guard
        ↓
Route to agent
        ↓
Generate response
        ↓
Extract actions/logs
        ↓
Persist logs and AI run
        ↓
Send WhatsApp reply
```

## Daily Plan Flow

```text
Scheduled job
        ↓
Find active user
        ↓
Load profile/goals/recent activity
        ↓
Generate daily plan
        ↓
Store daily plan
        ↓
Send WhatsApp message
```

## Weekly Review Flow

```text
Weekly scheduled job
        ↓
Aggregate logs
        ↓
Generate review
        ↓
Generate memory summary
        ↓
Store weekly review
        ↓
Update AI memory
        ↓
Send WhatsApp review
```

## Background Jobs

Use BullMQ + Redis for:
- Daily plans
- Hydration reminders
- Walking reminders
- Weekly reviews
- Memory summarization
- Failed message retries

## Idempotency

Webhook processing must avoid duplicate messages.

Recommended:
- Store provider_message_id.
- Before processing, check if provider_message_id exists.
- If exists, return success without reprocessing.

## Logging

Log:
- inbound message received
- outbound message sent
- AI run started/completed
- safety flag triggered
- job started/completed/failed
- admin action
- auth failure rate-limited

## Error Handling

If AI fails:
- Send safe fallback:
  "I'm having trouble responding right now. I saved your message and will try again shortly."
- Log the error.
- Do not expose raw stack traces to users.

## Recommended Environment Variables

```env
DATABASE_URL=
AUTH_SECRET=
OPENAI_API_KEY=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
REDIS_URL=
APP_URL=
ADMIN_EMAIL=
```
