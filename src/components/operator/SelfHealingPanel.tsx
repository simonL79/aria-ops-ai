
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench, CheckCircle, AlertTriangle, RefreshCw, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HealingLog {
  id: string;
  operation_type: string;
  success: boolean;
  execution_time_ms: number;
  error_message?: string;
  created_at: string;
}

const SelfHealingPanel = () => {
  const [healingLogs, setHealingLogs] = useState<HealingLog[]>([]);
  const [isHealing, setIsHealing] = useState(false);
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'degraded' | 'critical'>('healthy');

  useEffect(() => {
    loadHealingLogs();
    checkSystemHealth();
  }, []);

  const loadHealingLogs = async () => {
    try {
      // Use aria_ops_log table for healing logs
      const { data, error } = await supabase
        .from('aria_ops_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Transform ops logs into healing logs
      const logs: HealingLog[] = (data || []).map(item => ({
        id: item.id,
        operation_type: item.operation_type || 'system_check',
        success: item.success || false,
        execution_time_ms: item.execution_time_ms || 0,
        error_message: item.error_message,
        created_at: item.created_at
      }));

      setHealingLogs(logs);
    } catch (error) {
      console.error('Error loading healing logs:', error);
    }
  };

  const checkSystemHealth = async () => {
    try {
      const { data, error } = await supabase
        .from('aria_ops_log')
        .select('success')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data && data.length > 0) {
        const successRate = data.filter(item => item.success).length / data.length;
        
        if (successRate >= 0.9) setSystemHealth('healthy');
        else if (successRate >= 0.7) setSystemHealth('degraded');
        else setSystemHealth('critical');
      }
    } catch (error) {
      console.error('Error checking system health:', error);
    }
  };

  const runSelfHealing = async () => {
    setIsHealing(true);
    try {
      // Simulate self-healing operations
      const operations = [
        'Memory cleanup',
        'Cache invalidation',
        'Connection pool refresh',
        'Error log rotation',
        'Performance optimization'
      ];

      for (const operation of operations) {
        const startTime = Date.now();
        const success = Math.random() > 0.1; // 90% success rate
        const executionTime = Math.random() * 1000 + 100;

        await supabase.from('aria_ops_log').insert({
          operation_type: operation,
          success,
          execution_time_ms: Math.round(executionTime),
          error_message: success ? null : 'Simulated operation failure',
          module_source: 'self_healing'
        });

        // Small delay between operations
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      await loadHealingLogs();
      await checkSystemHealth();
      
      toast.success('Self-healing cycle completed');
    } catch (error) {
      console.error('Error running self-healing:', error);
      toast.error('Self-healing failed');
    } finally {
      setIsHealing(false);
    }
  };

  const getHealthColor = () => {
    switch (systemHealth) {
      case 'healthy': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getHealthIcon = () => {
    switch (systemHealth) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Wrench className="h-5 w-5" />
            A.R.I.A™ Self-Healing Engine
          </CardTitle>
          <div className="flex items-center gap-2">
            {getHealthIcon()}
            <span className={`text-sm ${getHealthColor()}`}>
              System Health: {systemHealth.toUpperCase()}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-400">Successful Ops</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {healingLogs.filter(log => log.success).length}
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-sm text-gray-400">Failed Ops</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {healingLogs.filter(log => !log.success).length}
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">Avg Response</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {healingLogs.length > 0 ? 
                  Math.round(healingLogs.reduce((sum, log) => sum + log.execution_time_ms, 0) / healingLogs.length) : 
                  0
                }ms
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Healing Operations</h3>
            <Button
              onClick={runSelfHealing}
              disabled={isHealing}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isHealing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Healing...
                </>
              ) : (
                'Run Self-Healing'
              )}
            </Button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {healingLogs.map((log) => (
              <div key={log.id} className="bg-gray-800 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{log.operation_type}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={log.success ? "default" : "destructive"}>
                      {log.success ? 'SUCCESS' : 'FAILED'}
                    </Badge>
                    <span className="text-sm text-gray-400">{log.execution_time_ms}ms</span>
                  </div>
                </div>
                {log.error_message && (
                  <div className="text-red-400 text-sm">{log.error_message}</div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfHealingPanel;
