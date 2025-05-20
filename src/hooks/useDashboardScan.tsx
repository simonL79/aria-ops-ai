
import { useState } from "react";
import { toast } from "sonner";
import { runMonitoringScan } from "@/services/monitoring";
import { ContentAlert } from "@/types/dashboard";

export const useDashboardScan = (
  alerts: ContentAlert[],
  setAlerts: (alerts: ContentAlert[]) => void,
  setFilteredAlerts: (alerts: ContentAlert[]) => void, 
  setNegativeContent: React.Dispatch<React.SetStateAction<number>>
) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    
    try {
      // Run a real scan and get results
      const results = await runMonitoringScan();
      
      if (results.length > 0) {
        // Format the new results to match ContentAlert type
        const newAlerts: ContentAlert[] = results.map(result => ({
          id: result.id,
          platform: result.platform,
          content: result.content,
          date: new Date(result.date).toLocaleString(),
          severity: result.severity,
          // Map 'resolved' status to 'reviewing' if needed
          status: result.status === 'resolved' ? 'reviewing' : result.status as ContentAlert['status'],
          threatType: result.threatType,
          confidenceScore: 75, // Default confidence score
          sourceType: 'scan',
          sentiment: result.sentiment,
        }));
        
        // Update alerts with new results
        const updatedAlerts = [...newAlerts, ...alerts];
        setAlerts(updatedAlerts);
        setFilteredAlerts(updatedAlerts);
        
        // Count new negative content
        const newNegativeCount = results.filter(r => r.severity === 'high').length;
        if (newNegativeCount > 0) {
          setNegativeContent(prev => prev + newNegativeCount);
        }
        
        toast.success("Scan completed", {
          description: `Found ${results.length} new mentions.`,
        });
      } else {
        toast.success("Scan completed", {
          description: "No new mentions found across monitored platforms.",
        });
      }
    } catch (error) {
      console.error("Scan error:", error);
      toast.error("Error during scan", {
        description: "Could not complete the scan. Please try again.",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return {
    isScanning,
    handleScan
  };
};
