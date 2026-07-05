# User Stories

## User Onboarding

### US-001: Register Account
As a user, I want to create an account so I can access my wellness coach.

Acceptance Criteria:
- User can register with email and password.
- User receives a success response.
- User is redirected to onboarding.
- Password is stored securely.

### US-002: Login
As a user, I want to log in securely so I can access my dashboard.

Acceptance Criteria:
- User can log in with valid credentials.
- Invalid credentials return a safe generic error.
- User session is secure.

### US-003: Complete Wellness Profile
As a user, I want to enter my wellness information so the AI can personalize coaching.

Profile Fields:
- Name
- Age range
- Height
- Weight
- Goal weight, optional
- Diet preference
- Food restrictions
- Activity level
- Wake time
- Sleep time
- Reminder preferences
- Motivation style

Acceptance Criteria:
- Required fields are validated.
- User can edit profile later.
- Profile is available to AI memory layer.

### US-004: Select Goals
As a user, I want to select wellness goals so the AI knows what to prioritize.

Example Goals:
- Lose weight
- Drink more water
- Walk more
- Eat healthier
- Build better habits
- Sleep better
- Reduce soda/sugar
- Improve consistency

Acceptance Criteria:
- User can select one or more goals.
- User can set target intensity: easy, moderate, ambitious.
- Goals are stored for AI personalization.

## WhatsApp Coaching

### US-005: Connect WhatsApp
As a user, I want to connect my WhatsApp number so I can receive coaching messages.

Acceptance Criteria:
- User enters phone number.
- User receives opt-in instructions.
- Phone number is verified.
- User consent is recorded.

### US-006: Receive Daily Plan
As a user, I want to receive a daily wellness plan so I know what to focus on today.

Acceptance Criteria:
- Daily plan is generated using profile, goals, and past memory.
- Message is sent at preferred reminder time.
- Plan includes 3 to 5 simple actions.
- Plan contains wellness disclaimer where appropriate.

### US-007: Log Meal by Text
As a user, I want to tell the AI what I ate so it can provide general nutrition feedback.

Acceptance Criteria:
- User can send meal description through WhatsApp.
- AI identifies meal log intent.
- Meal is stored in daily log.
- AI gives safe, general feedback.

### US-008: Log Water
As a user, I want to log water intake so I can track hydration.

Acceptance Criteria:
- User can say "I drank 2 cups of water."
- System extracts amount.
- Daily water total is updated.
- AI encourages progress toward goal.

### US-009: Log Walking/Activity
As a user, I want to log walking or activity so I can track movement.

Acceptance Criteria:
- User can say "I walked 20 minutes."
- System records activity.
- Points and streaks update.
- AI encourages next step.

### US-010: Receive Motivation
As a user, I want motivational support when I lose consistency.

Acceptance Criteria:
- AI recognizes discouragement.
- AI responds with supportive, nonjudgmental coaching.
- AI suggests one small action, not overwhelming advice.

### US-011: Weekly Review
As a user, I want a weekly review so I can understand progress.

Acceptance Criteria:
- Weekly review summarizes water, meals, walking, sleep, and habits.
- Review includes wins, challenges, and next week plan.
- Review is sent to WhatsApp and visible on dashboard.

## Dashboard

### US-012: View Dashboard
As a user, I want to see today’s progress so I know where I stand.

Acceptance Criteria:
- Dashboard shows daily plan.
- Dashboard shows water, activity, meal logs, habits, points, streak.
- Dashboard shows weekly summary if available.

### US-013: Edit Account Settings
As a user, I want to manage my account and preferences.

Acceptance Criteria:
- User can update name, email, password, notification times.
- User can opt out of reminders.
- User can delete account.

### US-014: Privacy Controls
As a user, I want privacy controls so I understand and manage my data.

Acceptance Criteria:
- User can view basic privacy explanation.
- User can request data export.
- User can delete account and data.

## Admin Portal

### US-015: View Users
As an admin, I want to view users so I can manage platform activity.

Acceptance Criteria:
- Admin can list users.
- Admin can filter by active/inactive.
- Admin can see basic wellness goal categories, not overly sensitive details by default.

### US-016: View Conversations
As an admin, I want to view conversations so I can monitor AI quality and safety.

Acceptance Criteria:
- Admin can view conversation logs.
- Sensitive data is handled carefully.
- High-risk flagged messages are visible.

### US-017: Manage Prompts
As an admin, I want to manage AI prompts so I can improve coaching behavior without redeploying code.

Acceptance Criteria:
- Admin can view prompt versions.
- Admin can create new prompt versions.
- Prompt changes are audited.

### US-018: View Analytics
As an admin, I want analytics so I can understand engagement and cost.

Acceptance Criteria:
- Admin sees active users, messages, AI cost, reminders sent, weekly reviews generated.
- Admin sees flagged conversation count.
- Admin sees retention and engagement trends.

## Safety

### US-019: Medical Escalation
As a user, if I mention serious symptoms, I want the AI to direct me to urgent professional care.

Acceptance Criteria:
- AI does not provide diagnosis.
- AI does not minimize symptoms.
- AI recommends emergency services for urgent symptoms.
- Conversation is flagged for admin review.

### US-020: Eating Disorder Safety
As a user, if I express dangerous restriction or disordered eating, I want the AI to respond safely.

Acceptance Criteria:
- AI does not encourage restriction.
- AI recommends professional support.
- AI provides supportive, non-triggering language.
- Conversation is flagged.
