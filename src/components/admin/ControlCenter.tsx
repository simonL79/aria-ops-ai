
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, FileText, Shield, Target, AlertTriangle, BarChart, Settings, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import QuickCommandConsole from './control-center/QuickCommandConsole';
import EntityContextPanel from './control-center/EntityContextPanel';
import ServiceOrchestrator from './control-center/ServiceOrchestrator';
import SystemDiagnostics from './control-center/SystemDiagnostics';
import NarrativeBuilder from './control-center/NarrativeBuilder';
import StrategyBrain from './control-center/StrategyBrain';
import ThreatTracker from './control-center/ThreatTracker';
import OpportunityRadar from './control-center/OpportunityRadar';
import ShieldhLegal from './control-center/ShieldhLegal';
import CommandReview from './control-center/CommandReview';

const ControlCenter = () => {
  const [activeModule, setActiveModule] = useState('strategy-brain');
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [entityMemory, setEntityMemory] = useState<any[]>([]);
  const [serviceStatus, setServiceStatus] = useState<any>({});
  const [quickConsoleOpen, setQuickConsoleOpen] = useState(false);

  useEffect(() => {
    loadEntityMemory();
    checkServiceStatus();
    const interval = setInterval(checkServiceStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [selectedEntity]);

  const loadEntityMemory = async () => {
    if (!selectedEntity) return;

    try {
      const { data: memory } = await supabase
        .from('anubis_entity_memory')
        .select('*')
        .eq('entity_name', selectedEntity)
        .order('created_at', { ascending: false })
        .limit(20);

      setEntityMemory(memory || []);
    } catch (error) {
      console.error('Failed to load entity memory:', error);
    }
  };

  const checkServiceStatus = async () => {
    try {
      // Check service health via edge functions
      const services = {
        legalDocumentGenerator: await checkService('legal-document-generator'),
        threatPredictionEngine: await checkService('threat-prediction-engine'),
        prospectScanner: await checkService('prospect-intelligence-scanner'),
        execReporting: await checkService('executive-reporting'),
        liveDataEnforcer: await checkService('aria-ingest'),
        counterNarrativeEngine: 'active', // Known working
        patternRecognition: 'active', // Known working
        strategyMemory: 'active' // Known working
      };

      setServiceStatus(services);
    } catch (error) {
      console.error('Service status check failed:', error);
    }
  };

  const checkService = async (serviceName: string): Promise<string> => {
    try {
      const response = await fetch(`/functions/v1/${serviceName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'health_check' })
      });
      
      return response.ok ? 'active' : 'error';
    } catch (error) {
      return 'pending';
    }
  };

  const handleEntitySelect = (entityName: string) => {
    setSelectedEntity(entityName);
    toast.info(`🎯 Switching context to: ${entityName}`);
  };

  const modules = [
    {
      id: 'strategy-brain',
      label: 'Strategy Brain',
      icon: Brain,
      description: 'Pattern log, AI responses, tone control center',
      component: StrategyBrain
    },
    {
      id: 'narrative-builder',
      label: 'Narrative Builder',
      icon: FileText,
      description: 'Auto-loads keywords, AI themes, and saturation tools',
      component: NarrativeBuilder
    },
    {
      id: 'threat-tracker',
      label: 'Threat Tracker',
      icon: AlertTriangle,
      description: 'Real-time monitoring with priority ranking',
      component: ThreatTracker
    },
    {
      id: 'opportunity-radar',
      label: 'Opportunity Radar',
      icon: Target,
      description: 'Lead scanner + alert builder for proactive outreach',
      component: OpportunityRadar
    },
    {
      id: 'shieldh-legal',
      label: 'SHIELDHAVEN™',
      icon: Shield,
      description: 'Legal generator, compliance check, and strike commands',
      component: ShieldhLegal
    },
    {
      id: 'command-review',
      label: 'Command Review',
      icon: BarChart,
      description: 'Executive metrics, impact graphs, effectiveness audit',
      component: CommandReview
    },
    {
      id: 'system-diagnostics',
      label: 'System Diagnostics',
      icon: Settings,
      description: 'Service map and system health monitoring',
      component: SystemDiagnostics
    }
  ];

  return (
    <div className="h-screen bg-corporate-dark text-white flex">
      {/* Entity Context Panel - Collapsible Sidebar */}
      <EntityContextPanel
        selectedEntity={selectedEntity}
        entityMemory={entityMemory}
        onEntitySelect={handleEntitySelect}
        serviceStatus={serviceStatus}
      />

      {/* Main Control Center */}
      <div className="flex-1 flex flex-col">
        {/* Header with Quick Actions */}
        <div className="bg-corporate-darkSecondary border-b border-corporate-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-corporate-accent">
                A.R.I.A™ Control Center
              </h1>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                <Zap className="h-3 w-3 mr-1" />
                LIVE OPERATIONS
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setQuickConsoleOpen(!quickConsoleOpen)}
                className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
              >
                <Zap className="h-4 w-4 mr-2" />
                Quick Command
              </Button>
              <div className="text-sm text-corporate-lightGray">
                Entity: {selectedEntity || 'None Selected'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Command Console - Collapsible */}
        {quickConsoleOpen && (
          <QuickCommandConsole
            selectedEntity={selectedEntity}
            onClose={() => setQuickConsoleOpen(false)}
            serviceStatus={serviceStatus}
          />
        )}

        {/* Module Tabs */}
        <Tabs value={activeModule} onValueChange={setActiveModule} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-7 w-full bg-corporate-darkSecondary border-b border-corporate-border rounded-none">
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = serviceStatus[module.id] === 'active';
              
              return (
                <TabsTrigger
                  key={module.id}
                  value={module.id}
                  className="flex items-center gap-2 data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{module.label}</span>
                  {module.id !== 'system-diagnostics' && (
                    <div className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Module Content */}
          <div className="flex-1 overflow-auto">
            {modules.map((module) => (
              <TabsContent
                key={module.id}
                value={module.id}
                className="h-full m-0 p-6"
              >
                <Card className="bg-corporate-dark border-corporate-border h-full">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <module.icon className="h-5 w-5 text-corporate-accent" />
                      {module.label}
                    </CardTitle>
                    <p className="text-corporate-lightGray text-sm">
                      {module.description}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {module.id === 'strategy-brain' ? (
                      <StrategyBrain
                        selectedEntity={selectedEntity}
                        entityMemory={entityMemory}
                      />
                    ) : module.id === 'system-diagnostics' ? (
                      <SystemDiagnostics
                        selectedEntity={selectedEntity}
                        serviceStatus={serviceStatus}
                      />
                    ) : (
                      <module.component
                        selectedEntity={selectedEntity}
                        serviceStatus={serviceStatus}
                        entityMemory={entityMemory}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </div>
        </Tabs>

        {/* Service Orchestrator - Background */}
        <ServiceOrchestrator
          selectedEntity={selectedEntity}
          activeModule={activeModule}
        />
      </div>
    </div>
  );
};

export default ControlCenter;
