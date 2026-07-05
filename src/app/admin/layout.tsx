import Link from "next/link";
import { requireAdmin } from "@/server/auth";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/conversations", label: "Conversations" },
  { href: "/admin/flagged", label: "Flagged" },
  { href: "/admin/ai-costs", label: "AI Costs" },
  { href: "/admin/prompts", label: "Prompts" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen flex">
      <aside className="w-52 shrink-0 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Admin</p>
          <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground mt-1 block">
            ← User dashboard
          </Link>
        </div>
        <nav className="flex-1 p-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
