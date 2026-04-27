import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '@/components/portal/PortalLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Send,
  ShieldAlert,
  Sparkles,
  XCircle,
} from 'lucide-react';
import UpgradeRequiredCard from '@/components/portal/UpgradeRequiredCard';

type Step = 1 | 2 | 3 | 4;

interface RemovalItem {
  id: string;
  url: string | null;
  excerpt: string | null;
  category: string | null;
  severity: number;
  ai_rationale: string | null;
  user_confirmed: boolean;
  user_dismissed: boolean;
}

const stepMeta: { key: Step; label: string }[] = [
  { key: 1, label: 'Submit' },
  { key: 2, label: 'Review' },
  { key: 3, label: 'Confirm' },
  { key: 4, label: 'Done' },
];

const sevColor = (s: number) =>
  s >= 8 ? 'bg-red-500/20 text-red-300 border-red-500/40'
  : s >= 5 ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
  : 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';

const PortalRemoval = () => {
  const { clientIds, user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [dispatching, setDispatching] = useState(false);

  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [notes, setNotes] = useState('');

  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [items, setItems] = useState<RemovalItem[]>([]);
  const [requiemRunId, setRequiemRunId] = useState<string | null>(null);

  const [tier, setTier] = useState<string | null>(null);
  const [tierLoading, setTierLoading] = useState(true);

  const clientId = clientIds[0];

  useEffect(() => {
    const loadTier = async () => {
      if (clientIds.length === 0) {
        setTierLoading(false);
        return;
      }
      const { data } = await (supabase.from('client_portal_clients') as any)
        .select('tier')
        .in('id', clientIds)
        .limit(1)
        .maybeSingle();
      setTier((data?.tier ?? 'basic').toLowerCase());
      setTierLoading(false);
    };
    loadTier();
  }, [clientIds]);


  // Load items when entering review/confirm steps
  useEffect(() => {
    if (!submissionId || step < 2 || step > 3) return;
    const load = async () => {
      const { data } = await (supabase.from('portal_removal_items') as any)
        .select('*')
        .eq('submission_id', submissionId)
        .order('severity', { ascending: false });
      setItems((data ?? []) as RemovalItem[]);
    };
    load();
  }, [submissionId, step]);

  const handleSubmit = async () => {
    if (!user || !clientId) {
      toast.error('No client account linked.');
      return;
    }
    if (!sourceUrl.trim() && !sourceText.trim()) {
      toast.error('Provide a URL or paste content.');
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await (supabase.from('portal_removal_submissions') as any)
        .insert({
          user_id: user.id,
          client_id: clientId,
          status: 'draft',
          source_url: sourceUrl.trim() || null,
          source_text: sourceText.trim() || null,
          notes: notes.trim() || null,
        })
        .select('id')
        .single();
      if (error) throw error;
      setSubmissionId(data.id);

      setScanning(true);
      const { error: scanErr } = await supabase.functions.invoke('portal-removal-scan', {
        body: { submission_id: data.id },
      });
      if (scanErr) throw scanErr;
      setScanning(false);
      setStep(2);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? 'Submission failed');
      setScanning(false);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleConfirm = async (item: RemovalItem, confirmed: boolean) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, user_confirmed: confirmed, user_dismissed: false } : i))
    );
    await (supabase.from('portal_removal_items') as any)
      .update({ user_confirmed: confirmed, user_dismissed: false })
      .eq('id', item.id);
  };

  const toggleDismiss = async (item: RemovalItem) => {
    const next = !item.user_dismissed;
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, user_dismissed: next, user_confirmed: next ? false : i.user_confirmed } : i
      )
    );
    await (supabase.from('portal_removal_items') as any)
      .update({ user_dismissed: next, user_confirmed: next ? false : item.user_confirmed })
      .eq('id', item.id);
  };

  const confirmedCount = items.filter((i) => i.user_confirmed && !i.user_dismissed).length;

  const handleDispatch = async () => {
    if (!submissionId || confirmedCount === 0) {
      toast.error('Confirm at least one item first.');
      return;
    }
    setDispatching(true);
    try {
      const { data, error } = await supabase.functions.invoke('portal-removal-dispatch', {
        body: { submission_id: submissionId },
      });
      if (error) throw error;
      setRequiemRunId((data as any)?.requiem_run_id ?? null);
      setStep(4);
      toast.success('Dispatched to Requiem pipeline.');
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? 'Dispatch failed');
    } finally {
      setDispatching(false);
    }
  };

  if (!tierLoading && tier === 'basic') {
    return (
      <PortalLayout title="Removal Request">
        <UpgradeRequiredCard
          feature="Removal Requests"
          description="Your current Basic plan includes monitoring and alerts. To submit content for AI-flagged review and trigger the Requiem suppression pipeline, upgrade to the Individual or PRO plan."
        />
      </PortalLayout>
    );
  }

  return (
    <PortalLayout title="Removal Request">
      <Stepper current={step} />

      <div className="mt-8 max-w-3xl">
        {step === 1 && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 space-y-5">
              <div>
                <div className="text-xs uppercase tracking-widest text-white/50 mb-2">
                  Step 1 — Submit content
                </div>
                <p className="text-sm text-white/70">
                  Share a URL or paste the content you want our analysts to assess. Our AI will scan
                  for defamatory, harassing, privacy-violating, or misleading material.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/80">URL</label>
                <Input
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="bg-black/40 border-white/15 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/80">Or paste content</label>
                <Textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Paste the post, article, or comment text…"
                  rows={5}
                  className="bg-black/40 border-white/15 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/80">Notes (optional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Context that will help our analysts (e.g. why this is harmful)…"
                  rows={3}
                  className="bg-black/40 border-white/15 text-white"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || scanning}
                  className="bg-orange-500 hover:bg-orange-600 text-black"
                >
                  {submitting || scanning ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{scanning ? 'Scanning…' : 'Submitting…'}</>
                  ) : (
                    <><Sparkles className="h-4 w-4 mr-2" />Submit & scan<ArrowRight className="h-4 w-4 ml-2" /></>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-widest text-white/50">
              Step 2 — Review flagged content
            </div>
            {items.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-8 text-center text-white/60">
                  Our scan didn't flag anything actionable. You can still proceed and confirm
                  removals manually, or go back and submit different content.
                </CardContent>
              </Card>
            ) : (
              items.map((item) => (
                <Card key={item.id} className={`bg-white/5 border-white/10 ${item.user_dismissed ? 'opacity-50' : ''}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={`${sevColor(item.severity)} border`}>
                          <ShieldAlert className="h-3 w-3 mr-1" />Severity {item.severity}
                        </Badge>
                        {item.category && (
                          <Badge variant="outline" className="border-white/20 text-white/70 capitalize">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDismiss(item)}
                        className="text-white/50 hover:text-white"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        {item.user_dismissed ? 'Restore' : 'Dismiss'}
                      </Button>
                    </div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-orange-400 hover:underline break-all block mb-2"
                      >
                        {item.url}
                      </a>
                    )}
                    {item.excerpt && (
                      <p className="text-sm text-white/80 mb-2 italic">"{item.excerpt}"</p>
                    )}
                    {item.ai_rationale && (
                      <p className="text-xs text-white/60">
                        <span className="text-orange-400">AI rationale:</span> {item.ai_rationale}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}

            <div className="flex justify-between pt-2">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="text-white/70 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={items.length === 0}
                className="bg-orange-500 hover:bg-orange-600 text-black"
              >
                Continue<ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-widest text-white/50">
              Step 3 — Confirm removals
            </div>
            <p className="text-sm text-white/70">
              Tick the items you want to push to the Requiem pipeline for suppression and removal action.
            </p>
            {items.filter((i) => !i.user_dismissed).map((item) => (
              <Card key={item.id} className="bg-white/5 border-white/10">
                <CardContent className="p-5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={item.user_confirmed}
                      onCheckedChange={(v) => toggleConfirm(item, !!v)}
                      className="mt-1 border-white/30 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="outline" className={`${sevColor(item.severity)} border`}>
                          Sev {item.severity}
                        </Badge>
                        {item.category && (
                          <Badge variant="outline" className="border-white/20 text-white/70 capitalize">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                      {item.url && (
                        <div className="text-xs text-orange-400 break-all mb-1">{item.url}</div>
                      )}
                      {item.excerpt && (
                        <div className="text-sm text-white/80 italic">"{item.excerpt}"</div>
                      )}
                    </div>
                  </label>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(2)} className="text-white/70 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />Back
              </Button>
              <Button
                onClick={handleDispatch}
                disabled={dispatching || confirmedCount === 0}
                className="bg-orange-500 hover:bg-orange-600 text-black"
              >
                {dispatching ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Dispatching…</>
                ) : (
                  <><Send className="h-4 w-4 mr-2" />Confirm {confirmedCount} removal{confirmedCount === 1 ? '' : 's'}</>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-orange-500 mx-auto" />
              <div>
                <h2 className="text-xl font-semibold text-white">Dispatched to Requiem</h2>
                <p className="text-sm text-white/60 mt-2">
                  {confirmedCount} item{confirmedCount === 1 ? '' : 's'} have been queued for the
                  Requiem suppression pipeline. You'll see progress in your Findings feed.
                </p>
                {requiemRunId && (
                  <div className="text-xs text-white/40 mt-3">Run ID: {requiemRunId}</div>
                )}
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(1);
                    setSubmissionId(null);
                    setItems([]);
                    setSourceUrl('');
                    setSourceText('');
                    setNotes('');
                    setRequiemRunId(null);
                  }}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Submit another
                </Button>
                <Button
                  onClick={() => navigate('/portal/findings')}
                  className="bg-orange-500 hover:bg-orange-600 text-black"
                >
                  View findings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalLayout>
  );
};

const Stepper = ({ current }: { current: Step }) => (
  <div className="flex items-center gap-2 max-w-3xl">
    {stepMeta.map((s, i) => {
      const active = current === s.key;
      const done = current > s.key;
      return (
        <div key={s.key} className="flex items-center flex-1">
          <div className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-semibold transition-colors ${
                done
                  ? 'bg-orange-500 border-orange-500 text-black'
                  : active
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                    : 'bg-white/5 border-white/15 text-white/40'
              }`}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : s.key}
            </div>
            <div className={`text-sm ${active ? 'text-white' : done ? 'text-white/70' : 'text-white/40'}`}>
              {s.label}
            </div>
          </div>
          {i < stepMeta.length - 1 && (
            <div className={`flex-1 h-px mx-3 ${done ? 'bg-orange-500' : 'bg-white/10'}`} />
          )}
        </div>
      );
    })}
  </div>
);

export default PortalRemoval;
