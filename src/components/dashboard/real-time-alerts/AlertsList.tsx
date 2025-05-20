
import React from 'react';
import { ContentAlert } from "@/types/dashboard";
import AlertItem from "../alerts/AlertItem";
import { Info } from 'lucide-react';

interface AlertsListProps {
  filteredAlerts: ContentAlert[];
  handleDismiss: (id: string) => void;
  handleMarkAsRead: (id: string) => void;
  onViewDetail?: (alert: ContentAlert) => void;
  onRespond?: (alertId: string) => void;
}

const AlertsList = ({ 
  filteredAlerts, 
  handleDismiss, 
  handleMarkAsRead,
  onViewDetail,
  onRespond
}: AlertsListProps) => {
  
  if (filteredAlerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Info className="h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-muted-foreground">No active alerts at this time</p>
        <p className="text-xs text-muted-foreground mt-1">
          New alerts will appear here as they are detected
        </p>
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
          onRespond={onRespond}
        />
      ))}
    </>
  );
};

export default AlertsList;
