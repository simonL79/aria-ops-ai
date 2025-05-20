
import { Mention } from "./types";

// Store for mentions (this would be a database in a real app)
const mentionsStore: Mention[] = [];

/**
 * Save a new mention to the store
 */
export const saveMention = (platform: string, content: string, source: string): Mention => {
  const newMention: Mention = {
    id: `mention-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    platform,
    content,
    source,
    date: new Date(),
    severity: Math.random() > 0.7 ? 'high' : (Math.random() > 0.5 ? 'medium' : 'low')
  };
  
  mentionsStore.unshift(newMention);
  return newMention;
};

/**
 * Get all mentions from the store
 */
export const getAllMentions = (): Mention[] => {
  return [...mentionsStore];
};

/**
 * Clear all mentions from the store
 */
export const clearMentions = (): void => {
  mentionsStore.length = 0;
};

/**
 * Get mentions filtered by platform
 */
export const getMentionsByPlatform = (platform: string): Mention[] => {
  return mentionsStore.filter(mention => mention.platform === platform);
};
