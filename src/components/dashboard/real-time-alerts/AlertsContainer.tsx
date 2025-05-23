
import React, { useState } from "react";
import { ContentAlert } from "@/types/dashboard";
import AlertHeader from "./AlertHeader";
import FilterButtons from "./FilterButtons";
import AlertsList from "./AlertsList";
import EmptyAlertState from "./EmptyAlertState";

interface AlertsContainerProps {
  alerts: ContentAlert[];
  onViewDetail: (alert: ContentAlert) => void;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const AlertsContainer = ({ alerts, onViewDetail, onMarkAsRead, onDismiss }: AlertsContainerProps) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'new'>('all');
  
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'high') return alert.severity === 'high';
    if (filter === 'new') return alert.status === 'new';
    return true;
  });

  return (
    <div className="space-y-4">
      <AlertHeader alertCount={filteredAlerts.length} />
      <FilterButtons currentFilter={filter} onFilterChange={setFilter} />
      {filteredAlerts.length > 0 ? (
        <AlertsList 
          alerts={filteredAlerts}
          onViewDetail={onViewDetail}
          onMarkAsRead={onMarkAsRead}
          onDismiss={onDismiss}
        />
      ) : (
        <EmptyAlertState />
      )}
    </div>
  );
};

export default AlertsContainer;
