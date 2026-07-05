import { count, desc, eq, sql, sum } from "drizzle-orm";
import { requireAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { aiRuns } from "@/server/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AiCostsPage() {
  await requireAdmin();

  const [totals, byAgent, byModel, recentErrors] = await Promise.all([
    db.select({
      totalRuns: count(),
      totalInput: sum(aiRuns.inputTokens),
      totalOutput: sum(aiRuns.outputTokens),
      totalCost: sum(aiRuns.costEstimate),
    }).from(aiRuns),

    db.select({
      agentName: aiRuns.agentName,
      runs: count(),
      inputTokens: sum(aiRuns.inputTokens),
      outputTokens: sum(aiRuns.outputTokens),
      cost: sum(aiRuns.costEstimate),
    })
      .from(aiRuns)
      .groupBy(aiRuns.agentName)
      .orderBy(desc(sum(aiRuns.costEstimate))),

    db.select({
      model: aiRuns.model,
      runs: count(),
      cost: sum(aiRuns.costEstimate),
    })
      .from(aiRuns)
      .groupBy(aiRuns.model)
      .orderBy(desc(sum(aiRuns.costEstimate))),

    db.select({
      agentName: aiRuns.agentName,
      model: aiRuns.model,
      latencyMs: aiRuns.latencyMs,
      createdAt: aiRuns.createdAt,
    })
      .from(aiRuns)
      .where(eq(aiRuns.status, "error"))
      .orderBy(desc(aiRuns.createdAt))
      .limit(10),
  ]);

  const t = totals[0];
  const totalCost = parseFloat(String(t?.totalCost ?? "0")) || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Cost Analytics</h1>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total runs", value: t?.totalRuns ?? 0 },
          { label: "Input tokens", value: (Number(t?.totalInput ?? 0)).toLocaleString() },
          { label: "Output tokens", value: (Number(t?.totalOutput ?? 0)).toLocaleString() },
          { label: "Total cost", value: `$${totalCost.toFixed(5)}` },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs text-muted-foreground">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* By agent */}
      <Card>
        <CardHeader><CardTitle className="text-base">Cost by agent</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground bg-muted/30">
                <th className="px-4 py-3 font-medium">Agent</th>
                <th className="px-4 py-3 font-medium">Runs</th>
                <th className="px-4 py-3 font-medium">Input tokens</th>
                <th className="px-4 py-3 font-medium">Output tokens</th>
                <th className="px-4 py-3 font-medium">Cost</th>
              </tr>
            </thead>
            <tbody>
              {byAgent.map((r) => (
                <tr key={r.agentName} className="border-b last:border-0">
                  <td className="px-4 py-2 font-mono text-xs">{r.agentName}</td>
                  <td className="px-4 py-2">{r.runs}</td>
                  <td className="px-4 py-2">{Number(r.inputTokens ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-2">{Number(r.outputTokens ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-2 font-medium">${(parseFloat(String(r.cost ?? "0")) || 0).toFixed(5)}</td>
                </tr>
              ))}
              {byAgent.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">No AI runs yet.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* By model */}
      <Card>
        <CardHeader><CardTitle className="text-base">Cost by model</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground bg-muted/30">
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium">Runs</th>
                <th className="px-4 py-3 font-medium">Cost</th>
              </tr>
            </thead>
            <tbody>
              {byModel.map((r) => (
                <tr key={r.model} className="border-b last:border-0">
                  <td className="px-4 py-2 font-mono text-xs">{r.model}</td>
                  <td className="px-4 py-2">{r.runs}</td>
                  <td className="px-4 py-2">${(parseFloat(String(r.cost ?? "0")) || 0).toFixed(5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Recent errors */}
      {recentErrors.length > 0 && (
        <Card className="border-red-300">
          <CardHeader><CardTitle className="text-base text-red-600">Recent AI errors</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground bg-muted/30">
                  <th className="px-4 py-3 font-medium">Agent</th>
                  <th className="px-4 py-3 font-medium">Model</th>
                  <th className="px-4 py-3 font-medium">Latency</th>
                  <th className="px-4 py-3 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {recentErrors.map((r, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-4 py-2 font-mono text-xs">{r.agentName}</td>
                    <td className="px-4 py-2 text-xs">{r.model}</td>
                    <td className="px-4 py-2 text-xs">{r.latencyMs ? `${r.latencyMs}ms` : "—"}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
