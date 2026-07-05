import { requireAdmin } from "@/server/auth";
import { PROMPTS } from "@/server/ai/prompts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function PromptsPage() {
  await requireAdmin();

  const promptList = Object.entries(PROMPTS).map(([key, p]) => ({
    key,
    name: p.name,
    version: p.version,
    length: p.content.length,
    preview: p.content.slice(0, 120),
    full: p.content,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prompt Library</h1>
        <p className="text-sm text-muted-foreground">
          {promptList.length} prompts · read-only (edit in <code className="text-xs bg-muted px-1 rounded">src/server/ai/prompts.ts</code>)
        </p>
      </div>

      <div className="space-y-4">
        {promptList.map((p) => (
          <Card key={p.key}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <CardTitle className="text-sm font-mono">{p.name}</CardTitle>
                <Badge variant="outline" className="text-xs">v{p.version}</Badge>
                <span className="text-xs text-muted-foreground ml-auto">{p.length} chars</span>
              </div>
            </CardHeader>
            <CardContent>
              <details>
                <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                  {p.preview}…
                </summary>
                <pre className="mt-3 text-xs bg-muted p-3 rounded-md overflow-auto whitespace-pre-wrap leading-relaxed max-h-96">
                  {p.full}
                </pre>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
