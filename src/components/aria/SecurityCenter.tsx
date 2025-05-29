
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Activity, Scan, Eye, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SecurityCenter = () => {
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([]);
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [activeScanners, setActiveScanners] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSecurityData = async () => {
    try {
      // Fetch real security alerts from scan_results
      const { data: alerts, error: alertsError } = await supabase
        .from('scan_results')
        .select('*')
        .in('severity', ['high', 'critical'])
        .eq('status', 'new')
        .order('created_at', { ascending: false })
        .limit(10);

      if (alertsError) throw alertsError;

      setSecurityAlerts(alerts || []);

      // Calculate threat level based on alerts
      const criticalCount = (alerts || []).filter(a => a.severity === 'critical').length;
      const highCount = (alerts || []).filter(a => a.severity === 'high').length;

      if (criticalCount > 0) setThreatLevel('critical');
      else if (highCount > 2) setThreatLevel('high');
      else if (highCount > 0) setThreatLevel('medium');
      else setThreatLevel('low');

      // Fetch active monitoring platforms as "scanners"
      const { data: platforms, error: platformsError } = await supabase
        .from('monitored_platforms')
        .select('*')
        .eq('active', true);

      if (platformsError) throw platformsError;

      setActiveScanners(platforms || []);

    } catch (error) {
      console.error('Error fetching security data:', error);
    }
  };

  const runSecurityScan = async () => {
    setIsScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-intelligence', {
        body: { 
          scanType: 'security_scan',
          enableLiveData: true 
        }
      });

      if (error) throw error;

      toast.success('Security scan completed successfully');
      fetchSecurityData();
    } catch (error) {
      console.error('Security scan failed:', error);
      toast.error('Security scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            Security Center
          </h2>
          <p className="text-muted-foreground">Real-time security monitoring and threat analysis</p>
        </div>
        <Button onClick={runSecurityScan} disabled={isScanning}>
          <Scan className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Run Security Scan'}
        </Button>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <Badge className={getThreatLevelColor(threatLevel)}>
              {threatLevel.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Activity className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {securityAlerts.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scanners</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {activeScanners.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500 text-white">OPERATIONAL</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Critical Security Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityAlerts.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">No critical security alerts</p>
                <p className="text-sm text-muted-foreground">All systems secure</p>
              </div>
            ) : (
              securityAlerts.map((alert) => (
                <div key={alert.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-900">{alert.platform}</span>
                    </div>
                    <Badge className={getThreatLevelColor(alert.severity)}>
                      {alert.severity?.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-red-800 mb-2">
                    {alert.content}
                  </div>
                  <div className="text-xs text-red-600">
                    {new Date(alert.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Scanners */}
      <Card>
        <CardHeader>
          <CardTitle>Active Security Scanners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeScanners.map((scanner) => (
              <div key={scanner.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{scanner.name}</span>
                  <Badge className="bg-green-500 text-white">ACTIVE</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Type: {scanner.type}
                </div>
                <div className="text-sm text-muted-foreground">
                  Last Update: {new Date(scanner.last_updated).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityCenter;
