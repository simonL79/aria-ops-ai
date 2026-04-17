import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Loader2, Play, AlertTriangle, RefreshCw, Sprout } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Run {
  id: string;
  started_at: string;
  completed_at: string | null;
  footprints_processed: number;
  footprints_changed: number;
  anomalies_detected: number;
  status: string;
  error_message: string | null;
}

const AutopilotPanel = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [running, setRunning] = useState(false);
  const [scoring, setScoring] = useState(false);

  const load = async () => {
    const { data } = await (supabase.from('eidetic_autopilot_runs') as any)
      .select('*')
      .order('started_at', { ascending: false })
      .limit(10);
    setRuns((data as Run[]) ?? []);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel('autopilot-runs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'eidetic_autopilot_runs' }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const runNow = async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('eidetic-autopilot', { body: {} });
      if (error) throw error;
      toast.success(`Autopilot processed ${data?.processed ?? 0} memories (${data?.anomalies ?? 0} anomalies)`);
      load();
    } catch (e) {
      console.error(e);
      toast.error('Autopilot run failed');
    } finally {
      setRunning(false);
    }
  };

  const scoreBacklog = async () => {
    setScoring(true);
    try {
      const { data, error } = await supabase.functions.invoke('eidetic-ai-score', {
        body: { all_unscored: true, limit: 25 },
      });
      if (error) throw error;
      toast.success(`AI-scored ${data?.processed ?? 0} memories`);
    } catch (e) {
      console.error(e);
      toast.error('AI scoring failed');
    } finally {
      setScoring(false);
    }
  };

  const last = runs[0];
  const next = last?.completed_at
    ? new Date(new Date(last.completed_at).getTime() + 6 * 3600 * 1000)
    : null;

  return (
    <Card className="border-orange-500/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-orange-500" />
          Autopilot — Self-Recalibrating Memory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Last Run" value={last ? formatDistanceToNow(new Date(last.started_at), { addSuffix: true }) : '—'} />
          <Stat label="Next Run" value={next ? formatDistanceToNow(next, { addSuffix: true }) : 'pending'} />
          <Stat label="Last Processed" value={last?.footprints_processed?.toString() ?? '—'} />
          <Stat
            label="Anomalies"
            value={last?.anomalies_detected?.toString() ?? '—'}
            highlight={(last?.anomalies_detected ?? 0) > 0}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={runNow} disabled={running} size="sm">
            {running ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            Run Autopilot Now
          </Button>
          <Button onClick={scoreBacklog} disabled={scoring} size="sm" variant="outline">
            {scoring ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            AI-Score Backlog
          </Button>
        </div>

        {runs.length > 0 && (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {runs.map(r => (
              <div key={r.id} className="flex items-center justify-between text-xs border border-border/40 rounded px-2 py-1.5">
                <span className="text-muted-foreground">
                  {formatDistanceToNow(new Date(r.started_at), { addSuffix: true })}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{r.footprints_processed} processed</Badge>
                  {r.anomalies_detected > 0 && (
                    <Badge variant="outline" className="text-xs text-orange-500 border-orange-500/40">
                      <AlertTriangle className="h-3 w-3 mr-0.5" />
                      {r.anomalies_detected}
                    </Badge>
                  )}
                  <Badge
                    variant={r.status === 'completed' ? 'secondary' : r.status === 'failed' ? 'destructive' : 'outline'}
                    className="text-xs"
                  >
                    {r.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Stat = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="rounded-lg border border-border/50 p-2">
    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className={`text-sm font-semibold ${highlight ? 'text-orange-500' : 'text-foreground'}`}>{value}</p>
  </div>
);

export default AutopilotPanel;
