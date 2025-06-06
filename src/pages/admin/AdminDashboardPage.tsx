
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Activity, 
  Users, 
  Database, 
  Server, 
  AlertTriangle,
  TrendingUp,
  Eye,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const systemStats = {
    activeThreatScans: 12,
    clientsMonitored: 8,
    liveIntelligenceItems: 847,
    localServerStatus: 'online',
    edgeFunctionsActive: 15,
    lastScanTime: '2 minutes ago'
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">A.R.I.A™ Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and administrative controls</p>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Server className="h-3 w-3 mr-1" />
            Local AI Online
          </Badge>
        </div>

        {/* System Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Threat Scans</CardTitle>
              <Activity className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{systemStats.activeThreatScans}</div>
              <p className="text-xs text-muted-foreground">Live monitoring active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients Monitored</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{systemStats.clientsMonitored}</div>
              <p className="text-xs text-muted-foreground">Entities under protection</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Intelligence</CardTitle>
              <Database className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{systemStats.liveIntelligenceItems}</div>
              <p className="text-xs text-muted-foreground">Real data points collected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Edge Functions</CardTitle>
              <Zap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemStats.edgeFunctionsActive}</div>
              <p className="text-xs text-muted-foreground">Backend services running</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex-col"
                onClick={() => navigate('/admin/control-center')}
              >
                <Shield className="h-6 w-6 mb-2" />
                Control Center
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex-col"
                onClick={() => navigate('/content-generation')}
              >
                <TrendingUp className="h-6 w-6 mb-2" />
                Content Generation
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex-col"
                onClick={() => navigate('/admin/clients')}
              >
                <Users className="h-6 w-6 mb-2" />
                Client Management
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex-col"
                onClick={() => navigate('/admin/system-optimization')}
              >
                <Activity className="h-6 w-6 mb-2" />
                System Monitor
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Local AI Server Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Ollama Server</span>
                  <Badge className="bg-green-500 text-white">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Response Time</span>
                  <span className="text-sm text-muted-foreground">< 500ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Models Loaded</span>
                  <span className="text-sm text-muted-foreground">3 active</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Local threat analysis completed</span>
                  <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Content generation task finished</span>
                  <span className="text-xs text-muted-foreground ml-auto">5m ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">New intelligence data ingested</span>
                  <span className="text-xs text-muted-foreground ml-auto">8m ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
