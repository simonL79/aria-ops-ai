
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Target, AlertTriangle, Zap, Brain, Settings } from "lucide-react";
import EntityContextPanel from './EntityContextPanel';
import QuickCommandConsole from './QuickCommandConsole';
import ThreatTracker from './ThreatTracker';
import ServiceOrchestrator from './ServiceOrchestrator';
import SystemDiagnostics from './SystemDiagnostics';
import StrategyBrainMetrics from './StrategyBrainMetrics';
import ClientExecutionPlan from '../client-onboarding/ClientExecutionPlan';

interface ControlCenterModulesProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  selectedEntity: string;
  onEntitySelect: (entity: string) => void;
  showConsole: boolean;
  onToggleConsole: () => void;
  serviceStatus: any;
  entityMemory: any[];
  currentThreatLevel: 'low' | 'medium' | 'high' | 'critical';
}

const ControlCenterModules: React.FC<ControlCenterModulesProps> = ({
  activeModule,
  onModuleChange,
  selectedEntity,
  onEntitySelect,
  showConsole,
  onToggleConsole,
  serviceStatus,
  entityMemory,
  currentThreatLevel
}) => {
  return (
    <Tabs value={activeModule} onValueChange={onModuleChange} className="space-y-6">
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
          <EntityContextPanel 
            selectedEntity={selectedEntity}
            entityMemory={entityMemory}
            onEntitySelect={onEntitySelect}
            serviceStatus={serviceStatus}
          />
          {showConsole ? (
            <QuickCommandConsole 
              selectedEntity={selectedEntity}
              onClose={onToggleConsole}
              serviceStatus={serviceStatus}
            />
          ) : (
            <div className="bg-corporate-darkSecondary border-corporate-border rounded-lg p-6 text-center">
              <button
                onClick={onToggleConsole}
                className="bg-corporate-accent text-black hover:bg-corporate-accent/90 px-4 py-2 rounded"
              >
                <Zap className="h-4 w-4 mr-2 inline" />
                Open Command Console
              </button>
            </div>
          )}
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
          <div className="bg-corporate-darkSecondary border-corporate-border rounded-lg p-8 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50 text-corporate-lightGray" />
            <p className="text-corporate-lightGray">Please select an entity to view the execution plan</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="threats" className="space-y-6">
        <ThreatTracker 
          selectedEntity={selectedEntity}
          serviceStatus={serviceStatus}
          entityMemory={entityMemory}
        />
      </TabsContent>

      <TabsContent value="services" className="space-y-6">
        <ServiceOrchestrator 
          selectedEntity={selectedEntity}
          activeModule={activeModule}
        />
        <div className="bg-corporate-darkSecondary border-corporate-border rounded-lg p-8 text-center">
          <Zap className="h-8 w-8 mx-auto mb-2 text-corporate-lightGray" />
          <p className="text-corporate-lightGray">Service orchestration running in background</p>
          <p className="text-xs mt-1 text-corporate-lightGray">Check console for service logs</p>
        </div>
      </TabsContent>

      <TabsContent value="brain" className="space-y-6">
        <StrategyBrainMetrics selectedEntity={selectedEntity} />
      </TabsContent>

      <TabsContent value="diagnostics" className="space-y-6">
        <SystemDiagnostics 
          selectedEntity={selectedEntity}
          serviceStatus={serviceStatus}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ControlCenterModules;
