import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Webhook, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Hook {
  id: string;
  name: string;
  description: string | null;
  enabled: boolean;
  trigger_event_types: string[];
  trigger_min_severity: string;
  trigger_narrative_categories: string[];
  action_type: 'requiem' | 'legal_erasure' | 'counter_narrative';
  action_config: Record<string, unknown>;
  requires_approval: boolean;
}

const EVENT_TYPES = ['decay_reversal', 'threat_spike', 'new_high_threat', 'content_drift'];

const ResponseHooksPanel = () => {
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Hook>>({
    name: '', enabled: true, trigger_min_severity: 'high',
    trigger_event_types: ['threat_spike', 'new_high_threat'],
    trigger_narrative_categories: [],
    action_type: 'counter_narrative', requires_approval: true,
    action_config: {},
  });

  const load = async () => {
    const { data } = await (supabase.from('eidetic_response_hooks') as any)
      .select('*').order('created_at', { ascending: false });
    setHooks((data as Hook[]) ?? []);
  };

  useEffect(() => { load(); }, []);

  const toggleEnabled = async (h: Hook) => {
    const { error } = await (supabase.from('eidetic_response_hooks') as any)
      .update({ enabled: !h.enabled }).eq('id', h.id);
    if (error) toast.error('Failed'); else load();
  };

  const remove = async (id: string) => {
    const { error } = await (supabase.from('eidetic_response_hooks') as any).delete().eq('id', id);
    if (error) toast.error('Failed'); else { toast.success('Hook removed'); load(); }
  };

  const create = async () => {
    if (!draft.name) { toast.error('Name required'); return; }
    const { error } = await (supabase.from('eidetic_response_hooks') as any).insert({
      name: draft.name,
      description: draft.description ?? null,
      enabled: draft.enabled ?? true,
      trigger_event_types: draft.trigger_event_types ?? [],
      trigger_min_severity: draft.trigger_min_severity ?? 'high',
      trigger_narrative_categories: draft.trigger_narrative_categories ?? [],
      action_type: draft.action_type,
      action_config: draft.action_config ?? {},
      requires_approval: draft.requires_approval ?? true,
    });
    if (error) toast.error(error.message);
    else { toast.success('Hook created'); setOpen(false); load(); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2"><Webhook className="h-5 w-5" /> Auto-Response Hooks</span>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-3 w-3 mr-1" /> New hook</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Create response hook</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Name</Label>
                  <Input value={draft.name ?? ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={draft.description ?? ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={2} />
                </div>
                <div>
                  <Label>Min severity</Label>
                  <Select value={draft.trigger_min_severity} onValueChange={(v) => setDraft({ ...draft, trigger_min_severity: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Event types (comma sep)</Label>
                  <Input value={(draft.trigger_event_types ?? []).join(',')}
                         onChange={(e) => setDraft({ ...draft, trigger_event_types: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                         placeholder={EVENT_TYPES.join(',')} />
                </div>
                <div>
                  <Label>Action</Label>
                  <Select value={draft.action_type} onValueChange={(v) => setDraft({ ...draft, action_type: v as Hook['action_type'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="counter_narrative">Counter Narrative (draft)</SelectItem>
                      <SelectItem value="requiem">Requiem Campaign (queue)</SelectItem>
                      <SelectItem value="legal_erasure">Legal Erasure Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="approval">Requires manual approval</Label>
                  <Switch id="approval" checked={draft.requires_approval ?? true}
                          onCheckedChange={(v) => setDraft({ ...draft, requires_approval: v })} />
                </div>
              </div>
              <DialogFooter><Button onClick={create}>Create</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {hooks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No hooks configured</p>
        ) : hooks.map(h => (
          <div key={h.id} className="border border-border/50 rounded-lg p-3 flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">{h.name}</span>
                <Badge variant="outline" className="text-[10px]"><Zap className="h-3 w-3 mr-1" />{h.action_type}</Badge>
                <Badge variant="outline" className="text-[10px] uppercase">{h.trigger_min_severity}+</Badge>
                {h.requires_approval && <Badge variant="outline" className="text-[10px]">manual</Badge>}
              </div>
              {h.description && <p className="text-xs text-muted-foreground">{h.description}</p>}
              <p className="text-[11px] text-muted-foreground">
                Triggers: {h.trigger_event_types.join(', ') || 'any'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={h.enabled} onCheckedChange={() => toggleEnabled(h)} />
              <Button size="sm" variant="ghost" onClick={() => remove(h.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ResponseHooksPanel;
