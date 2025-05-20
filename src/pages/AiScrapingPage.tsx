
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RealTimeAlerts from "@/components/dashboard/real-time-alerts";
import { useAlertSimulation } from "@/components/dashboard/real-time-alerts/useAlertSimulation";
import { ContentAlert } from "@/types/dashboard";
import { ScanParameters, performLiveScan } from '@/services/aiScraping/mockScanner';
import AiScrapingHeader from "@/components/aiScraping/AiScrapingHeader";
import AiScrapingTabs from "@/components/aiScraping/AiScrapingTabs";

const AiScrapingPage = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const { activeAlerts, setActiveAlerts } = useAlertSimulation([]);
  const [selectedAlert, setSelectedAlert] = useState<ContentAlert | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    performLiveScan().then(results => {
      setActiveAlerts(prev => [...results, ...prev]);
      setIsScanning(false);
    }).catch(() => {
      setIsScanning(false);
    });
  };

  const handleParameterizedScan = async (params: ScanParameters) => {
    setIsScanning(true);
    try {
      const results = await performLiveScan(params);
      setActiveAlerts(prev => [...results, ...prev]);
    } catch (error) {
      console.error("Error performing scan:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleViewDetail = (alert: ContentAlert) => {
    setSelectedAlert(alert);
  };

  const handleMarkAsRead = (alertId: string) => {
    setActiveAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'read' } : alert
    ));
  };

  const handleDismiss = (alertId: string) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleViewOnEngagementHub = (alertId: string) => {
    window.location.href = `/dashboard/engagement?alert=${alertId}`;
  };

  return (
    <DashboardLayout>
      <AiScrapingHeader isScanning={isScanning} onScan={handleScan} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <AiScrapingTabs
            isScanning={isScanning}
            setIsScanning={setIsScanning}
            activeAlerts={activeAlerts}
            setActiveAlerts={setActiveAlerts}
            selectedAlert={selectedAlert}
            setSelectedAlert={setSelectedAlert}
            onScan={handleScan}
            handleParameterizedScan={handleParameterizedScan}
            handleViewOnEngagementHub={handleViewOnEngagementHub}
          />
        </div>
        
        <div>
          <RealTimeAlerts 
            alerts={activeAlerts} 
            onViewDetail={handleViewDetail}
            onMarkAsRead={handleMarkAsRead}
            onDismiss={handleDismiss}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AiScrapingPage;
