
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, TestTube, Shield, Settings, Wrench } from 'lucide-react';
import QATestDashboard from './QATestDashboard';
import SystemHealthDashboard from './SystemHealthDashboard';
import ThreatIngestWorker from '../intelligence/ThreatIngestWorker';
import AnubisValidationPanel from '../aria/AnubisValidationPanel';
import SystemConfigurationTab from './SystemConfigurationTab';
import AnubisCreeperLogViewer from './AnubisCreeperLogViewer';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto p-6 space-y-6 bg-black text-white min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">ARIA™ NOC Admin Dashboard</h1>
          <p className="text-gray-300">
            Central command for system monitoring, testing, and administration
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 bg-gray-900 border border-gray-800">
          <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:bg-amber-500 data-[state=active]:text-black">Overview</TabsTrigger>
          <TabsTrigger value="config" className="text-gray-300 data-[state=active]:bg-amber-500 data-[state=active]:text-black">System Config</TabsTrigger>
          <TabsTrigger value="qa" className="text-gray-300 data-[state=active]:bg-amber-500 data-[state=active]:text-black">QA Testing</TabsTrigger>
          <TabsTrigger value="health" className="text-gray-300 data-[state=active]:bg-amber-500 data-[state=active]:text-black">System Health</TabsTrigger>
          <TabsTrigger value="anubis" className="text-gray-300 data-[state=active]:bg-amber-500 data-[state=active]:text-black">Anubis Security</TabsTrigger>
          <TabsTrigger value="workers" className="text-gray-300 data-[state=active]:bg-amber-500 data-[state=active]:text-black">Workers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-black border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <TestTube className="h-4 w-4" />
                  QA Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">Ready</div>
                <p className="text-xs text-gray-400">
                  All systems operational
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <Activity className="h-4 w-4" />
                  Health Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">98%</div>
                <p className="text-xs text-gray-400">
                  System performance
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <Shield className="h-4 w-4" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">Secure</div>
                <p className="text-xs text-gray-400">
                  No vulnerabilities
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <Settings className="h-4 w-4" />
                  Workers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">3</div>
                <p className="text-xs text-gray-400">
                  Active processes
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-300">
                  Common administrative tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  onClick={() => setActiveTab('qa')}
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Run QA Test Suite
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  onClick={() => setActiveTab('health')}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Check System Health
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  onClick={() => setActiveTab('workers')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Workers
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">System Status</CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time status of critical system components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">Database</span>
                    <span className="text-sm text-green-400">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">AI Services</span>
                    <span className="text-sm text-green-400">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">Monitoring</span>
                    <span className="text-sm text-green-400">Running</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">Alerts</span>
                    <span className="text-sm text-yellow-400">1 Warning</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config">
          <SystemConfigurationTab />
        </TabsContent>

        <TabsContent value="qa">
          <QATestDashboard />
        </TabsContent>

        <TabsContent value="health">
          <SystemHealthDashboard />
          <div className="mt-8">
            <AnubisCreeperLogViewer />
          </div>
        </TabsContent>

        <TabsContent value="anubis">
          <AnubisValidationPanel />
        </TabsContent>

        <TabsContent value="workers">
          <ThreatIngestWorker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
