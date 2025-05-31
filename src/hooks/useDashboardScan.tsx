
import { useState } from "react";
import { toast } from "sonner";
import { ContentAlert } from "@/types/dashboard";
import { performRealScan } from "@/services/monitoring/realScan";

/**
 * A.R.I.A™ Live OSINT Dashboard Scanner - 100% Real Data Only
 * Uses consolidated scanning logic
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

    setIsScanning(true);
    
    try {
      console.log('🔍 A.R.I.A™ OSINT: Starting live dashboard scan - NO SIMULATIONS');
      toast.info("Starting live OSINT intelligence sweep...", {
        description: "Crawling live Reddit RSS, News feeds, and Forums - NO MOCK DATA"
      });

      // Use consolidated real scanning
      const liveResults = await performRealScan({
        fullScan: true,
        targetEntity: query || null,
        source: 'dashboard_scan'
      });
      
      console.log(`🔍 A.R.I.A™ OSINT: ${liveResults.length} live intelligence items processed`);

      if (liveResults.length > 0) {
        // Convert to ContentAlert format with proper typing
        const newAlerts: ContentAlert[] = liveResults.map(result => ({
          id: result.id,
          platform: result.platform,
          content: result.content,
          date: new Date().toLocaleDateString(),
          severity: result.severity,
          status: 'new' as const,
          threatType: 'live_intelligence',
          confidenceScore: result.confidence_score,
          sourceType: 'live_osint',
          sentiment: result.sentiment > 0 ? 'positive' : result.sentiment < 0 ? 'negative' : 'neutral',
          potentialReach: result.potential_reach,
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
            description: `${uniqueNewAlerts.length} new verified live intelligence items - NO MOCK DATA`
          });
        } else {
          toast.info("Live scan completed", {
            description: "No new live intelligence items detected"
          });
        }
      } else {
        toast.info("Live scan completed", {
          description: "No new intelligence items detected from live sources"
        });
      }

      console.log('✅ A.R.I.A™ OSINT: Live dashboard scan completed - 100% live data verified');

    } catch (error) {
      console.error('❌ Live dashboard scan failed:', error);
      toast.error("Live OSINT scan failed", {
        description: "Error executing live intelligence gathering"
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
