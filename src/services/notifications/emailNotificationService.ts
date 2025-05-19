
import { toast } from "sonner";

interface EmailNotificationPayload {
  clientName: string;
  platform: string;
  severity: number | string;
  category: string;
  content: string;
  recommendation: string;
  recipient: string;
  dashboardUrl?: string;
}

export const sendEmailNotification = async (
  apiEndpoint: string,
  payload: EmailNotificationPayload
): Promise<boolean> => {
  try {
    // Format the email content
    const emailData = {
      to: payload.recipient,
      subject: `ARIA Alert: ${payload.category} - Severity ${payload.severity}`,
      content: {
        clientName: payload.clientName,
        platform: payload.platform,
        severity: payload.severity,
        category: payload.category,
        content: payload.content,
        recommendation: payload.recommendation,
        dashboardUrl: payload.dashboardUrl
      }
    };

    // Send the notification via the email API endpoint
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(emailData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to send email notification");
    }
    
    console.log("Email notification sent", payload);
    return true;
  } catch (error) {
    console.error("Failed to send email notification:", error);
    toast.error("Failed to send email notification");
    return false;
  }
};
