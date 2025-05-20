
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RealTimeAlerts from "@/components/dashboard/real-time-alerts";
import { useAlertSimulation } from "@/components/dashboard/real-time-alerts/useAlertSimulation";
import { ContentAlert } from "@/types/dashboard";
import { ScanParameters, performLiveScan } from '@/services/aiScraping/mockScanner';
import AiScrapingHeader from "@/components/aiScraping/AiScrapingHeader";
import AiScrapingTabs from "@/components/aiScraping/AiScrapingTabs";
import { toast } from "sonner";

const AiScrapingPage = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const { activeAlerts, setActiveAlerts, respondToAlert } = useAlertSimulation([]);
  const [selectedAlert, setSelectedAlert] = useState<ContentAlert | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    performLiveScan().then(results => {
      setActiveAlerts(prev => [...results, ...prev]);
      toast.success("Scan completed", {
        description: `Found ${results.length} new mentions.`,
      });
      setIsScanning(false);
    }).catch((error) => {
      console.error("Error performing scan:", error);
      toast.error("Scan failed", {
        description: "An error occurred while scanning. Please try again.",
      });
      setIsScanning(false);
    });
  };

  const handleParameterizedScan = async (params: ScanParameters) => {
    setIsScanning(true);
    try {
      const results = await performLiveScan(params);
      setActiveAlerts(prev => [...results, ...prev]);
      toast.success("Manual scan completed", {
        description: `Found ${results.length} new mentions with your parameters.`,
      });
    } catch (error) {
      console.error("Error performing scan:", error);
      toast.error("Manual scan failed", {
        description: "An error occurred while scanning with your parameters. Please try again.",
      });
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
    // Find the alert to pass as state
    const alert = activeAlerts.find(a => a.id === alertId);
    
    // Mark it as being responded to
    respondToAlert(alertId);
    
    // Navigate to engagement hub with this alert
    navigate(`/dashboard/engagement?alert=${alertId}`);
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
            onRespond={handleViewOnEngagementHub}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AiScrapingPage;
