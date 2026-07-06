import { useEffect, useState, useCallback } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, History, Download, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RESURFACING_COLUMNS = 'id, event_type, severity, narrative_category, content_excerpt, content_url, status, created_at';
const PAGE_SIZE = 20;

const buildResurfacingQuery = (
  filters: { severity: string; eventType: string; status: string; search: string },
  opts?: { count?: boolean },
) => {
  let q = (supabase.from('eidetic_resurfacing_events') as any).select(
    RESURFACING_COLUMNS,
    opts?.count ? { count: 'exact' } : undefined,
  );
  if (filters.severity !== 'all') q = q.eq('severity', filters.severity);
  if (filters.eventType !== 'all') q = q.eq('event_type', filters.eventType);
  if (filters.status !== 'all') q = q.eq('status', filters.status);
  if (filters.search.trim()) q = q.ilike('content_excerpt', `%${filters.search.trim()}%`);
  return q.order('created_at', { ascending: false });
};

const exportResurfacingToCSV = (events: any[]) => {
  if (!events || events.length === 0) return;
  const headers = ['ID', 'Date', 'Event Type', 'Severity', 'Narrative Category', 'Status', 'Content Excerpt', 'Source URL'];
  const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csvContent = [
    headers.join(','),
    ...events.map((ev) => [
      esc(ev.id),
      esc(ev.created_at ? new Date(ev.created_at).toLocaleString() : ''),
      esc((ev.event_type || '').replace(/_/g, ' ')),
      esc(ev.severity),
      esc(ev.narrative_category),
      esc(ev.status),
      esc((ev.content_excerpt || '').substring(0, 500)),
      esc(ev.content_url),
    ].join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `resurfacing-events-${new Date().toISOString().split('T')[0]}.csv`;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const severityColor = (sev?: string) => {
  switch ((sev || '').toLowerCase()) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/40';
    case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    default: return 'bg-white/10 text-white/60 border-white/20';
  }
};

const PortalThreats = () => {
  const [threats, setThreats] = useState<any[]>([]);
  const [resurfacing, setResurfacing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [threatsRes, resurfacingRes] = await Promise.all([
        (supabase.from('threats') as any)
          .select('id, entity_name, threat_type, severity, source, content, url, status, created_at')
          .order('created_at', { ascending: false })
          .limit(200),
        (supabase.from('eidetic_resurfacing_events') as any)
          .select('id, event_type, severity, narrative_category, content_excerpt, content_url, status, created_at')
          .order('created_at', { ascending: false })
          .limit(100),
      ]);
      if (threatsRes.error) console.error(threatsRes.error);
      if (resurfacingRes.error) console.error(resurfacingRes.error);
      setThreats(threatsRes.data ?? []);
      setResurfacing(resurfacingRes.data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <PortalLayout title="Threats">
      {loading ? (
        <div className="text-white/50">Loading…</div>
      ) : (
        <div className="space-y-8">
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-orange-400" />
                <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Resurfacing Alerts</h2>
              </div>
              {resurfacing.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportResurfacingToCSV(resurfacing)}
                  className="gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </Button>
              )}
            </div>
            {resurfacing.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center text-white/60">
                  No resurfacing events detected on your monitored footprints.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {resurfacing.map((ev) => (
                  <Card key={ev.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={severityColor(ev.severity)}>{ev.severity || 'unknown'}</Badge>
                          <span className="text-sm font-medium text-white/90 capitalize">
                            {(ev.event_type || '').replace(/_/g, ' ')}
                          </span>
                          {ev.narrative_category && (
                            <Badge variant="outline" className="text-xs">{ev.narrative_category}</Badge>
                          )}
                          {ev.status && ev.status !== 'active' && (
                            <Badge variant="outline" className="text-xs capitalize">{ev.status}</Badge>
                          )}
                        </div>
                        <span className="text-xs text-white/40 shrink-0">
                          {formatDistanceToNow(new Date(ev.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      {ev.content_excerpt && (
                        <p className="text-sm text-white/70 mb-2 line-clamp-3 border-l-2 border-white/10 pl-2">
                          {ev.content_excerpt}
                        </p>
                      )}
                      {ev.content_url && (
                        <a href={ev.content_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-orange-400 hover:underline">
                          View source <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Detected Threats</h2>
            {threats.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-8 text-center text-white/60">No threats detected on your monitored entities.</CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {threats.map((t) => (
                  <Card key={t.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={severityColor(t.severity)}>{t.severity || 'unknown'}</Badge>
                          {t.threat_type && <Badge variant="outline" className="text-xs">{t.threat_type}</Badge>}
                          {t.source && <span className="text-xs text-white/40">{t.source}</span>}
                        </div>
                        <span className="text-xs text-white/40 shrink-0">
                          {new Date(t.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-white/80 mb-2 line-clamp-3">{t.content || '—'}</div>
                      {t.url && (
                        <a href={t.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-orange-400 hover:underline">
                          View source <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </PortalLayout>
  );
};

export default PortalThreats;
