# Non-Functional Requirements

## Security

NFR-001: All user authentication shall use secure session management.
NFR-002: Passwords shall never be stored in plain text.
NFR-003: All API inputs shall be validated.
NFR-004: Webhooks shall be signature-verified.
NFR-005: Admin routes shall require admin role.
NFR-006: Sensitive logs shall avoid storing secrets, tokens, or raw credentials.
NFR-007: Database credentials shall be stored as environment variables.
NFR-008: Rate limiting shall protect login, webhooks, and AI endpoints.

## Privacy

NFR-009: The platform shall minimize collection of health-related data.
NFR-010: The platform shall provide clear disclaimers.
NFR-011: Users shall be able to delete their account.
NFR-012: Users shall be able to opt out of WhatsApp reminders.
NFR-013: Admin screens shall avoid exposing unnecessary sensitive details.

## Reliability

NFR-014: The system shall use background jobs for reminders.
NFR-015: Failed jobs shall be retried with backoff.
NFR-016: Webhook processing shall be idempotent.
NFR-017: AI failures shall return safe fallback responses.
NFR-018: Database migrations shall be version-controlled.

## Performance

NFR-019: User dashboard shall load within 2 seconds under normal MVP load.
NFR-020: WhatsApp AI response target shall be under 10 seconds for normal requests.
NFR-021: AI operations shall be logged with latency.
NFR-022: Daily plan generation shall be batched where practical.

## Scalability

NFR-023: The architecture shall support multiple messaging channels later.
NFR-024: The architecture shall separate platform core from wellness plugin.
NFR-025: The database schema shall support multi-organization later.
NFR-026: AI agents shall be modular.

## Maintainability

NFR-027: Code shall use TypeScript.
NFR-028: Prompt files shall be versioned.
NFR-029: Business logic shall be separated from UI components.
NFR-030: Tests shall cover core workflows.
NFR-031: Documentation shall be updated with major changes.

## Compliance Posture

NFR-032: The MVP shall be positioned as general wellness, not medical care.
NFR-033: The AI shall not diagnose, prescribe, or replace professional care.
NFR-034: High-risk health messages shall trigger safety behavior and flagging.
NFR-035: Terms and privacy pages shall be available before launch.
