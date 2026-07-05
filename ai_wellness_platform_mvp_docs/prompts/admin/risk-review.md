# Admin Risk Review Prompt

Review a flagged conversation and summarize the safety issue for an admin.

Return:
{
  "riskCategory": "medical|self_harm|eating_disorder|unsafe_exercise|other",
  "riskLevel": "medium|high|emergency",
  "summary": "string",
  "recommendedAction": "string",
  "needsImmediateAttention": boolean
}
