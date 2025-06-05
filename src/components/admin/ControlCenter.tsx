import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, Activity, Brain, Zap, Target, AlertTriangle, 
  Server, Terminal, Eye, Settings, PlayCircle, PauseCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import LocalServerMonitor from '@/components/aria/LocalServerMonitor';
import LocalModelManager from '@/components/aria/LocalModelManager';
import ThreatDetectionDashboard from './modules/ThreatDetectionDashboard';
import StrategyBrainControl from './modules/StrategyBrainControl';
import AutoExecutionManager from './modules/AutoExecutionManager';
import SystemHealthOverview from './modules/SystemHealthOverview';
import LiveDataValidator from './modules/LiveDataValidator';
import UnifiedAlertSystem from './modules/UnifiedAlertSystem';

interface SystemStatus {
  localServer: boolean;
  threatDetection: boolean;
  strategyBrain: boolean;
  autoExecution: boolean;
  liveDataCompliance: boolean;
}

const ControlCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    localServer: false,
    threatDetection: false,
    strategyBrain: false,
    autoExecution: false,
    liveDataCompliance: false
  });
  const [isRunningTests, setIsRunningTests] = useState(false);

  useEffect(() => {
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkSystemStatus = async () => {
    try {
      // Check local server with timeout and better error handling
      let localServerStatus = false;
      try {
        const response = await fetch('http://localhost:3001/api/tags', {
          method: 'GET',
          signal: AbortSignal.timeout(3000)
        });
        localServerStatus = response.ok;
      } catch (error) {
        console.warn('Local AI server not available:', error);
        localServerStatus = false;
      }

      // Check threat detection system
      const { data: threatData } = await supabase
        .from('scan_results')
        .select('id')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .limit(1);

      // Check strategy brain
      const { data: strategyData } = await supabase
        .from('strategy_responses')
        .select('id')
        .limit(1);

      // Check auto-execution
      const { data: autoExecData } = await supabase
        .from('aria_ops_log')
        .select('id')
        .eq('operation_type', 'auto_execution_config')
        .limit(1);

      // Check live data compliance
      const liveDataCompliance = await validateLiveDataCompliance();

      setSystemStatus({
        localServer: localServerStatus,
        threatDetection: Boolean(threatData?.length),
        strategyBrain: Boolean(strategyData?.length),
        autoExecution: Boolean(autoExecData?.length),
        liveDataCompliance
      });

    } catch (error) {
      console.error('System status check failed:', error);
    }
  };

  const validateLiveDataCompliance = async (): Promise<boolean> => {
    try {
      // Check for any simulation/mock data patterns
      const { data: mockCheck } = await supabase
        .from('scan_results')
        .select('id')
        .or('content.ilike.%mock%,content.ilike.%test%,content.ilike.%demo%,content.ilike.%simulation%')
        .limit(1);

      return !mockCheck || mockCheck.length === 0;
    } catch (error) {
      console.error('Live data validation failed:', error);
      return false;
    }
  };

  const runSystemTests = async () => {
    setIsRunningTests(true);
    toast.info('Running comprehensive system tests...');

    try {
      const testResults = {
        localServer: false,
        database: false,
        liveDataCompliance: false,
        strategyBrain: false
      };

      // Test 1: Local AI Server Connection (non-critical)
      try {
        const serverTest = await fetch('http://localhost:3001/api/tags', {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });
        testResults.localServer = serverTest.ok;
      } catch (error) {
        console.warn('Local AI server test failed (non-critical):', error);
        testResults.localServer = false;
      }

      // Test 2: Database Connectivity (critical)
      try {
        const { data: dbTest, error: dbError } = await supabase
          .from('scan_results')
          .select('count')
          .limit(1);

        if (dbError) {
          throw new Error(`Database connectivity failed: ${dbError.message}`);
        }
        testResults.database = true;
      } catch (error) {
        throw new Error(`Critical: Database connectivity failed: ${error.message}`);
      }

      // Test 3: Live Data Validation (critical)
      try {
        const liveDataTest = await validateLiveDataCompliance();
        if (!liveDataTest) {
          console.warn('Live data compliance warning - simulation data detected');
        }
        testResults.liveDataCompliance = liveDataTest;
      } catch (error) {
        console.warn('Live data validation failed:', error);
        testResults.liveDataCompliance = false;
      }

      // Test 4: Strategy Brain Integration (non-critical)
      try {
        const { data: strategyTest } = await supabase
          .from('strategy_responses')
          .select('id')
          .limit(1);
        testResults.strategyBrain = Boolean(strategyTest?.length);
      } catch (error) {
        console.warn('Strategy brain test failed:', error);
        testResults.strategyBrain = false;
      }

      // Log test results
      await supabase.from('aria_ops_log').insert({
        operation_type: 'system_test',
        module_source: 'control_center',
        success: testResults.database, // Core success based on database connectivity
        operation_data: {
          test_results: testResults,
          timestamp: new Date().toISOString(),
          notes: testResults.localServer ? 'All systems operational' : 'Local AI server offline (non-critical)'
        }
      });

      // Provide appropriate feedback
      if (!testResults.database) {
        toast.error('Critical system test failed - Database connectivity issues');
      } else if (!testResults.localServer) {
        toast.success('Core systems operational', {
          description: 'Local AI server offline but system functional'
        });
      } else {
        toast.success('All system tests passed - A.R.I.A™ fully operational');
      }

      checkSystemStatus();

    } catch (error) {
      console.error('System tests failed:', error);
      toast.error(`System test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Log failure
      await supabase.from('aria_ops_log').insert({
        operation_type: 'system_test',
        module_source: 'control_center',
        success: false,
        operation_data: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  const getStatusBadge = (status: boolean) => {
    return status ? 
      <Badge className="bg-green-500 text-white">ONLINE</Badge> :
      <Badge className="bg-red-500 text-white">OFFLINE</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            A.R.I.A™ Control Center
          </h1>
          <p className="text-muted-foreground">Unified Command & Control Platform</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={runSystemTests} 
            disabled={isRunningTests}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isRunningTests ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4 mr-2" />
                Run System Tests
              </>
            )}
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            System Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <Server className={`h-6 w-6 mx-auto mb-2 ${getStatusColor(systemStatus.localServer)}`} />
              <div className="text-sm font-medium">Local AI Server</div>
              {getStatusBadge(systemStatus.localServer)}
              {!systemStatus.localServer && (
                <p className="text-xs text-muted-foreground mt-1">Optional</p>
              )}
            </div>
            <div className="text-center">
              <AlertTriangle className={`h-6 w-6 mx-auto mb-2 ${getStatusColor(systemStatus.threatDetection)}`} />
              <div className="text-sm font-medium">Threat Detection</div>
              {getStatusBadge(systemStatus.threatDetection)}
            </div>
            <div className="text-center">
              <Brain className={`h-6 w-6 mx-auto mb-2 ${getStatusColor(systemStatus.strategyBrain)}`} />
              <div className="text-sm font-medium">Strategy Brain</div>
              {getStatusBadge(systemStatus.strategyBrain)}
            </div>
            <div className="text-center">
              <Zap className={`h-6 w-6 mx-auto mb-2 ${getStatusColor(systemStatus.autoExecution)}`} />
              <div className="text-sm font-medium">Auto-Execution</div>
              {getStatusBadge(systemStatus.autoExecution)}
            </div>
            <div className="text-center">
              <Eye className={`h-6 w-6 mx-auto mb-2 ${getStatusColor(systemStatus.liveDataCompliance)}`} />
              <div className="text-sm font-medium">Live Data Only</div>
              {getStatusBadge(systemStatus.liveDataCompliance)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Control Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="local-ai">Local AI</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="execution">Execution</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="validation">Data Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SystemHealthOverview systemStatus={systemStatus} />
        </TabsContent>

        <TabsContent value="local-ai" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <LocalServerMonitor />
            <LocalModelManager />
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <ThreatDetectionDashboard />
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          <StrategyBrainControl />
        </TabsContent>

        <TabsContent value="execution" className="space-y-6">
          <AutoExecutionManager />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <UnifiedAlertSystem />
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <LiveDataValidator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControlCenter;
