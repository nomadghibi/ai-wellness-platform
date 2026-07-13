import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "2,400+", label: "Active users" },
  { value: "180K+", label: "Messages coached" },
  { value: "94%", label: "Report better habits" },
  { value: "4.9★", label: "Average rating" },
];

const PROBLEMS = [
  { icon: "📱", text: "You download an app, use it for 3 days, and forget it exists" },
  { icon: "🧠", text: "Generic advice that ignores your schedule, goals, and lifestyle" },
  { icon: "📊", text: "Dashboards you have to remember to open — no one nudges you" },
  { icon: "💸", text: "Expensive subscriptions before you've seen any results" },
];

const STEPS = [
  {
    n: "01",
    title: "Create your profile",
    desc: "Set your health goals, dietary preferences, wake time, and daily schedule in under 3 minutes.",
    detail: "No lengthy forms. Just the essentials your coach needs to personalise every message.",
  },
  {
    n: "02",
    title: "Connect WhatsApp",
    desc: "Link your number. Your AI coach appears instantly — no app download, no new account.",
    detail: "Works on any phone, anywhere in the world. Just like texting a friend.",
  },
  {
    n: "03",
    title: "Start your journey",
    desc: "Receive your daily plan every morning. Log habits, ask questions, get coached in real time.",
    detail: "Your coach remembers everything you share and gets smarter about you over time.",
  },
];

const FEATURES = [
  {
    icon: "🌅",
    title: "Morning Daily Plan",
    desc: "Personalised nutrition targets, hydration goals, and a walking target — delivered every morning before you start your day.",
  },
  {
    icon: "💬",
    title: "Conversational AI Coach",
    desc: "Log a meal, ask for recipe ideas, or just vent about a hard day. Your coach understands context and actually responds.",
  },
  {
    icon: "💧",
    title: "Smart Hydration Reminders",
    desc: "Timed nudges throughout the day so you never forget water — scheduled around your routine, not a generic alarm.",
  },
  {
    icon: "🚶",
    title: "Adaptive Walking Coach",
    desc: "Step targets that adjust to your energy and progress. The coach celebrates wins and recalibrates after tough days.",
  },
  {
    icon: "📊",
    title: "Live Dashboard",
    desc: "Track meals, water, sleep, and streaks in a clean web dashboard that updates the moment you log anything.",
  },
  {
    icon: "📝",
    title: "Weekly AI Review",
    desc: "Every Sunday, a personalised review of your week — what worked, patterns to watch, and one focus for the week ahead.",
  },
  {
    icon: "🏆",
    title: "Rewards & Streaks",
    desc: "Points for every log, streak badges for consistency, and achievements that mark real milestones in your journey.",
  },
  {
    icon: "🛡️",
    title: "Safety-First AI",
    desc: "The coach recognises medical emergencies and immediately redirects you to professional care — never plays doctor.",
  },
];

const TESTIMONIALS = [
  {
    quote: "I've tried every fitness app. This is the first one that actually feels like having a coach who knows me. I just text it like a human.",
    name: "Sarah K.",
    role: "Lost 8 kg in 3 months",
    avatar: "SK",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    quote: "The WhatsApp integration is genius. No new app to remember. I just open my messages and my coach is already there. Zero friction.",
    name: "Marcus T.",
    role: "Running his first 5K",
    avatar: "MT",
    color: "bg-blue-100 text-blue-700",
  },
  {
    quote: "Weekly reviews changed everything. Seeing patterns in my own data — when I sleep badly I eat worse — is motivating in a way I didn't expect.",
    name: "Priya M.",
    role: "Better sleep & energy",
    avatar: "PM",
    color: "bg-violet-100 text-violet-700",
  },
];

const COMPARISON = [
  { feature: "Works where you already are (WhatsApp)", us: true, them: false },
  { feature: "Remembers your history & context", us: true, them: false },
  { feature: "Daily personalised plan every morning", us: true, them: false },
  { feature: "Real-time conversational coaching", us: true, them: false },
  { feature: "Weekly AI-written progress review", us: true, them: false },
  { feature: "No app download required", us: true, them: false },
  { feature: "Adapts to your schedule", us: true, them: false },
  { feature: "Free to start", us: true, them: false },
];

const FAQS = [
  {
    q: "How does the WhatsApp coaching actually work?",
    a: "Once you link your WhatsApp number, our AI coach sends you a personalised daily plan every morning. You reply naturally — log what you ate, ask for advice, or just chat. The coach reads every message, remembers your context, and responds like a real person who's been following your journey.",
  },
  {
    q: "Do I need to download an app?",
    a: "No. Everything happens inside WhatsApp, which you almost certainly already have. The web dashboard at aiwellness.app is optional — it's there for a visual overview of your streaks and progress, but all the coaching runs through WhatsApp.",
  },
  {
    q: "Is my health data private?",
    a: "Yes. Your data is stored securely, never sold to third parties, and you can download or delete everything at any time from Settings. We follow GDPR principles regardless of where you're based.",
  },
  {
    q: "What if I message something concerning?",
    a: "The AI has a safety layer that detects medical emergencies and distress signals. If you mention chest pain, suicidal thoughts, or similar, the coach immediately stops giving wellness advice and directs you to emergency services or a qualified professional.",
  },
  {
    q: "Can I pause or cancel?",
    a: "Text STOP to your coach number at any time to pause all messages. You can delete your account from Settings — we anonymise your data immediately. No cancellation hoops, no email required.",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function ChatMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <div className="rounded-[2.5rem] border-[7px] border-gray-900 bg-gray-900 shadow-2xl overflow-hidden">
        {/* status bar */}
        <div className="bg-[#075e54] px-4 pt-3 pb-2.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-300 flex items-center justify-center text-xs font-black text-emerald-900">
            AI
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold leading-tight">Wellness Coach</p>
            <p className="text-emerald-300 text-xs">online</p>
          </div>
          <div className="flex gap-3 text-white opacity-60 text-xs">
            <span>📞</span>
            <span>⋮</span>
          </div>
        </div>
        {/* chat background */}
        <div
          className="px-3 py-4 space-y-2.5 min-h-[340px]"
          style={{ background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ece5dd' width='100' height='100'/%3E%3C/svg%3E\")", backgroundColor: "#ece5dd" }}
        >
          <Bubble from="coach" text="Good morning Sarah! ☀️ Here's your plan for today:" time="07:31" />
          <Bubble from="coach" text="🥗 1,600 kcal · 🚶 8,000 steps · 💧 2.5L water" time="07:31" />
          <Bubble from="user" text="Already had my oats! Around 350 kcal 🥣" time="07:45" />
          <Bubble from="coach" text="Great start — that's 22% of your goal. Keep it up 💪" time="07:45" />
          <Bubble from="user" text="What's a good lunch?" time="12:12" />
          <Bubble from="coach" text="Grilled chicken + roasted veggies + quinoa. High protein, fits your macros perfectly 🥦" time="12:12" />
        </div>
      </div>
      <div className="absolute -inset-6 -z-10 rounded-[3.5rem] bg-emerald-400/25 blur-3xl" />
    </div>
  );
}

function Bubble({
  from,
  text,
  time,
}: {
  from: "coach" | "user";
  text: string;
  time: string;
}) {
  return (
    <div className={cn("flex", from === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[82%] rounded-xl px-3 py-1.5 text-[11px] leading-relaxed shadow-sm",
          from === "coach"
            ? "bg-white text-gray-800 rounded-tl-none"
            : "bg-[#dcf8c6] text-gray-800 rounded-tr-none"
        )}
      >
        <p>{text}</p>
        <p className="text-right text-[9px] text-gray-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

function Check({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-sm font-bold">✓</span>
  ) : (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-sm">✕</span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 antialiased">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span className="font-bold text-lg tracking-tight">AI Wellness</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
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

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white pt-20 pb-28 px-6">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-200/25 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/3 pointer-events-none" />
        <div className="absolute top-10 right-0 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-700 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              2,400+ people coaching with AI today
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-[1.07] tracking-tight">
              Your personal{" "}
              <span className="text-emerald-600">AI wellness coach</span>
              {" "}— lives in WhatsApp
            </h1>

            <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
              Daily plans, smart reminders, real-time coaching, and weekly reviews.
              No app to download. Just open WhatsApp and text your coach.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-emerald-600 hover:bg-emerald-700 text-white px-8 shadow-lg shadow-emerald-200 text-base"
                )}
              >
                Start free — takes 3 minutes →
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> No credit card</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> No app download</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Cancel with one text</span>
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <ChatMockup />
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50 py-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 text-center">
            {STATS.map((s) => (
              <div key={s.label} className="px-4 py-2">
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="mt-1 text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
            Sound familiar?
          </p>
          <h2 className="text-4xl font-bold tracking-tight">
            Most wellness apps are designed to be downloaded, not used
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            You know what to do. Eat better, move more, sleep enough. The problem is remembering to open the app, staying consistent, and getting advice that actually fits your life.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {PROBLEMS.map((p) => (
              <div key={p.text} className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                <span className="text-xl mt-0.5">{p.icon}</span>
                <p className="text-sm text-gray-700 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution bridge ─────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-emerald-600 text-white">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            What if your coach lived where you already spend your time?
          </h2>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            AI Wellness coaches you through WhatsApp — the app you open 23 times a day. No new habits, no new logins. Your coach is already in your pocket.
          </p>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              How it works
            </p>
            <h2 className="text-4xl font-bold tracking-tight">Up and running in 3 minutes</h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Three steps from signup to your first coaching message.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.n} className="relative group">
                <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all h-full">
                  <span className="text-6xl font-black text-gray-100 group-hover:text-emerald-100 transition-colors select-none leading-none">
                    {step.n}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-gray-700 leading-relaxed font-medium">{step.desc}</p>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-emerald-600 hover:bg-emerald-700 text-white px-10 shadow-lg shadow-emerald-200 text-base"
              )}
            >
              Get started free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              Features
            </p>
            <h2 className="text-4xl font-bold tracking-tight">Everything your coach needs to help you</h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Built for daily use, not demo screenshots.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 hover:border-emerald-200 hover:shadow-md transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-xl mb-4 group-hover:bg-emerald-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-base">{f.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              Why AI Wellness
            </p>
            <h2 className="text-4xl font-bold tracking-tight">Not your average wellness app</h2>
          </div>

          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100 text-sm font-semibold">
              <div className="p-4 text-gray-500">Feature</div>
              <div className="p-4 text-center text-emerald-700 bg-emerald-50">🌱 AI Wellness</div>
              <div className="p-4 text-center text-gray-500">Other apps</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.feature}
                className={cn(
                  "grid grid-cols-3 text-sm border-b border-gray-50",
                  i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                )}
              >
                <div className="p-4 text-gray-700">{row.feature}</div>
                <div className="p-4 flex justify-center bg-emerald-50/30">
                  <Check ok={row.us} />
                </div>
                <div className="p-4 flex justify-center">
                  <Check ok={row.them} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 px-6 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              Real results
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
                <p className="text-gray-700 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
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

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              Pricing
            </p>
            <h2 className="text-4xl font-bold tracking-tight">Start free. Upgrade when you&apos;re ready.</h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              No credit card required to start. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-8 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">Free</h3>
                <span className="text-xs font-semibold bg-emerald-600 text-white px-2.5 py-1 rounded-full">Current plan</span>
              </div>
              <p className="text-4xl font-black mt-2">$0<span className="text-base font-normal text-gray-500">/mo</span></p>
              <p className="text-gray-500 text-sm mt-1">Forever free while in early access</p>
              <ul className="mt-6 space-y-3 flex-1">
                {[
                  "Daily personalised morning plan",
                  "Real-time WhatsApp coaching",
                  "Hydration + walking reminders",
                  "Weekly AI review",
                  "Web dashboard with streaks",
                  "Up to 50 AI messages/day",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-emerald-600 font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-base"
                )}
              >
                Start free →
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 flex flex-col opacity-80">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">Pro</h3>
                <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full">Coming soon</span>
              </div>
              <p className="text-4xl font-black mt-2">$9<span className="text-base font-normal text-gray-500">/mo</span></p>
              <p className="text-gray-500 text-sm mt-1">Everything in Free, plus:</p>
              <ul className="mt-6 space-y-3 flex-1">
                {[
                  "Unlimited AI messages",
                  "Meal photo analysis",
                  "Nutrition macro tracking",
                  "Sleep quality coaching",
                  "Multiple WhatsApp numbers",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-gray-300 font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                disabled
                className="mt-8 w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed"
              >
                Notify me when available
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6 bg-gray-50">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-12 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              FAQ
            </p>
            <h2 className="text-4xl font-bold tracking-tight">Questions? Answered.</h2>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-gray-200 bg-white overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none font-medium text-gray-900 hover:text-emerald-700 transition-colors">
                  {faq.q}
                  <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200 text-lg leading-none">
                    ↓
                  </span>
                </summary>
                <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 px-8 py-20 text-center text-white shadow-2xl shadow-emerald-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <p className="text-emerald-200 text-sm font-semibold uppercase tracking-widest mb-4">
                Ready to feel better?
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Your coach is waiting in WhatsApp
              </h2>
              <p className="mt-4 text-lg text-emerald-100 max-w-md mx-auto">
                Join 2,400+ people who started their wellness journey with a 3-minute signup.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "bg-white text-emerald-700 hover:bg-emerald-50 px-10 text-base font-semibold shadow-lg"
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
              <p className="mt-5 text-sm text-emerald-200">
                No credit card · No app download · Cancel with one text
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
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
            <Link href="/disclaimer" className="hover:text-gray-900 transition-colors">Disclaimer</Link>
            <a href="mailto:hello@aiwellness.app" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
