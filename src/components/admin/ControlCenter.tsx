
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity } from "lucide-react";
import ControlCenterModules from './control-center/ControlCenterModules';

const ControlCenter = () => {
  const [selectedEntity, setSelectedEntity] = useState('');
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
  const entityMemory = selectedEntity ? [
    {
      id: '1',
      content: `Intelligence data for ${selectedEntity}`,
      created_at: new Date().toISOString(),
      entity_name: selectedEntity
    }
  ] : [];

  const handleEntitySelect = (entityName: string) => {
    setSelectedEntity(entityName);
  };

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
                onClick={() => handleEntitySelect(selectedEntity)}
              >
                Load Context
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Control Modules */}
        <ControlCenterModules
          activeModule={activeModule}
          onModuleChange={setActiveModule}
          selectedEntity={selectedEntity}
          onEntitySelect={handleEntitySelect}
          showConsole={showConsole}
          onToggleConsole={() => setShowConsole(!showConsole)}
          serviceStatus={serviceStatus}
          entityMemory={entityMemory}
          currentThreatLevel={currentThreatLevel}
        />
      </div>
    </div>
  );
};

export default ControlCenter;
