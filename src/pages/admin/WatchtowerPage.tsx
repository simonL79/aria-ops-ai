
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Satellite, Target, TrendingUp, Users, AlertTriangle, Zap } from 'lucide-react';

const WatchtowerPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 bg-corporate-dark min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 corporate-heading">
              <Satellite className="h-8 w-8 text-corporate-accent" />
              A.R.I.A™ Watchtower
            </h1>
            <p className="corporate-subtext mt-1">
              Autonomous Lead Generation through Threat Discovery
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 bg-corporate-darkSecondary text-corporate-lightGray border-corporate-border">
              <Target className="h-3 w-3" />
              Prospect Hunter
            </Badge>
            <Badge className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
              Lead Generation Engine
            </Badge>
          </div>
        </div>

        {/* Service Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Satellite className="h-4 w-4 text-corporate-accent" />
                Autonomous Scanning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">24/7</div>
              <p className="text-xs corporate-subtext">Threat discovery</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Users className="h-4 w-4 text-corporate-accent" />
                Prospects Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">127</div>
              <p className="text-xs corporate-subtext">This month</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <TrendingUp className="h-4 w-4 text-corporate-accent" />
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">23%</div>
              <p className="text-xs corporate-subtext">Prospect to client</p>
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
              <div className="text-2xl font-bold text-green-400">&lt; 2min</div>
              <p className="text-xs corporate-subtext">Discovery to outreach</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <Satellite className="h-5 w-5 text-corporate-accent" />
                Threat Discovery Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-corporate-lightGray">
                <div>• RSS/News feed monitoring for unprotected entities</div>
                <div>• Automatic threat severity assessment</div>
                <div>• Entity relationship mapping</div>
                <div>• Real-time vulnerability scoring</div>
                <div>• Competitor intelligence gathering</div>
                <div>• Market opportunity identification</div>
              </div>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 corporate-heading">
                <Target className="h-5 w-5 text-corporate-accent" />
                Intelligent Outreach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-corporate-lightGray">
                <div>• Personalized threat briefs</div>
                <div>• Automated contact discovery</div>
                <div>• Multi-channel outreach campaigns</div>
                <div>• Response tracking & follow-up</div>
                <div>• Conversion pipeline management</div>
                <div>• ROI analytics & optimization</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Value Proposition */}
        <Card className="border-corporate-accent bg-corporate-darkSecondary">
          <CardHeader>
            <CardTitle className="text-corporate-accent flex items-center gap-2">
              <Satellite className="h-5 w-5" />
              Self-Feeding Growth Engine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-corporate-lightGray space-y-2 text-sm">
              <p><strong className="text-white">Automatic Prospecting:</strong> Find clients before they know they need you</p>
              <p><strong className="text-white">Threat Intelligence:</strong> Lead with value - their specific vulnerabilities</p>
              <p><strong className="text-white">Zero Cold Outreach:</strong> Every contact is warm with real intelligence</p>
              <p><strong className="text-white">Scalable Growth:</strong> 24/7 lead generation without human intervention</p>
              <p><strong className="text-white">Market Leadership:</strong> Position as the authority who knows first</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WatchtowerPage;
