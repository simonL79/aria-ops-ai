
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Shield, 
  Zap, 
  Activity, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Database
} from 'lucide-react';
import { AnubisService } from '@/services/aria/anubisService';
import { toast } from 'sonner';

interface SystemHealth {
  component: string;
  status: string;
  lastCheck: string;
  message: string;
}

const HyperCoreDashboard = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadSystemHealth();
    const interval = setInterval(loadSystemHealth, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemHealth = async () => {
    try {
      const health = await AnubisService.getSystemHealth();
      setSystemHealth(health);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load system health:', error);
      toast.error('Failed to load system health');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'offline': return <Database className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getOverallHealth = () => {
    if (systemHealth.length === 0) return { status: 'unknown', percentage: 0 };
    
    const healthyCount = systemHealth.filter(h => h.status.toLowerCase() === 'healthy').length;
    const percentage = Math.round((healthyCount / systemHealth.length) * 100);
    
    if (percentage >= 90) return { status: 'excellent', percentage };
    if (percentage >= 70) return { status: 'good', percentage };
    if (percentage >= 50) return { status: 'fair', percentage };
    return { status: 'poor', percentage };
  };

  const overallHealth = getOverallHealth();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading A.R.I.A™ HyperCore status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-600" />
            A.R.I.A™ HyperCore Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Advanced AI System Monitoring & Intelligence Coordination
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Last Updated</div>
          <div className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Overall Health */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="font-medium">System Health</span>
              </div>
              <div className="text-3xl font-bold text-purple-600">
                {overallHealth.percentage}%
              </div>
              <Progress value={overallHealth.percentage} className="w-full" />
              <div className="text-sm text-gray-600 capitalize">
                Status: {overallHealth.status}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Active Modules</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {systemHealth.filter(h => h.status.toLowerCase() !== 'offline').length}
              </div>
              <div className="text-sm text-gray-600">
                of {systemHealth.length} total modules
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium">Performance</span>
              </div>
              <div className="text-3xl font-bold text-green-600">
                {systemHealth.filter(h => h.status.toLowerCase() === 'healthy').length}
              </div>
              <div className="text-sm text-gray-600">
                healthy components
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Components */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Components</TabsTrigger>
          <TabsTrigger value="healthy">Healthy</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemHealth.map((component, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(component.status)}
                      <span className="font-medium">{component.component}</span>
                    </div>
                    <Badge className={getStatusColor(component.status)}>
                      {component.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {component.message}
                  </p>
                  
                  <div className="text-xs text-gray-500">
                    Last check: {new Date(component.lastCheck).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="healthy">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemHealth
              .filter(h => h.status.toLowerCase() === 'healthy')
              .map((component, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(component.status)}
                        <span className="font-medium">{component.component}</span>
                      </div>
                      <Badge className={getStatusColor(component.status)}>
                        {component.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {component.message}
                    </p>
                    
                    <div className="text-xs text-gray-500">
                      Last check: {new Date(component.lastCheck).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="issues">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemHealth
              .filter(h => h.status.toLowerCase() !== 'healthy')
              .map((component, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(component.status)}
                        <span className="font-medium">{component.component}</span>
                      </div>
                      <Badge className={getStatusColor(component.status)}>
                        {component.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {component.message}
                    </p>
                    
                    <div className="text-xs text-gray-500">
                      Last check: {new Date(component.lastCheck).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 justify-center">
            <Button onClick={loadSystemHealth} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
            <Button variant="default">
              <Zap className="h-4 w-4 mr-2" />
              Run Full Diagnostics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HyperCoreDashboard;
