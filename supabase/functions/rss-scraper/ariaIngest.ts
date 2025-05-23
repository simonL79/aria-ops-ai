
import { RSSItem } from './types.ts';
import { SUPABASE_URL, ARIA_INGEST_KEY } from './config.ts';

/**
 * Send RSS item to ARIA ingest pipeline
 */
export async function sendToAriaIngest(item: RSSItem) {
  try {
    const content = `${item.title}\n${item.description}`;
    
    console.log(`[RSS-SCRAPER] Sending to ARIA ingest: ${item.title.substring(0, 50)}...`);
    
    const payload = {
      content: content,
      platform: 'uk_news',
      url: item.link,
      source_type: 'uk_rss_feed',
      confidence_score: 80,
      potential_reach: 100000, // Higher reach estimate for UK news
      metadata: {
        source: item.source,
        published_date: item.pubDate,
        content_type: 'uk_celebrity_sports_news',
        region: 'UK'
      }
    };
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/aria-ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ARIA_INGEST_KEY || 'H7zYd0N6R9xM3bKpLqE1jUvTnZqF5sBgXwPm9QCeLd0=',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ARIA ingest failed: ${error}`);
    }
    
    const result = await response.json();
    console.log(`[RSS-SCRAPER] Successfully sent to ARIA ingest`);
    return result;
    
  } catch (error) {
    console.error(`[RSS-SCRAPER] Error sending to ARIA ingest:`, error);
    throw error;
  }
}
