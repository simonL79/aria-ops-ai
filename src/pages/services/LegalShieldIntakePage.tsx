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
  Paperclip,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';

const MAX_FILES = 10;
const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB
const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/heic',
  'application/pdf',
];

type EvidenceFileMeta = {
  path: string;
  name: string;
  size: number;
  type: string;
};

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

type CourseOfAction = {
  steps: string[];
  disclaimers: string[];
};

// Always-required acknowledgements, regardless of issue type.
const BASE_DISCLAIMERS: string[] = [
  'I understand the suggested course of action below is AI-generated legal information based only on what I have provided — not advice tailored to my full circumstances.',
  'I understand ARIA Legal Shield™ is not a law firm, does not provide regulated legal services, and is not a substitute for advice from a qualified solicitor.',
  'I understand the strength of any course of action depends on the accuracy and completeness of the evidence I have supplied.',
];

// Issue-specific recommended course of action and extra acknowledgements.
const courseOfActionByIssue: Record<string, CourseOfAction> = {
  'Consumer dispute': {
    steps: [
      'Gather proof of purchase, the contract/terms and all correspondence with the seller.',
      'Send a clear written complaint setting out the fault and the outcome you want, with a reasonable deadline.',
      'If unresolved, escalate to the relevant ombudsman or alternative dispute resolution scheme before considering court.',
    ],
    disclaimers: [
      'I understand strict time limits and consumer-protection rules may apply, and I should confirm deadlines with a qualified professional.',
    ],
  },
  'Employment issue': {
    steps: [
      'Collect your contract, payslips, written warnings, policies and any relevant messages.',
      'Raise the matter through your employer’s internal grievance procedure in writing first.',
      'Be aware many employment claims have a short limitation period — early Acas Early Conciliation may be required.',
    ],
    disclaimers: [
      'I understand employment claim deadlines can be as short as three months and that I am responsible for confirming my own time limits.',
    ],
  },
  'Landlord / tenant disagreement': {
    steps: [
      'Gather the tenancy agreement, deposit-protection details, rent records and photos of any disrepair.',
      'Put your concerns to the other party in writing and keep copies of everything.',
      'If unresolved, consider the deposit scheme’s dispute service or appropriate housing/legal routes.',
    ],
    disclaimers: [
      'I understand housing law and deposit rules are complex and that formal action (e.g. eviction or possession) must follow strict legal process.',
    ],
  },
  'Unpaid invoice': {
    steps: [
      'Compile the contract/agreement, the invoice, delivery proof and any chaser communications.',
      'Send a formal letter before action stating the amount owed and a deadline to pay.',
      'If still unpaid, consider a money claim or debt-recovery route.',
    ],
    disclaimers: [
      'I understand a letter before action and court claims have formal requirements and that interest/limitation rules may apply.',
    ],
  },
  'Online harassment': {
    steps: [
      'Preserve evidence: dated screenshots, URLs, usernames and any threats — do not delete anything.',
      'Report the content to the relevant platform and, where there is a risk to safety, to the police.',
      'Keep a log of incidents to support any complaint, takedown or legal action.',
    ],
    disclaimers: [
      'I understand that if I feel unsafe or threatened I should contact the police, and ARIA cannot provide emergency assistance.',
    ],
  },
  'Reputational attack / defamation': {
    steps: [
      'Capture the defamatory material with dated screenshots and full URLs before it is changed or removed.',
      'Record the impact (financial, professional, personal) the statements have caused.',
      'Consider takedown requests and a formal complaint; defamation claims are time-sensitive and complex.',
    ],
    disclaimers: [
      'I understand defamation claims carry a short limitation period (generally one year) and high legal thresholds, and require specialist legal advice.',
    ],
  },
  'Contractual disagreement': {
    steps: [
      'Assemble the signed contract, variations, invoices and all correspondence about performance.',
      'Identify the specific terms you believe were breached and the loss caused.',
      'Raise the breach in writing, propose resolution, and consider mediation before litigation.',
    ],
    disclaimers: [
      'I understand contract interpretation and remedies depend on the precise wording and facts, which only a qualified professional can fully assess.',
    ],
  },
  Other: {
    steps: [
      'Organise all relevant documents and a clear timeline of what happened.',
      'Set out, in writing, the outcome you are seeking.',
      'Use your case pack to seek tailored advice from a qualified legal professional.',
    ],
    disclaimers: [],
  },
};

const getCourseOfAction = (issueType: string): CourseOfAction => {
  const specific = courseOfActionByIssue[issueType] ?? courseOfActionByIssue.Other;
  return {
    steps: specific.steps,
    disclaimers: [...BASE_DISCLAIMERS, ...specific.disclaimers],
  };
};

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
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [suggestions, setSuggestions] = useState<TimelineEntry[]>([]);
  const [agreedDisclaimers, setAgreedDisclaimers] = useState<boolean[]>([]);

  const courseOfAction = getCourseOfAction(form.issue_type);
  const allDisclaimersAgreed =
    courseOfAction.disclaimers.length > 0 &&
    courseOfAction.disclaimers.every((_, i) => agreedDisclaimers[i] === true);

  const toggleDisclaimer = (index: number, value: boolean) =>
    setAgreedDisclaimers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const analyseEvidence = async () => {
    const analysable = files.filter((f) => f.type !== 'image/heic');
    if (analysable.length === 0) {
      toast.error('Add a screenshot, photo or PDF first (HEIC files cannot be read).');
      return;
    }
    setIsAnalysing(true);
    try {
      const encoded = await Promise.all(
        analysable.map(async (f) => ({
          name: f.name,
          type: f.type,
          dataUrl: await fileToDataUrl(f),
        })),
      );
      const { data, error } = await supabase.functions.invoke('extract-evidence-timeline', {
        body: { files: encoded },
      });
      if (error) throw error;
      const entries: TimelineEntry[] = Array.isArray(data?.entries)
        ? data.entries
            .map((e: { date?: string; event?: string }) => ({
              date: (e.date ?? '').trim(),
              event: (e.event ?? '').trim(),
            }))
            .filter((e: TimelineEntry) => e.event)
        : [];
      if (entries.length === 0) {
        toast.message('No clear timeline events found in the files.');
      } else {
        setSuggestions(entries);
        toast.success(`Found ${entries.length} suggested event${entries.length === 1 ? '' : 's'}.`);
      }
    } catch (err) {
      console.error('Evidence analysis failed');
      toast.error('Could not analyse the evidence. Please try again.');
    } finally {
      setIsAnalysing(false);
    }
  };

  const addSuggestion = (index: number) => {
    setSuggestions((prev) => {
      const picked = prev[index];
      if (picked) {
        setForm((f) => ({
          ...f,
          evidence_timeline: [...f.evidence_timeline, picked],
        }));
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const addAllSuggestions = () => {
    setForm((f) => ({
      ...f,
      evidence_timeline: [...f.evidence_timeline, ...suggestions],
    }));
    setSuggestions([]);
    toast.success('All suggestions added to your timeline.');
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const selected = Array.from(incoming);
    setFiles((prev) => {
      const next = [...prev];
      for (const file of selected) {
        if (next.length >= MAX_FILES) {
          toast.error(`You can attach up to ${MAX_FILES} files.`);
          break;
        }
        if (!ACCEPTED_TYPES.includes(file.type)) {
          toast.error(`${file.name}: unsupported file type. Use images or PDFs.`);
          continue;
        }
        if (file.size > MAX_FILE_BYTES) {
          toast.error(`${file.name}: file is larger than 15MB.`);
          continue;
        }
        if (next.some((f) => f.name === file.name && f.size === file.size)) continue;
        next.push(file);
      }
      return next;
    });
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));


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
      // Upload evidence files to the private shield-evidence bucket first.
      const uploadedFiles: EvidenceFileMeta[] = [];
      if (files.length > 0) {
        // Malware-scan every file before it is saved to the submission.
        const rejected: string[] = [];
        for (const file of files) {
          const dataUrl = await fileToDataUrl(file);
          const { data: scan, error: scanError } = await supabase.functions.invoke(
            'scan-evidence-file',
            { body: { dataUrl, type: file.type, name: file.name } },
          );
          if (scanError) {
            rejected.push(`${file.name} (could not be scanned)`);
            continue;
          }
          if (!scan?.safe) {
            rejected.push(`${file.name}${scan?.reason ? ` — ${scan.reason}` : ''}`);
          }
        }

        if (rejected.length > 0) {
          toast.error(
            `${rejected.length} file(s) were blocked by the malware scan and not attached:\n${rejected.join('\n')}`,
          );
          setIsSubmitting(false);
          return;
        }

        const folder = `intake/${crypto.randomUUID()}`;
        for (const file of files) {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const path = `${folder}/${crypto.randomUUID()}-${safeName}`;
          const { error: uploadError } = await supabase.storage
            .from('shield-evidence')
            .upload(path, file, { contentType: file.type, upsert: false });
          if (uploadError) throw uploadError;
          uploadedFiles.push({
            path,
            name: file.name,
            size: file.size,
            type: file.type,
          });
        }
      }

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
        evidence_files: uploadedFiles,
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

                      {suggestions.length > 0 && (
                        <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                              <Sparkles className="h-4 w-4 text-primary" />
                              Suggested from your evidence
                            </div>
                            <Button type="button" size="sm" variant="outline" onClick={addAllSuggestions}>
                              Add all
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            Read from your uploaded files. Review each one — add the accurate
                            ones to your timeline.
                          </p>
                          <ul className="space-y-2">
                            {suggestions.map((s, i) => (
                              <li
                                key={`${s.date}-${i}`}
                                className="flex items-start gap-3 rounded-md border border-border bg-background px-3 py-2"
                              >
                                <div className="flex-1 text-sm">
                                  {s.date && (
                                    <span className="font-medium text-foreground mr-2">{s.date}</span>
                                  )}
                                  <span className="text-muted-foreground">{s.event}</span>
                                </div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => addSuggestion(i)}
                                >
                                  <Plus className="mr-1 h-4 w-4" /> Add
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-base">Upload evidence files (optional)</Label>


                      <p className="text-xs text-muted-foreground mt-1">
                        Attach screenshots, photos or PDFs (emails, messages, contracts,
                        invoices). Up to {MAX_FILES} files, 15MB each. Stored securely with your
                        submission.
                      </p>
                      <label
                        htmlFor="evidence-files"
                        className="mt-3 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      >
                        <Paperclip className="h-6 w-6 text-primary" />
                        <span className="text-sm text-foreground">
                          Click to choose files
                        </span>
                        <span className="text-xs text-muted-foreground">
                          PNG, JPG, GIF, WEBP or PDF
                        </span>
                        <input
                          id="evidence-files"
                          type="file"
                          multiple
                          accept={ACCEPTED_TYPES.join(',')}
                          className="hidden"
                          onChange={(e) => {
                            addFiles(e.target.files);
                            e.target.value = '';
                          }}
                        />
                      </label>
                      {files.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {files.map((file, i) => (
                            <li
                              key={`${file.name}-${i}`}
                              className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2"
                            >
                              <FileText className="h-4 w-4 text-primary shrink-0" />
                              <span className="flex-1 text-sm truncate">{file.name}</span>
                              <span className="text-xs text-muted-foreground shrink-0">
                                {(file.size / 1024 / 1024).toFixed(1)}MB
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile(i)}
                                aria-label={`Remove ${file.name}`}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      {files.length > 0 && (
                        <Button
                          type="button"
                          variant="secondary"
                          className="mt-3 w-full sm:w-auto"
                          onClick={analyseEvidence}
                          disabled={isAnalysing}
                        >
                          {isAnalysing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                          )}
                          {isAnalysing ? 'Reading your evidence…' : 'Suggest timeline from evidence'}
                        </Button>
                      )}
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
                      {files.length > 0 && (
                        <div>
                          <dt className="text-muted-foreground">Evidence files</dt>
                          <dd className="text-foreground">{files.length} file{files.length > 1 ? 's' : ''} attached</dd>
                        </div>
                      )}
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
