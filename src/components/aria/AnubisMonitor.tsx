
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle, Clock, Database } from 'lucide-react';
import { AnubisService, AnubisSystemStatus, AnubisLogEntry } from '@/services/aria/anubisService';
import { toast } from 'sonner';

const AnubisMonitor = () => {
  const [systemStatus, setSystemStatus] = useState<AnubisSystemStatus[]>([]);
  const [systemLogs, setSystemLogs] = useState<AnubisLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    try {
      const [status, logs] = await Promise.all([
        AnubisService.getSystemStatus(),
        AnubisService.getSystemLogs(20)
      ]);
      setSystemStatus(status);
      setSystemLogs(logs);
    } catch (error) {
      console.error('Failed to load Anubis data:', error);
      toast.error('Failed to load system data');
    } finally {
      setIsLoading(false);
    }
  };

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    try {
      const result = await AnubisService.runDiagnostics();
      toast.success(`Diagnostics completed: ${result.overall_status}`);
      loadSystemData();
    } catch (error) {
      console.error('Diagnostics failed:', error);
      toast.error('Diagnostics failed');
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'offline': return <Database className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'debug': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading Anubis system data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5" />
              Anubis System Status
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={loadSystemData}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={runDiagnostics}
                variant="default"
                size="sm"
                disabled={isRunningDiagnostics}
              >
                <AlertTriangle className={`h-4 w-4 mr-2 ${isRunningDiagnostics ? 'animate-pulse' : ''}`} />
                Run Diagnostics
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemStatus.map((status) => (
              <div key={status.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status.status)}
                    <span className="font-medium">
                      {AnubisService.getModuleName(status.module)}
                    </span>
                  </div>
                  <Badge className={getStatusColor(status.status)}>
                    {status.status}
                  </Badge>
                </div>
                
                {status.issue_summary && (
                  <p className="text-sm text-gray-600 mb-2">{status.issue_summary}</p>
                )}
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Last checked: {new Date(status.last_checked).toLocaleTimeString()}</span>
                  {status.record_count !== undefined && (
                    <span>Records: {status.record_count}</span>
                  )}
                </div>
                
                {status.anomaly_detected && (
                  <div className="mt-2">
                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                      Anomaly Detected
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Logs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent System Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {systemLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent logs available
              </div>
            ) : (
              systemLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Badge className={getLevelColor(log.level)}>
                    {log.level}
                  </Badge>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{log.module}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{log.message}</p>
                    {log.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer">
                          View details
                        </summary>
                        <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                          {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnubisMonitor;
