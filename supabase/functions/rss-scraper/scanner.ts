
import { RSSItem } from './types.ts';
import { RSS_FEEDS } from './config.ts';
import { parseRSSFeed } from './parser.ts';
import { containsThreatKeywords } from './threatDetector.ts';

/**
 * Scan RSS feeds for threat-related content
 */
export async function scanRSSFeeds(): Promise<RSSItem[]> {
  console.log('[RSS-SCRAPER] Starting UK celebrity/sports/news scan...');
  
  const matchingItems: RSSItem[] = [];
  
  for (const feed of RSS_FEEDS) {
    console.log(`[RSS-SCRAPER] Scanning ${feed.name}: ${feed.url}`);
    
    try {
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'RepWatch UK Scanner/1.0 (https://repwatch.co)'
        }
      });
      
      if (!response.ok) {
        console.error(`[RSS-SCRAPER] Failed to fetch ${feed.name}: ${response.status}`);
        continue;
      }
      
      const xmlText = await response.text();
      const items = parseRSSFeed(xmlText, feed.name);
      
      console.log(`[RSS-SCRAPER] Retrieved ${items.length} items from ${feed.name}`);
      
      // Filter items that contain threat keywords
      const threatItems = items.filter(containsThreatKeywords);
      
      if (threatItems.length > 0) {
        console.log(`[RSS-SCRAPER] Found ${threatItems.length} potential UK reputation threats in ${feed.name}`);
        matchingItems.push(...threatItems);
      }
      
    } catch (error) {
      console.error(`[RSS-SCRAPER] Error scanning ${feed.name}:`, error);
      continue;
    }
  }
  
  console.log(`[RSS-SCRAPER] Found ${matchingItems.length} UK celebrity/sports/news threat items total`);
  return matchingItems;
}
