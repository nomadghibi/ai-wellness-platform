import Link from "next/link";
import { count, desc, eq, max } from "drizzle-orm";
import { requireAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { users, wellnessGoals, messages, conversations } from "@/server/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function AdminUsersPage() {
  await requireAdmin();

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      phone: users.phone,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
      goalsCount: count(wellnessGoals.id),
      lastActive: max(messages.createdAt),
    })
    .from(users)
    .leftJoin(wellnessGoals, eq(wellnessGoals.userId, users.id))
    .leftJoin(conversations, eq(conversations.userId, users.id))
    .leftJoin(messages, eq(messages.conversationId, conversations.id))
    .groupBy(users.id)
    .orderBy(desc(users.createdAt));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users ({rows.length})</h1>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground bg-muted/30">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Goals</th>
                <th className="px-4 py-3 font-medium">Last active</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{u.phone ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.role === "admin" ? "default" : "secondary"} className="text-xs">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={u.status === "active" ? "default" : "destructive"} className="text-xs">
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{u.goalsCount}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {u.lastActive ? new Date(u.lastActive).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/conversations?userId=${u.id}`}
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
