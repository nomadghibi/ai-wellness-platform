import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: "💬",
    title: "WhatsApp Coaching",
    desc: "Your AI coach lives in WhatsApp — no app to install.",
  },
  {
    icon: "🥗",
    title: "Daily Plans",
    desc: "Personalised nutrition, hydration, and walking targets every morning.",
  },
  {
    icon: "📊",
    title: "Habit Tracking",
    desc: "Log meals, water, sleep, and activity in seconds.",
  },
  {
    icon: "📝",
    title: "Weekly Reviews",
    desc: "AI-generated insights on your progress every Sunday.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-lg tracking-tight">AI Wellness</span>
        <div className="flex gap-3">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
        <span className="text-4xl">🌱</span>
        <h1 className="text-4xl font-bold tracking-tight max-w-xl leading-tight">
          Your personal AI wellness coach — on WhatsApp
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Daily plans, habit tracking, and weekly reviews. No app to download.
          Just message your coach.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
            Start for free
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-4xl grid grid-cols-1 gap-8 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-4 text-center text-xs text-muted-foreground flex gap-4 justify-center">
        <Link href="/privacy" className="hover:underline">Privacy</Link>
        <Link href="/terms" className="hover:underline">Terms</Link>
      </footer>
    </div>
  );
}
