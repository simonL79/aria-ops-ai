
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Lock, UserCheck, Zap } from 'lucide-react';

interface SecureIntakeFormData {
  client_name: string;
  contact_email: string;
  phone_number: string;
  reputation_context: {
    goal: string;
    entity_type: string;
    target_keywords: string[];
    public_handles: string[];
    threat_description: string;
    urgency_level: string;
    budget_range: string;
    timeline: string;
  };
  verification_method: string;
  gdpr_consent_given: boolean;
  data_processing_consent: boolean;
}

const SecureIntakeForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SecureIntakeFormData>({
    client_name: '',
    contact_email: '',
    phone_number: '',
    reputation_context: {
      goal: '',
      entity_type: '',
      target_keywords: [],
      public_handles: [],
      threat_description: '',
      urgency_level: '',
      budget_range: '',
      timeline: ''
    },
    verification_method: 'standard',
    gdpr_consent_given: false,
    data_processing_consent: false
  });

  const updateFormData = (field: keyof SecureIntakeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateReputationContext = (field: keyof SecureIntakeFormData['reputation_context'], value: any) => {
    setFormData(prev => ({
      ...prev,
      reputation_context: {
        ...prev.reputation_context,
        [field]: value
      }
    }));
  };

  const handleKeywordChange = (value: string) => {
    const keywords = value.split(',').map(k => k.trim()).filter(k => k.length > 0);
    updateReputationContext('target_keywords', keywords);
  };

  const handleHandlesChange = (value: string) => {
    const handles = value.split(',').map(h => h.trim()).filter(h => h.length > 0);
    updateReputationContext('public_handles', handles);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.client_name || !formData.contact_email) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (!formData.gdpr_consent_given || !formData.data_processing_consent) {
        toast.error('Please accept the required consent agreements');
        return;
      }

      console.log('Submitting A.R.I.A™ intake:', formData);

      const { data, error } = await supabase
        .from('aria_client_intakes')
        .insert({
          client_name: formData.client_name,
          contact_email: formData.contact_email,
          phone_number: formData.phone_number || null,
          reputation_context: formData.reputation_context,
          verification_method: formData.verification_method,
          gdpr_consent_given: formData.gdpr_consent_given,
          data_processing_consent: formData.data_processing_consent,
          intake_status: 'pending_verification',
          submission_source: 'secure_intake_form'
        })
        .select();

      if (error) {
        console.error('A.R.I.A™ intake submission error:', error);
        toast.error(`Submission failed: ${error.message}`);
        return;
      }

      console.log('A.R.I.A™ intake submitted successfully:', data);
      toast.success('A.R.I.A™ intake submitted successfully! Our team will contact you within 4 hours.');
      
      // Reset form
      setFormData({
        client_name: '',
        contact_email: '',
        phone_number: '',
        reputation_context: {
          goal: '',
          entity_type: '',
          target_keywords: [],
          public_handles: [],
          threat_description: '',
          urgency_level: '',
          budget_range: '',
          timeline: ''
        },
        verification_method: 'standard',
        gdpr_consent_given: false,
        data_processing_consent: false
      });
      setStep(1);

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Client Information</h3>
        <p className="text-muted-foreground">Secure identity verification and contact details</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="client_name">Full Name / Organization *</Label>
          <Input
            id="client_name"
            value={formData.client_name}
            onChange={(e) => updateFormData('client_name', e.target.value)}
            placeholder="Enter your full name or organization"
            required
          />
        </div>

        <div>
          <Label htmlFor="contact_email">Contact Email *</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => updateFormData('contact_email', e.target.value)}
            placeholder="your.email@domain.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={(e) => updateFormData('phone_number', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <Label>Entity Type</Label>
          <Select value={formData.reputation_context.entity_type} onValueChange={(value) => updateReputationContext('entity_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select entity type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="person">Individual Person</SelectItem>
              <SelectItem value="organization">Organization/Company</SelectItem>
              <SelectItem value="brand">Brand/Product</SelectItem>
              <SelectItem value="executive">Executive/Leadership</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Reputation Context</h3>
        <p className="text-muted-foreground">Define your reputation management objectives</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="goal">Primary Goal</Label>
          <Textarea
            id="goal"
            value={formData.reputation_context.goal}
            onChange={(e) => updateReputationContext('goal', e.target.value)}
            placeholder="Describe what you want to achieve with reputation management..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="target_keywords">Target Keywords</Label>
          <Input
            id="target_keywords"
            value={formData.reputation_context.target_keywords.join(', ')}
            onChange={(e) => handleKeywordChange(e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
          />
          <p className="text-xs text-muted-foreground mt-1">Separate multiple keywords with commas</p>
        </div>

        <div>
          <Label htmlFor="public_handles">Public Handles/Usernames</Label>
          <Input
            id="public_handles"
            value={formData.reputation_context.public_handles.join(', ')}
            onChange={(e) => handleHandlesChange(e.target.value)}
            placeholder="@username, @handle2, profile-name"
          />
          <p className="text-xs text-muted-foreground mt-1">Social media handles, LinkedIn profiles, etc.</p>
        </div>

        <div>
          <Label htmlFor="threat_description">Threat Description</Label>
          <Textarea
            id="threat_description"
            value={formData.reputation_context.threat_description}
            onChange={(e) => updateReputationContext('threat_description', e.target.value)}
            placeholder="Describe any specific reputation threats or concerns..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Urgency Level</Label>
            <Select value={formData.reputation_context.urgency_level} onValueChange={(value) => updateReputationContext('urgency_level', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Preventive monitoring</SelectItem>
                <SelectItem value="medium">Medium - Active management needed</SelectItem>
                <SelectItem value="high">High - Immediate attention required</SelectItem>
                <SelectItem value="critical">Critical - Emergency response</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Timeline</Label>
            <Select value={formData.reputation_context.timeline} onValueChange={(value) => updateReputationContext('timeline', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate (24-48 hours)</SelectItem>
                <SelectItem value="urgent">Urgent (1 week)</SelectItem>
                <SelectItem value="standard">Standard (2-4 weeks)</SelectItem>
                <SelectItem value="ongoing">Ongoing campaign</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Security & Consent</h3>
        <p className="text-muted-foreground">Verification method and legal agreements</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Verification Method</Label>
          <Select value={formData.verification_method} onValueChange={(value) => updateFormData('verification_method', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select verification method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Email Verification</SelectItem>
              <SelectItem value="enhanced">Enhanced Identity Verification</SelectItem>
              <SelectItem value="corporate">Corporate Domain Verification</SelectItem>
              <SelectItem value="executive">Executive Background Check</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="gdpr_consent"
              checked={formData.gdpr_consent_given}
              onCheckedChange={(checked) => updateFormData('gdpr_consent_given', !!checked)}
            />
            <Label htmlFor="gdpr_consent" className="text-sm leading-relaxed">
              I consent to the processing of my personal data in accordance with GDPR regulations and understand my rights regarding data protection. *
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="data_processing_consent"
              checked={formData.data_processing_consent}
              onCheckedChange={(checked) => updateFormData('data_processing_consent', !!checked)}
            />
            <Label htmlFor="data_processing_consent" className="text-sm leading-relaxed">
              I authorize A.R.I.A™ to process and analyze publicly available information related to my reputation management objectives. *
            </Label>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Security Notice</h4>
          <p className="text-sm text-blue-800">
            Your submission will be encrypted and processed through our secure intake system. 
            Our team will verify your identity before proceeding with any reputation management activities.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">A.R.I.A™ Secure Intake</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced Reputation Intelligence & Analysis - Confidential client onboarding for enterprise reputation management
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber === 1 && <UserCheck className="h-4 w-4" />}
                  {stepNumber === 2 && <Zap className="h-4 w-4" />}
                  {stepNumber === 3 && <Lock className="h-4 w-4" />}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-0.5 transition-colors ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Step {step} of 3: {step === 1 ? 'Identity' : step === 2 ? 'Context' : 'Security'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Previous
              </Button>

              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && (!formData.client_name || !formData.contact_email)) ||
                    (step === 2 && !formData.reputation_context.goal)
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.gdpr_consent_given || !formData.data_processing_consent}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Secure Intake'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecureIntakeForm;
