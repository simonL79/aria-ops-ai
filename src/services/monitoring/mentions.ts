
import { Mention } from './types';

// In-memory store for mentions (would use database in production)
let mentions: Mention[] = [];

/**
 * Save a new mention from the monitoring system
 */
export const saveMention = (
  platform: string,
  content: string,
  url: string = ''
): Mention => {
  const newMention: Mention = {
    id: `mention-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    source: platform,
    content: content,
    timestamp: new Date(),
    sentiment: calculateSentiment(content),
    entities: extractEntities(content),
    url: url,
    platformId: mapPlatformToPlatformId(platform)
  };
  
  mentions.unshift(newMention);
  return newMention;
};

/**
 * Get all stored mentions
 */
export const getAllMentions = (): Mention[] => {
  return mentions;
};

/**
 * Filter mentions by platform
 */
export const getMentionsByPlatform = (platformId: string): Mention[] => {
  return mentions.filter(mention => mention.platformId === platformId);
};

/**
 * Clear all stored mentions
 */
export const clearMentions = (): void => {
  mentions = [];
};

// Helper function to calculate a sentiment score
// In a real app, this would use NLP or call an API
const calculateSentiment = (content: string): number => {
  const negativeWords = ["bad", "terrible", "awful", "horrible", "poor", "negative"];
  const positiveWords = ["good", "great", "excellent", "awesome", "positive", "nice"];
  
  const contentLower = content.toLowerCase();
  
  let score = 0;
  negativeWords.forEach(word => {
    if (contentLower.includes(word)) score -= 0.2;
  });
  
  positiveWords.forEach(word => {
    if (contentLower.includes(word)) score += 0.2;
  });
  
  return Math.max(Math.min(score, 1), -1); // Clamp between -1 and 1
};

// Helper function to extract entities from content
const extractEntities = (content: string): string[] => {
  // In a real app, this would use NER or call an API
  // For now, just return some placeholder entities
  return ['brand', 'product'];
};

// Helper function to map platform name to platformId
const mapPlatformToPlatformId = (platform: string): string => {
  const platformMap: {[key: string]: string} = {
    'Twitter': 'twitter',
    'Facebook': 'facebook',
    'Reddit': 'reddit',
    'Instagram': 'instagram',
    'YouTube': 'youtube',
    'News Sites': 'news',
    'Blogs': 'blogs',
    'Review Sites': 'review_sites',
    'Telegram': 'telegram',
    'Dark Web': 'darkweb',
    'Manual Entry': 'manual'
  };
  
  return platformMap[platform] || platform.toLowerCase().replace(/\s+/g, '_');
};
