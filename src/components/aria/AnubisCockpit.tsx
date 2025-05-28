
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Zap, 
  Activity, 
  AlertTriangle, 
  Eye,
  Bot,
  Radar
} from "lucide-react";
import { anubisService, type AnubisSystemReport, type AnubisState } from '@/services/aria/anubisService';
import ZeroDayFirewallPanel from './ZeroDayFirewallPanel';
import { toast } from 'sonner';

const AnubisCockpit = () => {
  const [systemReport, setSystemReport] = useState<AnubisSystemReport | null>(null);
  const [systemStates, setSystemStates] = useState<AnubisState[]>([]);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    setIsLoading(true);
    try {
      const [states, health] = await Promise.all([
        anubisService.getSystemStatus(),
        anubisService.getSystemHealth()
      ]);

      setSystemStates(states);
      
      // Create system report from health data
      if (health) {
        const healthyModules = states.filter(s => s.status === 'healthy').length;
        const warningModules = states.filter(s => s.status === 'warning').length;
        const errorModules = states.filter(s => s.status === 'error').length;
        
        setSystemReport({
          overall_status: health.overallStatus,
          summary: {
            healthy_modules: healthyModules,
            warning_modules: warningModules,
            error_modules: errorModules,
            total_modules: states.length
          },
          module_status: states,
          active_issues: states.filter(s => s.anomaly_detected),
          last_check: health.lastCheck || new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error loading system data:', error);
      toast.error('Failed to load Anubis system data');
    } finally {
      setIsLoading(false);
    }
  };

  const runComprehensiveDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    try {
      const report = await anubisService.runDiagnostics();
      if (report) {
        setSystemReport(report);
        toast.success('Comprehensive diagnostics completed successfully');
      }
      // Reload system data after diagnostics
      await loadSystemData();
    } catch (error) {
      console.error('Error running diagnostics:', error);
      toast.error('Failed to run comprehensive diagnostics');
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'critical': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading Anubis Cockpit...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Radar className="h-6 w-6 text-blue-600" />
            Anubis™ Cockpit
          </h1>
          <p className="text-muted-foreground">
            Autonomous Command Pilot - A.R.I.A™ Security Control Center
          </p>
        </div>
        <Button 
          onClick={runComprehensiveDiagnostics}
          disabled={isRunningDiagnostics}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isRunningDiagnostics ? (
            <>
              <Activity className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Run Full Diagnostics
            </>
          )}
        </Button>
      </div>

      {/* System Overview */}
      {systemReport && (
        <div className="grid grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Overall Status</p>
                <p className={`text-lg font-bold ${getOverallStatusColor(systemReport.overall_status)}`}>
                  {systemReport.overall_status.toUpperCase()}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Healthy</p>
                <p className="text-lg font-bold text-green-600">
                  {systemReport.summary.healthy_modules}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-lg font-bold text-yellow-600">
                  {systemReport.summary.warning_modules}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-lg font-bold text-red-600">
                  {systemReport.summary.error_modules}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Modules</p>
                <p className="text-lg font-bold text-blue-600">
                  {systemReport.summary.total_modules}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="zeroday" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Zero-Day Firewall
          </TabsTrigger>
          <TabsTrigger value="issues" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Active Issues
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>System Health Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {systemReport ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Last Check: {new Date(systemReport.last_check).toLocaleString()}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Module Status Distribution</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Healthy:</span>
                          <Badge className="bg-green-500 text-white">
                            {systemReport.summary.healthy_modules}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Warnings:</span>
                          <Badge className="bg-yellow-500 text-white">
                            {systemReport.summary.warning_modules}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Errors:</span>
                          <Badge className="bg-red-500 text-white">
                            {systemReport.summary.error_modules}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Active Issues</h4>
                      <div className="text-2xl font-bold text-red-600">
                        {systemReport.active_issues.length}
                      </div>
                      <p className="text-sm text-gray-600">
                        Anomalies requiring attention
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No system report available. Run diagnostics to generate report.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle>A.R.I.A™ Module Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {systemStates.length > 0 ? (
                  systemStates.map((module) => (
                    <div key={module.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{anubisService.getModuleName(module.module)}</h4>
                          <p className="text-sm text-gray-600">{module.issue_summary}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(module.status)} text-white`}>
                            {module.status.toUpperCase()}
                          </Badge>
                          {module.anomaly_detected && (
                            <Badge variant="destructive">
                              Anomaly
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Records: {module.record_count}</span>
                        <span>Last Check: {new Date(module.last_checked).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No module data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zeroday">
          <ZeroDayFirewallPanel />
        </TabsContent>

        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle>Active System Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemReport?.active_issues.length ? (
                  systemReport.active_issues.map((issue) => (
                    <div key={issue.id} className="p-4 border-l-4 border-red-500 bg-red-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-red-800">
                          {anubisService.getModuleName(issue.module)}
                        </h4>
                        <Badge className="bg-red-500 text-white">
                          {issue.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-red-700 mb-2">{issue.issue_summary}</p>
                      <div className="text-xs text-red-600">
                        Records affected: {issue.record_count} | 
                        Last detected: {new Date(issue.last_checked).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-green-600">
                    ✅ No active issues detected. All systems operational.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnubisCockpit;
