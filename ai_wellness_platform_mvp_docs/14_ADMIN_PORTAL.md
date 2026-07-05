# Admin Portal

## Purpose

The admin portal allows the platform owner to manage operations, monitor quality, review safety flags, and understand user engagement.

## MVP Admin Roles

### Super Admin
Can manage everything:
- Users
- Conversations
- Prompts
- Analytics
- Rewards
- Settings

### Support Admin
Can view users and conversations but cannot change prompts or system settings.

## Admin Screens

### 1. Admin Dashboard

Cards:
- Total users
- Active users today
- Active users this week
- WhatsApp messages today
- AI cost today
- Flagged messages
- Reminders sent
- Weekly reviews generated

### 2. Users

Columns:
- Name
- Email
- Status
- Primary goal
- WhatsApp status
- Last active
- Created date

Actions:
- View profile summary
- View conversations
- Disable user
- Export user data
- Delete user, if allowed by policy

### 3. Conversations

Columns:
- User
- Channel
- Last message
- Last active
- Safety flag
- Message count

Conversation Detail:
- Message timeline
- Inbound/outbound indicator
- AI agent used
- Prompt version
- Safety flag
- Admin notes

### 4. Flagged Messages

Filters:
- Medical risk
- Emergency risk
- Eating disorder risk
- Self-harm risk
- Unsafe exercise
- Medication request

Actions:
- Mark reviewed
- Add note
- Disable AI responses for user temporarily
- Escalate manually if business policy supports it

### 5. Prompt Manager

Features:
- View prompt files/versions
- Create new prompt version
- Set active version
- View AI run usage by prompt
- Roll back prompt

### 6. Analytics

Metrics:
- Daily active users
- Weekly active users
- Retention
- Messages per user
- Reminder response rate
- Daily plan open/response rate
- Weekly review generated count
- AI cost per user
- Token usage
- Safety flag rate

### 7. Rewards

MVP Features:
- View reward point rules
- View achievements
- View user points
- Manually adjust points if needed

### 8. System Logs

Show:
- Failed jobs
- Failed WhatsApp sends
- AI failures
- Webhook errors
- Auth errors
- Admin actions

## Admin Safety Rules

- Admins should see only necessary health/wellness information.
- Admin access must be audited.
- Admin cannot change user health data without logging.
- Prompt changes must be versioned and audited.
