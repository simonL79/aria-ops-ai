
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Bell, RefreshCw } from 'lucide-react';
import { ContentAlert } from '@/types/dashboard';

interface ScanNotificationProps {
  newAlerts: ContentAlert[];
  scanComplete: boolean;
  onResetScanStatus: () => void;
}

const ScanNotification: React.FC<ScanNotificationProps> = ({ 
  newAlerts, 
  scanComplete, 
  onResetScanStatus 
}) => {
  useEffect(() => {
    if (!scanComplete || !newAlerts || newAlerts.length === 0) return;
    
    // Show notification for high severity items
    const highSeverityAlerts = newAlerts.filter(alert => alert.severity === 'high');
    if (highSeverityAlerts.length > 0) {
      toast(
        <div className="flex items-start gap-2">
          <Bell className="h-4 w-4 text-red-500 mt-0.5" />
          <div>
            <p className="font-medium">{highSeverityAlerts.length} High Severity Alerts</p>
            <p className="text-sm text-muted-foreground">
              Urgent attention required for new content alerts
            </p>
          </div>
        </div>,
        {
          duration: 6000,
          action: {
            label: "View",
            onClick: () => console.log("Viewing high severity alerts")
          },
        }
      );
    }
    
    // Show notification for customer inquiries - safely check for category property
    const customerInquiries = newAlerts.filter(alert => alert.category === 'customer_enquiry');
    if (customerInquiries.length > 0) {
      toast(
        <div className="flex items-start gap-2">
          <Bell className="h-4 w-4 text-blue-500 mt-0.5" />
          <div>
            <p className="font-medium">{customerInquiries.length} Customer Inquiries</p>
            <p className="text-sm text-muted-foreground">
              New customer inquiries requiring response
            </p>
          </div>
        </div>,
        {
          duration: 5000,
          action: {
            label: "Respond",
            onClick: () => console.log("Responding to customer inquiries")
          },
        }
      );
    }
    
    // Reset scan status after notifications are shown
    onResetScanStatus();
  }, [newAlerts, scanComplete, onResetScanStatus]);

  return null; // This is a utility component with no UI
};

export default ScanNotification;
