
import { toast } from "sonner";
import { HealthCheckResult, AlertChannels } from "./types";
import { SlackAlerter } from "./alerts/slackAlerter";
import { DiscordAlerter } from "./alerts/discordAlerter";
import { EmailAlerter } from "./alerts/emailAlerter";

/**
 * Send health check alerts to configured channels
 */
export const sendHealthAlerts = async (
  results: HealthCheckResult[],
  channels: AlertChannels = {}
): Promise<void> => {
  const errors = results.filter(r => r.status === 'error');
  const warnings = results.filter(r => r.status === 'warning');
  
  // Calculate high threat count
  const highThreats = results.filter(r => r.count24h > 0 && r.message.includes('threats'))
    .reduce((sum, r) => {
      const match = r.message.match(/(\d+) potential threats/);
      return sum + (match ? parseInt(match[1]) : 0);
    }, 0);

  // Determine alert severity and if we should send alerts
  const shouldAlert = errors.length > 0 || warnings.length >= 3 || highThreats > 3;
  
  if (!shouldAlert) {
    console.log('✅ All systems operational - no alerts needed');
    return;
  }

  const alertSeverity = errors.length > 0 ? 'critical' : 
                       warnings.length >= 3 ? 'warning' : 
                       'info';

  // Create alerters for each channel
  const alerters = [
    new SlackAlerter({ 
      webhookUrl: channels.slack?.webhookUrl, 
      enabled: channels.slack?.enabled || false 
    }),
    new DiscordAlerter({ 
      webhookUrl: channels.discord?.webhookUrl, 
      enabled: channels.discord?.enabled || false 
    }),
    new EmailAlerter({ 
      recipients: channels.email?.recipients || [], 
      enabled: channels.email?.enabled || false 
    })
  ];

  // Send alerts to all configured channels
  await Promise.all(
    alerters
      .filter(alerter => alerter.isConfigured())
      .map(alerter => alerter.send(results, errors, warnings, highThreats))
  );

  // Show local notification
  const alertTitle = alertSeverity === 'critical' ? 
    '🚨 Critical ARIA Issues Detected' :
    '⚠️ ARIA Health Check Warnings';
    
  const alertMessage = `${errors.length} errors, ${warnings.length} warnings, ${highThreats} high threats detected`;
  
  toast.error(alertTitle, {
    description: alertMessage,
    duration: 10000
  });
};

/**
 * Test alert functionality
 */
export const testHealthAlerts = async (channels: AlertChannels): Promise<void> => {
  const mockResults: HealthCheckResult[] = [
    {
      platform: 'Test Platform',
      status: 'error',
      count24h: 0,
      message: 'This is a test error for alert testing'
    }
  ];

  await sendHealthAlerts(mockResults, channels);
};
