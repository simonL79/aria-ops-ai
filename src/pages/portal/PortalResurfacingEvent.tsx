import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ExternalLink, Check, Clock, CheckCircle2, RotateCcw, Link2, Copy } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const severityColor = (sev?: string) => {
  switch ((sev || '').toLowerCase()) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/40';
    case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    default: return 'bg-white/10 text-white/60 border-white/20';
  }
};

const fmtPct = (n: number | null | undefined) =>
  (n === null || n === undefined) ? '—' : `${(Number(n) * 100).toFixed(0)}%`;

const fmtDate = (v?: string | null) => {
  if (!v) return '—';
  try { return format(new Date(v), 'PPpp'); } catch { return String(v); }
};

const titleCase = (v?: string | null) => (v || '').replace(/_/g, ' ');

type TimelineItem = {
  ts: string;
  label: string;
  detail?: React.ReactNode;
  tone: 'detect' | 'signal' | 'notify' | 'ack' | 'snooze' | 'resolve';
  future?: boolean;
};

const fmtPctT = (n: number | null | undefined) =>
  (n === null || n === undefined) ? '—' : `${(Number(n) * 100).toFixed(0)}%`;

const buildTimeline = (event: any): TimelineItem[] => {
  const items: TimelineItem[] = [];

  if (event.created_at) {
    items.push({ ts: event.created_at, tone: 'detect', label: 'Event detected' });
    const changes: string[] = [];
    if (event.prev_decay_score != null || event.new_decay_score != null) {
      changes.push(`Decay ${fmtPctT(event.prev_decay_score)} → ${fmtPctT(event.new_decay_score)}`);
    }
    if (event.prev_threat_30d != null || event.new_threat_30d != null) {
      changes.push(`Threat 30d ${fmtPctT(event.prev_threat_30d)} → ${fmtPctT(event.new_threat_30d)}`);
    }
    if (changes.length) {
      items.push({ ts: event.created_at, tone: 'signal', label: 'Signal change recorded', detail: changes.join(' · ') });
    }
  }
  if (event.notified_at) {
    items.push({ ts: event.notified_at, tone: 'notify', label: 'Client notified' });
  }
  if (event.acknowledged_at) {
    items.push({ ts: event.acknowledged_at, tone: 'ack', label: 'Acknowledged' });
  }
  if (event.snoozed_until) {
    const future = new Date(event.snoozed_until).getTime() > Date.now();
    items.push({
      ts: event.snoozed_until,
      tone: 'snooze',
      label: future ? 'Snoozed until' : 'Snooze expired',
      future,
    });
  }
  if (event.resolved_at) {
    items.push({
      ts: event.resolved_at,
      tone: 'resolve',
      label: 'Resolved',
      detail: event.resolution_notes || undefined,
    });
  }

  return items.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
};

const toneDot: Record<TimelineItem['tone'], string> = {
  detect: 'bg-orange-400',
  signal: 'bg-sky-400',
  notify: 'bg-violet-400',
  ack: 'bg-emerald-400',
  snooze: 'bg-yellow-400',
  resolve: 'bg-green-500',
};

const PortalResurfacingEvent = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [acting, setActing] = useState<string | null>(null);
  const [snoozeHours, setSnoozeHours] = useState('24');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await (supabase.from('eidetic_resurfacing_events') as any)
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) console.error(error);
      if (!data) setNotFound(true);
      setEvent(data ?? null);
      setLoading(false);
    };
    load();
  }, [id]);

  const runAction = async (action: string, extra?: Record<string, any>) => {
    if (!id) return;
    setActing(action);
    try {
      const { data, error } = await (supabase.rpc as any)('portal_resurfacing_event_action', {
        _event_id: id,
        _action: action,
        _hours: extra?.hours ?? null,
        _notes: extra?.resolution_notes ?? null,
      });
      if (error) throw error;
      if (data) setEvent(data);
      toast.success(
        action === 'acknowledge' ? 'Event acknowledged'
          : action === 'snooze' ? 'Event snoozed'
          : action === 'resolve' ? 'Event resolved'
          : 'Event reopened',
      );
      if (action === 'resolve') setResolutionNotes('');
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Action failed');
    } finally {
      setActing(null);
    }
  };


  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-0.5 py-2 border-b border-white/5 last:border-0 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-xs uppercase tracking-wide text-white/40 shrink-0">{label}</span>
      <span className="text-sm text-white/85 sm:text-right break-words">{children}</span>
    </div>
  );

  return (
    <PortalLayout title="Resurfacing Event">
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-white/60 hover:text-white/90 -ml-2">
          <Link to="/portal/threats"><ArrowLeft className="h-3.5 w-3.5" /> Back to Threats</Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-white/50">Loading…</div>
      ) : notFound || !event ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-8 text-center text-white/60">
            This resurfacing event was not found or you don’t have access to it.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 max-w-3xl">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={severityColor(event.severity)}>{event.severity || 'unknown'}</Badge>
            <h1 className="text-xl font-semibold text-white capitalize">{titleCase(event.event_type)}</h1>
            {event.narrative_category && (
              <Badge variant="outline" className="text-xs">{event.narrative_category}</Badge>
            )}
            {event.status && (
              <Badge variant="outline" className="text-xs capitalize">{event.status}</Badge>
            )}
          </div>

          {/* Actions */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-5 space-y-4">
              <div className="text-xs uppercase tracking-wide text-white/40">Actions</div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!!acting || event.acknowledged}
                  onClick={() => runAction('acknowledge')}
                  className="gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  {event.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                </Button>

                <div className="flex items-center gap-1.5">
                  <Select value={snoozeHours} onValueChange={setSnoozeHours} disabled={!!acting}>
                    <SelectTrigger className="h-9 w-[130px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="24">1 day</SelectItem>
                      <SelectItem value="72">3 days</SelectItem>
                      <SelectItem value="168">1 week</SelectItem>
                      <SelectItem value="720">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!!acting}
                    onClick={() => runAction('snooze', { hours: Number(snoozeHours) })}
                    className="gap-1.5"
                  >
                    <Clock className="h-3.5 w-3.5" /> Snooze
                  </Button>
                </div>

                {event.status === 'resolved' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!!acting}
                    onClick={() => runAction('reopen')}
                    className="gap-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reopen
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={!!acting}
                    onClick={() => runAction('resolve', resolutionNotes.trim() ? { resolution_notes: resolutionNotes.trim() } : {})}
                    className="gap-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
                  </Button>
                )}
              </div>
              {event.status !== 'resolved' && (
                <Textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Optional resolution notes (saved when you resolve this event)…"
                  className="bg-black/20 border-white/10 text-sm"
                  rows={2}
                  disabled={!!acting}
                />
              )}
            </CardContent>
          </Card>

          {/* Excerpt */}
          {event.content_excerpt && (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-5">
                <div className="text-xs uppercase tracking-wide text-white/40 mb-2">Content Excerpt</div>
                <p className="text-sm text-white/80 whitespace-pre-wrap border-l-2 border-white/10 pl-3">
                  {event.content_excerpt}
                </p>
                {event.content_url && (
                  <a href={event.content_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-orange-400 hover:underline">
                    View source <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wide text-white/40 mb-4">Timeline</div>
              {(() => {
                const items = buildTimeline(event);
                if (!items.length) return <div className="text-sm text-white/50">No timeline events yet.</div>;
                return (
                  <ol className="relative border-l border-white/10 ml-1.5 space-y-5">
                    {items.map((it, i) => (
                      <li key={i} className="ml-5">
                        <span
                          className={`absolute -left-[7px] mt-1 h-3 w-3 rounded-full ring-2 ring-[#1C172B] ${toneDot[it.tone]} ${it.future ? 'opacity-50' : ''}`}
                        />
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className="text-sm font-medium text-white/90">{it.label}</span>
                          {it.future && (
                            <Badge variant="outline" className="text-[10px] py-0">upcoming</Badge>
                          )}
                        </div>
                        <div className="text-xs text-white/45">
                          {fmtDate(it.ts)}
                          <span className="ml-2">
                            ({formatDistanceToNow(new Date(it.ts), { addSuffix: true })})
                          </span>
                        </div>
                        {it.detail && (
                          <div className="mt-1 text-sm text-white/70 whitespace-pre-wrap">{it.detail}</div>
                        )}
                      </li>
                    ))}
                  </ol>
                );
              })()}
            </CardContent>
          </Card>

          {/* Score deltas */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wide text-white/40 mb-3">Signal Changes</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-white/40 mb-1">Decay Score</div>
                  <div className="text-sm text-white/85">
                    {fmtPct(event.prev_decay_score)} → <b>{fmtPct(event.new_decay_score)}</b>
                    {event.decay_delta != null && (
                      <span className="ml-2 text-xs text-white/50">(Δ {fmtPct(event.decay_delta)})</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/40 mb-1">Threat (30d)</div>
                  <div className="text-sm text-white/85">
                    {fmtPct(event.prev_threat_30d)} → <b>{fmtPct(event.new_threat_30d)}</b>
                    {event.threat_delta != null && (
                      <span className="ml-2 text-xs text-white/50">(Δ {fmtPct(event.threat_delta)})</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata & timestamps */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wide text-white/40 mb-2">Details</div>
              <Row label="Event ID">{event.id}</Row>
              <Row label="Event Type">{titleCase(event.event_type) || '—'}</Row>
              <Row label="Severity">{event.severity || '—'}</Row>
              <Row label="Narrative Category">{event.narrative_category || '—'}</Row>
              <Row label="Status">{event.status || '—'}</Row>
              <Row label="Detected">
                {fmtDate(event.created_at)}
                {event.created_at && (
                  <span className="ml-2 text-xs text-white/40">
                    ({formatDistanceToNow(new Date(event.created_at), { addSuffix: true })})
                  </span>
                )}
              </Row>
              <Row label="Notified">{fmtDate(event.notified_at)}</Row>
              <Row label="Acknowledged">
                {event.acknowledged ? fmtDate(event.acknowledged_at) : 'No'}
              </Row>
              <Row label="Snoozed Until">{fmtDate(event.snoozed_until)}</Row>
              <Row label="Resolved">{fmtDate(event.resolved_at)}</Row>
              {event.resolution_notes && <Row label="Resolution Notes">{event.resolution_notes}</Row>}
              <Row label="Footprint ID">{event.footprint_id || '—'}</Row>
            </CardContent>
          </Card>

          {/* Raw metadata */}
          {event.metadata && Object.keys(event.metadata || {}).length > 0 && (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-5">
                <div className="text-xs uppercase tracking-wide text-white/40 mb-2">Additional Metadata</div>
                <pre className="text-xs text-white/70 whitespace-pre-wrap break-words bg-black/30 rounded-md p-3 overflow-x-auto">
                  {JSON.stringify(event.metadata, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </PortalLayout>
  );
};

export default PortalResurfacingEvent;
