
import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useDashboardData } from "@/hooks/useDashboardData";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import ContentAlerts from "@/components/dashboard/ContentAlerts";
import IntelligenceCollection from "@/components/dashboard/IntelligenceCollection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";

const IntelligencePage = () => {
  const {
    metrics,
    alerts,
    loading,
    error,
    fetchData,
  } = useDashboardData();

  const liveDataCount = alerts.filter(alert => 
    alert.sourceType === 'osint_intelligence' || alert.sourceType === 'live_alert'
  ).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">A.R.I.A™ Threat Intelligence</h1>
          <p className="text-muted-foreground">
            Live OSINT monitoring and threat detection system
          </p>
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-lg">Loading live threat intelligence...</p>
            <p className="text-sm text-gray-500">Connecting to A.R.I.A™ OSINT systems</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">A.R.I.A™ Threat Intelligence</h1>
          <p className="text-muted-foreground">
            Live OSINT monitoring and threat detection system
          </p>
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Live Intelligence System Error</h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchData} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reconnect to Live Systems
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">A.R.I.A™ Threat Intelligence</h1>
          <p className="text-muted-foreground">
            Live OSINT monitoring and threat detection across all digital channels
          </p>
        </div>
        
        {/* Live Data Status */}
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-green-800">A.R.I.A™ OSINT Systems Active</span>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              100% Live Data
            </Badge>
            <Badge variant="outline" className="text-green-700">
              {liveDataCount} Live Threats
            </Badge>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={fetchData}
            className="gap-2 border-green-300 text-green-700 hover:bg-green-100"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh Intelligence
          </Button>
        </div>
      </div>

      {/* Intelligence Metrics */}
      <div className="mb-6">
        <MetricsOverview metrics={metrics} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Intelligence Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Live Threat Intelligence Feed</h2>
            {liveDataCount > 0 && (
              <Badge className="bg-blue-100 text-blue-800">
                {liveDataCount} Active Threats
              </Badge>
            )}
          </div>
          
          {liveDataCount === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Live Threats Detected</h3>
              <p className="text-sm text-gray-500 mb-4">
                A.R.I.A™ OSINT systems are monitoring. No threats currently detected in live feeds.
              </p>
              <p className="text-xs text-gray-400">
                Use Operator Console to trigger manual intelligence sweeps
              </p>
            </div>
          ) : (
            <ContentAlerts alerts={alerts} isLoading={loading} />
          )}
        </div>

        {/* Intelligence Collection Panel */}
        <div className="space-y-6">
          <IntelligenceCollection />
          
          {/* System Status */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Live System Status</span>
            </div>
            <div className="space-y-1 text-xs text-blue-700">
              <div className="flex justify-between">
                <span>Reddit OSINT:</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span>RSS Intelligence:</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Real-time Processing:</span>
                <span className="text-green-600">Online</span>
              </div>
              <div className="flex justify-between">
                <span>Mock Data:</span>
                <span className="text-red-600">Blocked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IntelligencePage;
