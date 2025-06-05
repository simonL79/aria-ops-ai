
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Shield, 
  Target, 
  Eye, 
  CheckCircle, 
  ArrowRight,
  AlertTriangle,
  FileText,
  Zap
} from "lucide-react";
import ClientExecutionPlan from './ClientExecutionPlan';

interface OnboardingStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed';
  description: string;
  requiredFields: string[];
}

const OnboardingWorkflow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [clientData, setClientData] = useState({
    clientName: '',
    entityName: '',
    aliases: '',
    industry: '',
    keywordTargets: '',
    threatLevel: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    escalationKeywords: '',
    suppressionTargets: '',
    amplificationTopics: ''
  });

  const [showExecutionPlan, setShowExecutionPlan] = useState(false);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'client_intake',
      title: 'Client Information Capture',
      icon: <Users className="h-5 w-5" />,
      status: currentStep >= 0 ? 'active' : 'pending',
      description: 'Capture essential client and entity information for A.R.I.A™ system configuration',
      requiredFields: ['clientName', 'entityName', 'industry']
    },
    {
      id: 'entity_mapping',
      title: 'Entity Fingerprint Creation',
      icon: <Target className="h-5 w-5" />,
      status: currentStep >= 1 ? 'active' : 'pending',
      description: 'Map all entity variants, aliases, and associates for comprehensive monitoring',
      requiredFields: ['aliases', 'keywordTargets']
    },
    {
      id: 'threat_configuration',
      title: 'Threat Parameters Setup',
      icon: <Shield className="h-5 w-5" />,
      status: currentStep >= 2 ? 'active' : 'pending',
      description: 'Configure threat detection sensitivity and escalation triggers',
      requiredFields: ['threatLevel', 'escalationKeywords']
    },
    {
      id: 'monitoring_deployment',
      title: 'A.R.I.A™ System Deployment',
      icon: <Eye className="h-5 w-5" />,
      status: currentStep >= 3 ? 'active' : 'pending',
      description: 'Deploy never-stop monitoring across all configured platforms and sources',
      requiredFields: []
    },
    {
      id: 'execution_planning',
      title: 'Defense Execution Plan',
      icon: <Zap className="h-5 w-5" />,
      status: currentStep >= 4 ? 'active' : 'pending',
      description: 'Generate comprehensive defense strategy from passive monitoring to nuclear options',
      requiredFields: []
    }
  ];

  const handleStepCompletion = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowExecutionPlan(true);
    }
  };

  const getStepProgress = () => {
    return ((currentStep + 1) / onboardingSteps.length) * 100;
  };

  const renderStepContent = () => {
    const step = onboardingSteps[currentStep];
    
    switch (step.id) {
      case 'client_intake':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Client/Company Name *</label>
              <Input
                value={clientData.clientName}
                onChange={(e) => setClientData(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="Enter client or company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Primary Entity Name *</label>
              <Input
                value={clientData.entityName}
                onChange={(e) => setClientData(prev => ({ ...prev, entityName: e.target.value }))}
                placeholder="Primary individual or brand name to monitor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Industry *</label>
              <Input
                value={clientData.industry}
                onChange={(e) => setClientData(prev => ({ ...prev, industry: e.target.value }))}
                placeholder="e.g., Technology, Entertainment, Finance"
              />
            </div>
          </div>
        );

      case 'entity_mapping':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Known Aliases & Variants</label>
              <Textarea
                value={clientData.aliases}
                onChange={(e) => setClientData(prev => ({ ...prev, aliases: e.target.value }))}
                placeholder="List all known aliases, nicknames, brand variants, etc."
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Keyword Targets</label>
              <Textarea
                value={clientData.keywordTargets}
                onChange={(e) => setClientData(prev => ({ ...prev, keywordTargets: e.target.value }))}
                placeholder="Keywords and phrases to monitor (comma-separated)"
                rows={3}
              />
            </div>
          </div>
        );

      case 'threat_configuration':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Threat Sensitivity Level</label>
              <div className="grid grid-cols-2 gap-2">
                {(['low', 'medium', 'high', 'critical'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={clientData.threatLevel === level ? 'default' : 'outline'}
                    onClick={() => setClientData(prev => ({ ...prev, threatLevel: level }))}
                    className="capitalize"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Emergency Escalation Keywords</label>
              <Textarea
                value={clientData.escalationKeywords}
                onChange={(e) => setClientData(prev => ({ ...prev, escalationKeywords: e.target.value }))}
                placeholder="Keywords that trigger immediate escalation (comma-separated)"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Suppression Targets</label>
              <Textarea
                value={clientData.suppressionTargets}
                onChange={(e) => setClientData(prev => ({ ...prev, suppressionTargets: e.target.value }))}
                placeholder="Specific content, URLs, or sources to actively suppress"
                rows={2}
              />
            </div>
          </div>
        );

      case 'monitoring_deployment':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-green-950/20 border border-green-500/30 rounded">
              <h4 className="font-medium text-green-400 mb-2">A.R.I.A™ System Deployment</h4>
              <ul className="space-y-2 text-sm text-green-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  EIDETIC™ Memory Management - Activated
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  RSI™ Never-Stop Protection - Enabled
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  ANUBIS™ Pattern Recognition - Online
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Live OSINT Scanning - Active
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  CIA-Level Entity Fingerprinting - Complete
                </li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              Your A.R.I.A™ defense systems are now fully operational. The system will begin 
              passive monitoring immediately and escalate through defense phases as needed.
            </p>
          </div>
        );

      case 'execution_planning':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-950/20 border border-blue-500/30 rounded">
              <h4 className="font-medium text-blue-400 mb-2">Execution Plan Ready</h4>
              <p className="text-sm text-blue-300">
                Your comprehensive defense execution plan has been generated. This plan covers 
                all phases from passive monitoring to nuclear protocols, ensuring maximum 
                protection for {clientData.entityName}.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-900/50 rounded">
                <div className="text-lg font-bold text-green-400">6 Phases</div>
                <div className="text-xs text-muted-foreground">Defense Escalation</div>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded">
                <div className="text-lg font-bold text-blue-400">24/7</div>
                <div className="text-xs text-muted-foreground">Never-Stop Protection</div>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded">
                <div className="text-lg font-bold text-orange-400">Nuclear</div>
                <div className="text-xs text-muted-foreground">Options Available</div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Step content not found</div>;
    }
  };

  if (showExecutionPlan) {
    return (
      <ClientExecutionPlan
        clientName={clientData.clientName}
        entityName={clientData.entityName}
        threatLevel={clientData.threatLevel}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>A.R.I.A™ Client Onboarding</span>
            <Badge variant="outline">
              Step {currentStep + 1} of {onboardingSteps.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(getStepProgress())}%</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Step Navigation */}
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {onboardingSteps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              index === currentStep ? 'bg-blue-600' :
              index < currentStep ? 'bg-green-600' : 'bg-gray-600'
            }`}>
              {step.icon}
              <span className="text-sm font-medium hidden md:block">{step.title}</span>
            </div>
            {index < onboardingSteps.length - 1 && (
              <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {onboardingSteps[currentStep].icon}
            {onboardingSteps[currentStep].title}
          </CardTitle>
          <p className="text-muted-foreground">
            {onboardingSteps[currentStep].description}
          </p>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button onClick={handleStepCompletion}>
              {currentStep === onboardingSteps.length - 1 ? 'Generate Execution Plan' : 'Next Step'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            A.R.I.A™ System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">ONLINE</div>
              <div className="text-xs text-muted-foreground">Core Systems</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">ACTIVE</div>
              <div className="text-xs text-muted-foreground">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">READY</div>
              <div className="text-xs text-muted-foreground">Response Systems</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-400">ARMED</div>
              <div className="text-xs text-muted-foreground">Nuclear Protocols</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingWorkflow;
