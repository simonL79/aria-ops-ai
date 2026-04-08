
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const contactSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  companyEmail: z.string().trim().email('Please enter a valid email'),
  company: z.string().trim().max(100).optional(),
  phoneNumber: z.string().trim().max(30).optional(),
  details: z.string().trim().min(10, 'Please provide at least 10 characters of detail').max(2000),
});

const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyEmail: '',
    company: '',
    phoneNumber: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);
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

      const { error } = await supabase.from('contact_submissions').insert({
        id: submissionId,
        first_name: firstName,
        last_name: lastName,
        email: formData.companyEmail.trim(),
        company: formData.company.trim() || null,
        message: formData.details.trim(),
      });

      if (error) throw error;

      await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'contact-form-notification',
          recipientEmail: formData.companyEmail.trim(),
          idempotencyKey: `contact-notify-${submissionId}`,
          templateData: {
            name: formData.fullName.trim(),
            email: formData.companyEmail.trim(),
            company: formData.company.trim() || undefined,
            message: formData.details.trim(),
          },
        },
      });

      toast.success('Your request has been submitted. We\'ll be in touch shortly.');
      setFormData({ fullName: '', companyEmail: '', company: '', phoneNumber: '', details: '' });
    } catch {
      toast.error('Something went wrong. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "bg-secondary border-border text-white placeholder-muted-foreground focus:border-primary focus:outline-none";

  return (
    <section className="bg-black py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Get a comprehensive assessment of your digital risk profile. Our experts will identify vulnerabilities and provide a strategic roadmap.
            </h2>
          </div>

          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Full Name *</label>
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
                <label className="text-white text-sm font-medium mb-2 block">Company Email *</label>
                <Input
                  name="companyEmail"
                  type="email"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  placeholder="your.email@company.com"
                  required
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Company</label>
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company name"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Phone Number</label>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Brief Details *</label>
                <Textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="Briefly describe your needs or concerns..."
                  rows={4}
                  required
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-300"
              >
                {isSubmitting ? 'Submitting...' : 'Request Risk Assessment'}
              </Button>

              <p className="text-muted-foreground text-xs text-center">
                * Information stays confidential
              </p>
            </form>
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} A.R.I.A — All Reputation Rights Reserved</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
