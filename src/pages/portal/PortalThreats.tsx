import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
  const [loading, setLoading] = useState(true);

  // Resurfacing list state (server-side filtering + pagination)
  const [resurfacing, setResurfacing] = useState<any[]>([]);
  const [resLoading, setResLoading] = useState(true);
  const [resTotal, setResTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [severity, setSeverity] = useState('all');
  const [eventType, setEventType] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const filters = { severity, eventType, status, search };

  // Load threats once
  useEffect(() => {
    const load = async () => {
      const { data, error } = await (supabase.from('threats') as any)
        .select('id, entity_name, threat_type, severity, source, content, url, status, created_at')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) console.error(error);
      setThreats(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  // Reset to first page whenever a filter changes
  useEffect(() => {
    setPage(0);
  }, [severity, eventType, status, search]);

  // Debounce the search input
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Load resurfacing events for current filters + page
  useEffect(() => {
    const load = async () => {
      setResLoading(true);
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error, count } = await buildResurfacingQuery(filters, { count: true }).range(from, to);
      if (error) console.error(error);
      setResurfacing(data ?? []);
      setResTotal(count ?? 0);
      setResLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severity, eventType, status, search, page]);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const { data, error } = await buildResurfacingQuery(filters).limit(5000);
      if (error) throw error;
      exportResurfacingToCSV(data ?? []);
    } catch (e) {
      console.error('Export failed', e);
    } finally {
      setExporting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severity, eventType, status, search]);

  const totalPages = Math.max(1, Math.ceil(resTotal / PAGE_SIZE));
  const hasFilters = severity !== 'all' || eventType !== 'all' || status !== 'all' || !!search;


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
                {resTotal > 0 && (
                  <span className="text-xs text-white/40">({resTotal})</span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={exporting || resTotal === 0}
                className="gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                {exporting ? 'Exporting…' : 'Export CSV'}
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search excerpt…"
                  className="pl-8 h-9 bg-white/5 border-white/10 text-white/90 placeholder:text-white/30"
                />
              </div>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger className="h-9 w-[130px] bg-white/5 border-white/10 text-white/80"><SelectValue placeholder="Severity" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-9 w-[130px] bg-white/5 border-white/10 text-white/80"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="snoozed">Snoozed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-white/60 hover:text-white/90"
                  onClick={() => { setSeverity('all'); setEventType('all'); setStatus('all'); setSearchInput(''); setSearch(''); }}
                >
                  Clear
                </Button>
              )}
            </div>

            {resLoading ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center text-white/50">Loading events…</CardContent>
              </Card>
            ) : resurfacing.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center text-white/60">
                  {hasFilters
                    ? 'No resurfacing events match the current filters.'
                    : 'No resurfacing events detected on your monitored footprints.'}
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
                      <div className="flex items-center gap-4 flex-wrap">
                        <Link
                          to={`/portal/threats/resurfacing/${ev.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-white/80 hover:text-white hover:underline"
                        >
                          View details <ChevronRight className="h-3 w-3" />
                        </Link>
                        {ev.content_url && (
                          <a href={ev.content_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-orange-400 hover:underline">
                            View source <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {resTotal > PAGE_SIZE && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-white/40">
                  Page {page + 1} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    disabled={page === 0 || resLoading}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    disabled={page + 1 >= totalPages || resLoading}
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
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
