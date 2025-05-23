
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Wifi, WifiOff } from "lucide-react";
import { ContentAlert } from "@/types/dashboard";

const RealTimeAlertsWithWebsocket = () => {
  const [alerts, setAlerts] = useState<ContentAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate WebSocket connection
    setIsConnected(true);
    
    // Simulate real-time alerts
    const interval = setInterval(() => {
      const newAlert: ContentAlert = {
        id: `alert-${Date.now()}`,
        platform: ['Twitter', 'Facebook', 'Reddit'][Math.floor(Math.random() * 3)],
        content: `Real-time alert detected at ${new Date().toLocaleTimeString()}`,
        date: new Date().toISOString(),
        severity: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
        status: 'new',
        url: `https://example.com/alert/${Date.now()}`,
        sourceType: 'social',
        confidenceScore: Math.floor(Math.random() * 40) + 60,
        sentiment: 'negative',
        detectedEntities: ['entity1', 'entity2']
      };
      
      setAlerts(prev => [newAlert, ...prev].slice(0, 10));
    }, 30000);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Real-Time Alerts
          {isConnected ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No alerts detected</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{alert.date}</span>
                </div>
                <p className="text-sm font-medium mb-1">{alert.platform}</p>
                <p className="text-xs text-muted-foreground">{alert.content}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeAlertsWithWebsocket;
