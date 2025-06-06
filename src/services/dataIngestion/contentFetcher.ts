
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";
import { IngestionOptions } from "./types";
import { performRealScan } from "@/services/monitoring/realScan";

const defaultOptions: IngestionOptions = {
  keywords: ['company name', 'brand name'],
  sources: ['reddit', 'news', 'forums'],
  maxResults: 100
};

/**
 * Enhanced Live Content Fetcher - Direct connection to live sources
 */
export const fetchContent = async (options: Partial<IngestionOptions> = {}): Promise<ContentAlert[]> => {
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    console.log('🔍 A.R.I.A™ OSINT: Enhanced live content fetching initiated');
    
    // Enhanced live scanning with better source targeting
    const liveResults = await performRealScan({
      fullScan: true,
      targetEntity: mergedOptions.keywords?.[0] || null,
      source: 'enhanced_content_fetcher'
    });

    if (liveResults.length === 0) {
      console.log('⚠️ No live content available - attempting fallback sources');
      
      // Attempt to trigger additional edge functions directly
      const { supabase } = await import("@/integrations/supabase/client");
      
      const fallbackPromises = [
        supabase.functions.invoke('radar-news-scan', {
          body: { scan_type: 'general_monitoring' }
        }),
        supabase.functions.invoke('reputation-scan', {
          body: { scan_type: 'live_reputation_check' }
        })
      ];
      
      const fallbackResults = await Promise.allSettled(fallbackPromises);
      const additionalResults: any[] = [];
      
      fallbackResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value?.data?.results) {
          additionalResults.push(...result.value.data.results);
        }
      });
      
      if (additionalResults.length > 0) {
        console.log(`📡 Fallback sources provided ${additionalResults.length} additional results`);
      }
    }

    // Convert live data to ContentAlert format
    const liveAlerts: ContentAlert[] = liveResults
      .slice(0, mergedOptions.maxResults) // Limit results
      .map(item => ({
        id: item.id,
        platform: item.platform,
        content: item.content,
        date: new Date().toLocaleDateString(),
        severity: item.severity,
        status: 'new' as const,
        threatType: 'live_intelligence',
        confidenceScore: Math.round(item.confidence_score * 100),
        sourceType: 'live_osint',
        sentiment: item.sentiment > 0 ? 'positive' : item.sentiment < 0 ? 'negative' : 'neutral',
        potentialReach: item.potential_reach,
        detectedEntities: item.detected_entities,
        url: item.url,
        category: 'Live Intelligence'
      }));

    console.log(`✅ A.R.I.A™ OSINT: Enhanced fetching complete - ${liveAlerts.length} verified live content items`);
    
    if (liveAlerts.length > 0) {
      toast.success(`Live content fetching completed: ${liveAlerts.length} real intelligence items`);
    } else {
      toast.warning("Live content fetching completed with no results - check edge function configuration");
    }
    
    return liveAlerts;
    
  } catch (error) {
    console.error("❌ Enhanced live content fetching failed:", error);
    toast.error("Failed to fetch live intelligence data - check edge function status");
    return [];
  }
};
