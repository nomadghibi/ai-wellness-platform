import Link from "next/link";
import { count, desc, eq, max } from "drizzle-orm";
import { requireAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { conversations, messages, users } from "@/server/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function AdminConversationsPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  await requireAdmin();
  const { userId } = await searchParams;

  const rows = await db
    .select({
      id: conversations.id,
      channel: conversations.channel,
      status: conversations.status,
      updatedAt: conversations.updatedAt,
      userName: users.name,
      userEmail: users.email,
      userId: users.id,
      msgCount: count(messages.id),
      lastMsg: max(messages.createdAt),
    })
    .from(conversations)
    .innerJoin(users, eq(conversations.userId, users.id))
    .leftJoin(messages, eq(messages.conversationId, conversations.id))
    .where(userId ? eq(conversations.userId, userId) : undefined)
    .groupBy(conversations.id, users.id)
    .orderBy(desc(conversations.updatedAt))
    .limit(100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Conversations ({rows.length}){userId && " (filtered)"}
        </h1>
        {userId && (
          <Link href="/admin/conversations" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Clear filter
          </Link>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground bg-muted/30">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Channel</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Messages</th>
                <th className="px-4 py-3 font-medium">Last message</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No conversations.</td></tr>
              )}
              {rows.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <p className="font-medium">{c.userName}</p>
                    <p className="text-xs text-muted-foreground">{c.userEmail}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{c.channel}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.status === "active" ? "default" : "secondary"} className="text-xs">
                      {c.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{c.msgCount}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {c.lastMsg ? new Date(c.lastMsg).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/conversations/${c.id}`}
                      className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
