
import { ContentAlert } from "@/types/dashboard";
import AlertItem from "./AlertItem";
import EmptyAlertState from "./EmptyAlertState";

interface AlertsContainerProps {
  filteredAlerts: ContentAlert[];
  onDismiss: (alertId: string) => void;
  onMarkAsRead: (alertId: string) => void;
  onViewDetail?: (alert: ContentAlert) => void;
  onRespond?: (alertId: string) => void;
}

const AlertsContainer = ({
  filteredAlerts,
  onDismiss,
  onMarkAsRead,
  onViewDetail,
  onRespond
}: AlertsContainerProps) => {
  if (filteredAlerts.length === 0) {
    return <EmptyAlertState />;
  }

  return (
    <>
      {filteredAlerts.map((alert, index) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          isLast={index === filteredAlerts.length - 1}
          onDismiss={onDismiss}
          onMarkAsRead={onMarkAsRead}
          onViewDetail={onViewDetail}
          onRespond={onRespond}
        />
      ))}
    </>
  );
};

export default AlertsContainer;
