"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Tab = "meal" | "water" | "activity" | "sleep" | "checkin";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "meal", label: "Meal", icon: "🥗" },
  { id: "water", label: "Water", icon: "💧" },
  { id: "activity", label: "Activity", icon: "🏃" },
  { id: "sleep", label: "Sleep", icon: "😴" },
  { id: "checkin", label: "Check-in", icon: "✅" },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ─── Forms ────────────────────────────────────────────────────────────────────

function MealForm({ onSaved }: { onSaved: () => void }) {
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/logs/meal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mealType, description }),
    });
    setSaving(false);
    if (!res.ok) { setError("Failed to save."); return; }
    setDescription("");
    onSaved();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Meal type</Label>
        <div className="flex gap-2 flex-wrap">
          {(["breakfast", "lunch", "dinner", "snack"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setMealType(t)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                mealType === t
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="meal-desc">What did you eat?</Label>
        <Input
          id="meal-desc"
          placeholder="e.g. Grilled chicken with salad"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700">
        {saving ? "Saving…" : "Log meal (+10 pts)"}
      </Button>
    </form>
  );
}

function WaterForm({ onSaved }: { onSaved: () => void }) {
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState<"ml" | "oz" | "cups">("ml");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const QUICK = unit === "ml"
    ? [{ label: "250 ml", v: 250 }, { label: "500 ml", v: 500 }, { label: "750 ml", v: 750 }]
    : unit === "oz"
    ? [{ label: "8 oz", v: 8 }, { label: "16 oz", v: 16 }, { label: "32 oz", v: 32 }]
    : [{ label: "1 cup", v: 1 }, { label: "2 cups", v: 2 }, { label: "3 cups", v: 3 }];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/logs/water", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(amount), unit }),
    });
    setSaving(false);
    if (!res.ok) { setError("Failed to save."); return; }
    setAmount("");
    onSaved();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Unit</Label>
        <div className="flex gap-2">
          {(["ml", "oz", "cups"] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                unit === u ? "bg-emerald-600 text-white border-emerald-600" : "border-gray-200 hover:border-gray-300"
              )}
            >
              {u}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        {QUICK.map((q) => (
          <button
            key={q.v}
            type="button"
            onClick={() => setAmount(String(q.v))}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium flex-1 transition-colors",
              amount === String(q.v) ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-200 hover:border-gray-300"
            )}
          >
            {q.label}
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="water-amount">Amount ({unit})</Label>
        <Input
          id="water-amount"
          type="number"
          min="1"
          step="1"
          placeholder={unit === "ml" ? "500" : unit === "oz" ? "16" : "2"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700">
        {saving ? "Saving…" : "Log water (+10 pts)"}
      </Button>
    </form>
  );
}

function ActivityForm({ onSaved }: { onSaved: () => void }) {
  const [activityType, setActivityType] = useState<"walking" | "running" | "cycling" | "gym" | "yoga" | "other">("walking");
  const [duration, setDuration] = useState("");
  const [steps, setSteps] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/logs/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activityType,
        durationMinutes: duration ? parseInt(duration) : undefined,
        steps: steps ? parseInt(steps) : undefined,
        intensity: "moderate",
      }),
    });
    setSaving(false);
    if (!res.ok) { setError("Failed to save."); return; }
    setDuration(""); setSteps("");
    onSaved();
  }

  const ACTIVITIES = ["walking", "running", "cycling", "gym", "yoga", "other"] as const;

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Activity type</Label>
        <div className="flex gap-2 flex-wrap">
          {ACTIVITIES.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setActivityType(a)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                activityType === a ? "bg-emerald-600 text-white border-emerald-600" : "border-gray-200 hover:border-gray-300"
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="duration">Duration (min)</Label>
          <Input id="duration" type="number" min="1" placeholder="30" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="steps">Steps (optional)</Label>
          <Input id="steps" type="number" min="0" placeholder="8000" value={steps} onChange={(e) => setSteps(e.target.value)} />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={saving || !duration} className="w-full bg-emerald-600 hover:bg-emerald-700">
        {saving ? "Saving…" : "Log activity (+10 pts)"}
      </Button>
    </form>
  );
}

function SleepForm({ onSaved }: { onSaved: () => void }) {
  const [sleepDate, setSleepDate] = useState(today());
  const [quality, setQuality] = useState<"poor" | "fair" | "good" | "excellent">("good");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/logs/sleep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sleepDate, sleepQuality: quality }),
    });
    setSaving(false);
    if (!res.ok) { setError("Failed to save."); return; }
    onSaved();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="sleep-date">Night of</Label>
        <Input id="sleep-date" type="date" value={sleepDate} onChange={(e) => setSleepDate(e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label>Sleep quality</Label>
        <div className="flex gap-2 flex-wrap">
          {(["poor", "fair", "good", "excellent"] as const).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuality(q)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                quality === q ? "bg-emerald-600 text-white border-emerald-600" : "border-gray-200 hover:border-gray-300"
              )}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700">
        {saving ? "Saving…" : "Log sleep (+10 pts)"}
      </Button>
    </form>
  );
}

function CheckinForm({ onSaved }: { onSaved: () => void }) {
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/logs/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkinDate: today(),
        mood,
        energyLevel: energy,
        completed: true,
      }),
    });
    setSaving(false);
    if (!res.ok) { setError("Failed to save."); return; }
    onSaved();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="space-y-3">
        <Label>Mood (1 = low, 5 = great)</Label>
        <div className="flex gap-3 justify-between">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setMood(v)}
              className={cn(
                "w-12 h-12 rounded-full border-2 text-lg font-bold transition-colors",
                mood === v ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-gray-200 hover:border-gray-300"
              )}
            >
              {["😞", "😕", "😐", "🙂", "😄"][v - 1]}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Label>Energy (1 = exhausted, 5 = energised)</Label>
        <div className="flex gap-3 justify-between">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setEnergy(v)}
              className={cn(
                "w-12 h-12 rounded-full border-2 text-lg font-bold transition-colors",
                energy === v ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-gray-200 hover:border-gray-300"
              )}
            >
              {["⚡", "🔋", "⚡", "🔋", "⚡"][v - 1]}{v}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700">
        {saving ? "Saving…" : "Complete check-in (+10 pts)"}
      </Button>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LogPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("meal");
  const [saved, setSaved] = useState<string | null>(null);

  function onSaved() {
    setSaved(TABS.find((t) => t.id === tab)?.label ?? "Log");
    setTimeout(() => { setSaved(null); router.refresh(); }, 2000);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-lg space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Log today</h1>
          <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            ← Dashboard
          </a>
        </div>

        {saved && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            ✓ {saved} logged! +10 pts
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-0.5 rounded-lg py-2 text-xs font-medium transition-colors",
                tab === t.id ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <span className="text-base">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {TABS.find((t) => t.id === tab)?.icon}{" "}
              Log {TABS.find((t) => t.id === tab)?.label.toLowerCase()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tab === "meal" && <MealForm onSaved={onSaved} />}
            {tab === "water" && <WaterForm onSaved={onSaved} />}
            {tab === "activity" && <ActivityForm onSaved={onSaved} />}
            {tab === "sleep" && <SleepForm onSaved={onSaved} />}
            {tab === "checkin" && <CheckinForm onSaved={onSaved} />}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
