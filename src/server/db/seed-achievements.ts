import "dotenv/config";
import { db } from "./index";
import { achievements } from "./schema";
import { sql } from "drizzle-orm";

const ACHIEVEMENTS = [
  {
    code: "first_meal",
    name: "First Meal Logged",
    description: "Logged your very first meal.",
    icon: "🥗",
    criteriaJson: { type: "first_event", table: "meal_logs" },
  },
  {
    code: "first_water",
    name: "First Water Log",
    description: "Logged water for the first time.",
    icon: "💧",
    criteriaJson: { type: "first_event", table: "water_logs" },
  },
  {
    code: "first_walk",
    name: "First Walk Completed",
    description: "Logged your first walking activity.",
    icon: "🚶",
    criteriaJson: { type: "first_event", table: "activity_logs", activityType: "walking" },
  },
  {
    code: "first_checkin",
    name: "First Check-In",
    description: "Completed your first daily check-in.",
    icon: "✅",
    criteriaJson: { type: "first_event", table: "daily_checkins" },
  },
  {
    code: "hydration_3day",
    name: "3-Day Hydration Streak",
    description: "Logged water for 3 days in a row.",
    icon: "🌊",
    criteriaJson: { type: "streak", table: "water_logs", days: 3 },
  },
  {
    code: "hydration_7day",
    name: "7-Day Hydration Streak",
    description: "Logged water every day for a week.",
    icon: "🏆",
    criteriaJson: { type: "streak", table: "water_logs", days: 7 },
  },
  {
    code: "habit_7day",
    name: "7-Day Habit Streak",
    description: "Logged something every day for 7 days straight.",
    icon: "🔥",
    criteriaJson: { type: "active_streak", days: 7 },
  },
  {
    code: "weekly_review",
    name: "Weekly Review Completed",
    description: "Received your first AI weekly review.",
    icon: "📝",
    criteriaJson: { type: "first_event", table: "weekly_reviews" },
  },
  {
    code: "back_on_track",
    name: "Back on Track",
    description: "Logged after a 3+ day gap — consistency wins.",
    icon: "💪",
    criteriaJson: { type: "return_after_gap", days: 3 },
  },
  {
    code: "consistency_builder",
    name: "Consistency Builder",
    description: "Active for 30 days total.",
    icon: "🌟",
    criteriaJson: { type: "total_active_days", days: 30 },
  },
];

async function seed() {
  console.log("Seeding achievements…");
  for (const a of ACHIEVEMENTS) {
    await db
      .insert(achievements)
      .values({ ...a, criteriaJson: a.criteriaJson })
      .onConflictDoUpdate({
        target: achievements.code,
        set: {
          name: sql`excluded.name`,
          description: sql`excluded.description`,
          icon: sql`excluded.icon`,
          criteriaJson: sql`excluded.criteria_json`,
        },
      });
    console.log(`  ✓ ${a.code}`);
  }
  console.log("Done.");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
