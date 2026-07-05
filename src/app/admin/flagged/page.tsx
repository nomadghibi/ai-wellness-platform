import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { messages, users, conversations } from "@/server/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function FlaggedPage() {
  await requireAdmin();

  const rows = await db
    .select({
      id: messages.id,
      content: messages.content,
      direction: messages.direction,
      messageType: messages.messageType,
      createdAt: messages.createdAt,
      conversationId: messages.conversationId,
      userName: users.name,
      userEmail: users.email,
    })
    .from(messages)
    .innerJoin(users, eq(messages.userId, users.id))
    .where(eq(messages.safetyFlag, true))
    .orderBy(desc(messages.createdAt))
    .limit(100);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Flagged Messages ({rows.length})</h1>

      {rows.length === 0 && (
        <p className="text-muted-foreground">No flagged messages.</p>
      )}

      <div className="space-y-3">
        {rows.map((m) => (
          <Card key={m.id} className="border-red-300 dark:border-red-800">
            <CardContent className="pt-4 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">{m.userName}</p>
                  <p className="text-xs text-muted-foreground">{m.userEmail}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</p>
                  <p className="text-xs capitalize text-muted-foreground">{m.direction} · {m.messageType}</p>
                </div>
              </div>
              <p className="text-sm bg-red-50 dark:bg-red-950/30 rounded p-2 border border-red-200 dark:border-red-900">
                {m.content}
              </p>
              <Link
                href={`/admin/conversations/${m.conversationId}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                View conversation
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
