
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Activity,
  Database,
  Shield
} from 'lucide-react';
import { systemHealthService, type SystemHealthMetrics } from '@/services/monitoring/systemHealthService';
import { dataExportService, type ExportOptions } from '@/services/dataExport/exportService';
import { toast } from 'sonner';

const SystemHealthDashboard = () => {
  const [healthMetrics, setHealthMetrics] = useState<SystemHealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      setRefreshing(true);
      const metrics = await systemHealthService.runComprehensiveHealthCheck();
      setHealthMetrics(metrics);
    } catch (error) {
      console.error('Failed to load health data:', error);
      toast.error('Failed to load system health data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleExport = async (type: 'threats' | 'health' | 'complete', format: 'csv' | 'json') => {
    try {
      setExporting(true);
      
      const options: ExportOptions = {
        format,
        includeMetadata: true,
        dateRange: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          end: new Date()
        }
      };

      switch (type) {
        case 'threats':
          await dataExportService.exportThreats(options);
          break;
        case 'health':
          await dataExportService.exportSystemHealth(options);
          break;
        case 'complete':
          await dataExportService.exportCompleteAudit(options);
          break;
      }

      toast.success(`${type} data exported successfully`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Failed to export ${type} data`);
    } finally {
      setExporting(false);
    }
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" />
            System Health Dashboard
          </h2>
          <p className="text-muted-foreground">
            Monitor ARIA system performance and data pipeline health
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={loadHealthData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleExport('complete', 'json')}
            disabled={exporting}
          >
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {healthMetrics && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Threats (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthMetrics.totalThreats24h}</div>
                <p className="text-xs text-muted-foreground">
                  {healthMetrics.threatsProcessed} processed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(healthMetrics.avgProcessingTime / 1000).toFixed(1)}s
                </div>
                <p className="text-xs text-muted-foreground">Average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(healthMetrics.errorRate * 100).toFixed(2)}%
                </div>
                <Progress 
                  value={healthMetrics.errorRate * 100} 
                  className="mt-2" 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Platform Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1">
                  {healthMetrics.platformStatus.map((platform) => (
                    <div key={platform.platform} className="flex flex-col items-center">
                      {getStatusIcon(platform.status)}
                      <span className="text-xs mt-1">
                        {platform.platform.slice(0, 3)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Status */}
          <Tabs defaultValue="platforms">
            <TabsList>
              <TabsTrigger value="platforms">Platform Health</TabsTrigger>
              <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
              <TabsTrigger value="export">Data Export</TabsTrigger>
            </TabsList>

            <TabsContent value="platforms" className="space-y-4">
              <div className="grid gap-4">
                {healthMetrics.platformStatus.map((platform) => (
                  <Card key={platform.platform}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(platform.status)}
                          <div>
                            <h3 className="font-medium">{platform.platform}</h3>
                            <p className="text-sm text-muted-foreground">
                              {platform.message}
                            </p>
                          </div>
                        </div>
                        
                        <Badge className={getStatusColor(platform.status)}>
                          {platform.status}
                        </Badge>
                      </div>
                      
                      {platform.lastEntry && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Last entry: {new Date(platform.lastEntry).toLocaleString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              {healthMetrics.platformStatus.filter(p => p.status !== 'healthy').length > 0 ? (
                <div className="space-y-2">
                  {healthMetrics.platformStatus
                    .filter(p => p.status !== 'healthy')
                    .map((platform) => (
                      <Alert key={platform.platform} className="border-l-4 border-l-red-500">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>{platform.platform}</strong>: {platform.message}
                        </AlertDescription>
                      </Alert>
                    ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">All Systems Operational</h3>
                    <p className="text-muted-foreground">No active alerts or issues detected</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Threat Data
                    </CardTitle>
                    <CardDescription>
                      Export scan results and threat intelligence
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleExport('threats', 'csv')}
                      disabled={exporting}
                    >
                      Export CSV
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleExport('threats', 'json')}
                      disabled={exporting}
                    >
                      Export JSON
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      System Health
                    </CardTitle>
                    <CardDescription>
                      Export health checks and monitoring data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleExport('health', 'csv')}
                      disabled={exporting}
                    >
                      Export CSV
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleExport('health', 'json')}
                      disabled={exporting}
                    >
                      Export JSON
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Complete Audit
                    </CardTitle>
                    <CardDescription>
                      Export all system data for compliance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => handleExport('complete', 'json')}
                      disabled={exporting}
                    >
                      Full Export (JSON)
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Includes threats, cases, health, and activity logs
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default SystemHealthDashboard;
