import { z } from "zod";

const timeRegex = /^\d{2}:\d{2}$/;

export const healthProfileSchema = z.object({
  ageRange: z
    .enum(["18-24", "25-34", "35-44", "45-54", "55-64", "65+"])
    .optional(),
  heightValue: z.coerce.number().positive().optional(),
  heightUnit: z.enum(["cm", "ft"]).default("cm"),
  weightValue: z.coerce.number().positive().optional(),
  weightUnit: z.enum(["kg", "lbs"]).default("kg"),
  goalWeightValue: z.coerce.number().positive().optional(),
  goalWeightUnit: z.enum(["kg", "lbs"]).default("kg"),
  dietPreference: z.string().max(100).optional(),
  foodRestrictions: z.array(z.string().max(50)).max(20).optional(),
  activityLevel: z.enum(["low", "moderate", "high"]).optional(),
  wakeTime: z.string().regex(timeRegex).optional(),
  sleepTime: z.string().regex(timeRegex).optional(),
  motivationStyle: z.string().max(200).optional(),
  medicalDisclaimerAccepted: z.boolean(),
});

export const wellnessGoalSchema = z.object({
  goalType: z.enum([
    "nutrition",
    "hydration",
    "walking",
    "sleep",
    "weight_loss",
    "general_wellness",
  ]),
  targetValue: z.coerce.number().positive().optional(),
  targetUnit: z.string().max(20).optional(),
  intensity: z.enum(["low", "moderate", "high"]).default("moderate"),
});

export const goalsSchema = z.object({
  goals: z.array(wellnessGoalSchema).min(1).max(6),
});

export const reminderSchema = z.object({
  reminderType: z.enum([
    "daily_plan",
    "hydration",
    "walking",
    "sleep",
    "weekly_review",
  ]),
  scheduleTime: z.string().regex(timeRegex),
  timezone: z.string().max(60),
  enabled: z.boolean().default(true),
  channel: z.enum(["whatsapp", "sms", "web"]).default("whatsapp"),
});

export const remindersSchema = z.object({
  reminders: z.array(reminderSchema).max(10),
});

export type HealthProfileInput = z.infer<typeof healthProfileSchema>;
export type GoalsInput = z.infer<typeof goalsSchema>;
export type RemindersInput = z.infer<typeof remindersSchema>;

// ─── Log schemas ──────────────────────────────────────────────────────────────

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const mealLogSchema = z.object({
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional(),
  description: z.string().min(1).max(500),
  loggedAt: z.string().datetime().optional(),
});

export const waterLogSchema = z.object({
  amount: z.coerce.number().positive().max(5000),
  unit: z.enum(["ml", "oz", "cups"]).default("ml"),
  loggedAt: z.string().datetime().optional(),
});

export const activityLogSchema = z.object({
  activityType: z
    .enum(["walking", "running", "cycling", "swimming", "gym", "yoga", "other"])
    .default("walking"),
  durationMinutes: z.coerce.number().int().positive().optional(),
  steps: z.coerce.number().int().positive().optional(),
  intensity: z.enum(["low", "moderate", "high"]).optional(),
  notes: z.string().max(300).optional(),
  loggedAt: z.string().datetime().optional(),
});

export const sleepLogSchema = z.object({
  sleepDate: z.string().regex(dateRegex),
  bedtime: z.string().datetime().optional(),
  wakeTime: z.string().datetime().optional(),
  sleepQuality: z.enum(["poor", "fair", "good", "excellent"]).optional(),
  notes: z.string().max(300).optional(),
});

export const habitLogSchema = z.object({
  habitType: z.enum([
    "hydration",
    "sleep",
    "nutrition",
    "exercise",
    "mindfulness",
    "custom",
  ]),
  logDate: z.string().regex(dateRegex),
  completed: z.boolean().default(true),
  notes: z.string().max(300).optional(),
});

export const checkinSchema = z.object({
  checkinDate: z.string().regex(dateRegex),
  mood: z.coerce.number().int().min(1).max(10).optional(),
  energyLevel: z.coerce.number().int().min(1).max(10).optional(),
  notes: z.string().max(500).optional(),
  completed: z.boolean().default(true),
});

export type MealLogInput = z.infer<typeof mealLogSchema>;
export type WaterLogInput = z.infer<typeof waterLogSchema>;
export type ActivityLogInput = z.infer<typeof activityLogSchema>;
export type SleepLogInput = z.infer<typeof sleepLogSchema>;
export type HabitLogInput = z.infer<typeof habitLogSchema>;
export type CheckinInput = z.infer<typeof checkinSchema>;
