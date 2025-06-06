
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, Activity, Zap, Brain, Eye } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface AnubisStatus {
  isActive: boolean;
  lastCheck: string;
  threatsDetected: number;
  systemHealth: 'optimal' | 'warning' | 'critical';
  memoryUtilization: number;
}

interface ThreatAlert {
  id: string;
  entity: string;
  threat: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

const AnubisCockpit = () => {
  const [anubisStatus, setAnubisStatus] = useState<AnubisStatus>({
    isActive: false,
    lastCheck: new Date().toISOString(),
    threatsDetected: 0,
    systemHealth: 'optimal',
    memoryUtilization: 0
  });
  
  const [recentAlerts, setRecentAlerts] = useState<ThreatAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnubisStatus();
    loadRecentAlerts();
    
    // Set up real-time monitoring
    const interval = setInterval(() => {
      loadAnubisStatus();
      loadRecentAlerts();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadAnubisStatus = async () => {
    try {
      // Check system health from various sources
      const { data: threats } = await supabase
        .from('threats')
        .select('*')
        .gte('detected_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const { data: scanResults } = await supabase
        .from('scan_results')
        .select('*')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

      const threatsCount = threats?.length || 0;
      const recentScans = scanResults?.length || 0;

      // Determine system health
      let systemHealth: 'optimal' | 'warning' | 'critical' = 'optimal';
      if (threatsCount > 50) systemHealth = 'critical';
      else if (threatsCount > 20) systemHealth = 'warning';

      // Calculate memory utilization (simulated based on activity)
      const memoryUtilization = Math.min(95, (threatsCount * 2) + (recentScans * 0.5));

      setAnubisStatus({
        isActive: recentScans > 0,
        lastCheck: new Date().toISOString(),
        threatsDetected: threatsCount,
        systemHealth,
        memoryUtilization
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load Anubis status:', error);
      setIsLoading(false);
    }
  };

  const loadRecentAlerts = async () => {
    try {
      const { data: notifications } = await supabase
        .from('aria_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (notifications) {
        const alerts: ThreatAlert[] = notifications.map(notif => ({
          id: notif.id,
          entity: notif.entity_name || 'Unknown',
          threat: notif.summary || 'No details available',
          severity: notif.priority as 'low' | 'medium' | 'high' | 'critical',
          timestamp: notif.created_at
        }));
        
        setRecentAlerts(alerts);
      }
    } catch (error) {
      console.error('Failed to load recent alerts:', error);
    }
  };

  const handleSystemScan = async () => {
    try {
      toast.info("Initiating Anubis system scan...");
      
      // Trigger system scan
      const response = await supabase.functions.invoke('anubis-engine', {
        body: { action: 'system_scan', target: 'all_entities' }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast.success("Anubis system scan completed successfully");
      await loadAnubisStatus(); // Refresh status after scan
    } catch (error) {
      console.error('System scan failed:', error);
      toast.error(`System scan failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleMemoryOptimize = async () => {
    try {
      toast.info("Optimizing Anubis memory...");
      
      // Call memory optimization
      const response = await supabase.functions.invoke('anubis-memory-store', {
        body: { action: 'optimize_memory' }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast.success("Memory optimization completed");
      await loadAnubisStatus(); // Refresh status
    } catch (error) {
      console.error('Memory optimization failed:', error);
      toast.error(`Memory optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'optimal': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Activity className="h-12 w-12 text-corporate-accent mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-white mb-2">Loading Anubis Cockpit...</h2>
          <p className="text-corporate-lightGray">Initializing threat monitoring systems</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Shield className="h-12 w-12 text-corporate-accent mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Anubis Security Cockpit</h2>
        <p className="text-corporate-lightGray">Advanced threat detection and response coordination</p>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-corporate-dark border-corporate-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">
                  {anubisStatus.isActive ? 'ACTIVE' : 'OFFLINE'}
                </div>
                <div className="text-xs text-corporate-lightGray">System Status</div>
              </div>
              <Activity className={`h-8 w-8 ${anubisStatus.isActive ? 'text-green-400' : 'text-red-400'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-corporate-dark border-corporate-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${getHealthColor(anubisStatus.systemHealth)}`}>
                  {anubisStatus.systemHealth.toUpperCase()}
                </div>
                <div className="text-xs text-corporate-lightGray">System Health</div>
              </div>
              <Shield className={`h-8 w-8 ${getHealthColor(anubisStatus.systemHealth)}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-corporate-dark border-corporate-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {anubisStatus.threatsDetected}
                </div>
                <div className="text-xs text-corporate-lightGray">Threats (24h)</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-corporate-dark border-corporate-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(anubisStatus.memoryUtilization)}%
                </div>
                <div className="text-xs text-corporate-lightGray">Memory Usage</div>
              </div>
              <Brain className="h-8 w-8 text-corporate-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Memory Utilization */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Anubis Memory Utilization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress 
              value={anubisStatus.memoryUtilization} 
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span className="text-corporate-lightGray">
                Used: {Math.round(anubisStatus.memoryUtilization)}%
              </span>
              <span className="text-corporate-lightGray">
                Available: {Math.round(100 - anubisStatus.memoryUtilization)}%
              </span>
            </div>
            {anubisStatus.memoryUtilization > 80 && (
              <Alert className="border-yellow-500 bg-yellow-900/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-yellow-400">
                  High memory utilization detected. Consider running memory optimization.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Control Panel */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Anubis Control Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={handleSystemScan}
              className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              <Shield className="h-4 w-4 mr-2" />
              Initiate System Scan
            </Button>
            
            <Button 
              onClick={handleMemoryOptimize}
              variant="outline"
              className="border-corporate-border text-white hover:bg-corporate-darkSecondary"
            >
              <Brain className="h-4 w-4 mr-2" />
              Optimize Memory
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Recent Threat Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.length === 0 ? (
              <p className="text-corporate-lightGray text-center py-4">
                No recent threat alerts
              </p>
            ) : (
              recentAlerts.map((alert) => (
                <div key={alert.id} className="p-3 border border-corporate-border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{alert.entity}</span>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-corporate-lightGray text-sm mb-2">{alert.threat}</p>
                  <p className="text-xs text-corporate-lightGray">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white">System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-corporate-lightGray">Last Check:</span>
              <span className="text-white ml-2">
                {new Date(anubisStatus.lastCheck).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-corporate-lightGray">Monitoring Mode:</span>
              <span className="text-corporate-accent ml-2">Live Intelligence</span>
            </div>
            <div>
              <span className="text-corporate-lightGray">Data Sources:</span>
              <span className="text-white ml-2">OSINT Networks</span>
            </div>
            <div>
              <span className="text-corporate-lightGray">Response Time:</span>
              <span className="text-white ml-2">&lt; 5 seconds</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnubisCockpit;
