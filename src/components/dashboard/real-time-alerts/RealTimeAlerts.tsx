
import React from "react";
import { ContentAlert } from "@/types/dashboard";
import AlertsContainer from "./AlertsContainer";

interface RealTimeAlertsProps {
  alerts: ContentAlert[];
  onViewDetail: (alert: ContentAlert) => void;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const RealTimeAlerts = ({ alerts, onViewDetail, onMarkAsRead, onDismiss }: RealTimeAlertsProps) => {
  return (
    <AlertsContainer 
      alerts={alerts}
      onViewDetail={onViewDetail}
      onMarkAsRead={onMarkAsRead}
      onDismiss={onDismiss}
    />
  );
};

export default RealTimeAlerts;
