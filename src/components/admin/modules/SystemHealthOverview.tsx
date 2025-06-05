
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Server, Brain, Shield, Zap, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemHealthOverviewProps {
  systemStatus: {
    localServer: boolean;
    threatDetection: boolean;
    strategyBrain: boolean;
    autoExecution: boolean;
    liveDataCompliance: boolean;
  };
}

interface SystemMetrics {
  totalScans: number;
  activeThreats: number;
  strategiesGenerated: number;
  executedActions: number;
  systemUptime: number;
}

const SystemHealthOverview: React.FC<SystemHealthOverviewProps> = ({ systemStatus }) => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalScans: 0,
    activeThreats: 0,
    strategiesGenerated: 0,
    executedActions: 0,
    systemUptime: 99.8
  });

  useEffect(() => {
    loadSystemMetrics();
  }, []);

  const loadSystemMetrics = async () => {
    try {
      // Get total scans
      const { data: scanData } = await supabase
        .from('scan_results')
        .select('id')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Get active threats
      const { data: threatData } = await supabase
        .from('scan_results')
        .select('id')
        .in('severity', ['high', 'critical'])
        .eq('status', 'new');

      // Get strategies generated
      const { data: strategyData } = await supabase
        .from('strategy_responses')
        .select('id')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Get executed actions
      const { data: executionData } = await supabase
        .from('strategy_responses')
        .select('execution_result')
        .not('execution_result', 'is', null);

      const executedActions = executionData?.reduce((sum, item) => {
        const result = item.execution_result as any;
        return sum + (result?.executed_actions || 0);
      }, 0) || 0;

      setMetrics({
        totalScans: scanData?.length || 0,
        activeThreats: threatData?.length || 0,
        strategiesGenerated: strategyData?.length || 0,
        executedActions,
        systemUptime: 99.8 // Simulated uptime metric
      });

    } catch (error) {
      console.error('Failed to load system metrics:', error);
    }
  };

  const systemHealth = Object.values(systemStatus).filter(Boolean).length / Object.values(systemStatus).length * 100;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemHealth.toFixed(1)}%</div>
            <Progress value={systemHealth} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Scans</CardTitle>
            <Server className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalScans}</div>
            <p className="text-xs text-muted-foreground">Live intelligence gathered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.activeThreats}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions Executed</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.executedActions}</div>
            <p className="text-xs text-muted-foreground">Automated responses</p>
          </CardContent>
        </Card>
      </div>

      {/* System Status Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            A.R.I.A™ Module Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Server className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Local AI Server</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={systemStatus.localServer ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                  {systemStatus.localServer ? 'OPERATIONAL' : 'OFFLINE'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {systemStatus.localServer ? 'Models loaded and ready' : 'Server unreachable'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-red-600" />
                <span className="font-medium">Threat Detection</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={systemStatus.threatDetection ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}>
                  {systemStatus.threatDetection ? 'ACTIVE' : 'STANDBY'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {systemStatus.threatDetection ? 'Monitoring active' : 'No recent activity'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Strategy Brain</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={systemStatus.strategyBrain ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                  {systemStatus.strategyBrain ? 'READY' : 'INACTIVE'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {systemStatus.strategyBrain ? 'Strategies available' : 'No strategies generated'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-green-600" />
                <span className="font-medium">Auto-Execution</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={systemStatus.autoExecution ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}>
                  {systemStatus.autoExecution ? 'CONFIGURED' : 'DISABLED'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {systemStatus.autoExecution ? 'Automation rules active' : 'Manual mode only'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium">Live Data Compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={systemStatus.liveDataCompliance ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                  {systemStatus.liveDataCompliance ? 'COMPLIANT' : 'VIOLATIONS DETECTED'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {systemStatus.liveDataCompliance ? '100% live intelligence' : 'Mock data detected'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthOverview;
