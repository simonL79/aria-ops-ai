
/**
 * RSS Feed Parser for Deno environment
 * Uses DOMParser polyfill for server-side XML parsing
 */

// Simple XML parser for RSS feeds in Deno environment
export function parseRSSFeed(xmlText: string): any[] {
  try {
    // Simple regex-based RSS parser since DOMParser isn't available in Deno
    const items: any[] = [];
    
    // Match all <item> blocks
    const itemMatches = xmlText.match(/<item[^>]*>[\s\S]*?<\/item>/gi);
    
    if (!itemMatches) {
      console.log('No RSS items found in feed');
      return [];
    }
    
    itemMatches.forEach((itemXml, index) => {
      try {
        // Extract title
        const titleMatch = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : '';
        
        // Extract description
        const descMatch = itemXml.match(/<description[^>]*>([\s\S]*?)<\/description>/i);
        const description = descMatch ? descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : '';
        
        // Extract link
        const linkMatch = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
        const link = linkMatch ? linkMatch[1].trim() : '';
        
        // Extract pub date
        const pubDateMatch = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i);
        const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';
        
        if (title || description) {
          items.push({
            title: title,
            description: description,
            link: link,
            pubDate: pubDate,
            content: `${title} ${description}`.trim()
          });
        }
      } catch (error) {
        console.error(`Error parsing RSS item ${index}:`, error);
      }
    });
    
    console.log(`Successfully parsed ${items.length} RSS items`);
    return items;
    
  } catch (error) {
    console.error('RSS parsing error:', error);
    return [];
  }
}
