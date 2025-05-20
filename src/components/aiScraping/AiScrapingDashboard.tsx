
import { useEffect } from 'react';
import { toast } from "sonner";
import MonitoringControls from './dashboard/MonitoringControls';
import MonitoringMetrics from './dashboard/MonitoringMetrics';
import MonitoringResults from './dashboard/MonitoringResults';
import useScanningLogic from './dashboard/useScanningLogic';

const AiScrapingDashboard = () => {
  const {
    isActive,
    setIsActive,
    scanResults,
    isScanning,
    metrics,
    handleToggleScan,
    handleManualScan
  } = useScanningLogic();
  
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
