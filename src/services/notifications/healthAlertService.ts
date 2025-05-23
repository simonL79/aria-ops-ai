
import { toast } from "sonner";

interface HealthCheckResult {
  platform: string;
  status: 'healthy' | 'warning' | 'error';
  lastEntry?: string;
  count24h: number;
  message: string;
}

interface AlertChannels {
  slack?: {
    webhookUrl: string;
    enabled: boolean;
  };
  email?: {
    recipients: string[];
    enabled: boolean;
  };
  discord?: {
    webhookUrl: string;
    enabled: boolean;
  };
}

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

  // Send to Slack
  if (channels.slack?.enabled && channels.slack.webhookUrl) {
    await sendSlackAlert(results, errors, warnings, highThreats, channels.slack.webhookUrl);
  }

  // Send to Discord  
  if (channels.discord?.enabled && channels.discord.webhookUrl) {
    await sendDiscordAlert(results, errors, warnings, highThreats, channels.discord.webhookUrl);
  }

  // Send email alerts
  if (channels.email?.enabled && channels.email.recipients.length > 0) {
    await sendEmailAlert(results, errors, warnings, highThreats, channels.email.recipients);
  }

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
 * Send Slack alert
 */
const sendSlackAlert = async (
  results: HealthCheckResult[],
  errors: HealthCheckResult[],
  warnings: HealthCheckResult[],
  highThreats: number,
  webhookUrl: string
): Promise<void> => {
  const message = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🚨 ARIA Health Check Alert",
          emoji: true
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Errors:* ${errors.length}`
          },
          {
            type: "mrkdwn", 
            text: `*Warnings:* ${warnings.length}`
          },
          {
            type: "mrkdwn",
            text: `*High Threats:* ${highThreats}`
          },
          {
            type: "mrkdwn",
            text: `*Timestamp:* ${new Date().toLocaleString()}`
          }
        ]
      }
    ] as any[]
  };

  // Add error details
  if (errors.length > 0) {
    message.blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*❌ Critical Issues:*\n${errors.map(e => `• ${e.platform}: ${e.message}`).join('\n')}`
      }
    });
  }

  // Add warning details
  if (warnings.length > 0) {
    message.blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*⚠️ Warnings:*\n${warnings.map(w => `• ${w.platform}: ${w.message}`).join('\n')}`
      }
    });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });

    if (response.ok) {
      console.log('📢 Slack alert sent successfully');
    } else {
      console.error('❌ Failed to send Slack alert:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Error sending Slack alert:', error);
  }
};

/**
 * Send Discord alert
 */
const sendDiscordAlert = async (
  results: HealthCheckResult[],
  errors: HealthCheckResult[],
  warnings: HealthCheckResult[],
  highThreats: number,
  webhookUrl: string
): Promise<void> => {
  const embed = {
    title: "🚨 ARIA Health Check Alert",
    color: errors.length > 0 ? 0xff0000 : 0xffaa00, // Red for errors, orange for warnings
    fields: [
      { name: "Errors", value: errors.length.toString(), inline: true },
      { name: "Warnings", value: warnings.length.toString(), inline: true },
      { name: "High Threats", value: highThreats.toString(), inline: true }
    ],
    timestamp: new Date().toISOString()
  };

  // Add error details
  if (errors.length > 0) {
    embed.fields.push({
      name: "❌ Critical Issues",
      value: errors.map(e => `• ${e.platform}: ${e.message}`).join('\n').substring(0, 1024),
      inline: false
    });
  }

  // Add warning details  
  if (warnings.length > 0) {
    embed.fields.push({
      name: "⚠️ Warnings", 
      value: warnings.map(w => `• ${w.platform}: ${w.message}`).join('\n').substring(0, 1024),
      inline: false
    });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    if (response.ok) {
      console.log('📢 Discord alert sent successfully');
    } else {
      console.error('❌ Failed to send Discord alert:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Error sending Discord alert:', error);
  }
};

/**
 * Send email alert (placeholder - would need email service integration)
 */
const sendEmailAlert = async (
  results: HealthCheckResult[],
  errors: HealthCheckResult[],
  warnings: HealthCheckResult[],
  highThreats: number,
  recipients: string[]
): Promise<void> => {
  // This would integrate with your email service (SendGrid, Resend, etc.)
  console.log(`📧 Would send email alert to: ${recipients.join(', ')}`);
  console.log(`Content: ${errors.length} errors, ${warnings.length} warnings, ${highThreats} threats`);
  
  // For now, just log the intended email content
  toast.info('Email alert logged', {
    description: `Alert would be sent to ${recipients.length} recipient(s)`
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
