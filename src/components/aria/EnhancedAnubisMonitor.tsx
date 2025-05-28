import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Activity, AlertTriangle, CheckCircle, XCircle, RefreshCw, Eye, Clock, Brain, Zap, Scale, Target, MessageSquare } from 'lucide-react';
import { anubisService, AnubisState, LLMThreatMonitor, GraveyardSimulation, LegalEscalation } from '@/services/aria/anubisService';
import AnubisGPTCockpit from './AnubisGPTCockpit';

const EnhancedAnubisMonitor = () => {
  const [systemStatus, setSystemStatus] = useState<AnubisState[]>([]);
  const [llmThreats, setLLMThreats] = useState<LLMThreatMonitor[]>([]);
  const [graveyardSims, setGraveyardSims] = useState<GraveyardSimulation[]>([]);
  const [legalEscalations, setLegalEscalations] = useState<LegalEscalation[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [status, threats, sims, legal, logs] = await Promise.all([
        anubisService.getSystemStatus(),
        anubisService.getLLMThreats(),
        anubisService.getGraveyardSimulations(),
        anubisService.getLegalEscalations(),
        anubisService.getSystemLogs()
      ]);
      
      setSystemStatus(status);
      setLLMThreats(threats);
      setGraveyardSims(sims);
      setLegalEscalations(legal);
      setSystemLogs(logs);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  const runEnhancedDiagnostics = async () => {
    setLoading(true);
    try {
      await anubisService.runEnhancedDiagnostics();
      await loadAllData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getThreatTypeColor = (type: string) => {
    switch (type) {
      case 'threatening': return 'destructive';
      case 'false_claim': return 'secondary';
      case 'attack': return 'destructive';
      default: return 'outline';
    }
  };

  const overallStatus = systemStatus.length > 0 
    ? systemStatus.some(s => s.status === 'error') ? 'critical'
      : systemStatus.some(s => s.status === 'warning') ? 'warning' 
      : 'healthy'
    : 'healthy';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-600" />
            A.R.I.A™ Enhanced Anubis Monitor
          </h2>
          <p className="text-muted-foreground">Sovereign-grade system monitoring with LLM counterintel</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runEnhancedDiagnostics} disabled={loading}>
            <Zap className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Enhanced Diagnostics
          </Button>
          <Button onClick={loadAllData} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Enhanced Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            {getStatusIcon(overallStatus)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{overallStatus}</div>
            <p className="text-xs text-muted-foreground">{systemStatus.length} modules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LLM Threats</CardTitle>
            <Brain className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{llmThreats.length}</div>
            <p className="text-xs text-muted-foreground">
              {llmThreats.filter(t => t.mention_type !== 'neutral').length} hostile
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graveyard Ops</CardTitle>
            <Target className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{graveyardSims.length}</div>
            <p className="text-xs text-muted-foreground">
              {graveyardSims.filter(s => s.suppression_status === 'pending').length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Legal Queue</CardTitle>
            <Scale className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{legalEscalations.length}</div>
            <p className="text-xs text-muted-foreground">
              {legalEscalations.filter(l => l.delivery_status === 'pending').length} queued
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Logs</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemLogs.length}</div>
            <p className="text-xs text-muted-foreground">Recent activity</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules">Core Modules</TabsTrigger>
          <TabsTrigger value="gpt-cockpit" className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            GPT Cockpit
          </TabsTrigger>
          <TabsTrigger value="llm">LLM Intel</TabsTrigger>
          <TabsTrigger value="graveyard">Graveyard Ops</TabsTrigger>
          <TabsTrigger value="legal">Legal Node</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>A.R.I.A™ Module Health Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemStatus.map((module) => (
                  <div key={module.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{module.module}</div>
                      <Badge variant={module.status === 'healthy' ? 'default' : module.status === 'warning' ? 'secondary' : 'destructive'}>
                        {getStatusIcon(module.status)}
                        <span className="ml-1 capitalize">{module.status}</span>
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {anubisService.getModuleName(module.module)}
                    </div>
                    {module.anomaly_detected && (
                      <div className="text-sm text-red-600">{module.issue_summary}</div>
                    )}
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last checked: {new Date(module.last_checked).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gpt-cockpit">
          <AnubisGPTCockpit />
        </TabsContent>

        <TabsContent value="llm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                LLM Threat Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {llmThreats.map((threat) => (
                  <div key={threat.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{threat.entity_name}</span>
                      <Badge variant={getThreatTypeColor(threat.mention_type)}>
                        {threat.mention_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    {threat.model_detected && (
                      <div className="text-sm text-muted-foreground">Model: {threat.model_detected}</div>
                    )}
                    <div className="text-sm">Vector Score: {threat.vector_score.toFixed(3)}</div>
                    {threat.captured_response && (
                      <div className="text-sm bg-muted p-2 rounded">{threat.captured_response}</div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {new Date(threat.recorded_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graveyard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Graveyard Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {graveyardSims.map((sim) => (
                  <div key={sim.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{sim.leak_title || 'Classified Operation'}</span>
                      <Badge variant={sim.suppression_status === 'pending' ? 'secondary' : 'default'}>
                        {sim.suppression_status.toUpperCase()}
                      </Badge>
                    </div>
                    {sim.expected_trigger_module && (
                      <div className="text-sm text-muted-foreground">
                        Target: {sim.expected_trigger_module}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Injected: {new Date(sim.injected_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Legal Escalation Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {legalEscalations.map((legal) => (
                  <div key={legal.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{legal.violation_type || 'Legal Matter'}</span>
                      <Badge variant={legal.delivery_status === 'pending' ? 'secondary' : legal.delivery_status === 'error' ? 'destructive' : 'default'}>
                        {legal.delivery_status.toUpperCase()}
                      </Badge>
                    </div>
                    {legal.jurisdiction && (
                      <div className="text-sm text-muted-foreground">Jurisdiction: {legal.jurisdiction}</div>
                    )}
                    <div className="text-sm flex items-center gap-2">
                      <span>Auto-generated: {legal.auto_generated ? 'Yes' : 'No'}</span>
                      {legal.law_firm_contact && <span>• Contact: {legal.law_firm_contact}</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(legal.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enhanced System Diagnostic Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {systemLogs.map((log) => (
                  <div key={log.id} className="border rounded p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{log.module} - {log.check_type}</div>
                      <Badge variant="outline">{log.result_status}</Badge>
                    </div>
                    <div className="text-muted-foreground mt-1">{log.details}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(log.checked_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {lastUpdate && (
        <div className="text-xs text-muted-foreground text-center">
          Last updated: {lastUpdate.toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default EnhancedAnubisMonitor;
