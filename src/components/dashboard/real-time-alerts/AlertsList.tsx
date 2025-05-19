
import { ContentAlert } from "@/types/dashboard";
import AlertItem from "./AlertItem";

interface AlertsListProps {
  filteredAlerts: ContentAlert[];
  handleDismiss: (alertId: string) => void;
  handleMarkAsRead: (alertId: string) => void;
  onViewDetail?: (alert: ContentAlert) => void;
}

const AlertsList = ({
  filteredAlerts,
  handleDismiss,
  handleMarkAsRead,
  onViewDetail
}: AlertsListProps) => {
  if (filteredAlerts.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No alerts matching your filter</p>
      </div>
    );
  }

  return (
    <>
      {filteredAlerts.map((alert, index) => (
        <div 
          key={alert.id} 
          className={index !== filteredAlerts.length - 1 ? 'border-b' : ''}
        >
          <AlertItem 
            alert={alert}
            handleDismiss={handleDismiss}
            handleMarkAsRead={handleMarkAsRead}
            onViewDetail={onViewDetail}
          />
        </div>
      ))}
    </>
  );
};

export default AlertsList;
