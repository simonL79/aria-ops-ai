import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ExternalLink, Copy, CheckCircle2 } from "lucide-react";
import SEO from "@/components/seo/SEO";

const GOOGLE_REMOVAL_TOOL = "https://search.google.com/search-console/remove-outdated-content";
const DEFAULT_URL = "https://www.facebook.com/KSLHAIRTHETRUTH";
const DEFAULT_REASON = "Page has been inactive since 2021. The content no longer reflects current facts: the underlying company entered formal UK insolvency and was wound down years ago; complaints referenced have been handled through the appropriate legal channels. The cached snippet and stale title continue to mislead searchers about a closed matter.";
const DEFAULT_EXPECTED = "Google's cached version and snippet should be refreshed or removed because the live page is dormant (no posts since 2021) and the snippet no longer matches the current state of the page or the underlying entity.";

type RequestRow = {
  id: string;
  target_url: string;
  reason: string | null;
  expected_change: string | null;
  status: string;
  google_ticket_ref: string | null;
  notes: string | null;
  submitted_at: string | null;
  created_at: string;
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary",
  submitted: "default",
  approved: "default",
  denied: "destructive",
  cancelled: "outline",
};

export default function OutdatedContentRemovalPage() {
  const [targetUrl, setTargetUrl] = useState(DEFAULT_URL);
  const [reason, setReason] = useState(DEFAULT_REASON);
  const [expected, setExpected] = useState(DEFAULT_EXPECTED);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("outdated_content_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load requests");
    else setRows((data as RequestRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveDraft = async (status: "draft" | "submitted" = "draft") => {
    if (!targetUrl.trim()) { toast.error("Target URL is required"); return; }
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const payload: Record<string, unknown> = {
      target_url: targetUrl.trim(),
      reason: reason.trim() || null,
      expected_change: expected.trim() || null,
      status,
      submitted_by: userData.user?.id ?? null,
    };
    if (status === "submitted") payload.submitted_at = new Date().toISOString();

    const { error } = await (supabase as any).from("outdated_content_requests").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(status === "submitted" ? "Logged as submitted" : "Draft saved");
    load();
  };

  const openGoogleTool = async () => {
    // Save a draft first so the request is tracked, then open Google's tool.
    await saveDraft("draft");
    window.open(GOOGLE_REMOVAL_TOOL, "_blank", "noopener,noreferrer");
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(targetUrl);
    toast.success("URL copied — paste it into Google's tool");
  };

  const updateStatus = async (id: string, status: string, ticket?: string) => {
    const patch: Record<string, unknown> = { status };
    if (status === "submitted") patch.submitted_at = new Date().toISOString();
    if (ticket !== undefined) patch.google_ticket_ref = ticket || null;
    const { error } = await (supabase as any).from("outdated_content_requests").update(patch).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); load(); }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4">
      <SEO title="Outdated Content Removal | A.R.I.A Ops" description="Submit and track Google Remove Outdated Content requests." noindex />
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Google: Remove Outdated Content</h1>
          <p className="text-muted-foreground mt-1">
            Submit a request for Google to refresh or remove a stale page from its index.
            Google's tool is browser-only — this page drafts the rationale, logs the request,
            and opens the official tool with everything ready to paste.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New request</CardTitle>
            <CardDescription>
              Pre-filled for the inactive Facebook page. Edit before submitting if needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="url">Target URL</Label>
              <div className="flex gap-2 mt-1">
                <Input id="url" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} />
                <Button variant="outline" size="icon" onClick={copyUrl} title="Copy URL">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="reason">Why the page is outdated</Label>
              <Textarea id="reason" rows={4} value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="expected">What should change in Google</Label>
              <Textarea id="expected" rows={3} value={expected} onChange={(e) => setExpected(e.target.value)} className="mt-1" />
            </div>

            <div className="rounded-md border border-border bg-muted/30 p-4 text-sm space-y-2">
              <p className="font-medium">How to submit</p>
              <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                <li>Click <span className="font-medium text-foreground">Open Google's tool</span> — a draft is saved here automatically.</li>
                <li>Sign in with the Google account you use for Search Console.</li>
                <li>Choose <em>New request</em> → paste the URL → select <em>Page has changed</em> or <em>Page has been removed</em>.</li>
                <li>Paste the words from <em>Why the page is outdated</em> as proof Google's snippet/cache is stale.</li>
                <li>Submit. Copy the Google ticket reference, then come back and mark this row as <em>submitted</em>.</li>
              </ol>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={openGoogleTool} disabled={saving}>
                <ExternalLink className="h-4 w-4 mr-2" /> Open Google's tool & save draft
              </Button>
              <Button variant="secondary" onClick={() => saveDraft("draft")} disabled={saving}>Save draft only</Button>
              <Button variant="outline" onClick={() => saveDraft("submitted")} disabled={saving}>
                <CheckCircle2 className="h-4 w-4 mr-2" /> Log as already submitted
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requests log</CardTitle>
            <CardDescription>Track status of every outdated-content request.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading…</p>
            ) : rows.length === 0 ? (
              <p className="text-muted-foreground text-sm">No requests yet.</p>
            ) : (
              <div className="space-y-3">
                {rows.map((r) => (
                  <div key={r.id} className="rounded-md border border-border p-4 space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <a href={r.target_url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline break-all">
                          {r.target_url}
                        </a>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Created {new Date(r.created_at).toLocaleString()}
                          {r.submitted_at && ` · Submitted ${new Date(r.submitted_at).toLocaleString()}`}
                        </p>
                      </div>
                      <Badge variant={STATUS_VARIANT[r.status] ?? "secondary"}>{r.status}</Badge>
                    </div>
                    {r.reason && <p className="text-sm text-muted-foreground line-clamp-3">{r.reason}</p>}
                    <div className="flex flex-wrap gap-2 items-center pt-2">
                      <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                        <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="approved">Approved by Google</SelectItem>
                          <SelectItem value="denied">Denied</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Google ticket ref (optional)"
                        defaultValue={r.google_ticket_ref ?? ""}
                        onBlur={(e) => {
                          if ((e.target.value || null) !== (r.google_ticket_ref ?? null)) {
                            updateStatus(r.id, r.status, e.target.value);
                          }
                        }}
                        className="w-64"
                      />
                    </div>
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
