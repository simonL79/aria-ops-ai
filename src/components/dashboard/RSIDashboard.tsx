
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Brain, Target, Activity, Zap, Eye, FileText } from "lucide-react";
import RSIManagementPanel from './RSIManagementPanel';
import RSIThreatSimulator from './RSIThreatSimulator';
import RSICampaignBuilder from './rsi/RSICampaignBuilder';
import RSIAnalytics from './rsi/RSIAnalytics';
import ARIAThreatPulsePanel from './rsi/ARIAThreatPulsePanel';
import ARIAAdvancedModules from './rsi/ARIAAdvancedModules';
import ARIAReportsPanel from './rsi/ARIAReportsPanel';

const RSIDashboard = () => {
  const [activeTab, setActiveTab] = useState('management');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            RSI™ Command Center
          </h1>
          <p className="text-gray-600 mt-1">
            Reputation Surface Inversion - Never-Stop Autonomous Protection
          </p>
        </div>
      </div>

      {/* RSI Status Banner */}
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-medium">RSI™ Never-Stop Mode: ACTIVE</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Auto-Triggers: Enabled</span>
              <span>Threat Level: Medium</span>
              <span>Response Time: &lt; 5min</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7">
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Management
          </TabsTrigger>
          <TabsTrigger value="simulator" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Threat Simulator
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Campaign Builder
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Deep Analytics
          </TabsTrigger>
          <TabsTrigger value="aria" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            A.R.I.A™ Pulse
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            A.R.I.A™ Advanced
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Auto Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="management">
          <RSIManagementPanel />
        </TabsContent>

        <TabsContent value="simulator">
          <RSIThreatSimulator />
        </TabsContent>

        <TabsContent value="campaigns">
          <RSICampaignBuilder />
        </TabsContent>

        <TabsContent value="analytics">
          <RSIAnalytics />
        </TabsContent>

        <TabsContent value="aria">
          <ARIAThreatPulsePanel />
        </TabsContent>

        <TabsContent value="advanced">
          <ARIAAdvancedModules />
        </TabsContent>

        <TabsContent value="reports">
          <ARIAReportsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RSIDashboard;
