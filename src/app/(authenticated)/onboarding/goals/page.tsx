"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GoalType =
  | "nutrition"
  | "hydration"
  | "walking"
  | "sleep"
  | "weight_loss"
  | "general_wellness";

const GOALS: { type: GoalType; label: string; description: string; icon: string }[] = [
  {
    type: "nutrition",
    label: "Eat better",
    description: "Track meals and get nutrition guidance",
    icon: "🥗",
  },
  {
    type: "hydration",
    label: "Drink more water",
    description: "Hit your daily hydration targets",
    icon: "💧",
  },
  {
    type: "walking",
    label: "Move more",
    description: "Build a consistent walking habit",
    icon: "🚶",
  },
  {
    type: "sleep",
    label: "Sleep better",
    description: "Improve your sleep quality and schedule",
    icon: "😴",
  },
  {
    type: "weight_loss",
    label: "Lose weight",
    description: "Gradual, sustainable weight management",
    icon: "⚖️",
  },
  {
    type: "general_wellness",
    label: "General wellness",
    description: "Build healthy habits across the board",
    icon: "🌿",
  },
];

export default function GoalsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<GoalType>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggle(type: GoalType) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  async function handleSubmit() {
    if (selected.size === 0) {
      setError("Pick at least one goal.");
      return;
    }
    setError("");
    setLoading(true);

    const goals = Array.from(selected).map((goalType) => ({
      goalType,
      intensity: "moderate",
    }));

    const res = await fetch("/api/profile/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goals }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Failed to save goals.");
      return;
    }
    router.push("/onboarding/reminders");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Step 3 of 4
          </div>
          <CardTitle className="text-xl">What are your goals?</CardTitle>
          <p className="text-sm text-muted-foreground">
            Pick everything you want to work on. You can change this later.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {GOALS.map((g) => {
              const active = selected.has(g.type);
              return (
                <button
                  key={g.type}
                  type="button"
                  onClick={() => toggle(g.type)}
                  className={`
                    flex items-start gap-3 rounded-lg border p-4 text-left transition-colors
                    ${active
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                    }
                  `}
                >
                  <span className="text-2xl leading-none">{g.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{g.label}</span>
                      {active && (
                        <Badge variant="default" className="text-xs px-1.5 py-0">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {g.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          <Button
            className="w-full"
            disabled={loading || selected.size === 0}
            onClick={handleSubmit}
          >
            {loading ? "Saving…" : `Continue with ${selected.size} goal${selected.size !== 1 ? "s" : ""}`}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
