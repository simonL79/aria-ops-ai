
import { ContentAlert } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';

/**
 * Get mentions as content alerts from the database
 */
export const getMentionsAsAlerts = async (): Promise<ContentAlert[]> => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error("Error fetching mentions as alerts:", error);
      return [];
    }
    
    // Convert database scan results to ContentAlert format
    return data.map(item => ({
      id: item.id,
      platform: item.platform,
      content: item.content,
      date: new Date(item.created_at).toLocaleString(),
      severity: item.severity as 'high' | 'medium' | 'low',
      status: item.status as ContentAlert['status'] || 'new',
      url: item.url || '',
      threatType: item.threat_type,
      confidenceScore: item.confidence_score || 75,
      sourceType: item.source_type || mapPlatformToSourceType(item.platform),
      sentiment: mapNumericSentimentToString(item.sentiment),
      detectedEntities: Array.isArray(item.detected_entities) ? 
        item.detected_entities.map(entity => String(entity)) : [],
      potentialReach: item.potential_reach
    }));
  } catch (error) {
    console.error("Error in getMentionsAsAlerts:", error);
    return [];
  }
};

/**
 * Map platform to source type based on name
 */
const mapPlatformToSourceType = (platform: string): string => {
  if (!platform) return 'other';
  
  const platformLower = platform.toLowerCase();
  
  if (platformLower.includes('news')) return 'news';
  if (platformLower.includes('reddit')) return 'forum';
  if (['twitter', 'facebook', 'instagram', 'linkedin'].some(p => platformLower.includes(p))) {
    return 'social';
  }
  
  return 'other';
};

/**
 * Map numeric sentiment value to string sentiment
 */
const mapNumericSentimentToString = (sentiment?: number): ContentAlert['sentiment'] => {
  if (sentiment === undefined || sentiment === null) return 'neutral';
  
  // Map threatening sentiment (-70 or below) to negative since we can't use 'threatening'
  if (sentiment < -70) return 'negative';
  if (sentiment < -20) return 'negative';
  if (sentiment > 50) return 'positive';
  return 'neutral';
};
