# Database Schema Design

## Schema Strategy

Separate the database into two logical areas:

1. Platform Core
2. Healthy Living Coach Plugin

This makes the platform reusable for future AI coaching products.

## Platform Core Tables

### users

Stores account-level user identity.

Fields:
- id
- email
- password_hash
- name
- role
- status
- created_at
- updated_at

### organizations

Reserved for future B2B/B2B2C model.

Fields:
- id
- name
- slug
- plan
- status
- created_at
- updated_at

### user_organizations

Maps users to organizations.

Fields:
- id
- user_id
- organization_id
- role
- created_at

### sessions

Stores secure session data if using custom auth.

Fields:
- id
- user_id
- token_hash
- expires_at
- created_at

### conversations

Stores conversation threads.

Fields:
- id
- user_id
- channel
- status
- created_at
- updated_at

### messages

Stores inbound and outbound messages.

Fields:
- id
- conversation_id
- user_id
- channel
- direction
- content
- message_type
- provider_message_id
- safety_flag
- created_at

### ai_runs

Logs AI calls.

Fields:
- id
- user_id
- conversation_id
- agent_name
- model
- prompt_version
- input_tokens
- output_tokens
- cost_estimate
- latency_ms
- status
- created_at

### ai_memory

Stores structured and summary memory.

Fields:
- id
- user_id
- memory_type
- key
- value_json
- summary_text
- source
- created_at
- updated_at

### reminders

Stores reminder configuration.

Fields:
- id
- user_id
- reminder_type
- schedule_time
- timezone
- enabled
- channel
- created_at
- updated_at

### scheduled_jobs

Tracks background jobs.

Fields:
- id
- job_type
- user_id
- status
- scheduled_at
- executed_at
- error
- created_at

### audit_logs

Tracks security-sensitive/admin actions.

Fields:
- id
- actor_user_id
- action
- entity_type
- entity_id
- metadata_json
- created_at

### subscriptions

Stores subscription state.

Fields:
- id
- user_id
- plan
- provider
- provider_customer_id
- provider_subscription_id
- status
- current_period_end
- created_at
- updated_at

## Healthy Living Plugin Tables

### health_profiles

Stores wellness profile information.

Fields:
- id
- user_id
- age_range
- height_value
- height_unit
- weight_value
- weight_unit
- goal_weight_value
- goal_weight_unit
- diet_preference
- food_restrictions
- activity_level
- wake_time
- sleep_time
- motivation_style
- medical_disclaimer_accepted
- created_at
- updated_at

### wellness_goals

Stores user goals.

Fields:
- id
- user_id
- goal_type
- target_value
- target_unit
- intensity
- status
- created_at
- updated_at

### daily_plans

Stores AI-generated daily plans.

Fields:
- id
- user_id
- plan_date
- plan_text
- plan_json
- generated_by_ai_run_id
- created_at

### daily_checkins

Stores overall daily check-in summaries.

Fields:
- id
- user_id
- checkin_date
- mood
- energy_level
- notes
- completed
- created_at
- updated_at

### meal_logs

Stores meal logs.

Fields:
- id
- user_id
- logged_at
- meal_type
- description
- ai_feedback
- created_at

### water_logs

Stores water intake.

Fields:
- id
- user_id
- logged_at
- amount
- unit
- created_at

### activity_logs

Stores walking/activity.

Fields:
- id
- user_id
- logged_at
- activity_type
- duration_minutes
- steps
- intensity
- notes
- created_at

### sleep_logs

Stores sleep habits.

Fields:
- id
- user_id
- sleep_date
- bedtime
- wake_time
- sleep_quality
- notes
- created_at

### habit_logs

Stores habit completion.

Fields:
- id
- user_id
- habit_type
- log_date
- completed
- notes
- created_at

### weekly_reviews

Stores AI weekly reviews.

Fields:
- id
- user_id
- week_start
- week_end
- review_text
- review_json
- generated_by_ai_run_id
- created_at

### reward_points

Stores points events.

Fields:
- id
- user_id
- points
- reason
- source_table
- source_id
- created_at

### achievements

Defines available achievements.

Fields:
- id
- code
- name
- description
- icon
- criteria_json
- active
- created_at

### user_achievements

Maps achievements to users.

Fields:
- id
- user_id
- achievement_id
- awarded_at

## Important Design Rule

Do not put all wellness data into one giant JSON column. Use structured tables for key logs and use JSON only for flexible plan/review metadata.

## Future Extensions

- partner_offers
- reward_redemptions
- wearable_connections
- meal_photo_analysis
- coach_notes
- organization_members
- employer_programs
