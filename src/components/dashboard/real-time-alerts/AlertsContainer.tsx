
import React from 'react';
import { ContentAlert } from '@/types/dashboard';
import AlertItem from './AlertItem';
import EmptyAlertState from './EmptyAlertState';

interface AlertsContainerProps {
  filteredAlerts: ContentAlert[];
  onViewDetail?: (alert: ContentAlert) => void;
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onRespond?: (alertId: string) => void;
}

const AlertsContainer: React.FC<AlertsContainerProps> = ({
  filteredAlerts,
  onViewDetail,
  onMarkAsRead,
  onDismiss,
  onRespond,
}) => {
  if (filteredAlerts.length === 0) {
    return <EmptyAlertState />;
  }

  return (
    <div className="space-y-2">
      {filteredAlerts.map((alert, index) => (
        <div key={alert.id}>
          <AlertItem
            alert={alert}
            isLast={index === filteredAlerts.length - 1}
            onViewDetail={onViewDetail}
            onMarkAsRead={onMarkAsRead}
            onDismiss={onDismiss}
            onRespond={onRespond}
          />
        </div>
      ))}
    </div>
  );
};

export default AlertsContainer;
