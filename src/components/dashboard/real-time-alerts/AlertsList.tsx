
import React from "react";
import { ContentAlert } from "@/types/dashboard";
import AlertItem from "./AlertItem";

interface AlertsListProps {
  alerts: ContentAlert[];
  onViewDetail: (alert: ContentAlert) => void;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const AlertsList = ({ alerts, onViewDetail, onMarkAsRead, onDismiss }: AlertsListProps) => {
  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <AlertItem 
          key={alert.id} 
          alert={alert} 
          onViewDetail={onViewDetail}
          onMarkAsRead={onMarkAsRead}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

export default AlertsList;
