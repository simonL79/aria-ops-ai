import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertTriangle, ArrowDown, ArrowUp, Bell, Check, ExternalLink, History,
  Pause, Play, ShieldAlert, X,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Event {
  id: string;
  footprint_id: string | null;
  event_type: string;
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
  status: 'active' | 'snoozed' | 'resolved';
  snoozed_until: string | null;
  resolved_at: string | null;
  resolution_notes: string | null;
  created_at: string;
}

interface AlertAction {
  id: string;
  action_type: string;
  prior_status: string | null;
  new_status: string | null;
  notes: string | null;
  created_at: string;
}

const sevColor: Record<string, string> = {
  critical: 'border-red-500/40 bg-red-500/10 text-red-500',
  high: 'border-orange-500/40 bg-orange-500/10 text-orange-500',
  medium: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-500',
  low: 'border-blue-500/40 bg-blue-500/10 text-blue-500',
};

type TabKey = 'active' | 'snoozed' | 'resolved' | 'all';

const ResurfacingAlertsPanel = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [tab, setTab] = useState<TabKey>('active');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [snoozeOpen, setSnoozeOpen] = useState(false);
  const [resolveNotes, setResolveNotes] = useState('');
  const [snoozeMinutes, setSnoozeMinutes] = useState('60');
  const [auditFor, setAuditFor] = useState<Event | null>(null);
  const [auditTrail, setAuditTrail] = useState<AlertAction[]>([]);

  const load = async () => {
    const { data } = await (supabase.from('eidetic_resurfacing_events') as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    setEvents((data as Event[]) ?? []);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel('resurfacing-events')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'eidetic_resurfacing_events' }, (payload: any) => {
        const ev = payload.new as Event;
        if (ev.severity === 'critical' || ev.severity === 'high') {
          toast.warning(`EIDETIC alert: ${ev.event_type.replace(/_/g, ' ')}`, {
            description: ev.content_excerpt?.slice(0, 120) ?? ev.content_url ?? '',
          });
        }
        load();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'eidetic_resurfacing_events' }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = events.filter(e =>
    tab === 'active' ? e.status === 'active' :
    tab === 'snoozed' ? e.status === 'snoozed' :
    tab === 'resolved' ? e.status === 'resolved' :
    true
  );

  const allSelected = filtered.length > 0 && filtered.every(e => selected.has(e.id));
  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(filtered.map(e => e.id)));
  };
  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const callAction = async (action: string, extra: Record<string, unknown> = {}) => {
    if (selected.size === 0) { toast.error('No alerts selected'); return; }
    setBusy(true);
    try {
      const { error } = await supabase.functions.invoke('eidetic-triage-action', {
        body: { alert_ids: Array.from(selected), action, ...extra },
      });
      if (error) throw error;
      toast.success(`${action} applied to ${selected.size}`);
      setSelected(new Set());
      setResolveOpen(false); setSnoozeOpen(false);
      setResolveNotes(''); setSnoozeMinutes('60');
      load();
    } catch (e: any) {
      toast.error(e?.message ?? 'Action failed');
    } finally { setBusy(false); }
  };

  const openAudit = async (ev: Event) => {
    setAuditFor(ev);
    const { data } = await (supabase.from('eidetic_alert_actions') as any)
      .select('*').eq('alert_id', ev.id).order('created_at', { ascending: false });
    setAuditTrail((data as AlertAction[]) ?? []);
  };

  const unackCount = events.filter(e => !e.acknowledged && e.status === 'active').length;
  const criticalUnack = events.filter(e => !e.acknowledged && e.status === 'active' && (e.severity === 'critical' || e.severity === 'high')).length;

  return (
    <Card className="border-red-500/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 flex-wrap">
          <span className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            Resurfacing Alerts
          </span>
          {unackCount > 0 && (
            <Badge className="bg-red-500/20 text-red-500 border-red-500/40 hover:bg-red-500/30">
              <Bell className="h-3 w-3 mr-1" />
              {unackCount} active{criticalUnack > 0 ? ` · ${criticalUnack} critical/high` : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={(v) => { setTab(v as TabKey); setSelected(new Set()); }}>
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="snoozed">Snoozed</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-4 space-y-2">
            {filtered.length > 0 && (
              <div className="flex items-center justify-between gap-2 flex-wrap p-2 rounded-md border border-border/50 bg-muted/30">
                <div className="flex items-center gap-2">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                  <span className="text-xs text-muted-foreground">
                    {selected.size > 0 ? `${selected.size} selected` : `Select all (${filtered.length})`}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  <Button size="sm" variant="outline" disabled={busy || selected.size === 0}
                          onClick={() => callAction('acknowledge')}>
                    <Check className="h-3 w-3 mr-1" /> Ack
                  </Button>
                  <Dialog open={snoozeOpen} onOpenChange={setSnoozeOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" disabled={busy || selected.size === 0}>
                        <Pause className="h-3 w-3 mr-1" /> Snooze
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Snooze {selected.size} alert(s)</DialogTitle>
                        <DialogDescription>They will return to Active when the timer expires.</DialogDescription>
                      </DialogHeader>
                      <Select value={snoozeMinutes} onValueChange={setSnoozeMinutes}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                          <SelectItem value="1440">1 day</SelectItem>
                          <SelectItem value="4320">3 days</SelectItem>
                          <SelectItem value="10080">1 week</SelectItem>
                        </SelectContent>
                      </Select>
                      <DialogFooter>
                        <Button onClick={() => callAction('snooze', { snooze_minutes: parseInt(snoozeMinutes) })} disabled={busy}>
                          Confirm snooze
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {tab === 'snoozed' && (
                    <Button size="sm" variant="outline" disabled={busy || selected.size === 0}
                            onClick={() => callAction('unsnooze')}>
                      <Play className="h-3 w-3 mr-1" /> Unsnooze
                    </Button>
                  )}
                  <Dialog open={resolveOpen} onOpenChange={setResolveOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" disabled={busy || selected.size === 0}>
                        <Check className="h-3 w-3 mr-1" /> Resolve
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Resolve {selected.size} alert(s)</DialogTitle>
                        <DialogDescription>Add a note describing the resolution.</DialogDescription>
                      </DialogHeader>
                      <Textarea value={resolveNotes} onChange={(e) => setResolveNotes(e.target.value)}
                                placeholder="What was done?" rows={4} />
                      <DialogFooter>
                        <Button onClick={() => callAction('resolve', { notes: resolveNotes })} disabled={busy}>
                          Confirm resolve
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {tab === 'resolved' && (
                    <Button size="sm" variant="outline" disabled={busy || selected.size === 0}
                            onClick={() => callAction('reopen')}>
                      <X className="h-3 w-3 mr-1" /> Reopen
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-[480px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  {tab === 'active' ? 'All clear — no active resurfacing events' : 'Nothing here'}
                </div>
              ) : (
                filtered.map(ev => (
                  <div key={ev.id} className="border border-border/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <Checkbox className="mt-1" checked={selected.has(ev.id)} onCheckedChange={() => toggle(ev.id)} />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={`text-[10px] uppercase tracking-wide ${sevColor[ev.severity]}`}>
                              {ev.severity}
                            </Badge>
                            <span className="text-sm font-medium capitalize">{ev.event_type.replace(/_/g, ' ')}</span>
                            {ev.narrative_category && (
                              <Badge variant="outline" className="text-[10px]">{ev.narrative_category}</Badge>
                            )}
                            {ev.status !== 'active' && (
                              <Badge variant="outline" className="text-[10px] capitalize">{ev.status}</Badge>
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

                        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                          {ev.content_url ? (
                            <a href={ev.content_url} target="_blank" rel="noopener noreferrer"
                               className="text-xs text-primary hover:underline flex items-center gap-1 truncate max-w-[60%]">
                              <ExternalLink className="h-3 w-3" />
                              <span className="truncate">{ev.content_url}</span>
                            </a>
                          ) : <span />}
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button size="sm" variant="ghost" onClick={() => openAudit(ev)}>
                                <History className="h-3 w-3 mr-1" /> History
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Alert audit trail</SheetTitle>
                                <SheetDescription className="capitalize">
                                  {auditFor?.event_type.replace(/_/g, ' ')} · {auditFor?.severity}
                                </SheetDescription>
                              </SheetHeader>
                              <div className="mt-4 space-y-2">
                                {auditTrail.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">No actions yet.</p>
                                ) : auditTrail.map(a => (
                                  <div key={a.id} className="border border-border/50 rounded-md p-2 text-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium capitalize">{a.action_type.replace(/_/g, ' ')}</span>
                                      <span className="text-muted-foreground">
                                        {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                                      </span>
                                    </div>
                                    {(a.prior_status || a.new_status) && (
                                      <div className="text-muted-foreground mt-1">
                                        {a.prior_status ?? '–'} → {a.new_status ?? '–'}
                                      </div>
                                    )}
                                    {a.notes && <p className="mt-1 italic">{a.notes}</p>}
                                  </div>
                                ))}
                              </div>
                            </SheetContent>
                          </Sheet>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const Delta = ({ label, prev, next, invert }: { label: string; prev: number; next: number; invert?: boolean }) => {
  const up = next > prev;
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
