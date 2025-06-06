
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader, Shield, UserCheck, AlertTriangle } from 'lucide-react';

// Form validation schema - matches database columns
const clientIntakeSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  brand_or_alias: z.string().optional(),
  focus_scope: z.enum(['personal', 'business', 'both']),
  operational_mode: z.enum(['defensive', 'offensive', 'hybrid']),
  concern_areas: z.array(z.string()).min(1, "Please select at least one concern area"),
  known_aliases: z.array(z.string()).optional(),
  topics_to_flag: z.array(z.string()).optional(),
  escalation_keywords: z.array(z.string()).optional(),
  problematic_platforms: z.array(z.string()).optional(),
  suppression_targets: z.array(z.string()).optional(),
  amplification_topics: z.array(z.string()).optional(),
  content_types_to_remove: z.array(z.string()).optional(),
  prior_attacks: z.boolean().default(false),
  recent_achievements: z.string().optional(),
  risk_tolerance: z.enum(['low', 'medium', 'high']),
  urgency_level: z.enum(['low', 'medium', 'high', 'critical']),
  data_handling_pref: z.enum(['minimal', 'standard', 'comprehensive']),
  designated_contact_email: z.string().email().optional().or(z.literal("")),
  additional_information: z.string().optional(),
  consent_to_process: z.boolean().refine(val => val === true, "Consent is required")
});

type ClientIntakeFormData = z.infer<typeof clientIntakeSchema>;

const ClientIntakePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClientIntakeFormData>({
    resolver: zodResolver(clientIntakeSchema),
    defaultValues: {
      focus_scope: 'personal',
      operational_mode: 'defensive',
      concern_areas: [],
      known_aliases: [],
      topics_to_flag: [],
      escalation_keywords: [],
      problematic_platforms: [],
      suppression_targets: [],
      amplification_topics: [],
      content_types_to_remove: [],
      prior_attacks: false,
      risk_tolerance: 'medium',
      urgency_level: 'medium',
      data_handling_pref: 'standard',
      consent_to_process: false
    }
  });

  const onSubmit = async (data: ClientIntakeFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting client intake data:', data);
      
      const { data: result, error } = await supabase
        .from('client_intake_submissions')
        .insert({
          full_name: data.full_name,
          email: data.email,
          brand_or_alias: data.brand_or_alias || null,
          focus_scope: data.focus_scope,
          operational_mode: data.operational_mode,
          concern_areas: data.concern_areas,
          known_aliases: data.known_aliases || null,
          topics_to_flag: data.topics_to_flag || null,
          escalation_keywords: data.escalation_keywords || null,
          problematic_platforms: data.problematic_platforms || null,
          suppression_targets: data.suppression_targets || null,
          amplification_topics: data.amplification_topics || null,
          content_types_to_remove: data.content_types_to_remove || null,
          prior_attacks: data.prior_attacks,
          recent_achievements: data.recent_achievements || null,
          risk_tolerance: data.risk_tolerance,
          urgency_level: data.urgency_level,
          data_handling_pref: data.data_handling_pref,
          designated_contact_email: data.designated_contact_email || null,
          additional_information: data.additional_information || null,
          consent_to_process: data.consent_to_process,
          status: 'new'
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Submission successful:', result);
      toast.success('Client intake submitted successfully!');
      form.reset();
      
    } catch (error: any) {
      console.error('Error submitting client intake:', error);
      toast.error(`Failed to submit intake form: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const concernOptions = [
    'Reputation damage', 'Legal threats', 'Negative content', 'Competitor attacks',
    'Employee misconduct', 'Executive protection', 'Brand protection', 'Crisis management'
  ];

  const platformOptions = [
    'Google', 'Facebook', 'Twitter', 'LinkedIn', 'Instagram', 'TikTok', 
    'YouTube', 'Reddit', 'Review sites', 'News websites'
  ];

  const contentTypeOptions = [
    'Negative reviews', 'Defamatory articles', 'Social media posts', 'Forum discussions',
    'Images/videos', 'News articles', 'Blog posts', 'Comments'
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Client Intake Assessment
          </h1>
          <p className="text-xl text-gray-300">
            A.R.I.A™ Strategic Intelligence & Defense Configuration
          </p>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              Confidential Assessment
            </CardTitle>
            <CardDescription>
              All information provided is encrypted and protected under attorney-client privilege
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">Basic Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-800 border-gray-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} className="bg-gray-800 border-gray-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand_or_alias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand/Business Name (if applicable)</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-800 border-gray-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Assessment Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">Assessment Configuration</h3>
                  
                  <FormField
                    control={form.control}
                    name="focus_scope"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Protection Focus *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="personal" id="personal" />
                              <Label htmlFor="personal">Personal reputation</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="business" id="business" />
                              <Label htmlFor="business">Business/brand reputation</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="both" id="both" />
                              <Label htmlFor="both">Both personal and business</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="operational_mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operational Mode *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="defensive" id="defensive" />
                              <Label htmlFor="defensive">Defensive (Monitor & protect)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="offensive" id="offensive" />
                              <Label htmlFor="offensive">Offensive (Suppress & counter)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="hybrid" id="hybrid" />
                              <Label htmlFor="hybrid">Hybrid (Comprehensive approach)</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="risk_tolerance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Tolerance *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low - Conservative approach</SelectItem>
                            <SelectItem value="medium">Medium - Balanced approach</SelectItem>
                            <SelectItem value="high">High - Aggressive approach</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="urgency_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Urgency Level *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low - Routine monitoring</SelectItem>
                            <SelectItem value="medium">Medium - Standard response</SelectItem>
                            <SelectItem value="high">High - Priority response</SelectItem>
                            <SelectItem value="critical">Critical - Emergency response</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Concern Areas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">Areas of Concern</h3>
                  
                  <FormField
                    control={form.control}
                    name="concern_areas"
                    render={() => (
                      <FormItem>
                        <FormLabel>Select areas of concern *</FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                          {concernOptions.map((concern) => (
                            <FormField
                              key={concern}
                              control={form.control}
                              name="concern_areas"
                              render={({ field }) => (
                                <FormItem
                                  key={concern}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(concern)}
                                      onCheckedChange={(checked) => {
                                        const value = field.value || [];
                                        if (checked) {
                                          field.onChange([...value, concern]);
                                        } else {
                                          field.onChange(value.filter((item) => item !== concern));
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm">
                                    {concern}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Data Handling */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">Data & Privacy Settings</h3>
                  
                  <FormField
                    control={form.control}
                    name="data_handling_pref"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Handling Preference *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="minimal">Minimal - Essential data only</SelectItem>
                            <SelectItem value="standard">Standard - Balanced approach</SelectItem>
                            <SelectItem value="comprehensive">Comprehensive - Full intelligence gathering</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="designated_contact_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designated Contact Email (if different)</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} className="bg-gray-800 border-gray-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">Additional Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="additional_information"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Context or Special Requirements</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="bg-gray-800 border-gray-600"
                            rows={4}
                            placeholder="Any additional information that would help us understand your situation..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prior_attacks"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Have you experienced coordinated attacks or campaigns before?
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Consent */}
                <div className="border-t border-gray-700 pt-6">
                  <FormField
                    control={form.control}
                    name="consent_to_process"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            I consent to the processing of my personal data for reputation monitoring and protection services *
                          </FormLabel>
                          <FormDescription className="text-xs text-gray-400">
                            By checking this box, you agree to our data processing practices in accordance with GDPR
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="mr-2 h-5 w-5 animate-spin" />
                      Processing Secure Submission...
                    </>
                  ) : (
                    <>
                      <UserCheck className="mr-2 h-5 w-5" />
                      Submit Confidential Assessment
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Confidential & Encrypted</span>
          </div>
          <p>This assessment is protected by attorney-client privilege and end-to-end encryption.</p>
          <p className="mt-1">A.R.I.A™ Intelligence Systems - Strategic Reputation Defense</p>
        </div>
      </div>
    </div>
  );
};

export default ClientIntakePage;
