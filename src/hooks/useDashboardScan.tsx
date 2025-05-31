
import { useState } from "react";
import { toast } from "sonner";
import { ContentAlert } from "@/types/dashboard";
import { supabase } from "@/integrations/supabase/client";

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

    setIsScanning(true);
    
    try {
      console.log('🔍 A.R.I.A™ OSINT: Starting live dashboard scan');
      toast.info("Starting live OSINT intelligence sweep...", {
        description: "Crawling Reddit RSS, News feeds, and Forums"
      });

      // Execute multiple live scanning functions
      const scanFunctions = [
        'reddit-scan',
        'uk-news-scanner', 
        'enhanced-intelligence',
        'discovery-scanner',
        'monitoring-scan'
      ];

      const scanPromises = scanFunctions.map(func => 
        supabase.functions.invoke(func, {
          body: { 
            scanType: 'live_osint',
            enableLiveData: true,
            blockMockData: true,
            query: query || 'threat intelligence'
          }
        })
      );

      const results = await Promise.allSettled(scanPromises);
      
      // Count successful scans
      const successfulScans = results.filter(result => result.status === 'fulfilled').length;
      
      // Get latest live scan results from database
      const { data: liveResults, error } = await supabase
        .from('scan_results')
        .select('*')
        .eq('source_type', 'live_osint')
        .gte('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString()) // Last 10 minutes
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('❌ Error fetching live scan results:', error);
      }

      if (liveResults && liveResults.length > 0) {
        // Convert to ContentAlert format with proper typing
        const newAlerts: ContentAlert[] = liveResults.map(result => ({
          id: result.id,
          platform: result.platform,
          content: result.content,
          date: new Date(result.created_at).toLocaleDateString(),
          severity: (['high', 'medium', 'low'].includes(result.severity) ? result.severity : 'low') as 'high' | 'medium' | 'low',
          status: 'new' as const,
          threatType: 'live_intelligence',
          confidenceScore: result.confidence_score,
          sourceType: result.source_type,
          sentiment: result.sentiment > 0 ? 'positive' : result.sentiment < 0 ? 'negative' : 'neutral',
          potentialReach: 0,
          detectedEntities: Array.isArray(result.detected_entities) ? 
            result.detected_entities.map(String) : [],
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
        if (successfulScans > 0) {
          toast.info(`Live scan completed: ${successfulScans}/${scanFunctions.length} modules executed`, {
            description: "No new intelligence items detected from live sources"
          });
        } else {
          toast.error("❌ Live OSINT scan failed: No modules executed successfully");
        }
      }

      console.log(`✅ Dashboard scan complete: ${successfulScans}/${scanFunctions.length} live modules executed`);

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
