import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ArrowLeft, RefreshCw, Loader2, FileText, Send, Copy, Plus, Trash2 } from "lucide-react";
import { oblivionApi, type TakedownPlatform, type TakedownRequestType } from "@/services/actions/actionApi";

interface Takedown {
  id: string;
  client_id: string | null;
  target_url: string;
  platform: string;
  request_type: string;
  legal_basis: string | null;
  evidence: any;
  status: string;
  resolution_notes: string | null;
  metadata: any;
  created_at: string;
  submitted_at: string | null;
  resolved_at: string | null;
}

function statusVariant(s: string): "default" | "secondary" | "destructive" | "outline" {
  if (s === "removed") return "default";
  if (s === "submitted" || s === "under_review" || s === "appealing") return "secondary";
  if (s === "rejected") return "destructive";
  return "outline";
}

export default function OblivionPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [clientId, setClientId] = useState("none");
  const [targetUrl, setTargetUrl] = useState("");
  const [platform, setPlatform] = useState<TakedownPlatform>("google");
  const [requestType, setRequestType] = useState<TakedownRequestType>("gdpr_erasure");
  const [legalBasis, setLegalBasis] = useState("");
  const [evidence, setEvidence] = useState<{ url: string; description: string }[]>([{ url: "", description: "" }]);
  const [selected, setSelected] = useState<Takedown | null>(null);

  const { data: clients = [] } = useQuery({
    queryKey: ["clients-for-oblivion"],
    queryFn: async () => {
      const { data } = await (supabase.from("clients") as any).select("id,name").order("name");
      return data || [];
    },
  });

  const { data: takedowns = [], isFetching, refetch } = useQuery({
    queryKey: ["oblivion-takedowns"],
    queryFn: async () => {
      const { data, error } = await (supabase.from("oblivion_takedowns") as any)
        .select("*").order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return (data || []) as Takedown[];
    },
    refetchInterval: 30000,
  });

  const draftMut = useMutation({
    mutationFn: async () => {
      const cleanEvidence = evidence.filter(e => e.url.trim());
      const { data, error } = await oblivionApi.draft({
        client_id: clientId === "none" ? undefined : clientId,
        target_url: targetUrl,
        platform,
        request_type: requestType,
        legal_basis: legalBasis || undefined,
        evidence: cleanEvidence,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Takedown drafted with AI letter");
      setTargetUrl(""); setLegalBasis(""); setEvidence([{ url: "", description: "" }]);
      qc.invalidateQueries({ queryKey: ["oblivion-takedowns"] });
    },
    onError: (e: any) => toast.error(e?.message || "Draft failed"),
  });

  const submitMut = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await oblivionApi.submit(id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => { toast.success("Marked submitted"); qc.invalidateQueries({ queryKey: ["oblivion-takedowns"] }); },
    onError: (e: any) => toast.error(e?.message || "Submit failed"),
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { data, error } = await oblivionApi.updateStatus(id, status, notes);
      if (error) throw error;
      return data;
    },
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["oblivion-takedowns"] }); setSelected(null); },
    onError: (e: any) => toast.error(e?.message || "Update failed"),
  });

  const drafts = takedowns.filter(t => t.status === "draft");
  const active = takedowns.filter(t => ["submitted", "under_review", "appealing"].includes(t.status));
  const resolved = takedowns.filter(t => ["removed", "rejected"].includes(t.status));

  const copy = (txt: string) => { navigator.clipboard.writeText(txt); toast.success("Copied"); };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Admin
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Oblivion</h1>
          <p className="text-muted-foreground">Legal takedown drafting & tracking</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New takedown</CardTitle>
            <CardDescription>Generates an AI-drafted legal letter you can review and submit.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Platform</Label>
                <Select value={platform} onValueChange={(v) => setPlatform(v as TakedownPlatform)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="x">X / Twitter</SelectItem>
                    <SelectItem value="reddit">Reddit</SelectItem>
                    <SelectItem value="facebook">Facebook / Meta</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Request type</Label>
                <Select value={requestType} onValueChange={(v) => setRequestType(v as TakedownRequestType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gdpr_erasure">GDPR Erasure (Art. 17)</SelectItem>
                    <SelectItem value="dmca">DMCA</SelectItem>
                    <SelectItem value="defamation">Defamation</SelectItem>
                    <SelectItem value="harassment">Harassment</SelectItem>
                    <SelectItem value="impersonation">Impersonation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Client (optional)</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— None —</SelectItem>
                    {clients.map((c: any) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Target URL</Label>
                <Input value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://…" />
              </div>
            </div>
            <div>
              <Label>Legal basis / harm description</Label>
              <Textarea value={legalBasis} onChange={(e) => setLegalBasis(e.target.value)} rows={3}
                placeholder="Describe the legal basis and the harm caused…" />
            </div>
            <div>
              <Label>Evidence</Label>
              <div className="space-y-2">
                {evidence.map((e, i) => (
                  <div key={i} className="flex gap-2">
                    <Input placeholder="Evidence URL" value={e.url} onChange={(ev) => {
                      const next = [...evidence]; next[i].url = ev.target.value; setEvidence(next);
                    }} />
                    <Input placeholder="Description" value={e.description} onChange={(ev) => {
                      const next = [...evidence]; next[i].description = ev.target.value; setEvidence(next);
                    }} />
                    <Button variant="ghost" size="icon" onClick={() => setEvidence(evidence.filter((_, j) => j !== i))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setEvidence([...evidence, { url: "", description: "" }])}>
                  <Plus className="mr-1 h-4 w-4" /> Add evidence
                </Button>
              </div>
            </div>
            <Button onClick={() => draftMut.mutate()} disabled={draftMut.isPending || !targetUrl}>
              {draftMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <FileText className="mr-2 h-4 w-4" /> Draft takedown
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="drafts">
          <TabsList>
            <TabsTrigger value="drafts">Drafts ({drafts.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({resolved.length})</TabsTrigger>
          </TabsList>

          {[["drafts", drafts], ["active", active], ["resolved", resolved]].map(([key, list]) => (
            <TabsContent key={key as string} value={key as string} className="space-y-3">
              {(list as Takedown[]).length === 0 && <p className="text-sm text-muted-foreground">None.</p>}
              {(list as Takedown[]).map(t => (
                <Card key={t.id}>
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
                        <Badge variant="outline">{t.platform}</Badge>
                        <Badge variant="outline">{t.request_type}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</span>
                    </div>
                    <p className="truncate text-sm">{t.target_url}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelected(t)}>
                        <FileText className="mr-1 h-4 w-4" /> View letter
                      </Button>
                      {t.status === "draft" && (
                        <Button size="sm" onClick={() => submitMut.mutate(t.id)} disabled={submitMut.isPending}>
                          <Send className="mr-1 h-4 w-4" /> Mark submitted
                        </Button>
                      )}
                      {["submitted", "under_review"].includes(t.status) && (
                        <>
                          <Button size="sm" variant="default" onClick={() => updateMut.mutate({ id: t.id, status: "removed", notes: "Content removed" })}>Mark removed</Button>
                          <Button size="sm" variant="destructive" onClick={() => updateMut.mutate({ id: t.id, status: "rejected", notes: "Request rejected" })}>Mark rejected</Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-[600px] sm:max-w-[600px]">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Takedown letter</SheetTitle>
                <SheetDescription className="truncate">{selected.target_url}</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div>
                  <Label>Recipient</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={selected.metadata?.recipient || ""} />
                    <Button size="icon" variant="outline" onClick={() => copy(selected.metadata?.recipient || "")}><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <Label>Letter</Label>
                    <Button size="sm" variant="outline" onClick={() => copy(selected.metadata?.draft_letter || "")}>
                      <Copy className="mr-1 h-4 w-4" /> Copy letter
                    </Button>
                  </div>
                  <Textarea readOnly value={selected.metadata?.draft_letter || "(no letter generated)"} rows={20} className="font-mono text-xs" />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
