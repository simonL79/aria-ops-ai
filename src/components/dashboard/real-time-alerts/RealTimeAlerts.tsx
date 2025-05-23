
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import useAlertSimulation from "./useAlertSimulation";

const RealTimeAlerts = () => {
  const alert = useAlertSimulation(60000);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Real-Time Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alert ? (
          <div className="p-3 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                {alert.severity.toUpperCase()}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(alert.date).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm font-medium mb-1">{alert.platform}</p>
            <p className="text-xs text-muted-foreground">{alert.content}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No recent alerts</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeAlerts;
