
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DriftAlert {
  entity_name: string;
  platform: string;
  drift_score: number;
  trend_direction: string;
  detected_at: string;
  key_changes: any[];
}

export interface SentimentAlert {
  entity_name: string;
  platform: string;
  sentiment_before: number;
  sentiment_after: number;
  delta_score: number;
  measurement_date: string;
}

class DriftAlertService {
  private readonly DRIFT_THRESHOLD = 0.5;
  private readonly SENTIMENT_THRESHOLD = -0.4;

  async checkForDriftAlerts(): Promise<DriftAlert[]> {
    try {
      const { data, error } = await supabase
        .from('narrative_drift_tracking')
        .select('*')
        .gte('drift_score', this.DRIFT_THRESHOLD)
        .gte('detected_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('drift_score', { ascending: false });

      if (error) {
        console.error('Error checking drift alerts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in checkForDriftAlerts:', error);
      return [];
    }
  }

  async checkForSentimentAlerts(): Promise<SentimentAlert[]> {
    try {
      const { data, error } = await supabase
        .from('sentiment_tracking')
        .select('*')
        .lte('delta_score', this.SENTIMENT_THRESHOLD)
        .gte('measurement_date', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('delta_score', { ascending: true });

      if (error) {
        console.error('Error checking sentiment alerts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in checkForSentimentAlerts:', error);
      return [];
    }
  }

  async sendSlackAlert(webhookUrl: string, driftAlerts: DriftAlert[], sentimentAlerts: SentimentAlert[]): Promise<boolean> {
    if (!webhookUrl) {
      console.warn('No Slack webhook URL provided');
      return false;
    }

    try {
      const message = this.buildSlackMessage(driftAlerts, sentimentAlerts);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        console.log('Slack alert sent successfully');
        toast.success('Alert sent to Slack');
        return true;
      } else {
        console.error('Failed to send Slack alert:', response.statusText);
        toast.error('Failed to send Slack alert');
        return false;
      }
    } catch (error) {
      console.error('Error sending Slack alert:', error);
      toast.error('Error sending Slack alert');
      return false;
    }
  }

  async sendWebhookAlert(webhookUrl: string, alertData: any): Promise<boolean> {
    if (!webhookUrl) {
      console.warn('No webhook URL provided');
      return false;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          alert_type: 'threat_intelligence',
          data: alertData,
          source: 'ARIA_Intelligence_System'
        }),
      });

      if (response.ok) {
        console.log('Webhook alert sent successfully');
        toast.success('Webhook alert sent');
        return true;
      } else {
        console.error('Failed to send webhook alert:', response.statusText);
        toast.error('Failed to send webhook alert');
        return false;
      }
    } catch (error) {
      console.error('Error sending webhook alert:', error);
      toast.error('Error sending webhook alert');
      return false;
    }
  }

  private buildSlackMessage(driftAlerts: DriftAlert[], sentimentAlerts: SentimentAlert[]): any {
    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🚨 ARIA Intelligence Alert"
        }
      }
    ];

    if (driftAlerts.length > 0) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*📊 Narrative Drift Detected (${driftAlerts.length} alerts)*`
        }
      });

      driftAlerts.slice(0, 5).forEach(alert => {
        blocks.push({
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Entity:* ${alert.entity_name}`
            },
            {
              type: "mrkdwn",
              text: `*Platform:* ${alert.platform}`
            },
            {
              type: "mrkdwn",
              text: `*Drift Score:* ${alert.drift_score.toFixed(2)}`
            },
            {
              type: "mrkdwn",
              text: `*Trend:* ${alert.trend_direction}`
            }
          ]
        });
      });
    }

    if (sentimentAlerts.length > 0) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*📉 Sentiment Decline Detected (${sentimentAlerts.length} alerts)*`
        }
      });

      sentimentAlerts.slice(0, 5).forEach(alert => {
        blocks.push({
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Entity:* ${alert.entity_name}`
            },
            {
              type: "mrkdwn",
              text: `*Platform:* ${alert.platform}`
            },
            {
              type: "mrkdwn",
              text: `*Change:* ${alert.delta_score.toFixed(2)}`
            },
            {
              type: "mrkdwn",
              text: `*Time:* ${new Date(alert.measurement_date).toLocaleString()}`
            }
          ]
        });
      });
    }

    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `Generated at ${new Date().toLocaleString()} | ARIA Intelligence System`
        }
      ]
    });

    return { blocks };
  }

  async runAlertCheck(slackWebhookUrl?: string, customWebhookUrl?: string): Promise<void> {
    console.log('Running alert check...');
    
    const [driftAlerts, sentimentAlerts] = await Promise.all([
      this.checkForDriftAlerts(),
      this.checkForSentimentAlerts()
    ]);

    if (driftAlerts.length === 0 && sentimentAlerts.length === 0) {
      console.log('No alerts detected');
      return;
    }

    console.log(`Found ${driftAlerts.length} drift alerts and ${sentimentAlerts.length} sentiment alerts`);

    // Send Slack notification if URL provided
    if (slackWebhookUrl) {
      await this.sendSlackAlert(slackWebhookUrl, driftAlerts, sentimentAlerts);
    }

    // Send custom webhook notification if URL provided
    if (customWebhookUrl) {
      await this.sendWebhookAlert(customWebhookUrl, {
        drift_alerts: driftAlerts,
        sentiment_alerts: sentimentAlerts,
        summary: {
          total_drift_alerts: driftAlerts.length,
          total_sentiment_alerts: sentimentAlerts.length,
          highest_drift_score: Math.max(...driftAlerts.map(a => a.drift_score), 0),
          lowest_sentiment_delta: Math.min(...sentimentAlerts.map(a => a.delta_score), 0)
        }
      });
    }

    // Log the alerts to activity logs
    if (driftAlerts.length > 0 || sentimentAlerts.length > 0) {
      await supabase.from('activity_logs').insert({
        action: 'alert_notification_sent',
        entity_type: 'system',
        details: `Sent ${driftAlerts.length} drift alerts and ${sentimentAlerts.length} sentiment alerts`
      });
    }
  }
}

export const driftAlertService = new DriftAlertService();
