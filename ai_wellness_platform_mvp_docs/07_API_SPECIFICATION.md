# API Specification

## API Principles

- REST API for the MVP.
- JSON request/response format.
- Authenticated routes require secure session or bearer token.
- Admin routes require admin role.
- Webhook routes verify provider signatures.
- All inputs must be validated.
- All API errors return structured error responses.

## Standard Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "details": {}
  }
}
```

## Auth API

### POST /api/auth/register

Request:
```json
{
  "name": "Fred",
  "email": "fred@example.com",
  "password": "secure-password"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "fred@example.com",
    "name": "Fred"
  }
}
```

### POST /api/auth/login

Request:
```json
{
  "email": "fred@example.com",
  "password": "secure-password"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "fred@example.com"
  }
}
```

### POST /api/auth/logout

Response:
```json
{
  "success": true
}
```

### GET /api/me

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "fred@example.com",
    "name": "Fred",
    "role": "user"
  }
}
```

## Health Profile API

### POST /api/health-profile

Request:
```json
{
  "ageRange": "45-54",
  "heightValue": 70,
  "heightUnit": "in",
  "weightValue": 190,
  "weightUnit": "lb",
  "goalWeightValue": 175,
  "dietPreference": "balanced",
  "foodRestrictions": "none",
  "activityLevel": "light",
  "wakeTime": "07:00",
  "sleepTime": "22:30",
  "motivationStyle": "encouraging",
  "medicalDisclaimerAccepted": true
}
```

Response:
```json
{
  "healthProfile": {
    "id": "uuid",
    "userId": "uuid"
  }
}
```

### GET /api/health-profile

Returns the user's profile.

### PATCH /api/health-profile

Updates profile fields.

## Goals API

### POST /api/goals

Request:
```json
{
  "goalType": "drink_more_water",
  "targetValue": 8,
  "targetUnit": "cups",
  "intensity": "moderate"
}
```

Response:
```json
{
  "goal": {
    "id": "uuid",
    "goalType": "drink_more_water",
    "status": "active"
  }
}
```

### GET /api/goals

Returns active and inactive goals.

### PATCH /api/goals/:id

Updates a goal.

### DELETE /api/goals/:id

Sets goal status to inactive.

## Dashboard API

### GET /api/dashboard

Response:
```json
{
  "today": {
    "plan": "...",
    "waterCups": 4,
    "walkingMinutes": 20,
    "mealsLogged": 2,
    "habitsCompleted": 3,
    "pointsToday": 50
  },
  "streaks": {
    "water": 3,
    "walking": 5
  },
  "weeklyReview": {
    "summary": "..."
  }
}
```

## WhatsApp API

### GET /api/whatsapp/webhook

Used by Meta WhatsApp Cloud API for webhook verification.

Query:
- hub.mode
- hub.challenge
- hub.verify_token

Response:
- challenge string if token matches

### POST /api/whatsapp/webhook

Receives inbound WhatsApp messages.

Requirements:
- Verify signature.
- Extract phone number.
- Map to user.
- Store inbound message.
- Process AI workflow.
- Send outbound response.

Response:
```json
{
  "received": true
}
```

### POST /api/whatsapp/connect

Request:
```json
{
  "phoneNumber": "+13215551212"
}
```

Response:
```json
{
  "status": "pending_opt_in"
}
```

### POST /api/whatsapp/opt-out

Response:
```json
{
  "success": true
}
```

## AI API

### POST /api/ai/message

Internal route for processing user messages.

Request:
```json
{
  "userId": "uuid",
  "conversationId": "uuid",
  "message": "I walked 20 minutes today."
}
```

Response:
```json
{
  "reply": "Great job. I logged your 20-minute walk.",
  "intent": "log_activity",
  "actions": [
    {
      "type": "create_activity_log",
      "durationMinutes": 20
    }
  ]
}
```

### POST /api/ai/daily-plan

Request:
```json
{
  "userId": "uuid",
  "date": "2026-07-05"
}
```

Response:
```json
{
  "planText": "Today's plan...",
  "planJson": {}
}
```

### POST /api/ai/weekly-review

Request:
```json
{
  "userId": "uuid",
  "weekStart": "2026-07-01",
  "weekEnd": "2026-07-07"
}
```

Response:
```json
{
  "reviewText": "This week you...",
  "reviewJson": {}
}
```

## Tracking APIs

### POST /api/logs/meal

Request:
```json
{
  "mealType": "breakfast",
  "description": "Eggs and toast"
}
```

### POST /api/logs/water

Request:
```json
{
  "amount": 2,
  "unit": "cups"
}
```

### POST /api/logs/activity

Request:
```json
{
  "activityType": "walking",
  "durationMinutes": 20,
  "steps": 2500
}
```

### POST /api/logs/sleep

Request:
```json
{
  "sleepDate": "2026-07-05",
  "bedtime": "22:30",
  "wakeTime": "06:30",
  "sleepQuality": 7
}
```

## Admin API

### GET /api/admin/users

Returns users with filters.

### GET /api/admin/users/:id

Returns user detail.

### GET /api/admin/conversations

Returns conversations.

### GET /api/admin/conversations/:id

Returns conversation messages.

### GET /api/admin/flagged-messages

Returns safety flagged messages.

### GET /api/admin/analytics

Returns:
- total users
- active users
- messages sent
- AI token cost
- reminders sent
- weekly reviews generated
- flagged messages

### GET /api/admin/prompts

Returns prompt versions.

### POST /api/admin/prompts

Creates new prompt version.

## Account and Privacy API

### GET /api/privacy/export

Exports user data.

### DELETE /api/account

Deletes/deactivates account and associated data according to retention policy.
