
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; 
import { BellRing, Bell, BellOff } from "lucide-react";
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";
import FilterButtons from "./FilterButtons";
import AlertsList from "./AlertsList";
import { useAlertSimulation } from "./useAlertSimulation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface RealTimeAlertsProps {
  alerts?: ContentAlert[];
  onDismiss?: (alertId: string) => void;
  onMarkAsRead?: (alertId: string) => void;
  onViewDetail?: (alert: ContentAlert) => void;
}

const RealTimeAlerts = ({
  alerts = [],
  onDismiss,
  onMarkAsRead,
  onViewDetail
}: RealTimeAlertsProps) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Use our simulation hook
  const { activeAlerts, setActiveAlerts } = useAlertSimulation(alerts);
  
  // Set up initial alerts
  useEffect(() => {
    setActiveAlerts(alerts);
  }, [alerts, setActiveAlerts]);
  
  // High priority notification system
  useEffect(() => {
    if (!notificationsEnabled) return;
    
    // Check if there's a new high severity alert
    const highSeverityAlerts = activeAlerts.filter(
      alert => alert.severity === 'high' && alert.status === 'new'
    );
    
    if (highSeverityAlerts.length > 0) {
      // Get most recent high severity alert
      const latestAlert = highSeverityAlerts[0];
      
      // Play notification sound if browser supports it
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play prevented by browser policy:', e));
      } catch (err) {
        console.log('Audio notification not supported');
      }
      
      // Show toast with more urgency for high priority
      toast.error(`🚨 HIGH RISK ALERT: ${latestAlert.platform}`, {
        description: latestAlert.content.length > 60 ? 
          `${latestAlert.content.substring(0, 60)}...` : 
          latestAlert.content,
        duration: 10000, // 10 seconds
        action: {
          label: "View Now",
          onClick: () => onViewDetail?.(latestAlert),
        }
      });
      
      // If browser supports notifications API, send browser notification too
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("ARIA - High Risk Alert", {
            body: `${latestAlert.platform}: ${latestAlert.content.substring(0, 120)}...`,
            icon: "/favicon.ico"
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission();
        }
      }
    }
  }, [activeAlerts, notificationsEnabled, onViewDetail]);
  
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
  
  const handleToggleNotifications = () => {
    if (!notificationsEnabled && "Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    
    setNotificationsEnabled(!notificationsEnabled);
    
    toast.info(
      !notificationsEnabled ? 
        "Real-time notifications enabled" : 
        "Real-time notifications disabled"
    );
  };
  
  const filteredAlerts = filter === 'all' 
    ? activeAlerts 
    : activeAlerts.filter(alert => alert.severity === filter);
  
  const highSeverityCount = activeAlerts.filter(a => a.severity === 'high' && a.status === 'new').length;
  
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          Real-Time Alerts
          {highSeverityCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {highSeverityCount} High Risk
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`cursor-pointer ${notificationsEnabled ? 'bg-green-100' : 'bg-red-100'}`}
            onClick={handleToggleNotifications}
          >
            {notificationsEnabled ? (
              <><Bell className="h-3 w-3 mr-1" /> Notifications On</>
            ) : (
              <><BellOff className="h-3 w-3 mr-1" /> Notifications Off</>
            )}
          </Badge>
          <FilterButtons filter={filter} setFilter={setFilter} />
        </div>
      </CardHeader>
      
      {!notificationsEnabled && (
        <div className="px-4 pt-2">
          <Alert variant="destructive" className="bg-amber-50">
            <AlertTitle>Notifications are disabled</AlertTitle>
            <AlertDescription>
              You may miss critical reputation threats. We recommend keeping notifications on.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <CardContent className="p-0 mt-2">
        <div className="max-h-96 overflow-y-auto">
          <AlertsList 
            filteredAlerts={filteredAlerts}
            handleDismiss={handleDismiss}
            handleMarkAsRead={handleMarkAsRead}
            onViewDetail={onViewDetail}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeAlerts;
