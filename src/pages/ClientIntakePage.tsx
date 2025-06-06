
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ClientIntakePage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    brandOrAlias: '',
    focusScope: '',
    operationalMode: '',
    knownAliases: [] as string[],
    concernAreas: [] as string[],
    riskTolerance: '',
    urgencyLevel: '',
    additionalInfo: '',
    consentToProcess: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.focusScope) newErrors.focusScope = 'Focus scope is required';
    if (!formData.operationalMode) newErrors.operationalMode = 'Operational mode is required';
    if (!formData.riskTolerance) newErrors.riskTolerance = 'Risk tolerance is required';
    if (!formData.urgencyLevel) newErrors.urgencyLevel = 'Urgency level is required';
    if (!formData.consentToProcess) newErrors.consentToProcess = 'GDPR consent is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayInput = (field: 'knownAliases' | 'concernAreas', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    handleInputChange(field, items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('client_intake_submissions')
        .insert([{
          full_name: formData.fullName,
          email: formData.email,
          brand_or_alias: formData.brandOrAlias || null,
          focus_scope: formData.focusScope,
          operational_mode: formData.operationalMode,
          known_aliases: formData.knownAliases.length > 0 ? formData.knownAliases : null,
          concern_areas: formData.concernAreas.length > 0 ? formData.concernAreas : null,
          risk_tolerance: formData.riskTolerance,
          urgency_level: formData.urgencyLevel,
          additional_information: formData.additionalInfo || null,
          consent_to_process: formData.consentToProcess,
          status: 'pending'
        }])
        .select();

      if (error) {
        console.error('Submission error:', error);
        toast.error('Failed to submit intake form. Please try again.');
        return;
      }

      toast.success('Intake form submitted successfully! We will contact you soon.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        brandOrAlias: '',
        focusScope: '',
        operationalMode: '',
        knownAliases: [],
        concernAreas: [],
        riskTolerance: '',
        urgencyLevel: '',
        additionalInfo: '',
        consentToProcess: false,
      });

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const concernOptions = [
    'Reputation Management',
    'Legal Issues',
    'Financial Concerns',
    'Personal Safety',
    'Business Competition',
    'Media Relations',
    'Online Threats',
    'Identity Protection'
  ];

  return (
    <>
      <Helmet>
        <title>Client Intake - A.R.I.A™ Private Intelligence</title>
        <meta name="description" content="Secure client intake form for A.R.I.A™ intelligence services" />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-corporate-accent" />
                <h1 className="text-3xl font-bold">A.R.I.A™ Client Intake</h1>
              </div>
              <p className="text-corporate-lightGray">
                Secure intake process for intelligence and reputation management services
              </p>
            </div>

            <Card className="bg-corporate-dark border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Confidential Information Collection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="text-white">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`bg-corporate-darkSecondary border-corporate-border text-white ${
                          errors.fullName ? 'border-red-500' : ''
                        }`}
                        placeholder="Your full name"
                      />
                      {errors.fullName && (
                        <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`bg-corporate-darkSecondary border-corporate-border text-white ${
                          errors.email ? 'border-red-500' : ''
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Brand/Alias Information */}
                  <div>
                    <Label htmlFor="brandOrAlias" className="text-white">
                      Brand, Company, or Alias (if different from name)
                    </Label>
                    <Input
                      id="brandOrAlias"
                      value={formData.brandOrAlias}
                      onChange={(e) => handleInputChange('brandOrAlias', e.target.value)}
                      className="bg-corporate-darkSecondary border-corporate-border text-white"
                      placeholder="Brand name, company, or known alias"
                    />
                  </div>

                  {/* Focus and Mode */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="focusScope" className="text-white">
                        Focus Scope *
                      </Label>
                      <Select 
                        value={formData.focusScope} 
                        onValueChange={(value) => handleInputChange('focusScope', value)}
                      >
                        <SelectTrigger className={`bg-corporate-darkSecondary border-corporate-border text-white ${
                          errors.focusScope ? 'border-red-500' : ''
                        }`}>
                          <SelectValue placeholder="Select focus area" />
                        </SelectTrigger>
                        <SelectContent className="bg-corporate-dark border-corporate-border">
                          <SelectItem value="personal">Personal Reputation</SelectItem>
                          <SelectItem value="business">Business/Corporate</SelectItem>
                          <SelectItem value="both">Personal & Business</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.focusScope && (
                        <p className="text-red-400 text-sm mt-1">{errors.focusScope}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="operationalMode" className="text-white">
                        Operational Mode *
                      </Label>
                      <Select 
                        value={formData.operationalMode} 
                        onValueChange={(value) => handleInputChange('operationalMode', value)}
                      >
                        <SelectTrigger className={`bg-corporate-darkSecondary border-corporate-border text-white ${
                          errors.operationalMode ? 'border-red-500' : ''
                        }`}>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent className="bg-corporate-dark border-corporate-border">
                          <SelectItem value="monitoring">Monitoring Only</SelectItem>
                          <SelectItem value="defensive">Defensive Actions</SelectItem>
                          <SelectItem value="offensive">Offensive Operations</SelectItem>
                          <SelectItem value="comprehensive">Full Spectrum</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.operationalMode && (
                        <p className="text-red-400 text-sm mt-1">{errors.operationalMode}</p>
                      )}
                    </div>
                  </div>

                  {/* Known Aliases */}
                  <div>
                    <Label htmlFor="knownAliases" className="text-white">
                      Known Aliases or Variations
                    </Label>
                    <Input
                      id="knownAliases"
                      value={formData.knownAliases.join(', ')}
                      onChange={(e) => handleArrayInput('knownAliases', e.target.value)}
                      className="bg-corporate-darkSecondary border-corporate-border text-white"
                      placeholder="Enter aliases separated by commas"
                    />
                    <p className="text-sm text-corporate-lightGray mt-1">
                      Include nicknames, business names, social media handles, etc.
                    </p>
                  </div>

                  {/* Concern Areas */}
                  <div>
                    <Label className="text-white mb-3 block">Areas of Concern</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {concernOptions.map((concern) => (
                        <div key={concern} className="flex items-center space-x-2">
                          <Checkbox
                            id={concern}
                            checked={formData.concernAreas.includes(concern)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleInputChange('concernAreas', [...formData.concernAreas, concern]);
                              } else {
                                handleInputChange('concernAreas', formData.concernAreas.filter(c => c !== concern));
                              }
                            }}
                            className="border-corporate-border"
                          />
                          <Label
                            htmlFor={concern}
                            className="text-sm text-white cursor-pointer"
                          >
                            {concern}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk and Urgency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="riskTolerance" className="text-white">
                        Risk Tolerance *
                      </Label>
                      <Select 
                        value={formData.riskTolerance} 
                        onValueChange={(value) => handleInputChange('riskTolerance', value)}
                      >
                        <SelectTrigger className={`bg-corporate-darkSecondary border-corporate-border text-white ${
                          errors.riskTolerance ? 'border-red-500' : ''
                        }`}>
                          <SelectValue placeholder="Select risk tolerance" />
                        </SelectTrigger>
                        <SelectContent className="bg-corporate-dark border-corporate-border">
                          <SelectItem value="conservative">Conservative</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="aggressive">Aggressive</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.riskTolerance && (
                        <p className="text-red-400 text-sm mt-1">{errors.riskTolerance}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="urgencyLevel" className="text-white">
                        Urgency Level *
                      </Label>
                      <Select 
                        value={formData.urgencyLevel} 
                        onValueChange={(value) => handleInputChange('urgencyLevel', value)}
                      >
                        <SelectTrigger className={`bg-corporate-darkSecondary border-corporate-border text-white ${
                          errors.urgencyLevel ? 'border-red-500' : ''
                        }`}>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent className="bg-corporate-dark border-corporate-border">
                          <SelectItem value="routine">Routine</SelectItem>
                          <SelectItem value="priority">Priority</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.urgencyLevel && (
                        <p className="text-red-400 text-sm mt-1">{errors.urgencyLevel}</p>
                      )}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <Label htmlFor="additionalInfo" className="text-white">
                      Additional Information
                    </Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                      className="bg-corporate-darkSecondary border-corporate-border text-white"
                      placeholder="Any specific threats, incidents, or additional context..."
                      rows={4}
                    />
                  </div>

                  {/* GDPR Consent */}
                  <div className="border border-corporate-border rounded-lg p-4 bg-corporate-darkSecondary">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="gdprConsent"
                        checked={formData.consentToProcess}
                        onCheckedChange={(checked) => handleInputChange('consentToProcess', checked as boolean)}
                        className={`mt-1 ${errors.consentToProcess ? 'border-red-500' : 'border-corporate-border'}`}
                      />
                      <div className="flex-1">
                        <Label htmlFor="gdprConsent" className="text-white cursor-pointer">
                          Data Processing Consent *
                        </Label>
                        <p className="text-sm text-corporate-lightGray mt-1">
                          I consent to the processing of my personal data for the purpose of intelligence 
                          and reputation management services. I understand that this data will be handled 
                          in accordance with GDPR regulations and the company's privacy policy.
                        </p>
                        {errors.consentToProcess && (
                          <p className="text-red-400 text-sm mt-1">{errors.consentToProcess}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-center pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-corporate-accent text-black hover:bg-corporate-accent/90 px-8 py-3"
                    >
                      {isSubmitting ? (
                        <>
                          <AlertTriangle className="h-4 w-4 mr-2 animate-spin" />
                          Submitting Securely...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Submit Intake Form
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientIntakePage;
