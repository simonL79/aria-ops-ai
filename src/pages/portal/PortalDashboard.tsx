import { useEffect, useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ShieldAlert, FileText, Sparkles, Activity } from 'lucide-react';

interface Stats {
  openThreats: number;
  newFindings: number;
  totalReports: number;
  sentimentLabel: string;
  entityNames: string[];
  tier: string;
}

const PortalDashboard = () => {
  const { clientIds } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (clientIds.length === 0) return;
      try {
        const { data: clients } = await (supabase.from('client_portal_clients') as any)
          .select('name, tier')
          .in('id', clientIds);

        const entityNames: string[] = (clients ?? []).map((c: any) => c.name).filter(Boolean);
        const tier = (clients ?? [])[0]?.tier ?? 'individual';

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

        const [threatsRes, reportsRes, findingsRes, sentimentRes] = await Promise.all([
          (supabase.from('threats') as any).select('id', { count: 'exact', head: true }).eq('status', 'active'),
          (supabase.from('executive_reports') as any).select('id', { count: 'exact', head: true }).in('client_id', clientIds),
          (supabase.from('scan_results') as any).select('id', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
          (supabase.from('scan_results') as any).select('sentiment').not('sentiment', 'is', null).limit(200),
        ]);

        const sentiments: string[] = (sentimentRes.data ?? []).map((r: any) => r.sentiment);
        const positive = sentiments.filter((s) => /positive/i.test(s)).length;
        const negative = sentiments.filter((s) => /negative/i.test(s)).length;
        const sentimentLabel =
          sentiments.length === 0
            ? 'No data yet'
            : positive > negative
              ? 'Mostly Positive'
              : negative > positive
                ? 'Mostly Negative'
                : 'Neutral';

        setStats({
          openThreats: threatsRes.count ?? 0,
          newFindings: findingsRes.count ?? 0,
          totalReports: reportsRes.count ?? 0,
          sentimentLabel,
          entityNames,
          tier,
        });
      } catch (e) {
        console.error('Portal dashboard load failed:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [clientIds]);

  return (
    <PortalLayout title="Overview">
      {loading ? (
        <div className="text-white/50">Loading…</div>
      ) : !stats ? (
        <div className="text-white/50">No data available yet.</div>
      ) : (
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="text-xs text-white/50 uppercase tracking-widest mb-1">Monitoring</div>
              <div className="text-2xl font-semibold text-white">
                {stats.entityNames.join(', ') || 'No entities linked'}
              </div>
              <div className="text-sm text-orange-400 mt-1 capitalize">{stats.tier} tier</div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard icon={ShieldAlert} label="Active threats" value={stats.openThreats} />
            <StatCard icon={Sparkles} label="New findings (7d)" value={stats.newFindings} />
            <StatCard icon={FileText} label="Reports available" value={stats.totalReports} />
            <StatCard icon={Activity} label="Sentiment" value={stats.sentimentLabel} />
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: number | string }) => (
  <Card className="bg-white/5 border-white/10">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-normal text-white/60">{label}</CardTitle>
      <Icon className="h-4 w-4 text-orange-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-semibold text-white">{value}</div>
    </CardContent>
  </Card>
);

export default PortalDashboard;
