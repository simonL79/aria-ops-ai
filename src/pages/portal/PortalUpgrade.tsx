import { useEffect, useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Lock, Loader2, ArrowUpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

type PlanId = 'basic' | 'individual' | 'pro';

interface Plan {
  id: PlanId;
  name: string;
  priceLabel: string;
  blurb: string;
  features: { label: string; included: boolean }[];
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    priceLabel: '£29 / month',
    blurb: 'Continuous monitoring and visibility into your digital footprint.',
    features: [
      { label: 'Live OSINT monitoring', included: true },
      { label: 'Threat detection alerts', included: true },
      { label: 'Monthly intelligence reports', included: true },
      { label: 'Reputation Defence (Removal Requests)', included: false },
      { label: 'Requiem suppression pipeline', included: false },
      { label: 'Priority operator support', included: false },
    ],
  },
  {
    id: 'individual',
    name: 'Individual',
    priceLabel: '£97 / month',
    blurb: 'Everything in Basic, plus active reputation defence and removals.',
    highlight: true,
    features: [
      { label: 'Live OSINT monitoring', included: true },
      { label: 'Threat detection alerts', included: true },
      { label: 'Weekly intelligence reports', included: true },
      { label: 'Reputation Defence (Removal Requests)', included: true },
      { label: 'Requiem suppression pipeline', included: true },
      { label: 'Priority operator support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'PRO',
    priceLabel: '£397 / month',
    blurb: 'Full-spectrum protection for high-profile individuals and executives.',
    features: [
      { label: 'Live OSINT monitoring', included: true },
      { label: 'Threat detection alerts', included: true },
      { label: 'Real-time intelligence reports', included: true },
      { label: 'Reputation Defence (Removal Requests)', included: true },
      { label: 'Requiem suppression pipeline', included: true },
      { label: 'Priority operator support', included: true },
    ],
  },
];

const tierRank: Record<string, number> = { basic: 0, individual: 1, pro: 2 };

const PortalUpgrade = () => {
  const { clientIds } = useAuth();
  const [currentTier, setCurrentTier] = useState<string>('basic');
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<PlanId | null>(null);

  useEffect(() => {
    const load = async () => {
      if (clientIds.length === 0) {
        setLoading(false);
        return;
      }
      const { data } = await (supabase.from('client_portal_clients') as any)
        .select('tier')
        .in('id', clientIds)
        .limit(1)
        .maybeSingle();
      setCurrentTier((data?.tier ?? 'basic').toLowerCase());
      setLoading(false);
    };
    load();
  }, [clientIds]);

  const handleUpgrade = async (planId: PlanId) => {
    setCheckoutLoading(planId);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (e: any) {
      console.error('Upgrade checkout failed:', e);
      toast.error('Could not start checkout', { description: e?.message ?? 'Please try again.' });
    } finally {
      setCheckoutLoading(null);
    }
  };

  const currentRank = tierRank[currentTier] ?? 0;

  return (
    <PortalLayout title="Upgrade Plan">
      <div className="space-y-6 max-w-6xl">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-white/50">Current plan</div>
              <div className="text-2xl font-semibold text-white capitalize mt-1">
                {loading ? '…' : currentTier}
              </div>
            </div>
            <Badge variant="outline" className="border-orange-500/40 text-orange-400 bg-orange-500/10">
              <ArrowUpCircle className="h-3.5 w-3.5 mr-1.5" />
              Upgrade to unlock more
            </Badge>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === currentTier;
            const isLower = tierRank[plan.id] < currentRank;
            const isUpgrade = tierRank[plan.id] > currentRank;
            return (
              <Card
                key={plan.id}
                className={`bg-white/5 border-white/10 flex flex-col ${
                  plan.highlight ? 'border-orange-500/40 ring-1 ring-orange-500/20' : ''
                }`}
              >
                <CardContent className="p-6 flex flex-col flex-1 space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                      {plan.highlight && (
                        <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/40 hover:bg-orange-500/20">
                          Most popular
                        </Badge>
                      )}
                    </div>
                    <div className="text-2xl font-semibold text-white mt-2">{plan.priceLabel}</div>
                    <p className="text-sm text-white/60 mt-2">{plan.blurb}</p>
                  </div>

                  <ul className="space-y-2 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f.label}
                        className={`flex items-start gap-2 text-sm ${
                          f.included ? 'text-white/85' : 'text-white/35 line-through'
                        }`}
                      >
                        {f.included ? (
                          <Check className="h-4 w-4 text-orange-400 mt-0.5 shrink-0" />
                        ) : (
                          <Lock className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />
                        )}
                        <span>{f.label}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    {isCurrent ? (
                      <Button disabled variant="outline" className="w-full border-white/15 text-white/60">
                        Current plan
                      </Button>
                    ) : isLower ? (
                      <Button disabled variant="outline" className="w-full border-white/10 text-white/40">
                        Lower tier
                      </Button>
                    ) : (
                      <Button
                        disabled={!isUpgrade || checkoutLoading !== null}
                        onClick={() => handleUpgrade(plan.id)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-black font-medium"
                      >
                        {checkoutLoading === plan.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Starting checkout…
                          </>
                        ) : (
                          <>Upgrade to {plan.name}</>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-xs text-white/40 max-w-2xl">
          Payments are processed securely via Stripe. Your portal access updates after our team confirms
          the new subscription — usually within minutes. Need a custom Enterprise arrangement? Contact your
          account manager.
        </p>
      </div>
    </PortalLayout>
  );
};

export default PortalUpgrade;
