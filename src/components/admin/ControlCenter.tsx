
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import QuickCommandConsole from './control-center/QuickCommandConsole';
import EntityContextPanel from './control-center/EntityContextPanel';
import ServiceOrchestrator from './control-center/ServiceOrchestrator';
import StrategyBrain from './control-center/StrategyBrain';
import SystemDiagnostics from './control-center/SystemDiagnostics';
import ControlCenterHeader from './control-center/ControlCenterHeader';
import { modules } from './control-center/ModulesConfig';
import { useServiceStatus } from './control-center/useServiceStatus';
import { useEntityMemory } from './control-center/useEntityMemory';

const ControlCenter = () => {
  const [activeModule, setActiveModule] = useState('strategy-brain');
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [quickConsoleOpen, setQuickConsoleOpen] = useState(false);

  const { serviceStatus } = useServiceStatus();
  const { entityMemory } = useEntityMemory(selectedEntity);

  const handleEntitySelect = (entityName: string) => {
    setSelectedEntity(entityName);
    toast.info(`🎯 Switching context to: ${entityName}`);
  };

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
        <ControlCenterHeader
          selectedEntity={selectedEntity}
          quickConsoleOpen={quickConsoleOpen}
          setQuickConsoleOpen={setQuickConsoleOpen}
        />

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
