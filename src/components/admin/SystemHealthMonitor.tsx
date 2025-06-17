
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { SystemHealthService, SystemHealth, SystemHealthCheck } from '@/services/systemHealth';
import { toast } from 'sonner';

export const SystemHealthMonitor = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<string | null>(null);

  useEffect(() => {
    checkHealth();
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    setIsLoading(true);
    try {
      const healthData = await SystemHealthService.checkSystemHealth();
      setHealth(healthData);
      setLastCheck(new Date().toLocaleTimeString());
      
      if (healthData.overall === 'down') {
        toast.error('System health critical - immediate attention required');
      } else if (healthData.overall === 'degraded') {
        toast.warning('System health degraded - monitoring required');
      }
    } catch (error) {
      console.error('Health check failed:', error);
      toast.error('Failed to check system health');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'default',
      degraded: 'secondary',
      down: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'border-green-200 bg-green-50';
      case 'degraded':
        return 'border-yellow-200 bg-yellow-50';
      case 'down':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className={`${health ? getOverallStatusColor(health.overall) : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health Monitor
            {health && getStatusIcon(health.overall)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkHealth}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {health && (
          <>
            {/* Overall Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Overall System Status</div>
                <div className="text-sm text-muted-foreground">
                  Uptime: {health.uptime} | Last checked: {lastCheck}
                </div>
              </div>
              {getStatusBadge(health.overall)}
            </div>

            {/* Component Status */}
            <div className="grid gap-3">
              <div className="font-medium text-sm">Component Status</div>
              {health.checks.map((check: SystemHealthCheck, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <div className="font-medium text-sm">{check.component}</div>
                      <div className="text-xs text-muted-foreground">{check.message}</div>
                    </div>
                  </div>
                  {getStatusBadge(check.status)}
                </div>
              ))}
            </div>

            {/* Health Summary */}
            <div className="text-xs text-muted-foreground pt-2 border-t">
              Health check completed at {new Date(health.lastFullCheck).toLocaleString()}
            </div>
          </>
        )}

        {!health && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            Click refresh to check system health
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            Checking system health...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
