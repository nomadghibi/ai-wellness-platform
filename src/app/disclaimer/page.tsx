import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Health & Safety Disclaimer — AI Wellness Platform",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <Link href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
          ← AI Wellness Platform
        </Link>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-12 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Health &amp; Safety Disclaimer</h1>
          <p className="mt-1 text-sm text-gray-500">Please read before using this service.</p>
        </div>

        <div className="rounded-lg border bg-white p-6 text-sm leading-relaxed space-y-4 text-gray-700">
          <p>
            <strong>AI Wellness Platform provides general wellness and lifestyle coaching only.</strong>{" "}
            It is not a medical service, and nothing on this platform constitutes medical advice,
            diagnosis, or treatment.
          </p>
          <p>
            The AI coach does <strong>not</strong> diagnose, treat, cure, or prevent any disease
            or medical condition. It cannot replace your physician, dietitian, therapist, or any
            licensed healthcare professional.
          </p>
          <p>
            Always consult a qualified healthcare provider before making changes to your diet,
            exercise routine, or health habits — especially if you have an existing medical
            condition, are pregnant, nursing, or take prescription medications.
          </p>
          <p>
            Information provided by the AI coach is based on general wellness principles and your
            self-reported data. It may not be appropriate for your specific circumstances. Use
            your own judgement and seek professional guidance when in doubt.
          </p>
          <p className="font-semibold text-red-700">
            If you experience a medical emergency, call your local emergency services (e.g. 911,
            999, 112) immediately. Do not rely on this platform in an emergency.
          </p>
        </div>

        <div className="flex gap-4 text-sm">
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            Create an account →
          </Link>
          <Link href="/privacy" className="text-gray-500 hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-gray-500 hover:underline">
            Terms of Service
          </Link>
        </div>
      </main>
    </div>
  );
}
