
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shield, Bot, User, CheckCircle, AlertTriangle, Loader2, Eye } from 'lucide-react';
import { LiveEntityValidator } from './LiveEntityValidator';
import { AliasGenerator } from './AliasGenerator';
import { SmartFieldAutofill } from './SmartFieldAutofill';
import { OSINTScanner } from './OSINTScanner';
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
  osintData?: {
    threats: any[];
    sentiment: number;
    riskScore: number;
  };
}

const SmartClientIntakeWizard = () => {
  const [isManualMode, setIsManualMode] = useState(false);
  const [enableOSINT, setEnableOSINT] = useState(false);
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
    
    // If OSINT data is included, store it
    if (validation.osintData) {
      updateClientData('osintData', validation.osintData);
    }
  };

  const handleOSINTResults = (osintData: any) => {
    updateClientData('osintData', osintData);
    
    // Update notes with OSINT summary
    const osintSummary = `OSINT Scan Results: ${osintData.threats.length} threats detected, Risk Score: ${Math.round(osintData.riskScore * 100)}%`;
    const currentNotes = clientData.notes;
    const updatedNotes = currentNotes ? `${currentNotes}\n\n${osintSummary}` : osintSummary;
    updateClientData('notes', updatedNotes);
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

  const toggleOSINT = () => {
    setEnableOSINT(!enableOSINT);
    toast.info(
      enableOSINT ? 'OSINT scanning disabled' : 'OSINT scanning enabled',
      {
        description: enableOSINT 
          ? 'Basic entity validation only'
          : 'Live threat intelligence gathering activated'
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
      // Prepare notes with OSINT data if available
      let enhancedNotes = clientData.notes;
      if (clientData.osintData && clientData.osintData.threats.length > 0) {
        const threatSummary = `\n\nA.R.I.A™ OSINT Intelligence:\n- ${clientData.osintData.threats.length} threats detected\n- Risk Score: ${Math.round(clientData.osintData.riskScore * 100)}%\n- Sentiment: ${clientData.osintData.sentiment > 0 ? 'Positive' : clientData.osintData.sentiment < 0 ? 'Negative' : 'Neutral'}`;
        enhancedNotes += threatSummary;
      }

      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: clientData.name,
          industry: clientData.industry,
          contactname: clientData.contactName,
          contactemail: clientData.contactEmail,
          website: clientData.website || null,
          notes: enhancedNotes || null,
          keywordtargets: clientData.keywordTargets || null,
          client_type: 'brand',
          eidetic_enabled: true
        })
        .select()
        .single();

      if (error) throw error;

      // Store OSINT data in scan_results if available
      if (clientData.osintData && clientData.osintData.threats.length > 0) {
        const osintEntries = clientData.osintData.threats.map(threat => ({
          platform: threat.source,
          content: threat.content,
          url: threat.url,
          severity: threat.severity,
          sentiment: threat.sentiment,
          confidence_score: clientData.entityValidation.confidence,
          detected_entities: [clientData.name],
          source_type: 'live_osint',
          threat_type: 'reputation_risk',
          entity_name: clientData.name,
          status: 'new'
        }));

        const { error: osintError } = await supabase
          .from('scan_results')
          .insert(osintEntries);

        if (osintError) {
          console.error('Failed to store OSINT data:', osintError);
        }
      }

      toast.success('Client intake completed successfully!', {
        description: `${clientData.name} added to A.R.I.A™ monitoring system with live validation`
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
                  {enableOSINT && !isManualMode ? ' + OSINT Intelligence' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={isManualMode ? 'destructive' : 'default'}>
                {isManualMode ? <User className="h-3 w-3 mr-1" /> : <Bot className="h-3 w-3 mr-1" />}
                {isManualMode ? 'Manual' : 'Smart'}
              </Badge>
              {!isManualMode && (
                <Badge variant={enableOSINT ? 'default' : 'outline'}>
                  <Eye className="h-3 w-3 mr-1" />
                  OSINT
                </Badge>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleManualMode}
              >
                {isManualMode ? 'Enable Smart Mode' : 'Manual Override'}
              </Button>
              {!isManualMode && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleOSINT}
                >
                  {enableOSINT ? 'Disable OSINT' : 'Enable OSINT'}
                </Button>
              )}
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
                enableOSINT={enableOSINT}
              />
            )}

            {/* Dedicated OSINT Scanner */}
            {!isManualMode && enableOSINT && clientData.name && (
              <OSINTScanner
                entityName={clientData.name}
                onResults={handleOSINTResults}
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
                placeholder="Special requirements, VIP status, OSINT findings..."
                rows={4}
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
                  Entity Validation: {clientData.entityValidation.isValid ? 'Verified (Live)' : 'Pending'}
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
              
              {/* OSINT Summary */}
              {clientData.osintData && (
                <div className="mt-2 p-2 bg-orange-50 rounded border border-orange-200">
                  <p className="text-sm text-orange-800">
                    OSINT: {clientData.osintData.threats.length} threats detected, 
                    Risk Score: {Math.round(clientData.osintData.riskScore * 100)}%
                  </p>
                </div>
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
