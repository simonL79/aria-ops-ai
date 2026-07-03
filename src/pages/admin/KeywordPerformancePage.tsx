import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  ArrowLeft, RefreshCw, TrendingUp, TrendingDown, Minus, Search,
  MousePointerClick, Eye, Gauge,
} from "lucide-react";

type Snapshot = {
  id: string;
  keyword: string;
  period_start: string;
  period_end: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  is_tracked: boolean;
};

type SyncRun = {
  id: string;
  period_start: string | null;
  period_end: string | null;
  rows_upserted: number;
  tracked_matched: number;
  status: string;
  triggered_by: string;
  created_at: string;
};

function deltaBadge(current: number, previous: number | undefined, lowerIsBetter = false) {
  if (previous === undefined) return <Badge variant="outline">new</Badge>;
  const diff = current - previous;
  if (Math.abs(diff) < 0.01) {
    return (
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        <Minus className="h-3 w-3" /> 0
      </span>
    );
  }
  const improved = lowerIsBetter ? diff < 0 : diff > 0;
  const Icon = diff > 0 ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 ${improved ? "text-[#15803D]" : "text-[#B91C1C]"}`}
    >
      <Icon className="h-3 w-3" />
      {Math.abs(diff).toFixed(lowerIsBetter ? 1 : 0)}
    </span>
  );
}

export default function KeywordPerformancePage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [trackedOnly, setTrackedOnly] = useState(false);

  const { data: snapshots = [], isLoading } = useQuery({
    queryKey: ["gsc-snapshots"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("gsc_weekly_snapshots")
        .select("*")
        .order("period_start", { ascending: false })
        .limit(5000);
      if (error) throw error;
      return (data ?? []) as Snapshot[];
    },
  });

  const { data: runs = [] } = useQuery({
    queryKey: ["gsc-sync-runs"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("gsc_sync_runs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return (data ?? []) as SyncRun[];
    },
  });

  const syncNow = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("google-search-crawler", {
        body: { action: "gsc-weekly-sync" },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (d: any) => {
      toast.success(`Synced ${d?.rows_upserted ?? 0} keywords for the latest week`);
      qc.invalidateQueries({ queryKey: ["gsc-snapshots"] });
      qc.invalidateQueries({ queryKey: ["gsc-sync-runs"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Sync failed"),
  });

  // Distinct periods, newest first
  const periods = useMemo(() => {
    const set = Array.from(new Set(snapshots.map((s) => s.period_start)));
    return set.sort((a, b) => (a < b ? 1 : -1));
  }, [snapshots]);

  const latest = periods[0];
  const previous = periods[1];

  // Per-keyword: latest + previous rows
  const rows = useMemo(() => {
    const byKeyword = new Map<
      string,
      { latest?: Snapshot; prev?: Snapshot; is_tracked: boolean }
    >();
    for (const s of snapshots) {
      if (s.period_start !== latest && s.period_start !== previous) continue;
      const entry = byKeyword.get(s.keyword) ?? { is_tracked: s.is_tracked };
      if (s.period_start === latest) entry.latest = s;
      if (s.period_start === previous) entry.prev = s;
      entry.is_tracked = entry.is_tracked || s.is_tracked;
      byKeyword.set(s.keyword, entry);
    }
    let list = Array.from(byKeyword.entries())
      .filter(([, v]) => v.latest)
      .map(([keyword, v]) => ({ keyword, ...v }));
    if (trackedOnly) list = list.filter((r) => r.is_tracked);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.keyword.toLowerCase().includes(q));
    }
    return list.sort(
      (a, b) => (b.latest?.impressions ?? 0) - (a.latest?.impressions ?? 0),
    );
  }, [snapshots, latest, previous, trackedOnly, search]);

  // Summary for latest period
  const summary = useMemo(() => {
    const cur = snapshots.filter((s) => s.period_start === latest);
    const scope = trackedOnly ? cur.filter((s) => s.is_tracked) : cur;
    const clicks = scope.reduce((a, s) => a + s.clicks, 0);
    const impressions = scope.reduce((a, s) => a + s.impressions, 0);
    const avgPos =
      scope.length > 0
        ? scope.reduce((a, s) => a + s.position, 0) / scope.length
        : 0;
    return { keywords: scope.length, clicks, impressions, avgPos };
  }, [snapshots, latest, trackedOnly]);

  // Trend chart: avg position + clicks per period (tracked scope)
  const trend = useMemo(() => {
    return periods
      .slice(0, 12)
      .map((p) => {
        const scope = snapshots.filter(
          (s) => s.period_start === p && (!trackedOnly || s.is_tracked),
        );
        const avgPos =
          scope.length > 0
            ? scope.reduce((a, s) => a + s.position, 0) / scope.length
            : 0;
        return {
          week: p.slice(5),
          position: Number(avgPos.toFixed(1)),
          clicks: scope.reduce((a, s) => a + s.clicks, 0),
        };
      })
      .reverse();
  }, [periods, snapshots, trackedOnly]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Admin
            </Link>
            <h1 className="mt-1 text-2xl font-semibold">Keyword Performance</h1>
            <p className="text-sm text-muted-foreground">
              Google Search Console rank & performance tracking · updates weekly
              {latest ? ` · latest week from ${latest}` : ""}
            </p>
          </div>
          <Button onClick={() => syncNow.mutate()} disabled={syncNow.isPending}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${syncNow.isPending ? "animate-spin" : ""}`}
            />
            {syncNow.isPending ? "Syncing…" : "Sync now"}
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<Search className="h-4 w-4" />}
            label="Keywords tracked"
            value={summary.keywords.toString()}
          />
          <SummaryCard
            icon={<MousePointerClick className="h-4 w-4" />}
            label="Clicks (week)"
            value={summary.clicks.toLocaleString()}
          />
          <SummaryCard
            icon={<Eye className="h-4 w-4" />}
            label="Impressions (week)"
            value={summary.impressions.toLocaleString()}
          />
          <SummaryCard
            icon={<Gauge className="h-4 w-4" />}
            label="Avg. position"
            value={summary.avgPos ? summary.avgPos.toFixed(1) : "—"}
          />
        </div>

        {/* Trend chart */}
        <Card>
          <CardHeader>
            <CardTitle>Trend</CardTitle>
            <CardDescription>
              Average position and clicks by week
              {trackedOnly ? " (tracked keywords)" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {trend.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    yAxisId="pos"
                    reversed
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={[1, "auto"]}
                    label={{ value: "Position", angle: -90, position: "insideLeft", fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="clicks"
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Line
                    yAxisId="pos"
                    type="monotone"
                    dataKey="position"
                    stroke="hsl(258 90% 66%)"
                    strokeWidth={2}
                    dot={false}
                    name="Avg position"
                  />
                  <Line
                    yAxisId="clicks"
                    type="monotone"
                    dataKey="clicks"
                    stroke="#38BDF8"
                    strokeWidth={2}
                    dot={false}
                    name="Clicks"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter keywords…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={trackedOnly} onCheckedChange={setTrackedOnly} />
            Tracked keywords only
          </label>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Keywords</CardTitle>
            <CardDescription>
              Change columns compare the latest week with the previous week
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : rows.length === 0 ? (
              <EmptyState hint='No data yet. Click "Sync now" to pull the latest week from Search Console.' />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead className="text-right">Position</TableHead>
                      <TableHead className="text-right">Δ pos</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">Δ clicks</TableHead>
                      <TableHead className="text-right">Impr.</TableHead>
                      <TableHead className="text-right">CTR</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.keyword}>
                        <TableCell className="font-medium">
                          {r.keyword}
                          {r.is_tracked && (
                            <Badge variant="secondary" className="ml-2">tracked</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {r.latest ? r.latest.position.toFixed(1) : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {deltaBadge(r.latest?.position ?? 0, r.prev?.position, true)}
                        </TableCell>
                        <TableCell className="text-right">{r.latest?.clicks ?? 0}</TableCell>
                        <TableCell className="text-right">
                          {deltaBadge(r.latest?.clicks ?? 0, r.prev?.clicks)}
                        </TableCell>
                        <TableCell className="text-right">
                          {(r.latest?.impressions ?? 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {r.latest ? `${(r.latest.ctr * 100).toFixed(1)}%` : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sync history */}
        <Card>
          <CardHeader>
            <CardTitle>Sync history</CardTitle>
            <CardDescription>Automated weekly runs and manual syncs</CardDescription>
          </CardHeader>
          <CardContent>
            {runs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No syncs recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {runs.map((run) => (
                  <div
                    key={run.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm"
                  >
                    <span className="text-muted-foreground">
                      {new Date(run.created_at).toLocaleString()}
                    </span>
                    <span>
                      {run.period_start} → {run.period_end}
                    </span>
                    <span>{run.rows_upserted} keywords · {run.tracked_matched} tracked</span>
                    <Badge variant={run.status === "success" ? "default" : "destructive"}>
                      {run.status}
                    </Badge>
                    <Badge variant="outline">{run.triggered_by}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {icon}
          {label}
        </div>
        <div className="mt-2 text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ hint }: { hint?: string }) {
  return (
    <div className="flex h-full min-h-[120px] items-center justify-center text-sm text-muted-foreground">
      {hint ?? "No data available yet."}
    </div>
  );
}
