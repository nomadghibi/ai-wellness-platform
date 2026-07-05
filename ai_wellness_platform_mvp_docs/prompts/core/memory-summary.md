# Memory Summary Prompt

Summarize useful long-term coaching memory from the recent user activity.

Extract only information that improves future wellness coaching.

Do not store random small talk.

Return JSON:
{
  "profileSummary": "string",
  "progressSummary": "string",
  "preferences": [],
  "barriers": [],
  "motivationStyle": "string",
  "nextWeekFocus": [],
  "riskNotes": []
}
