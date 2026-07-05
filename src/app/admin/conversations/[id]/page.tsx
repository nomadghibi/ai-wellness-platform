import Link from "next/link";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { conversations, messages, users } from "@/server/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [conv] = await db
    .select({ id: conversations.id, channel: conversations.channel, status: conversations.status, userName: users.name, userEmail: users.email })
    .from(conversations)
    .innerJoin(users, eq(conversations.userId, users.id))
    .where(eq(conversations.id, id))
    .limit(1);

  if (!conv) {
    return <p className="text-muted-foreground">Conversation not found.</p>;
  }

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt);

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/conversations" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          ← Back
        </Link>
        <h1 className="text-xl font-bold">Conversation — {conv.userName}</h1>
        <Badge variant="secondary" className="capitalize">{conv.channel}</Badge>
      </div>

      <p className="text-sm text-muted-foreground">{conv.userEmail}</p>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{msgs.length} messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {msgs.length === 0 && (
            <p className="text-sm text-muted-foreground">No messages.</p>
          )}
          {msgs.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.direction === "outbound" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  m.safetyFlag
                    ? "bg-red-100 border border-red-300 dark:bg-red-950"
                    : m.direction === "outbound"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {m.safetyFlag && (
                  <p className="text-xs font-bold text-red-600 mb-1">⚠ SAFETY FLAG</p>
                )}
                <p className="whitespace-pre-wrap">{m.content}</p>
                <p className={`text-xs mt-1 ${m.direction === "outbound" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {" · "}{m.direction}
                  {m.messageType !== "text" && ` · ${m.messageType}`}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
