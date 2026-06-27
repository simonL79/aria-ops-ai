import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Loader, Shield, AlertTriangle, Gavel, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const baseSchema = z.object({
  concernType: z.enum(['reputational', 'legal']),
  reporterName: z.string().optional(),
  entityBeingTargeted: z.string().min(2, { message: "Entity name must be at least 2 characters" }),
  contentText: z.string().min(10, { message: "Please provide at least 10 characters of content description" }),
  honeypot: z.string().max(0, { message: "Please leave this field empty" }).optional(),
  // Reputational fields
  platform: z.string().optional(),
  contentType: z.string().optional(),
  reachLevel: z.string().optional(),
  contentLink: z.string().url().optional().or(z.literal("")),
  // Legal fields
  legalCategory: z.string().optional(),
  urgency: z.string().optional(),
  solicitorContacted: z.string().optional(),
  desiredOutcome: z.string().optional(),
  jurisdiction: z.string().optional(),
  deadlineDate: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.concernType === 'reputational') {
    if (!data.platform || data.platform.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['platform'], message: "Please select a platform" });
    }
  } else if (data.concernType === 'legal') {
    if (!data.legalCategory || data.legalCategory.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['legalCategory'], message: "Please select a legal category" });
    }
    if (!data.urgency || data.urgency.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['urgency'], message: "Please select urgency level" });
    }
  }
});

type FormData = z.infer<typeof baseSchema>;

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

const contentTypes = [
  'Post / Comment',
  'Review',
  'News Article',
  'Video',
  'Image / Meme',
  'Impersonation Profile',
  'Other'
];

const reachLevels = [
  'Isolated — only a few views',
  'Spreading — gaining traction',
  'Viral — widely seen',
  'Unknown'
];

const legalCategories = [
  'Defamation / Libel / Slander',
  'Harassment / Online Abuse',
  'Privacy / Data Breach',
  'Intellectual Property Infringement',
  'Contract Dispute',
  'Employment / Workplace',
  'Fraud / Impersonation',
  'Other'
];

const urgencyLevels = [
  'Immediate — within 24 hours',
  'Urgent — within a week',
  'Standard — no immediate deadline',
  'Unknown'
];

const solicitorStatuses = [
  'Yes',
  'No',
  'Not yet — exploring options'
];

const desiredOutcomes = [
  'Content removal / takedown',
  'Cease & desist letter',
  'Correction / retraction',
  'Compensation / damages',
  'Court proceedings',
  'Legal advice and guidance only'
];

const ConcernSubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<number>(0);

  const form = useForm<FormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      concernType: 'reputational',
      reporterName: '',
      entityBeingTargeted: '',
      contentText: '',
      honeypot: '',
      platform: '',
      contentType: '',
      reachLevel: '',
      contentLink: '',
      legalCategory: '',
      urgency: '',
      solicitorContacted: '',
      desiredOutcome: '',
      jurisdiction: '',
      deadlineDate: '',
    },
  });

  const concernType = form.watch('concernType');

  const onSubmit = async (data: FormData) => {
    const now = Date.now();
    if (now - lastSubmission < 30000) {
      toast.error('Please wait before submitting another report');
      return;
    }

    if (data.honeypot && data.honeypot.length > 0) {
      toast.error('Invalid submission detected');
      return;
    }

    setIsSubmitting(true);
    setLastSubmission(now);

    const isLegal = data.concernType === 'legal';
    const metadata = isLegal
      ? {
          legalCategory: data.legalCategory,
          urgency: data.urgency,
          solicitorContacted: data.solicitorContacted,
          desiredOutcome: data.desiredOutcome,
          jurisdiction: data.jurisdiction,
          deadlineDate: data.deadlineDate,
        }
      : {
          platform: data.platform,
          contentType: data.contentType,
          reachLevel: data.reachLevel,
        };

    try {
      const { error } = await supabase
        .from('scan_results')
        .insert({
          platform: isLegal ? 'legal_report' : data.platform,
          content: `Reporter: ${data.reporterName || 'Anonymous'}\nEntity: ${data.entityBeingTargeted}\nType: ${isLegal ? 'Legal' : 'Reputational'}\nContent: ${data.contentText}`,
          url: data.contentLink || '',
          severity: isLegal ? 'high' : 'medium',
          status: 'new',
          threat_type: isLegal ? 'user_report_legal' : 'user_report_reputational',
          source_type: 'user_submission',
          risk_entity_name: data.entityBeingTargeted,
          risk_entity_type: 'unknown',
          metadata: metadata
        });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      toast.success(`Your ${isLegal ? 'legal' : 'reputational'} concern has been submitted successfully`);
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
      <div className="max-w-2xl mx-auto p-8 bg-card border border-border rounded-lg">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">Report Submitted</h3>
          <p className="text-muted-foreground mb-4">
            Thank you for your submission. Our team will review your concern and take appropriate action.
          </p>
          <p className="text-sm text-muted-foreground">
            You will be contacted if additional information is needed.
          </p>
          <Button
            variant="outline"
            className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
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
          <AlertTriangle className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Submit a Concern</h2>
        </div>
        <p className="text-lg text-muted-foreground">
          Report reputational threats or legal issues targeting you, your brand, or your organisation.
        </p>
      </div>

      <div className="bg-card border border-border p-8 rounded-xl shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Concern type toggle */}
            <FormField
              control={form.control}
              name="concernType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">What kind of concern are you reporting? *</FormLabel>
                  <Tabs
                    value={field.value}
                    onValueChange={(value) => field.onChange(value as 'reputational' | 'legal')}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 bg-muted">
                      <TabsTrigger value="reputational" className="gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground">
                        <TrendingUp className="h-4 w-4" />
                        Reputational
                      </TabsTrigger>
                      <TabsTrigger value="legal" className="gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground">
                        <Gavel className="h-4 w-4" />
                        Legal
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <FormDescription className="text-muted-foreground">
                    {concernType === 'legal'
                      ? 'Legal reports are escalated for solicitor-ready case preparation.'
                      : 'Reputational reports are triaged for threat monitoring and response.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reporterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Your Name (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Smith"
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-muted-foreground">
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
                  <FormLabel className="text-foreground">Entity Being Targeted *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Person or organisation name"
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-muted-foreground">
                    Who is being targeted or mentioned in the concerning content?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {concernType === 'reputational' && (
              <>
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Platform *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary border-border text-foreground focus:border-primary">
                            <SelectValue placeholder="Select platform where content was found" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-border">
                          {platforms.map((platform) => (
                            <SelectItem key={platform} value={platform} className="text-foreground hover:bg-secondary">
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
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Content Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary border-border text-foreground focus:border-primary">
                            <SelectValue placeholder="Select the type of content" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-border">
                          {contentTypes.map((type) => (
                            <SelectItem key={type} value={type} className="text-foreground hover:bg-secondary">
                              {type}
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
                  name="reachLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Reach / Visibility</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary border-border text-foreground focus:border-primary">
                            <SelectValue placeholder="How widely is the content being seen?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-border">
                          {reachLevels.map((level) => (
                            <SelectItem key={level} value={level} className="text-foreground hover:bg-secondary">
                              {level}
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
                      <FormLabel className="text-foreground">Link to Content (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/post/123"
                          type="url"
                          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-muted-foreground">
                        Direct link to the concerning content, if available.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {concernType === 'legal' && (
              <>
                <FormField
                  control={form.control}
                  name="legalCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Legal Category *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary border-border text-foreground focus:border-primary">
                            <SelectValue placeholder="Select the legal issue type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-border">
                          {legalCategories.map((category) => (
                            <SelectItem key={category} value={category} className="text-foreground hover:bg-secondary">
                              {category}
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
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Urgency *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary border-border text-foreground focus:border-primary">
                            <SelectValue placeholder="How quickly does this need action?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-border">
                          {urgencyLevels.map((level) => (
                            <SelectItem key={level} value={level} className="text-foreground hover:bg-secondary">
                              {level}
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
                  name="solicitorContacted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Have you contacted a solicitor?</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary border-border text-foreground focus:border-primary">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-border">
                          {solicitorStatuses.map((status) => (
                            <SelectItem key={status} value={status} className="text-foreground hover:bg-secondary">
                              {status}
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
                  name="desiredOutcome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Desired Outcome</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary border-border text-foreground focus:border-primary">
                            <SelectValue placeholder="What outcome are you seeking?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-border">
                          {desiredOutcomes.map((outcome) => (
                            <SelectItem key={outcome} value={outcome} className="text-foreground hover:bg-secondary">
                              {outcome}
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
                  name="jurisdiction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Jurisdiction / Location (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. England & Wales, California, EU"
                          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-muted-foreground">
                        Helps us route the report to the right legal framework.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadlineDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Known Deadline (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-muted-foreground">
                        Court date, limitation deadline, or other important date.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="contentText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Content Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={concernType === 'legal'
                        ? "Describe the legal issue, events so far, and any evidence you have..."
                        : "Describe the concerning content or paste the text here..."
                      }
                      className="min-h-[140px] bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-muted-foreground">
                    Provide details, quotes, dates, and any context that helps us assess the issue.
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
              className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
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
                  Submit {concernType === 'legal' ? 'Legal' : 'Reputational'} Report
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>All submissions are confidential and will be reviewed by our security team.</p>
        <p className="mt-2">False or malicious reports may result in restrictions.</p>
      </div>
    </div>
  );
};

export default ConcernSubmissionForm;