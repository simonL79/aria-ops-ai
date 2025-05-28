import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Activity, Zap, AlertTriangle, Play, RefreshCw, Brain, Eye, Target, Monitor } from 'lucide-react';
import { hypercoreService, RSIQueueItem, EventDispatch } from '@/services/aria/hypercoreService';
import { anubisService } from '@/services/aria/anubisService';
import AnubisMonitor from './AnubisMonitor';

const HyperCoreDashboard = () => {
  const [rsiQueue, setRSIQueue] = useState<RSIQueueItem[]>([]);
  const [eventQueue, setEventQueue] = useState<EventDispatch[]>([]);
  const [operationsLog, setOperationsLog] = useState<any[]>([]);
  const [syntheticThreats, setSyntheticThreats] = useState<any[]>([]);
  const [narrativeClusters, setNarrativeClusters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulationTarget, setSimulationTarget] = useState('');
  const [systemHealth, setSystemHealth] = useState({
    overallStatus: 'healthy' as const,
    moduleCount: 0,
    issueCount: 0,
    lastCheck: null as string | null
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [rsi, events, ops, synthetic, narrative, health] = await Promise.all([
        hypercoreService.getRSIQueue(),
        hypercoreService.getEventDispatchQueue(),
        hypercoreService.getAriaOperationsLog(),
        hypercoreService.getSyntheticThreats(),
        hypercoreService.getNarrativeClusters(),
        anubisService.getSystemHealth()
      ]);
      
      setRSIQueue(rsi);
      setEventQueue(events);
      setOperationsLog(ops);
      setSyntheticThreats(synthetic);
      setNarrativeClusters(narrative);
      setSystemHealth(health);
    } catch (error) {
      console.error('Error loading HyperCore data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleManualDispatch = async () => {
    await hypercoreService.triggerManualDispatch();
    loadData();
  };

  const handleSimulateThreat = async () => {
    if (!simulationTarget.trim()) {
      return;
    }
    await hypercoreService.simulateThreatDetection(simulationTarget);
    setSimulationTarget('');
    setTimeout(() => loadData(), 1000);
  };

  const handleUpdateRSIStatus = async (id: string, status: RSIQueueItem['status']) => {
    await hypercoreService.updateRSIStatus(id, status);
    loadData();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'normal': return 'outline';
      default: return 'default';
    }
  };

  const getSystemHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            A.R.I.A™ HyperCore
          </h1>
          <p className="text-muted-foreground">Advanced Threat Intelligence & Response System</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleManualDispatch}>
            <Zap className="h-4 w-4 mr-2" />
            Manual Dispatch
          </Button>
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold capitalize ${getSystemHealthColor(systemHealth.overallStatus)}`}>
              {systemHealth.overallStatus}
            </div>
            <p className="text-xs text-muted-foreground">
              {systemHealth.moduleCount} modules • {systemHealth.issueCount} issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RSI Queue</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rsiQueue.length}</div>
            <p className="text-xs text-muted-foreground">
              {rsiQueue.filter(r => r.status === 'pending').length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Queue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventQueue.length}</div>
            <p className="text-xs text-muted-foreground">
              {eventQueue.filter(e => !e.dispatched).length} undispatched
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Synthetic Threats</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syntheticThreats.length}</div>
            <p className="text-xs text-muted-foreground">
              AI-generated content detected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operations</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationsLog.length}</div>
            <p className="text-xs text-muted-foreground">
              System operations logged
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Threat Simulation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="simulation-target">Entity Name</Label>
              <Input
                id="simulation-target"
                value={simulationTarget}
                onChange={(e) => setSimulationTarget(e.target.value)}
                placeholder="Enter entity name to simulate threat detection..."
              />
            </div>
            <Button 
              onClick={handleSimulateThreat} 
              disabled={!simulationTarget.trim()}
              className="mt-6"
            >
              <Play className="h-4 w-4 mr-2" />
              Simulate Threat
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="anubis" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="anubis">Anubis Monitor</TabsTrigger>
          <TabsTrigger value="rsi">RSI Queue</TabsTrigger>
          <TabsTrigger value="events">Event Dispatch</TabsTrigger>
          <TabsTrigger value="synthetic">Synthetic Threats</TabsTrigger>
          <TabsTrigger value="narrative">Narrative Clusters</TabsTrigger>
          <TabsTrigger value="operations">Operations Log</TabsTrigger>
        </TabsList>

        <TabsContent value="anubis" className="space-y-4">
          <AnubisMonitor />
        </TabsContent>

        <TabsContent value="rsi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapid Sentiment Intervention Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {rsiQueue.length === 0 ? (
                <Alert>
                  <AlertDescription>No RSI items in queue</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {rsiQueue.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={getPriorityColor(item.priority)}>
                          {item.priority.toUpperCase()}
                        </Badge>
                        <div className="flex gap-2">
                          <Badge variant="outline">{item.status}</Badge>
                          {item.status === 'pending' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdateRSIStatus(item.id, 'processing')}
                            >
                              Process
                            </Button>
                          )}
                          {item.status === 'processing' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdateRSIStatus(item.id, 'deployed')}
                            >
                              Deploy
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm">{item.counter_message}</p>
                      <p className="text-xs text-muted-foreground">
                        Entity: {item.entity_id} | Created: {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Dispatch Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {eventQueue.length === 0 ? (
                <Alert>
                  <AlertDescription>No events in dispatch queue</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {eventQueue.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(event.severity)}>
                            {event.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">{event.event_type}</span>
                        </div>
                        <Badge variant={event.dispatched ? "default" : "destructive"}>
                          {event.dispatched ? "Dispatched" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(event.created_at).toLocaleString()}
                        {event.dispatched_at && ` | Dispatched: ${new Date(event.dispatched_at).toLocaleString()}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="synthetic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Synthetic Threat Index</CardTitle>
            </CardHeader>
            <CardContent>
              {syntheticThreats.length === 0 ? (
                <Alert>
                  <AlertDescription>No synthetic threats detected</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {syntheticThreats.map((threat) => (
                    <div key={threat.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={threat.is_ai_generated ? "destructive" : "default"}>
                          {threat.is_ai_generated ? "AI Generated" : "Human Generated"}
                        </Badge>
                        <span className="text-sm">Confidence: {Math.round(threat.confidence_score * 100)}%</span>
                      </div>
                      <p className="text-sm">{threat.content}</p>
                      <p className="text-xs text-muted-foreground">
                        Type: {threat.content_type} | Detected: {new Date(threat.inserted_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="narrative" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Narrative Clustering Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {narrativeClusters.length === 0 ? (
                <Alert>
                  <AlertDescription>No narrative clusters detected</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {narrativeClusters.map((cluster) => (
                    <div key={cluster.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{cluster.cluster_topic}</span>
                        <Badge variant={cluster.attack_surface_score > 0.7 ? "destructive" : "default"}>
                          Attack Surface: {Math.round(cluster.attack_surface_score * 100)}%
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Sentiment: {cluster.sentiment_trend.toFixed(2)}</span>
                        <span>Velocity: {cluster.velocity_score.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Platforms: {cluster.source_platforms?.join(', ') || 'Unknown'} | 
                        Updated: {new Date(cluster.last_updated).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operations Log</CardTitle>
            </CardHeader>
            <CardContent>
              {operationsLog.length === 0 ? (
                <Alert>
                  <AlertDescription>No operations logged</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {operationsLog.map((op) => (
                    <div key={op.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{op.operation_type}</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">{op.module_source}</Badge>
                          <Badge variant={op.success ? "default" : "destructive"}>
                            {op.success ? "Success" : "Failed"}
                          </Badge>
                        </div>
                      </div>
                      {op.error_message && (
                        <p className="text-sm text-red-600">{op.error_message}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(op.created_at).toLocaleString()}
                        {op.execution_time_ms && ` | ${op.execution_time_ms}ms`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HyperCoreDashboard;
