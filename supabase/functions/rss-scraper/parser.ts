
import { RSSItem } from './types.ts';

/**
 * Parse RSS feed XML and extract items
 */
export function parseRSSFeed(xmlText: string, sourceName: string): RSSItem[] {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    
    const items = doc.querySelectorAll('item');
    const parsedItems: RSSItem[] = [];
    
    items.forEach(item => {
      const title = item.querySelector('title')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      
      parsedItems.push({
        title,
        description,
        link,
        pubDate,
        source: sourceName
      });
    });
    
    return parsedItems;
  } catch (error) {
    console.error(`[RSS-SCRAPER] Error parsing RSS feed for ${sourceName}:`, error);
    return [];
  }
}
