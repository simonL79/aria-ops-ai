
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Loader, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const formSchema = z.object({
  reporterName: z.string().optional(),
  entityBeingTargeted: z.string().min(2, { message: "Entity name must be at least 2 characters" }),
  platform: z.string().min(1, { message: "Please select a platform" }),
  contentLink: z.string().url().optional().or(z.literal("")),
  contentText: z.string().min(10, { message: "Please provide at least 10 characters of content description" }),
  honeypot: z.string().max(0, { message: "Please leave this field empty" }).optional(),
});

type FormData = z.infer<typeof formSchema>;

const platforms = [
  'Twitter/X',
  'Facebook',
  'Instagram',
  'LinkedIn',
  'TikTok',
  'YouTube',
  'Reddit',
  'Google Reviews',
  'Trustpilot',
  'Glassdoor',
  'News Website',
  'Blog',
  'Forum',
  'Other'
];

const ConcernSubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<number>(0);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reporterName: '',
      entityBeingTargeted: '',
      platform: '',
      contentLink: '',
      contentText: '',
      honeypot: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    // Rate limiting - prevent submissions within 30 seconds
    const now = Date.now();
    if (now - lastSubmission < 30000) {
      toast.error('Please wait before submitting another report');
      return;
    }

    // Honeypot check
    if (data.honeypot && data.honeypot.length > 0) {
      toast.error('Invalid submission detected');
      return;
    }

    setIsSubmitting(true);
    setLastSubmission(now);

    try {
      const { error } = await supabase
        .from('scan_results')
        .insert({
          platform: data.platform,
          content: `Reporter: ${data.reporterName || 'Anonymous'}\nEntity: ${data.entityBeingTargeted}\nContent: ${data.contentText}`,
          url: data.contentLink || '',
          severity: 'medium',
          status: 'new',
          threat_type: 'user_report',
          source_type: 'user_submission',
          risk_entity_name: data.entityBeingTargeted,
          risk_entity_type: 'unknown'
        });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      toast.success('Your concern has been submitted successfully');
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('There was an error submitting your concern. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-gray-800 border border-gray-700 rounded-lg">
        <div className="text-center">
          <Shield className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Report Submitted</h3>
          <p className="text-gray-300 mb-4">
            Thank you for your submission. Our team will review your concern and take appropriate action.
          </p>
          <p className="text-sm text-gray-400">
            You will be contacted if additional information is needed.
          </p>
          <Button 
            variant="outline" 
            className="mt-4 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            onClick={() => setIsSubmitted(false)}
          >
            Submit Another Report
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <AlertTriangle className="h-8 w-8 text-orange-500" />
          <h2 className="text-3xl font-bold text-white">Submit a Concern</h2>
        </div>
        <p className="text-lg text-gray-300">
          Report content that may be threatening, defamatory, or harmful to individuals or organizations.
        </p>
      </div>

      <div className="bg-gray-800 border border-gray-700 p-8 rounded-xl shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="reporterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Your Name (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John Smith" 
                      className="bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Providing your name helps us follow up if needed, but anonymous reports are accepted.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entityBeingTargeted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Entity Being Targeted *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Person or organization name" 
                      className="bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Who is being targeted or mentioned in the concerning content?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Platform *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-black/50 border-gray-600 text-white focus:border-orange-500">
                        <SelectValue placeholder="Select platform where content was found" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {platforms.map((platform) => (
                        <SelectItem key={platform} value={platform} className="text-white hover:bg-gray-700">
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contentLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Link to Content (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/post/123" 
                      type="url"
                      className="bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Direct link to the concerning content, if available.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contentText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Content Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the concerning content or paste the text here..."
                      className="min-h-[120px] bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Provide details about the content that concerns you. Include quotes if possible.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Honeypot field - hidden from users */}
            <FormField
              control={form.control}
              name="honeypot"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Leave this field empty</FormLabel>
                  <FormControl>
                    <Input {...field} tabIndex={-1} autoComplete="off" />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Submit Concern Report
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="mt-6 text-center text-sm text-gray-400">
        <p>All submissions are confidential and will be reviewed by our security team.</p>
        <p className="mt-2">False or malicious reports may result in restrictions.</p>
      </div>
    </div>
  );
};

export default ConcernSubmissionForm;
