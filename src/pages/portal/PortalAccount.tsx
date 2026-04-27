import { useEffect, useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const PortalAccount = () => {
  const { user, clientIds } = useAuth();
  const [clients, setClients] = useState<any[]>([]);

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
