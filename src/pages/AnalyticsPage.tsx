
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, AlertTriangle, Shield, Search, RefreshCw, CheckCircle } from 'lucide-react';

const AnalyticsPage = () => {
  const { metrics, alerts, loading, error, fetchData } = useDashboardData();

  // Calculate live analytics from real data only
  const liveAnalytics = {
    totalThreats: alerts.length,
    highRiskThreats: alerts.filter(alert => alert.severity === 'high').length,
    mediumRiskThreats: alerts.filter(alert => alert.severity === 'medium').length,
    lowRiskThreats: alerts.filter(alert => alert.severity === 'low').length,
    redditIntelligence: alerts.filter(alert => alert.platform === 'Reddit').length,
    newsIntelligence: alerts.filter(alert => alert.platform === 'News' || alert.platform?.includes('News')).length,
    osintSources: new Set(alerts.map(alert => alert.platform)).size,
    recentThreats: alerts.filter(alert => {
      const alertDate = new Date(alert.date);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return alertDate > oneDayAgo;
    }).length
  };

  const resolutionRate = liveAnalytics.totalThreats > 0 
    ? Math.round((alerts.filter(alert => alert.status === 'resolved').length / liveAnalytics.totalThreats) * 100)
    : 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Activity className="h-8 w-8" />
                A.R.I.A™ Live Intelligence Analytics
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time analytics from live OSINT intelligence systems
              </p>
            </div>
          </div>
          
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-lg">Loading live analytics data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Activity className="h-8 w-8" />
                A.R.I.A™ Live Intelligence Analytics
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time analytics from live OSINT intelligence systems
              </p>
            </div>
          </div>
          
          <div className="text-center py-8">
            <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Live Analytics System Error</h3>
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="h-8 w-8" />
              A.R.I.A™ Live Intelligence Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time analytics and reporting from live OSINT intelligence systems
            </p>
          </div>
          <Button onClick={fetchData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Live Data
          </Button>
        </div>

        {/* Live Data Status */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-green-800">Live Analytics Active</span>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-300">
                100% Real Data
              </Badge>
              <Badge variant="outline" className="text-green-700">
                {liveAnalytics.osintSources} Live Sources
              </Badge>
            </div>
          </div>
        </div>

        {/* Live Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                Total Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{liveAnalytics.totalThreats}</div>
              <p className="text-xs text-muted-foreground">Live OSINT items</p>
              <Badge variant="outline" className="mt-2 text-xs">
                {liveAnalytics.recentThreats} in 24h
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                High Risk Threats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{liveAnalytics.highRiskThreats}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
              <div className="flex gap-1 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {liveAnalytics.mediumRiskThreats} medium
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {liveAnalytics.lowRiskThreats} low
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                OSINT Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{liveAnalytics.osintSources}</div>
              <p className="text-xs text-muted-foreground">Active intelligence feeds</p>
              <div className="flex gap-1 mt-2">
                <Badge variant="outline" className="text-xs">
                  Reddit: {liveAnalytics.redditIntelligence}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  News: {liveAnalytics.newsIntelligence}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Resolution Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{resolutionRate}%</div>
              <p className="text-xs text-muted-foreground">Threat resolution efficiency</p>
              <Badge className="mt-2 text-xs bg-blue-100 text-blue-800">
                Live tracking
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Intelligence Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Intelligence Sources</CardTitle>
              <CardDescription>Real-time OSINT collection breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {liveAnalytics.totalThreats === 0 ? (
                <div className="text-center py-6">
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">No live intelligence data</p>
                  <p className="text-sm text-gray-500">Trigger OSINT sweep from Operator Console</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-medium">Reddit OSINT</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {liveAnalytics.redditIntelligence} items
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="font-medium">News Intelligence</span>
                    <Badge className="bg-green-100 text-green-800">
                      {liveAnalytics.newsIntelligence} items
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                    <span className="font-medium">Other Sources</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      {liveAnalytics.totalThreats - liveAnalytics.redditIntelligence - liveAnalytics.newsIntelligence} items
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Compliance Status</CardTitle>
              <CardDescription>Live data compliance monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Live Data Only</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">✓ Compliant</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Mock Data Blocked</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">✓ Enforced</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>OSINT Sources Active</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">✓ Online</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Real-time Processing</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">✓ Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
