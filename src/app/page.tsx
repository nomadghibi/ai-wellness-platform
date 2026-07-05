import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: "01",
    title: "Create your profile",
    desc: "Set your health goals, dietary preferences, and daily schedule in under 3 minutes.",
  },
  {
    n: "02",
    title: "Connect WhatsApp",
    desc: "Link your number. Your AI coach appears instantly — no app download required.",
  },
  {
    n: "03",
    title: "Start your journey",
    desc: "Receive your daily plan each morning, log your habits, and get coached in real time.",
  },
];

const FEATURES = [
  {
    icon: "🌅",
    title: "Morning Daily Plan",
    desc: "Personalised nutrition, hydration targets, and a walking goal tailored to your lifestyle — delivered every morning.",
  },
  {
    icon: "💬",
    title: "AI Coach on WhatsApp",
    desc: "Chat naturally. Log a meal, ask for motivation, or get recipe ideas — your coach understands context and remembers you.",
  },
  {
    icon: "💧",
    title: "Hydration Reminders",
    desc: "Smart nudges throughout the day so you never forget to drink water, timed to your schedule.",
  },
  {
    icon: "🚶",
    title: "Walking Coach",
    desc: "Adaptive step targets with encouragement. The coach adjusts based on your energy levels and progress.",
  },
  {
    icon: "📊",
    title: "Live Dashboard",
    desc: "Track meals, water, sleep, and streaks in a clean web dashboard that updates as you log.",
  },
  {
    icon: "📝",
    title: "Weekly AI Review",
    desc: "Every Sunday, get a personalised review of your week — wins, patterns, and a focus for next week.",
  },
];

const TESTIMONIALS = [
  {
    quote: "I've tried every fitness app. This is the first one that actually feels like having a coach who knows me.",
    name: "Sarah K.",
    role: "Lost 8 kg in 3 months",
    avatar: "SK",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    quote: "The WhatsApp integration is genius. I just text it like I text my friends. No friction, no forgetting.",
    name: "Marcus T.",
    role: "Running his first 5K",
    avatar: "MT",
    color: "bg-blue-100 text-blue-700",
  },
  {
    quote: "Weekly reviews changed everything for me. Seeing patterns in my own data is motivating in a way I didn't expect.",
    name: "Priya M.",
    role: "Improved sleep & energy",
    avatar: "PM",
    color: "bg-violet-100 text-violet-700",
  },
];

const STATS = [
  { value: "2,400+", label: "Active users" },
  { value: "180K+", label: "Messages coached" },
  { value: "94%", label: "Report better habits" },
];

// ─── Chat Mockup ──────────────────────────────────────────────────────────────

function ChatMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* phone frame */}
      <div className="rounded-[2rem] border-[6px] border-gray-900 bg-gray-900 shadow-2xl overflow-hidden">
        {/* status bar */}
        <div className="bg-[#075e54] px-5 pt-3 pb-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-300 flex items-center justify-center text-sm font-bold text-emerald-900">
            AI
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">Wellness Coach</p>
            <p className="text-emerald-300 text-xs">online</p>
          </div>
        </div>
        {/* chat area */}
        <div className="bg-[#ece5dd] px-3 py-4 space-y-3 min-h-[320px]">
          <Bubble from="coach" text="Good morning Sarah! ☀️ Here's your plan for today:" />
          <Bubble
            from="coach"
            text="🥗 Aim for 1,600 kcal · 🚶 8,000 steps · 💧 2.5L water"
          />
          <Bubble from="user" text="Already had my oats! 🥣 Around 350 kcal" />
          <Bubble from="coach" text="Great start! That's 22% of your goal. Keep it up 💪" />
          <Bubble from="user" text="Can you suggest a healthy lunch?" />
          <Bubble
            from="coach"
            text="Try grilled chicken with roasted veggies and quinoa — high protein, fits your macros perfectly 🥦"
          />
        </div>
      </div>
      {/* glow */}
      <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-emerald-400/20 blur-2xl" />
    </div>
  );
}

function Bubble({ from, text }: { from: "coach" | "user"; text: string }) {
  return (
    <div className={cn("flex", from === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed shadow-sm",
          from === "coach"
            ? "bg-white text-gray-800 rounded-tl-none"
            : "bg-[#dcf8c6] text-gray-800 rounded-tr-none"
        )}
      >
        {text}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 antialiased">

      {/* ── Nav ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span className="font-bold text-lg tracking-tight">AI Wellness</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-gray-900 transition-colors">Testimonials</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-gray-700")}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "sm" }),
                "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              )}
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 to-white pt-20 pb-24 px-6">
        {/* background orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
          {/* left */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-700 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              2,400+ people coaching with AI today
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight">
              Your personal{" "}
              <span className="text-emerald-600">AI wellness coach</span>{" "}
              — on WhatsApp
            </h1>

            <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
              Daily plans, smart reminders, habit tracking, and weekly reviews.
              No app to download — just chat with your coach.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-emerald-600 hover:bg-emerald-700 text-white px-8 shadow-lg shadow-emerald-200 text-base"
                )}
              >
                Start for free →
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "text-base border-gray-200"
                )}
              >
                Sign in
              </Link>
            </div>

            <p className="text-sm text-gray-400">
              No credit card required · Cancel anytime
            </p>
          </div>

          {/* right — chat mockup */}
          <div className="hidden lg:flex justify-center">
            <ChatMockup />
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50 py-10">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-3 divide-x divide-gray-200 text-center">
            {STATS.map((s) => (
              <div key={s.label} className="px-4">
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="mt-1 text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              How it works
            </p>
            <h2 className="text-4xl font-bold tracking-tight">Up and running in minutes</h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Three steps from signup to your first coaching message.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.n} className="relative group">
                <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-5xl font-black text-gray-100 group-hover:text-emerald-100 transition-colors select-none">
                    {step.n}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              Features
            </p>
            <h2 className="text-4xl font-bold tracking-tight">Everything your coach needs</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 hover:border-emerald-200 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl mb-4 group-hover:bg-emerald-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              Testimonials
            </p>
            <h2 className="text-4xl font-bold tracking-tight">People are feeling the difference</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm flex flex-col gap-6"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                      t.color
                    )}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 px-8 py-16 text-center text-white shadow-2xl shadow-emerald-200">
            <h2 className="text-4xl font-bold tracking-tight">Ready to feel better?</h2>
            <p className="mt-4 text-lg text-emerald-100 max-w-md mx-auto">
              Join thousands of people building healthier habits with their personal AI coach.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-emerald-700 hover:bg-emerald-50 px-8 text-base font-semibold shadow-lg"
                )}
              >
                Get started — it&apos;s free
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "text-white hover:bg-white/10 border border-white/30 text-base"
                )}
              >
                Sign in
              </Link>
            </div>
            <p className="mt-4 text-sm text-emerald-200">
              No credit card required · Takes 3 minutes to set up
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-gray-50 py-10 px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>🌱</span>
            <span className="font-semibold text-gray-800">AI Wellness</span>
            <span className="text-gray-400 text-sm ml-4">© 2025</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
            <a href="mailto:hello@aiwellness.app" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
