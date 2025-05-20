
import { Mention } from './types';

// In-memory store for mentions (would use database in production)
let mentions: Mention[] = [];

/**
 * Save a new mention
 */
export const saveMention = (mention: Omit<Mention, 'id'>): Mention => {
  const newMention: Mention = {
    ...mention,
    id: `mention-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
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
