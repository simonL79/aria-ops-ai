
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

const ClientIntakePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    brandOrAlias: '',
    focusScope: '',
    operationalMode: '',
    knownAliases: [] as string[],
    priorAttacks: false,
    topicsToFlag: [] as string[],
    amplificationTopics: [] as string[],
    suppressionTargets: [] as string[],
    escalationKeywords: [] as string[],
    problematicPlatforms: [] as string[],
    contentTypesToRemove: [] as string[],
    recentAchievements: '',
    dataHandlingPref: '',
    designatedContactEmail: '',
    consentToProcess: false
  });

  const [newAlias, setNewAlias] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newAmplificationTopic, setNewAmplificationTopic] = useState('');
  const [newSuppressionTarget, setNewSuppressionTarget] = useState('');
  const [newEscalationKeyword, setNewEscalationKeyword] = useState('');
  const [newProblematicPlatform, setNewProblematicPlatform] = useState('');
  const [newContentType, setNewContentType] = useState('');

  const addToArray = (field: string, value: string, setValue: (value: string) => void) => {
    if (value.trim() && !formData[field as keyof typeof formData].includes(value.trim())) {
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
    
    if (!formData.consentToProcess) {
      toast.error("GDPR consent is required to proceed");
      return;
    }

    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('client_intake_submissions')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          brand_or_alias: formData.brandOrAlias || null,
          focus_scope: formData.focusScope || null,
          operational_mode: formData.operationalMode || null,
          known_aliases: formData.knownAliases.length > 0 ? formData.knownAliases : null,
          prior_attacks: formData.priorAttacks,
          topics_to_flag: formData.topicsToFlag.length > 0 ? formData.topicsToFlag : null,
          amplification_topics: formData.amplificationTopics.length > 0 ? formData.amplificationTopics : null,
          suppression_targets: formData.suppressionTargets.length > 0 ? formData.suppressionTargets : null,
          escalation_keywords: formData.escalationKeywords.length > 0 ? formData.escalationKeywords : null,
          problematic_platforms: formData.problematicPlatforms.length > 0 ? formData.problematicPlatforms : null,
          content_types_to_remove: formData.contentTypesToRemove.length > 0 ? formData.contentTypesToRemove : null,
          recent_achievements: formData.recentAchievements || null,
          data_handling_pref: formData.dataHandlingPref || null,
          designated_contact_email: formData.designatedContactEmail || null,
          consent_to_process: formData.consentToProcess
        });

      if (error) {
        console.error('Submission error:', error);
        toast.error("Failed to submit intake form. Please try again.");
        return;
      }

      toast.success("Intake form submitted successfully!");
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        brandOrAlias: '',
        focusScope: '',
        operationalMode: '',
        knownAliases: [],
        priorAttacks: false,
        topicsToFlag: [],
        amplificationTopics: [],
        suppressionTargets: [],
        escalationKeywords: [],
        problematicPlatforms: [],
        contentTypesToRemove: [],
        recentAchievements: '',
        dataHandlingPref: '',
        designatedContactEmail: '',
        consentToProcess: false
      });

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Client Intake - A.R.I.A™ Reputation Security Intelligence</title>
        <meta name="description" content="Secure client intake form for A.R.I.A™ reputation management services" />
      </Helmet>
      
      <div className="min-h-screen bg-corporate-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Shield className="h-16 w-16 text-corporate-accent mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">
                A.R.I.A™ Client Intake
              </h1>
              <p className="text-corporate-lightGray">
                Secure intake form for reputation management services
              </p>
            </div>

            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white">Client Information & Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="text-white">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="bg-corporate-dark border-corporate-border text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-corporate-dark border-corporate-border text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="brandOrAlias" className="text-white">Brand/Alias</Label>
                      <Input
                        id="brandOrAlias"
                        value={formData.brandOrAlias}
                        onChange={(e) => setFormData(prev => ({ ...prev, brandOrAlias: e.target.value }))}
                        className="bg-corporate-dark border-corporate-border text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="focusScope" className="text-white">Focus Scope</Label>
                      <Select value={formData.focusScope} onValueChange={(value) => setFormData(prev => ({ ...prev, focusScope: value }))}>
                        <SelectTrigger className="bg-corporate-dark border-corporate-border text-white">
                          <SelectValue placeholder="Select focus scope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Known Aliases */}
                  <div>
                    <Label className="text-white">Known Aliases</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newAlias}
                        onChange={(e) => setNewAlias(e.target.value)}
                        placeholder="Add alias..."
                        className="bg-corporate-dark border-corporate-border text-white"
                      />
                      <Button 
                        type="button" 
                        onClick={() => addToArray('knownAliases', newAlias, setNewAlias)}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.knownAliases.map((alias, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {alias}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('knownAliases', index)} />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Prior Attacks */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="priorAttacks"
                      checked={formData.priorAttacks}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, priorAttacks: !!checked }))}
                    />
                    <Label htmlFor="priorAttacks" className="text-white">
                      Have you experienced prior reputation attacks?
                    </Label>
                  </div>

                  {/* Topics to Flag */}
                  <div>
                    <Label className="text-white">Topics to Flag</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        placeholder="Add topic to monitor..."
                        className="bg-corporate-dark border-corporate-border text-white"
                      />
                      <Button 
                        type="button" 
                        onClick={() => addToArray('topicsToFlag', newTopic, setNewTopic)}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.topicsToFlag.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {topic}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('topicsToFlag', index)} />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Recent Achievements */}
                  <div>
                    <Label htmlFor="recentAchievements" className="text-white">Recent Achievements</Label>
                    <Textarea
                      id="recentAchievements"
                      value={formData.recentAchievements}
                      onChange={(e) => setFormData(prev => ({ ...prev, recentAchievements: e.target.value }))}
                      className="bg-corporate-dark border-corporate-border text-white"
                      rows={3}
                    />
                  </div>

                  {/* GDPR Consent */}
                  <div className="bg-corporate-dark p-4 rounded border border-corporate-border">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="consentToProcess"
                        checked={formData.consentToProcess}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consentToProcess: !!checked }))}
                      />
                      <div>
                        <Label htmlFor="consentToProcess" className="text-white font-medium">
                          GDPR Consent Required *
                        </Label>
                        <p className="text-corporate-lightGray text-sm mt-1">
                          I consent to the processing of my personal data for reputation management services 
                          in accordance with GDPR regulations. This data will be used solely for providing 
                          the requested services and will be handled according to our privacy policy.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-6">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !formData.consentToProcess}
                      className="bg-corporate-accent text-black hover:bg-corporate-accent/90 px-8 py-3"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Intake Form'}
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
