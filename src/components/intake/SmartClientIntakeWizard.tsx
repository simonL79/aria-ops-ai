
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shield, Bot, User, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { LiveEntityValidator } from './LiveEntityValidator';
import { AliasGenerator } from './AliasGenerator';
import { SmartFieldAutofill } from './SmartFieldAutofill';
import { supabase } from '@/integrations/supabase/client';

interface ClientData {
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  website: string;
  notes: string;
  keywordTargets: string;
  aliases: string[];
  entityValidation: {
    isValid: boolean;
    confidence: number;
    sources: string[];
  };
}

const SmartClientIntakeWizard = () => {
  const [isManualMode, setIsManualMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientData, setClientData] = useState<ClientData>({
    name: '',
    industry: '',
    contactName: '',
    contactEmail: '',
    website: '',
    notes: '',
    keywordTargets: '',
    aliases: [],
    entityValidation: {
      isValid: false,
      confidence: 0,
      sources: []
    }
  });

  const updateClientData = (field: keyof ClientData, value: any) => {
    setClientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEntityValidation = (validation: any) => {
    updateClientData('entityValidation', validation);
  };

  const handleAliasesGenerated = (aliases: string[]) => {
    updateClientData('aliases', aliases);
    updateClientData('keywordTargets', aliases.join(', '));
  };

  const handleSmartAutofill = (suggestions: any) => {
    if (!isManualMode && suggestions) {
      if (suggestions.industry) updateClientData('industry', suggestions.industry);
      if (suggestions.website) updateClientData('website', suggestions.website);
    }
  };

  const toggleManualMode = () => {
    setIsManualMode(!isManualMode);
    toast.info(
      isManualMode ? 'Smart automation enabled' : 'Manual override activated',
      {
        description: isManualMode 
          ? 'A.R.I.A™ will assist with live data validation'
          : 'Full manual control - no automation'
      }
    );
  };

  const handleSubmit = async () => {
    if (!clientData.name || !clientData.contactEmail) {
      toast.error('Please fill in required fields');
      return;
    }

    if (!isManualMode && !clientData.entityValidation.isValid) {
      toast.error('Entity validation required', {
        description: 'Switch to manual mode or validate entity existence'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: clientData.name,
          industry: clientData.industry,
          contactname: clientData.contactName,
          contactemail: clientData.contactEmail,
          website: clientData.website || null,
          notes: clientData.notes || null,
          keywordtargets: clientData.keywordTargets || null,
          client_type: 'brand',
          eidetic_enabled: true
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Client intake completed successfully!', {
        description: `${clientData.name} added to A.R.I.A™ monitoring system`
      });

      // Reset form
      setClientData({
        name: '',
        industry: '',
        contactName: '',
        contactEmail: '',
        website: '',
        notes: '',
        keywordTargets: '',
        aliases: [],
        entityValidation: { isValid: false, confidence: 0, sources: [] }
      });
      setCurrentStep(1);

    } catch (error) {
      console.error('Client intake error:', error);
      toast.error('Failed to complete intake', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>A.R.I.A™ Smart Client Intake</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {isManualMode ? 'Manual Override Mode' : 'Live Data Validation Mode'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={isManualMode ? 'destructive' : 'default'}>
                {isManualMode ? <User className="h-3 w-3 mr-1" /> : <Bot className="h-3 w-3 mr-1" />}
                {isManualMode ? 'Manual' : 'Smart'}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleManualMode}
              >
                {isManualMode ? 'Enable Smart Mode' : 'Manual Override'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Client Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Client/Entity Name *</Label>
                <Input
                  id="name"
                  value={clientData.name}
                  onChange={(e) => updateClientData('name', e.target.value)}
                  placeholder="Enter client or entity name"
                />
              </div>
              
              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={clientData.contactEmail}
                  onChange={(e) => updateClientData('contactEmail', e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>
            </div>

            {/* Live Entity Validation */}
            {!isManualMode && clientData.name && (
              <LiveEntityValidator
                entityName={clientData.name}
                onValidation={handleEntityValidation}
              />
            )}

            {/* Smart Field Autofill */}
            {!isManualMode && clientData.name && (
              <SmartFieldAutofill
                entityName={clientData.name}
                onSuggestions={handleSmartAutofill}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Contact Person</Label>
                <Input
                  id="contactName"
                  value={clientData.contactName}
                  onChange={(e) => updateClientData('contactName', e.target.value)}
                  placeholder="Primary contact name"
                />
              </div>
              
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={clientData.industry}
                  onChange={(e) => updateClientData('industry', e.target.value)}
                  placeholder="e.g., Technology, Healthcare"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={clientData.website}
                onChange={(e) => updateClientData('website', e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            {/* Alias Generator */}
            {!isManualMode && clientData.name && (
              <AliasGenerator
                entityName={clientData.name}
                onAliasesGenerated={handleAliasesGenerated}
              />
            )}

            <div>
              <Label htmlFor="keywordTargets">Monitoring Keywords</Label>
              <Textarea
                id="keywordTargets"
                value={clientData.keywordTargets}
                onChange={(e) => updateClientData('keywordTargets', e.target.value)}
                placeholder="Keywords for monitoring (auto-generated from aliases)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={clientData.notes}
                onChange={(e) => updateClientData('notes', e.target.value)}
                placeholder="Special requirements, VIP status, etc."
                rows={3}
              />
            </div>
          </div>

          {/* Validation Status */}
          {!isManualMode && clientData.name && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {clientData.entityValidation.isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
                <span className="font-medium">
                  Entity Validation: {clientData.entityValidation.isValid ? 'Verified' : 'Pending'}
                </span>
              </div>
              {clientData.entityValidation.confidence > 0 && (
                <p className="text-sm text-muted-foreground">
                  Confidence: {Math.round(clientData.entityValidation.confidence * 100)}% 
                  {clientData.entityValidation.sources.length > 0 && 
                    ` | Sources: ${clientData.entityValidation.sources.join(', ')}`
                  }
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Complete Client Intake'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartClientIntakeWizard;
