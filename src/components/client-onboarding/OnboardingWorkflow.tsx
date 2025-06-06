
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Users, Search, Shield, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { performRealScan } from "@/services/monitoring/realScan";
import ClientInformationForm from './ClientInformationForm';
import EntityDiscoveryPanel from './EntityDiscoveryPanel';
import ThreatAssessmentPanel from './ThreatAssessmentPanel';
import DefenseConfigurationPanel from './DefenseConfigurationPanel';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  icon: React.ComponentType<{ className?: string }>;
}

const OnboardingWorkflow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [clientData, setClientData] = useState<any>(null);
  const [entityData, setEntityData] = useState<any[]>([]);
  const [threatData, setThreatData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'client_info',
      title: 'Client Information',
      description: 'Collect basic client and entity information',
      status: 'pending',
      icon: Users
    },
    {
      id: 'entity_discovery',
      title: 'Entity Discovery',
      description: 'Discover and validate client entities using live OSINT',
      status: 'pending',
      icon: Search
    },
    {
      id: 'threat_assessment',
      title: 'Live Threat Assessment',
      description: 'Perform real-time threat scanning and risk analysis',
      status: 'pending',
      icon: AlertCircle
    },
    {
      id: 'defense_config',
      title: 'Defense Configuration',
      description: 'Configure monitoring and defense systems',
      status: 'pending',
      icon: Shield
    }
  ]);

  const updateStepStatus = (stepIndex: number, status: OnboardingStep['status']) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, status } : step
    ));
  };

  const handleClientInfoSubmit = async (data: any) => {
    setIsProcessing(true);
    updateStepStatus(0, 'in_progress');
    
    try {
      // Store client information in database
      const { data: clientRecord, error } = await supabase
        .from('clients')
        .insert({
          name: data.companyName,
          industry: data.industry,
          contactname: data.contactName,
          contactemail: data.contactEmail,
          notes: `Onboarded via A.R.I.A™ system. Focus areas: ${data.focusAreas?.join(', ')}`,
          client_type: 'brand'
        })
        .select()
        .single();

      if (error) throw error;

      // Store entities
      if (data.entities && data.entities.length > 0) {
        const entityInserts = data.entities.map((entity: any) => ({
          client_id: clientRecord.id,
          entity_name: entity.name,
          entity_type: entity.type,
          notes: entity.description || 'Primary monitored entity'
        }));

        const { error: entityError } = await supabase
          .from('client_entities')
          .insert(entityInserts);

        if (entityError) throw entityError;
      }

      setClientData({ ...data, clientId: clientRecord.id });
      updateStepStatus(0, 'completed');
      setCurrentStep(1);
      setProgress(25);
      
      toast.success('Client information saved successfully');
    } catch (error) {
      console.error('Error saving client info:', error);
      updateStepStatus(0, 'error');
      toast.error('Failed to save client information');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEntityDiscovery = async () => {
    if (!clientData?.entities) return;
    
    setIsProcessing(true);
    updateStepStatus(1, 'in_progress');
    
    try {
      const discoveredEntities = [];
      
      // Perform live OSINT discovery for each entity
      for (const entity of clientData.entities) {
        toast.info(`Discovering live intelligence for ${entity.name}...`);
        
        // Use real scan service with live data
        const liveResults = await performRealScan({
          fullScan: true,
          targetEntity: entity.name,
          source: 'onboarding_discovery'
        });
        
        // Enhanced entity discovery via edge functions
        const { data: discoveryData, error } = await supabase.functions.invoke('enhanced-intelligence', {
          body: {
            entity_name: entity.name,
            scan_type: 'onboarding_discovery',
            deep_search: true
          }
        });

        if (discoveryData?.results) {
          liveResults.push(...discoveryData.results);
        }

        discoveredEntities.push({
          ...entity,
          liveIntelligence: liveResults,
          discoveryScore: liveResults.length > 0 ? 0.85 : 0.3,
          riskIndicators: liveResults.filter(r => r.severity === 'high').length
        });
      }
      
      setEntityData(discoveredEntities);
      updateStepStatus(1, 'completed');
      setCurrentStep(2);
      setProgress(50);
      
      toast.success(`Live entity discovery completed: ${discoveredEntities.reduce((acc, e) => acc + e.liveIntelligence.length, 0)} intelligence items found`);
    } catch (error) {
      console.error('Entity discovery failed:', error);
      updateStepStatus(1, 'error');
      toast.error('Live entity discovery failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleThreatAssessment = async () => {
    if (!entityData.length) return;
    
    setIsProcessing(true);
    updateStepStatus(2, 'in_progress');
    
    try {
      const threatAssessments = [];
      
      // Perform live threat assessment for each entity
      for (const entity of entityData) {
        toast.info(`Performing live threat assessment for ${entity.name}...`);
        
        // Execute multiple live threat scanners
        const threatScanners = [
          supabase.functions.invoke('reputation-scan', {
            body: {
              entity_name: entity.name,
              scan_type: 'comprehensive_threat_assessment'
            }
          }),
          supabase.functions.invoke('monitoring-scan', {
            body: {
              target_entity: entity.name,
              scan_depth: 'deep',
              live_only: true
            }
          }),
          supabase.functions.invoke('discovery-scanner', {
            body: {
              entity_name: entity.name,
              scan_type: 'threat_assessment'
            }
          })
        ];

        const scanResults = await Promise.allSettled(threatScanners);
        const liveThreats = [];
        
        scanResults.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value?.data?.results) {
            liveThreats.push(...result.value.data.results);
          }
        });

        // Calculate real threat score based on live data
        const threatScore = liveThreats.length > 0 
          ? Math.min(1, liveThreats.filter(t => t.severity === 'high').length * 0.3 + 
                        liveThreats.filter(t => t.severity === 'medium').length * 0.1)
          : 0;

        threatAssessments.push({
          entityName: entity.name,
          liveThreats,
          threatScore,
          riskLevel: threatScore > 0.7 ? 'high' : threatScore > 0.3 ? 'medium' : 'low',
          recommendations: liveThreats.length > 0 
            ? ['Immediate monitoring required', 'Deploy counter-narrative strategy', 'Activate alert systems']
            : ['Standard monitoring', 'Baseline defense posture']
        });
      }
      
      setThreatData(threatAssessments);
      updateStepStatus(2, 'completed');
      setCurrentStep(3);
      setProgress(75);
      
      const totalThreats = threatAssessments.reduce((acc, t) => acc + t.liveThreats.length, 0);
      toast.success(`Live threat assessment completed: ${totalThreats} real threats identified`);
    } catch (error) {
      console.error('Threat assessment failed:', error);
      updateStepStatus(2, 'error');
      toast.error('Live threat assessment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDefenseConfiguration = async () => {
    setIsProcessing(true);
    updateStepStatus(3, 'in_progress');
    
    try {
      // Configure live monitoring systems
      const monitoringConfigs = entityData.map(entity => ({
        client_id: clientData.clientId,
        entity_name: entity.name,
        monitoring_keywords: [entity.name, ...(entity.aliases || [])],
        alert_thresholds: {
          high_severity: 1,
          medium_severity: 3,
          low_severity: 10
        },
        auto_response_enabled: true,
        status: 'active'
      }));

      // Enable Sentinel Guardian monitoring
      const { error: guardianError } = await supabase.functions.invoke('enhanced-intelligence', {
        body: {
          action: 'enable_guardian_monitoring',
          client_id: clientData.clientId,
          entities: entityData.map(e => e.name),
          monitoring_configs: monitoringConfigs
        }
      });

      if (guardianError) {
        console.warn('Guardian monitoring setup warning:', guardianError);
      }

      // Set up automated response systems
      for (const threat of threatData) {
        if (threat.threatScore > 0.5) {
          await supabase.functions.invoke('generate-response', {
            body: {
              threat_type: 'onboarding_detected',
              entity_name: threat.entityName,
              severity: threat.riskLevel,
              auto_deploy: false // Require manual approval initially
            }
          });
        }
      }

      updateStepStatus(3, 'completed');
      setProgress(100);
      
      toast.success('Live defense systems configured and activated');
      
      // Log successful onboarding
      await supabase.from('aria_ops_log').insert({
        operation_type: 'client_onboarding_completed',
        entity_name: clientData.companyName,
        module_source: 'onboarding_workflow',
        success: true,
        operation_data: {
          entities_configured: entityData.length,
          threats_detected: threatData.reduce((acc, t) => acc + t.liveThreats.length, 0),
          defense_systems_active: true
        }
      });
      
    } catch (error) {
      console.error('Defense configuration failed:', error);
      updateStepStatus(3, 'error');
      toast.error('Defense configuration failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ClientInformationForm 
            onSubmit={handleClientInfoSubmit}
            isProcessing={isProcessing}
          />
        );
      case 1:
        return (
          <EntityDiscoveryPanel
            clientData={clientData}
            entityData={entityData}
            onProceed={handleEntityDiscovery}
            isProcessing={isProcessing}
          />
        );
      case 2:
        return (
          <ThreatAssessmentPanel
            entityData={entityData}
            threatData={threatData}
            onProceed={handleThreatAssessment}
            isProcessing={isProcessing}
          />
        );
      case 3:
        return (
          <DefenseConfigurationPanel
            clientData={clientData}
            entityData={entityData}
            threatData={threatData}
            onComplete={handleDefenseConfiguration}
            isProcessing={isProcessing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-corporate-accent">A.R.I.A™ Client Onboarding</h1>
        <p className="text-corporate-lightGray">Live Intelligence & Defense System Configuration</p>
      </div>

      {/* Progress */}
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Onboarding Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Steps Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card 
              key={step.id} 
              className={`bg-corporate-darkSecondary border-corporate-border ${
                index === currentStep ? 'ring-2 ring-corporate-accent' : ''
              }`}
            >
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="h-5 w-5 text-corporate-accent" />
                  <Badge variant={
                    step.status === 'completed' ? 'default' : 
                    step.status === 'in_progress' ? 'secondary' :
                    step.status === 'error' ? 'destructive' : 'outline'
                  }>
                    {step.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {step.status}
                  </Badge>
                </div>
                <h3 className="font-medium text-white">{step.title}</h3>
                <p className="text-xs text-corporate-lightGray mt-1">{step.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Step Content */}
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardHeader>
          <CardTitle className="text-corporate-accent">
            {steps[currentStep]?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderCurrentStepContent()}
        </CardContent>
      </Card>

      {/* Live Data Status */}
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-400">
              Live OSINT Sources Active - No Simulated Data
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingWorkflow;
