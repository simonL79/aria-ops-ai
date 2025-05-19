
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing } from "lucide-react";
import { ContentAlert } from "@/types/dashboard";
import FilterButtons from "./FilterButtons";
import AlertsList from "./AlertsList";
import { useAlertSimulation } from "./useAlertSimulation";

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
  
  // Use our simulation hook
  const { activeAlerts, setActiveAlerts } = useAlertSimulation(alerts);
  
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
    : activeAlerts.filter(alert => alert.severity === filter);
  
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          Real-Time Alerts
        </CardTitle>
        <FilterButtons filter={filter} setFilter={setFilter} />
      </CardHeader>
      <CardContent className="p-0">
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
