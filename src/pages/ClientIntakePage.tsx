
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Plus, X } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ClientIntakePage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    brand_or_alias: '',
    focus_scope: 'personal', // personal, business
    operational_mode: 'defensive', // defensive, proactive, comprehensive
    known_aliases: [] as string[],
    topics_to_flag: [] as string[],
    amplification_topics: [] as string[],
    suppression_targets: [] as string[],
    escalation_keywords: [] as string[],
    problematic_platforms: [] as string[],
    content_types_to_remove: [] as string[],
    recent_achievements: '',
    prior_attacks: false,
    data_handling_pref: 'standard', // standard, enhanced, maximum
    designated_contact_email: '',
    consent_to_process: false
  });

  const [newAlias, setNewAlias] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToArray = (field: string, value: string, setValue: (val: string) => void) => {
    if (value.trim() && !(formData[field as keyof typeof formData] as string[]).includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field as keyof typeof prev] as string[]), value.trim()]
      }));
      setValue('');
    }
  };

  const removeFromArray = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent_to_process) {
      toast.error('Please consent to data processing to continue');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('client_intake_submissions')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Intake submission received', {
        description: 'We will process your request and contact you within 24 hours'
      });

      // Reset form
      setFormData({
        full_name: '',
        email: '',
        brand_or_alias: '',
        focus_scope: 'personal',
        operational_mode: 'defensive',
        known_aliases: [],
        topics_to_flag: [],
        amplification_topics: [],
        suppression_targets: [],
        escalation_keywords: [],
        problematic_platforms: [],
        content_types_to_remove: [],
        recent_achievements: '',
        prior_attacks: false,
        data_handling_pref: 'standard',
        designated_contact_email: '',
        consent_to_process: false
      });

    } catch (error) {
      console.error('Error submitting intake:', error);
      toast.error('Failed to submit intake form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>A.R.I.A™ Client Intake - Confidential Reputation Defense</title>
        <meta name="description" content="Secure client intake for A.R.I.A™ reputation management and defense services" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-black text-white py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-corporate-accent mr-3" />
              <h1 className="text-3xl font-bold">A.R.I.A™ Client Intake</h1>
            </div>
            <p className="text-corporate-lightGray">
              Confidential reputation intelligence and defense system configuration
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className="bg-corporate-dark border-corporate-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Eye className="h-5 w-5 text-corporate-accent" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="bg-corporate-darkSecondary border-corporate-border text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-corporate-darkSecondary border-corporate-border text-white"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="brand_or_alias">Primary Brand/Alias</Label>
                  <Input
                    id="brand_or_alias"
                    value={formData.brand_or_alias}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand_or_alias: e.target.value }))}
                    className="bg-corporate-darkSecondary border-corporate-border text-white"
                    placeholder="Main name or brand requiring protection"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Operational Configuration */}
            <Card className="bg-corporate-dark border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white">Operational Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Focus Scope</Label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="focus_scope"
                          value="personal"
                          checked={formData.focus_scope === 'personal'}
                          onChange={(e) => setFormData(prev => ({ ...prev, focus_scope: e.target.value }))}
                          className="mr-2"
                        />
                        Personal
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="focus_scope"
                          value="business"
                          checked={formData.focus_scope === 'business'}
                          onChange={(e) => setFormData(prev => ({ ...prev, focus_scope: e.target.value }))}
                          className="mr-2"
                        />
                        Business
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Operational Mode</Label>
                    <div className="flex gap-4 mt-2 flex-wrap">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="operational_mode"
                          value="defensive"
                          checked={formData.operational_mode === 'defensive'}
                          onChange={(e) => setFormData(prev => ({ ...prev, operational_mode: e.target.value }))}
                          className="mr-2"
                        />
                        Defensive
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="operational_mode"
                          value="proactive"
                          checked={formData.operational_mode === 'proactive'}
                          onChange={(e) => setFormData(prev => ({ ...prev, operational_mode: e.target.value }))}
                          className="mr-2"
                        />
                        Proactive
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="operational_mode"
                          value="comprehensive"
                          checked={formData.operational_mode === 'comprehensive'}
                          onChange={(e) => setFormData(prev => ({ ...prev, operational_mode: e.target.value }))}
                          className="mr-2"
                        />
                        Comprehensive
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keywords and Targets */}
            <Card className="bg-corporate-dark border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white">Keywords & Monitoring Targets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Known Aliases */}
                <div>
                  <Label>Known Aliases</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newAlias}
                      onChange={(e) => setNewAlias(e.target.value)}
                      placeholder="Add alias..."
                      className="bg-corporate-darkSecondary border-corporate-border text-white"
                    />
                    <Button 
                      type="button" 
                      onClick={() => addToArray('known_aliases', newAlias, setNewAlias)}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.known_aliases.map((alias, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {alias}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFromArray('known_aliases', index)} 
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Topics to Flag */}
                <div>
                  <Label>Topics to Flag for Monitoring</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      placeholder="Add topic..."
                      className="bg-corporate-darkSecondary border-corporate-border text-white"
                    />
                    <Button 
                      type="button" 
                      onClick={() => addToArray('topics_to_flag', newTopic, setNewTopic)}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.topics_to_flag.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {topic}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFromArray('topics_to_flag', index)} 
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Escalation Keywords */}
                <div>
                  <Label>Escalation Keywords (High Priority)</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add escalation keyword..."
                      className="bg-corporate-darkSecondary border-corporate-border text-white"
                    />
                    <Button 
                      type="button" 
                      onClick={() => addToArray('escalation_keywords', newKeyword, setNewKeyword)}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.escalation_keywords.map((keyword, index) => (
                      <Badge key={index} variant="destructive" className="gap-1">
                        {keyword}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFromArray('escalation_keywords', index)} 
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Context */}
            <Card className="bg-corporate-dark border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white">Recent Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recent_achievements">Recent Achievements or Positive News</Label>
                  <Textarea
                    id="recent_achievements"
                    value={formData.recent_achievements}
                    onChange={(e) => setFormData(prev => ({ ...prev, recent_achievements: e.target.value }))}
                    className="bg-corporate-darkSecondary border-corporate-border text-white"
                    rows={3}
                    placeholder="Recent positive developments, achievements, or news to amplify..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="prior_attacks"
                    checked={formData.prior_attacks}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, prior_attacks: !!checked }))}
                  />
                  <Label htmlFor="prior_attacks">
                    Previous reputation attacks or negative campaigns
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Consent and Privacy */}
            <Card className="bg-corporate-dark border-corporate-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Lock className="h-5 w-5 text-corporate-accent" />
                  Data Processing Consent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consent_to_process"
                    checked={formData.consent_to_process}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent_to_process: !!checked }))}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="consent_to_process" className="text-sm">
                      I consent to A.R.I.A™ processing my personal data for reputation management services
                    </Label>
                    <p className="text-xs text-corporate-lightGray mt-1">
                      This includes monitoring public platforms, analyzing threats, and implementing defense measures. 
                      Data is processed securely and in compliance with GDPR. You can withdraw consent at any time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.consent_to_process}
              className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90 py-6"
            >
              {isSubmitting ? 'Submitting Secure Intake...' : 'Submit Confidential Intake'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-corporate-lightGray">
            <p>All information is encrypted and handled with maximum security protocols.</p>
            <p className="mt-2">A.R.I.A™ — AI Reputation Intelligence Agent</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientIntakePage;
