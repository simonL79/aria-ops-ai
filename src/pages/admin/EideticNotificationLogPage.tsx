import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, RefreshCw, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type LogRow = {
  id: string;
  event_id: string | null;
  recipient_email: string;
  recipient_user_id: string | null;
  status: string;
  error_message: string | null;
  sent_at: string;
};

const PAGE_SIZE = 25;

const EideticNotificationLogPage = () => {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'failed'>('all');
  const [page, setPage] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let q = (supabase.from('eidetic_notification_log') as any)
      .select('*', { count: 'exact' })
      .order('sent_at', { ascending: false });
    if (statusFilter !== 'all') q = q.eq('status', statusFilter);
    const { data, error, count } = await q.range(from, to);
    if (error) console.error(error);
    setRows(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => { setPage(0); }, [statusFilter]);
  useEffect(() => { load(); }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="h-4 w-4" /> Back to Admin
            </Link>
            <h1 className="text-2xl font-semibold">Resurfacing Notification Log</h1>
            <p className="text-sm text-muted-foreground">Delivery record of resurfacing email alerts.</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => load()} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{total} record{total === 1 ? '' : 's'}</CardTitle>
            <CardDescription>Each row is one email send attempt to a single recipient.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-muted-foreground text-sm">Loading…</div>
            ) : rows.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">No notification records yet.</div>
            ) : (
              <div className="space-y-2">
                {rows.map((r) => (
                  <div key={r.id} className="flex items-start gap-3 rounded-md border p-3">
                    <div className="mt-0.5">
                      {r.status === 'sent' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium truncate">{r.recipient_email}</span>
                        <Badge variant={r.status === 'sent' ? 'default' : 'destructive'}>{r.status}</Badge>
                        {!r.recipient_user_id && (
                          <span className="text-xs text-muted-foreground">external</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                        <span title={new Date(r.sent_at).toLocaleString()}>
                          {formatDistanceToNow(new Date(r.sent_at), { addSuffix: true })}
                        </span>
                        {r.event_id && (
                          <Link
                            to={`/portal/threats/resurfacing/${r.event_id}`}
                            className="text-primary hover:underline"
                          >
                            View event
                          </Link>
                        )}
                      </div>
                      {r.error_message && (
                        <p className="text-xs text-red-500/90 mt-1 break-words font-mono">{r.error_message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-muted-foreground">Page {page + 1} of {totalPages}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EideticNotificationLogPage;
