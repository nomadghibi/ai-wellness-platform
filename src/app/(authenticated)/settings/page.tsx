"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    setDeleting(true);
    setError("");
    const res = await fetch("/api/user/delete", { method: "DELETE" });
    if (!res.ok) {
      setDeleting(false);
      setError("Failed to delete account. Please try again.");
      return;
    }
    // Sign out and redirect
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-semibold">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/settings/whatsapp"
              className="block text-sm text-blue-600 hover:underline"
            >
              Manage WhatsApp connection →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Legal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Link href="/privacy" className="block text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="block text-blue-600 hover:underline">
              Terms of Service
            </Link>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Deleting your account is permanent. Your personal data will be anonymised and your
              WhatsApp connection removed.
            </p>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {confirm && (
              <p className="text-sm font-medium text-destructive">
                Are you sure? Click again to confirm permanent deletion.
              </p>
            )}

            <Separator />

            <Button
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Deleting…" : confirm ? "Yes, delete my account" : "Delete account"}
            </Button>

            {confirm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirm(false)}
                className="ml-2"
              >
                Cancel
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
