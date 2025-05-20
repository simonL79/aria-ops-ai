
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentAlert } from "@/types/dashboard";
import { useAlertSimulation } from "./useAlertSimulation";
import { useNotifications } from "./useNotifications";
import AlertHeader from "./AlertHeader";
import FilterButtons from "./FilterButtons";
import NotificationControl from "./NotificationControl";
import AlertsContainer from "./AlertsContainer";

interface RealTimeAlertsProps {
  alerts?: ContentAlert[];
  onDismiss?: (alertId: string) => void;
  onMarkAsRead?: (alertId: string) => void;
  onViewDetail?: (alert: ContentAlert) => void;
  onRespond?: (alertId: string) => void;
}

const RealTimeAlerts = ({
  alerts = [],
  onDismiss,
  onMarkAsRead,
  onViewDetail,
  onRespond
}: RealTimeAlertsProps) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low' | 'customer'>('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Use our simulation hook
  const { activeAlerts, setActiveAlerts } = useAlertSimulation(alerts);
  
  // Use our notifications hook
  useNotifications(activeAlerts, notificationsEnabled, onViewDetail, onRespond);
  
  // Set up initial alerts
  useEffect(() => {
    setActiveAlerts(alerts);
  }, [alerts, setActiveAlerts]);
  
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
    : filter === 'customer'
      ? activeAlerts.filter(alert => alert.category === 'customer_enquiry')
      : activeAlerts.filter(alert => alert.severity === filter);
  
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <AlertHeader activeAlerts={activeAlerts} />
        <div className="flex items-center gap-2">
          <NotificationControl 
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
          />
          <FilterButtons filter={filter} setFilter={setFilter} />
        </div>
      </CardHeader>
      
      <CardContent className="p-0 mt-2">
        <div className="max-h-96 overflow-y-auto">
          <AlertsContainer 
            filteredAlerts={filteredAlerts}
            onDismiss={handleDismiss}
            onMarkAsRead={handleMarkAsRead}
            onViewDetail={onViewDetail}
            onRespond={onRespond}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeAlerts;
