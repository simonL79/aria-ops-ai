
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, AlertTriangle, BarChart3, Settings, Activity, TrendingUp, LayoutDashboard, Users, ListChecks, Cpu, Server } from 'lucide-react';
import { toast } from 'sonner';
import SecurityCenter from '@/components/aria/SecurityCenter';
import IntelligenceHub from '@/components/aria/IntelligenceHub';
import LocalModelManager from '@/components/aria/LocalModelManager';
import LocalServerMonitor from '@/components/aria/LocalServerMonitor';

const ControlCenter = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'security' | 'intelligence' | 'models' | 'server'>('overview');

  const systemStats = {
    activeThreats: 3,
    totalEntities: 127,
    intelligenceItems: 45,
    systemHealth: 98
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'threat_scan':
        toast.info('🔍 Initiating threat scan...');
        setTimeout(() => toast.success('✅ Threat scan completed'), 2000);
        break;
      case 'intelligence_sweep':
        toast.info('🧠 Starting intelligence sweep...');
        setTimeout(() => toast.success('✅ Intelligence sweep completed'), 2500);
        break;
      case 'security_check':
        toast.info('🛡️ Running security check...');
        setTimeout(() => toast.success('✅ Security check passed'), 1500);
        break;
      default:
        toast.info(`Executing ${action}...`);
    }
  };

  if (activeSection === 'security') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <Button
            onClick={() => setActiveSection('overview')}
            variant="ghost"
            className="mb-2"
          >
            ← Back to Control Center
          </Button>
        </div>
        <div className="container mx-auto px-6 py-8">
          <SecurityCenter />
        </div>
      </div>
    );
  }

  if (activeSection === 'intelligence') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <Button
            onClick={() => setActiveSection('overview')}
            variant="ghost"
            className="mb-2"
          >
            ← Back to Control Center
          </Button>
        </div>
        <div className="container mx-auto px-6 py-8">
          <IntelligenceHub />
        </div>
      </div>
    );
  }

  if (activeSection === 'models') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <Button
            onClick={() => setActiveSection('overview')}
            variant="ghost"
            className="mb-2"
          >
            ← Back to Control Center
          </Button>
        </div>
        <div className="container mx-auto px-6 py-8">
          <LocalModelManager />
        </div>
      </div>
    );
  }

  if (activeSection === 'server') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <Button
            onClick={() => setActiveSection('overview')}
            variant="ghost"
            className="mb-2"
          >
            ← Back to Control Center
          </Button>
        </div>
        <div className="container mx-auto px-6 py-8">
          <LocalServerMonitor />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">A.R.I.A™ Control Center</h1>
          <p className="text-gray-600">Advanced Reputation Intelligence Assistant - Command & Control</p>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{systemStats.activeThreats}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monitored Entities</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{systemStats.totalEntities}</div>
              <p className="text-xs text-muted-foreground">Under surveillance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Intelligence Items</CardTitle>
              <Brain className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{systemStats.intelligenceItems}</div>
              <p className="text-xs text-muted-foreground">New insights</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemStats.systemHealth}%</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => handleQuickAction('threat_scan')}
                className="h-16 bg-red-600 hover:bg-red-700 text-white"
              >
                <Target className="h-6 w-6 mr-2" />
                Run Threat Scan
              </Button>
              <Button
                onClick={() => handleQuickAction('intelligence_sweep')}
                className="h-16 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Brain className="h-6 w-6 mr-2" />
                Intelligence Sweep
              </Button>
              <Button
                onClick={() => handleQuickAction('security_check')}
                className="h-16 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <AlertTriangle className="h-6 w-6 mr-2" />
                Security Check
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('security')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Security Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Real-time security monitoring and threat analysis
              </p>
              <Badge className="bg-red-100 text-red-700">3 Active Alerts</Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('intelligence')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Intelligence Hub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                AI-powered threat intelligence and pattern analysis
              </p>
              <Badge className="bg-purple-100 text-purple-700">45 Insights</Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('models')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-600" />
                AI Model Manager
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Monitor and manage local AI inference models
              </p>
              <Badge className="bg-blue-100 text-blue-700">4 Models Active</Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection('server')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-green-600" />
                Server Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Real-time local AI server health and performance
              </p>
              <Badge className="bg-green-100 text-green-700">Port 3001</Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive reporting and trend analysis
              </p>
              <Badge className="bg-orange-100 text-orange-700">Coming Soon</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">High-priority threat detected</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
                <Badge className="bg-red-100 text-red-700">CRITICAL</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Brain className="h-4 w-4 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">AI analysis completed</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
                <Badge className="bg-purple-100 text-purple-700">ANALYSIS</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Activity className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">System health check passed</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
                <Badge className="bg-green-100 text-green-700">SUCCESS</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ControlCenter;
