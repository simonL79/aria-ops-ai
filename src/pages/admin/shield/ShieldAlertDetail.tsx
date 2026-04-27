import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Shield, ExternalLink } from 'lucide-react';
import { ALLOWED_TRANSITIONS, SEVERITY_COLOR, SEVERITY_LABEL, STATUS_LABEL, TYPE_LABEL, ShieldAlertStatus } from '@/lib/shield/taxonomy';
import EvidenceUploadDialog from '@/components/shield/EvidenceUploadDialog';
import { format } from 'date-fns';

export default function ShieldAlertDetail() {
  const { id } = useParams();
  const [alert, setAlert] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [scoreEvents, setScoreEvents] = useState<any[]>([]);
  const [nextStatus, setNextStatus] = useState<string>('');
  const [transitionNotes, setTransitionNotes] = useState('');
  const [working, setWorking] = useState(false);

  const load = async () => {
    if (!id) return;
    const [a, e, ev, se] = await Promise.all([
      (supabase as any).from('shield_alerts').select('*').eq('id', id).maybeSingle(),
      (supabase as any).from('shield_alert_events').select('*').eq('alert_id', id).order('created_at', { ascending: false }),
      (supabase as any).from('shield_evidence_items').select('*').eq('alert_id', id).order('captured_at', { ascending: false }),
      (supabase as any).from('shield_score_events').select('*').eq('alert_id', id).order('created_at', { ascending: false }),
    ]);
    setAlert(a.data); setEvents(e.data || []); setEvidence(ev.data || []); setScoreEvents(se.data || []);
  };

  useEffect(() => { load(); }, [id]);

  if (!alert) return <div className="min-h-screen bg-background p-6"><div className="text-muted-foreground">Loading…</div></div>;

  const allowedNext = ALLOWED_TRANSITIONS[alert.status as ShieldAlertStatus] || [];

  const handleTransition = async () => {
    if (!nextStatus) return;
    setWorking(true);
    const { error } = await supabase.functions.invoke('shield-transition-alert', {
      body: { alert_id: id, to_status: nextStatus, notes: transitionNotes || undefined },
    });
    setWorking(false);
    if (error) { toast.error('Transition failed'); return; }
    toast.success(`Status → ${STATUS_LABEL[nextStatus as ShieldAlertStatus]}`);
    setNextStatus(''); setTransitionNotes('');
    load();
  };

  const toggleClientVisible = async (val: boolean) => {
    await (supabase as any).from('shield_alerts').update({ client_visible: val }).eq('id', id);
    setAlert({ ...alert, client_visible: val });
    toast.success(val ? 'Visible to client' : 'Hidden from client');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/admin/shield/alerts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> All alerts
        </Link>

        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-6 w-6 text-primary" />
              <Badge variant="outline" className={SEVERITY_COLOR[alert.severity as keyof typeof SEVERITY_COLOR]}>{SEVERITY_LABEL[alert.severity as keyof typeof SEVERITY_LABEL]}</Badge>
              <Badge variant="outline">{TYPE_LABEL[alert.alert_type as keyof typeof TYPE_LABEL]}</Badge>
              <Badge variant="outline">{STATUS_LABEL[alert.status as keyof typeof STATUS_LABEL]}</Badge>
            </div>
            <h1 className="text-2xl font-bold">{alert.title}</h1>
            {alert.entity_name && <p className="text-muted-foreground mt-1">Entity: {alert.entity_name}</p>}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="evidence">Evidence ({evidence.length})</TabsTrigger>
                <TabsTrigger value="timeline">Timeline ({events.length})</TabsTrigger>
                <TabsTrigger value="scoring">Scoring</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="p-5 bg-card/50 backdrop-blur border-border space-y-3">
                  <div><div className="text-xs text-muted-foreground">Summary</div><div className="text-sm whitespace-pre-wrap">{alert.summary || '—'}</div></div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><div className="text-xs text-muted-foreground">Source</div><div>{alert.source || '—'}</div></div>
                    <div><div className="text-xs text-muted-foreground">Platform</div><div>{alert.source_platform || '—'}</div></div>
                  </div>
                  {alert.source_url && (
                    <div><div className="text-xs text-muted-foreground">URL</div>
                      <a href={alert.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 break-all text-sm">
                        {alert.source_url} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {alert.source_threat_id && (
                    <div><div className="text-xs text-muted-foreground">Source Threat ID</div><code className="text-xs">{alert.source_threat_id}</code></div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="evidence">
                <Card className="p-5 bg-card/50 backdrop-blur border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Evidence Vault</h3>
                    <EvidenceUploadDialog alertId={id!} onAdded={load} />
                  </div>
                  {evidence.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-6 text-center">No evidence captured yet.</div>
                  ) : (
                    <ul className="space-y-3">
                      {evidence.map((ev) => (
                        <li key={ev.id} className="border border-border rounded p-3 text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline">{ev.evidence_type}</Badge>
                            <span className="text-xs text-muted-foreground">{format(new Date(ev.captured_at), 'PPp')}</span>
                          </div>
                          {ev.source_url && <a href={ev.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs break-all">{ev.source_url}</a>}
                          {ev.notes && <div className="text-muted-foreground mt-1">{ev.notes}</div>}
                          {ev.captured_text && <pre className="text-xs bg-muted/30 p-2 mt-2 rounded max-h-40 overflow-auto whitespace-pre-wrap">{ev.captured_text.slice(0, 800)}{ev.captured_text.length > 800 ? '…' : ''}</pre>}
                          {ev.content_hash && <div className="text-xs text-muted-foreground mt-1 font-mono">sha256: {ev.content_hash.slice(0, 16)}…</div>}
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="timeline">
                <Card className="p-5 bg-card/50 backdrop-blur border-border">
                  {events.length === 0 ? <div className="text-sm text-muted-foreground">No events.</div> : (
                    <ul className="space-y-3">
                      {events.map((e) => (
                        <li key={e.id} className="text-sm border-l-2 border-primary/40 pl-3">
                          <div className="font-medium">{e.event_type}{e.from_status && e.to_status ? `: ${e.from_status} → ${e.to_status}` : ''}</div>
                          {e.notes && <div className="text-muted-foreground">{e.notes}</div>}
                          <div className="text-xs text-muted-foreground">{format(new Date(e.created_at), 'PPp')}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="scoring">
                <Card className="p-5 bg-card/50 backdrop-blur border-border">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {[
                      ['Harm', alert.harm_score],['Reach', alert.reach_score],['Public risk', alert.public_risk_score],
                      ['Legal risk', alert.legal_risk_score],['Confidence', alert.confidence_score],['Urgency', alert.urgency_score],
                    ].map(([l, v]) => (
                      <div key={l as string} className="border border-border rounded p-3">
                        <div className="text-xs text-muted-foreground">{l}</div>
                        <div className="text-xl font-mono">{v as number}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total score</span>
                    <span className="text-2xl font-bold font-mono">{alert.total_score}</span>
                  </div>
                  {scoreEvents.length > 0 && <div className="mt-4 text-xs text-muted-foreground">{scoreEvents.length} score event(s) recorded.</div>}
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <Card className="p-5 bg-card/50 backdrop-blur border-border">
              <h3 className="font-semibold mb-3">Lifecycle</h3>
              {allowedNext.length === 0 ? (
                <p className="text-sm text-muted-foreground">Terminal state — no transitions available.</p>
              ) : (
                <div className="space-y-3">
                  <Select value={nextStatus} onValueChange={setNextStatus}>
                    <SelectTrigger><SelectValue placeholder="Move to…" /></SelectTrigger>
                    <SelectContent>
                      {allowedNext.map(s => <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Textarea placeholder="Notes (optional)" value={transitionNotes} onChange={(e) => setTransitionNotes(e.target.value)} rows={3} />
                  <Button onClick={handleTransition} disabled={!nextStatus || working} className="w-full">
                    {working ? 'Working…' : 'Apply transition'}
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-5 bg-card/50 backdrop-blur border-border">
              <h3 className="font-semibold mb-3">Client visibility</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="cv" className="text-sm text-muted-foreground">Visible in client portal</Label>
                <Switch id="cv" checked={!!alert.client_visible} onCheckedChange={toggleClientVisible} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Evidence is never exposed to the client portal — only the alert summary.</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
