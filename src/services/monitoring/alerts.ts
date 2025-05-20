
import { ContentAlert } from "@/types/dashboard";
import { getAllMentions } from "./mentions";

/**
 * Convert mentions to ContentAlert format for the UI
 */
export const getMentionsAsAlerts = (): ContentAlert[] => {
  const mentions = getAllMentions();
  
  // Map mentions to ContentAlert format
  return mentions.map(mention => ({
    id: mention.id,
    platform: mention.source,
    content: mention.content,
    date: mention.timestamp.toISOString().split('T')[0],
    severity: getSeverityFromSentiment(mention.sentiment),
    status: 'new',
    sourceType: 'monitoring',
    url: mention.url || 'https://example.com'
  }));
};

// Helper to convert sentiment score to severity level
const getSeverityFromSentiment = (sentiment: number): 'low' | 'medium' | 'high' => {
  if (sentiment < -0.5) return 'high';
  if (sentiment < 0) return 'medium';
  return 'low';
};
