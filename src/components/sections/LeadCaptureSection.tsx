import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { PhoneCall, ShieldCheck } from 'lucide-react';

export interface LeadCaptureConfig {
  eyebrow: string;
  heading: string;
  subtext: string;
  urgencyNote?: string;
  submitLabel: string;
  sourceTag: string;
}

const leadSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email').max(255),
  company: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(30).optional(),
  urgency: z.string().trim().max(60).optional(),
  details: z.string().trim().min(10, 'Please add a little detail so we can respond fast').max(2000),
});

const URGENCY_OPTIONS = [
  'Live now — story is breaking',
  'Escalating within 24–48h',
  'Anticipated / preparing',
  'Ongoing issue',
];

const LeadCaptureSection: React.FC<{ cfg: LeadCaptureConfig }> = ({ cfg }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    urgency: URGENCY_OPTIONS[0],
    details: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = leadSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionId = crypto.randomUUID();
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '-';

      const message = [
        `[${cfg.sourceTag}]`,
        `Urgency: ${formData.urgency}`,
        formData.phone.trim() ? `Phone: ${formData.phone.trim()}` : null,
        '',
        formData.details.trim(),
      ]
        .filter(Boolean)
        .join('\n');

      const { error } = await supabase.from('contact_submissions').insert({
        id: submissionId,
        first_name: firstName,
        last_name: lastName,
        email: formData.email.trim().toLowerCase(),
        company: formData.company.trim() || null,
        message,
      });

      if (error) throw error;

      await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'contact-form-notification',
          recipientEmail: formData.email.trim(),
          idempotencyKey: `lead-notify-${submissionId}`,
          templateData: {
            name: formData.fullName.trim(),
            email: formData.email.trim(),
            company: formData.company.trim() || undefined,
            message,
          },
        },
      });

      toast.success('Request received. A crisis operator will be in touch shortly.');
      setFormData({
        fullName: '',
        email: '',
        company: '',
        phone: '',
        urgency: URGENCY_OPTIONS[0],
        details: '',
      });
    } catch {
      toast.error('Something went wrong. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    'bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none';

  return (
    <section
      id="get-help"
      data-scrollspy-section
      tabIndex={-1}
      className="container mx-auto px-6 py-20 max-w-3xl scroll-mt-24"
    >
      <div className="glass-card border-primary/30 p-8 md:p-10">
        <div className="text-center mb-8">
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">
            {cfg.eyebrow}
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-foreground mt-4 leading-tight">
            {cfg.heading}
          </h2>
          <p className="text-muted-foreground text-lg mt-4 leading-relaxed">{cfg.subtext}</p>
          {cfg.urgencyNote && (
            <p className="inline-flex items-center gap-2 mt-5 text-sm font-medium text-primary">
              <PhoneCall className="h-4 w-4" />
              {cfg.urgencyNote}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-foreground text-sm font-medium mb-2 block">Full name *</label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label className="text-foreground text-sm font-medium mb-2 block">Email *</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-foreground text-sm font-medium mb-2 block">
                Company / organisation
              </label>
              <Input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Optional"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="text-foreground text-sm font-medium mb-2 block">Phone</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="For fastest response"
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className="text-foreground text-sm font-medium mb-2 block">
              How urgent is this?
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className={`${inputClasses} w-full h-10 rounded-md border px-3 text-sm`}
            >
              {URGENCY_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-foreground text-sm font-medium mb-2 block">
              What's happening? *
            </label>
            <Textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Briefly describe the situation, the platforms involved, and any deadlines..."
              rows={4}
              required
              className={`${inputClasses} resize-none`}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold rounded-xl hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all duration-300"
          >
            {isSubmitting ? 'Submitting...' : cfg.submitLabel}
          </Button>

          <p className="flex items-center justify-center gap-2 text-muted-foreground text-xs text-center">
            <ShieldCheck className="h-3.5 w-3.5" />
            Confidential. No obligation. Operator-reviewed within hours.
          </p>
        </form>
      </div>
    </section>
  );
};

export default LeadCaptureSection;
