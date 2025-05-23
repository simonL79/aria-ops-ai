
import { useEffect, useState } from 'react';
import { toast } from "sonner";
import MonitoringControls from './dashboard/MonitoringControls';
import MonitoringMetrics from './dashboard/MonitoringMetrics';
import MonitoringResults from './dashboard/MonitoringResults';
import useScanningLogic from './dashboard/useScanningLogic';
import { playNotificationSound } from '@/utils/notificationSound';
import { ContentAlert } from '@/types/dashboard';
import { getMentionsAsAlerts } from '@/services/monitoring';

const AiScrapingDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const {
    isScanning,
    scanResults,
    isActive,
    setIsActive,
    metrics,
    handleToggleScan,
    handleManualScan
  } = useScanningLogic();

  // Load initial mentions data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        console.log('AiScrapingDashboard: Loading initial mentions data...');
        const initialMentions = await getMentionsAsAlerts();
        
        if (initialMentions && initialMentions.length > 0) {
          console.log(`AiScrapingDashboard: Loaded ${initialMentions.length} initial mentions`);
          // Your useScanningLogic hook should handle this state update
        } else {
          console.log('AiScrapingDashboard: No initial mentions found');
        }
        setInitialDataLoaded(true);
      } catch (error) {
        console.error('AiScrapingDashboard: Error loading initial mentions:', error);
        toast.error("Failed to load monitoring data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Notify on high priority alerts
  useEffect(() => {
    if (!scanResults.length) return;
    
    const highPriorityAlerts = scanResults.filter(result => 
      result.severity === 'high' && result.status === 'new'
    );
    
    if (highPriorityAlerts.length > 0) {
      playNotificationSound('warning');
      toast.error(`🚨 HIGH RISK ALERT: ${highPriorityAlerts[0].platform}`, {
        description: highPriorityAlerts[0].content.substring(0, 60) + "...",
        duration: 5000,
      });
    }
  }, [scanResults]);
  
  return (
    <div className="space-y-6">
      <MonitoringControls 
        isActive={isActive}
        isScanning={isScanning}
        onToggleScan={handleToggleScan}
        onManualScan={handleManualScan}
      />
      
      <MonitoringMetrics metrics={metrics} />
      
      <MonitoringResults 
        scanResults={scanResults}
        isActive={isActive}
        isScanning={isScanning || (isLoading && !initialDataLoaded)}
        onActivate={() => setIsActive(true)}
      />
    </div>
  );
};

export default AiScrapingDashboard;
