
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Activity, AlertTriangle, CheckCircle, XCircle, RefreshCw, Eye, Clock, TrendingUp } from 'lucide-react';
import { anubisService, AnubisState, AnubisSystemReport, ARIA_MODULES } from '@/services/aria/anubisService';

const AnubisMonitor = () => {
  const [systemReport, setSystemReport] = useState<AnubisSystemReport | null>(null);
  const [systemStatus, setSystemStatus] = useState<AnubisState[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadSystemStatus = async () => {
    const status = await anubisService.getSystemStatus();
    setSystemStatus(status);
    setLastUpdate(new Date());
  };

  const loadSystemLogs = async () => {
    const logs = await anubisService.getSystemLogs();
    setSystemLogs(logs);
  };

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const report = await anubisService.runDiagnostics();
      if (report) {
        setSystemReport(report);
        setSystemStatus(report.module_status);
        setLastUpdate(new Date());
      }
      await loadSystemLogs();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystemStatus();
    loadSystemLogs();
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadSystemStatus();
      loadSystemLogs();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getOverallStatus = () => {
    if (systemReport) {
      return systemReport.overall_status;
    }
    
    const errorCount = systemStatus.filter(s => s.status === 'error').length;
    const warningCount = systemStatus.filter(s => s.status === 'warning').length;
    
    if (errorCount > 0) return 'critical';
    if (warningCount > 0) return 'warning';
    return 'healthy';
  };

  const overallStatus = getOverallStatus();
  const activeIssues = systemStatus.filter(s => s.anomaly_detected);
  const healthyModules = systemStatus.filter(s => s.status === 'healthy').length;
  const warningModules = systemStatus.filter(s => s.status === 'warning').length;
  const errorModules = systemStatus.filter(s => s.status === 'error').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-600" />
            A.R.I.A™ Anubis System Monitor
          </h2>
          <p className="text-muted-foreground">Comprehensive real-time system health diagnostics</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runDiagnostics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Run Full Diagnostics
          </Button>
          <Button onClick={loadSystemStatus} variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
            {getStatusIcon(overallStatus)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{overallStatus}</div>
            <p className="text-xs text-muted-foreground">
              {systemStatus.length} modules monitored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Modules</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{healthyModules}</div>
            <p className="text-xs text-muted-foreground">
              Operating normally
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningModules}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activeIssues.length}</div>
            <p className="text-xs text-muted-foreground">
              Critical issues detected
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules">Module Status</TabsTrigger>
          <TabsTrigger value="issues">Active Issues</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>A.R.I.A™ Module Health Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemStatus.map((module) => (
                  <div key={module.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{module.module}</div>
                      <Badge variant={getStatusColor(module.status)}>
                        {getStatusIcon(module.status)}
                        <span className="ml-1 capitalize">{module.status}</span>
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {anubisService.getModuleName(module.module)}
                    </div>
                    {module.anomaly_detected && (
                      <div className="text-sm text-red-600">
                        {module.issue_summary}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last checked: {new Date(module.last_checked).toLocaleTimeString()}
                    </div>
                    {module.record_count > 0 && (
                      <div className="text-xs">
                        Records: {module.record_count}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {systemStatus.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No system status data available</p>
                  <p className="text-sm text-muted-foreground">Run diagnostics to populate module status</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active System Issues</CardTitle>
            </CardHeader>
            <CardContent>
              {activeIssues.length > 0 ? (
                <div className="space-y-3">
                  {activeIssues.map((issue) => (
                    <Alert key={issue.id}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <div>
                            <strong>{issue.module}</strong>: {issue.issue_summary}
                          </div>
                          <Badge variant={getStatusColor(issue.status)}>
                            {issue.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {issue.record_count} records affected • Last checked: {new Date(issue.last_checked).toLocaleString()}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">No active issues detected</p>
                  <p className="text-sm text-muted-foreground">All A.R.I.A™ modules are operating normally</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Diagnostic Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {systemLogs.map((log) => (
                  <div key={log.id} className="border rounded p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{log.module} - {log.check_type}</div>
                      <Badge variant="outline">{log.result_status}</Badge>
                    </div>
                    <div className="text-muted-foreground mt-1">{log.details}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(log.checked_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {systemLogs.length === 0 && (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No diagnostic logs available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {lastUpdate && (
        <div className="text-xs text-muted-foreground text-center">
          Last updated: {lastUpdate.toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default AnubisMonitor;
