import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, ArrowDown, ArrowUp, Bell, Check, ExternalLink, ShieldAlert } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Event {
  id: string;
  footprint_id: string | null;
  event_type: 'decay_reversal' | 'threat_spike' | 'new_high_threat' | 'content_drift';
  severity: 'low' | 'medium' | 'high' | 'critical';
  prev_decay_score: number | null;
  new_decay_score: number | null;
  decay_delta: number | null;
  prev_threat_30d: number | null;
  new_threat_30d: number | null;
  threat_delta: number | null;
  narrative_category: string | null;
  content_excerpt: string | null;
  content_url: string | null;
  acknowledged: boolean;
  acknowledged_at: string | null;
  notified_at: string | null;
  created_at: string;
}

const sevColor: Record<string, string> = {
  critical: 'border-red-500/40 bg-red-500/10 text-red-500',
  high: 'border-orange-500/40 bg-orange-500/10 text-orange-500',
  medium: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-500',
  low: 'border-blue-500/40 bg-blue-500/10 text-blue-500',
};

const ResurfacingAlertsPanel = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [tab, setTab] = useState<'active' | 'acknowledged' | 'all'>('active');

  const load = async () => {
    const { data } = await (supabase.from('eidetic_resurfacing_events') as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    setEvents((data as Event[]) ?? []);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel('resurfacing-events')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'eidetic_resurfacing_events' }, (payload: any) => {
        const ev = payload.new as Event;
        if (ev.severity === 'critical' || ev.severity === 'high') {
          toast.warning(`EIDETIC alert: ${ev.event_type.replace('_', ' ')}`, {
            description: ev.content_excerpt?.slice(0, 120) ?? ev.content_url ?? '',
          });
        }
        load();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'eidetic_resurfacing_events' }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const acknowledge = async (id: string) => {
    const { data: u } = await supabase.auth.getUser();
    const { error } = await (supabase.from('eidetic_resurfacing_events') as any)
      .update({ acknowledged: true, acknowledged_at: new Date().toISOString(), acknowledged_by: u?.user?.id ?? null })
      .eq('id', id);
    if (error) toast.error('Failed to acknowledge');
    else toast.success('Acknowledged');
  };

  const filtered = events.filter(e =>
    tab === 'active' ? !e.acknowledged :
    tab === 'acknowledged' ? e.acknowledged :
    true
  );

  const unackCount = events.filter(e => !e.acknowledged).length;
  const criticalUnack = events.filter(e => !e.acknowledged && (e.severity === 'critical' || e.severity === 'high')).length;

  return (
    <Card className="border-red-500/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            Resurfacing Alerts
          </span>
          {unackCount > 0 && (
            <Badge className="bg-red-500/20 text-red-500 border-red-500/40 hover:bg-red-500/30">
              <Bell className="h-3 w-3 mr-1" />
              {unackCount} unacknowledged{criticalUnack > 0 ? ` · ${criticalUnack} critical/high` : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="acknowledged">Acknowledged</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-4 space-y-2 max-h-[480px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {tab === 'active' ? 'All clear — no active resurfacing events' : 'Nothing here yet'}
              </div>
            ) : (
              filtered.map(ev => (
                <div key={ev.id} className="border border-border/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={`text-[10px] uppercase tracking-wide ${sevColor[ev.severity]}`}>
                        {ev.severity}
                      </Badge>
                      <span className="text-sm font-medium capitalize">{ev.event_type.replace(/_/g, ' ')}</span>
                      {ev.narrative_category && (
                        <Badge variant="outline" className="text-[10px]">{ev.narrative_category}</Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(ev.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs">
                    {ev.prev_decay_score !== null && ev.new_decay_score !== null && (
                      <Delta label="Decay" prev={ev.prev_decay_score} next={ev.new_decay_score} invert />
                    )}
                    {ev.prev_threat_30d !== null && ev.new_threat_30d !== null && (
                      <Delta label="Threat 30d" prev={ev.prev_threat_30d} next={ev.new_threat_30d} />
                    )}
                    {ev.new_threat_30d !== null && ev.prev_threat_30d === null && (
                      <span className="text-muted-foreground">Threat 30d: <b className="text-foreground">{(ev.new_threat_30d * 100).toFixed(0)}%</b></span>
                    )}
                  </div>

                  {ev.content_excerpt && (
                    <p className="text-xs text-muted-foreground line-clamp-2 border-l-2 border-border/50 pl-2">
                      {ev.content_excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1">
                    {ev.content_url ? (
                      <a href={ev.content_url} target="_blank" rel="noopener noreferrer"
                         className="text-xs text-primary hover:underline flex items-center gap-1 truncate max-w-[60%]">
                        <ExternalLink className="h-3 w-3" />
                        <span className="truncate">{ev.content_url}</span>
                      </a>
                    ) : <span />}
                    {!ev.acknowledged ? (
                      <Button size="sm" variant="outline" onClick={() => acknowledge(ev.id)}>
                        <Check className="h-3 w-3 mr-1" /> Acknowledge
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/40">
                        <Check className="h-3 w-3 mr-1" /> Acknowledged
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const Delta = ({ label, prev, next, invert }: { label: string; prev: number; next: number; invert?: boolean }) => {
  const up = next > prev;
  // For decay, "up" (more decay) is good; "down" is bad. invert=true reverses arrow color.
  const bad = invert ? !up : up;
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <span className="text-muted-foreground flex items-center gap-1">
      {label}: <b className="text-foreground">{(prev * 100).toFixed(0)}%</b>
      <Icon className={`h-3 w-3 ${bad ? 'text-red-500' : 'text-green-500'}`} />
      <b className="text-foreground">{(next * 100).toFixed(0)}%</b>
    </span>
  );
};

export default ResurfacingAlertsPanel;
