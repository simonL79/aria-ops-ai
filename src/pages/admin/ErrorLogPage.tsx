import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, RefreshCw, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ErrorAlertRules from '@/components/admin/ErrorAlertRules';

type ErrorRow = {
  id: string;
  section: string;
  route: string | null;
  message: string;
  stack: string | null;
  component_stack: string | null;
  user_agent: string | null;
  user_id: string | null;
  created_at: string;
};

const PAGE_SIZE = 25;

const ErrorLogPage = () => {
  const [rows, setRows] = useState<ErrorRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<string[]>([]);
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let q = (supabase.from('client_error_logs') as any)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    if (sectionFilter !== 'all') q = q.eq('section', sectionFilter);
    const { data, error, count } = await q.range(from, to);
    if (error) console.error(error);
    setRows(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [page, sectionFilter]);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase.from('client_error_logs') as any)
        .select('section')
        .order('section');
      const unique = Array.from(new Set((data ?? []).map((r: any) => r.section))).filter(Boolean) as string[];
      setSections(unique);
    })();
  }, []);

  useEffect(() => { setPage(0); }, [sectionFilter]);
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
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" /> UI Error Log
            </h1>
            <p className="text-sm text-muted-foreground">Client-side crashes captured across the portal, including the Resurfacing Alerts section.</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-52"><SelectValue placeholder="Section" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sections</SelectItem>
                {sections.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => load()} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <ErrorAlertRules sections={sections} />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{total} error{total === 1 ? '' : 's'}</CardTitle>
            <CardDescription>Newest first. Click a row to see the stack trace and details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading && rows.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">Loading…</p>
            )}
            {!loading && rows.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">No errors recorded. 🎉</p>
            )}
            {rows.map((row) => (
              <div key={row.id} className="border rounded-md">
                <button
                  className="w-full text-left p-3 flex items-start justify-between gap-3 hover:bg-muted/50"
                  onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary">{row.section}</Badge>
                      {row.route && <code className="text-xs text-muted-foreground">{row.route}</code>}
                    </div>
                    <p className="text-sm font-medium mt-1 break-words">{row.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                    {formatDistanceToNow(new Date(row.created_at), { addSuffix: true })}
                  </span>
                </button>
                {expanded === row.id && (
                  <div className="border-t p-3 space-y-3 text-xs">
                    {row.user_id && <div><span className="text-muted-foreground">User: </span><code>{row.user_id}</code></div>}
                    {row.user_agent && <div><span className="text-muted-foreground">Agent: </span>{row.user_agent}</div>}
                    {row.stack && (
                      <div>
                        <div className="text-muted-foreground mb-1">Stack trace</div>
                        <pre className="bg-muted p-2 rounded overflow-auto max-h-64 whitespace-pre-wrap">{row.stack}</pre>
                      </div>
                    )}
                    {row.component_stack && (
                      <div>
                        <div className="text-muted-foreground mb-1">Component stack</div>
                        <pre className="bg-muted p-2 rounded overflow-auto max-h-64 whitespace-pre-wrap">{row.component_stack}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button variant="outline" size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorLogPage;
