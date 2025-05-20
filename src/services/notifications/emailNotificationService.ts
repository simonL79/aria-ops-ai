
import { toast } from "sonner";
import { EmailDigestSettings } from "@/types/aiScraping";

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

export const sendEmailDigest = async (
  settings: EmailDigestSettings,
  clientName: string = "A.R.I.A"
): Promise<boolean> => {
  try {
    // Filter out empty email addresses
    const validRecipients = settings.recipients.filter(email => email.trim() !== '');
    
    if (validRecipients.length === 0) {
      toast.error("No valid recipients for email digest");
      return false;
    }
    
    // Calculate time period for digest based on frequency
    const since = new Date();
    if (settings.frequency === "daily") {
      since.setDate(since.getDate() - 1);
    } else if (settings.frequency === "weekly") {
      since.setDate(since.getDate() - 7);
    }
    
    // Call the email digest edge function
    const response = await fetch("https://ssvskbejfacmjemphmry.supabase.co/functions/v1/email-digest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // In a real app, add authorization header
      },
      body: JSON.stringify({
        recipients: validRecipients,
        minRiskScore: settings.minRiskScore,
        since: since.toISOString(),
        clientName: clientName
      })
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to send email digest");
    }
    
    console.log("Email digest sent", result);
    return true;
  } catch (error) {
    console.error("Failed to send email digest:", error);
    toast.error("Failed to send email digest");
    return false;
  }
};

// For scheduling daily/weekly digests
export const scheduleEmailDigest = (settings: EmailDigestSettings): void => {
  // In a real implementation, this would register a server-side scheduled job
  // For frontend-only demo, we'd typically use localStorage to remember settings
  
  // Save settings to localStorage for demo purposes
  localStorage.setItem("emailDigestSettings", JSON.stringify(settings));
  console.log("Email digest scheduled with settings:", settings);
};

// For retrieving saved email digest settings
export const getSavedEmailDigestSettings = (): EmailDigestSettings | null => {
  const savedSettings = localStorage.getItem("emailDigestSettings");
  if (!savedSettings) return null;
  
  try {
    return JSON.parse(savedSettings) as EmailDigestSettings;
  } catch (e) {
    console.error("Error parsing saved email digest settings", e);
    return null;
  }
};
