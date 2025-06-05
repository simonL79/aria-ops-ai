
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Zap, Settings, PlayCircle, PauseCircle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AutoExecConfig {
  entityName: string;
  autoExecutionEnabled: boolean;
  maxDailyExecutions: number;
  minSuccessProbability: number;
  allowedStrategyTypes: string[];
}

interface ExecutionItem {
  id: string;
  strategy_id: string;
  entity_name: string;
  status: string;
  created_at: string;
  execution_result?: any;
}

const AutoExecutionManager = () => {
  const [configs, setConfigs] = useState<AutoExecConfig[]>([]);
  const [executions, setExecutions] = useState<ExecutionItem[]>([]);
  const [globalAutoExec, setGlobalAutoExec] = useState(false);

  useEffect(() => {
    loadConfigurations();
    loadExecutions();
  }, []);

  const loadConfigurations = async () => {
    try {
      const { data, error } = await supabase
        .from('aria_ops_log')
        .select('*')
        .eq('operation_type', 'auto_execution_config')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const configMap = new Map();
      data?.forEach(item => {
        const config = item.operation_data as any;
        if (config && !configMap.has(config.entityName)) {
          configMap.set(config.entityName, config);
        }
      });

      setConfigs(Array.from(configMap.values()));
      setGlobalAutoExec(Array.from(configMap.values()).some(c => c.autoExecutionEnabled));
    } catch (error) {
      console.error('Failed to load configurations:', error);
    }
  };

  const loadExecutions = async () => {
    try {
      const { data, error } = await supabase
        .from('strategy_responses')
        .select('*')
        .not('executed_at', 'is', null)
        .order('executed_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setExecutions(data || []);
    } catch (error) {
      console.error('Failed to load executions:', error);
    }
  };

  const toggleGlobalAutoExecution = async (enabled: boolean) => {
    try {
      // Create or update global configuration
      const globalConfig = {
        entityName: 'global',
        autoExecutionEnabled: enabled,
        executionThresholds: {
          minSuccessProbability: 0.8,
          maxRiskLevel: 0.4,
          maxResourceRequirement: 0.6,
          minConfidenceScore: 0.7
        },
        allowedStrategyTypes: ['defensive', 'engagement'],
        cooldownPeriod: 60,
        maxDailyExecutions: 10
      };

      const { error } = await supabase
        .from('aria_ops_log')
        .insert({
          operation_type: 'auto_execution_config',
          module_source: 'auto_execution_manager',
          success: true,
          entity_name: 'global',
          operation_data: globalConfig as any
        });

      if (error) throw error;

      setGlobalAutoExec(enabled);
      loadConfigurations();
      toast.success(`Auto-execution ${enabled ? 'enabled' : 'disabled'} globally`);
    } catch (error) {
      toast.error('Failed to update auto-execution settings');
    }
  };

  const createEntityConfig = async () => {
    const entityName = prompt('Enter entity name for auto-execution:');
    if (!entityName) return;

    try {
      const newConfig = {
        entityName,
        autoExecutionEnabled: true,
        executionThresholds: {
          minSuccessProbability: 0.8,
          maxRiskLevel: 0.4,
          maxResourceRequirement: 0.6,
          minConfidenceScore: 0.7
        },
        allowedStrategyTypes: ['defensive', 'engagement'],
        cooldownPeriod: 60,
        maxDailyExecutions: 5
      };

      const { error } = await supabase
        .from('aria_ops_log')
        .insert({
          operation_type: 'auto_execution_config',
          module_source: 'auto_execution_manager',
          success: true,
          entity_name: entityName,
          operation_data: newConfig as any
        });

      if (error) throw error;

      loadConfigurations();
      toast.success(`Auto-execution configured for ${entityName}`);
    } catch (error) {
      toast.error('Failed to create entity configuration');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'executing': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'executing': return <PlayCircle className="h-4 w-4" />;
      case 'pending': return <PauseCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const executionCounts = {
    total: executions.length,
    completed: executions.filter(e => e.status === 'completed').length,
    failed: executions.filter(e => e.status === 'cancelled').length,
    active: executions.filter(e => e.status === 'executing').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-green-600" />
            Auto-Execution Manager
          </h2>
          <p className="text-muted-foreground">Automated response execution configuration and monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Global Auto-Execution</span>
            <Switch
              checked={globalAutoExec}
              onCheckedChange={toggleGlobalAutoExecution}
            />
          </div>
          <Button onClick={createEntityConfig} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Add Entity Config
          </Button>
        </div>
      </div>

      {/* Execution Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{executionCounts.total}</div>
            <p className="text-xs text-muted-foreground">Automated responses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{executionCounts.completed}</div>
            <p className="text-xs text-muted-foreground">Successful executions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <PlayCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{executionCounts.active}</div>
            <p className="text-xs text-muted-foreground">Currently executing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{executionCounts.failed}</div>
            <p className="text-xs text-muted-foreground">Execution failures</p>
          </CardContent>
        </Card>
      </div>

      {/* Configurations */}
      <Card>
        <CardHeader>
          <CardTitle>Entity Configurations</CardTitle>
        </CardHeader>
        <CardContent>
          {configs.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">No auto-execution configurations</p>
              <p className="text-sm text-muted-foreground">Add entity configurations to enable automated responses</p>
            </div>
          ) : (
            <div className="space-y-4">
              {configs.map((config, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{config.entityName}</h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        Max daily executions: {config.maxDailyExecutions} • 
                        Min success probability: {(config.minSuccessProbability * 100).toFixed(0)}%
                      </div>
                      <div className="flex gap-1 mt-2">
                        {config.allowedStrategyTypes?.map((type, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge className={config.autoExecutionEnabled ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                      {config.autoExecutionEnabled ? 'ENABLED' : 'DISABLED'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
        </CardHeader>
        <CardContent>
          {executions.length === 0 ? (
            <div className="text-center py-8">
              <PlayCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <p className="text-muted-foreground">No automated executions yet</p>
              <p className="text-sm text-muted-foreground">Executions will appear here when auto-execution is triggered</p>
            </div>
          ) : (
            <div className="space-y-4">
              {executions.map((execution) => (
                <div key={execution.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(execution.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Strategy {execution.strategy_id}</span>
                          <Badge className={getStatusColor(execution.status)}>
                            {execution.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Entity: {execution.entity_name} • 
                          Executed: {new Date(execution.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {execution.execution_result && (
                      <div className="text-sm text-muted-foreground">
                        {execution.execution_result.executed_actions || 0} actions completed
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoExecutionManager;
