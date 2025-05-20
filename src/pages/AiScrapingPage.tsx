
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RealTimeAlerts from "@/components/dashboard/real-time-alerts";
import { ContentAlert } from "@/types/dashboard";
import { runMonitoringScan, getScanResults } from '@/services/monitoring';
import AiScrapingHeader from "@/components/aiScraping/AiScrapingHeader";
import AiScrapingTabs from "@/components/aiScraping/AiScrapingTabs";
import SystemStatusIndicator from "@/components/aiScraping/SystemStatusIndicator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { initializeMonitoringSystem } from "@/utils/initializeMonitoring";

interface ScanParameters {
  platforms?: string[];
  keywords?: string[];
  timeframe?: "day" | "week" | "month";
  intensity?: "low" | "medium" | "high";
  threatTypes?: string[];
  keywordFilters?: string[];
  maxResults?: number;
  includeCustomerEnquiries?: boolean;
  prioritizeSeverity?: "low" | "medium" | "high";
}

const AiScrapingPage = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [activeAlerts, setActiveAlerts] = useState<ContentAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<ContentAlert | null>(null);
  const [monitoringActive, setMonitoringActive] = useState<boolean>(true);

  // Initialize monitoring system and fetch data
  useEffect(() => {
    const initialize = async () => {
      await initializeMonitoringSystem();
      
      // Get initial scan results
      try {
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
          
          setActiveAlerts(formattedResults);
        }
      } catch (error) {
        console.error('Error loading initial scan results:', error);
      }
    };
    
    initialize();
    
    // Listen for real-time updates to scan_results
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'scan_results' }, 
        async (payload) => {
          // When a new scan result is inserted, get the latest results
          try {
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
              
              setActiveAlerts(prev => {
                // Remove duplicates by ID
                const existingIds = new Set(prev.map(alert => alert.id));
                const newAlerts = formattedResults.filter(alert => !existingIds.has(alert.id));
                
                // If there are new alerts, show notification for high severity ones
                newAlerts.forEach(alert => {
                  if (alert.severity === 'high') {
                    toast.error("High Risk Alert Detected", {
                      description: alert.content.substring(0, 100) + (alert.content.length > 100 ? '...' : ''),
                      duration: 8000,
                    });
                  }
                });
                
                return [...newAlerts, ...prev];
              });
            }
          } catch (error) {
            console.error('Error handling real-time scan results:', error);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Handle manual scan
  const handleScan = async () => {
    setIsScanning(true);
    
    try {
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
        
        setActiveAlerts(prev => [...formattedResults, ...prev]);
        
        toast.success("Scan completed successfully", {
          description: `Found ${results.length} new mentions across monitored platforms.`,
        });
      } else {
        toast.success("Scan completed", {
          description: "No new mentions found across monitored platforms.",
        });
      }
    } catch (error) {
      console.error("Error performing scan:", error);
      toast.error("Scan failed", {
        description: "An error occurred while scanning. Please try again.",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleParameterizedScan = async (params: ScanParameters) => {
    setIsScanning(true);
    try {
      // Use parameters to customize scan
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
        
        setActiveAlerts(prev => [...formattedResults, ...prev]);
        
        toast.success("Advanced scan completed", {
          description: `Found ${results.length} new mentions with your custom parameters.`,
        });
      } else {
        toast.success("Advanced scan completed", {
          description: "No new mentions found with your custom parameters.",
        });
      }
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

  const handleMarkAsRead = async (alertId: string) => {
    try {
      // Update status in database
      const { error } = await supabase
        .from('scan_results')
        .update({ status: 'read', updated_at: new Date().toISOString() })
        .eq('id', alertId);
      
      if (error) {
        console.error('Error marking alert as read:', error);
        return;
      }
      
      // Update local state
      setActiveAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, status: 'read' } : alert
      ));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const handleDismiss = async (alertId: string) => {
    try {
      // Update status in database
      const { error } = await supabase
        .from('scan_results')
        .update({ status: 'resolved', updated_at: new Date().toISOString() })
        .eq('id', alertId);
      
      if (error) {
        console.error('Error dismissing alert:', error);
        return;
      }
      
      // Update local state
      setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  const handleViewOnEngagementHub = async (alertId: string) => {
    try {
      // Update status in database
      const { error } = await supabase
        .from('scan_results')
        .update({ status: 'actioned', updated_at: new Date().toISOString() })
        .eq('id', alertId);
      
      if (error) {
        console.error('Error actioning alert:', error);
      }
      
      // Find the alert to pass as state
      const alert = activeAlerts.find(a => a.id === alertId);
      
      if (alert) {
        // Store the alert in sessionStorage so it persists through navigation
        sessionStorage.setItem('selectedAlert', JSON.stringify(alert));
        
        // Navigate to engagement hub with this alert ID in the URL
        navigate(`/dashboard/engagement?alert=${alertId}`);
      } else {
        toast.error("Alert not found", {
          description: "The alert you're trying to respond to could not be found."
        });
      }
    } catch (error) {
      console.error('Error handling alert action:', error);
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
          <SystemStatusIndicator isLive={monitoringActive} />
          
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
