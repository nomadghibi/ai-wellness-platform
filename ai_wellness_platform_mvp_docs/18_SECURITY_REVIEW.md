# Security Review

## Security Goals

Protect user identity, wellness data, admin access, AI workflows, and messaging integrations.

## Authentication

Requirements:
- Secure password hashing.
- Secure sessions.
- HTTPS only.
- CSRF protection if cookie auth.
- Rate limiting on login/register.
- Password reset with secure tokens, later.

## Authorization

Requirements:
- Role-based access control.
- Admin-only routes protected.
- Users can only access their own data.
- Organization scoping planned for B2B.

## Data Protection

Requirements:
- Store secrets in environment variables.
- Do not log passwords, tokens, or API keys.
- Limit admin exposure of sensitive fields.
- Encrypt data at rest through cloud provider/database settings.
- Use TLS for all network connections.

## Webhook Security

WhatsApp webhook must:
- Verify provider signature.
- Validate payload shape.
- Use idempotency.
- Reject invalid requests.
- Avoid leaking webhook secrets.

## AI Security

Risks:
- Prompt injection
- Unsafe health advice
- Data leakage
- Jailbreak attempts
- Hallucinated medical claims

Mitigations:
- System safety prompt
- Safety guard before response
- Post-response safety check for risky content
- Prompt versioning
- AI logs
- Admin flagged messages
- No direct arbitrary tool execution from user messages

## Privacy

Requirements:
- Privacy policy page.
- Terms page.
- Consent for WhatsApp.
- Wellness disclaimer acceptance.
- Account deletion.
- Data export path.
- Opt-out for messaging.

## Health Data Caution

Even if not operating as a clinical system, wellness data is sensitive.

Handle:
- Weight
- Food logs
- Activity
- Sleep
- Goals
- Health restrictions

with privacy-first design.

## Admin Controls

Requirements:
- Audit admin logins/actions.
- Limit support admin privileges.
- Track prompt edits.
- Track user data exports/deletions.

## Rate Limiting

Apply limits to:
- Login
- Register
- AI message endpoint
- WhatsApp webhook
- Admin APIs
- Password reset

## Backup

Requirements:
- Automated database backups.
- Recovery procedure.
- Test restore process before launch.

## Production Checklist

- HTTPS configured
- Secrets set
- Debug mode off
- Database backups enabled
- Admin users reviewed
- Rate limits enabled
- Webhook signature verified
- Error reporting enabled
- Terms/privacy/disclaimer live
