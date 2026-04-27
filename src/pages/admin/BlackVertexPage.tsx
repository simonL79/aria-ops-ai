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
import { ArrowLeft, RefreshCw, Check, X, Loader2 } from "lucide-react";
import { blackVertexApi, type BlackVertexActionType } from "@/services/actions/actionApi";

interface BVAction {
  id: string;
  client_id: string | null;
  action_type: string;
  target_url: string | null;
  payload: any;
  status: string;
  result: any;
  approved_at: string | null;
  executed_at: string | null;
  created_at: string;
}

function statusVariant(s: string): "default" | "secondary" | "destructive" | "outline" {
  if (s === "completed" || s === "approved") return "default";
  if (s === "pending") return "secondary";
  if (s === "failed" || s === "rejected") return "destructive";
  return "outline";
}

export default function BlackVertexPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [actionType, setActionType] = useState<BlackVertexActionType>("notify_only");
  const [targetUrl, setTargetUrl] = useState("");
  const [clientId, setClientId] = useState("none");
  const [payloadText, setPayloadText] = useState("{}");

  const { data: clients = [] } = useQuery({
    queryKey: ["clients-for-bv"],
    queryFn: async () => {
      const { data } = await (supabase.from("clients") as any).select("id,name").order("name");
      return data || [];
    },
  });

  const { data: actions = [], isFetching, refetch } = useQuery({
    queryKey: ["bv-actions"],
    queryFn: async () => {
      const { data, error } = await (supabase.from("black_vertex_actions") as any)
        .select("*").order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return (data || []) as BVAction[];
    },
    refetchInterval: 20000,
  });

  const queueMut = useMutation({
    mutationFn: async () => {
      let payload: Record<string, unknown> = {};
      try { payload = JSON.parse(payloadText || "{}"); } catch { throw new Error("Invalid JSON payload"); }
      const { data, error } = await blackVertexApi.queue({
        client_id: clientId === "none" ? undefined : clientId,
        action_type: actionType,
        target_url: targetUrl || undefined,
        payload,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Action queued");
      setTargetUrl(""); setPayloadText("{}");
      qc.invalidateQueries({ queryKey: ["bv-actions"] });
    },
    onError: (e: any) => toast.error(e?.message || "Queue failed"),
  });

  const decideMut = useMutation({
    mutationFn: async ({ id, decision }: { id: string; decision: "approve" | "reject" }) => {
      const { data, error } = await blackVertexApi.approve(id, decision);
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, v) => {
      toast.success(v.decision === "approve" ? "Approved & executing" : "Rejected");
      qc.invalidateQueries({ queryKey: ["bv-actions"] });
    },
    onError: (e: any) => toast.error(e?.message || "Decision failed"),
  });

  const pending = actions.filter(a => a.status === "pending");
  const history = actions.filter(a => a.status !== "pending");

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
          <h1 className="text-3xl font-bold">Black Vertex</h1>
          <p className="text-muted-foreground">Approval-gated action engine</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Queue new action</CardTitle>
            <CardDescription>All actions require admin approval before execution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Action type</Label>
                <Select value={actionType} onValueChange={(v) => setActionType(v as BlackVertexActionType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notify_only">Notify only</SelectItem>
                    <SelectItem value="manual_review">Manual review</SelectItem>
                    <SelectItem value="suppression_boost">Suppression boost</SelectItem>
                    <SelectItem value="counter_content">Counter content</SelectItem>
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
            </div>
            <div>
              <Label>Target URL</Label>
              <Input value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://…" />
            </div>
            <div>
              <Label>Payload (JSON)</Label>
              <Textarea value={payloadText} onChange={(e) => setPayloadText(e.target.value)} rows={4} className="font-mono text-xs" />
            </div>
            <Button onClick={() => queueMut.mutate()} disabled={queueMut.isPending}>
              {queueMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Queue action
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value="history">History ({history.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3">
            {pending.length === 0 && <p className="text-sm text-muted-foreground">No pending actions.</p>}
            {pending.map(a => (
              <Card key={a.id}>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge>{a.action_type}</Badge>
                      <span className="truncate text-sm">{a.target_url || "(no target)"}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Queued {new Date(a.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default" onClick={() => decideMut.mutate({ id: a.id, decision: "approve" })} disabled={decideMut.isPending}>
                      <Check className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => decideMut.mutate({ id: a.id, decision: "reject" })} disabled={decideMut.isPending}>
                      <X className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            {history.map(a => (
              <Card key={a.id}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                      <Badge variant="outline">{a.action_type}</Badge>
                      <span className="truncate text-sm">{a.target_url || "(no target)"}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</span>
                  </div>
                  {a.result && Object.keys(a.result).length > 0 && (
                    <pre className="overflow-auto rounded bg-muted p-2 text-xs">{JSON.stringify(a.result, null, 2)}</pre>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
