import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { requireAuth } from "@/server/auth";
import { getDashboardSummary } from "@/server/wellness/profile";
import { db } from "@/server/db";
import { users, weeklyReviews } from "@/server/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function ReviewDetail({ json }: { json: unknown }) {
  if (!json || typeof json !== "object") return null;
  const j = json as { wins?: string[]; challenges?: string[]; nextWeekFocus?: string };
  if (!j.wins?.length && !j.nextWeekFocus) return null;
  return (
    <div className="space-y-2 pt-1 border-t text-sm">
      {j.wins && j.wins.length > 0 && (
        <div><span className="font-medium text-green-600">Wins: </span>{j.wins.join(" · ")}</div>
      )}
      {j.nextWeekFocus && (
        <div><span className="font-medium">Next week: </span>{j.nextWeekFocus}</div>
      )}
    </div>
  );
}

const GOAL_LABELS: Record<string, string> = {
  nutrition: "Eat better",
  hydration: "Drink more water",
  walking: "Move more",
  sleep: "Sleep better",
  weight_loss: "Lose weight",
  general_wellness: "General wellness",
};

export default async function DashboardPage() {
  const user = await requireAuth();
  const [{ profile, goals, reminders, totalPoints, today, checkedInToday }, phoneRow, reviewRow] =
    await Promise.all([
      getDashboardSummary(user.id),
      db.select({ phone: users.phone }).from(users).where(eq(users.id, user.id)).limit(1),
      db.select({ weekStart: weeklyReviews.weekStart, weekEnd: weeklyReviews.weekEnd, reviewText: weeklyReviews.reviewText, reviewJson: weeklyReviews.reviewJson })
        .from(weeklyReviews).where(eq(weeklyReviews.userId, user.id)).orderBy(desc(weeklyReviews.weekStart)).limit(1),
    ]);
  const whatsappPhone = phoneRow[0]?.phone ?? null;
  const latestReview = reviewRow[0] ?? null;

  const onboardingComplete =
    profile?.medicalDisclaimerAccepted && goals.length > 0;

  return (
    <main className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Hi, {user.name?.split(" ")[0] ?? "there"} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm px-3 py-1">
              ⭐ {totalPoints} pts
            </Badge>
            <form action="/api/auth/signout" method="POST">
              <Button variant="ghost" size="sm" type="submit">Sign out</Button>
            </form>
          </div>
        </div>

        {/* Onboarding incomplete banner */}
        {!onboardingComplete && (
          <div className="rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 p-4 flex items-center justify-between gap-4">
            <p className="text-sm font-medium">
              Complete your profile to unlock your AI coach.
            </p>
            <Link
              href={!profile?.medicalDisclaimerAccepted ? "/onboarding/disclaimer" : "/onboarding/goals"}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Continue setup
            </Link>
          </div>
        )}

        {/* Today status stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">Check-in</CardTitle>
            </CardHeader>
            <CardContent>
              {checkedInToday
                ? <p className="text-xl font-bold text-green-600">Done ✓</p>
                : <p className="text-xl font-bold text-muted-foreground">—</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">Meals today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{today.meals.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">Water (ml)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{today.totalWaterMl > 0 ? today.totalWaterMl : "—"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">Steps today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">
                {today.totalSteps > 0 ? today.totalSteps.toLocaleString() : "—"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Points + Goals row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reward points</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalPoints}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Earn points by logging meals, water, activity, and check-ins.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active goals</CardTitle>
              <Link href="/onboarding/goals" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                Edit
              </Link>
            </CardHeader>
            <CardContent>
              {goals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No goals set yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {goals.map((g) => (
                    <Badge key={g.id} variant="secondary">
                      {GOAL_LABELS[g.goalType] ?? g.goalType}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Today's activity detail */}
        {(today.meals.length > 0 || today.totalActivityMin > 0 || today.habitsCompleted > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Today&apos;s activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {today.meals.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Meals logged</span>
                  <span className="font-medium">{today.meals.length}</span>
                </div>
              )}
              {today.totalActivityMin > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active minutes</span>
                  <span className="font-medium">{today.totalActivityMin} min</span>
                </div>
              )}
              {today.habitsCompleted > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Habits completed</span>
                  <span className="font-medium">{today.habitsCompleted}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Reminders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Reminders</CardTitle>
            <Link href="/onboarding/reminders" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Edit
            </Link>
          </CardHeader>
          <CardContent>
            {reminders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reminders configured.</p>
            ) : (
              <div className="space-y-2">
                {reminders.map((r, i) => (
                  <div key={r.id}>
                    {i > 0 && <Separator className="my-2" />}
                    <div className="flex justify-between items-center text-sm">
                      <span className="capitalize">{r.reminderType.replace(/_/g, " ")}</span>
                      <span className="text-muted-foreground font-mono">{String(r.scheduleTime).slice(0, 5)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly review */}
        {latestReview && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Weekly review — {latestReview.weekStart} to {latestReview.weekEnd}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {latestReview.reviewText}
              </p>
              <ReviewDetail json={latestReview.reviewJson} />
            </CardContent>
          </Card>
        )}

        {/* WhatsApp connection */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">WhatsApp</CardTitle>
            <Link href="/settings/whatsapp" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              {whatsappPhone ? "Change" : "Connect"}
            </Link>
          </CardHeader>
          <CardContent className="text-sm">
            {whatsappPhone ? (
              <p className="text-green-600 font-medium">✓ Connected — +{whatsappPhone}</p>
            ) : (
              <p className="text-muted-foreground">
                No WhatsApp number linked. Connect to receive your daily plan and reminders.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Health profile */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Health profile</CardTitle>
            <Link href="/onboarding/profile" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Edit
            </Link>
          </CardHeader>
          <CardContent>
            {!profile ? (
              <p className="text-sm text-muted-foreground">Profile not filled in yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                {profile.ageRange && <><span className="text-muted-foreground">Age range</span><span>{profile.ageRange}</span></>}
                {profile.weightValue && <><span className="text-muted-foreground">Weight</span><span>{profile.weightValue} {profile.weightUnit}</span></>}
                {profile.dietPreference && <><span className="text-muted-foreground">Diet</span><span>{profile.dietPreference}</span></>}
                {profile.activityLevel && <><span className="text-muted-foreground">Activity</span><span className="capitalize">{profile.activityLevel}</span></>}
                {profile.wakeTime && <><span className="text-muted-foreground">Wake time</span><span className="font-mono">{String(profile.wakeTime).slice(0, 5)}</span></>}
                {profile.sleepTime && <><span className="text-muted-foreground">Bedtime</span><span className="font-mono">{String(profile.sleepTime).slice(0, 5)}</span></>}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </main>
  );
}
