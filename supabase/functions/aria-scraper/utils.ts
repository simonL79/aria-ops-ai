
// Load environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const ARIA_INGEST_KEY = Deno.env.get('ARIA_INGEST_KEY') || 'H7zYd0N6R9xM3bKpLqE1jUvTnZqF5sBgXwPm9QCeLd0=';

// UK Celebrity and Sports threat keywords
export const THREAT_KEYWORDS = [
  'scandal', 'fraud', 'exposed', 'controversy', 'backlash', 'criticism',
  'lawsuit', 'arrest', 'investigation', 'allegation', 'denied', 'apology',
  'fired', 'suspended', 'dropped', 'cancelled', 'boycott', 'banned',
  'divorce', 'custody', 'rehab', 'bankruptcy', 'leaked', 'caught',
  'racism', 'sexism', 'harassment', 'discrimination', 'misconduct',
  'cheating', 'affair', 'drugs', 'abuse', 'violence', 'doping'
];

// UK Celebrity and Sports figures to monitor
export const UK_TARGETS = {
  celebrities: [
    'Gordon Ramsay', 'Adele', 'Ed Sheeran', 'Emma Watson', 'Daniel Craig',
    'Kate Winslet', 'Hugh Grant', 'Keira Knightley', 'Benedict Cumberbatch',
    'Tom Holland', 'Idris Elba', 'Helen Mirren', 'Jude Law', 'Tilda Swinton'
  ],
  sports: [
    'Harry Kane', 'Marcus Rashford', 'Raheem Sterling', 'Jordan Henderson',
    'Gareth Southgate', 'Lewis Hamilton', 'Tyson Fury', 'Anthony Joshua',
    'Emma Raducanu', 'Andy Murray', 'Mo Farah', 'Jessica Ennis-Hill'
  ],
  youtube_channels: [
    { name: 'Gordon Ramsay', channelId: 'UCjngWBRzUk_MHAyiCyUeqLg' },
    { name: 'KSI', channelId: 'UC4AY2mMKlE2gyfy6L4bhhyQ' },
    { name: 'Sidemen', channelId: 'UCDogdKl7t7NHzQ95aEwkdMw' },
    { name: 'James Corden', channelId: 'UCa6vGFO9ty8v5KZJXQxdhaw' }
  ]
};

// Check if content contains threat indicators
export function containsThreat(content: string): boolean {
  return THREAT_KEYWORDS.some(keyword => 
    content.toLowerCase().includes(keyword.toLowerCase())
  );
}

// Check if content mentions UK celebrities or sports figures
export function mentionsUKTarget(content: string): boolean {
  const allTargets = [...UK_TARGETS.celebrities, ...UK_TARGETS.sports];
  return allTargets.some(target => 
    content.toLowerCase().includes(target.toLowerCase())
  );
}

// Send content to ARIA ingest pipeline
export async function postToAria(
  content: string, 
  platform: string, 
  url: string, 
  entityName?: string
): Promise<boolean> {
  try {
    const payload = {
      content: content,
      platform: platform,
      url: url,
      source_type: 'uk_celebrity_sports_scraper',
      confidence_score: 80,
      potential_reach: platform === 'TikTok' ? 1000000 : platform === 'Instagram' ? 500000 : 200000,
      metadata: {
        entity_name: entityName,
        content_type: 'uk_celebrity_sports_content',
        region: 'UK',
        scan_source: 'aria_scraper',
        threat_detected: containsThreat(content),
        uk_target_mentioned: mentionsUKTarget(content)
      }
    };

    console.log(`[ARIA-SCRAPER] Sending ${platform} content to ARIA ingest:`, {
      url,
      contentLength: content.length,
      entityName,
      threatDetected: containsThreat(content)
    });

    const response = await fetch(`${SUPABASE_URL}/functions/v1/aria-ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ARIA_INGEST_KEY,
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ARIA ingest failed (${response.status}): ${errorText}`);
    }

    console.log(`[ARIA-SCRAPER] Successfully sent ${platform} content to ARIA ingest`);
    return true;

  } catch (error) {
    console.error(`[ARIA-SCRAPER] Error sending to ARIA ingest:`, error);
    return false;
  }
}

// Rate limiting helper
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
