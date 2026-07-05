# Claude Code Build Instructions

## Development Philosophy

Use documentation-first development.

Do not ask Claude Code to build the whole app at once. Build one vertical slice at a time, test it, then move forward.

## Recommended Claude Code Workflow

1. Give Claude the PRD.
2. Give Claude the architecture.
3. Give Claude the database schema.
4. Ask Claude to create a step-by-step implementation plan.
5. Ask for one small module.
6. Review code.
7. Run tests.
8. Fix issues.
9. Commit.
10. Move to next module.

## Rule for Claude Code

Always use this instruction:

```text
Implement one section at a time. Do not move to the next section until the current section builds, passes tests, and is reviewed. Explain what changed, why it was changed, and how to test it.
```

## Initial Build Prompt

```text
You are building the AI Wellness Platform — Healthy Living Coach MVP.

Use the documentation in this project as the source of truth.

Tech stack:
- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI
- PostgreSQL
- Drizzle ORM
- Better Auth or Auth.js
- OpenAI API
- Meta WhatsApp Cloud API
- BullMQ + Redis

Start by creating the project structure, core dependencies, environment variable template, database module, and basic app layout.

Do not implement all features yet.

After implementation, provide:
1. Files changed
2. What was added
3. How to run locally
4. How to test
5. What should be built next
```

## Module-by-Module Prompts

### Auth Module

```text
Implement the authentication module only.

Requirements:
- User registration
- Login
- Logout
- Current user endpoint
- Secure password handling
- Role field for user/admin
- Basic tests

Do not implement health profile yet.
```

### Health Profile Module

```text
Implement the health profile and goal selection module only.

Requirements:
- Health disclaimer acceptance
- Health profile form
- Goal selection
- Reminder preferences
- API endpoints
- Database persistence
- Dashboard summary card

Do not implement WhatsApp yet.
```

### WhatsApp Module

```text
Implement the WhatsApp integration module only.

Requirements:
- Webhook verification endpoint
- Signature validation placeholder or implementation
- Inbound message parsing
- Phone-to-user mapping
- Message persistence
- Outbound send function
- Tests for duplicate provider message handling

Do not connect AI yet.
```

### AI Orchestration Module

```text
Implement the AI orchestration module only.

Requirements:
- Prompt loader
- Intent detection
- Safety guard
- Main Coach Agent
- Nutrition Agent
- Hydration Agent
- Walking Agent
- AI run logging
- Structured action output

Do not implement scheduled reminders yet.
```

### Reminder Module

```text
Implement the reminder and job scheduling module only.

Requirements:
- BullMQ + Redis setup
- Daily plan job
- Hydration reminder job
- Walking reminder job
- Weekly review job skeleton
- Failed job logging

Do not build admin portal yet.
```

### Admin Portal Module

```text
Implement the admin portal module only.

Requirements:
- Admin dashboard
- User list
- Conversation list
- Conversation detail
- Flagged messages
- Prompt versions page
- AI cost analytics

Protect all admin routes with role-based access.
```

## Testing Prompt

```text
Create tests for the current module.

Include:
- Unit tests
- API tests
- Security/authorization tests
- Edge cases
- Failure cases

Do not add new features while writing tests.
```

## Code Review Prompt

```text
Review the implementation for:
- Security issues
- Data leakage
- Unsafe AI behavior
- Missing validation
- Poor separation of concerns
- Missing tests
- TypeScript problems
- Database migration issues

Return a prioritized fix list.
```

## Commit Strategy

Suggested commits:
1. project setup
2. database schema
3. auth
4. profile/goals
5. dashboard
6. whatsapp webhook
7. ai orchestration
8. memory
9. reminders
10. weekly reviews
11. rewards
12. admin portal
13. security hardening
14. production deployment
