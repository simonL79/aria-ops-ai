
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Shield, AlertTriangle, Activity } from 'lucide-react';

const CommandCenterPage = () => {
  const {
    alerts,
    sources,
    negativeContent,
    loading,
  } = useDashboardData();

  if (loading) {
    return <div>Loading command center...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Command Center</h1>
      
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
              {negativeContent > 5 ? 'HIGH' : negativeContent > 2 ? 'MEDIUM' : 'LOW'}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {negativeContent} negative alerts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <Button className="mt-2" size="sm">
              View All Alerts
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Monitoring Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">ACTIVE</div>
            <p className="text-sm text-muted-foreground">
              {sources.length} sources monitored
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommandCenterPage;
