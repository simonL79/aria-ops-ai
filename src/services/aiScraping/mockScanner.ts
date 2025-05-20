
import { ContentAlert } from "@/types/dashboard";

// Export the ScanParameters interface
export interface ScanParameters {
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

// Mock function for performing live scanning
export const performLiveScan = async (params?: ScanParameters): Promise<ContentAlert[]> => {
  console.log("Performing live scan with parameters:", params);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate mock results
  const results: ContentAlert[] = [];
  const count = params?.maxResults || Math.floor(Math.random() * 5) + 1;
  
  const platforms = params?.platforms?.length 
    ? params.platforms 
    : ['Twitter', 'LinkedIn', 'News Sites', 'Reddit', 'Facebook'];
  
  for (let i = 0; i < count; i++) {
    const severity = params?.prioritizeSeverity || 
      ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high';
    
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    
    results.push({
      id: `scan-${Date.now()}-${i}`,
      platform,
      content: `${platform} mention about your brand with ${severity} severity level. ${params?.keywords?.join(', ') || 'No specific keywords'} mentioned.`,
      date: new Date().toISOString().split('T')[0],
      severity,
      status: 'new',
      url: `https://example.com/${platform.toLowerCase()}/mention-${i}`,
      threatType: params?.threatTypes?.length 
        ? params.threatTypes[Math.floor(Math.random() * params.threatTypes.length)]
        : ['Reputation Risk', 'Customer Service', 'Product Issue'][Math.floor(Math.random() * 3)]
    });
  }
  
  return results;
};

// Register for real-time alerts
export const registerAlertListener = (callback: (alert: ContentAlert) => void): () => void => {
  console.log("Registering for real-time alerts");
  
  // Set up interval to simulate incoming alerts
  const intervalId = setInterval(() => {
    // 10% chance of getting an alert
    if (Math.random() > 0.9) {
      const severity = Math.random() > 0.7 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low';
      const platform = ['Twitter', 'LinkedIn', 'News Sites', 'Reddit', 'Facebook'][Math.floor(Math.random() * 5)];
      
      const alert: ContentAlert = {
        id: `alert-${Date.now()}`,
        platform,
        content: `New ${severity} severity mention on ${platform} about your brand.`,
        date: new Date().toISOString().split('T')[0],
        severity: severity as 'low' | 'medium' | 'high',
        status: 'new',
        url: `https://example.com/alert`,
        threatType: ['Reputation Risk', 'Customer Service', 'Product Issue'][Math.floor(Math.random() * 3)]
      };
      
      callback(alert);
    }
  }, 30000); // Check every 30 seconds
  
  // Return cleanup function
  return () => clearInterval(intervalId);
};

// Start continuous monitoring
export const startContinuousMonitoring = (callback: (alerts: ContentAlert[]) => void): () => void => {
  console.log("Starting continuous monitoring");
  
  // Set up interval for periodic checks
  const intervalId = setInterval(() => {
    // 20% chance of finding new mentions in a periodic check
    if (Math.random() > 0.8) {
      const count = Math.floor(Math.random() * 3) + 1;
      const alerts: ContentAlert[] = [];
      
      for (let i = 0; i < count; i++) {
        const severity = Math.random() > 0.7 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low';
        const platform = ['Twitter', 'LinkedIn', 'News Sites', 'Reddit', 'Facebook'][Math.floor(Math.random() * 5)];
        
        alerts.push({
          id: `monitor-${Date.now()}-${i}`,
          platform,
          content: `Continuously monitored mention on ${platform} about your brand.`,
          date: new Date().toISOString().split('T')[0],
          severity: severity as 'low' | 'medium' | 'high',
          status: 'new',
          url: `https://example.com/monitor-${i}`,
          threatType: ['Reputation Risk', 'Customer Service', 'Product Issue'][Math.floor(Math.random() * 3)]
        });
      }
      
      callback(alerts);
    }
  }, 90000); // Check every 90 seconds
  
  // Return cleanup function
  return () => clearInterval(intervalId);
};
