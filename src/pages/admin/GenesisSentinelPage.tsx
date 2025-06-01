
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
      
      <div className="space-y-6 p-6 bg-corporate-dark min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 corporate-heading">
              <Shield className="h-8 w-8 text-corporate-accent" />
              A.R.I.A™ Genesis Sentinel
            </h1>
            <p className="corporate-subtext mt-1">
              Reputation Intelligence Early Warning System - Detect threats and prospects before they emerge
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 bg-corporate-darkSecondary text-corporate-lightGray border-corporate-border">
              <Eye className="h-3 w-3" />
              Intelligence First
            </Badge>
            <Badge className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
              Elite Tier Service
            </Badge>
          </div>
        </div>

        {/* Service Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Globe className="h-4 w-4 text-corporate-accent" />
                Entity Discovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">24/7</div>
              <p className="text-xs corporate-subtext">Global monitoring</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <TrendingUp className="h-4 w-4 text-corporate-accent" />
                Risk Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Pre-Crisis</div>
              <p className="text-xs corporate-subtext">Early detection</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <AlertTriangle className="h-4 w-4 text-corporate-accent" />
                Lead Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Auto</div>
              <p className="text-xs corporate-subtext">Prospect identification</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Zap className="h-4 w-4 text-corporate-accent" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">&lt; 5min</div>
              <p className="text-xs corporate-subtext">Threat to outreach</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <Globe className="h-5 w-5 text-corporate-accent" />
                Proactive Monitoring
              </CardTitle>
              <CardDescription className="corporate-subtext">Global entity intelligence scanning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-corporate-lightGray">
                <div>• New business registrations</div>
                <div>• Director & corporate changes</div>
                <div>• Domain registrations & launches</div>
                <div>• Bankruptcy & insolvency notices</div>
                <div>• Brand mentions before trending</div>
                <div>• Regulatory filing analysis</div>
              </div>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <AlertTriangle className="h-5 w-5 text-corporate-accent" />
                Risk Intelligence
              </CardTitle>
              <CardDescription className="corporate-subtext">Predictive threat assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-corporate-lightGray">
                <div>• Director risk scoring & linkage</div>
                <div>• Historical litigation tracking</div>
                <div>• Sector risk pattern analysis</div>
                <div>• Geographic vulnerability mapping</div>
                <div>• Media sentiment forecasting</div>
                <div>• Crisis probability modeling</div>
              </div>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <TrendingUp className="h-5 w-5 text-corporate-accent" />
                Lead Generation
              </CardTitle>
              <CardDescription className="corporate-subtext">Automated prospect identification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-corporate-lightGray">
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
        <Card className="border-corporate-accent bg-corporate-darkSecondary">
          <CardHeader>
            <CardTitle className="text-corporate-accent flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Intelligence First, Reputation Always
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-corporate-lightGray space-y-2 text-sm">
              <p><strong className="text-white">Early Warning System:</strong> Detect reputation threats before they exist</p>
              <p><strong className="text-white">Prospect Intelligence:</strong> Identify clients before they know they need you</p>
              <p><strong className="text-white">Market Leadership:</strong> Position as the authority on emerging risks</p>
              <p><strong className="text-white">Strategic Growth:</strong> Self-feeding client acquisition engine</p>
              <p><strong className="text-white">Competitive Moat:</strong> Always ahead of market developments</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GenesisSentinelPage;
