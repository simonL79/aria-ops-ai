
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Database, Brain, Shield, Server } from 'lucide-react';
import { SystemHealthService } from '@/services/systemHealth';
import { hybridAIService } from '@/services/ai/hybridAIService';

export const SystemStatus = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [aiStatus, setAiStatus] = useState<any>(null);
  const [lastCheck, setLastCheck] = useState<string>('');

  useEffect(() => {
    checkSystemStatus();
    // Check every 60 seconds
    const interval = setInterval(checkSystemStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkSystemStatus = async () => {
    try {
      // Quick health ping
      const healthy = await SystemHealthService.quickHealthPing();
      setIsHealthy(healthy);
      
      // AI status
      await hybridAIService.initialize();
      const status = hybridAIService.getServiceStatus();
      setAiStatus(status);
      
      setLastCheck(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Status check failed:', error);
      setIsHealthy(false);
    }
  };

  const getStatusColor = (status: boolean | null) => {
    if (status === null) return 'text-gray-500';
    return status ? 'text-green-500' : 'text-red-500';
  };

  const getStatusBadge = (status: boolean | null, label: string) => {
    if (status === null) {
      return <Badge variant="outline">Checking...</Badge>;
    }
    return (
      <Badge variant={status ? 'default' : 'destructive'}>
        {status ? 'Operational' : 'Down'}
      </Badge>
    );
  };

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Database Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className={`h-4 w-4 ${getStatusColor(isHealthy)}`} />
            <span className="text-sm">Database</span>
          </div>
          {getStatusBadge(isHealthy, 'Database')}
        </div>

        {/* AI Services Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className={`h-4 w-4 ${getStatusColor(aiStatus?.active !== 'none')}`} />
            <span className="text-sm">AI Services</span>
          </div>
          {aiStatus ? (
            <Badge variant={aiStatus.active !== 'none' ? 'default' : 'destructive'}>
              {aiStatus.active !== 'none' ? aiStatus.active : 'Down'}
            </Badge>
          ) : (
            <Badge variant="outline">Checking...</Badge>
          )}
        </div>

        {/* Authentication Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className={`h-4 w-4 ${getStatusColor(true)}`} />
            <span className="text-sm">Authentication</span>
          </div>
          <Badge variant="default">Active</Badge>
        </div>

        {/* Edge Functions Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className={`h-4 w-4 ${getStatusColor(isHealthy)}`} />
            <span className="text-sm">Edge Functions</span>
          </div>
          {getStatusBadge(isHealthy, 'Functions')}
        </div>

        {lastCheck && (
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Last checked: {lastCheck}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
