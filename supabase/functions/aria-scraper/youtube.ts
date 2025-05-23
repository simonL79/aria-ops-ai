
import { postToAria, UK_TARGETS, containsThreat, mentionsUKTarget, delay } from './utils.ts';

export async function scanYouTube(): Promise<number> {
  console.log('[ARIA-SCRAPER] Starting YouTube RSS scan...');
  let totalMatches = 0;
  
  try {
    // Import RSS parser for Deno
    const Parser = (await import('https://esm.sh/rss-parser@3.12.0')).default;
    const parser = new Parser();
    
    for (const target of UK_TARGETS.youtube_channels) {
      try {
        console.log(`[ARIA-SCRAPER] Scanning YouTube channel: ${target.name}`);
        
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${target.channelId}`;
        const feed = await parser.parseURL(rssUrl);
        
        // Process recent videos (limit to 5 per channel)
        const recentItems = feed.items.slice(0, 5);
        
        for (const item of recentItems) {
          const title = item.title || '';
          const content = item.contentSnippet || item.content || '';
          const fullContent = `${title}\n${content}`;
          const videoUrl = item.link || '';
          
          // Check for threats or UK target mentions
          if (containsThreat(fullContent) || mentionsUKTarget(fullContent)) {
            const success = await postToAria(
              `YouTube Video: ${title}`,
              'YouTube',
              videoUrl,
              target.name
            );
            
            if (success) {
              totalMatches++;
              console.log(`[ARIA-SCRAPER] YouTube threat/target detected for ${target.name}: ${title.substring(0, 50)}...`);
            }
          }
        }
        
        // Rate limiting between channels
        await delay(1000);
        
      } catch (error) {
        console.error(`[ARIA-SCRAPER] Error scanning YouTube channel ${target.name}:`, error);
      }
    }
    
  } catch (error) {
    console.error('[ARIA-SCRAPER] YouTube scan error:', error);
  }
  
  console.log(`[ARIA-SCRAPER] YouTube scan completed. Found ${totalMatches} relevant items.`);
  return totalMatches;
}
