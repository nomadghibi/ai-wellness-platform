# Rewards System

## MVP Goal

The rewards system should motivate consistency without creating a complex marketplace.

## MVP Reward Types

1. Points
2. Streaks
3. Achievements

## Point Rules

Suggested MVP rules:

| Action | Points |
|---|---:|
| Log water | 10 |
| Log meal | 10 |
| Log walking/activity | 10 |
| Complete daily plan | 20 |
| Complete evening check-in | 10 |
| 3-day streak | 30 |
| 7-day streak | 50 |
| Weekly review completed | 25 |

## Achievements

Initial achievements:
- First Check-In
- First Walk Completed
- First Meal Logged
- First Water Log
- 3-Day Hydration Streak
- 7-Day Habit Streak
- Weekly Review Completed
- Back on Track
- Consistency Builder

## Reward Messages

Example:
```text
Nice work — you earned 10 points for logging your walk. Your consistency is building.
```

Example:
```text
Achievement unlocked: 3-Day Hydration Streak. Small habits are adding up.
```

## Database

Tables:
- reward_points
- achievements
- user_achievements

## Rules Engine

Keep it simple at first:
- Trigger points after log creation.
- Check streaks once per day.
- Award achievements only once.
- Store every point event for auditability.

## Phase 2 Reward Expansion

Later:
- Partner offers
- Coupons
- Reward redemption
- Employer wellness incentives
- Gym/nutritionist perks
- Custom reward catalogs
