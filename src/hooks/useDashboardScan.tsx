
import { useState } from "react";
import { toast } from "sonner";
import { ContentAlert } from "@/types/dashboard";
import { performLiveScan, performRealTimeMonitoring } from "@/services/aiScraping/liveScanner";

export const useDashboardScan = (
  alerts: ContentAlert[],
  setAlerts: (alerts: ContentAlert[]) => void
) => {
  const [isScanning, setIsScanning] = useState(false);

  const performScan = async (query: string = '', platforms: string[] = []) => {
    if (isScanning) {
      toast.warning("Scan already in progress");
      return;
    }

    setIsScanning(true);
    
    try {
      console.log('Starting dashboard scan with live data only');
      toast.info("Starting live intelligence sweep...");

      // Perform live scan across multiple platforms
      const livePlatforms = platforms.length > 0 ? platforms : [
        'Twitter', 'Reddit', 'Google News', 'Forums', 'Social Media'
      ];

      const liveResults = await performLiveScan(
        query || 'reputation monitoring',
        livePlatforms,
        { maxResults: 25, includeRealTimeAlerts: true }
      );

      // Also get real-time monitoring data
      const realTimeResults = await performRealTimeMonitoring();

      // Combine results
      const allResults = [...liveResults, ...realTimeResults];

      if (allResults.length > 0) {
        // Add new results to existing alerts, avoiding duplicates
        const existingUrls = new Set(alerts.map(alert => alert.url));
        const newResults = allResults.filter(result => 
          result.url && !existingUrls.has(result.url)
        );

        if (newResults.length > 0) {
          setAlerts([...newResults, ...alerts]);
          toast.success(`Live scan completed: ${newResults.length} new threats detected`);
        } else {
          toast.info("Scan completed: No new threats detected");
        }
      } else {
        toast.info("Scan completed: No threats detected");
      }

    } catch (error) {
      console.error("Dashboard scan failed:", error);
      toast.error("Scan failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return {
    isScanning,
    performScan
  };
};
