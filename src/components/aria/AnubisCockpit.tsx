import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Activity, BarChart3, Eye, Brain } from "lucide-react";
import AnubisMonitor from './AnubisMonitor';
import AnubisSystemDashboard from './AnubisSystemDashboard';

const AnubisCockpit = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-purple-600" />
            A.R.I.A™ Anubis Security Cockpit
          </h1>
          <p className="text-muted-foreground">
            Comprehensive security monitoring, system diagnostics, and A.R.I.A™ ecosystem oversight
          </p>
        </div>
      </div>

      <Tabs defaultValue="integration" className="space-y-6">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            System Integration
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Health Monitor
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Center
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Intelligence Hub
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integration">
          <AnubisSystemDashboard />
        </TabsContent>

        <TabsContent value="monitor">
          <AnubisMonitor />
        </TabsContent>

        <TabsContent value="security">
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Security Center</h3>
            <p className="text-muted-foreground">Advanced security monitoring and threat analysis</p>
            <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="intelligence">
          <div className="text-center py-8">
            <Eye className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Intelligence Hub</h3>
            <p className="text-muted-foreground">AI-powered threat intelligence and analysis</p>
            <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnubisCockpit;
