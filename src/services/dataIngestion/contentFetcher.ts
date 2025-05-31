
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
 * Fetches content from live sources only - NO SIMULATIONS
 * Uses consolidated real scanning logic
 */
export const fetchContent = async (options: Partial<IngestionOptions> = {}): Promise<ContentAlert[]> => {
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    console.log('🔍 A.R.I.A™ OSINT: Fetching live content - NO SIMULATIONS');
    
    // Use consolidated real scanning
    const liveResults = await performRealScan({
      fullScan: true,
      source: 'content_fetcher'
    });

    if (liveResults.length === 0) {
      console.log('ℹ️ No live content available');
      return [];
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
        confidenceScore: item.confidence_score,
        sourceType: 'live_osint',
        sentiment: item.sentiment > 0 ? 'positive' : item.sentiment < 0 ? 'negative' : 'neutral',
        potentialReach: item.potential_reach,
        detectedEntities: item.detected_entities,
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
