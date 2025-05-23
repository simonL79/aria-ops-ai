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

// Export default scan parameters
export const defaultScanParameters: ScanParameters = {
  platforms: [],
  keywordFilters: [],
  maxResults: 3,
  includeCustomerEnquiries: true,
  prioritizeSeverity: undefined
};

// Export monitoring status function
export const getMonitoringStatus = () => {
  return {
    isActive: true,
    lastRun: new Date().toISOString(),
    nextRun: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    platforms: Math.floor(15 + Math.random() * 5), // 15-20 platforms
    activeSince: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 24 hours ago
  };
};

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

// Store for alert listeners
const alertListeners: Array<(alert: ContentAlert) => void> = [];

// Function to notify all registered listeners
export const notifyAlertListeners = (alert: ContentAlert): void => {
  alertListeners.forEach(listener => {
    try {
      listener(alert);
    } catch (error) {
      console.error("Error in alert listener:", error);
    }
  });
};

// Register for real-time alerts
export const registerAlertListener = (callback: (alert: ContentAlert) => void): () => void => {
  console.log("Registering for real-time alerts");
  
  // Add to listeners
  alertListeners.push(callback);
  
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
      
      notifyAlertListeners(alert);
    }
  }, 30000); // Check every 30 seconds
  
  // Return cleanup function
  return () => {
    const index = alertListeners.indexOf(callback);
    if (index > -1) {
      alertListeners.splice(index, 1);
    }
    clearInterval(intervalId);
  };
};

// Alias for unregisterAlertListener for API consistency
export const unregisterAlertListener = (callback: (alert: ContentAlert) => void): void => {
  const index = alertListeners.indexOf(callback);
  if (index > -1) {
    alertListeners.splice(index, 1);
  }
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

const createMockAlert = (override: Partial<ContentAlert> = {}): ContentAlert => {
  const platforms = ['Twitter', 'Facebook', 'Reddit', 'LinkedIn', 'News Site'];
  const severities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
  const threatTypes = ['spam', 'harassment', 'misinformation', 'hate_speech', 'scam'];
  const sentiments: ('positive' | 'negative' | 'neutral' | 'threatening')[] = ['positive', 'negative', 'neutral', 'threatening'];
  
  return {
    id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    content: `Mock content detected at ${new Date().toLocaleTimeString()}`,
    date: new Date().toISOString(),
    severity: severities[Math.floor(Math.random() * severities.length)],
    status: 'new',
    url: `https://example.com/post/${Math.random().toString(36).substring(2, 9)}`,
    threatType: threatTypes[Math.floor(Math.random() * threatTypes.length)],
    sourceType: 'social',
    confidenceScore: Math.floor(Math.random() * 40) + 60, // 60-100
    sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
    detectedEntities: ['entity1', 'entity2'],
    potentialReach: Math.floor(Math.random() * 10000) + 100,
    ...override
  };
};

export const simulateAIScan = async (
  keywords: string[],
  platforms: string[],
  onNewAlert?: (alert: ContentAlert) => void
): Promise<ContentAlert[]> => {
  console.log("Simulating AI scan with parameters:", keywords, platforms);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const resultCount = Math.floor(Math.random() * 5) + 1;
  
  const results: ContentAlert[] = [];
  
  for (let i = 0; i < resultCount; i++) {
    const alert = createMockAlert({
      content: `Alert containing "${keywords[0]}" found via AI scan`,
      platform: platforms[Math.floor(Math.random() * platforms.length)]
    });
    
    results.push(alert);
    
    if (onNewAlert) {
      onNewAlert(alert);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
};

export const simulateRealTimeScan = (
  onNewAlert: (alert: ContentAlert) => void,
  intervalMs: number = 15000
): (() => void) => {
  const interval = setInterval(() => {
    if (Math.random() > 0.7) {
      const alert = createMockAlert();
      onNewAlert(alert);
    }
  }, intervalMs);
  
  return () => clearInterval(interval);
};
