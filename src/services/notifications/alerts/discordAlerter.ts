
import { BaseAlerter, AlertOptions } from './baseAlerter';
import { HealthCheckResult } from '../types';

/**
 * Discord alerter implementation
 */
export class DiscordAlerter extends BaseAlerter {
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
      const response = await fetch(this.options.webhookUrl!, {
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
  }
}
