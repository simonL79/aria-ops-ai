import { useEffect, useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';

const PortalAccount = () => {
  const { user, clientIds } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (clientIds.length === 0) return;
      const { data } = await (supabase.from('client_portal_clients') as any)
        .select('id, name, tier, industry, status, onboarded_at')
        .in('id', clientIds);
      setClients(data ?? []);
    };
    load();
  }, [clientIds]);

  useEffect(() => {
    const loadPrefs = async () => {
      if (!user) return;
      setPrefsLoading(true);
      const { data } = await (supabase.from('eidetic_alert_preferences') as any)
        .select('email_enabled')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) setEmailEnabled(!!data.email_enabled);
      setPrefsLoading(false);
    };
    loadPrefs();
  }, [user]);

  const toggleEmail = async (enabled: boolean) => {
    if (!user) return;
    setEmailEnabled(enabled);
    setSaving(true);
    const { error } = await (supabase.from('eidetic_alert_preferences') as any).upsert(
      { user_id: user.id, email_enabled: enabled, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    );
    setSaving(false);
    if (error) {
      console.error(error);
      setEmailEnabled(!enabled);
      toast.error('Could not update your notification setting');
    } else {
      toast.success(enabled ? 'Email notifications enabled' : 'Email notifications disabled');
    }
  };

  return (
    <PortalLayout title="Account">
      <div className="space-y-6 max-w-2xl">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-sm uppercase tracking-widest text-white/50">Profile</h2>
            <Row label="Email" value={user?.email ?? '—'} />
            <Row label="User ID" value={user?.id ?? '—'} mono />
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-sm uppercase tracking-widest text-white/50">Notifications</h2>
            <div className="flex items-start justify-between gap-4 rounded-md border border-white/10 p-4">
              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-orange-400 mt-0.5 shrink-0" />
                <div>
                  <Label htmlFor="email-alerts" className="text-white font-medium">
                    Resurfacing event emails
                  </Label>
                  <p className="text-xs text-white/50 mt-1">
                    Receive an email whenever a new resurfacing event is detected for your account.
                  </p>
                </div>
              </div>
              <Switch
                id="email-alerts"
                checked={emailEnabled}
                disabled={prefsLoading || saving}
                onCheckedChange={toggleEmail}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-sm uppercase tracking-widest text-white/50">Linked Accounts</h2>
            {clients.length === 0 ? (
              <div className="text-sm text-white/50">No linked clients yet.</div>
            ) : (
              clients.map((c) => (
                <div key={c.id} className="border border-white/10 rounded-md p-4">
                  <div className="font-medium text-white">{c.name}</div>
                  <div className="text-xs text-white/50 mt-1 capitalize">
                    {c.tier} · {c.industry} · {c.status}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
};

const Row = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div className="flex justify-between gap-4 text-sm">
    <span className="text-white/50">{label}</span>
    <span className={`text-white text-right ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
  </div>
);

export default PortalAccount;
