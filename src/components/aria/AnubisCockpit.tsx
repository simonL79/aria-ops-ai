
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Shield, 
  AlertTriangle, 
  RefreshCw, 
  Zap,
  Eye,
  Brain,
  Target
} from "lucide-react";
import { LiveDataValidator, LiveDataValidationResult } from '@/services/liveDataValidator';
import { 
  initializeLiveSystem, 
  triggerPipelineProcessing, 
  getQueueStatus, 
  getLiveThreats,
  getSystemHealth 
} from '@/services/ariaCore/threatIngestion';
import { 
  startMonitoring, 
  stopMonitoring, 
  getMonitoringStatus, 
  runMonitoringScan 
} from '@/services/monitoring';
import SystemInitializationPanel from './SystemInitializationPanel';
import { toast } from 'sonner';

const AnubisCockpit = () => {
  const [validationResult, setValidationResult] = useState<LiveDataValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [queueStatus, setQueueStatus] = useState<any[]>([]);
  const [liveThreats, setLiveThreats] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any[]>([]);
  const [monitoringStatus, setMonitoringStatus] = useState<any>({});

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      validateSystem(),
      loadQueueStatus(),
      loadSystemHealth(),
      loadMonitoringStatus()
    ]);
  };

  const validateSystem = async () => {
    setIsValidating(true);
    try {
      const result = await LiveDataValidator.validateLiveIntegrity();
      setValidationResult(result);
    } catch (error) {
      console.error('Validation failed:', error);
      toast.error('System validation failed');
    } finally {
      setIsValidating(false);
    }
  };

  const loadQueueStatus = async () => {
    try {
      const status = await getQueueStatus();
      setQueueStatus(status);
    } catch (error) {
      console.error('Failed to load queue status:', error);
    }
  };

  const loadSystemHealth = async () => {
    try {
      const health = await getSystemHealth();
      setSystemHealth(health);
    } catch (error) {
      console.error('Failed to load system health:', error);
    }
  };

  const loadMonitoringStatus = async () => {
    try {
      const status = await getMonitoringStatus();
      setMonitoringStatus(status);
    } catch (error) {
      console.error('Failed to load monitoring status:', error);
    }
  };

  const handleRefreshLiveData = async () => {
    setIsProcessing(true);
    try {
      console.log('🔄 Refreshing live data...');
      
      // Trigger live system initialization
      const initResult = await initializeLiveSystem();
      console.log('🚀 Live system initialized:', initResult);
      
      // Refresh all data
      await loadInitialData();
      
      toast.success('Live data refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh live data:', error);
      toast.error('Failed to refresh live data');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessThreats = async () => {
    setIsProcessing(true);
    try {
      console.log('⚡ Processing live threats...');
      
      // Trigger pipeline processing
      const result = await triggerPipelineProcessing();
      console.log('✅ Pipeline processing result:', result);
      
      // Get updated live threats
      const threats = await getLiveThreats();
      setLiveThreats(threats);
      
      // Refresh queue status
      await loadQueueStatus();
      
      toast.success(`Live processing completed: ${result?.processed || 0} threats processed`);
    } catch (error) {
      console.error('Failed to process threats:', error);
      toast.error('Failed to process threats');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartMonitoring = async () => {
    try {
      await startMonitoring();
      await loadMonitoringStatus();
      toast.success('Live monitoring started');
    } catch (error) {
      console.error('Failed to start monitoring:', error);
      toast.error('Failed to start monitoring');
    }
  };

  const handleRunScan = async () => {
    try {
      console.log('🔍 Running live monitoring scan...');
      const results = await runMonitoringScan();
      console.log('📊 Scan results:', results);
      
      await loadMonitoringStatus();
      toast.success(`Live scan completed: ${results.length} results found`);
    } catch (error) {
      console.error('Failed to run scan:', error);
      toast.error('Failed to run scan');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Anubis Control Center
          </h1>
          <p className="text-muted-foreground">
            A.R.I.A™ Live System Monitoring & Control Dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefreshLiveData} disabled={isProcessing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
            Refresh Live Data
          </Button>
          <Button onClick={handleProcessThreats} disabled={isProcessing}>
            <Zap className="h-4 w-4 mr-2" />
            Process Threats
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="validation">System Health</TabsTrigger>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="threats">Threat Queue</TabsTrigger>
          <TabsTrigger value="initialization">Initialize</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {validationResult ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {validationResult.isValid ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          OPERATIONAL
                        </Badge>
                      ) : (
                        <Badge variant="destructive">ISSUES DETECTED</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {validationResult.passedChecks}/{validationResult.totalChecks} checks passed
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Click "Refresh Live Data" to check system status
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Threat Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {queueStatus.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm capitalize">{item.status}:</span>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  ))}
                  {queueStatus.length === 0 && (
                    <div className="text-sm text-muted-foreground">No queue data available</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Live Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {monitoringStatus.isActive ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        ACTIVE
                      </Badge>
                    ) : (
                      <Badge variant="secondary">INACTIVE</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Sources: {monitoringStatus.sources || 0} | 
                    Platforms: {monitoringStatus.platforms || 0}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleStartMonitoring}>
                      Start Monitoring
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleRunScan}>
                      Run Scan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="validation">
          <Card>
            <CardHeader>
              <CardTitle>System Validation Results</CardTitle>
            </CardHeader>
            <CardContent>
              {validationResult ? (
                <div className="space-y-4">
                  {validationResult.errors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-red-600">Critical Issues:</h4>
                      {validationResult.errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {error}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {validationResult.warnings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-yellow-600">Warnings:</h4>
                      {validationResult.warnings.map((warning, index) => (
                        <div key={index} className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                          {warning}
                        </div>
                      ))}
                    </div>
                  )}

                  {validationResult.errors.length === 0 && validationResult.warnings.length === 0 && (
                    <div className="text-green-600 bg-green-50 p-3 rounded">
                      ✅ All system checks passed successfully
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Button onClick={validateSystem} disabled={isValidating}>
                    {isValidating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Run System Validation
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Live Monitoring Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Status:</label>
                    <div className="mt-1">
                      {monitoringStatus.isActive ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          MONITORING ACTIVE
                        </Badge>
                      ) : (
                        <Badge variant="secondary">MONITORING INACTIVE</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Run:</label>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {monitoringStatus.lastRun ? 
                        new Date(monitoringStatus.lastRun).toLocaleString() : 
                        'Never'
                      }
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleStartMonitoring}>
                    <Activity className="h-4 w-4 mr-2" />
                    Start Live Monitoring
                  </Button>
                  <Button onClick={handleRunScan} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Manual Scan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats">
          <Card>
            <CardHeader>
              <CardTitle>Live Threat Processing Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {queueStatus.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {queueStatus.map((item, index) => (
                      <div key={index} className="border rounded p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">{item.status}</span>
                          <Badge variant="outline">{item.count}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No threat queue data available. Click "Process Threats" to initialize.
                  </div>
                )}
                
                <Button onClick={handleProcessThreats} disabled={isProcessing}>
                  <Zap className="h-4 w-4 mr-2" />
                  Process Live Threats
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="initialization">
          <SystemInitializationPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnubisCockpit;
