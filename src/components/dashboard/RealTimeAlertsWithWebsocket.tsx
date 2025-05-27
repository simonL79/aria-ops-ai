
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Wifi, WifiOff } from "lucide-react";
import { ContentAlert } from "@/types/dashboard";
import { supabase } from "@/integrations/supabase/client";

const RealTimeAlertsWithWebsocket = () => {
  const [alerts, setAlerts] = useState<ContentAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(true);
    
    // Fetch initial alerts
    const fetchInitialAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from('scan_results')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) {
          console.error('Error fetching alerts:', error);
          return;
        }

        const formattedAlerts: ContentAlert[] = data.map(item => ({
          id: item.id,
          platform: item.platform,
          content: item.content,
          date: new Date(item.created_at).toISOString(),
          severity: item.severity as 'high' | 'medium' | 'low',
          status: item.status,
          url: item.url || '',
          sourceType: item.source_type || 'scan',
          confidenceScore: item.confidence_score || 75,
          sentiment: item.sentiment > 0 ? 'positive' : item.sentiment < 0 ? 'negative' : 'neutral',
          detectedEntities: item.detected_entities || []
        }));

        setAlerts(formattedAlerts);
      } catch (error) {
        console.error('Error fetching initial alerts:', error);
      }
    };

    fetchInitialAlerts();

    // Set up real-time subscription for new alerts
    const channel = supabase
      .channel('scan_results_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scan_results'
        },
        (payload) => {
          const newAlert: ContentAlert = {
            id: payload.new.id,
            platform: payload.new.platform,
            content: payload.new.content,
            date: new Date(payload.new.created_at).toISOString(),
            severity: payload.new.severity as 'high' | 'medium' | 'low',
            status: payload.new.status,
            url: payload.new.url || '',
            sourceType: payload.new.source_type || 'scan',
            confidenceScore: payload.new.confidence_score || 75,
            sentiment: payload.new.sentiment > 0 ? 'positive' : payload.new.sentiment < 0 ? 'negative' : 'neutral',
            detectedEntities: payload.new.detected_entities || []
          };
          
          setAlerts(prev => [newAlert, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.date).toLocaleString()}
                  </span>
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
