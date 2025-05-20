
import { useState } from "react";
import { toast } from "sonner";
import { runMonitoringScan } from "@/services/monitoring";
import { ContentAlert } from "@/types/dashboard";
import { detectEntities, calculatePotentialReach } from "@/services/api/entityDetectionService";

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
        const newAlerts: ContentAlert[] = await Promise.all(results.map(async result => {
          // Detect entities for each result if not already present
          const entities = await detectEntities(result.content, result.platform);
          
          // Calculate potential reach if not already present
          const reach = calculatePotentialReach(result.platform);
          
          return {
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
            // Map numeric sentiment to string values
            sentiment: mapNumericSentimentToString(result.sentiment),
            // Add detected entities and potential reach
            detectedEntities: entities,
            potentialReach: reach,
            url: result.url
          };
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

  // Helper function to map numeric sentiment to string values expected by ContentAlert
  const mapNumericSentimentToString = (sentiment?: number): ContentAlert["sentiment"] => {
    if (sentiment === undefined) return "neutral";
    
    if (sentiment < -50) return "threatening";
    if (sentiment < 0) return "negative";
    if (sentiment > 50) return "positive";
    return "neutral";
  };

  return {
    isScanning,
    handleScan
  };
};
