
import React from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, TrendingUp, Globe, AlertTriangle, Zap } from 'lucide-react';

const GenesisSentinelPage = () => {
  return (
    <DashboardLayout>
      <Helmet>
        <title>A.R.I.A™ Genesis Sentinel - Advanced Threat Detection</title>
        <meta name="description" content="Genesis Sentinel operator console for advanced threat detection and response" />
      </Helmet>
      
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-500" />
              A.R.I.A™ Genesis Sentinel
            </h1>
            <p className="text-muted-foreground mt-1">
              Reputation Intelligence Early Warning System - Detect threats and prospects before they emerge
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Intelligence First
            </Badge>
            <Badge className="bg-blue-500 text-white hover:bg-blue-600">
              Elite Tier Service
            </Badge>
          </div>
        </div>

        {/* Service Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1">
                <Globe className="h-4 w-4 text-blue-500" />
                Entity Discovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24/7</div>
              <p className="text-xs text-muted-foreground">Global monitoring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Risk Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Pre-Crisis</div>
              <p className="text-xs text-muted-foreground">Early detection</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-blue-500" />
                Lead Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Auto</div>
              <p className="text-xs text-muted-foreground">Prospect identification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1">
                <Zap className="h-4 w-4 text-blue-500" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">&lt; 5min</div>
              <p className="text-xs text-muted-foreground">Threat to outreach</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                Proactive Monitoring
              </CardTitle>
              <CardDescription>Global entity intelligence scanning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• New business registrations</div>
                <div>• Director & corporate changes</div>
                <div>• Domain registrations & launches</div>
                <div>• Bankruptcy & insolvency notices</div>
                <div>• Brand mentions before trending</div>
                <div>• Regulatory filing analysis</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
                Risk Intelligence
              </CardTitle>
              <CardDescription>Predictive threat assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Director risk scoring & linkage</div>
                <div>• Historical litigation tracking</div>
                <div>• Sector risk pattern analysis</div>
                <div>• Geographic vulnerability mapping</div>
                <div>• Media sentiment forecasting</div>
                <div>• Crisis probability modeling</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Lead Generation
              </CardTitle>
              <CardDescription>Automated prospect identification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Auto-generated risk profiles</div>
                <div>• Watchtower candidate pipeline</div>
                <div>• Pre-outreach intelligence briefs</div>
                <div>• Industry trend analysis</div>
                <div>• Strategic growth targeting</div>
                <div>• Automated engagement triggers</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Value Proposition */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Intelligence First, Reputation Always
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground space-y-2 text-sm">
              <p><strong className="text-foreground">Early Warning System:</strong> Detect reputation threats before they exist</p>
              <p><strong className="text-foreground">Prospect Intelligence:</strong> Identify clients before they know they need you</p>
              <p><strong className="text-foreground">Market Leadership:</strong> Position as the authority on emerging risks</p>
              <p><strong className="text-foreground">Strategic Growth:</strong> Self-feeding client acquisition engine</p>
              <p><strong className="text-foreground">Competitive Moat:</strong> Always ahead of market developments</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GenesisSentinelPage;
