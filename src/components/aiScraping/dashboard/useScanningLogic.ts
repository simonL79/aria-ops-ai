
import { useState, useEffect, useCallback } from 'react';
import { ContentAlert } from '@/types/dashboard';
import type { 
  getMonitoringStatus, 
  startMonitoring,
  stopMonitoring,
  runMonitoringScan,
  ScanResult,
  MonitoringStatus
} from '@/services/monitoring';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Custom hook for handling scanning logic in monitoring dashboards
 */
const useScanningLogic = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ContentAlert[]>([]);
  const [scanDate, setScanDate] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [monitoringStatus, setMonitoringStatus] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    scansToday: 0,
    alertsDetected: 0,
    highPriorityAlerts: 0
  });
  const [scanConfig, setScanConfig] = useState({
    depth: 'standard',
    platforms: ['all'],
    timeframe: '7d'
  });

  // Fetch initial monitoring status and results
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Get monitoring status
        const status = await getMonitoringStatus();
        setMonitoringStatus(status);
        setIsActive(status.isActive);
        
        // Get recent scan results
        const { data: resultsData, error: resultsError } = await supabase
          .from('scan_results')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (resultsError) {
          console.error("Error fetching scan results:", resultsError);
          return;
        }
        
        if (resultsData && resultsData.length > 0) {
          // Format the results to match ContentAlert type
          const formattedResults: ContentAlert[] = resultsData.map(result => ({
            id: result.id,
            platform: result.platform,
            content: result.content,
            date: new Date(result.created_at).toLocaleString(),
            severity: result.severity as 'high' | 'medium' | 'low',
            status: mapStatus(result.status || 'new'),
            url: result.url || '',
            threatType: result.threat_type,
            sourceType: result.source_type || mapPlatformToSourceType(result.platform),
            confidenceScore: result.confidence_score || 75,
            sentiment: mapNumericSentimentToString(result.sentiment),
            detectedEntities: Array.isArray(result.detected_entities) ? 
              result.detected_entities.map(entity => String(entity)) : [],
            potentialReach: result.potential_reach
          }));
          
          setScanResults(formattedResults);
          
          if (status.lastRun) {
            setScanDate(new Date(status.lastRun));
          }
          
          // Count scans today
          const { data: scansToday, error: scanCountError } = await supabase
            .from('activity_logs')
            .select('count')
            .eq('action', 'monitoring_scan')
            .gte('created_at', new Date().toISOString().split('T')[0]);
          
          if (!scanCountError) {
            // Update metrics
            setMetrics({
              scansToday: scansToday?.[0]?.count || 0,
              alertsDetected: formattedResults.length,
              highPriorityAlerts: formattedResults.filter(r => r.severity === 'high').length
            });
          }
        }
      } catch (error) {
        console.error('Error fetching initial scanning data:', error);
      }
    };
    
    // Helper function to map status values to ContentAlert status type
    const mapStatus = (status: string): ContentAlert['status'] => {
      if (status === 'resolved') return 'reviewing';
      if (['new', 'read', 'actioned', 'reviewing'].includes(status)) {
        return status as ContentAlert['status'];
      }
      return 'new';
    };
    
    fetchInitialData();
    
    // Set interval to periodically refresh status
    const intervalId = setInterval(async () => {
      try {
        const status = await getMonitoringStatus();
        setMonitoringStatus(status);
        setIsActive(status.isActive);
      } catch (error) {
        console.error('Error updating monitoring status:', error);
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Map platform to source type based on name
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
  
  // Map numeric sentiment to string sentiment
  const mapNumericSentimentToString = (sentiment?: number): ContentAlert['sentiment'] => {
    if (sentiment === undefined || sentiment === null) return 'neutral';
    
    if (sentiment < -70) return 'threatening';
    if (sentiment < -20) return 'negative';
    if (sentiment > 50) return 'positive';
    return 'neutral';
  };

  // Toggle active state
  const handleToggleScan = useCallback(async () => {
    try {
      if (isActive) {
        await stopMonitoring();
      } else {
        await startMonitoring();
      }
      
      const status = await getMonitoringStatus();
      setMonitoringStatus(status);
      setIsActive(status.isActive);
    } catch (error) {
      console.error('Error toggling scan status:', error);
      toast.error("Failed to update monitoring status");
    }
  }, [isActive]);

  // Perform a real scan
  const performScan = useCallback(async () => {
    setIsScanning(true);
    
    try {
      // Run a real scan
      const results = await runMonitoringScan();
      
      if (results.length > 0) {
        // Format the results to match ContentAlert type
        const formattedResults: ContentAlert[] = results.map(result => ({
          id: result.id,
          platform: result.platform,
          content: result.content,
          date: new Date(result.date).toLocaleString(),
          severity: result.severity,
          status: result.status === 'resolved' ? 'reviewing' : result.status as ContentAlert['status'],
          url: result.url,
          threatType: result.threatType,
          sourceType: result.sourceType || result.source_type || mapPlatformToSourceType(result.platform),
          confidenceScore: result.confidenceScore || result.confidence_score || 75,
          sentiment: mapNumericSentimentToString(result.sentiment),
          detectedEntities: Array.isArray(result.detectedEntities || result.detected_entities) ? 
            (result.detectedEntities || result.detected_entities || []).map(entity => String(entity)) : [],
          potentialReach: result.potentialReach || result.potential_reach || 0,
          category: result.category || ''
        }));
        
        // Update results - properly handle the ContentAlert array
        setScanResults(prevResults => {
          return [...formattedResults, ...prevResults];
        });
        
        setScanDate(new Date());
        
        // Update metrics
        const highSeverityCount = results.filter(r => r.severity === 'high').length;
        setMetrics(prev => ({
          scansToday: prev.scansToday + 1,
          alertsDetected: prev.alertsDetected + results.length,
          highPriorityAlerts: prev.highPriorityAlerts + highSeverityCount
        }));
        
        // Return high severity count for notifications
        return { totalResults: results.length, highSeverity: results.filter(r => r.severity === 'high').length };
      }
      
      // No results
      return { totalResults: 0, highSeverity: 0 };
    } catch (error) {
      console.error('Error performing scan:', error);
      toast.error("Scan failed", {
        description: "An error occurred while scanning. Please try again."
      });
      return { totalResults: 0, highSeverity: 0 };
    } finally {
      setIsScanning(false);
    }
  }, [scanConfig]);
  
  // Handle manual scan
  const handleManualScan = useCallback(async () => {
    const result = await performScan();
    
    if (result.totalResults > 0) {
      toast.success(`Scan completed with ${result.totalResults} results`, {
        description: result.highSeverity > 0 
          ? `${result.highSeverity} high severity threats detected` 
          : "No high severity threats detected"
      });
    } else {
      toast.info("Scan completed with no results", {
        description: "No new threats were detected in this scan"
      });
    }
  }, [performScan]);
  
  // Update scan configuration
  const updateScanConfig = useCallback((newConfig: Partial<typeof scanConfig>) => {
    setScanConfig(prev => ({ ...prev, ...newConfig }));
  }, []);
  
  return {
    isScanning,
    scanResults,
    scanDate,
    scanConfig,
    isActive,
    setIsActive,
    metrics,
    monitoringStatus,
    handleToggleScan,
    handleManualScan,
    performScan,
    updateScanConfig
  };
};

export default useScanningLogic;
