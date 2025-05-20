
import React from 'react';
import { ContentAlert } from "@/types/dashboard";
import AlertItem from "./AlertItem";
import { sendEmailNotification } from '@/services/notifications/emailNotificationService';
import { toast } from 'sonner';

interface AlertsListProps {
  filteredAlerts: ContentAlert[];
  handleDismiss: (id: string) => void;
  handleMarkAsRead: (id: string) => void;
  onViewDetail?: (alert: ContentAlert) => void;
  onRespond?: (alertId: string) => void;
  sendEmailForHighPriority?: boolean;
  recipientEmail?: string;
}

const AlertsList: React.FC<AlertsListProps> = ({ 
  filteredAlerts, 
  handleDismiss, 
  handleMarkAsRead,
  onViewDetail,
  onRespond,
  sendEmailForHighPriority = false,
  recipientEmail
}) => {
  // Send email notifications for high priority alerts or customer enquiries
  React.useEffect(() => {
    if (sendEmailForHighPriority && recipientEmail) {
      // Check for new high priority alerts or customer enquiries that haven't been notified
      const criticalAlerts = filteredAlerts.filter(
        alert => (alert.severity === 'high' || alert.category === 'customer_enquiry') 
                && alert.status === 'new'
      );
      
      // Send email notifications for critical alerts
      criticalAlerts.forEach(async (alert) => {
        try {
          const isCustomerEnquiry = alert.category === 'customer_enquiry';
          
          await sendEmailNotification(
            'https://ssvskbejfacmjemphmry.supabase.co/functions/v1/email-digest',
            {
              clientName: 'A.R.I.A',
              platform: alert.platform,
              severity: alert.severity,
              category: isCustomerEnquiry ? 'Customer Enquiry' : 'High Risk Alert',
              content: alert.content,
              recommendation: alert.recommendation || 'Immediate attention recommended',
              recipient: recipientEmail,
              dashboardUrl: window.location.origin + '/dashboard/engagement'
            }
          );
          
          // Mark as notified (in a real app, you would update a 'notified' flag in the database)
          handleMarkAsRead(alert.id);
          
          console.log(`Email notification sent for ${isCustomerEnquiry ? 'customer enquiry' : 'high risk alert'}`);
        } catch (error) {
          console.error('Failed to send email notification:', error);
        }
      });
    }
  }, [filteredAlerts, sendEmailForHighPriority, recipientEmail, handleMarkAsRead]);

  if (filteredAlerts.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No alerts to display</p>
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
