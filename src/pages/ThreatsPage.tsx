import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import LiveDataGuard from "@/components/dashboard/LiveDataGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Activity, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardData } from "@/hooks/useDashboardData";

const ThreatsPage = () => {
  const { alerts, loading } = useDashboardData();
  
  // Filter for only live OSINT threats
  const liveThreats = alerts.filter(alert => 
    alert.sourceType === 'live_osint' || 
    alert.sourceType === 'osint_intelligence' ||
    alert.sourceType === 'live_scan'
  );

  return (
    <DashboardLayout>
      <LiveDataGuard enforceStrict={true}>
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            A.R.I.A™ Threat Intelligence
          </h1>
          <p className="text-muted-foreground">
            Real-time threat detection powered by live OSINT intelligence
          </p>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Threats</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    Live OSINT Threats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-4">Loading live threats...</div>
                    ) : liveThreats.length > 0 ? (
                      liveThreats.slice(0, 5).map((threat) => (
                        <div key={threat.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-red-800">{threat.severity.toUpperCase()}</span>
                            <span className="text-sm text-red-600">{threat.platform}</span>
                          </div>
                          <p className="text-sm text-red-700 line-clamp-2">{threat.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-green-800">No Live Threats</span>
                          <span className="text-sm text-green-600">OSINT Active</span>
                        </div>
                        <p className="text-sm text-green-700">All live monitoring systems operational</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Live OSINT Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Reddit OSINT</span>
                      <span className="text-green-600">✓ Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>RSS Intelligence</span>
                      <span className="text-green-600">✓ Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Live Scanning</span>
                      <span className="text-green-600">✓ Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Mock Data Sources</span>
                      <span className="text-red-600">✗ Blocked</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live OSINT Monitoring Status
                </h3>
                <p className="text-muted-foreground">Advanced live intelligence monitoring active</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Live Threat Analysis</h3>
                <p className="text-muted-foreground">AI-powered analysis of live OSINT intelligence</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Live Threat History</h3>
                <p className="text-muted-foreground">Historical live intelligence data and response analytics</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </LiveDataGuard>
    </DashboardLayout>
  );
};

export default ThreatsPage;
