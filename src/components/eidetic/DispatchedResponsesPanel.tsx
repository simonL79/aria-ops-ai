import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw, Send } from 'lucide-react';

interface Dispatch {
  id: string;
  action_type: string;
  status: string;
  created_at: string;
  dispatched_at: string | null;
  error_message: string | null;
  result: any;
  event_id: string | null;
}

const statusVariant = (s: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (s === 'dispatched') return 'default';
  if (s === 'failed') return 'destructive';
  if (s === 'pending' || s === 'approved') return 'secondary';
  return 'outline';
};

const DispatchedResponsesPanel = () => {
  const [rows, setRows] = useState<Dispatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from('eidetic_dispatched_responses') as any)
      .select('id, action_type, status, created_at, dispatched_at, error_message, result, event_id')
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) toast.error(`Failed to load dispatches: ${error.message}`);
    setRows((data as Dispatch[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const retry = async (id: string) => {
    setRetryingId(id);
    try {
      const { data, error } = await supabase.functions.invoke('eidetic-retry-dispatch', {
        body: { dispatch_id: id },
      });
      if (error) throw error;
      if (data?.ok) toast.success('Retry succeeded');
      else toast.error(`Retry failed: ${data?.error ?? 'unknown'}`);
      await load();
    } catch (e: any) {
      toast.error(`Retry error: ${e.message ?? e}`);
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" /> Dispatched Responses
        </CardTitle>
        <Button onClick={load} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No dispatches yet.</p>
        ) : (
          <div className="space-y-2">
            {rows.map((r) => {
              const ds = r.result?.downstream;
              return (
                <div key={r.id} className="flex items-start justify-between gap-3 border rounded-md p-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
                      <span className="font-medium">{r.action_type}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </span>
                    </div>
                    {ds?.function && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        → {ds.function} {ds.ok ? '✓' : '✗'}
                        {ds.data?.jobId && ` · job ${String(ds.data.jobId).slice(0, 8)}`}
                        {ds.data?.document_id && ` · doc ${String(ds.data.document_id).slice(0, 8)}`}
                      </p>
                    )}
                    {r.error_message && (
                      <p className="text-xs text-destructive mt-1 truncate" title={r.error_message}>
                        {r.error_message}
                      </p>
                    )}
                  </div>
                  {r.status === 'failed' && (
                    <Button
                      onClick={() => retry(r.id)}
                      variant="outline"
                      size="sm"
                      disabled={retryingId === r.id}
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${retryingId === r.id ? 'animate-spin' : ''}`} />
                      Retry
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DispatchedResponsesPanel;
