
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Shield, Search, Users, Database, Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const GenesisSentinel = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [scanTarget, setScanTarget] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
        <span className="ml-2 text-white">Loading Genesis Sentinel...</span>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleScan = async () => {
    setIsScanning(true);
    // Simulate scan process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsScanning(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Genesis Sentinel™</h1>
          <p className="text-gray-300 mt-2">
            Advanced threat detection and entity discovery system
          </p>
        </div>

        <Tabs defaultValue="threat-detection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-corporate-darkSecondary border border-corporate-border">
            <TabsTrigger value="threat-detection" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Shield className="h-4 w-4 mr-2" />
              Threat Detection
            </TabsTrigger>
            <TabsTrigger value="entity-discovery" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Search className="h-4 w-4 mr-2" />
              Entity Discovery
            </TabsTrigger>
            <TabsTrigger value="risk-intelligence" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Risk Intelligence
            </TabsTrigger>
            <TabsTrigger value="data-management" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Database className="h-4 w-4 mr-2" />
              Data Management
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Activity className="h-4 w-4 mr-2" />
              Live Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="threat-detection">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    Threat Scanning Engine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter target entity or domain..."
                      value={scanTarget}
                      onChange={(e) => setScanTarget(e.target.value)}
                      className="bg-corporate-dark border-corporate-border text-white"
                    />
                    <Button 
                      onClick={handleScan}
                      disabled={isScanning || !scanTarget}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isScanning ? 'Scanning...' : 'Scan'}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-corporate-dark p-3 rounded">
                      <div className="text-sm text-gray-400">Active Scans</div>
                      <div className="text-2xl font-bold text-green-400">3</div>
                    </div>
                    <div className="bg-corporate-dark p-3 rounded">
                      <div className="text-sm text-gray-400">Threats Found</div>
                      <div className="text-2xl font-bold text-red-400">12</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-white">Recent Detections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-corporate-dark rounded">
                      <div>
                        <div className="text-white font-medium">Reputation Risk</div>
                        <div className="text-sm text-gray-400">Reddit Discussion</div>
                      </div>
                      <Badge className="bg-red-500 text-white">High</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-corporate-dark rounded">
                      <div>
                        <div className="text-white font-medium">Legal Mention</div>
                        <div className="text-sm text-gray-400">News Article</div>
                      </div>
                      <Badge className="bg-yellow-500 text-black">Medium</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-corporate-dark rounded">
                      <div>
                        <div className="text-white font-medium">Brand Mention</div>
                        <div className="text-sm text-gray-400">Social Media</div>
                      </div>
                      <Badge className="bg-green-500 text-white">Low</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="entity-discovery">
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-500" />
                  Entity Discovery Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
                  <h3 className="text-lg font-medium text-white mb-2">Entity Discovery</h3>
                  <p className="text-corporate-lightGray">Advanced entity mapping and relationship analysis</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk-intelligence">
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Risk Intelligence Hub
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
                  <h3 className="text-lg font-medium text-white mb-2">Risk Intelligence</h3>
                  <p className="text-corporate-lightGray">Comprehensive risk assessment and intelligence gathering</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data-management">
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-500" />
                  Data Management Console
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Database className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
                  <h3 className="text-lg font-medium text-white mb-2">Data Management</h3>
                  <p className="text-corporate-lightGray">Centralized data governance and management</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring">
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-500" />
                  Live Monitoring System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
                  <h3 className="text-lg font-medium text-white mb-2">Live Monitoring</h3>
                  <p className="text-corporate-lightGray">Real-time threat monitoring and alerting</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default GenesisSentinel;
