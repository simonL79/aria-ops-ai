import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BellRing, Plus, Trash2, Play } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

type Rule = {
  id: string;
  section: string | null;
  threshold: number;
  window_minutes: number;
  cooldown_minutes: number;
  notify_email: string;
  enabled: boolean;
  last_triggered_at: string | null;
};

type AlertEvent = {
  id: string;
  section: string | null;
  error_count: number;
  threshold: number;
  window_minutes: number;
  email_sent: boolean;
  created_at: string;
};

const ALL = '__all__';

const ErrorAlertRules = ({ sections }: { sections: string[] }) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [events, setEvents] = useState<AlertEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);

  const [section, setSection] = useState<string>(ALL);
  const [threshold, setThreshold] = useState('5');
  const [windowMinutes, setWindowMinutes] = useState('60');
  const [cooldownMinutes, setCooldownMinutes] = useState('60');
  const [email, setEmail] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: r }, { data: e }] = await Promise.all([
      (supabase.from('error_alert_rules') as any).select('*').order('created_at', { ascending: false }),
      (supabase.from('error_alert_events') as any).select('*').order('created_at', { ascending: false }).limit(10),
    ]);
    setRules((r as Rule[]) ?? []);
    setEvents((e as AlertEvent[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addRule = async () => {
    if (!email.trim()) { toast.error('Enter a notification email'); return; }
    setSaving(true);
    const { error } = await (supabase.from('error_alert_rules') as any).insert({
      section: section === ALL ? null : section,
      threshold: Math.max(1, Number(threshold) || 5),
      window_minutes: Math.max(1, Number(windowMinutes) || 60),
      cooldown_minutes: Math.max(0, Number(cooldownMinutes) || 0),
      notify_email: email.trim(),
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Alert rule created');
    setEmail('');
    load();
  };

  const toggleRule = async (rule: Rule) => {
    const { error } = await (supabase.from('error_alert_rules') as any)
      .update({ enabled: !rule.enabled }).eq('id', rule.id);
    if (error) { toast.error(error.message); return; }
    load();
  };

  const removeRule = async (id: string) => {
    const { error } = await (supabase.from('error_alert_rules') as any).delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Rule deleted');
    load();
  };

  const runNow = async () => {
    setRunning(true);
    const { data, error } = await supabase.functions.invoke('error-rate-alert', { body: {} });
    setRunning(false);
    if (error) { toast.error('Evaluation failed'); return; }
    const fired = ((data as any)?.results ?? []).filter((r: any) => r.fired).length;
    toast.success(fired ? `${fired} alert(s) fired` : 'No thresholds exceeded');
    load();
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <BellRing className="h-4 w-4" /> Crash rate alerts
          </CardTitle>
          <CardDescription>
            Email an admin when a section exceeds a set number of errors within a time window. Rules are
            evaluated automatically every 15 minutes.
          </CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={runNow} disabled={running} className="gap-1.5 shrink-0">
          <Play className="h-3.5 w-3.5" /> {running ? 'Checking…' : 'Run check now'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* New rule */}
        <div className="grid gap-3 sm:grid-cols-5 items-end">
          <div className="sm:col-span-2">
            <Label className="text-xs">Section</Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All sections</SelectItem>
                {sections.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Errors (N)</Label>
            <Input type="number" min={1} value={threshold} onChange={(e) => setThreshold(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Window (min)</Label>
            <Input type="number" min={1} value={windowMinutes} onChange={(e) => setWindowMinutes(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Cooldown (min)</Label>
            <Input type="number" min={0} value={cooldownMinutes} onChange={(e) => setCooldownMinutes(e.target.value)} />
          </div>
          <div className="sm:col-span-4">
            <Label className="text-xs">Notify email</Label>
            <Input type="email" placeholder="alerts@ariaops.co.uk" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button onClick={addRule} disabled={saving} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add rule
          </Button>
        </div>

        {/* Existing rules */}
        <div className="space-y-2">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading rules…</p>
          ) : rules.length === 0 ? (
            <p className="text-sm text-muted-foreground">No alert rules yet.</p>
          ) : rules.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-3 rounded-md border p-3">
              <Switch checked={r.enabled} onCheckedChange={() => toggleRule(r)} />
              <Badge variant="secondary">{r.section ?? 'All sections'}</Badge>
              <span className="text-sm">
                &gt; {r.threshold} errors / {r.window_minutes} min
              </span>
              <span className="text-xs text-muted-foreground">→ {r.notify_email}</span>
              <span className="text-xs text-muted-foreground">
                cooldown {r.cooldown_minutes}m
                {r.last_triggered_at && ` · last fired ${formatDistanceToNow(new Date(r.last_triggered_at), { addSuffix: true })}`}
              </span>
              <Button size="icon" variant="ghost" className="ml-auto" onClick={() => removeRule(r.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        {/* Recent alerts */}
        {events.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Recent alerts</p>
            <div className="space-y-1">
              {events.map((e) => (
                <div key={e.id} className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{e.section ?? 'All sections'}</Badge>
                  <span>{e.error_count} errors / {e.window_minutes} min (threshold {e.threshold})</span>
                  <span>{e.email_sent ? '· email sent' : '· email failed'}</span>
                  <span>· {formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorAlertRules;
