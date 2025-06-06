
import { useState } from "react";
import { toast } from "sonner";
import { ContentAlert } from "@/types/dashboard";
import { performRealScan } from "@/services/monitoring/realScan";

/**
 * A.R.I.A™ Live OSINT Dashboard Scanner - 100% Real Data Only
 * Updated to ensure live data connection
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
      console.log('🔍 A.R.I.A™ OSINT: Starting enhanced live dashboard scan');
      toast.info("Initiating live OSINT intelligence sweep...", {
        description: "Connecting to live Reddit RSS, News feeds, and Discovery scanners"
      });

      // Force live data scan with explicit targeting
      const liveResults = await performRealScan({
        fullScan: true,
        targetEntity: query || null,
        source: 'dashboard_scan_enhanced'
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
          confidenceScore: Math.round(result.confidence_score * 100),
          sourceType: 'live_osint',
          sentiment: result.sentiment > 0 ? 'positive' : result.sentiment < 0 ? 'negative' : 'neutral',
          potentialReach: result.potential_reach,
          detectedEntities: result.detected_entities,
          url: result.url,
          category: 'Live Intelligence'
        }));

        // Add new live results to existing alerts, avoiding duplicates
        const existingUrls = new Set(alerts.map(alert => alert.url));
        const uniqueNewAlerts = newAlerts.filter(alert => 
          alert.url && !existingUrls.has(alert.url)
        );

        if (uniqueNewAlerts.length > 0) {
          setAlerts([...uniqueNewAlerts, ...alerts]);
          toast.success(`Live OSINT scan completed`, {
            description: `${uniqueNewAlerts.length} new verified live intelligence items found`
          });
        } else {
          toast.info("Live scan completed", {
            description: "Results received but duplicates filtered out"
          });
        }
      } else {
        toast.warning("Live scan completed", {
          description: "No new intelligence items detected from live sources - check edge function status"
        });
      }

      console.log('✅ A.R.I.A™ OSINT: Enhanced live dashboard scan completed');

    } catch (error) {
      console.error('❌ Enhanced live dashboard scan failed:', error);
      toast.error("Live OSINT scan failed", {
        description: "Error connecting to live intelligence sources - check edge function configuration"
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
