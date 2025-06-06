
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Brain, 
  FileText, 
  Users, 
  Activity, 
  Database,
  Settings,
  Zap,
  Server
} from 'lucide-react';
import ContentGenerationModule from './ContentGenerationModule';
import LocalAITestModule from './LocalAITestModule';

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
    <Tabs value={activeModule} onValueChange={onModuleChange} className="space-y-4">
      <TabsList className="grid grid-cols-6 gap-1 bg-corporate-darkSecondary border border-corporate-border">
        <TabsTrigger value="overview" className="text-corporate-lightGray data-[state=active]:text-corporate-accent">
          <Shield className="h-4 w-4 mr-1" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="local-ai" className="text-corporate-lightGray data-[state=active]:text-corporate-accent">
          <Brain className="h-4 w-4 mr-1" />
          Local AI
        </TabsTrigger>
        <TabsTrigger value="content" className="text-corporate-lightGray data-[state=active]:text-corporate-accent">
          <FileText className="h-4 w-4 mr-1" />
          Content
        </TabsTrigger>
        <TabsTrigger value="clients" className="text-corporate-lightGray data-[state=active]:text-corporate-accent">
          <Users className="h-4 w-4 mr-1" />
          Clients
        </TabsTrigger>
        <TabsTrigger value="monitoring" className="text-corporate-lightGray data-[state=active]:text-corporate-accent">
          <Activity className="h-4 w-4 mr-1" />
          Monitor
        </TabsTrigger>
        <TabsTrigger value="settings" className="text-corporate-lightGray data-[state=active]:text-corporate-accent">
          <Settings className="h-4 w-4 mr-1" />
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* System Status */}
          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardHeader>
              <CardTitle className="text-corporate-accent flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-corporate-lightGray">Threat Level</span>
                  <Badge variant={currentThreatLevel === 'critical' ? 'destructive' : 'outline'}>
                    {currentThreatLevel.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-corporate-lightGray">Active Entity</span>
                  <span className="text-white text-sm">{selectedEntity || 'None'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-corporate-lightGray">Live Data</span>
                  <Badge variant="outline" className="text-green-400 border-green-400">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardHeader>
              <CardTitle className="text-corporate-accent">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-corporate-accent border-corporate-accent"
                onClick={() => onModuleChange('local-ai')}
              >
                <Brain className="h-3 w-3 mr-1" />
                Test Local AI
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-corporate-accent border-corporate-accent"
                onClick={() => onModuleChange('content')}
              >
                <FileText className="h-3 w-3 mr-1" />
                Generate Content
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-corporate-accent border-corporate-accent"
                onClick={onToggleConsole}
              >
                <Server className="h-3 w-3 mr-1" />
                {showConsole ? 'Hide' : 'Show'} Console
              </Button>
            </CardContent>
          </Card>

          {/* Entity Memory */}
          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardHeader>
              <CardTitle className="text-corporate-accent flex items-center gap-2">
                <Database className="h-5 w-5" />
                Entity Memory
              </CardTitle>
            </CardHeader>
            <CardContent>
              {entityMemory.length > 0 ? (
                <div className="space-y-2">
                  {entityMemory.slice(0, 3).map((memory, index) => (
                    <div key={index} className="text-xs p-2 bg-corporate-dark rounded border border-corporate-border">
                      <div className="text-corporate-accent">{memory.entity_name}</div>
                      <div className="text-corporate-lightGray truncate">{memory.content}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-corporate-lightGray text-sm py-4">
                  No entity context loaded
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="local-ai">
        <LocalAITestModule selectedEntity={selectedEntity} />
      </TabsContent>

      <TabsContent value="content">
        <ContentGenerationModule 
          selectedEntity={selectedEntity}
          serviceStatus={serviceStatus}
        />
      </TabsContent>

      <TabsContent value="clients" className="space-y-4">
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-corporate-accent">Client Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">Client management features will be integrated here.</p>
            <Button 
              variant="outline" 
              className="mt-4 text-corporate-accent border-corporate-accent"
              onClick={() => window.location.href = '/admin/clients'}
            >
              Open Full Client Management
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="monitoring" className="space-y-4">
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-corporate-accent">Live Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">Real-time monitoring dashboard will be integrated here.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-corporate-accent">System Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">System configuration options will be integrated here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ControlCenterModules;
