
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart } from "lucide-react";

interface MetricsProps {
  metrics: {
    scansToday: number;
    alertsDetected: number;
    highPriorityAlerts: number;
  };
}

const MonitoringMetrics: React.FC<MetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Scans Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <LineChart className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-2xl font-bold">{metrics.scansToday}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Alerts Detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <LineChart className="h-4 w-4 mr-2 text-amber-500" />
            <span className="text-2xl font-bold">{metrics.alertsDetected}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            High Priority
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <LineChart className="h-4 w-4 mr-2 text-red-500" />
            <span className="text-2xl font-bold">{metrics.highPriorityAlerts}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringMetrics;
