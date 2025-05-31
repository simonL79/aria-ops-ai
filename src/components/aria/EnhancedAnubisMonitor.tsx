
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Shield, Brain, AlertTriangle, Eye, Scale } from 'lucide-react';
import { 
  AnubisService, 
  AnubisSystemStatus, 
  AnubisLogEntry, 
  LLMThreatMonitor, 
  GraveyardSimulation, 
  LegalEscalation,
  AnubisSystemReport 
} from '@/services/aria/anubisService';
import { toast } from 'sonner';

const EnhancedAnubisMonitor = () => {
  const [systemStatus, setSystemStatus] = useState<AnubisSystemStatus[]>([]);
  const [llmThreats, setLlmThreats] = useState<LLMThreatMonitor[]>([]);
  const [graveyardSims, setGraveyardSims] = useState<GraveyardSimulation[]>([]);
  const [legalEscalations, setLegalEscalations] = useState<LegalEscalation[]>([]);
  const [systemLogs, setSystemLogs] = useState<AnubisLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [status, threats, simulations, escalations, logs] = await Promise.all([
        AnubisService.getSystemStatus(),
        AnubisService.getLLMThreats(),
        AnubisService.getGraveyardSimulations(),
        AnubisService.getLegalEscalations(),
        AnubisService.getSystemLogs(20)
      ]);
      
      setSystemStatus(status);
      setLlmThreats(threats);
      setGraveyardSims(simulations);
      setLegalEscalations(escalations);
      setSystemLogs(logs);
    } catch (error) {
      console.error('Failed to load enhanced Anubis data:', error);
      toast.error('Failed to load system data');
    } finally {
      setIsLoading(false);
    }
  };

  const runEnhancedDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    try {
      const result = await AnubisService.runEnhancedDiagnostics();
      toast.success(`Enhanced diagnostics completed: ${result.overall_status}`);
      loadAllData();
    } catch (error) {
      console.error('Enhanced diagnostics failed:', error);
      toast.error('Enhanced diagnostics failed');
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <Shield className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'offline': return <Eye className="h-4 w-4 text-gray-500" />;
      default: return <Brain className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading enhanced Anubis system data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Enhanced Anubis Intelligence Monitor
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={loadAllData}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh All
              </Button>
              <Button
                onClick={runEnhancedDiagnostics}
                variant="default"
                size="sm"
                disabled={isRunningDiagnostics}
              >
                <Brain className={`h-4 w-4 mr-2 ${isRunningDiagnostics ? 'animate-pulse' : ''}`} />
                Enhanced Diagnostics
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="llm-threats">LLM Threats</TabsTrigger>
          <TabsTrigger value="graveyard">Graveyard</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemStatus.map((status) => (
              <Card key={status.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.status)}
                      <span className="font-medium">
                        {AnubisService.getModuleName(status.module)}
                      </span>
                    </div>
                    <Badge className={getStatusColor(status.status)}>
                      {status.status}
                    </Badge>
                  </div>
                  
                  {status.issue_summary && (
                    <p className="text-sm text-gray-600 mb-2">{status.issue_summary}</p>
                  )}
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Last: {new Date(status.last_checked).toLocaleTimeString()}</span>
                    {status.record_count !== undefined && (
                      <span>Records: {status.record_count}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="llm-threats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                LLM Threat Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {llmThreats.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No LLM threats detected
                  </div>
                ) : (
                  llmThreats.map((threat) => (
                    <div key={threat.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{threat.entity_name}</span>
                        <Badge className="bg-purple-100 text-purple-800">
                          {threat.mention_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Vector Score: {Math.round(threat.vector_score * 100)}%
                      </p>
                      {threat.captured_response && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {threat.captured_response}
                        </p>
                      )}
                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(threat.recorded_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graveyard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Graveyard Simulations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {graveyardSims.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No graveyard simulations active
                  </div>
                ) : (
                  graveyardSims.map((sim) => (
                    <div key={sim.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{sim.leak_title || 'Unnamed Simulation'}</span>
                        <Badge className="bg-orange-100 text-orange-800">
                          {sim.suppression_status}
                        </Badge>
                      </div>
                      {sim.expected_trigger_module && (
                        <p className="text-sm text-gray-600 mb-2">
                          Expected Trigger: {sim.expected_trigger_module}
                        </p>
                      )}
                      <div className="text-xs text-gray-400">
                        Injected: {new Date(sim.injected_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Legal Escalations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {legalEscalations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No legal escalations pending
                  </div>
                ) : (
                  legalEscalations.map((escalation) => (
                    <div key={escalation.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{escalation.violation_type || 'Unknown Violation'}</span>
                        <Badge className="bg-red-100 text-red-800">
                          {escalation.delivery_status}
                        </Badge>
                      </div>
                      {escalation.jurisdiction && (
                        <p className="text-sm text-gray-600 mb-2">
                          Jurisdiction: {escalation.jurisdiction}
                        </p>
                      )}
                      {escalation.law_firm_contact && (
                        <p className="text-sm text-gray-600 mb-2">
                          Contact: {escalation.law_firm_contact}
                        </p>
                      )}
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{new Date(escalation.created_at).toLocaleString()}</span>
                        <span>{escalation.auto_generated ? 'Auto-Generated' : 'Manual'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>System Activity Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {systemLogs.map((log) => (
                  <div key={log.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <Badge className={`text-xs ${
                        log.level === 'error' ? 'bg-red-100 text-red-800' :
                        log.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        log.level === 'info' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.level}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{log.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnubisMonitor;
