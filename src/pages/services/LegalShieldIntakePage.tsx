import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { toast } from 'sonner';
import PublicLayout from '@/components/layout/PublicLayout';
import SEO from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { generateCasePack, type TimelineEntry } from '@/lib/legalShieldCasePack';
import {
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Scale,
  Loader2,
  FileDown,
  Plus,
  Trash2,
} from 'lucide-react';

const issueTypes = [
  'Consumer dispute',
  'Employment issue',
  'Landlord / tenant disagreement',
  'Unpaid invoice',
  'Online harassment',
  'Reputational attack / defamation',
  'Contractual disagreement',
  'Other',
];

const urgencyLevels = [
  { value: 'low', label: 'Low — just gathering information' },
  { value: 'normal', label: 'Normal — within the next few weeks' },
  { value: 'high', label: 'High — within days' },
  { value: 'urgent', label: 'Urgent — active deadline or escalation' },
];

const intakeSchema = z.object({
  issue_type: z.string().min(1, 'Please choose the type of issue'),
  issue_description: z
    .string()
    .trim()
    .min(20, 'Please describe your situation in a little more detail')
    .max(4000, 'Description must be under 4000 characters'),
  desired_outcome: z.string().trim().max(1000).optional(),
  evidence_summary: z.string().trim().max(2000).optional(),
  urgency: z.string().min(1),
  full_name: z.string().trim().min(1, 'Your name is required').max(120),
  email: z.string().trim().email('Enter a valid email').max(255),
  phone: z.string().trim().max(40).optional(),
  consent_given: z.literal(true, {
    errorMap: () => ({ message: 'Please confirm you understand this is not legal advice' }),
  }),
});

type FormState = {
  issue_type: string;
  issue_description: string;
  desired_outcome: string;
  evidence_summary: string;
  evidence_timeline: TimelineEntry[];
  urgency: string;
  full_name: string;
  email: string;
  phone: string;
  consent_given: boolean;
};

const initialState: FormState = {
  issue_type: '',
  issue_description: '',
  desired_outcome: '',
  evidence_summary: '',
  evidence_timeline: [],
  urgency: 'normal',
  full_name: '',
  email: '',
  phone: '',
  consent_given: false,
};

const steps = ['Your issue', 'The details', 'Your contact', 'Review'];

const LegalShieldIntakePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addTimelineEntry = () =>
    setForm((prev) => ({
      ...prev,
      evidence_timeline: [...prev.evidence_timeline, { date: '', event: '' }],
    }));

  const updateTimelineEntry = (index: number, field: keyof TimelineEntry, value: string) =>
    setForm((prev) => ({
      ...prev,
      evidence_timeline: prev.evidence_timeline.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry,
      ),
    }));

  const removeTimelineEntry = (index: number) =>
    setForm((prev) => ({
      ...prev,
      evidence_timeline: prev.evidence_timeline.filter((_, i) => i !== index),
    }));

  const downloadCasePack = () => {
    try {
      const { reference } = generateCasePack({
        issue_type: form.issue_type,
        urgency_label: urgencyLevels.find((u) => u.value === form.urgency)?.label ?? form.urgency,
        issue_description: form.issue_description.trim(),
        desired_outcome: form.desired_outcome.trim() || undefined,
        evidence_summary: form.evidence_summary.trim() || undefined,
        evidence_timeline: form.evidence_timeline
          .filter((e) => e.date.trim() || e.event.trim())
          .map((e) => ({ date: e.date.trim(), event: e.event.trim() })),
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
      });
      toast.success(`Case pack downloaded (ref ${reference}).`);
    } catch (err) {
      console.error('Case pack generation failed');
      toast.error('Could not generate the case pack. Please try again.');
    }
  };

  const canContinue = () => {
    if (step === 0) return form.issue_type !== '';
    if (step === 1) return form.issue_description.trim().length >= 20;
    if (step === 2) return form.full_name.trim() !== '' && form.email.trim() !== '';
    return true;
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    const result = intakeSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.errors[0]?.message ?? 'Please check your answers');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('legal_shield_intakes' as any).insert({
        issue_type: form.issue_type,
        issue_description: form.issue_description.trim(),
        desired_outcome: form.desired_outcome.trim() || null,
        evidence_summary: form.evidence_summary.trim() || null,
        urgency: form.urgency,
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        consent_given: form.consent_given,
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success('Your guided intake has been received.');
    } catch (err) {
      console.error('Legal Shield intake submission failed');
      toast.error('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <SEO
        title="Start Your Guided Intake — ARIA Legal Shield™"
        description="Begin your ARIA Legal Shield™ guided intake. Tell us about your legal issue and we will help you understand your options, organise evidence and prepare a solicitor-ready case pack."
        path="/services/legal-shield/intake"
      />

      <article className="bg-background text-foreground min-h-screen">
        <section className="container mx-auto px-6 pt-16 pb-12 max-w-3xl">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Shield className="h-5 w-5" />
            <span className="text-sm uppercase tracking-widest">ARIA Legal Shield™ — Guided Intake</span>
          </div>

          {submitted ? (
            <div className="bg-card border border-primary/40 rounded-lg p-10 text-center">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-4">Thank you — your intake is in.</h1>
              <p className="text-muted-foreground text-lg mb-6 max-w-xl mx-auto">
                We have received your guided intake. Our team will review your situation and respond
                with your next steps, an evidence checklist and how ARIA Legal Shield can help you
                prepare. Remember: this is not legal advice and does not replace a solicitor.
              </p>
              <p className="text-sm text-muted-foreground mb-8 max-w-xl mx-auto">
                Download your solicitor-ready case pack below — a structured PDF of your account and
                evidence timeline you can take to any qualified legal professional.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" onClick={downloadCasePack}>
                  <FileDown className="mr-2 h-4 w-4" /> Download case pack (PDF)
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/services/legal-shield">Back to Legal Shield</Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link to="/">Return home</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Let's understand your situation</h1>
              <p className="text-muted-foreground mb-8">
                A few quick questions so we can point you to the right next step. Takes about two
                minutes — no payment required to start.
              </p>

              {/* Progress */}
              <div className="flex items-center gap-2 mb-10">
                {steps.map((label, i) => (
                  <React.Fragment key={label}>
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border ${
                          i <= step
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-muted-foreground border-border'
                        }`}
                      >
                        {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                      </div>
                      <span className="hidden sm:block text-xs text-muted-foreground">{label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 ${i < step ? 'bg-primary' : 'bg-border'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="bg-card border border-border rounded-lg p-6 md:p-8 space-y-6">
                {/* Step 0 — issue type */}
                {step === 0 && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base">What kind of issue are you facing?</Label>
                      <div className="grid sm:grid-cols-2 gap-3 mt-3">
                        {issueTypes.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => update('issue_type', t)}
                            className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                              form.issue_type === t
                                ? 'border-primary bg-primary/10 text-foreground'
                                : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="urgency" className="text-base">How urgent is it?</Label>
                      <Select value={form.urgency} onValueChange={(v) => update('urgency', v)}>
                        <SelectTrigger id="urgency" className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {urgencyLevels.map((u) => (
                            <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 1 — details */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="desc" className="text-base">Describe what's happening</Label>
                      <Textarea
                        id="desc"
                        value={form.issue_description}
                        onChange={(e) => update('issue_description', e.target.value)}
                        placeholder="Tell us what happened, who is involved and what has been said or done so far."
                        className="mt-2 min-h-[140px]"
                        maxLength={4000}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {form.issue_description.trim().length}/4000 — at least 20 characters.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="outcome" className="text-base">What outcome are you hoping for? (optional)</Label>
                      <Textarea
                        id="outcome"
                        value={form.desired_outcome}
                        onChange={(e) => update('desired_outcome', e.target.value)}
                        placeholder="e.g. an apology, a refund, content removed, a dispute resolved."
                        className="mt-2"
                        maxLength={1000}
                      />
                    </div>
                    <div>
                      <Label htmlFor="evidence" className="text-base">What evidence do you have? (optional)</Label>
                      <Textarea
                        id="evidence"
                        value={form.evidence_summary}
                        onChange={(e) => update('evidence_summary', e.target.value)}
                        placeholder="e.g. emails, messages, contracts, screenshots, invoices, dates."
                        className="mt-2"
                        maxLength={2000}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Evidence timeline (optional)</Label>
                        <Button type="button" size="sm" variant="outline" onClick={addTimelineEntry}>
                          <Plus className="mr-1 h-4 w-4" /> Add event
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add key dates and what happened. This builds the timeline in your
                        solicitor-ready case pack.
                      </p>
                      <div className="space-y-3 mt-3">
                        {form.evidence_timeline.length === 0 && (
                          <p className="text-sm text-muted-foreground italic">
                            No events added yet.
                          </p>
                        )}
                        {form.evidence_timeline.map((entry, i) => (
                          <div key={i} className="flex flex-col sm:flex-row gap-2 sm:items-start">
                            <Input
                              type="date"
                              value={entry.date}
                              onChange={(e) => updateTimelineEntry(i, 'date', e.target.value)}
                              className="sm:w-44"
                            />
                            <Input
                              value={entry.event}
                              onChange={(e) => updateTimelineEntry(i, 'event', e.target.value)}
                              placeholder="What happened on this date?"
                              maxLength={300}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => removeTimelineEntry(i)}
                              aria-label="Remove event"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 — contact */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-base">Full name</Label>
                      <Input
                        id="name"
                        value={form.full_name}
                        onChange={(e) => update('full_name', e.target.value)}
                        className="mt-2"
                        maxLength={120}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-base">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        className="mt-2"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-base">Phone (optional)</Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className="mt-2"
                        maxLength={40}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3 — review */}
                {step === 3 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold">Review your details</h2>
                    <dl className="space-y-3 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Issue</dt>
                        <dd className="text-foreground">{form.issue_type} · {urgencyLevels.find((u) => u.value === form.urgency)?.label}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Description</dt>
                        <dd className="text-foreground whitespace-pre-wrap">{form.issue_description}</dd>
                      </div>
                      {form.desired_outcome && (
                        <div>
                          <dt className="text-muted-foreground">Desired outcome</dt>
                          <dd className="text-foreground whitespace-pre-wrap">{form.desired_outcome}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-muted-foreground">Contact</dt>
                        <dd className="text-foreground">{form.full_name} · {form.email}{form.phone ? ` · ${form.phone}` : ''}</dd>
                      </div>
                    </dl>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <Checkbox
                        checked={form.consent_given}
                        onCheckedChange={(v) => update('consent_given', v === true)}
                        className="mt-1"
                      />
                      <span className="text-sm text-muted-foreground">
                        I understand that ARIA Legal Shield™ provides AI-powered legal information,
                        document preparation and case organisation. It is not a law firm, does not
                        provide regulated legal services, and is not a substitute for independent
                        legal advice. I consent to ARIA processing these details to respond to my
                        enquiry.
                      </span>
                    </label>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button variant="ghost" onClick={back} disabled={step === 0 || isSubmitting}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  {step < steps.length - 1 ? (
                    <Button onClick={next} disabled={!canContinue()}>
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={isSubmitting || !form.consent_given}>
                      {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</>
                      ) : (
                        <><Scale className="mr-2 h-4 w-4" /> Submit intake</>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-6 text-center">
                Not a law firm. Not legal advice. Where appropriate, you will be encouraged to seek
                advice from a qualified legal professional.
              </p>
            </>
          )}
        </section>
      </article>
    </PublicLayout>
  );
};

export default LegalShieldIntakePage;
