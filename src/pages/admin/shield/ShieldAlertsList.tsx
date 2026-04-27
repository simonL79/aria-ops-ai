import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SEVERITY_COLOR, SEVERITY_LABEL, STATUS_LABEL, TYPE_LABEL, SHIELD_ALERT_STATUSES, SHIELD_SEVERITIES } from '@/lib/shield/taxonomy';
import { Shield, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ShieldAlertsList() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  useEffect(() => {
    (async () => {
      let q = (supabase as any).from('shield_alerts').select('*').order('created_at', { ascending: false }).limit(200);
      if (statusFilter !== 'all') q = q.eq('status', statusFilter);
      if (severityFilter !== 'all') q = q.eq('severity', severityFilter);
      const { data } = await q;
      setAlerts((data || []).filter((a: any) =>
        !search || a.title?.toLowerCase().includes(search.toLowerCase()) || a.entity_name?.toLowerCase().includes(search.toLowerCase())
      ));
      setLoading(false);
    })();
  }, [statusFilter, severityFilter, search]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin/shield" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Shield Dashboard
        </Link>
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Shield className="h-6 w-6 text-primary" /> Shield Alerts</h1>

        <div className="flex flex-wrap gap-3 mb-4">
          <Input placeholder="Search title / entity…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {SHIELD_ALERT_STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Severity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              {SHIELD_SEVERITIES.map(s => <SelectItem key={s} value={s}>{SEVERITY_LABEL[s]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Card className="bg-card/50 backdrop-blur border-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading…</div>
          ) : alerts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No Shield alerts yet. Promote a threat to create one.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="text-left p-3">Severity</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Title</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Score</th>
                  <th className="text-left p-3">Detected</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((a) => (
                  <tr key={a.id} className="border-t border-border hover:bg-muted/20">
                    <td className="p-3"><Badge variant="outline" className={SEVERITY_COLOR[a.severity as keyof typeof SEVERITY_COLOR]}>{SEVERITY_LABEL[a.severity as keyof typeof SEVERITY_LABEL]}</Badge></td>
                    <td className="p-3 text-muted-foreground">{TYPE_LABEL[a.alert_type as keyof typeof TYPE_LABEL]}</td>
                    <td className="p-3"><Link to={`/admin/shield/alerts/${a.id}`} className="text-foreground hover:text-primary">{a.title}</Link><div className="text-xs text-muted-foreground">{a.entity_name}</div></td>
                    <td className="p-3 text-muted-foreground">{STATUS_LABEL[a.status as keyof typeof STATUS_LABEL]}</td>
                    <td className="p-3 font-mono">{a.total_score}</td>
                    <td className="p-3 text-muted-foreground">{formatDistanceToNow(new Date(a.detected_at), { addSuffix: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}
