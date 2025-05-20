
import { Mention } from './types';
import { ContentAlert } from '@/types/dashboard';
import { getAllMentions } from './mentions';

/**
 * Convert mentions to ContentAlert format
 */
export const getMentionsAsAlerts = (): ContentAlert[] => {
  const mentions = getAllMentions();
  
  return mentions.map(mention => {
    // Convert mention to alert format
    return {
      id: mention.id,
      platform: mention.source,
      content: mention.content,
      date: new Date(mention.timestamp).toLocaleString(),
      severity: getSeverityFromSentiment(mention.sentiment),
      status: 'new',
      url: mention.url,
      sourceType: getPlatformType(mention.platformId),
      sentiment: getSentimentLabel(mention.sentiment)
    };
  });
};

// Helper function to get severity from sentiment score
const getSeverityFromSentiment = (sentiment: number): 'low' | 'medium' | 'high' => {
  if (sentiment < -0.6) return 'high';
  if (sentiment < -0.3) return 'medium';
  return 'low';
};

// Helper function to get sentiment label
const getSentimentLabel = (sentiment: number): 'positive' | 'neutral' | 'negative' | 'threatening' => {
  if (sentiment < -0.6) return 'threatening';
  if (sentiment < -0.1) return 'negative';
  if (sentiment > 0.1) return 'positive';
  return 'neutral';
};

// Helper function to get platform type
const getPlatformType = (platformId: string): string => {
  const platformTypes: {[key: string]: string} = {
    'twitter': 'social',
    'facebook': 'social',
    'reddit': 'social',
    'instagram': 'social',
    'youtube': 'video',
    'news': 'news',
    'blogs': 'blog',
    'review_sites': 'review',
    'telegram': 'messaging',
    'darkweb': 'darkweb'
  };
  
  return platformTypes[platformId] || 'other';
};
