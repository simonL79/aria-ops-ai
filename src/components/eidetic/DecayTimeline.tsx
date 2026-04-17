import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Run {
  started_at: string;
  anomalies_detected: number;
  footprints_changed: number;
  footprints_processed: number;
}

const DecayTimeline = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      const { data: runs } = await (supabase.from('eidetic_autopilot_runs') as any)
        .select('started_at,anomalies_detected,footprints_changed,footprints_processed')
        .gte('started_at', since)
        .order('started_at', { ascending: true })
        .limit(500);

      const series = ((runs as Run[]) ?? []).map(r => ({
        time: format(new Date(r.started_at), 'MMM d HH:mm'),
        anomalies: r.anomalies_detected,
        changed: r.footprints_changed,
        processed: r.footprints_processed,
      }));
      setData(series);
    })();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><TrendingDown className="h-5 w-5" /> Decay Timeline (30d)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
              <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="processed" stroke="hsl(var(--primary))" dot={false} />
              <Line type="monotone" dataKey="changed" stroke="hsl(30 90% 55%)" dot={false} />
              <Line type="monotone" dataKey="anomalies" stroke="hsl(0 80% 55%)" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DecayTimeline;
