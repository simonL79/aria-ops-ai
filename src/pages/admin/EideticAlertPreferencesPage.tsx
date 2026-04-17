import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, BellOff, Clock, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

type Prefs = {
  email_enabled: boolean;
  email_min_severity: 'low' | 'medium' | 'high' | 'critical';
  event_type_filter: string[] | null;
  narrative_category_filter: string[] | null;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  quiet_hours_timezone: string;
  digest_frequency: 'off' | 'daily' | 'weekly';
  digest_send_time: string;
  mute_until: string | null;
};

const DEFAULTS: Prefs = {
  email_enabled: true,
  email_min_severity: 'high',
  event_type_filter: null,
  narrative_category_filter: null,
  quiet_hours_start: null,
  quiet_hours_end: null,
  quiet_hours_timezone: 'Europe/London',
  digest_frequency: 'daily',
  digest_send_time: '08:00',
  mute_until: null,
};

const TIMEZONES = ['Europe/London', 'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Singapore', 'UTC'];

const EideticAlertPreferencesPage = () => {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await (supabase.from('eidetic_alert_preferences') as any)
        .select('*').eq('user_id', user.id).maybeSingle();
      if (data) setPrefs({ ...DEFAULTS, ...data });
      setLoading(false);
    })();
  }, []);

  const save = async (overrides?: Partial<Prefs>) => {
    setSaving(true);
    try {
      const payload = { ...prefs, ...overrides };
      const { data, error } = await supabase.functions.invoke('eidetic-update-preferences', { body: payload });
      if (error) throw error;
      setPrefs({ ...DEFAULTS, ...(data as any).preferences });
      toast.success('Preferences saved');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const muteFor = (hours: number | null) => {
    const until = hours === null ? null : new Date(Date.now() + hours * 3600_000).toISOString();
    save({ mute_until: until });
  };

  const muteActive = prefs.mute_until && new Date(prefs.mute_until) > new Date();

  if (loading) return <div className="p-8 text-muted-foreground">Loading preferences…</div>;

  return (
    <div className="container max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to admin
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2 mt-2">
            <Bell className="h-6 w-6 text-purple-600" /> EIDETIC Alert Preferences
          </h1>
          <p className="text-muted-foreground text-sm">Control which resurfacing events email you, and when.</p>
        </div>
      </div>

      {/* Mute */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BellOff className="h-4 w-4" /> Quick mute
          </CardTitle>
          <CardDescription>
            {muteActive
              ? `Muted until ${new Date(prefs.mute_until!).toLocaleString()}`
              : 'Pause all email alerts for a period'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => muteFor(1)} disabled={saving}>1 hour</Button>
          <Button size="sm" variant="outline" onClick={() => muteFor(4)} disabled={saving}>4 hours</Button>
          <Button size="sm" variant="outline" onClick={() => muteFor(24)} disabled={saving}>1 day</Button>
          <Button size="sm" variant="outline" onClick={() => muteFor(24 * 7)} disabled={saving}>1 week</Button>
          {muteActive && (
            <Button size="sm" variant="destructive" onClick={() => muteFor(null)} disabled={saving}>Unmute</Button>
          )}
        </CardContent>
      </Card>

      {/* Email alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="h-4 w-4" /> Email alerts
          </CardTitle>
          <CardDescription>Per-event alerts when memories resurface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email_enabled">Email me about resurfacing events</Label>
            <Switch
              id="email_enabled"
              checked={prefs.email_enabled}
              onCheckedChange={(v) => setPrefs(p => ({ ...p, email_enabled: v }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Minimum severity</Label>
            <Select
              value={prefs.email_min_severity}
              onValueChange={(v: any) => setPrefs(p => ({ ...p, email_min_severity: v }))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low and above</SelectItem>
                <SelectItem value="medium">Medium and above</SelectItem>
                <SelectItem value="high">High and above (recommended)</SelectItem>
                <SelectItem value="critical">Critical only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quiet hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" /> Quiet hours
          </CardTitle>
          <CardDescription>Suppress emails during these hours (events still appear in dashboard)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start</Label>
              <Input type="time" value={prefs.quiet_hours_start ?? ''}
                onChange={(e) => setPrefs(p => ({ ...p, quiet_hours_start: e.target.value || null }))} />
            </div>
            <div>
              <Label>End</Label>
              <Input type="time" value={prefs.quiet_hours_end ?? ''}
                onChange={(e) => setPrefs(p => ({ ...p, quiet_hours_end: e.target.value || null }))} />
            </div>
          </div>
          <div>
            <Label>Timezone</Label>
            <Select
              value={prefs.quiet_hours_timezone}
              onValueChange={(v) => setPrefs(p => ({ ...p, quiet_hours_timezone: v }))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TIMEZONES.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Digest */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Digest emails</CardTitle>
          <CardDescription>Summary of EIDETIC activity, sent on a schedule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Frequency</Label>
            <Select
              value={prefs.digest_frequency}
              onValueChange={(v: any) => setPrefs(p => ({ ...p, digest_frequency: v }))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Off</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Send time (in your timezone)</Label>
            <Input type="time" value={prefs.digest_send_time}
              onChange={(e) => setPrefs(p => ({ ...p, digest_send_time: e.target.value || '08:00' }))} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => save()} disabled={saving}>
          {saving ? 'Saving…' : 'Save preferences'}
        </Button>
      </div>
    </div>
  );
};

export default EideticAlertPreferencesPage;
