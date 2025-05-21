
import { useState } from "react";
import { toast } from "sonner";
import { runMonitoringScan } from "@/services/monitoring";
import { ContentAlert } from "@/types/dashboard";
import { ScanResult } from "@/services/monitoring/types";

export const useDashboardScan = (
  alerts: ContentAlert[],
  setAlerts: (alerts: ContentAlert[]) => void,
  setFilteredAlerts: (alerts: ContentAlert[]) => void, 
  setNegativeContent: React.Dispatch<React.SetStateAction<number>>
) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [newAlerts, setNewAlerts] = useState<ContentAlert[]>([]);

  const handleScan = async () => {
    setIsScanning(true);
    setNewAlerts([]);
    
    try {
      // Run a real scan and get results
      const results = await runMonitoringScan();
      
      if (results && Array.isArray(results) && results.length > 0) {
        // Format the new results to match ContentAlert type
        const newAlerts: ContentAlert[] = results.map((result: ScanResult) => {
          return {
            id: result.id || `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            platform: result.platform || 'Unknown',
            content: result.content || '',
            date: result.date ? new Date(result.date).toLocaleString() : new Date().toLocaleString(),
            severity: result.severity || 'low',
            status: (result.status as ContentAlert['status']) || 'new',
            sourceType: result.platform?.toLowerCase().includes('news') ? 'news' :
                       result.platform?.toLowerCase().includes('reddit') ? 'forum' :
                       ['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].includes(result.platform || '') ? 'social' : 
                       'scan',
            url: result.url || '',
            threatType: result.threatType,
            confidenceScore: 75, // Default confidence score
            sentiment: mapNumericSentimentToString(result.sentiment),
            detectedEntities: Array.isArray(result.detectedEntities) ? result.detectedEntities : [],
            potentialReach: typeof result.potentialReach === 'number' ? result.potentialReach : undefined,
            category: result.threatType === 'customerInquiry' ? 'customer_enquiry' : undefined
          };
        });
        
        // Update alerts with new results
        const updatedAlerts = [...newAlerts, ...alerts];
        setAlerts(updatedAlerts);
        setFilteredAlerts(updatedAlerts);
        setNewAlerts(newAlerts);
        
        // Count new negative content
        const newNegativeCount = results.filter(r => r.severity === 'high').length;
        if (newNegativeCount > 0) {
          setNegativeContent(prev => prev + newNegativeCount);
        }
        
        toast.success("Scan completed", {
          description: `Found ${results.length} new mentions across ${new Set(results.map(r => r.platform)).size} platforms.`,
        });
      } else {
        toast.success("Scan completed", {
          description: "No new mentions found across monitored platforms.",
        });
      }
      
      // Set scan complete
      setScanComplete(true);
      
      // Reset scan complete after a delay
      setTimeout(() => {
        setScanComplete(false);
      }, 1000);
      
    } catch (error) {
      console.error("Scan error:", error);
      toast.error("Error during scan", {
        description: "Could not complete the scan. Please try again.",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const onResetScanStatus = () => {
    setScanComplete(false);
    setNewAlerts([]);
  };

  // Helper function to map numeric sentiment to string values expected by ContentAlert
  const mapNumericSentimentToString = (sentiment?: number): ContentAlert["sentiment"] => {
    if (sentiment === undefined) return "neutral";
    
    if (sentiment < -70) return "threatening";
    if (sentiment < -20) return "negative";
    if (sentiment > 50) return "positive";
    return "neutral";
  };

  return {
    isScanning,
    handleScan,
    scanComplete,
    newAlerts,
    onResetScanStatus
  };
};
