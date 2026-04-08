
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader, MessageSquare, Building, User, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
  description: z.string().min(10, { message: "Please provide at least 10 characters" }).max(3000, { message: "Description must not exceed 3000 characters (approximately 500 words)" }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactFormPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      companyName: '',
      email: '',
      phoneNumber: '',
      description: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('aria_notifications')
        .insert({
          event_type: 'contact_sales',
          entity_name: data.companyName,
          summary: `Sales inquiry from ${data.name} at ${data.companyName}`,
          priority: 'high',
          metadata: {
            name: data.name,
            company: data.companyName,
            email: data.email,
            phone: data.phoneNumber,
            description: data.description,
          }
        });

      if (error) {
        throw error;
      }

      toast.success('Your inquiry has been submitted successfully');
      navigate('/thank-you');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('There was an error submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const descriptionValue = form.watch('description');
  const wordCount = getWordCount(descriptionValue);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Contact Sales</h2>
              </div>
              <p className="text-lg text-muted-foreground">
                Ready to protect your reputation? Get in touch with our team to discuss your specific needs.
              </p>
            </div>

            <div className="bg-card border border-border p-8 rounded-xl shadow-lg">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John Smith" 
                            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Company Name *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Acme Corporation" 
                            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="john@company.com" 
                            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="tel"
                            placeholder="+1 (555) 123-4567" 
                            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Tell us about your needs *
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe your reputation monitoring needs, any specific concerns, or questions you have about our services. Include details about your industry, company size, and what you're looking to achieve..."
                            className="min-h-[200px] bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary resize-none" 
                            maxLength={3000}
                            {...field} 
                          />
                        </FormControl>
                        <div className="flex justify-between text-sm">
                          <FormMessage className="text-destructive" />
                          <span className="text-muted-foreground">
                            {wordCount}/500 words ({field.value.length}/3000 characters)
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Submit Sales Inquiry
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>We typically respond to sales inquiries within 2-4 business hours.</p>
              <p className="mt-2">All inquiries are confidential and handled by our senior sales team.</p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ContactFormPage;
