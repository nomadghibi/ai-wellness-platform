# Analytics and Metrics

## Product Analytics

Track whether users are building the habit of using the AI coach.

Core Metrics:
- New registrations
- Completed profiles
- WhatsApp connected users
- Daily active users
- Weekly active users
- Messages per user
- Daily plan response rate
- Reminder response rate
- Weekly review completion
- 7-day retention
- 30-day retention

## Wellness Engagement Metrics

Track:
- Meal logs per user
- Water logs per user
- Walking/activity logs per user
- Habit completions
- Streak length
- Goals selected
- Most common goals

## AI Metrics

Track:
- AI calls per day
- Tokens used
- Cost per user
- Average response time
- Failed AI calls
- Agent usage distribution
- Prompt version performance
- Safety flag rate

## Messaging Metrics

Track:
- WhatsApp messages sent
- WhatsApp messages received
- Failed sends
- Opt-outs
- Delivery status, if provider supports it

## Business Metrics

Track:
- Trial starts
- Trial to paid conversion
- Monthly recurring revenue
- Churn
- Customer acquisition cost, later
- Lifetime value, later

## Admin Dashboard MVP

Initial cards:
- Total users
- Active users today
- Messages today
- AI cost today
- Reminders delivered
- Flagged messages
- Weekly reviews generated
- Opt-outs

## Analytics Implementation

MVP:
- Store event rows in PostgreSQL.
- Use simple dashboard queries.

Later:
- Add event analytics pipeline.
- Use PostHog, Plausible, or custom warehouse.
- Add cohort retention.
