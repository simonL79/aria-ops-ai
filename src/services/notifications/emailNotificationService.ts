
import { toast } from "sonner";
import { EmailDigestSettings } from "@/types/aiScraping";

// Mock storage for email digest settings
let emailDigestSettingsStorage: EmailDigestSettings = {
  enabled: true,
  frequency: 'daily',
  minRiskScore: 5,
  recipients: ['user@example.com'],
  lastSent: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
};

/**
 * Get current email digest settings
 */
export const getEmailDigestSettings = (): EmailDigestSettings => {
  return { ...emailDigestSettingsStorage };
};

/**
 * Update email digest settings
 */
export const saveEmailDigestSettings = async (settings: EmailDigestSettings): Promise<void> => {
  // In a real implementation, this would save to a database or API
  emailDigestSettingsStorage = { ...settings };
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  toast.success('Email digest settings saved', {
    description: 'Your email notification preferences have been updated'
  });
};

/**
 * Send a test email digest
 */
export const sendTestEmailDigest = async (recipients: string[]): Promise<boolean> => {
  // In a real implementation, this would call an email sending service
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate success (90% of the time)
  const success = Math.random() > 0.1;
  
  if (success) {
    toast.success('Test email sent', {
      description: `Email digest sent to ${recipients.length} recipient(s)`
    });
  } else {
    toast.error('Failed to send test email', {
      description: 'There was an error sending the test email'
    });
  }
  
  return success;
};

/**
 * Schedule the next email digest
 */
export const scheduleNextDigest = (): Date => {
  const now = new Date();
  let nextDigestDate: Date;
  
  switch (emailDigestSettingsStorage.frequency) {
    case 'daily':
      // Tomorrow at 9 AM
      nextDigestDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0, 0);
      break;
    case 'weekly':
      // Next Monday at 9 AM
      const daysUntilMonday = (1 + 7 - now.getDay()) % 7;
      nextDigestDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilMonday, 9, 0, 0);
      break;
    case 'immediate':
      // Not applicable for scheduled digests
      nextDigestDate = now;
      break;
  }
  
  return nextDigestDate;
};

/**
 * Schedule a new email digest
 */
export const scheduleEmailDigest = async (settings: EmailDigestSettings): Promise<void> => {
  // Update settings first
  await saveEmailDigestSettings(settings);
  
  // Calculate next run date
  const nextRunDate = scheduleNextDigest();
  
  // Show toast notification
  toast.success('Email digest scheduled', {
    description: `Next digest will be sent on ${nextRunDate.toLocaleDateString()} at ${nextRunDate.toLocaleTimeString()}`
  });
  
  console.log(`Email digest scheduled for ${nextRunDate.toISOString()}`);
};
