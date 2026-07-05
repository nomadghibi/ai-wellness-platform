import { createMealLog, createWaterLog, createActivityLog, createSleepLog, createHabitLog, upsertCheckin } from "@/server/wellness/logs";

export interface Action {
  type:
    | "log_meal"
    | "log_water"
    | "log_activity"
    | "log_sleep"
    | "log_habit"
    | "complete_checkin";
  data: Record<string, unknown>;
}

export async function executeActions(userId: string, actions: Action[]): Promise<void> {
  if (!actions || actions.length === 0) return;

  const today = new Date().toISOString().slice(0, 10);

  for (const action of actions) {
    try {
      switch (action.type) {
        case "log_meal":
          await createMealLog(userId, {
            description: String(action.data.description ?? ""),
            mealType: action.data.mealType as "breakfast" | "lunch" | "dinner" | "snack" | undefined,
          });
          break;

        case "log_water":
          await createWaterLog(userId, {
            amount: Number(action.data.amount ?? 250),
            unit: (action.data.unit as "ml" | "oz" | "cups") ?? "ml",
          });
          break;

        case "log_activity":
          await createActivityLog(userId, {
            activityType: (action.data.activityType as "walking" | "running" | "cycling" | "swimming" | "gym" | "yoga" | "other") ?? "walking",
            durationMinutes: action.data.durationMinutes
              ? Number(action.data.durationMinutes)
              : undefined,
            steps: action.data.steps ? Number(action.data.steps) : undefined,
            intensity: action.data.intensity as "low" | "moderate" | "high" | undefined,
            notes: action.data.notes as string | undefined,
          });
          break;

        case "log_sleep":
          await createSleepLog(userId, {
            sleepDate: (action.data.sleepDate as string) ?? today,
            sleepQuality: action.data.sleepQuality as
              | "poor"
              | "fair"
              | "good"
              | "excellent"
              | undefined,
            notes: action.data.notes as string | undefined,
          });
          break;

        case "log_habit":
          await createHabitLog(userId, {
            habitType: (action.data.habitType as "hydration" | "sleep" | "nutrition" | "exercise" | "mindfulness" | "custom") ?? "custom",
            logDate: today,
            completed: Boolean(action.data.completed ?? true),
            notes: action.data.notes as string | undefined,
          });
          break;

        case "complete_checkin":
          await upsertCheckin(userId, {
            checkinDate: today,
            mood: action.data.mood ? Number(action.data.mood) : undefined,
            energyLevel: action.data.energyLevel
              ? Number(action.data.energyLevel)
              : undefined,
            notes: action.data.notes as string | undefined,
            completed: true,
          });
          break;

        default:
          console.warn(`[Actions] Unknown action type: ${(action as Action).type}`);
      }
    } catch (err) {
      console.error(`[Actions] Failed to execute ${action.type}:`, err);
    }
  }
}
