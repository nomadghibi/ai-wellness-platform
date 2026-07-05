# WhatsApp Integration

## Recommended Provider

Use Meta WhatsApp Cloud API for long-term control.

Alternative:
- Twilio WhatsApp for faster prototype, but higher abstraction and potential cost.

## WhatsApp Responsibilities

The WhatsApp channel must support:
- User opt-in
- Inbound message webhook
- Outbound messages
- Daily plans
- Reminders
- Weekly reviews
- Opt-out
- Delivery status tracking if available

## User Opt-In Flow

1. User enters phone number in web portal.
2. User sees consent message.
3. User receives or sends initial WhatsApp opt-in message.
4. System verifies phone number.
5. System stores WhatsApp channel status as active.

## Required Consent

User must explicitly agree to:
- Receive WhatsApp messages.
- Receive wellness reminders.
- Understand message/data privacy.
- Understand this is not medical advice.

## Inbound Message Flow

```text
WhatsApp
  ↓
POST /api/whatsapp/webhook
  ↓
Verify signature
  ↓
Parse message
  ↓
Find user by phone
  ↓
Store message
  ↓
AI orchestration
  ↓
Send reply
```

## Outbound Message Types

- Daily plan
- Hydration reminder
- Walking reminder
- Meal logging prompt
- Evening check-in
- Weekly review
- Achievement message
- Safety response
- Opt-out confirmation

## Example Daily Plan

```text
Good morning, Fred. Here is your simple plan for today:

1. Drink 6 cups of water.
2. Walk for 20 minutes.
3. Add protein to one meal.
4. Stop eating 2 hours before bed.

Reply anytime with what you ate, drank, or walked.
```

## Example Hydration Reminder

```text
Quick hydration check: have you had water in the last 2 hours? Reply "1 cup" or "2 cups" and I’ll log it.
```

## Example Walking Reminder

```text
Small movement goal: a 10-minute walk today is enough to keep your streak alive. Want to do it now or later?
```

## Opt-Out Handling

If user sends:
- STOP
- UNSUBSCRIBE
- CANCEL
- QUIT

System must:
- Stop reminders.
- Mark WhatsApp channel inactive.
- Send confirmation.

Example:
```text
You are opted out of wellness reminders. You can re-enable them from your dashboard anytime.
```

## Safety Messages

If the user mentions urgent symptoms:
```text
I’m not a medical professional, but chest pain, severe shortness of breath, fainting, or signs of stroke can be urgent. Please call emergency services or seek immediate medical care now.
```

## WhatsApp Template Messages

For business-initiated messages, approved templates may be required.

Template categories:
- Daily plan reminder
- Weekly review
- Re-engagement
- Opt-in confirmation

## Database Mapping

Add user messaging fields:
- whatsapp_phone_number
- whatsapp_status
- whatsapp_opted_in_at
- whatsapp_opted_out_at
- whatsapp_last_message_at

These can be in a separate `user_channels` table later.

## Production Notes

- Validate webhook signature.
- Make webhook idempotent.
- Do not process duplicate provider message IDs.
- Queue AI response generation if needed.
- Send quick acknowledgment if AI latency is high.
- Log failed sends.
