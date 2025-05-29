import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Database,
  Zap,
  Play,
  RefreshCw,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { 
  getLiveThreats, 
  getQueueStatus, 
  triggerPipelineProcessing, 
  getSystemHealth,
  initializeLiveSystem 
} from '@/services/ariaCore/threatIngestion';
import { getMonitoringStatus, startMonitoring } from '@/services/monitoring';

const AnubisCockpit = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Live data states
  const [liveThreats, setLiveThreats] = useState([]);
  const [queueStatus, setQueueStatus] = useState([]);
  const [systemHealth, setSystemHealth] = useState([]);
  const [monitoringStatus, setMonitoringStatus] = useState(null);
  const [systemStats, setSystemStats] = useState({
    totalThreats: 0,
    activeThreats: 0,
    pendingQueue: 0,
    systemStatus: 'INITIALIZING'
  });

  useEffect(() => {
    initializeSystem();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(refreshLiveData, 30000);
    return () => clearInterval(interval);
  }, []);

  const initializeSystem = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Initializing A.R.I.A™ live system...');
      
      // Initialize the live system
      const initResult = await initializeLiveSystem();
      console.log('System initialization result:', initResult);
      
      // Start monitoring
      await startMonitoring();
      
      // Load all live data
      await refreshLiveData();
      
      toast.success('🚀 A.R.I.A™ live system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize system:', error);
      toast.error('Failed to initialize A.R.I.A™ system');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshLiveData = async () => {
    try {
      console.log('🔄 Refreshing live data...');
      
      const [threats, queue, health, monitoring] = await Promise.all([
        getLiveThreats(),
        getQueueStatus(),
        getSystemHealth(),
        getMonitoringStatus()
      ]);

      setLiveThreats(threats);
      setQueueStatus(queue);
      setSystemHealth(health);
      setMonitoringStatus(monitoring);
      
      // Calculate stats with proper type checking
      const pendingItems = queue.find(q => q.status === 'pending')?.count || 0;
      const activeThreats = threats.filter(t => t.status === 'active').length;
      
      setSystemStats({
        totalThreats: threats.length,
        activeThreats,
        pendingQueue: typeof pendingItems === 'number' ? pendingItems : 0,
        systemStatus: monitoring?.isActive ? 'LIVE' : 'OFFLINE'
      });
      
      console.log('✅ Live data refreshed:', {
        threats: threats.length,
        queue: queue.length,
        health: health.length,
        activeThreats
      });
      
    } catch (error) {
      console.error('Error refreshing live data:', error);
    }
  };

  const triggerLiveProcessing = async () => {
    setIsProcessing(true);
    try {
      console.log('🔥 Triggering live threat processing...');
      
      const result = await triggerPipelineProcessing();
      console.log('Processing result:', result);
      
      // Refresh data after processing
      await refreshLiveData();
      
      toast.success(`🔥 Live processing completed: ${result?.processed || 0} threats processed`);
    } catch (error) {
      console.error('Processing failed:', error);
      toast.error('Live processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE':
      case 'ok': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'fail':
      case 'OFFLINE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2">Initializing A.R.I.A™ live system...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-purple-600" />
            A.R.I.A™ Anubis Cockpit
          </h1>
          <p className="text-muted-foreground">Live Advanced Reputation Intelligence & Activation</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={refreshLiveData}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Live Data
          </Button>
          <Button 
            onClick={triggerLiveProcessing}
            disabled={isProcessing}
            size="sm"
          >
            <Play className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? 'Processing...' : 'Process Threats'}
          </Button>
        </div>
      </div>

      {/* Live Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Status</p>
                <p className="text-2xl font-bold">{systemStats.systemStatus}</p>
              </div>
              <Badge className={getStatusColor(systemStats.systemStatus)}>
                LIVE
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Threats</p>
                <p className="text-2xl font-bold text-red-600">{systemStats.activeThreats}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Threats</p>
                <p className="text-2xl font-bold">{systemStats.totalThreats}</p>
              </div>
              <Database className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Queue Pending</p>
                <p className="text-2xl font-bold text-orange-600">{systemStats.pendingQueue}</p>
              </div>
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="overview">Live Overview</TabsTrigger>
          <TabsTrigger value="threats">Active Threats</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Processing Queue</CardTitle>
              </CardHeader>
              <CardContent>
                {queueStatus.length === 0 ? (
                  <p className="text-muted-foreground">No queue data available</p>
                ) : (
                  <div className="space-y-2">
                    {queueStatus.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <span className="capitalize">{item.status}</span>
                        <Badge variant="outline">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health Checks</CardTitle>
              </CardHeader>
              <CardContent>
                {systemHealth.length === 0 ? (
                  <p className="text-muted-foreground">No health data available</p>
                ) : (
                  <div className="space-y-2">
                    {systemHealth.slice(0, 5).map((check) => (
                      <div key={check.id} className="flex justify-between items-center p-2 border rounded">
                        <span className="capitalize">{check.module}</span>
                        <Badge className={getStatusColor(check.status)}>
                          {check.status.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats">
          <Card>
            <CardHeader>
              <CardTitle>Live Active Threats</CardTitle>
            </CardHeader>
            <CardContent>
              {liveThreats.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">No active threats detected</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {liveThreats.slice(0, 10).map((threat) => (
                    <div key={threat.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{threat.source}</p>
                          <p className="text-sm text-muted-foreground">
                            Risk Score: {threat.risk_score}/100
                          </p>
                        </div>
                        <Badge className={getStatusColor(threat.status)}>
                          {threat.status}
                        </Badge>
                      </div>
                      <p className="text-sm">{threat.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Detected: {new Date(threat.detected_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Detailed System Health</CardTitle>
            </CardHeader>
            <CardContent>
              {systemHealth.length === 0 ? (
                <p className="text-muted-foreground">No health checks available</p>
              ) : (
                <div className="space-y-4">
                  {systemHealth.map((check) => (
                    <div key={check.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium capitalize">{check.module}</p>
                          <p className="text-sm text-muted-foreground">{check.details}</p>
                        </div>
                        <Badge className={getStatusColor(check.status)}>
                          {check.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Checked: {new Date(check.check_time).toLocaleString()}
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

export default AnubisCockpit;
