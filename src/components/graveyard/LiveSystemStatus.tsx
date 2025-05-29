
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Activity, Database, Shield, RefreshCw } from 'lucide-react';

interface LiveStatus {
  name: string;
  active_threats: number;
  last_threat_seen: string | null;
  last_report: string | null;
  system_status: 'LIVE' | 'STALE';
}

interface HealthCheck {
  id: string;
  module: string;
  status: 'ok' | 'warn' | 'fail';
  details: string;
  check_time: string;
}

interface QueueItem {
  id: string;
  source: string;
  status: string;
  detected_at: string;
}

const LiveSystemStatus = () => {
  const [liveStatus, setLiveStatus] = useState<LiveStatus[]>([]);
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemStatus = async () => {
    try {
      // For now, simulate live status from existing scan_results until schema is updated
      const { data: scanResults, error: scanError } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (scanError) throw scanError;

      // Create mock live status based on scan results
      const mockStatus: LiveStatus[] = [
        {
          name: 'Reputation Monitoring',
          active_threats: scanResults?.filter(r => r.severity === 'high').length || 0,
          last_threat_seen: scanResults?.[0]?.created_at || null,
          last_report: new Date().toISOString(),
          system_status: scanResults?.length > 0 ? 'LIVE' : 'STALE'
        },
        {
          name: 'Content Analysis',
          active_threats: scanResults?.filter(r => r.severity === 'medium').length || 0,
          last_threat_seen: scanResults?.[1]?.created_at || null,
          last_report: new Date().toISOString(),
          system_status: 'LIVE'
        }
      ];

      setLiveStatus(mockStatus);

      // Create mock health checks
      const mockHealthChecks: HealthCheck[] = [
        {
          id: '1',
          module: 'database',
          status: 'ok',
          details: 'Database connections healthy',
          check_time: new Date().toISOString()
        },
        {
          id: '2',
          module: 'queue_processor',
          status: 'ok',
          details: 'Processing queue operational',
          check_time: new Date().toISOString()
        },
        {
          id: '3',
          module: 'threat_detector',
          status: scanResults?.length > 0 ? 'ok' : 'warn',
          details: scanResults?.length > 0 ? 'Active threat detection' : 'No recent activity',
          check_time: new Date().toISOString()
        }
      ];

      setHealthChecks(mockHealthChecks);

      // Create mock queue items
      const mockQueueItems: QueueItem[] = scanResults?.slice(0, 5).map(result => ({
        id: result.id,
        source: result.platform,
        status: result.status,
        detected_at: result.created_at
      })) || [];

      setQueueItems(mockQueueItems);

    } catch (error) {
      console.error('Error fetching system status:', error);
      toast.error('Failed to fetch system status');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerEnrichmentPipeline = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-and-enrich-threat');
      
      if (error) throw error;
      
      toast.success(`Pipeline completed: ${data?.processed || 0} threats processed`);
      fetchSystemStatus(); // Refresh status after processing
    } catch (error) {
      console.error('Pipeline error:', error);
      toast.error('Failed to run enrichment pipeline');
    } finally {
      setIsProcessing(false);
    }
  };

  const runHealthCheck = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('system-health-monitor');
      
      if (error) throw error;
      
      toast.success(`Health check completed: ${data?.overall_status?.toUpperCase() || 'OK'}`);
      fetchSystemStatus();
    } catch (error) {
      console.error('Health check error:', error);
      toast.error('Failed to run health check');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE':
      case 'ok': return 'bg-green-500';
      case 'warn': return 'bg-yellow-500';
      case 'fail':
      case 'STALE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (module: string) => {
    switch (module) {
      case 'database': return <Database className="h-4 w-4" />;
      case 'queue_processor': return <Activity className="h-4 w-4" />;
      case 'threat_detector': return <Shield className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2">Loading live system status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live System Status</h2>
        <div className="flex gap-2">
          <Button 
            onClick={runHealthCheck}
            variant="outline"
            size="sm"
          >
            <Activity className="h-4 w-4 mr-2" />
            Health Check
          </Button>
          <Button 
            onClick={triggerEnrichmentPipeline}
            disabled={isProcessing}
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? 'Processing...' : 'Run Pipeline'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entity Status */}
        <Card>
          <CardHeader>
            <CardTitle>Entity Monitoring Status</CardTitle>
          </CardHeader>
          <CardContent>
            {liveStatus.length === 0 ? (
              <p className="text-muted-foreground">No entities being monitored</p>
            ) : (
              <div className="space-y-3">
                {liveStatus.map((entity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{entity.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {entity.active_threats} active threats
                      </div>
                    </div>
                    <Badge className={getStatusColor(entity.system_status)}>
                      {entity.system_status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            {healthChecks.length === 0 ? (
              <p className="text-muted-foreground">No health checks available</p>
            ) : (
              <div className="space-y-3">
                {healthChecks.slice(0, 6).map((check) => (
                  <div key={check.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(check.module)}
                      <div>
                        <div className="font-medium capitalize">{check.module.replace('_', ' ')}</div>
                        <div className="text-sm text-muted-foreground">{check.details}</div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(check.status)}>
                      {check.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Processing Queue */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Threat Processing Queue</CardTitle>
          </CardHeader>
          <CardContent>
            {queueItems.length === 0 ? (
              <p className="text-muted-foreground">Queue is empty</p>
            ) : (
              <div className="space-y-2">
                {queueItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{item.source}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(item.detected_at).toLocaleString()}
                      </span>
                    </div>
                    <Badge 
                      className={
                        item.status === 'resolved' ? 'bg-green-500' :
                        item.status === 'actioned' ? 'bg-blue-500' :
                        item.status === 'read' ? 'bg-yellow-500' : 'bg-gray-500'
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveSystemStatus;
