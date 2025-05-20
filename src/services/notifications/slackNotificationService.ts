
import { toast } from "sonner";

interface SlackNotificationPayload {
  clientName: string;
  platform: string;
  severity: number | string;
  category: string;
  content: string;
  recommendation: string;
  targets?: string[];
  dashboardUrl?: string;
}

export const sendSlackNotification = async (
  webhookUrl: string,
  payload: SlackNotificationPayload
): Promise<boolean> => {
  try {
    // Format severity as a number out of 10 if it's not already
    const severityText = typeof payload.severity === 'number' 
      ? `${payload.severity}/10` 
      : payload.severity;

    // Format the message in Slack's Block Kit format
    const message = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🚨 ARIA THREAT ALERT",
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Client:* ${payload.clientName}`
            },
            {
              type: "mrkdwn",
              text: `*Platform:* ${payload.platform}`
            }
          ]
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Severity:* ${severityText}`
            },
            {
              type: "mrkdwn",
              text: `*Category:* ${payload.category}`
            }
          ]
        }
      ]
    };
    
    // Add targets section if provided
    if (payload.targets && payload.targets.length > 0) {
      message.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Targets:* ${payload.targets.join(', ')}`
        }
      } as any);
    }
    
    // Content summary
    message.blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Summary:* "${payload.content.substring(0, 150)}${payload.content.length > 150 ? '...' : ''}"`
      }
    } as any);

    // Recommendation
    message.blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Recommended Action:* ${payload.recommendation}`
      }
    } as any);

    // Add a button to view in dashboard if URL is provided
    if (payload.dashboardUrl) {
      message.blocks.push({
        type: "actions",
        elements: [{
          type: "button",
          text: {
            type: "plain_text",
            text: "View in Dashboard",
            emoji: true
          },
          url: payload.dashboardUrl,
          style: "primary"
        }]
      } as any); // Using type assertion to avoid TypeScript errors
    }

    // Send the notification to Slack
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message),
      mode: "no-cors" // Use no-cors mode for cross-origin requests
    });
    
    console.log("Slack notification sent", payload);
    return true;
  } catch (error) {
    console.error("Failed to send Slack notification:", error);
    toast.error("Failed to send notification to Slack");
    return false;
  }
};

// Function to check if a mention should trigger a notification
export const shouldNotify = (severity: number | string): boolean => {
  // Convert string severity to number for comparison
  if (typeof severity === 'string') {
    const severityMap: Record<string, number> = {
      'low': 3,
      'medium': 6,
      'high': 9
    };
    return severityMap[severity.toLowerCase()] >= 7;
  }
  
  // For numeric severity, notify if >= 7
  return severity >= 7;
};

// Helper function to extract targets from content
export const extractTargetsFromContent = (content: string): string[] => {
  // Look for mentions of entities in the text - common patterns
  const entityPatterns = [
    /target(?:s|ed|ing)?:?\s*([^\.]+)/i,
    /(?:individual|person|company|brand|organization)(?:s)?:?\s*([^\.]+)/i,
    /(?:directed at|aimed at|focused on):?\s*([^\.]+)/i,
    /(?:attacking|threatening):?\s*([^\.]+)/i
  ];
  
  let targets: string[] = [];
  
  entityPatterns.forEach(pattern => {
    const match = content.match(pattern);
    if (match && match[1]) {
      const extracted = match[1].trim();
      if (extracted.length > 3 && !targets.includes(extracted)) {
        targets.push(extracted);
      }
    }
  });
  
  // If we still don't have targets, try to extract proper nouns
  if (targets.length === 0) {
    const properNouns = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
    if (properNouns) {
      targets = [...new Set(properNouns)].slice(0, 3);
    }
  }
  
  return targets.length > 0 ? targets : [];
};
