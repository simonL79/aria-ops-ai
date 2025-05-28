
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Activity, Zap, AlertTriangle, Play, RefreshCw } from 'lucide-react';
import { hypercoreService, RSIQueueItem, EventDispatch } from '@/services/aria/hypercoreService';

const HyperCoreDashboard = () => {
  const [rsiQueue, setRSIQueue] = useState<RSIQueueItem[]>([]);
  const [eventQueue, setEventQueue] = useState<EventDispatch[]>([]);
  const [operationsLog, setOperationsLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rsi, events, ops] = await Promise.all([
        hypercoreService.getRSIQueue(),
        hypercoreService.getEventDispatchQueue(),
        hypercoreService.getAriaOperationsLog()
      ]);
      
      setRSIQueue(rsi);
      setEventQueue(events);
      setOperationsLog(ops);
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
    loadData(); // Reload data after dispatch
  };

  const handleSimulateThreat = async () => {
    await hypercoreService.simulateThreatDetection('Test Entity');
    setTimeout(() => loadData(), 1000); // Reload after simulation
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
          <Button onClick={handleSimulateThreat} variant="outline">
            <Play className="h-4 w-4 mr-2" />
            Simulate Threat
          </Button>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <CardTitle className="text-sm font-medium">Operations</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationsLog.length}</div>
            <p className="text-xs text-muted-foreground">
              Last 24h operations
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rsi" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rsi">RSI Queue</TabsTrigger>
          <TabsTrigger value="events">Event Dispatch</TabsTrigger>
          <TabsTrigger value="operations">Operations Log</TabsTrigger>
        </TabsList>

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
                        <Badge variant="outline">{item.status}</Badge>
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
                        <span className="font-medium">{op.event_type}</span>
                        {op.gdpr_violation_detected && (
                          <Badge variant="destructive">GDPR Alert</Badge>
                        )}
                      </div>
                      {op.counter_message && (
                        <p className="text-sm">{op.counter_message}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(op.created_at).toLocaleString()}
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
