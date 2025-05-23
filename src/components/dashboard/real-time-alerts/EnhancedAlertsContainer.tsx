
import React, { useState } from "react";
import { ContentAlert } from "@/types/dashboard";
import AlertHeader from "./AlertHeader";
import FilterButtons from "./FilterButtons";
import EngagementHubAlertList from "./EngagementHubAlertList";
import EmptyAlertState from "./EmptyAlertState";
import NotificationSystem from "./NotificationSystem";
import { Card, CardContent } from "@/components/ui/card";

interface EnhancedAlertsContainerProps {
  alerts: ContentAlert[];
  onViewDetail: (alert: ContentAlert) => void;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const EnhancedAlertsContainer = ({ 
  alerts, 
  onViewDetail, 
  onMarkAsRead, 
  onDismiss 
}: EnhancedAlertsContainerProps) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'new'>('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'high') return alert.severity === 'high';
    if (filter === 'new') return alert.status === 'new';
    return true;
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <AlertHeader alertCount={filteredAlerts.length} />
            <NotificationSystem 
              alerts={alerts}
              enabled={notificationsEnabled}
              onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
            />
          </div>
          
          <FilterButtons currentFilter={filter} onFilterChange={setFilter} />
          
          {filteredAlerts.length > 0 ? (
            <EngagementHubAlertList 
              alerts={filteredAlerts}
              onViewDetail={onViewDetail}
              onMarkAsRead={onMarkAsRead}
              onDismiss={onDismiss}
            />
          ) : (
            <EmptyAlertState />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedAlertsContainer;
