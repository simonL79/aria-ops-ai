import { ContentAlert } from "@/types/dashboard";

// Event listeners for real-time alerts
const alertListeners: Function[] = [];

// Register a listener for alerts
export const registerAlertListener = (listener: Function) => {
  alertListeners.push(listener);
  return () => {
    const index = alertListeners.indexOf(listener);
    if (index !== -1) {
      alertListeners.splice(index, 1);
    }
  };
};

// Alias for unregistering listener to maintain compatibility
export const unregisterAlertListener = (listener: Function) => {
  const index = alertListeners.indexOf(listener);
  if (index !== -1) {
    alertListeners.splice(index, 1);
  }
};

// Notify all listeners about a new alert
export const notifyAlertListeners = (alert: ContentAlert) => {
  alertListeners.forEach(listener => listener(alert));
};

// Types for scan parameters
export interface ScanParameters {
  platforms?: string[];
  keywords?: string[];
  timeframe?: 'day' | 'week' | 'month';
  intensity?: 'low' | 'medium' | 'high';
  threatTypes?: string[];
  keywordFilters?: string[];
  prioritizeSeverity?: boolean;
  maxResults?: number;
  includeCustomerEnquiries?: boolean;
}

// Default scan parameters
export const defaultScanParameters: ScanParameters = {
  platforms: [],
  keywords: [],
  timeframe: 'day',
  intensity: 'medium',
  threatTypes: [],
  keywordFilters: [],
  prioritizeSeverity: true,
  maxResults: 10,
  includeCustomerEnquiries: true
};

// Platforms to scan
const availablePlatforms = [
  'Twitter', 'Reddit', 'Facebook', 'Instagram', 
  'TikTok', 'YouTube', 'News Sites', 'Forums',
  'Telegram', 'Dark Web Marketplaces', 'Private IRC Channels'
];

// Keywords for the scan
const defaultKeywords = [
  'company name', 'brand', 'product', 'service',
  'CEO name', 'executives', 'scandal', 'lawsuit',
  'controversy', 'review', 'complaint', 'problem'
];

// Generate threat type based on content
const getThreatType = () => {
  const types = [
    'falseReviews', 'coordinatedAttack', 'misinformation', 
    'viralThreat', 'competitorSmear', 'dataBreach', 'securityVulnerability'
  ];
  return types[Math.floor(Math.random() * types.length)];
};

// Generate real-looking content
const generateContent = (platform: string) => {
  const contentTemplates = [
    "This company has terrible customer service. I waited for hours and no one helped me. #awful #scam",
    "Just discovered that [COMPANY] is using unethical practices for their products. Sharing this so everyone knows!",
    "Avoid [BRAND] at all costs! Their quality has gone downhill and they refuse to address customer concerns.",
    "Has anyone else had issues with [COMPANY]'s latest product? Mine broke after just two days...",
    "I'm organizing a boycott of [BRAND] due to their recent political statements. RT to spread the word!",
    "Found evidence that [COMPANY] is buying fake reviews to boost their ratings. Here are screenshots:",
    "PSA: [BRAND]'s database was compromised yesterday. If you have an account, change your password immediately.",
    "My experience with [COMPANY] was the worst. They charged me twice and refuse to refund the duplicate charge.",
    "New report shows [BRAND] products contain harmful chemicals not listed on the label. Be careful!",
    "I've discovered [COMPANY] employees sharing customer data on this forum. Major privacy breach.",
    "Coordinated campaign planned against [BRAND] starting tomorrow. Looking for participants.",
    "Critical security vulnerability discovered in [COMPANY]'s web application. Customer data at risk."
  ];
  
  const randomContent = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
  return randomContent.replace('[COMPANY]', 'Company').replace('[BRAND]', 'Brand');
};

// Simulate scanning for content
export const performLiveScan = async (params?: ScanParameters): Promise<ContentAlert[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
  
  const results: ContentAlert[] = [];
  const scanIntensity = params?.intensity || 'medium';
  
  // Determine number of results based on scan intensity
  const resultCount = scanIntensity === 'high' ? 
    5 + Math.floor(Math.random() * 5) : 
    scanIntensity === 'medium' ? 
    3 + Math.floor(Math.random() * 3) : 
    1 + Math.floor(Math.random() * 2);
  
  // Get platforms to scan
  const platformsToScan = params?.platforms && params.platforms.length > 0 ? 
    params.platforms : 
    availablePlatforms;
  
  // Generate results
  for (let i = 0; i < resultCount; i++) {
    const platform = platformsToScan[Math.floor(Math.random() * platformsToScan.length)];
    const isHighSeverity = Math.random() > 0.7;
    const isMediumSeverity = !isHighSeverity && Math.random() > 0.5;
    
    const result: ContentAlert = {
      id: `scan-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      platform,
      content: generateContent(platform),
      date: 'Just now',
      severity: isHighSeverity ? 'high' : (isMediumSeverity ? 'medium' : 'low'),
      status: 'new',
      threatType: getThreatType()
    };
    
    results.push(result);
    
    // Notify listeners about high severity threats
    if (isHighSeverity) {
      notifyAlertListeners(result);
    }
  }
  
  return results;
};

// Function to start continuous monitoring
export const startContinuousMonitoring = (callback: (alerts: ContentAlert[]) => void) => {
  let isActive = true;
  
  const checkForAlerts = async () => {
    if (!isActive) return;
    
    // Random chance to find new alerts
    if (Math.random() > 0.6) {
      const results = await performLiveScan({
        intensity: 'low',
        timeframe: 'day'
      });
      
      if (results.length > 0 && callback) {
        callback(results);
      }
    }
    
    // Schedule next check
    const nextInterval = 30000 + Math.floor(Math.random() * 30000); // 30-60 seconds
    setTimeout(checkForAlerts, nextInterval);
  };
  
  // Start initial check
  checkForAlerts();
  
  // Return function to stop monitoring
  return () => {
    isActive = false;
  };
};

// Additional function to support AiScrapingDashboard component
export const startContinuousScan = (callback: (alerts: ContentAlert[]) => void) => {
  return startContinuousMonitoring(callback);
};

// Get current monitoring status
export const getMonitoringStatus = () => {
  // In a real app, this would be persisted in a database or state management
  return {
    isActive: true,
    platforms: availablePlatforms.length,
    keywords: defaultKeywords.length,
    lastActiveTime: new Date().toISOString(),
    threatModelsActive: ['Brand Reputation', 'Data Security', 'Competition Analysis']
  };
};
