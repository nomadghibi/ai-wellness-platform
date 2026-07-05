"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
const DIET_OPTIONS = [
  "No preference",
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Keto",
  "Paleo",
  "Mediterranean",
  "Gluten-free",
  "Halal",
  "Kosher",
];
const MOTIVATION_STYLES = [
  "Gentle encouragement",
  "Direct and structured",
  "Data-driven accountability",
  "Positive reinforcement",
];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [form, setForm] = useState({
    ageRange: "",
    heightValue: "",
    heightUnit: "cm",
    weightValue: "",
    weightUnit: "kg",
    goalWeightValue: "",
    goalWeightUnit: "kg",
    dietPreference: "",
    activityLevel: "moderate",
    wakeTime: "07:00",
    sleepTime: "23:00",
    motivationStyle: "",
  });

  function set(key: keyof typeof form, value: string | null) {
    setForm((f) => ({ ...f, [key]: value ?? "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const payload = {
      medicalDisclaimerAccepted: true,
      ...form,
      heightValue: form.heightValue ? parseFloat(form.heightValue) : undefined,
      weightValue: form.weightValue ? parseFloat(form.weightValue) : undefined,
      goalWeightValue: form.goalWeightValue
        ? parseFloat(form.goalWeightValue)
        : undefined,
      ageRange: form.ageRange || undefined,
      dietPreference: form.dietPreference || undefined,
      motivationStyle: form.motivationStyle || undefined,
    };

    const res = await fetch("/api/profile/health", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setErrors(data.issues ?? {});
      return;
    }
    router.push("/onboarding/goals");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Step 2 of 4
          </div>
          <CardTitle className="text-xl">Your Health Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Age range */}
            <div className="space-y-1.5">
              <Label>Age range</Label>
              <Select value={form.ageRange} onValueChange={(v) => set("ageRange", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  {AGE_RANGES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Height */}
            <div className="space-y-1.5">
              <Label>Height (optional)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  placeholder="e.g. 175"
                  value={form.heightValue}
                  onChange={(e) => set("heightValue", e.target.value)}
                  className="flex-1"
                />
                <Select value={form.heightUnit} onValueChange={(v) => set("heightUnit", v)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="ft">ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.heightValue && (
                <p className="text-xs text-destructive">{errors.heightValue[0]}</p>
              )}
            </div>

            {/* Weight */}
            <div className="space-y-1.5">
              <Label>Current weight (optional)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  placeholder="e.g. 75"
                  value={form.weightValue}
                  onChange={(e) => set("weightValue", e.target.value)}
                  className="flex-1"
                />
                <Select value={form.weightUnit} onValueChange={(v) => set("weightUnit", v)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Goal weight */}
            <div className="space-y-1.5">
              <Label>Goal weight (optional)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  placeholder="e.g. 70"
                  value={form.goalWeightValue}
                  onChange={(e) => set("goalWeightValue", e.target.value)}
                  className="flex-1"
                />
                <Select value={form.goalWeightUnit} onValueChange={(v) => set("goalWeightUnit", v)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Diet */}
            <div className="space-y-1.5">
              <Label>Diet preference</Label>
              <Select value={form.dietPreference} onValueChange={(v) => set("dietPreference", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select diet preference" />
                </SelectTrigger>
                <SelectContent>
                  {DIET_OPTIONS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Activity level */}
            <div className="space-y-1.5">
              <Label>Current activity level</Label>
              <Select value={form.activityLevel} onValueChange={(v) => set("activityLevel", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low — mostly sedentary</SelectItem>
                  <SelectItem value="moderate">Moderate — light exercise</SelectItem>
                  <SelectItem value="high">High — regular intense exercise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sleep times */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="wakeTime">Wake time</Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={form.wakeTime}
                  onChange={(e) => set("wakeTime", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sleepTime">Bedtime</Label>
                <Input
                  id="sleepTime"
                  type="time"
                  value={form.sleepTime}
                  onChange={(e) => set("sleepTime", e.target.value)}
                />
              </div>
            </div>

            {/* Motivation */}
            <div className="space-y-1.5">
              <Label>Coaching style preference</Label>
              <Select value={form.motivationStyle} onValueChange={(v) => set("motivationStyle", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="How should the coach talk to you?" />
                </SelectTrigger>
                <SelectContent>
                  {MOTIVATION_STYLES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving…" : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
