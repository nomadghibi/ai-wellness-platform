"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type ReminderType = "daily_plan" | "hydration" | "walking" | "sleep" | "weekly_review";

interface ReminderConfig {
  enabled: boolean;
  scheduleTime: string;
}

const REMINDER_DEFS: { type: ReminderType; label: string; defaultTime: string }[] = [
  { type: "daily_plan", label: "Daily plan (morning)", defaultTime: "07:30" },
  { type: "hydration", label: "Hydration reminder (midday)", defaultTime: "12:00" },
  { type: "walking", label: "Walking reminder (afternoon)", defaultTime: "15:00" },
  { type: "sleep", label: "Wind-down reminder (evening)", defaultTime: "21:30" },
  { type: "weekly_review", label: "Weekly review (Sunday)", defaultTime: "09:00" },
];

function guessTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

export default function RemindersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [configs, setConfigs] = useState<Record<ReminderType, ReminderConfig>>(
    Object.fromEntries(
      REMINDER_DEFS.map((d) => [d.type, { enabled: true, scheduleTime: d.defaultTime }])
    ) as Record<ReminderType, ReminderConfig>
  );

  function toggle(type: ReminderType, enabled: boolean) {
    setConfigs((c) => ({ ...c, [type]: { ...c[type], enabled } }));
  }

  function setTime(type: ReminderType, scheduleTime: string) {
    setConfigs((c) => ({ ...c, [type]: { ...c[type], scheduleTime } }));
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);

    const timezone = guessTimezone();
    const reminders = REMINDER_DEFS
      .filter((d) => configs[d.type].enabled)
      .map((d) => ({
        reminderType: d.type,
        scheduleTime: configs[d.type].scheduleTime,
        timezone,
        enabled: true,
        channel: "whatsapp" as const,
      }));

    const res = await fetch("/api/profile/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reminders }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Failed to save reminders.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Step 4 of 4
          </div>
          <CardTitle className="text-xl">Set your reminders</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your coach will send these to WhatsApp. Adjust the times to fit your day.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-4">
            {REMINDER_DEFS.map((def, i) => (
              <div key={def.type}>
                {i > 0 && <Separator className="mb-4" />}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={def.type}
                      checked={configs[def.type].enabled}
                      onCheckedChange={(v) => toggle(def.type, v === true)}
                    />
                    <Label
                      htmlFor={def.type}
                      className="cursor-pointer font-normal text-sm"
                    >
                      {def.label}
                    </Label>
                  </div>
                  <Input
                    type="time"
                    value={configs[def.type].scheduleTime}
                    onChange={(e) => setTime(def.type, e.target.value)}
                    disabled={!configs[def.type].enabled}
                    className="w-32 disabled:opacity-40"
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Your timezone will be detected automatically. You can change all reminders
            from your dashboard later.
          </p>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          <Button className="w-full" disabled={loading} onClick={handleSubmit}>
            {loading ? "Saving…" : "Finish setup — go to dashboard"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
