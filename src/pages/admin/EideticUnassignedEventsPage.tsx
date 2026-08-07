import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, RefreshCw, Link2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

type EventRow = {
  id: string;
  event_type: string | null;
  severity: string | null;
  title: string | null;
  summary: string | null;
  status: string | null;
  footprint_id: string | null;
  created_at: string;
};

type ClientRow = { id: string; name: string };

const EideticUnassignedEventsPage = () => {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [selection, setSelection] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: events, error: evErr }, { data: clientRows, error: clErr }] = await Promise.all([
      (supabase.from('eidetic_resurfacing_events') as any)
        .select('id, event_type, severity, title, summary, status, footprint_id, created_at')
        .is('client_id', null)
        .order('created_at', { ascending: false })
        .limit(200),
      (supabase.from('clients') as any).select('id, name').order('name', { ascending: true }),
    ]);
    if (evErr) console.error(evErr);
    if (clErr) console.error(clErr);
    setRows(events ?? []);
    setClients(clientRows ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const assign = async (eventId: string) => {
    const clientId = selection[eventId];
    if (!clientId) return;
    setSaving(eventId);
    const { error } = await (supabase.from('eidetic_resurfacing_events') as any)
      .update({ client_id: clientId })
      .eq('id', eventId);
    setSaving(null);
    if (error) {
      toast.error('Could not assign client', { description: error.message });
      return;
    }
    const client = clients.find((c) => c.id === clientId);
    toast.success(`Event assigned to ${client?.name ?? 'client'}`);
    setRows((prev) => prev.filter((r) => r.id !== eventId));
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="h-4 w-4" /> Back to Admin
            </Link>
            <h1 className="text-2xl font-semibold">Unassigned Resurfacing Events</h1>
            <p className="text-sm text-muted-foreground">
              Events with no client attached. They stay invisible in the client portal until a client is assigned.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => load()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{rows.length} unassigned event{rows.length === 1 ? '' : 's'}</CardTitle>
            <CardDescription>Pick the owning client, then assign. Assigned events disappear from this list.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-muted-foreground text-sm">Loading…</div>
            ) : rows.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                Every resurfacing event is attributed to a client.
              </div>
            ) : (
              <div className="space-y-3">
                {rows.map((r) => (
                  <div key={r.id} className="rounded-md border p-3 space-y-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{r.title || r.event_type || 'Resurfacing event'}</span>
                          {r.severity && <Badge variant="outline">{r.severity}</Badge>}
                          {r.status && <Badge variant="secondary">{r.status}</Badge>}
                        </div>
                        {r.summary && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.summary}</p>
                        )}
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                          <span title={new Date(r.created_at).toLocaleString()}>
                            {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                          </span>
                          <Link to={`/portal/threats/resurfacing/${r.id}`} className="text-primary hover:underline">
                            View event
                          </Link>
                          {r.footprint_id && (
                            <span className="font-mono">footprint {r.footprint_id.slice(0, 8)}…</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={selection[r.id] ?? ''}
                          onValueChange={(v) => setSelection((s) => ({ ...s, [r.id]: v }))}
                        >
                          <SelectTrigger className="w-56"><SelectValue placeholder="Select client" /></SelectTrigger>
                          <SelectContent>
                            {clients.map((c) => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={() => assign(r.id)}
                          disabled={!selection[r.id] || saving === r.id}
                        >
                          <Link2 className="h-4 w-4 mr-1" />
                          {saving === r.id ? 'Assigning…' : 'Assign'}
                        </Button>
                      </div>
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
};

export default EideticUnassignedEventsPage;
