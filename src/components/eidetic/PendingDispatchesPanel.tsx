import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Send, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Dispatch {
  id: string;
  hook_id: string | null;
  event_id: string | null;
  action_type: string;
  status: 'pending' | 'approved' | 'dispatched' | 'failed' | 'rejected';
  payload: any;
  result: any;
  approved_at: string | null;
  dispatched_at: string | null;
  error_message: string | null;
  created_at: string;
}

const statusColor: Record<string, string> = {
  pending: 'border-yellow-500/40 text-yellow-500 bg-yellow-500/10',
  approved: 'border-blue-500/40 text-blue-500 bg-blue-500/10',
  dispatched: 'border-green-500/40 text-green-500 bg-green-500/10',
  failed: 'border-red-500/40 text-red-500 bg-red-500/10',
  rejected: 'border-muted-foreground/40 text-muted-foreground bg-muted/30',
};

const PendingDispatchesPanel = () => {
  const [items, setItems] = useState<Dispatch[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await (supabase.from('eidetic_dispatched_responses') as any)
      .select('*').order('created_at', { ascending: false }).limit(100);
    setItems((data as Dispatch[]) ?? []);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel('dispatched-responses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'eidetic_dispatched_responses' }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const decide = async (id: string, decision: 'approve' | 'reject') => {
    setBusyId(id);
    try {
      const { error } = await supabase.functions.invoke('eidetic-approve-dispatch', {
        body: { dispatch_id: id, decision },
      });
      if (error) throw error;
      toast.success(decision === 'approve' ? 'Dispatched' : 'Rejected');
      load();
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed');
    } finally { setBusyId(null); }
  };

  const pendingCount = items.filter(i => i.status === 'pending').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2"><Send className="h-5 w-5" /> Auto-Response Dispatches</span>
          {pendingCount > 0 && (
            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/40">
              {pendingCount} pending approval
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No dispatches yet</p>
        ) : items.map(d => (
          <div key={d.id} className="border border-border/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={`text-[10px] uppercase ${statusColor[d.status]}`}>{d.status}</Badge>
                <span className="text-sm font-medium">{d.action_type}</span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {formatDistanceToNow(new Date(d.created_at), { addSuffix: true })}
              </span>
            </div>
            {d.payload?.event && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {d.payload.event.event_type} · {d.payload.event.narrative_category ?? '—'} · {d.payload.event.content_url ?? ''}
              </p>
            )}
            {d.error_message && <p className="text-xs text-red-500">{d.error_message}</p>}
            {d.status === 'pending' && (
              <div className="flex items-center gap-2 pt-1">
                <Button size="sm" disabled={busyId === d.id} onClick={() => decide(d.id, 'approve')}>
                  {busyId === d.id ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Check className="h-3 w-3 mr-1" />}
                  Approve & dispatch
                </Button>
                <Button size="sm" variant="outline" disabled={busyId === d.id} onClick={() => decide(d.id, 'reject')}>
                  <X className="h-3 w-3 mr-1" /> Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PendingDispatchesPanel;
