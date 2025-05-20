
import React from 'react';
import { ContentAlert } from "@/types/dashboard";
import AlertItem from "./AlertItem";

interface AlertsListProps {
  filteredAlerts: ContentAlert[];
  handleDismiss: (id: string) => void;
  handleMarkAsRead: (id: string) => void;
  onViewDetail?: (alert: ContentAlert) => void;
}

const AlertsList: React.FC<AlertsListProps> = ({ 
  filteredAlerts, 
  handleDismiss, 
  handleMarkAsRead,
  onViewDetail
}) => {
  if (filteredAlerts.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No alerts to display</p>
      </div>
    );
  }

  return (
    <>
      {filteredAlerts.map((alert, index) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          isLast={index === filteredAlerts.length - 1}
          onDismiss={handleDismiss}
          onMarkAsRead={handleMarkAsRead}
          onViewDetail={onViewDetail}
        />
      ))}
    </>
  );
};

export default AlertsList;
