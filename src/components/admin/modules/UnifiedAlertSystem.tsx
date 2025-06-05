
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, Shield, Brain, Zap, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Alert {
  id: string;
  type: 'threat' | 'strategy' | 'execution' | 'system';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  timestamp: string;
  status: 'new' | 'read' | 'dismissed';
  data?: any;
}

const UnifiedAlertSystem = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'high' | 'critical'>('all');

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const loadAlerts = async () => {
    try {
      const alertsData: Alert[] = [];

      // Load threat alerts
      const { data: threatData } = await supabase
        .from('scan_results')
        .select('*')
        .in('severity', ['high', 'critical'])
        .eq('status', 'new')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(10);

      if (threatData) {
        threatData.forEach(threat => {
          alertsData.push({
            id: `threat-${threat.id}`,
            type: 'threat',
            title: `${threat.severity.toUpperCase()} Threat Detected`,
            message: `${threat.platform}: ${threat.content.substring(0, 100)}...`,
            severity: threat.severity as any,
            source: 'Threat Detection',
            timestamp: threat.created_at,
            status: 'new',
            data: threat
          });
        });
      }

      // Load strategy alerts
      const { data: strategyData } = await supabase
        .from('strategy_responses')
        .select('*')
        .eq('status', 'pending')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(5);

      if (strategyData) {
        strategyData.forEach(strategy => {
          alertsData.push({
            id: `strategy-${strategy.id}`,
            type: 'strategy',
            title: 'New Strategy Generated',
            message: `${strategy.title} - ${strategy.description}`,
            severity: strategy.priority === 'critical' ? 'critical' : 'medium',
            source: 'Strategy Brain',
            timestamp: strategy.created_at,
            status: 'new',
            data: strategy
          });
        });
      }

      // Load system alerts
      const { data: systemData } = await supabase
        .from('aria_ops_log')
        .select('*')
        .eq('success', false)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(5);

      if (systemData) {
        systemData.forEach(log => {
          alertsData.push({
            id: `system-${log.id}`,
            type: 'system',
            title: 'System Error',
            message: `${log.module_source}: ${log.operation_type} failed`,
            severity: 'high',
            source: 'System Monitor',
            timestamp: log.created_at,
            status: 'new',
            data: log
          });
        });
      }

      // Filter alerts
      let filteredAlerts = alertsData;
      if (filter === 'new') {
        filteredAlerts = alertsData.filter(a => a.status === 'new');
      } else if (filter === 'high' || filter === 'critical') {
        filteredAlerts = alertsData.filter(a => a.severity === filter);
      }

      // Sort by timestamp
      filteredAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setAlerts(filteredAlerts);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  };

  const markAsRead = async (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'read' as const } : alert
    ));
    toast.success('Alert marked as read');
  };

  const dismissAlert = async (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast.success('Alert dismissed');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'threat': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'strategy': return <Brain className="h-4 w-4 text-purple-600" />;
      case 'execution': return <Zap className="h-4 w-4 text-blue-600" />;
      case 'system': return <Shield className="h-4 w-4 text-orange-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const alertCounts = {
    total: alerts.length,
    new: alerts.filter(a => a.status === 'new').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            Unified Alert System
          </h2>
          <p className="text-muted-foreground">Centralized alerts from all A.R.I.A™ modules</p>
        </div>
      </div>

      {/* Alert Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertCounts.total}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{alertCounts.new}</div>
            <p className="text-xs text-muted-foreground">Unread</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{alertCounts.critical}</div>
            <p className="text-xs text-muted-foreground">Immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{alertCounts.high}</div>
            <p className="text-xs text-muted-foreground">Urgent attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All Alerts
        </Button>
        <Button 
          variant={filter === 'new' ? 'default' : 'outline'}
          onClick={() => setFilter('new')}
          size="sm"
        >
          New Only
        </Button>
        <Button 
          variant={filter === 'critical' ? 'default' : 'outline'}
          onClick={() => setFilter('critical')}
          size="sm"
        >
          Critical
        </Button>
        <Button 
          variant={filter === 'high' ? 'default' : 'outline'}
          onClick={() => setFilter('high')}
          size="sm"
        >
          High Priority
        </Button>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">No alerts</p>
              <p className="text-sm text-muted-foreground">All systems operating normally</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`border rounded-lg p-4 ${alert.status === 'new' ? 'bg-blue-50 border-blue-200' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{alert.title}</h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{alert.source}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        <div className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.status === 'new' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(alert.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Mark Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <EyeOff className="h-3 w-3 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedAlertSystem;
