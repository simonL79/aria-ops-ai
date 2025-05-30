
import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Radar, Globe, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MonitoringPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Radar className="h-8 w-8 text-blue-500" />
          A.R.I.A™ Monitoring Center
        </h1>
        <p className="text-muted-foreground">
          Comprehensive monitoring across all digital channels and platforms
        </p>
      </div>

      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="news">News & Media</TabsTrigger>
          <TabsTrigger value="darkweb">Dark Web</TabsTrigger>
        </TabsList>

        <TabsContent value="sources">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  Social Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Twitter/X</span>
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Reddit</span>
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Instagram</span>
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>TikTok</span>
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-500" />
                  News Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Google News</span>
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>RSS Feeds</span>
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Press Releases</span>
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Blog Networks</span>
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-500" />
                  Monitoring Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Active Sources</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Daily Scans</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Alerts Today</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Uptime</span>
                    <span className="font-semibold text-green-600">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Social Media Monitoring</h3>
              <p className="text-muted-foreground">Real-time monitoring of social media platforms for mentions and threats</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">News & Media Monitoring</h3>
              <p className="text-muted-foreground">Comprehensive news and media source monitoring</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="darkweb">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Dark Web Surveillance</h3>
              <p className="text-muted-foreground">Advanced dark web monitoring and threat detection</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default MonitoringPage;
