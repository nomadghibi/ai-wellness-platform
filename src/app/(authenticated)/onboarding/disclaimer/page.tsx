"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DisclaimerPage() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!accepted) return;
    setLoading(true);
    await fetch("/api/profile/health", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ medicalDisclaimerAccepted: true }),
    });
    setLoading(false);
    router.push("/onboarding/profile");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Step 1 of 4
          </div>
          <CardTitle className="text-xl">Health & Safety Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md bg-muted p-4 text-sm space-y-3 leading-relaxed">
            <p>
              This platform provides <strong>general wellness and lifestyle coaching only</strong>.
              It is not a medical service.
            </p>
            <p>
              The AI coach does <strong>not</strong> diagnose, treat, cure, or prevent any
              disease or medical condition. It does not replace your physician, dietitian,
              therapist, or any licensed healthcare professional.
            </p>
            <p>
              Always consult a qualified healthcare provider before making changes to your
              diet, exercise routine, or health habits — especially if you have a medical
              condition, are pregnant, or take medications.
            </p>
            <p>
              If you experience a medical emergency, call your local emergency services
              immediately.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="accept"
              checked={accepted}
              onCheckedChange={(v) => setAccepted(v === true)}
            />
            <label
              htmlFor="accept"
              className="text-sm leading-snug cursor-pointer select-none"
            >
              I understand and agree that this service provides general wellness guidance
              only, and is not a substitute for professional medical advice.
            </label>
          </div>

          <Button
            className="w-full"
            disabled={!accepted || loading}
            onClick={handleContinue}
          >
            {loading ? "Saving…" : "I agree — continue"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
