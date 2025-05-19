
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Filter, BellRing, X, CheckCircle2, Wifi, WifiOff } from "lucide-react";
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";
import { useRealTimeAlerts } from "@/services/websocket/websocketService";

interface RealTimeAlertsProps {
  websocketUrl?: string;
  fallbackAlerts?: ContentAlert[];
  onDismiss?: (alertId: string) => void;
  onMarkAsRead?: (alertId: string) => void;
  onViewDetail?: (alert: ContentAlert) => void;
}

const RealTimeAlertsWithWebsocket = ({
  websocketUrl,
  fallbackAlerts = [],
  onDismiss,
  onMarkAsRead,
  onViewDetail
}: RealTimeAlertsProps) => {
  // Use our real-time alerts hook if a websocket URL is provided
  const wsConnection = websocketUrl ? useRealTimeAlerts(websocketUrl) : null;
  
  // Use either websocket alerts or fallback alerts
  const [activeAlerts, setActiveAlerts] = useState<ContentAlert[]>(fallbackAlerts);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  
  // Update alerts when websocket provides new ones
  useEffect(() => {
    if (wsConnection && wsConnection.alerts.length > 0) {
      setActiveAlerts(wsConnection.alerts);
    } else if (fallbackAlerts.length > 0 && activeAlerts.length === 0) {
      setActiveAlerts(fallbackAlerts);
    }
  }, [wsConnection?.alerts, fallbackAlerts]);
  
  // When not using websockets, set up simulated alerts (existing functionality)
  useEffect(() => {
    if (websocketUrl) {
      // Using real WebSockets, don't set up simulation
      return;
    }
    
    // Set up initial alerts
    setActiveAlerts(fallbackAlerts);
    
    // Create a notification sound
    const notificationSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
    
    // Function to add a new alert
    const addNewAlert = () => {
      // Only add alerts sometimes (30% chance)
      if (Math.random() > 0.7) {
        const severities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        
        const platforms = ['Twitter', 'Reddit', 'Google News', 'Review Site'];
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        
        const contents = [
          "Just had a terrible experience with their customer service.",
          "This company's ethics are questionable. Here's what they don't tell you...",
          "Disappointed in the quality of their product. Not worth the price.",
          "Warning: Their policies have changed. Read before you purchase!",
          "Anyone else having issues with their app? It's been down for hours."
        ];
        const content = contents[Math.floor(Math.random() * contents.length)];
        
        const newAlert: ContentAlert = {
          id: `rt-${Date.now()}`,
          platform,
          content,
          date: 'Just now',
          severity,
          status: 'new'
        };
        
        setActiveAlerts(prev => [newAlert, ...prev].slice(0, 10)); // Keep max 10 alerts
        
        // Play notification sound for high severity alerts
        if (severity === 'high') {
          notificationSound.play().catch(e => console.error("Error playing notification:", e));
        }
        
        // Show toast for high severity alerts
        if (severity === 'high') {
          toast.warning(`New high priority alert from ${platform}`, {
            description: content.length > 60 ? content.substring(0, 60) + '...' : content
          });
        }
      }
    };
    
    // Set up interval for new alerts (every 30-60 seconds)
    const interval = setInterval(addNewAlert, Math.random() * 30000 + 30000);
    
    return () => clearInterval(interval);
  }, [websocketUrl, fallbackAlerts]);
  
  const handleDismiss = (alertId: string) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
    if (onDismiss) onDismiss(alertId);
  };
  
  const handleMarkAsRead = (alertId: string) => {
    setActiveAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'read' } : alert
    ));
    if (onMarkAsRead) onMarkAsRead(alertId);
  };
  
  const filteredAlerts = filter === 'all' 
    ? activeAlerts 
    : activeAlerts.filter(alert => alert.severity === filter);
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          Real-Time Alerts
          {websocketUrl && (
            <Badge 
              variant="outline" 
              className={wsConnection?.connectionStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            >
              {wsConnection?.connectionStatus === 'connected' ? (
                <><Wifi className="h-3 w-3 mr-1" /> Live</>
              ) : (
                <><WifiOff className="h-3 w-3 mr-1" /> Offline</>
              )}
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setFilter('all')}
            className={`px-2 h-7 ${filter === 'all' ? 'bg-secondary' : ''}`}
          >
            All
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setFilter('high')}
            className={`px-2 h-7 ${filter === 'high' ? 'bg-secondary' : ''}`}
          >
            High
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setFilter('medium')}
            className={`px-2 h-7 ${filter === 'medium' ? 'bg-secondary' : ''}`}
          >
            Medium
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setFilter('low')}
            className={`px-2 h-7 ${filter === 'low' ? 'bg-secondary' : ''}`}
          >
            Low
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {filteredAlerts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No alerts matching your filter</p>
            </div>
          ) : (
            filteredAlerts.map((alert, index) => (
              <div 
                key={alert.id} 
                className={`p-4 ${alert.status === 'new' ? 'bg-blue-50' : ''} ${index !== filteredAlerts.length - 1 ? 'border-b' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{alert.platform}</span>
                      {alert.status === 'new' && (
                        <Badge variant="outline" className="bg-blue-100 border-blue-200 text-blue-800">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2">{alert.content}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <Clock className="h-3 w-3" />
                      <span>{alert.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDismiss(alert.id)}
                      className="h-7 w-7 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="h-7 w-7 p-0"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-7"
                    onClick={() => onViewDetail && onViewDetail(alert)}
                  >
                    Analyze & Respond
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeAlertsWithWebsocket;
