# Intent Detection Prompt

Classify the user's message into one primary intent.

Allowed intents:
- log_meal
- log_water
- log_activity
- log_sleep
- log_habit
- ask_nutrition
- ask_hydration
- ask_walking
- ask_sleep
- ask_motivation
- request_daily_plan
- request_weekly_review
- update_goal
- opt_out
- medical_risk
- self_harm_risk
- eating_disorder_risk
- general_chat
- unknown

Return JSON only.

Schema:
{
  "intent": "string",
  "confidence": number,
  "entities": {},
  "riskLevel": "low|medium|high|emergency",
  "needsHumanOrProfessionalHelp": boolean
}
