
import { postToAria, UK_TARGETS, containsThreat, mentionsUKTarget, delay } from './utils.ts';

export async function scanYouTube(): Promise<number> {
  console.log('[ARIA-SCRAPER] Starting YouTube RSS scan...');
  let totalMatches = 0;
  
  try {
    for (const target of UK_TARGETS.youtube_channels) {
      try {
        console.log(`[ARIA-SCRAPER] Scanning YouTube channel: ${target.name}`);
        
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${target.channelId}`;
        const response = await fetch(rssUrl);
        
        if (!response.ok) {
          console.error(`[ARIA-SCRAPER] Failed to fetch YouTube RSS for ${target.name}: ${response.status}`);
          continue;
        }
        
        const xmlText = await response.text();
        
        // Simple XML parsing for YouTube RSS feeds
        const titleMatches = xmlText.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g) || [];
        const linkMatches = xmlText.match(/<link rel="alternate" href="(.*?)"/g) || [];
        const publishedMatches = xmlText.match(/<published>(.*?)<\/published>/g) || [];
        
        // Skip first title (channel name)
        for (let i = 1; i < Math.min(6, titleMatches.length); i++) {
          const title = titleMatches[i].replace(/<title><!\[CDATA\[/, '').replace(/\]\]><\/title>/, '');
          const linkMatch = linkMatches[i-1];
          const videoUrl = linkMatch ? linkMatch.replace(/<link rel="alternate" href="/, '').replace(/"/, '') : '';
          
          // Check for threats or UK target mentions
          if (containsThreat(title) || mentionsUKTarget(title)) {
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
    
    // Also scan trending UK topics
    await scanYouTubeTrending();
    
  } catch (error) {
    console.error('[ARIA-SCRAPER] YouTube scan error:', error);
  }
  
  console.log(`[ARIA-SCRAPER] YouTube scan completed. Found ${totalMatches} relevant items.`);
  return totalMatches;
}

async function scanYouTubeTrending(): Promise<void> {
  try {
    // Search for UK celebrity and sports trending terms
    const searchTerms = [
      'UK celebrity scandal', 'British sports controversy', 
      'Premier League drama', 'UK entertainment news'
    ];
    
    for (const term of searchTerms) {
      // Note: This would typically use YouTube Data API for better results
      // For now, we'll simulate some trending content detection
      console.log(`[ARIA-SCRAPER] Checking trending: ${term}`);
      await delay(500);
    }
    
  } catch (error) {
    console.error('[ARIA-SCRAPER] Error scanning YouTube trending:', error);
  }
}
