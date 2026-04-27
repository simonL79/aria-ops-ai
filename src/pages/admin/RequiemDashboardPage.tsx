import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, RefreshCw, Search, ExternalLink, Eye, RotateCw } from "lucide-react";
import {
  listRequiemJobs,
  getJobSnapshots,
  runRequiemScan,
  rerunRequiemJob,
  type RequiemJob,
  type ParsedResult,
} from "@/services/requiem/requiemPipeline";

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed": return "default";
    case "running": return "secondary";
    case "failed": return "destructive";
    default: return "outline";
  }
}

export default function RequiemDashboardPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [entityName, setEntityName] = useState("");
  const [query, setQuery] = useState("");
  const [clientId, setClientId] = useState<string>("none");
  const [selectedJob, setSelectedJob] = useState<RequiemJob | null>(null);

  const jobsQ = useQuery({
    queryKey: ["requiem-jobs"],
    queryFn: () => listRequiemJobs(50),
    refetchInterval: (q) => {
      const data = q.state.data as RequiemJob[] | undefined;
      return data?.some((j) => j.status === "running" || j.status === "pending") ? 10_000 : false;
    },
  });

  const clientsQ = useQuery({
    queryKey: ["clients-min"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const snapshotsQ = useQuery({
    queryKey: ["requiem-snapshots", selectedJob?.id],
    queryFn: () => getJobSnapshots(selectedJob!.id),
    enabled: !!selectedJob,
  });

  const runMut = useMutation({
    mutationFn: runRequiemScan,
    onSuccess: () => {
      toast.success("Scan dispatched");
      setEntityName("");
      setQuery("");
      qc.invalidateQueries({ queryKey: ["requiem-jobs"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Scan failed"),
  });

  const rerunMut = useMutation({
    mutationFn: rerunRequiemJob,
    onSuccess: () => {
      toast.success("Re-run dispatched");
      qc.invalidateQueries({ queryKey: ["requiem-jobs"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Re-run failed"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityName.trim() || !query.trim()) {
      toast.error("Entity name and query required");
      return;
    }
    runMut.mutate({
      entity_name: entityName.trim(),
      query: query.trim(),
      client_id: clientId === "none" ? null : clientId,
    });
  };

  const latestSnapshot = useMemo(
    () => snapshotsQ.data?.[0],
    [snapshotsQ.data],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin")}
              className="mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Admin
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Requiem Engine</h1>
            <p className="text-muted-foreground">
              SERP intelligence and reputation monitoring via SerpApi.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => qc.invalidateQueries({ queryKey: ["requiem-jobs"] })}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* New scan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" /> New SERP Scan
            </CardTitle>
            <CardDescription>
              Capture a search snapshot for an entity. Mirrors top results into the ranking history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div className="space-y-1">
                <Label htmlFor="entity">Entity name</Label>
                <Input
                  id="entity"
                  placeholder="e.g. Acme Corp"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="query">Search query</Label>
                <Input
                  id="query"
                  placeholder='e.g. "Acme Corp" scandal'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Client</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— None —</SelectItem>
                    {clientsQ.data?.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-4">
                <Button type="submit" disabled={runMut.isPending}>
                  {runMut.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running…</>
                  ) : (
                    <><Search className="w-4 h-4 mr-2" /> Run Scan</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Job queue */}
        <Card>
          <CardHeader>
            <CardTitle>Job Queue</CardTitle>
            <CardDescription>Latest 50 Requiem jobs</CardDescription>
          </CardHeader>
          <CardContent>
            {jobsQ.isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading jobs…
              </div>
            ) : jobsQ.data?.length === 0 ? (
              <p className="text-muted-foreground text-sm">No jobs yet. Run a scan above.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-muted-foreground border-b">
                    <tr>
                      <th className="py-2 pr-4">Entity</th>
                      <th className="py-2 pr-4">Query</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Results</th>
                      <th className="py-2 pr-4">Completed</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobsQ.data?.map((j) => (
                      <tr key={j.id} className="border-b hover:bg-muted/30">
                        <td className="py-2 pr-4 font-medium">{j.entity_name}</td>
                        <td className="py-2 pr-4 text-muted-foreground max-w-xs truncate">{j.query}</td>
                        <td className="py-2 pr-4">
                          <Badge variant={statusVariant(j.status)}>{j.status}</Badge>
                        </td>
                        <td className="py-2 pr-4">
                          {j.result_summary?.total_results ?? "—"}
                        </td>
                        <td className="py-2 pr-4 text-muted-foreground">
                          {j.completed_at ? new Date(j.completed_at).toLocaleString() : "—"}
                        </td>
                        <td className="py-2 pr-4 text-right space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedJob(j)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => rerunMut.mutate(j.id)}
                            disabled={rerunMut.isPending}
                          >
                            <RotateCw className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Snapshot drawer */}
      <Sheet open={!!selectedJob} onOpenChange={(o) => !o && setSelectedJob(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedJob?.entity_name}</SheetTitle>
            <SheetDescription>
              <span className="block">Query: <code className="text-xs">{selectedJob?.query}</code></span>
              {selectedJob?.error_message && (
                <span className="block text-destructive mt-1">{selectedJob.error_message}</span>
              )}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4">
            {snapshotsQ.isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading snapshot…
              </div>
            ) : !latestSnapshot ? (
              <p className="text-muted-foreground text-sm">No snapshot captured yet.</p>
            ) : (
              <ScrollArea className="h-[70vh] pr-3">
                <p className="text-xs text-muted-foreground mb-3">
                  Captured {new Date(latestSnapshot.captured_at).toLocaleString()} •{" "}
                  {latestSnapshot.total_results} results
                </p>
                <ol className="space-y-3">
                  {(latestSnapshot.parsed_results ?? []).map((r: ParsedResult) => (
                    <li
                      key={`${r.position}-${r.link}`}
                      className="p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl font-bold text-muted-foreground w-8 shrink-0">
                          {r.position}
                        </div>
                        <div className="min-w-0 flex-1">
                          <a
                            href={r.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:underline flex items-center gap-1"
                          >
                            {r.title ?? r.link}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <div className="text-xs text-muted-foreground truncate">
                            {r.domain ?? r.displayed_link}
                          </div>
                          {r.snippet && (
                            <p className="text-sm text-muted-foreground mt-1">{r.snippet}</p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </ScrollArea>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
