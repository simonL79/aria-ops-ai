
import React from "react";
import { ContentAlert } from "@/types/dashboard";
import AlertItem from "./AlertItem";
import { Separator } from "@/components/ui/separator";

interface AlertsContainerProps {
  filteredAlerts: ContentAlert[];
  onDismiss?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onViewDetail?: (alert: ContentAlert) => void;
  onRespond?: (alertId: string) => void;
}

const AlertsContainer: React.FC<AlertsContainerProps> = ({
  filteredAlerts,
  onDismiss,
  onMarkAsRead,
  onViewDetail,
  onRespond,
}) => {
  if (filteredAlerts.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No alerts match your current filter
      </div>
    );
  }

  return (
    <div>
      {filteredAlerts.map((alert, index) => (
        <React.Fragment key={alert.id}>
          <AlertItem 
            alert={alert} 
            isLast={index === filteredAlerts.length - 1} 
            onDismiss={onDismiss}
            onMarkAsRead={onMarkAsRead}
            onViewDetail={onViewDetail}
            onRespond={onRespond}
          />
          {index < filteredAlerts.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default AlertsContainer;
