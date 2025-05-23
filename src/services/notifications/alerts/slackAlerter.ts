
import { BaseAlerter, AlertOptions } from './baseAlerter';
import { HealthCheckResult } from '../types';

/**
 * Slack alerter implementation
 */
export class SlackAlerter extends BaseAlerter {
  constructor(options: AlertOptions) {
    super(options);
  }
  
  isConfigured(): boolean {
    return super.isConfigured() && !!this.options.webhookUrl;
  }
  
  async send(
    results: HealthCheckResult[],
    errors: HealthCheckResult[],
    warnings: HealthCheckResult[],
    highThreats: number
  ): Promise<void> {
    if (!this.isConfigured()) return;
    
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
      const response = await fetch(this.options.webhookUrl!, {
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
  }
}
