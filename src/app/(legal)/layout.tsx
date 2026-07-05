import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <Link href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
          ← AI Wellness Platform
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <article className="prose prose-gray max-w-none">{children}</article>
      </main>
    </div>
  );
}
