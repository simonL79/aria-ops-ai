
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Shield, AlertTriangle, Activity, CheckCircle, RefreshCw } from 'lucide-react';
import DashboardLayout from "@/components/layout/DashboardLayout";

const CommandCenterPage = () => {
  const {
    alerts,
    sources,
    negativeContent,
    loading,
    error,
    fetchData,
  } = useDashboardData();

  // Filter for live OSINT data only
  const liveAlerts = alerts.filter(alert => 
    alert.sourceType === 'osint_intelligence' || 
    alert.sourceType === 'live_alert' ||
    alert.sourceType === 'live_osint'
  );

  const highRiskAlerts = liveAlerts.filter(alert => alert.severity === 'high').length;
  const activeSources = sources.filter(source => source.type === 'osint_source').length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-lg">Loading A.R.I.A™ Command Center...</p>
            <p className="text-sm text-gray-500">Connecting to live OSINT systems</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Command Center Offline</h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchData} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reconnect Systems
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">A.R.I.A™ Command Center</h1>
              <p className="text-gray-600">Live OSINT intelligence command and control</p>
            </div>
            <Button onClick={fetchData} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Live Data
            </Button>
          </div>
          
          {/* Live Status Bar */}
          <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-green-800">A.R.I.A™ OSINT Systems Online</span>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              100% Live Intelligence
            </Badge>
            <Badge variant="outline" className="text-green-700">
              {liveAlerts.length} Live Threats
            </Badge>
          </div>
        </div>

        {/* Command Center Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Threat Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {highRiskAlerts > 5 ? 'CRITICAL' : highRiskAlerts > 2 ? 'HIGH' : liveAlerts.length > 0 ? 'MEDIUM' : 'LOW'}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {liveAlerts.length} live OSINT threats
              </p>
              <div className="mt-2 text-xs text-gray-500">
                {highRiskAlerts} high severity alerts detected
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Active Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{liveAlerts.length}</div>
              <p className="text-sm text-muted-foreground">
                Live OSINT threats requiring attention
              </p>
              <div className="mt-2">
                <Button size="sm" onClick={() => window.location.href = '/dashboard/intelligence'}>
                  View Intelligence Feed
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                OSINT Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeSources}</div>
              <p className="text-sm text-muted-foreground">
                Live intelligence sources active
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-green-600">Reddit API Connected</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Intelligence Status */}
        <Card>
          <CardHeader>
            <CardTitle>Live Intelligence System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-sm font-medium">Reddit OSINT</div>
                  <div className="text-xs text-gray-500">Active</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-sm font-medium">RSS Intelligence</div>
                  <div className="text-xs text-gray-500">Active</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-sm font-medium">Real-time Processing</div>
                  <div className="text-xs text-gray-500">Online</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div>
                  <div className="text-sm font-medium">Mock Data</div>
                  <div className="text-xs text-red-500">Blocked</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* No Live Data Message */}
        {liveAlerts.length === 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">All Clear</h3>
              <p className="text-blue-700 mb-4">
                No live threats detected. A.R.I.A™ OSINT systems are monitoring continuously.
              </p>
              <p className="text-sm text-blue-600">
                Use Operator Console to trigger manual intelligence sweeps if needed.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CommandCenterPage;
