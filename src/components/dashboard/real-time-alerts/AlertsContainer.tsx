
import React from 'react';
import { ContentAlert } from '@/types/dashboard';
import AlertItem from './AlertItem';
import EmptyAlertState from './EmptyAlertState';

interface AlertsContainerProps {
  alerts: ContentAlert[];
  onViewDetail: (alert: ContentAlert) => void;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const AlertsContainer: React.FC<AlertsContainerProps> = ({
  alerts,
  onViewDetail,
  onMarkAsRead,
  onDismiss,
}) => {
  if (alerts.length === 0) {
    return <EmptyAlertState />;
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div key={alert.id}>
          <AlertItem
            alert={alert}
            onViewDetail={onViewDetail}
            onMarkAsRead={onMarkAsRead}
            onDismiss={onDismiss}
          />
        </div>
      ))}
    </div>
  );
};

export default AlertsContainer;
