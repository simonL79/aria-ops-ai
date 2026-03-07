import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Plus, Trash2, Rocket, Loader2, RefreshCw, Globe, Shield,
  AlertTriangle, CheckCircle2, FileText, ExternalLink, ArrowLeft,
  Crosshair, Zap, Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  launchRequiemPipeline,
  listRequiemJobs,
  getJobScanResults,
  getJobPayloads,
  type RequiemJob,
  type RequiemScanResult,
  type RequiemPayload,
} from "@/services/requiem/requiemPipeline";

// ── URL Input Panel ─────────────────────────────────────────
function UrlInputPanel({ onLaunch, isRunning }: { onLaunch: (urls: string[], variants: number) => void; isRunning: boolean }) {
  const [urls, setUrls] = useState<string[]>([""]);
  const [variantCount, setVariantCount] = useState(20);

  const addUrl = () => setUrls([...urls, ""]);
  const removeUrl = (i: number) => setUrls(urls.filter((_, idx) => idx !== i));
  const updateUrl = (i: number, val: string) => {
    const next = [...urls];
    next[i] = val;
    setUrls(next);
  };

  const handleLaunch = () => {
    const validUrls = urls.map((u) => u.trim()).filter((u) => u.length > 0);
    if (validUrls.length === 0) {
      toast.error("Add at least one URL");
      return;
    }
    // Basic URL validation
    for (const u of validUrls) {
      try {
        new URL(u.startsWith("http") ? u : `https://${u}`);
      } catch {
        toast.error(`Invalid URL: ${u}`);
        return;
      }
    }
    if (variantCount < 1 || variantCount > 100) {
      toast.error("Variant count must be between 1 and 100");
      return;
    }
    onLaunch(validUrls, variantCount);
  };

  return (
    <Card className="border-primary/20 bg-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Crosshair className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Target URLs</CardTitle>
            <CardDescription>Enter URLs to scan, analyse and generate content variants from</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {urls.map((url, i) => (
            <div key={i} className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={url}
                  onChange={(e) => updateUrl(i, e.target.value)}
                  placeholder="https://example.com/article"
                  className="pl-10 bg-background border-border"
                  disabled={isRunning}
                />
              </div>
              {urls.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeUrl(i)}
                  disabled={isRunning}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={addUrl} disabled={isRunning || urls.length >= 50}>
          <Plus className="h-4 w-4 mr-1" /> Add URL
        </Button>

        <Separator />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground whitespace-nowrap">Variants per URL:</label>
            <Input
              type="number"
              min={1}
              max={100}
              value={variantCount}
              onChange={(e) => setVariantCount(Number(e.target.value))}
              className="w-20 bg-background"
              disabled={isRunning}
            />
          </div>
          <div className="flex-1" />
          <Button onClick={handleLaunch} disabled={isRunning} className="gap-2">
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Running Pipeline…
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4" /> Launch Requiem
              </>
            )}
          </Button>
        </div>

        {isRunning && (
          <div className="space-y-2">
            <Progress value={undefined} className="h-1" />
            <p className="text-xs text-muted-foreground animate-pulse">
              Scanning targets, extracting content, generating payloads…
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Job Status Badge ────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
    pending: { variant: "outline", icon: null },
    scanning: { variant: "secondary", icon: <Loader2 className="h-3 w-3 animate-spin" /> },
    generating: { variant: "secondary", icon: <Zap className="h-3 w-3" /> },
    completed: { variant: "default", icon: <CheckCircle2 className="h-3 w-3" /> },
    failed: { variant: "destructive", icon: <AlertTriangle className="h-3 w-3" /> },
  };
  const cfg = map[status] || map.pending;
  return (
    <Badge variant={cfg.variant} className="gap-1 capitalize">
      {cfg.icon} {status}
    </Badge>
  );
}

// ── Job Detail View ─────────────────────────────────────────
function JobDetailView({ jobId }: { jobId: string }) {
  const { data: scans, isLoading: scansLoading } = useQuery({
    queryKey: ["requiem-scans", jobId],
    queryFn: () => getJobScanResults(jobId),
  });

  const { data: payloads, isLoading: payloadsLoading } = useQuery({
    queryKey: ["requiem-payloads", jobId],
    queryFn: () => getJobPayloads(jobId),
  });

  return (
    <Tabs defaultValue="scans" className="space-y-4">
      <TabsList>
        <TabsTrigger value="scans" className="gap-1">
          <Eye className="h-3.5 w-3.5" /> Scan Results ({scans?.length ?? 0})
        </TabsTrigger>
        <TabsTrigger value="payloads" className="gap-1">
          <FileText className="h-3.5 w-3.5" /> Payloads ({payloads?.length ?? 0})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="scans">
        {scansLoading ? (
          <div className="flex items-center gap-2 p-4 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading scan results…
          </div>
        ) : !scans || scans.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4">No scan results yet.</p>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {scans.map((scan: RequiemScanResult) => (
                <Card key={scan.id} className="bg-background border-border">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{scan.title || "Untitled"}</h4>
                        <a
                          href={scan.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1 truncate"
                        >
                          <ExternalLink className="h-3 w-3 flex-shrink-0" /> {scan.url}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {scan.is_negative && (
                          <Badge variant="destructive" className="gap-1 text-xs">
                            <AlertTriangle className="h-3 w-3" /> Negative
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          Auth: {(scan.authority_score * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {scan.content_text?.slice(0, 200)}…
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{(scan.paragraphs as string[])?.length ?? 0} paragraphs extracted</span>
                      {scan.image_url && <span>• Image found</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </TabsContent>

      <TabsContent value="payloads">
        {payloadsLoading ? (
          <div className="flex items-center gap-2 p-4 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading payloads…
          </div>
        ) : !payloads || payloads.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4">No payloads generated yet.</p>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {payloads.map((p: RequiemPayload) => (
                <Card key={p.id} className="bg-background border-border">
                  <CardContent className="p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">
                        By {p.author_name} • {p.pub_date} • Variant #{p.variant_index}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">{p.filename}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </TabsContent>
    </Tabs>
  );
}

// ── Main Page ───────────────────────────────────────────────
export default function RequiemDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["requiem-jobs"],
    queryFn: listRequiemJobs,
    refetchInterval: 10000,
  });

  const pipelineMutation = useMutation({
    mutationFn: (params: { urls: string[]; variantCount: number }) =>
      launchRequiemPipeline({ urls: params.urls, variantCount: params.variantCount }),
    onSuccess: (data) => {
      toast.success(`Pipeline complete — ${data.scanned} scanned, ${data.payloadsGenerated} payloads generated`);
      setSelectedJobId(data.jobId);
      queryClient.invalidateQueries({ queryKey: ["requiem-jobs"] });
    },
    onError: (err: Error) => {
      toast.error("Pipeline failed", { description: err.message });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Requiem Pipeline</h1>
              <p className="text-sm text-muted-foreground">
                RIE Scan → Payload Generation → Content Deployment
              </p>
            </div>
          </div>
          <div className="flex-1" />
          <Badge variant="outline" className="gap-1 text-xs">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            LIVE SYSTEM
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* URL Input */}
        <UrlInputPanel
          onLaunch={(urls, variants) => pipelineMutation.mutate({ urls, variantCount: variants })}
          isRunning={pipelineMutation.isPending}
        />

        {/* Jobs List + Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job List */}
          <Card className="lg:col-span-1 border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Pipeline Jobs</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["requiem-jobs"] })}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {jobsLoading ? (
                  <div className="flex items-center justify-center p-8 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading…
                  </div>
                ) : !jobs || jobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center p-8">
                    No jobs yet. Launch your first pipeline above.
                  </p>
                ) : (
                  <div className="divide-y divide-border">
                    {jobs.map((job: RequiemJob) => (
                      <button
                        key={job.id}
                        onClick={() => setSelectedJobId(job.id)}
                        className={`w-full text-left p-4 hover:bg-accent/50 transition-colors ${
                          selectedJobId === job.id ? "bg-accent/30 border-l-2 border-primary" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono text-muted-foreground">
                            {job.id.slice(0, 8)}
                          </span>
                          <StatusBadge status={job.status} />
                        </div>
                        <p className="text-sm">
                          {(job.urls as string[])?.length ?? 0} URL{(job.urls as string[])?.length !== 1 ? "s" : ""}
                          {" • "}
                          {job.variant_count} variants
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(job.created_at).toLocaleString()}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Detail Panel */}
          <Card className="lg:col-span-2 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">
                {selectedJobId ? `Job ${selectedJobId.slice(0, 8)}…` : "Select a Job"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedJobId ? (
                <JobDetailView jobId={selectedJobId} />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <FileText className="h-12 w-12 mb-4 opacity-30" />
                  <p className="text-sm">Select a job from the list or launch a new pipeline</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
