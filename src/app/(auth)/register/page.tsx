"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setGlobalError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (data.issues) {
        setErrors(data.issues);
      } else {
        setGlobalError(data.error ?? "Registration failed.");
      }
      return;
    }

    router.push("/login?registered=1");
  }

  function field(key: keyof typeof form, label: string, type = "text") {
    return (
      <div className="space-y-1">
        <label htmlFor={key} className="text-sm font-medium">{label}</label>
        <input
          id={key}
          type={type}
          required
          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        />
        {errors[key]?.map((msg) => (
          <p key={msg} className="text-xs text-destructive">{msg}</p>
        ))}
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm">Start your wellness journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {field("name", "Full name")}
          {field("email", "Email", "email")}
          {field("password", "Password", "password")}

          <p className="text-xs text-muted-foreground">
            Min 8 characters, one uppercase letter, one number.
          </p>

          {globalError && (
            <p className="text-sm text-destructive text-center">{globalError}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
