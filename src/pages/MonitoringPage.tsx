import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import LiveDataGuard from "@/components/dashboard/LiveDataGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Radar, Globe, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardData } from "@/hooks/useDashboardData";

const MonitoringPage = () => {
  const { sources, loading } = useDashboardData();
  
  // Filter for only live OSINT sources
  const liveSources = sources.filter(source => 
    source.type === 'osint_source' || 
    source.name?.includes('Reddit') || 
    source.name?.includes('RSS')
  );

  return (
    <DashboardLayout>
      <LiveDataGuard enforceStrict={true}>
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Radar className="h-8 w-8 text-blue-500" />
            A.R.I.A™ Live OSINT Monitoring
          </h1>
          <p className="text-muted-foreground">
            Live intelligence monitoring across verified OSINT channels
          </p>
        </div>

        <Tabs defaultValue="sources" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sources">Live Sources</TabsTrigger>
            <TabsTrigger value="social">Social Intel</TabsTrigger>
            <TabsTrigger value="news">News Intel</TabsTrigger>
            <TabsTrigger value="osint">OSINT Feed</TabsTrigger>
          </TabsList>

          <TabsContent value="sources">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    Live OSINT Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Reddit OSINT</span>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>RSS Intelligence</span>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Live Scanning</span>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Mock Sources</span>
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-500" />
                    Intelligence Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {liveSources.map((source) => (
                      <div key={source.id} className="flex justify-between items-center">
                        <span>{source.name}</span>
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      </div>
                    ))}
                    {liveSources.length === 0 && (
                      <div className="text-sm text-gray-500">No live sources configured</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Activity className="h-5 w-5 text-red-500" />
                    Live Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Live Sources</span>
                      <span className="font-semibold">{liveSources.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Mock Data</span>
                      <span className="font-semibold text-red-600">BLOCKED</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Data Quality</span>
                      <span className="font-semibold text-green-600">100% Live</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Enforcement</span>
                      <span className="font-semibold text-blue-600">ACTIVE</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Live Social Intelligence</h3>
                <p className="text-muted-foreground">Real-time OSINT from verified social platforms</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Live News Intelligence</h3>
                <p className="text-muted-foreground">Live news monitoring through RSS and direct feeds</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="osint">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">OSINT Intelligence Feed</h3>
                <p className="text-muted-foreground">Advanced OSINT monitoring and threat detection</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </LiveDataGuard>
    </DashboardLayout>
  );
};

export default MonitoringPage;
