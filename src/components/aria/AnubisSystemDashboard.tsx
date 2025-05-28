
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Eye,
  BarChart3,
  Zap,
  Clock,
  Users,
  Server,
  Brain
} from "lucide-react";
import { useAnubisSystemIntegration } from '@/hooks/useAnubisSystemIntegration';
import { anubisIntegrationService } from '@/services/aria/anubisIntegrationService';

const AnubisSystemDashboard = () => {
  const {
    systemHealth,
    systemMetrics,
    isLoading,
    checkSystemHealth,
    getSystemMetrics,
    logComponentAccess
  } = useAnubisSystemIntegration();

  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d'>('24h');
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    logComponentAccess('AnubisSystemDashboard', 'view');
    loadRecentActivities();
  }, []);

  const loadRecentActivities = async () => {
    try {
      const { data } = await supabase
        .from('anubis_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      setRecentActivities(data || []);
    } catch (error) {
      console.error('Failed to load recent activities:', error);
    }
  };

  const handleTimeframeChange = async (timeframe: '1h' | '24h' | '7d') => {
    setSelectedTimeframe(timeframe);
    await getSystemMetrics(timeframe);
  };

  const getModuleIcon = (module: string) => {
    const icons: Record<string, React.ComponentType> = {
      'SOVRA': Shield,
      'EMERGENCY_STRIKE': AlertTriangle,
      'CLEAN_LAUNCH': Zap,
      'EIDETIC': Brain,
      'COMPLIANCE': CheckCircle,
      'CLIENT_MANAGEMENT': Users,
      'RSI': Activity,
      'PRAXIS': BarChart3,
      'DISCOVERY': Eye,
      'HYPERCORE': Server,
      'GRAVEYARD': Clock
    };
    
    const IconComponent = icons[module] || Activity;
    return <IconComponent className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'critical': return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading && !systemHealth) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2">Loading Anubis System Integration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-600" />
            Anubis System Integration Dashboard
          </h2>
          <p className="text-muted-foreground">Complete A.R.I.A™ ecosystem monitoring and oversight</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={checkSystemHealth} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall System Health</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {systemHealth?.overall_status || 'Unknown'}
            </div>
            <p className="text-xs text-muted-foreground">
              {systemHealth?.module_statuses?.length || 0} modules monitored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemMetrics?.total_activities || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Last {selectedTimeframe}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {systemMetrics?.critical_events?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {systemHealth?.module_statuses?.filter(m => m.status === 'healthy').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Operating normally
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules">Module Status</TabsTrigger>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          <TabsTrigger value="metrics">System Metrics</TabsTrigger>
          <TabsTrigger value="critical">Critical Events</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>A.R.I.A™ Module Integration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemHealth?.module_statuses?.map((module: any) => (
                  <div key={module.module} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getModuleIcon(module.module)}
                        <span className="font-medium">{module.module}</span>
                      </div>
                      <Badge className={getStatusColor(module.status)}>
                        {module.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Activities: {module.recent_activity_count || 0}
                    </div>
                    {module.error_count > 0 && (
                      <div className="text-sm text-red-600">
                        Errors: {module.error_count}
                      </div>
                    )}
                    {module.last_activity && (
                      <div className="text-xs text-muted-foreground">
                        Last activity: {new Date(module.last_activity).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <div className="flex gap-2 mb-4">
            {(['1h', '24h', '7d'] as const).map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTimeframeChange(timeframe)}
              >
                {timeframe}
              </Button>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent System Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="border rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getModuleIcon(activity.module)}
                        <span className="font-medium">{activity.module}</span>
                        <span className="text-sm text-muted-foreground">
                          {activity.activity_type}
                        </span>
                      </div>
                      <Badge className={`${getSeverityColor(activity.severity)} text-white`}>
                        {activity.severity}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {activity.source_component}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {systemMetrics?.by_severity && Object.entries(systemMetrics.by_severity).map(([severity, count]) => (
                  <div key={severity} className="text-center">
                    <div className={`text-2xl font-bold ${severity === 'critical' ? 'text-red-600' : severity === 'error' ? 'text-red-500' : severity === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`}>
                      {count as number}
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">{severity}</div>
                  </div>
                ))}
              </div>

              {systemMetrics?.by_module && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Activity by Module</h4>
                  <div className="space-y-2">
                    {Object.entries(systemMetrics.by_module).map(([module, data]: [string, any]) => (
                      <div key={module} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          {getModuleIcon(module)}
                          <span>{module}</span>
                        </div>
                        <Badge variant="outline">{data.total} activities</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Critical Events Requiring Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemMetrics?.critical_events?.length > 0 ? (
                  systemMetrics.critical_events.map((event: any) => (
                    <div key={event.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="font-medium text-red-900">{event.module}</span>
                        </div>
                        <Badge className="bg-red-600 text-white">CRITICAL</Badge>
                      </div>
                      <div className="text-sm text-red-800 mb-2">
                        {event.activity_type} in {event.source_component}
                      </div>
                      <div className="text-xs text-red-600">
                        {new Date(event.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">No critical events detected</p>
                    <p className="text-sm text-muted-foreground">All A.R.I.A™ systems are operating normally</p>
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

export default AnubisSystemDashboard;
