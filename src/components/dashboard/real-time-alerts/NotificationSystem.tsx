
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ContentAlert } from '@/types/dashboard';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationSystemProps {
  alerts: ContentAlert[];
  enabled: boolean;
  onToggle: () => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  alerts,
  enabled,
  onToggle
}) => {
  const [lastAlertCount, setLastAlertCount] = useState(alerts.length);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!enabled || alerts.length <= lastAlertCount) {
      setLastAlertCount(alerts.length);
      return;
    }

    const newAlerts = alerts.slice(0, alerts.length - lastAlertCount);
    
    newAlerts.forEach(alert => {
      if (alert.severity === 'high') {
        // Desktop notification for high severity
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`🚨 High Risk Alert: ${alert.platform}`, {
            body: alert.content.substring(0, 100),
            icon: '/favicon.ico'
          });
        }

        // Enhanced toast for high severity
        toast.error(`🚨 HIGH RISK: ${alert.platform}`, {
          description: alert.content.substring(0, 60) + '...',
          duration: 10000,
        });
      } else {
        // Regular toast for other severities
        toast.info(`New ${alert.severity} alert: ${alert.platform}`, {
          description: alert.content.substring(0, 50) + '...',
          duration: 5000,
        });
      }
    });

    setLastAlertCount(alerts.length);
  }, [alerts, enabled, lastAlertCount]);

  return (
    <Button
      variant={enabled ? "default" : "outline"}
      size="sm"
      onClick={onToggle}
      className="flex items-center gap-2"
    >
      {enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
      {enabled ? 'Notifications On' : 'Notifications Off'}
    </Button>
  );
};

export default NotificationSystem;
