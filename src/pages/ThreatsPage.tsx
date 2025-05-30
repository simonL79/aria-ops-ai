
import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Activity, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ThreatsPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          A.R.I.A™ Threat Intelligence
        </h1>
        <p className="text-muted-foreground">
          Real-time threat detection and analysis powered by advanced AI
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
                  Critical Threats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-red-800">No Critical Threats</span>
                      <span className="text-sm text-red-600">Live</span>
                    </div>
                    <p className="text-sm text-red-700">All systems monitoring normally</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Threat Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Social Media</span>
                    <span className="text-green-600">✓ Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>News Sources</span>
                    <span className="text-green-600">✓ Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Dark Web</span>
                    <span className="text-green-600">✓ Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Forums</span>
                    <span className="text-green-600">✓ Active</span>
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
                Live Monitoring Status
              </h3>
              <p className="text-muted-foreground">Advanced monitoring systems active and scanning for threats</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Threat Analysis</h3>
              <p className="text-muted-foreground">AI-powered threat analysis and pattern recognition</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Threat History</h3>
              <p className="text-muted-foreground">Historical threat data and response analytics</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ThreatsPage;
