
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";
import { IngestionOptions } from "./types";
import { supabase } from "@/integrations/supabase/client";

const defaultOptions: IngestionOptions = {
  keywords: ['company name', 'brand name'],
  sources: ['reddit', 'news', 'forums'],
  maxResults: 100
};

/**
 * Fetches content from live sources only - NO SIMULATIONS
 */
export const fetchContent = async (options: Partial<IngestionOptions> = {}): Promise<ContentAlert[]> => {
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    console.log('🔍 A.R.I.A™ OSINT: Fetching live content - NO SIMULATIONS');
    
    // Execute live content fetching via edge functions
    const scanPromises = [
      supabase.functions.invoke('reddit-scan', {
        body: { 
          scanType: 'live_osint',
          keywords: mergedOptions.keywords,
          maxResults: mergedOptions.maxResults
        }
      }),
      supabase.functions.invoke('uk-news-scanner', {
        body: { 
          scanType: 'live_osint',
          keywords: mergedOptions.keywords,
          maxResults: mergedOptions.maxResults
        }
      })
    ];

    const results = await Promise.allSettled(scanPromises);
    const successfulResults = results.filter(result => result.status === 'fulfilled');

    if (successfulResults.length === 0) {
      console.warn('⚠️ No live content sources responded successfully');
      toast.warning("Live content fetch completed with no results");
      return [];
    }

    // Get recent live scan results from database
    const { data: liveData, error } = await supabase
      .from('scan_results')
      .select('*')
      .eq('source_type', 'live_osint')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
      .order('created_at', { ascending: false })
      .limit(mergedOptions.maxResults);

    if (error) {
      console.error('❌ Error fetching live content:', error);
      toast.error("Failed to fetch live intelligence data");
      return [];
    }

    if (!liveData || liveData.length === 0) {
      console.log('ℹ️ No recent live content available');
      return [];
    }

    // Validate and convert live data to ContentAlert format
    const liveAlerts: ContentAlert[] = liveData
      .filter(item => {
        // Block any mock data that might have slipped through
        const content = (item.content || '').toLowerCase();
        const hasMockIndicators = ['mock', 'test', 'demo', 'sample'].some(keyword => 
          content.includes(keyword)
        );
        
        if (hasMockIndicators) {
          console.warn('🚫 BLOCKED: Mock data detected and filtered');
          return false;
        }
        return true;
      })
      .map(item => ({
        id: item.id,
        platform: item.platform,
        content: item.content,
        date: new Date(item.created_at).toLocaleDateString(),
        severity: (['high', 'medium', 'low'].includes(item.severity) ? item.severity : 'low') as 'high' | 'medium' | 'low',
        status: 'new' as const,
        threatType: 'live_intelligence',
        confidenceScore: item.confidence_score || 75,
        sourceType: 'live_osint',
        sentiment: item.sentiment > 0 ? 'positive' : item.sentiment < 0 ? 'negative' : 'neutral',
        potentialReach: item.potential_reach || 0,
        detectedEntities: Array.isArray(item.detected_entities) ? 
          item.detected_entities.map(String) : [],
        url: item.url
      }));

    console.log(`✅ A.R.I.A™ OSINT: Fetched ${liveAlerts.length} verified live content items`);
    return liveAlerts;
    
  } catch (error) {
    console.error("❌ Error fetching live content:", error);
    toast.error("Failed to fetch live intelligence data");
    return [];
  }
};
