import { count, eq, gte, sum } from "drizzle-orm";
import { requireAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { users, conversations, messages, aiRuns, scheduledJobs } from "@/server/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  await requireAdmin();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    userCount,
    activeConvCount,
    flaggedCount,
    todayMsgCount,
    aiCostRow,
    recentJobs,
  ] = await Promise.all([
    db.select({ c: count() }).from(users),
    db.select({ c: count() }).from(conversations).where(eq(conversations.status, "active")),
    db.select({ c: count() }).from(messages).where(eq(messages.safetyFlag, true)),
    db.select({ c: count() }).from(messages).where(gte(messages.createdAt, todayStart)),
    db.select({ total: sum(aiRuns.costEstimate) }).from(aiRuns),
    db.select({ jobType: scheduledJobs.jobType, status: scheduledJobs.status, executedAt: scheduledJobs.executedAt, error: scheduledJobs.error })
      .from(scheduledJobs)
      .orderBy(scheduledJobs.createdAt)
      .limit(10),
  ]);

  const totalCost = parseFloat(String(aiCostRow[0]?.total ?? "0")) || 0;

  const stats = [
    { label: "Total users", value: userCount[0]?.c ?? 0 },
    { label: "Active conversations", value: activeConvCount[0]?.c ?? 0 },
    { label: "Messages today", value: todayMsgCount[0]?.c ?? 0 },
    { label: "Flagged messages", value: flaggedCount[0]?.c ?? 0, warn: (flaggedCount[0]?.c ?? 0) > 0 },
    { label: "Total AI cost", value: `$${totalCost.toFixed(4)}` },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label} className={s.warn ? "border-orange-400" : ""}>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${s.warn ? "text-orange-500" : ""}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {recentJobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No jobs run yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Executed</th>
                  <th className="pb-2 font-medium">Error</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((j, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-1.5 font-mono text-xs">{j.jobType}</td>
                    <td className="py-1.5">
                      <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                        j.status === "completed" ? "bg-green-100 text-green-700" :
                        j.status === "failed" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>{j.status}</span>
                    </td>
                    <td className="py-1.5 text-muted-foreground text-xs">
                      {j.executedAt ? new Date(j.executedAt).toLocaleString() : "—"}
                    </td>
                    <td className="py-1.5 text-red-500 text-xs max-w-xs truncate">{j.error ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
