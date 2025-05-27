
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import OffensiveResponseToolkit from '@/components/intelligence/OffensiveResponseToolkit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Shield, AlertTriangle, TrendingUp } from 'lucide-react';

const OffensiveOperations = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Target className="h-8 w-8" />
              Offensive Operations Center
            </h1>
            <p className="text-muted-foreground mt-1">
              Advanced counter-narrative deployment and threat actor disruption
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Classified Operations
            </Badge>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Counter-Narratives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Deployed today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Diversion Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Active campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1">
                <Target className="h-4 w-4" />
                Actor Disruptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Reports submitted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">--</div>
              <p className="text-xs text-muted-foreground">Campaign effectiveness</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Toolkit */}
        <OffensiveResponseToolkit />

        {/* Compliance Notice */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Compliance & Ethics Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-yellow-800 space-y-2">
              <p>• All offensive operations must comply with applicable laws and platform terms of service</p>
              <p>• Counter-narratives should be factual and not misleading</p>
              <p>• Actor disruption reports require valid evidence</p>
              <p>• All actions are logged for audit and transparency purposes</p>
              <p>• Use these tools responsibly and ethically</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OffensiveOperations;
