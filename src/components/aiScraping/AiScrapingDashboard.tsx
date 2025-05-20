
import { useEffect } from 'react';
import { toast } from "sonner";
import MonitoringControls from './dashboard/MonitoringControls';
import MonitoringMetrics from './dashboard/MonitoringMetrics';
import MonitoringResults from './dashboard/MonitoringResults';
import useScanningLogic from './dashboard/useScanningLogic';
import { playNotificationSound } from '@/utils/notificationSound';

const AiScrapingDashboard = () => {
  const {
    isScanning,
    scanResults,
    isActive,
    setIsActive,
    metrics,
    handleToggleScan,
    handleManualScan
  } = useScanningLogic();

  // Notify on high priority alerts
  useEffect(() => {
    const highPriorityAlerts = scanResults.filter(result => result.severity === 'high' && result.status === 'new');
    if (highPriorityAlerts.length > 0) {
      playNotificationSound('warning');
      toast.error(`🚨 HIGH RISK ALERT: ${highPriorityAlerts[0].platform}`, {
        description: "New mention on LinkedIn about your brand.",
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
        isScanning={isScanning}
        onActivate={() => setIsActive(true)}
      />
    </div>
  );
};

export default AiScrapingDashboard;
