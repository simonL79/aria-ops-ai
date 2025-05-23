
import { RSSItem } from './types.ts';
import { THREAT_KEYWORDS } from './config.ts';

/**
 * Check if an RSS item contains threat keywords
 */
export function containsThreatKeywords(item: RSSItem): boolean {
  const content = `${item.title} ${item.description}`.toLowerCase();
  return THREAT_KEYWORDS.some(keyword => content.includes(keyword.toLowerCase()));
}
