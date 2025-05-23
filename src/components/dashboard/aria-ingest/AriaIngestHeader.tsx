
import React from 'react';
import NotificationSystem from "@/components/dashboard/real-time-alerts/NotificationSystem";
import { ContentAlert } from "@/types/dashboard";

interface AriaIngestHeaderProps {
  filteredAlerts: ContentAlert[];
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
}

const AriaIngestHeader: React.FC<AriaIngestHeaderProps> = ({
  filteredAlerts,
  notificationsEnabled,
  onToggleNotifications
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">ARIA Intelligence Suite</h2>
      <NotificationSystem 
        alerts={filteredAlerts}
        enabled={notificationsEnabled}
        onToggle={onToggleNotifications}
      />
    </div>
  );
};

export default AriaIngestHeader;
