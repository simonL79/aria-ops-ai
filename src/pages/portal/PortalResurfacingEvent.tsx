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
import { ArrowLeft, ExternalLink, Check, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
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

const PortalResurfacingEvent = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
