
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Shield, Brain, Target, Activity, Zap, Users, Settings } from "lucide-react";
import EntityContextPanel from './control-center/EntityContextPanel';
import QuickCommandConsole from './control-center/QuickCommandConsole';
import ThreatTracker from './control-center/ThreatTracker';
import ServiceOrchestrator from './control-center/ServiceOrchestrator';
import SystemDiagnostics from './control-center/SystemDiagnostics';
import StrategyBrainMetrics from './control-center/StrategyBrainMetrics';
import ClientExecutionPlan from '../client-onboarding/ClientExecutionPlan';

const ControlCenter = () => {
  const [selectedEntity, setSelectedEntity] = useState('');
  const [activeModule, setActiveModule] = useState('overview');
  const [systemStatus, setSystemStatus] = useState('operational');

  // Sample threat level - in real implementation, this would be determined by A.R.I.A™ analysis
  const currentThreatLevel = 'medium' as 'low' | 'medium' | 'high' | 'critical';

  return (
    <div className="min-h-screen bg-corporate-dark text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-corporate-accent">A.R.I.A™ Control Center</h1>
            <p className="text-corporate-lightGray">Unified Command Interface with Entity Context</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={systemStatus === 'operational' ? 'default' : 'destructive'}>
              <Activity className="h-3 w-3 mr-1" />
              System {systemStatus}
            </Badge>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">Live Data Active</span>
            </div>
          </div>
        </div>

        {/* Entity Selection */}
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-corporate-accent">Entity Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter entity name..."
                  value={selectedEntity}
                  onChange={(e) => setSelectedEntity(e.target.value)}
                  className="bg-corporate-dark border-corporate-border text-white"
                />
              </div>
              <Button 
                variant="outline" 
                className="text-corporate-accent border-corporate-accent hover:bg-corporate-accent hover:text-black"
              >
                Load Context
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Control Tabs */}
        <Tabs value={activeModule} onValueChange={setActiveModule} className="space-y-6">
          <TabsList className="bg-corporate-darkSecondary border-corporate-border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
              <Shield className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="execution-plan" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
              <Target className="h-4 w-4 mr-2" />
              Client Execution
            </TabsTrigger>
            <TabsTrigger value="threats" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Threat Tracker
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
              <Zap className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="brain" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
              <Brain className="h-4 w-4 mr-2" />
              Strategy Brain
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black">
              <Settings className="h-4 w-4 mr-2" />
              Diagnostics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EntityContextPanel entityName={selectedEntity} />
              <QuickCommandConsole />
            </div>
          </TabsContent>

          <TabsContent value="execution-plan" className="space-y-6">
            {selectedEntity ? (
              <ClientExecutionPlan 
                entityName={selectedEntity}
                clientName={selectedEntity}
                threatLevel={currentThreatLevel}
              />
            ) : (
              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardContent className="py-8">
                  <div className="text-center text-corporate-lightGray">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Please select an entity to view the execution plan</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="threats" className="space-y-6">
            <ThreatTracker />
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <ServiceOrchestrator />
          </TabsContent>

          <TabsContent value="brain" className="space-y-6">
            <StrategyBrainMetrics />
          </TabsContent>

          <TabsContent value="diagnostics" className="space-y-6">
            <SystemDiagnostics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ControlCenter;
