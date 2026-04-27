import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Shield, AlertTriangle, FileSearch, Gavel, Activity } from 'lucide-react';

interface Counts {
  p1: number; p2: number; evidence_required: number; action_required: number;
  takedown_opened: number; total_open: number;
}

export default function ShieldDashboard() {
  const [c, setC] = useState<Counts>({ p1: 0, p2: 0, evidence_required: 0, action_required: 0, takedown_opened: 0, total_open: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any).from('shield_alerts').select('severity,status').limit(2000);
      if (data) {
        const open = data.filter((a: any) => !['resolved','false_positive'].includes(a.status));
        setC({
          p1: open.filter((a: any) => a.severity === 'p1_critical').length,
          p2: open.filter((a: any) => a.severity === 'p2_high').length,
          evidence_required: open.filter((a: any) => a.status === 'evidence_required').length,
          action_required: open.filter((a: any) => a.status === 'action_required').length,
          takedown_opened: open.filter((a: any) => a.status === 'takedown_opened').length,
          total_open: open.length,
        });
      }
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: 'P1 Critical (open)', value: c.p1, icon: AlertTriangle, accent: 'text-red-400' },
    { label: 'P2 High (open)', value: c.p2, icon: AlertTriangle, accent: 'text-orange-400' },
    { label: 'Evidence Required', value: c.evidence_required, icon: FileSearch, accent: 'text-amber-400' },
    { label: 'Action Required', value: c.action_required, icon: Activity, accent: 'text-orange-400' },
    { label: 'Takedowns Opened', value: c.takedown_opened, icon: Gavel, accent: 'text-blue-400' },
    { label: 'Total Open Alerts', value: c.total_open, icon: Shield, accent: 'text-primary' },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Shield className="h-7 w-7 text-primary" /> ARIA Shield
            </h1>
            <p className="text-muted-foreground mt-1">Defensive cyber reputation control plane</p>
          </div>
          <Link to="/admin/shield/alerts" className="text-sm text-primary hover:underline">View all alerts →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {cards.map(({ label, value, icon: Icon, accent }) => (
            <Card key={label} className="p-5 bg-card/50 backdrop-blur border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Icon className={`h-4 w-4 ${accent}`} />
              </div>
              <div className={`text-3xl font-bold ${accent}`}>{loading ? '…' : value}</div>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-card/50 backdrop-blur border-border">
          <h2 className="text-lg font-semibold mb-2">About ARIA Shield</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Shield converts raw threats into structured, evidenced, scored, routed and reportable cyber-reputation incidents.
            Promote any existing threat into a Shield alert to begin the defensive workflow.
            Shield never auto-submits takedowns, public warnings, or law enforcement reports — every action requires human approval.
          </p>
        </Card>
      </div>
    </div>
  );
}
