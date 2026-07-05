"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WhatsAppSettingsPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [current, setCurrent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/user/phone")
      .then((r) => r.json())
      .then((d) => { if (d.phone) { setCurrent(d.phone); setPhone(d.phone); } });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const cleaned = phone.replace(/\D/g, "");
    const res = await fetch("/api/user/phone", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: cleaned }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to save.");
      return;
    }
    setSuccess(true);
    setCurrent(data.phone);
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Connect WhatsApp</CardTitle>
          {current && (
            <p className="text-sm text-muted-foreground">
              Current: +{current}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-md bg-muted p-4 text-sm space-y-2 leading-relaxed">
            <p>
              Enter your WhatsApp phone number to receive your daily plan,
              reminders, and weekly review.
            </p>
            <p className="text-muted-foreground">
              Include the country code, no spaces or symbols.
              Example: <strong>14155238886</strong> for +1 (415) 523-8886.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="14155238886"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && (
              <p className="text-sm text-green-600">
                ✓ WhatsApp number saved! Redirecting…
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving…" : "Save number"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
