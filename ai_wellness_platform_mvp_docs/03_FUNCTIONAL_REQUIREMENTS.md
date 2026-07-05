# Functional Requirements

## Authentication and Identity

FR-001: The system shall allow users to register using email and password.
FR-002: The system shall allow users to log in and log out.
FR-003: The system shall store passwords using a secure hashing mechanism.
FR-004: The system shall support role-based access control.
FR-005: The system shall support admin users separately from regular users.
FR-006: The system shall support account deletion.

## User Profile

FR-007: The system shall allow users to create a wellness profile.
FR-008: The system shall allow users to update their profile.
FR-009: The system shall allow users to select wellness goals.
FR-010: The system shall allow users to configure reminder preferences.
FR-011: The system shall store profile data in structured fields.

## WhatsApp Messaging

FR-012: The system shall receive inbound WhatsApp messages through a webhook.
FR-013: The system shall validate WhatsApp webhook signatures.
FR-014: The system shall map WhatsApp phone numbers to user accounts.
FR-015: The system shall send outbound WhatsApp messages.
FR-016: The system shall store inbound and outbound messages.
FR-017: The system shall support opt-in and opt-out status.

## Conversation Engine

FR-018: The system shall create conversations for each user.
FR-019: The system shall classify user intent from messages.
FR-020: The system shall route messages to the correct AI agent or workflow.
FR-021: The system shall store AI responses.
FR-022: The system shall log AI model, prompt version, token usage, and latency.

## AI Orchestration

FR-023: The system shall generate a daily plan for each active user.
FR-024: The system shall provide general nutrition guidance.
FR-025: The system shall provide hydration coaching.
FR-026: The system shall provide walking/activity coaching.
FR-027: The system shall provide habit coaching.
FR-028: The system shall generate weekly reviews.
FR-029: The system shall apply safety guardrails before and after LLM responses.
FR-030: The system shall avoid medical diagnosis or treatment advice.

## Memory

FR-031: The system shall store structured profile memory.
FR-032: The system shall store daily tracking memory.
FR-033: The system shall generate summary memory.
FR-034: The system shall use memory summaries to personalize future responses.
FR-035: The system shall avoid sending full conversation history to the LLM unless necessary.

## Daily Tracking

FR-036: The system shall record meal logs.
FR-037: The system shall record water logs.
FR-038: The system shall record activity logs.
FR-039: The system shall record sleep logs.
FR-040: The system shall record habit check-ins.
FR-041: The system shall generate dashboard progress summaries.

## Reminders and Scheduling

FR-042: The system shall schedule daily reminders.
FR-043: The system shall schedule hydration reminders.
FR-044: The system shall schedule weekly reviews.
FR-045: The system shall retry failed notification jobs safely.
FR-046: The system shall allow users to pause reminders.

## Rewards

FR-047: The system shall award points for completed check-ins.
FR-048: The system shall calculate streaks.
FR-049: The system shall award achievements.
FR-050: The system shall show points and achievements on the dashboard.

## Admin Portal

FR-051: The system shall allow admins to view users.
FR-052: The system shall allow admins to view conversations.
FR-053: The system shall allow admins to view flagged messages.
FR-054: The system shall allow admins to view analytics.
FR-055: The system shall allow admins to manage prompt versions.
FR-056: The system shall allow admins to view AI cost and usage.

## Analytics

FR-057: The system shall track daily active users.
FR-058: The system shall track message volume.
FR-059: The system shall track AI token usage and cost.
FR-060: The system shall track reminder delivery.
FR-061: The system shall track weekly reviews generated.
FR-062: The system shall track retention and engagement.

## Privacy

FR-063: The system shall show wellness disclaimer during onboarding.
FR-064: The system shall obtain user consent before WhatsApp messaging.
FR-065: The system shall allow account deletion.
FR-066: The system shall keep audit logs for admin actions.
FR-067: The system shall limit admin access to sensitive profile fields.
