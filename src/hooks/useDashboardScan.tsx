
import { useState } from "react";
import { toast } from "sonner";
import { ContentAlert } from "@/types/dashboard";
import { performLiveScan, performRealTimeMonitoring, validateLiveDataOnly } from "@/services/aiScraping/liveScanner";

/**
 * A.R.I.A™ Live OSINT Dashboard Scanner - 100% Real Data Only
 */
export const useDashboardScan = (
  alerts: ContentAlert[],
  setAlerts: (alerts: ContentAlert[]) => void
) => {
  const [isScanning, setIsScanning] = useState(false);

  const performScan = async (query: string = '', platforms: string[] = []) => {
    if (isScanning) {
      toast.warning("Live OSINT scan already in progress");
      return;
    }

    // Validate system is using live data only
    const isLiveCompliant = await validateLiveDataOnly();
    if (!isLiveCompliant) {
      toast.error("System contains mock data - Live OSINT scanning blocked");
      return;
    }

    setIsScanning(true);
    
    try {
      console.log('🔍 A.R.I.A™ OSINT: Starting live dashboard scan');
      toast.info("Starting live OSINT intelligence sweep...", {
        description: "Crawling Reddit RSS, News feeds, and Forums"
      });

      // Perform live scan across multiple platforms (no API keys required)
      const livePlatforms = platforms.length > 0 ? platforms : [
        'Reddit', 'News', 'Forums', 'RSS'
      ];

      const liveResults = await performLiveScan(
        query || 'reputation monitoring threat detection',
        livePlatforms,
        { maxResults: 50, includeRealTimeAlerts: true }
      );

      // Also get real-time monitoring data
      const realTimeResults = await performRealTimeMonitoring();

      // Combine live results
      const allLiveResults = [...liveResults, ...realTimeResults];

      if (allLiveResults.length > 0) {
        // Convert to ContentAlert format
        const newAlerts: ContentAlert[] = allLiveResults.map(result => ({
          id: result.id,
          platform: result.platform,
          content: result.content,
          date: new Date(result.created_at).toLocaleDateString(),
          severity: result.severity,
          status: 'new',
          threatType: 'live_intelligence',
          confidenceScore: result.confidence_score,
          sourceType: result.source_type,
          sentiment: result.sentiment > 0 ? 'positive' : result.sentiment < 0 ? 'negative' : 'neutral',
          potentialReach: 0,
          detectedEntities: result.detected_entities,
          url: result.url
        }));

        // Add new live results to existing alerts, avoiding duplicates
        const existingUrls = new Set(alerts.map(alert => alert.url));
        const uniqueNewAlerts = newAlerts.filter(alert => 
          alert.url && !existingUrls.has(alert.url)
        );

        if (uniqueNewAlerts.length > 0) {
          setAlerts([...uniqueNewAlerts, ...alerts]);
          toast.success(`Live OSINT scan completed`, {
            description: `${uniqueNewAlerts.length} new intelligence items from real sources`
          });
        } else {
          toast.info("Live scan completed", {
            description: "No new intelligence items detected"
          });
        }
      } else {
        toast.info("Live scan completed", {
          description: "No intelligence items detected from live sources"
        });
      }

      console.log(`✅ Dashboard scan complete: ${allLiveResults.length} live intelligence items processed`);

    } catch (error) {
      console.error("❌ Live dashboard scan failed:", error);
      toast.error("Live OSINT scan failed", {
        description: "Check console for details"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return {
    isScanning,
    performScan
  };
};
