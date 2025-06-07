
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import ControlCenterModules from './control-center/ControlCenterModules';
import ClientSelector from './ClientSelector';
import type { Client } from '@/types/clients';

interface ClientEntity {
  id: string;
  entity_name: string;
  entity_type: string;
  alias?: string;
}

const ControlCenter = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientEntities, setClientEntities] = useState<ClientEntity[]>([]);
  const [activeModule, setActiveModule] = useState('overview');
  const [systemStatus, setSystemStatus] = useState('operational');
  const [showConsole, setShowConsole] = useState(false);

  // Sample threat level - in real implementation, this would be determined by A.R.I.A™ analysis
  const currentThreatLevel = 'medium' as 'low' | 'medium' | 'high' | 'critical';

  // Mock service status - would be real in production
  const serviceStatus = {
    legalDocumentGenerator: 'active',
    threatPredictionEngine: 'active',
    prospectScanner: 'active',
    execReporting: 'active',
    liveDataEnforcer: 'active',
    counterNarrativeEngine: 'active',
    patternRecognition: 'active',
    strategyMemory: 'active'
  };

  // Mock entity memory - would be real in production
  const entityMemory = selectedClient ? [
    {
      id: '1',
      content: `Intelligence data for ${selectedClient.name}`,
      created_at: new Date().toISOString(),
      entity_name: selectedClient.name
    }
  ] : [];

  const handleClientSelect = (client: Client | null) => {
    setSelectedClient(client);
  };

  const handleEntitiesLoad = (entities: ClientEntity[]) => {
    setClientEntities(entities);
  };

  const handleEntitySelect = (entityName: string) => {
    // This function is for backwards compatibility with existing modules
    console.log('Entity selected:', entityName);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-corporate-accent">A.R.I.A™ Control Center</h1>
          <p className="text-corporate-lightGray">Unified Command Interface with Client Context</p>
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

      {/* Client Selection Section */}
      <ClientSelector
        selectedClient={selectedClient}
        onClientSelect={handleClientSelect}
        onEntitiesLoad={handleEntitiesLoad}
      />

      {/* Main Control Modules */}
      <ControlCenterModules
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        selectedEntity={selectedClient?.name || ''}
        onEntitySelect={handleEntitySelect}
        showConsole={showConsole}
        onToggleConsole={() => setShowConsole(!showConsole)}
        serviceStatus={serviceStatus}
        entityMemory={entityMemory}
        currentThreatLevel={currentThreatLevel}
      />
    </div>
  );
};

export default ControlCenter;
