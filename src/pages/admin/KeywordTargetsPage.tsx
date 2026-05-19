import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, ExternalLink, Search, Target } from "lucide-react";

type KeywordTarget = {
  id: string;
  keyword: string;
  entity: string;
  category: string;
  priority: number;
  sentiment_target: string;
  assigned_module: string;
  active: boolean;
  suppression_page_path: string | null;
};

const sentimentColor: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  suppress: "destructive",
  promote: "default",
  replace: "secondary",
  monitor: "outline",
};

export default function KeywordTargetsPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const { data = [], isLoading } = useQuery({
    queryKey: ["keyword-targets"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("keyword_targets")
        .select("*")
        .order("priority", { ascending: true })
        .order("entity")
        .order("keyword");
      if (error) throw error;
      return (data ?? []) as KeywordTarget[];
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await (supabase as any)
        .from("keyword_targets")
        .update({ active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["keyword-targets"] });
      toast.success("Updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Update failed"),
  });

  const filtered = useMemo(() => {
    let rows = data;
    if (tab === "active") rows = rows.filter((r) => r.active);
    else if (tab === "negative") rows = rows.filter((r) => r.sentiment_target === "suppress");
    else if (tab === "positive") rows = rows.filter((r) => r.sentiment_target === "promote");
    else if (tab === "unmapped") rows = rows.filter((r) => !r.suppression_page_path && r.sentiment_target !== "monitor");
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.keyword.toLowerCase().includes(q) ||
          r.entity.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [data, search, tab]);

  const stats = useMemo(() => {
    const total = data.length;
    const active = data.filter((r) => r.active).length;
    const negatives = data.filter((r) => r.sentiment_target === "suppress").length;
    const positives = data.filter((r) => r.sentiment_target === "promote").length;
    const mapped = data.filter((r) => r.suppression_page_path).length;
    return { total, active, negatives, positives, mapped };
  }, [data]);

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Keyword Targets
            </h1>
            <p className="text-sm text-muted-foreground">
              Master suppression & promotion map — every tracked keyword and the on-site page positioned to outrank it.
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/requiem")}>
          Open Requiem
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total },
          { label: "Active", value: stats.active },
          { label: "Negatives", value: stats.negatives },
          { label: "Positives", value: stats.positives },
          { label: "Mapped to page", value: stats.mapped },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="text-xs uppercase text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suppression map</CardTitle>
          <CardDescription>
            Negatives are routed to the positive cluster page that should outrank them. Toggle{" "}
            <span className="font-medium">Active</span> to enroll a keyword in its assigned module (Requiem / AutoSEO / SERP monitor).
          </CardDescription>
          <div className="flex gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search keyword, entity, category…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="negative">Negative</TabsTrigger>
              <TabsTrigger value="positive">Positive</TabsTrigger>
              <TabsTrigger value="unmapped">Unmapped</TabsTrigger>
            </TabsList>
            <TabsContent value={tab} className="mt-4">
              {isLoading ? (
                <div className="text-sm text-muted-foreground py-8 text-center">Loading…</div>
              ) : filtered.length === 0 ? (
                <div className="text-sm text-muted-foreground py-8 text-center">No keywords match.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-xs uppercase text-muted-foreground border-b">
                      <tr>
                        <th className="py-2 pr-4">Keyword</th>
                        <th className="py-2 pr-4">Entity</th>
                        <th className="py-2 pr-4">P</th>
                        <th className="py-2 pr-4">Sentiment</th>
                        <th className="py-2 pr-4">Module</th>
                        <th className="py-2 pr-4">Suppression page</th>
                        <th className="py-2 pr-4">Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((row) => (
                        <tr key={row.id} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="py-2 pr-4 font-medium">{row.keyword}</td>
                          <td className="py-2 pr-4 text-muted-foreground">{row.entity}</td>
                          <td className="py-2 pr-4">
                            <Badge variant={row.priority === 1 ? "destructive" : row.priority === 2 ? "secondary" : "outline"}>
                              P{row.priority}
                            </Badge>
                          </td>
                          <td className="py-2 pr-4">
                            <Badge variant={sentimentColor[row.sentiment_target] ?? "outline"}>
                              {row.sentiment_target}
                            </Badge>
                          </td>
                          <td className="py-2 pr-4 text-xs text-muted-foreground">{row.assigned_module}</td>
                          <td className="py-2 pr-4">
                            {row.suppression_page_path ? (
                              <Link
                                to={row.suppression_page_path}
                                target="_blank"
                                className="inline-flex items-center gap-1 text-primary hover:underline"
                              >
                                {row.suppression_page_path}
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">— none —</span>
                            )}
                          </td>
                          <td className="py-2 pr-4">
                            <Switch
                              checked={row.active}
                              onCheckedChange={(v) => toggleActive.mutate({ id: row.id, active: v })}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
