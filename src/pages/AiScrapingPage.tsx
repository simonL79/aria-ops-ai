
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RealTimeAlerts from "@/components/dashboard/real-time-alerts";
import { useAlertSimulation } from "@/components/dashboard/real-time-alerts/useAlertSimulation";
import { ContentAlert } from "@/types/dashboard";
import { ScanParameters, performLiveScan, registerAlertListener, startContinuousMonitoring } from '@/services/aiScraping/mockScanner';
import AiScrapingHeader from "@/components/aiScraping/AiScrapingHeader";
import AiScrapingTabs from "@/components/aiScraping/AiScrapingTabs";
import SystemStatusIndicator from "@/components/aiScraping/SystemStatusIndicator";
import { toast } from "sonner";
import { runMonitoringScan } from "@/services/monitoring";

const AiScrapingPage = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const { activeAlerts, setActiveAlerts, respondToAlert } = useAlertSimulation([]);
  const [selectedAlert, setSelectedAlert] = useState<ContentAlert | null>(null);
  const [continousMonitoringActive, setContinuousMonitoringActive] = useState<boolean>(true);

  // Set up continuous monitoring for real-time updates
  useEffect(() => {
    if (continousMonitoringActive) {
      // Register for real-time alerts
      const cleanup = registerAlertListener((alert: ContentAlert) => {
        setActiveAlerts(prev => [alert, ...prev]);
        
        // Show notification for high severity alerts
        if (alert.severity === 'high') {
          toast.error("High Risk Alert Detected", {
            description: alert.content.substring(0, 100) + (alert.content.length > 100 ? '...' : ''),
            duration: 8000,
          });
          
          // Play notification sound
          try {
            const audio = new Audio('/notification-sound.mp3');
            audio.volume = 0.4;
            audio.play().catch(e => console.log('Audio play prevented by browser policy:', e));
          } catch (err) {
            console.log('Audio notification not supported');
          }
        }
      });
      
      // Start continuous monitoring
      const stopMonitoring = startContinuousMonitoring((alerts: ContentAlert[]) => {
        if (alerts.length > 0) {
          setActiveAlerts(prev => [...alerts, ...prev]);
          
          const highSeverityCount = alerts.filter(a => a.severity === 'high').length;
          if (highSeverityCount > 0) {
            toast.warning(`${highSeverityCount} new high severity threats detected`, {
              description: "Live monitoring has found new potential reputation threats",
            });
          }
        }
      });
      
      // Clean up when component unmounts
      return () => {
        cleanup();
        stopMonitoring();
      };
    }
  }, [continousMonitoringActive, setActiveAlerts]);

  // Handle manual scan
  const handleScan = () => {
    setIsScanning(true);
    
    // Run both AI scanning and monitoring scan for comprehensive coverage
    Promise.all([
      performLiveScan(),
      runMonitoringScan()
    ]).then(([aiResults]) => {
      setActiveAlerts(prev => [...aiResults, ...prev]);
      toast.success("Comprehensive scan completed", {
        description: `Found ${aiResults.length} new mentions across multiple platforms.`,
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
      toast.success("Advanced scan completed", {
        description: `Found ${results.length} new mentions with your custom parameters.`,
      });
    } catch (error) {
      console.error("Error performing scan:", error);
      toast.error("Advanced scan failed", {
        description: "An error occurred while scanning with your parameters. Please try again.",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleViewDetail = (alert: ContentAlert) => {
    setSelectedAlert(alert);
    
    // Store the alert in sessionStorage for consistent access
    sessionStorage.setItem('selectedAlert', JSON.stringify(alert));
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
    
    if (alert) {
      // Mark it as being responded to
      respondToAlert(alertId);
      
      // Store the alert in sessionStorage so it persists through navigation
      sessionStorage.setItem('selectedAlert', JSON.stringify(alert));
      
      // Navigate to engagement hub with this alert ID in the URL
      navigate(`/dashboard/engagement?alert=${alertId}`);
    } else {
      toast.error("Alert not found", {
        description: "The alert you're trying to respond to could not be found."
      });
    }
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
        
        <div className="space-y-6">
          <SystemStatusIndicator isLive={continousMonitoringActive} />
          
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
