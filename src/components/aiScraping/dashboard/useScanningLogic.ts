
import { useState, useEffect, useCallback } from 'react';
import { ContentAlert } from '@/types/dashboard';
import { 
  getMonitoringStatus, 
  getScanResults, 
  runMonitoringScan,
  MonitoringStatus,
  startMonitoring,
  stopMonitoring 
} from '@/services/monitoring';
import { toast } from 'sonner';

/**
 * Custom hook for handling scanning logic in monitoring dashboards
 */
const useScanningLogic = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ContentAlert[]>([]);
  const [scanDate, setScanDate] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [monitoringStatus, setMonitoringStatus] = useState<MonitoringStatus | null>(null);
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
        const results = await getScanResults(10);
        
        if (results.length > 0) {
          // Format the results to match ContentAlert type
          const formattedResults: ContentAlert[] = results.map(result => ({
            id: result.id,
            platform: result.platform,
            content: result.content,
            date: new Date(result.date).toLocaleString(),
            severity: result.severity,
            status: result.status,
            url: result.url,
            threatType: result.threatType
          }));
          
          setScanResults(formattedResults);
          
          if (status.lastRun) {
            setScanDate(new Date(status.lastRun));
          }
          
          // Update metrics
          setMetrics({
            scansToday: status.lastRun ? 1 : 0,
            alertsDetected: formattedResults.length,
            highPriorityAlerts: formattedResults.filter(r => r.severity === 'high').length
          });
        }
      } catch (error) {
        console.error('Error fetching initial scanning data:', error);
      }
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
          status: result.status,
          url: result.url,
          threatType: result.threatType
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
        return { totalResults: results.length, highSeverity: highSeverityCount };
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
