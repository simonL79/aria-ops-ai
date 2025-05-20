
import { Mention } from "./types";

// In-memory storage for mentions
let mentionsStorage: Mention[] = [];

/**
 * Save a new mention
 */
export const saveMention = (
  platform: string,
  content: string,
  source: string,
  severity: 'high' | 'medium' | 'low' = 'medium'
): Mention => {
  const newMention: Mention = {
    id: `mention-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    platform,
    content,
    source,
    date: new Date(),
    severity
  };
  
  mentionsStorage.push(newMention);
  return newMention;
};

/**
 * Get all recorded mentions
 */
export const getAllMentions = (): Mention[] => {
  return [...mentionsStorage];
};

/**
 * Clear all mentions
 */
export const clearMentions = (): void => {
  mentionsStorage = [];
};

/**
 * Get mentions for a specific platform
 */
export const getMentionsByPlatform = (platform: string): Mention[] => {
  return mentionsStorage.filter(mention => mention.platform === platform);
};
