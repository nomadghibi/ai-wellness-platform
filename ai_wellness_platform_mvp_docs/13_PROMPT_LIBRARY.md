# Prompt Library

## Prompt Management Strategy

Prompts should be stored as versioned files or database records.

Recommended file structure:

```text
/prompts
  /core
    system-safety.md
    intent-detection.md
    main-coach.md
    memory-summary.md
  /wellness
    nutrition-coach.md
    hydration-coach.md
    walking-coach.md
    sleep-coach.md
    habit-coach.md
    daily-plan.md
    weekly-review.md
  /admin
    risk-review.md
```

## Prompt Versioning

Every AI run should log:
- prompt name
- prompt version
- model
- tokens
- cost
- latency
- status

## Core Prompt Rules

All prompts must enforce:

1. General wellness guidance only.
2. No diagnosis.
3. No medication or prescription advice.
4. No emergency advice except urgent escalation.
5. No extreme diet or dangerous exercise plans.
6. Respect user goals and preferences.
7. Keep WhatsApp replies concise.
8. Use supportive, practical language.

## Response Style

WhatsApp messages should be:
- Short
- Direct
- Encouraging
- Easy to act on
- Usually under 100 words

## Safety Disclaimer

Use when appropriate:

```text
I can help with general wellness habits, but I’m not a medical professional. For medical conditions, medication questions, severe symptoms, pregnancy, eating disorders, or urgent concerns, please contact a qualified healthcare professional.
```

## Prompt Files Included

See the `/prompts` folder.
