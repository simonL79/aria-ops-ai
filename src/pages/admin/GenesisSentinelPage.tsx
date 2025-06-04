
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import GenesisSentinelPanel from '@/components/admin/GenesisSentinelPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, TrendingUp, Globe, AlertTriangle, Zap, Activity, Target } from 'lucide-react';

const GenesisSentinelPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 corporate-heading">
              <Shield className="h-8 w-8 text-corporate-accent" />
              A.R.I.A™ Genesis Sentinel - System Command Center
            </h1>
            <p className="corporate-subtext mt-1">
              Real-time monitoring and integrity validation for all A.R.I.A vX systems
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 bg-corporate-darkSecondary text-corporate-lightGray border-corporate-border">
              <Activity className="h-3 w-3 animate-pulse" />
              Live Monitoring
            </Badge>
            <Badge className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
              Command & Control
            </Badge>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Shield className="h-4 w-4 text-corporate-accent" />
                Core Systems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">6/6</div>
              <p className="text-xs corporate-subtext">Operational</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Target className="h-4 w-4 text-corporate-accent" />
                OSINT Scanners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">7/7</div>
              <p className="text-xs corporate-subtext">Active scanning</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Zap className="h-4 w-4 text-corporate-accent" />
                Edge Functions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">8/8</div>
              <p className="text-xs corporate-subtext">Ready & responsive</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Globe className="h-4 w-4 text-corporate-accent" />
                Data Integrity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">100%</div>
              <p className="text-xs corporate-subtext">Live data only</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Genesis Sentinel Panel */}
        <GenesisSentinelPanel />

        {/* A.R.I.A vX Deployment Plan Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <TrendingUp className="h-5 w-5 text-corporate-accent" />
                2-Week Deployment Progress
              </CardTitle>
              <CardDescription className="corporate-subtext">A.R.I.A vX implementation timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-corporate-lightGray">Week 1: Foundation & Trust</span>
                  <Badge className="bg-green-500">ACTIVE</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-corporate-lightGray">Week 2: Intelligence & Automation</span>
                  <Badge className="bg-blue-500">PLANNED</Badge>
                </div>
                
                <div className="pt-2">
                  <div className="text-xs text-corporate-lightGray mb-1">Overall Progress</div>
                  <div className="w-full bg-corporate-darkTertiary rounded-full h-2">
                    <div className="bg-corporate-accent h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <div className="text-xs text-corporate-lightGray mt-1">35% Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <Eye className="h-5 w-5 text-corporate-accent" />
                Critical Success Metrics
              </CardTitle>
              <CardDescription className="corporate-subtext">Real-time validation targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">Live Data Compliance</span>
                  <span className="text-green-400 font-medium">TARGET: 100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">Entity Linkage Rate</span>
                  <span className="text-white font-medium">TARGET: 95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">System Uptime</span>
                  <span className="text-white font-medium">TARGET: 99%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">Mock Data Detected</span>
                  <span className="text-green-400 font-medium">TARGET: 0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">Response Time</span>
                  <span className="text-white font-medium">TARGET: &lt;30s</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Monitoring Features */}
        <Card className="border-corporate-accent bg-corporate-darkSecondary">
          <CardHeader>
            <CardTitle className="text-corporate-accent flex items-center gap-2">
              <Shield className="h-5 w-5" />
              A.R.I.A vX™ Enhanced Monitoring Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-white mb-2">Real-Time Health Checks</h4>
                <ul className="space-y-1 text-corporate-lightGray">
                  <li>• Core system component monitoring</li>
                  <li>• OSINT scanner status validation</li>
                  <li>• Edge function responsiveness</li>
                  <li>• Database connectivity verification</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Data Integrity Validation</h4>
                <ul className="space-y-1 text-corporate-lightGray">
                  <li>• Zero-tolerance mock data detection</li>
                  <li>• Entity linkage quality assessment</li>
                  <li>• Confidence pipeline health monitoring</li>
                  <li>• Live data compliance tracking</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Performance Analytics</h4>
                <ul className="space-y-1 text-corporate-lightGray">
                  <li>• System uptime tracking</li>
                  <li>• Response time optimization</li>
                  <li>• Threat processing metrics</li>
                  <li>• Automated alerting system</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GenesisSentinelPage;
