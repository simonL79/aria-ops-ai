
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Search, 
  Users, 
  BarChart3, 
  Settings, 
  Target,
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle,
  Eye,
  Zap,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import LiveDataGuard from '@/components/dashboard/LiveDataGuard';
import ServiceOrchestrator from './control-center/ServiceOrchestrator';
import { useServiceStatus } from './control-center/useServiceStatus';
import OnboardingWorkflow from '@/components/client-onboarding/OnboardingWorkflow';
import ClientExecutionPlan from '@/components/client-onboarding/ClientExecutionPlan';

const ControlCenter = () => {
  const [selectedEntity, setSelectedEntity] = useState('');
  const [activeModule, setActiveModule] = useState('overview');
  const [liveStatus, setLiveStatus] = useState({ isLive: false, lastUpdate: null });
  const { serviceStatus } = useServiceStatus();

  useEffect(() => {
    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkLiveStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('live_status')
        .select('*')
        .eq('system_status', 'LIVE')
        .order('last_report', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setLiveStatus({ 
          isLive: true, 
          lastUpdate: new Date(data[0].last_report).toLocaleTimeString() 
        });
      }
    } catch (error) {
      console.error('Live status check failed:', error);
    }
  };

  const handleEntitySelect = (entity: string) => {
    setSelectedEntity(entity);
    toast.success(`Entity context switched to: ${entity}`);
  };

  const coreModules = [
    {
      id: 'client-onboarding',
      title: 'Client Onboarding & Execution',
      icon: Users,
      description: 'Complete client setup and defense execution plan',
      status: 'active',
      classification: 'CORE'
    },
    {
      id: 'keyword-system',
      title: 'A.R.I.A vX™ Keyword System',
      icon: Target,
      description: 'Real-time reputation reshaping engine',
      status: 'active',
      classification: 'LIVE ENGINE'
    },
    {
      id: 'threat-monitoring',
      title: 'Threat Monitoring',
      icon: Shield,
      description: 'Live OSINT intelligence gathering',
      status: serviceStatus.liveDataEnforcer || 'pending',
      classification: 'LIVE'
    },
    {
      id: 'strategy-brain',
      title: 'Strategy Brain',
      icon: Brain,
      description: 'AI-powered response strategies',
      status: serviceStatus.strategyMemory || 'pending',
      classification: 'AI'
    },
    {
      id: 'pattern-recognition',
      title: 'ANUBIS™ Pattern Recognition',
      icon: Eye,
      description: 'Advanced threat pattern detection',
      status: serviceStatus.patternRecognition || 'active',
      classification: 'ANUBIS'
    }
  ];

  return (
    <LiveDataGuard enforceStrict={true}>
      <div className="min-h-screen bg-corporate-dark text-white p-6">
        <ServiceOrchestrator 
          selectedEntity={selectedEntity} 
          activeModule={activeModule} 
        />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-corporate-accent">A.R.I.A™ Control Center</h1>
              <p className="text-corporate-lightGray">Unified command interface with entity context awareness</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${liveStatus.isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-sm">
                  {liveStatus.isLive ? 'LIVE' : 'OFFLINE'}
                </span>
                {liveStatus.lastUpdate && (
                  <span className="text-xs text-corporate-lightGray">
                    Last: {liveStatus.lastUpdate}
                  </span>
                )}
              </div>
              
              <Badge className="bg-green-900 text-green-300 border-green-500">
                100% Live Intelligence
              </Badge>
            </div>
          </div>

          {/* Entity Context Selector */}
          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-corporate-lightGray mb-2 block">
                    Active Entity Context
                  </label>
                  <Input
                    placeholder="Enter entity name for context-aware operations..."
                    value={selectedEntity}
                    onChange={(e) => setSelectedEntity(e.target.value)}
                    className="bg-corporate-dark border-corporate-border text-white"
                  />
                </div>
                <Button 
                  onClick={() => handleEntitySelect(selectedEntity)}
                  disabled={!selectedEntity.trim()}
                  className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
                >
                  Set Context
                </Button>
              </div>
              
              {selectedEntity && (
                <div className="mt-3 p-3 bg-corporate-accent/10 border border-corporate-accent/30 rounded">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-corporate-accent" />
                    <span className="text-sm text-corporate-accent">
                      Active Context: <strong>{selectedEntity}</strong>
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Core Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {coreModules.map((module) => (
            <Card 
              key={module.id} 
              className={`bg-corporate-darkSecondary border-corporate-border hover:border-corporate-accent/50 transition-colors cursor-pointer ${
                activeModule === module.id ? 'border-corporate-accent' : ''
              }`}
              onClick={() => setActiveModule(module.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <module.icon className="h-6 w-6 text-corporate-accent" />
                  <Badge variant="outline" className="text-xs">
                    {module.classification}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-white">{module.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-corporate-lightGray mb-3">
                  {module.description}
                </p>
                <div className="flex items-center gap-2">
                  {module.status === 'active' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : module.status === 'pending' ? (
                    <Activity className="h-4 w-4 text-yellow-500 animate-pulse" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-xs capitalize">{module.status}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Module Content */}
        <div className="space-y-6">
          {activeModule === 'client-onboarding' && (
            <div className="space-y-6">
              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-corporate-accent">Client Onboarding Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <OnboardingWorkflow />
                </CardContent>
              </Card>
              
              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-corporate-accent">Defense Execution Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ClientExecutionPlan entityName={selectedEntity} />
                </CardContent>
              </Card>
            </div>
          )}

          {activeModule === 'keyword-system' && (
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-corporate-accent">A.R.I.A vX™ Keyword to Article System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-corporate-accent mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Real-time Reputation Reshaping Engine</h3>
                  <p className="text-corporate-lightGray mb-4">
                    Access the full keyword-to-article system for advanced reputation management
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/admin/keyword-to-article'}
                    className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
                  >
                    Launch Keyword System
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeModule === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-white">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(serviceStatus).map(([service, status]) => (
                      <div key={service} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{service.replace(/([A-Z])/g, ' $1')}</span>
                        <Badge 
                          variant={status === 'active' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'}
                        >
                          {status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveModule('client-onboarding')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Client Onboarding
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/admin/keyword-to-article'}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Keyword System
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveModule('threat-monitoring')}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Threat Monitoring
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </LiveDataGuard>
  );
};

export default ControlCenter;
