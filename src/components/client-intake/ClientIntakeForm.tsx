
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Shield, Eye, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface IntakeFormData {
  full_name: string;
  email: string;
  brand_or_alias: string;
  known_aliases: string[];
  focus_scope: 'personal' | 'business' | 'both';
  topics_to_flag: string[];
  prior_attacks: boolean;
  problematic_platforms: string[];
  suppression_targets: string[];
  content_types_to_remove: string[];
  amplification_topics: string[];
  recent_achievements: string;
  data_handling_pref: 'air_gapped' | 'cloud_accessible';
  operational_mode: 'stealth' | 'amplification';
  escalation_keywords: string[];
  designated_contact_email: string;
  consent_to_process: boolean;
}

const ClientIntakeForm: React.FC = () => {
  const [formData, setFormData] = useState<IntakeFormData>({
    full_name: '',
    email: '',
    brand_or_alias: '',
    known_aliases: [],
    focus_scope: 'personal',
    topics_to_flag: [],
    prior_attacks: false,
    problematic_platforms: [],
    suppression_targets: [],
    content_types_to_remove: [],
    amplification_topics: [],
    recent_achievements: '',
    data_handling_pref: 'cloud_accessible',
    operational_mode: 'stealth',
    escalation_keywords: [],
    designated_contact_email: '',
    consent_to_process: false
  });

  const [newInput, setNewInput] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToArray = (field: keyof IntakeFormData, value: string) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()]
    }));
    setNewInput(prev => ({ ...prev, [field]: '' }));
  };

  const removeFromArray = (field: keyof IntakeFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent_to_process) {
      toast.error('You must consent to data processing to proceed');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('client_intake_submissions')
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          brand_or_alias: formData.brand_or_alias || null,
          known_aliases: formData.known_aliases.length > 0 ? formData.known_aliases : null,
          focus_scope: formData.focus_scope,
          topics_to_flag: formData.topics_to_flag.length > 0 ? formData.topics_to_flag : null,
          prior_attacks: formData.prior_attacks,
          problematic_platforms: formData.problematic_platforms.length > 0 ? formData.problematic_platforms : null,
          suppression_targets: formData.suppression_targets.length > 0 ? formData.suppression_targets : null,
          content_types_to_remove: formData.content_types_to_remove.length > 0 ? formData.content_types_to_remove : null,
          amplification_topics: formData.amplification_topics.length > 0 ? formData.amplification_topics : null,
          recent_achievements: formData.recent_achievements || null,
          data_handling_pref: formData.data_handling_pref,
          operational_mode: formData.operational_mode,
          escalation_keywords: formData.escalation_keywords.length > 0 ? formData.escalation_keywords : null,
          designated_contact_email: formData.designated_contact_email || null,
          consent_to_process: formData.consent_to_process
        });

      if (error) {
        throw error;
      }

      toast.success('🎯 Intake submission successful! Your profile has been added to A.R.I.A™ for processing.', {
        description: 'Our team will begin monitoring and scanning based on your specifications.'
      });

      // Reset form
      setFormData({
        full_name: '',
        email: '',
        brand_or_alias: '',
        known_aliases: [],
        focus_scope: 'personal',
        topics_to_flag: [],
        prior_attacks: false,
        problematic_platforms: [],
        suppression_targets: [],
        content_types_to_remove: [],
        amplification_topics: [],
        recent_achievements: '',
        data_handling_pref: 'cloud_accessible',
        operational_mode: 'stealth',
        escalation_keywords: [],
        designated_contact_email: '',
        consent_to_process: false
      });

    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ArrayInput = ({ 
    label, 
    field, 
    placeholder, 
    icon: Icon 
  }: { 
    label: string; 
    field: keyof IntakeFormData; 
    placeholder: string; 
    icon: React.ComponentType<any>;
  }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          value={newInput[field] || ''}
          onChange={(e) => setNewInput(prev => ({ ...prev, [field]: e.target.value }))}
          placeholder={placeholder}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addToArray(field, newInput[field] || '');
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => addToArray(field, newInput[field] || '')}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(formData[field] as string[]).map((item, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {item}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => removeFromArray(field, index)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-corporate-dark text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-corporate-accent" />
              A.R.I.A™ Client Intake Form
            </CardTitle>
            <p className="text-corporate-lightGray text-center">
              Secure onboarding for reputation intelligence and monitoring services
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Identity & Contact */}
              <Card className="bg-corporate-dark border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-lg">Identity & Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        required
                        className="bg-corporate-darkSecondary border-corporate-border text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="bg-corporate-darkSecondary border-corporate-border text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="brand_or_alias">Brand/Business Name (if different from full name)</Label>
                    <Input
                      id="brand_or_alias"
                      value={formData.brand_or_alias}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand_or_alias: e.target.value }))}
                      className="bg-corporate-darkSecondary border-corporate-border text-white"
                    />
                  </div>
                  <ArrayInput
                    label="Known Aliases"
                    field="known_aliases"
                    placeholder="Add alias or alternative name"
                    icon={Target}
                  />
                </CardContent>
              </Card>

              {/* Coverage Scope */}
              <Card className="bg-corporate-dark border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-lg">Coverage Scope</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Focus Scope</Label>
                    <RadioGroup
                      value={formData.focus_scope}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, focus_scope: value as any }))}
                      className="flex gap-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="personal" id="personal" />
                        <Label htmlFor="personal">Personal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="business" id="business" />
                        <Label htmlFor="business">Business</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both">Both</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <ArrayInput
                    label="Topics to Flag"
                    field="topics_to_flag"
                    placeholder="Add topic or keyword to monitor"
                    icon={Eye}
                  />
                </CardContent>
              </Card>

              {/* Threat Detection */}
              <Card className="bg-corporate-dark border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-lg">Threat Detection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="prior_attacks"
                      checked={formData.prior_attacks}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, prior_attacks: checked as boolean }))}
                    />
                    <Label htmlFor="prior_attacks">Have you experienced prior reputation attacks?</Label>
                  </div>
                  <ArrayInput
                    label="Problematic Platforms"
                    field="problematic_platforms"
                    placeholder="Add platform name"
                    icon={Shield}
                  />
                </CardContent>
              </Card>

              {/* Clean-Up Targets */}
              <Card className="bg-corporate-dark border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-lg">Clean-Up Targets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ArrayInput
                    label="Suppression Targets"
                    field="suppression_targets"
                    placeholder="Add URL, article name, or content to suppress"
                    icon={Target}
                  />
                  <ArrayInput
                    label="Content Types to Remove"
                    field="content_types_to_remove"
                    placeholder="Add content type (e.g., reviews, articles, posts)"
                    icon={X}
                  />
                </CardContent>
              </Card>

              {/* Reputation Goals */}
              <Card className="bg-corporate-dark border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-lg">Reputation Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ArrayInput
                    label="Amplification Topics"
                    field="amplification_topics"
                    placeholder="Add topic to amplify or promote"
                    icon={Target}
                  />
                  <div>
                    <Label htmlFor="recent_achievements">Recent Achievements</Label>
                    <Textarea
                      id="recent_achievements"
                      value={formData.recent_achievements}
                      onChange={(e) => setFormData(prev => ({ ...prev, recent_achievements: e.target.value }))}
                      placeholder="Describe recent achievements, awards, or positive developments"
                      className="bg-corporate-darkSecondary border-corporate-border text-white"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy & Preferences */}
              <Card className="bg-corporate-dark border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-lg">Privacy & Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Data Handling Preference</Label>
                    <RadioGroup
                      value={formData.data_handling_pref}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, data_handling_pref: value as any }))}
                      className="flex gap-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="air_gapped" id="air_gapped" />
                        <Label htmlFor="air_gapped">Air-Gapped (Maximum Security)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cloud_accessible" id="cloud_accessible" />
                        <Label htmlFor="cloud_accessible">Cloud Accessible</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label>Operational Mode</Label>
                    <RadioGroup
                      value={formData.operational_mode}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, operational_mode: value as any }))}
                      className="flex gap-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="stealth" id="stealth" />
                        <Label htmlFor="stealth">Stealth (Discrete monitoring)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="amplification" id="amplification" />
                        <Label htmlFor="amplification">Amplification (Active promotion)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Sensitivity & Escalation */}
              <Card className="bg-corporate-dark border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-lg">Sensitivity & Escalation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ArrayInput
                    label="Escalation Keywords"
                    field="escalation_keywords"
                    placeholder="Add keyword that requires immediate escalation"
                    icon={Shield}
                  />
                  <div>
                    <Label htmlFor="designated_contact_email">Designated Contact Email (for urgent matters)</Label>
                    <Input
                      id="designated_contact_email"
                      type="email"
                      value={formData.designated_contact_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, designated_contact_email: e.target.value }))}
                      className="bg-corporate-darkSecondary border-corporate-border text-white"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* GDPR Consent */}
              <Card className="bg-corporate-dark border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-lg">Legal & GDPR Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="consent_to_process"
                      checked={formData.consent_to_process}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent_to_process: checked as boolean }))}
                      className="mt-1"
                    />
                    <Label htmlFor="consent_to_process" className="text-sm leading-relaxed">
                      I consent to the processing of my personal data by A.R.I.A™ for reputation monitoring, 
                      intelligence gathering, and protective services. I understand this includes monitoring 
                      public platforms, analyzing content, and creating reports. I have the right to access, 
                      rectify, or delete my data at any time by contacting the designated contact email. *
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                disabled={!formData.consent_to_process || isSubmitting}
                className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90 py-3 text-lg"
              >
                {isSubmitting ? 'Processing...' : 'Submit to A.R.I.A™ System'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientIntakeForm;
