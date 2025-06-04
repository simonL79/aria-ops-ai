
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { GenesisSystemHealthService } from '@/services/genesis/systemHealthService';
import { Shield, Activity, AlertTriangle, CheckCircle, Clock, Target, Database, Zap, Globe, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface HealthMetrics {
  liveDataCompliance: number;
  entityLinkageRate: number;
  systemUptime: number;
  mockDataDetected: number;
  confidencePipelineHealth: number;
  totalThreatsProcessed: number;
  avgResponseTime: number;
}

interface ComponentHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: string;
  responseTime: number;
  details: string;
  category: 'core' | 'scanner' | 'edge_function' | 'database';
}

const GenesisSentinelPanel = () => {
  // All hooks at the top level - no conditional hooks
  const [isRunningHealthCheck, setIsRunningHealthCheck] = useState(false);
  const [healthData, setHealthData] = useState<{
    components: ComponentHealth[];
    metrics: HealthMetrics;
    overallHealth: 'healthy' | 'degraded' | 'critical';
  } | null>(null);
  const [lastHealthCheck, setLastHealthCheck] = useState<string | null>(null);

  // Single useEffect with proper dependencies
  useEffect(() => {
    runSystemHealthCheck();
  }, []); // Empty dependency array to run only on mount

  const runSystemHealthCheck = async () => {
    setIsRunningHealthCheck(true);
    try {
      console.log('🔥 Genesis Sentinel: Starting comprehensive system health check');
      toast.info('Genesis Sentinel: Running comprehensive A.R.I.A system health check...');
      
      const results = await GenesisSystemHealthService.runFullSystemCheck();
      setHealthData(results);
      setLastHealthCheck(new Date().toISOString());
      
      const statusMessage = `✅ Health Check Complete: ${results.overallHealth.toUpperCase()} - ${results.components.length} components checked`;
      
      if (results.overallHealth === 'critical') {
        toast.error(statusMessage);
      } else if (results.overallHealth === 'degraded') {
        toast.warning(statusMessage);
      } else {
        toast.success(statusMessage);
      }
      
    } catch (error) {
      console.error('❌ Genesis health check failed:', error);
      toast.error(`Health check failed: ${error.message}`);
    } finally {
      setIsRunningHealthCheck(false);
    }
  };

  const getHealthBadgeColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'down': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': 
      case 'down': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return <Shield className="h-4 w-4 text-corporate-accent" />;
      case 'scanner': return <Target className="h-4 w-4 text-blue-400" />;
      case 'edge_function': return <Zap className="h-4 w-4 text-purple-400" />;
      case 'database': return <Database className="h-4 w-4 text-green-400" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  // Calculate grouped components safely
  const groupedComponents = healthData?.components.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, ComponentHealth[]>) || {};

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-corporate-accent" />
            A.R.I.A™ Genesis Sentinel
          </h2>
          <p className="text-corporate-lightGray">
            Real-time system integrity monitoring and health validation
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {lastHealthCheck && (
            <span className="text-sm text-corporate-lightGray">
              Last Check: {new Date(lastHealthCheck).toLocaleTimeString()}
            </span>
          )}
          <Button
            onClick={runSystemHealthCheck}
            disabled={isRunningHealthCheck}
            className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
          >
            {isRunningHealthCheck ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Run Health Check
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Overall System Status */}
      {healthData && (
        <Alert className={`border-2 ${
          healthData.overallHealth === 'healthy' 
            ? 'border-green-500 bg-green-950/20' 
            : healthData.overallHealth === 'degraded'
            ? 'border-yellow-500 bg-yellow-950/20'
            : 'border-red-500 bg-red-950/20'
        }`}>
          <div className="flex items-center gap-2">
            {getHealthIcon(healthData.overallHealth)}
            <AlertDescription className="text-white">
              <strong>System Status: {healthData.overallHealth.toUpperCase()}</strong>
              {' - '}
              {healthData.components.filter(c => c.status === 'healthy').length}/{healthData.components.length} components healthy
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* System Metrics Overview */}
      {healthData?.metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Globe className="h-4 w-4 text-corporate-accent" />
                Live Data Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {healthData.metrics.liveDataCompliance.toFixed(1)}%
              </div>
              <Progress 
                value={healthData.metrics.liveDataCompliance} 
                className="mt-2"
              />
              <p className="text-xs corporate-subtext mt-1">
                Mock data: {healthData.metrics.mockDataDetected}
              </p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Target className="h-4 w-4 text-corporate-accent" />
                Entity Linkage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {healthData.metrics.entityLinkageRate.toFixed(1)}%
              </div>
              <Progress 
                value={healthData.metrics.entityLinkageRate} 
                className="mt-2"
              />
              <p className="text-xs corporate-subtext mt-1">
                Precision targeting
              </p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <TrendingUp className="h-4 w-4 text-corporate-accent" />
                System Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {healthData.metrics.systemUptime.toFixed(1)}%
              </div>
              <Progress 
                value={healthData.metrics.systemUptime} 
                className="mt-2"
              />
              <p className="text-xs corporate-subtext mt-1">
                Operational status
              </p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Activity className="h-4 w-4 text-corporate-accent" />
                Threats Processed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {healthData.metrics.totalThreatsProcessed}
              </div>
              <p className="text-xs corporate-subtext mt-1">
                Avg: {healthData.metrics.avgResponseTime.toFixed(0)}ms
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Component Health Status by Category */}
      {Object.keys(groupedComponents).map(category => (
        <Card key={category} className="corporate-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 corporate-heading">
              {getCategoryIcon(category)}
              {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')} Systems
              <Badge className="ml-auto bg-corporate-darkSecondary text-corporate-lightGray">
                {groupedComponents[category].length} components
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {groupedComponents[category].map((component, index) => (
                <div key={index} className="p-3 bg-corporate-darkSecondary rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white truncate">
                      {component.name}
                    </span>
                    <Badge className={`${getHealthBadgeColor(component.status)} text-white text-xs`}>
                      {component.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-corporate-lightGray space-y-1">
                    <div>Response: {component.responseTime}ms</div>
                    <div className="truncate">{component.details}</div>
                    <div>Checked: {new Date(component.lastCheck).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* No Data State */}
      {!healthData && !isRunningHealthCheck && (
        <Card className="corporate-card">
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 text-corporate-accent mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Ready to Monitor A.R.I.A Systems
            </h3>
            <p className="text-corporate-lightGray mb-4">
              Click "Run Health Check" to validate all system components
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GenesisSentinelPanel;
