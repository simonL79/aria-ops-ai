
import { toast } from "sonner";
import { ScanResultStats } from "@/types/aiScraping";

/**
 * Get scan statistics for a specific timeframe
 */
export const getScanStats = async (timeframe: string): Promise<ScanResultStats> => {
  // In a real implementation, this would fetch data from a backend API
  // Here we're just generating mock data
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock stats
  return {
    totalScanned: Math.floor(Math.random() * 1000) + 500,
    risksIdentified: Math.floor(Math.random() * 50) + 10,
    averageRiskScore: 4 + Math.random() * 3,
    scanDuration: 1.5 + Math.random() * 2,
    sourcesDistribution: {
      'Twitter': Math.floor(Math.random() * 30) + 20,
      'Reddit': Math.floor(Math.random() * 25) + 15,
      'News': Math.floor(Math.random() * 20) + 10,
      'Facebook': Math.floor(Math.random() * 15) + 5,
      'LinkedIn': Math.floor(Math.random() * 10) + 5,
      'Other': Math.floor(Math.random() * 5) + 1
    }
  };
};

/**
 * Export statistics as CSV
 */
export const exportStats = async (timeframe: string): Promise<void> => {
  // In a real implementation, this would generate and download a CSV file
  // Here we're just showing a toast
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  toast.success('Statistics exported', {
    description: `The ${timeframe} statistics have been exported to CSV`
  });
};
