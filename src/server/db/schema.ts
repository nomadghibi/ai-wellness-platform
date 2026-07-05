import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  integer,
  decimal,
  jsonb,
  timestamp,
  date,
  time,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "suspended",
]);

export const channelEnum = pgEnum("channel", ["whatsapp", "sms", "web"]);
export const messageDirectionEnum = pgEnum("message_direction", [
  "inbound",
  "outbound",
]);
export const messageTypeEnum = pgEnum("message_type", [
  "text",
  "image",
  "audio",
  "document",
  "template",
]);
export const conversationStatusEnum = pgEnum("conversation_status", [
  "active",
  "closed",
]);

export const aiRunStatusEnum = pgEnum("ai_run_status", ["success", "error"]);
export const memoryTypeEnum = pgEnum("memory_type", [
  "structured",
  "summary",
  "fact",
]);

export const jobStatusEnum = pgEnum("job_status", [
  "pending",
  "running",
  "completed",
  "failed",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
]);
export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "free",
  "basic",
  "pro",
]);

export const orgPlanEnum = pgEnum("org_plan", ["starter", "growth", "enterprise"]);
export const orgStatusEnum = pgEnum("org_status", ["active", "suspended"]);
export const orgMemberRoleEnum = pgEnum("org_member_role", [
  "owner",
  "admin",
  "member",
]);

export const goalTypeEnum = pgEnum("goal_type", [
  "nutrition",
  "hydration",
  "walking",
  "sleep",
  "weight_loss",
  "general_wellness",
]);
export const goalStatusEnum = pgEnum("goal_status", [
  "active",
  "completed",
  "paused",
]);
export const intensityEnum = pgEnum("intensity", ["low", "moderate", "high"]);

export const mealTypeEnum = pgEnum("meal_type", [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
]);
export const activityTypeEnum = pgEnum("activity_type", [
  "walking",
  "running",
  "cycling",
  "swimming",
  "gym",
  "yoga",
  "other",
]);
export const sleepQualityEnum = pgEnum("sleep_quality", [
  "poor",
  "fair",
  "good",
  "excellent",
]);
export const habitTypeEnum = pgEnum("habit_type", [
  "hydration",
  "sleep",
  "nutrition",
  "exercise",
  "mindfulness",
  "custom",
]);
export const reminderTypeEnum = pgEnum("reminder_type", [
  "daily_plan",
  "hydration",
  "walking",
  "sleep",
  "weekly_review",
  "custom",
]);

// ─── Platform Core ────────────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    phone: text("phone"),
    role: userRoleEnum("role").notNull().default("user"),
    status: userStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)]
);

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  plan: orgPlanEnum("plan").notNull().default("starter"),
  status: orgStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const userOrganizations = pgTable(
  "user_organizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: orgMemberRoleEnum("role").notNull().default("member"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("user_org_unique_idx").on(t.userId, t.organizationId),
  ]
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("sessions_user_id_idx").on(t.userId)]
);

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    channel: channelEnum("channel").notNull().default("whatsapp"),
    status: conversationStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("conversations_user_id_idx").on(t.userId)]
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    channel: channelEnum("channel").notNull().default("whatsapp"),
    direction: messageDirectionEnum("direction").notNull(),
    content: text("content").notNull(),
    messageType: messageTypeEnum("message_type").notNull().default("text"),
    providerMessageId: text("provider_message_id"),
    safetyFlag: boolean("safety_flag").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("messages_conversation_id_idx").on(t.conversationId),
    index("messages_user_id_idx").on(t.userId),
    uniqueIndex("messages_provider_message_id_idx").on(t.providerMessageId),
  ]
);

export const aiRuns = pgTable(
  "ai_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    conversationId: uuid("conversation_id").references(() => conversations.id, {
      onDelete: "set null",
    }),
    agentName: text("agent_name").notNull(),
    model: text("model").notNull(),
    promptVersion: text("prompt_version"),
    inputTokens: integer("input_tokens"),
    outputTokens: integer("output_tokens"),
    costEstimate: decimal("cost_estimate", { precision: 10, scale: 6 }),
    latencyMs: integer("latency_ms"),
    status: aiRunStatusEnum("status").notNull().default("success"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("ai_runs_user_id_idx").on(t.userId)]
);

export const aiMemory = pgTable(
  "ai_memory",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    memoryType: memoryTypeEnum("memory_type").notNull().default("structured"),
    key: text("key"),
    valueJson: jsonb("value_json"),
    summaryText: text("summary_text"),
    source: text("source"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("ai_memory_user_id_idx").on(t.userId)]
);

export const reminders = pgTable(
  "reminders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reminderType: reminderTypeEnum("reminder_type").notNull(),
    scheduleTime: time("schedule_time").notNull(),
    timezone: text("timezone").notNull().default("UTC"),
    enabled: boolean("enabled").notNull().default(true),
    channel: channelEnum("channel").notNull().default("whatsapp"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("reminders_user_id_idx").on(t.userId)]
);

export const scheduledJobs = pgTable(
  "scheduled_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobType: text("job_type").notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    status: jobStatusEnum("status").notNull().default("pending"),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
    executedAt: timestamp("executed_at", { withTimezone: true }),
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("scheduled_jobs_status_idx").on(t.status)]
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorUserId: uuid("actor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    entityType: text("entity_type"),
    entityId: text("entity_id"),
    metadataJson: jsonb("metadata_json"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("audit_logs_actor_idx").on(t.actorUserId)]
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    plan: subscriptionPlanEnum("plan").notNull().default("free"),
    provider: text("provider"),
    providerCustomerId: text("provider_customer_id"),
    providerSubscriptionId: text("provider_subscription_id"),
    status: subscriptionStatusEnum("status").notNull().default("active"),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("subscriptions_user_id_idx").on(t.userId)]
);

// ─── Healthy Living Plugin ────────────────────────────────────────────────────

export const healthProfiles = pgTable("health_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  ageRange: text("age_range"),
  heightValue: decimal("height_value", { precision: 5, scale: 2 }),
  heightUnit: text("height_unit").default("cm"),
  weightValue: decimal("weight_value", { precision: 5, scale: 2 }),
  weightUnit: text("weight_unit").default("kg"),
  goalWeightValue: decimal("goal_weight_value", { precision: 5, scale: 2 }),
  goalWeightUnit: text("goal_weight_unit").default("kg"),
  dietPreference: text("diet_preference"),
  foodRestrictions: text("food_restrictions").array(),
  activityLevel: intensityEnum("activity_level"),
  wakeTime: time("wake_time"),
  sleepTime: time("sleep_time"),
  motivationStyle: text("motivation_style"),
  medicalDisclaimerAccepted: boolean("medical_disclaimer_accepted")
    .notNull()
    .default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const wellnessGoals = pgTable(
  "wellness_goals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    goalType: goalTypeEnum("goal_type").notNull(),
    targetValue: decimal("target_value", { precision: 8, scale: 2 }),
    targetUnit: text("target_unit"),
    intensity: intensityEnum("intensity").default("moderate"),
    status: goalStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("wellness_goals_user_id_idx").on(t.userId)]
);

export const dailyPlans = pgTable(
  "daily_plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planDate: date("plan_date").notNull(),
    planText: text("plan_text").notNull(),
    planJson: jsonb("plan_json"),
    generatedByAiRunId: uuid("generated_by_ai_run_id").references(
      () => aiRuns.id,
      { onDelete: "set null" }
    ),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("daily_plans_user_id_idx").on(t.userId),
    uniqueIndex("daily_plans_user_date_idx").on(t.userId, t.planDate),
  ]
);

export const dailyCheckins = pgTable(
  "daily_checkins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    checkinDate: date("checkin_date").notNull(),
    mood: integer("mood"),
    energyLevel: integer("energy_level"),
    notes: text("notes"),
    completed: boolean("completed").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("daily_checkins_user_id_idx").on(t.userId),
    uniqueIndex("daily_checkins_user_date_idx").on(t.userId, t.checkinDate),
  ]
);

export const mealLogs = pgTable(
  "meal_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    loggedAt: timestamp("logged_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    mealType: mealTypeEnum("meal_type"),
    description: text("description").notNull(),
    aiFeedback: text("ai_feedback"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("meal_logs_user_id_idx").on(t.userId)]
);

export const waterLogs = pgTable(
  "water_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    loggedAt: timestamp("logged_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    amount: decimal("amount", { precision: 6, scale: 2 }).notNull(),
    unit: text("unit").notNull().default("ml"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("water_logs_user_id_idx").on(t.userId)]
);

export const activityLogs = pgTable(
  "activity_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    loggedAt: timestamp("logged_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    activityType: activityTypeEnum("activity_type").notNull().default("walking"),
    durationMinutes: integer("duration_minutes"),
    steps: integer("steps"),
    intensity: intensityEnum("intensity"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("activity_logs_user_id_idx").on(t.userId)]
);

export const sleepLogs = pgTable(
  "sleep_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sleepDate: date("sleep_date").notNull(),
    bedtime: timestamp("bedtime", { withTimezone: true }),
    wakeTime: timestamp("wake_time", { withTimezone: true }),
    sleepQuality: sleepQualityEnum("sleep_quality"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("sleep_logs_user_id_idx").on(t.userId)]
);

export const habitLogs = pgTable(
  "habit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    habitType: habitTypeEnum("habit_type").notNull(),
    logDate: date("log_date").notNull(),
    completed: boolean("completed").notNull().default(false),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("habit_logs_user_id_idx").on(t.userId)]
);

export const weeklyReviews = pgTable(
  "weekly_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    weekStart: date("week_start").notNull(),
    weekEnd: date("week_end").notNull(),
    reviewText: text("review_text").notNull(),
    reviewJson: jsonb("review_json"),
    generatedByAiRunId: uuid("generated_by_ai_run_id").references(
      () => aiRuns.id,
      { onDelete: "set null" }
    ),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("weekly_reviews_user_id_idx").on(t.userId),
    uniqueIndex("weekly_reviews_user_week_idx").on(t.userId, t.weekStart),
  ]
);

export const rewardPoints = pgTable(
  "reward_points",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    points: integer("points").notNull(),
    reason: text("reason").notNull(),
    sourceTable: text("source_table"),
    sourceId: uuid("source_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("reward_points_user_id_idx").on(t.userId)]
);

export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon"),
  criteriaJson: jsonb("criteria_json").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const userAchievements = pgTable(
  "user_achievements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    achievementId: uuid("achievement_id")
      .notNull()
      .references(() => achievements.id, { onDelete: "cascade" }),
    awardedAt: timestamp("awarded_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("user_achievements_unique_idx").on(t.userId, t.achievementId),
  ]
);

// ─── Type exports ─────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type HealthProfile = typeof healthProfiles.$inferSelect;
export type NewHealthProfile = typeof healthProfiles.$inferInsert;
export type WellnessGoal = typeof wellnessGoals.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type AiRun = typeof aiRuns.$inferSelect;
export type AiMemory = typeof aiMemory.$inferSelect;
export type DailyPlan = typeof dailyPlans.$inferSelect;
export type DailyCheckin = typeof dailyCheckins.$inferSelect;
export type MealLog = typeof mealLogs.$inferSelect;
export type WaterLog = typeof waterLogs.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type SleepLog = typeof sleepLogs.$inferSelect;
export type HabitLog = typeof habitLogs.$inferSelect;
export type WeeklyReview = typeof weeklyReviews.$inferSelect;
export type RewardPoint = typeof rewardPoints.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
