# Memory Design

## Memory Goal

Memory makes the AI feel personal without sending the entire chat history to the LLM.

The system should use structured memory and summaries.

## Three Memory Layers

### 1. Profile Memory

Long-term stable information.

Examples:
- Name
- Age range
- Height
- Weight
- Goal
- Diet preference
- Food restrictions
- Activity level
- Wake time
- Sleep time
- Motivation style
- Reminder preferences

Storage:
- `health_profiles`
- `wellness_goals`
- selected entries in `ai_memory`

### 2. Daily Memory

Short-term current-day activity.

Examples:
- Water consumed today
- Meals logged today
- Walking minutes today
- Sleep quality
- Mood
- Completed habits

Storage:
- `meal_logs`
- `water_logs`
- `activity_logs`
- `sleep_logs`
- `habit_logs`
- `daily_checkins`

### 3. Summary Memory

AI-generated summaries that compress patterns over time.

Examples:
- User struggles with evening snacking.
- User responds well to direct encouragement.
- User prefers short morning plans.
- User is more consistent with walking than hydration.
- User often misses weekends.

Storage:
- `ai_memory`

## Memory Types

### user_profile_summary

A short profile summary used in most AI prompts.

Example:
```text
Fred wants to improve hydration and walking consistency. He prefers practical, direct coaching and short reminders. He is currently light activity level and responds well to small daily goals.
```

### weekly_progress_summary

Generated after weekly review.

Example:
```text
This week the user logged water on 5 of 7 days and walked 4 days. Biggest barrier was evening fatigue. Best success was morning reminders.
```

### preference_memory

Examples:
- Prefers walking after dinner.
- Likes Mediterranean-style meals.
- Dislikes long explanations.
- Wants reminders at 8 AM.

### risk_memory

Use carefully.

Examples:
- User mentioned knee pain; avoid aggressive walking suggestions.
- User mentioned diabetes; always recommend clinician guidance for medical nutrition questions.

## Memory Retrieval Rules

For each AI response, load:

1. User profile
2. Active goals
3. Today’s logs
4. Latest weekly summary
5. Relevant preference memory
6. Recent 5 to 10 messages only if needed

Do not load full history by default.

## Memory Update Rules

Update memory when:
- User changes goals.
- User mentions a strong preference.
- User repeatedly logs a pattern.
- Weekly review is generated.
- User gives feedback about coaching style.

Do not store:
- Random small talk
- Unverified medical claims as facts
- Highly sensitive details unless necessary for safety
- Excessively personal information unrelated to wellness

## Memory Summarization Prompt Output

Expected JSON:

```json
{
  "profileSummary": "string",
  "progressSummary": "string",
  "preferences": [
    {
      "key": "preferred_reminder_style",
      "value": "short and direct"
    }
  ],
  "barriers": [
    "misses water goal in afternoon"
  ],
  "nextWeekFocus": [
    "drink water before lunch",
    "walk 10 minutes after dinner"
  ],
  "riskNotes": []
}
```

## Cost Control

Memory reduces token usage by:
- Avoiding full history.
- Using summaries.
- Storing structured logs.
- Sending only necessary context.

## Important Safety Note

Memory must never cause the AI to act like a clinician. If memory includes health conditions, use it only to make safer disclaimers and encourage professional care.
