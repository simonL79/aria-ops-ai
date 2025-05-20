
import { toast } from "sonner";
import { ContentAlert } from "@/types/dashboard";

export interface ScanParameters {
  platforms?: string[];
  keywords?: string[];
  timeframe?: "day" | "week" | "month";
  intensity?: "low" | "medium" | "high";
  threatTypes?: string[];
  keywordFilters?: string[];
  maxResults?: number;
  includeCustomerEnquiries?: boolean;
  prioritizeSeverity?: "low" | "medium" | "high"; // Changed from boolean to string
}

// Sample platforms data
const availablePlatforms = [
  "Twitter", "Facebook", "Reddit", "News Sites", 
  "Instagram", "TikTok", "YouTube", "Blogs", 
  "Forums", "Review Sites", "LinkedIn", "Dark Web"
];

let activeScanTimeout: number | null = null;
let alertListeners: ((alert: ContentAlert) => void)[] = [];

/**
 * Get monitoring status including platform count
 */
export const getMonitoringStatus = () => {
  return {
    isActive: true,
    lastRun: new Date().toISOString(),
    nextRun: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    platforms: Math.floor(8 + Math.random() * 4), // 8-12 platforms
    threats: Math.floor(3 + Math.random() * 5) // 3-8 threats
  };
};

/**
 * Register listener for real-time alerts
 */
export const registerAlertListener = (callback: (alert: ContentAlert) => void): (() => void) => {
  alertListeners.push(callback);
  
  // Return cleanup function
  return () => {
    alertListeners = alertListeners.filter(cb => cb !== callback);
  };
};

/**
 * Perform a live scan with optional parameters
 */
export const performLiveScan = async (params?: ScanParameters): Promise<ContentAlert[]> => {
  // Log scan start with parameters
  console.log("Starting AI scan with parameters:", params || "default");
  
  // Show scanning toast
  toast.loading("AI scanning in progress", {
    description: "Analyzing content across multiple platforms..."
  });
  
  // Simulate network delay based on intensity
  const intensity = params?.intensity || "medium";
  const delayMap = { low: 1000, medium: 2500, high: 4000 };
  await new Promise(resolve => setTimeout(resolve, delayMap[intensity]));
  
  // Generate results
  const resultCount = params?.maxResults || Math.floor(Math.random() * 5) + 2;
  
  // Create mock results
  const results: ContentAlert[] = [];
  
  // Use platforms from params or randomly select from available
  const platforms = params?.platforms || availablePlatforms;
  
  for (let i = 0; i < resultCount; i++) {
    const platformIndex = Math.floor(Math.random() * platforms.length);
    const platform = platforms[platformIndex] || "Twitter";
    
    // Generate content with keywords if provided
    let content = generateRandomContent(platform, params?.keywords);
    
    // Determine severity, potentially influenced by prioritizeSeverity
    let severity: 'low' | 'medium' | 'high';
    if (params?.prioritizeSeverity) {
      // 70% chance to use the prioritized severity, 30% random
      severity = Math.random() > 0.3 ? params.prioritizeSeverity : ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high';
    } else {
      // Default distribution: 15% high, 35% medium, 50% low
      const rand = Math.random();
      severity = rand < 0.15 ? 'high' : rand < 0.5 ? 'medium' : 'low';
    }
    
    // Generate threat type
    const threatTypes = [
      "Brand Attack", "Misinformation", "Viral Complaint", 
      "Compliance Risk", "Data Leak", "Competitive Threat"
    ];
    const threatType = params?.threatTypes?.[Math.floor(Math.random() * params.threatTypes.length)] || 
                       threatTypes[Math.floor(Math.random() * threatTypes.length)];
    
    results.push({
      id: `scan-${Date.now()}-${i}`,
      platform,
      content,
      date: new Date().toISOString().split('T')[0],
      severity,
      status: 'new',
      threatType,
      url: `https://example.com/${platform.toLowerCase()}/post/${Date.now() + i}`
    });
  }
  
  // Dismiss scanning toast
  toast.dismiss();
  
  // Show completion toast
  toast.success(`AI scan complete`, {
    description: `Found ${results.length} relevant mentions.`
  });
  
  return results;
};

/**
 * Start continuous monitoring with callback for updates
 */
export const startContinuousMonitoring = (callback: (alerts: ContentAlert[]) => void): (() => void) => {
  // Clear any existing monitoring
  if (activeScanTimeout !== null) {
    window.clearTimeout(activeScanTimeout);
  }
  
  // Create monitoring function
  const runMonitoring = () => {
    // Randomly determine if we found something (1 in 3 chance)
    const foundSomething = Math.random() < 0.3;
    
    if (foundSomething) {
      // Generate 1-2 alerts
      const alertCount = Math.floor(Math.random() * 2) + 1;
      const alerts = [];
      
      for (let i = 0; i < alertCount; i++) {
        const platformIndex = Math.floor(Math.random() * availablePlatforms.length);
        const platform = availablePlatforms[platformIndex];
        const content = generateRandomContent(platform);
        const severity = Math.random() < 0.3 ? 'high' : Math.random() < 0.7 ? 'medium' : 'low';
        
        const alert: ContentAlert = {
          id: `monitor-${Date.now()}-${i}`,
          platform,
          content,
          date: new Date().toISOString().split('T')[0],
          severity: severity as 'low' | 'medium' | 'high',
          status: 'new',
          url: `https://example.com/${platform.toLowerCase()}/post/${Date.now() + i}`,
          threatType: Math.random() < 0.5 ? "Brand Attack" : "Misinformation"
        };
        
        alerts.push(alert);
        
        // Also notify any listeners
        alertListeners.forEach(listener => listener(alert));
      }
      
      // Call the callback with alerts
      if (alerts.length > 0) {
        callback(alerts);
      }
    }
    
    // Schedule next run (between 30-90 seconds)
    const nextInterval = 30000 + Math.floor(Math.random() * 60000);
    activeScanTimeout = window.setTimeout(runMonitoring, nextInterval);
  };
  
  // Start the first run
  activeScanTimeout = window.setTimeout(runMonitoring, 20000);
  
  // Return cleanup function
  return () => {
    if (activeScanTimeout !== null) {
      window.clearTimeout(activeScanTimeout);
      activeScanTimeout = null;
    }
  };
};

// Helper function to generate random content
const generateRandomContent = (platform: string, keywords?: string[]): string => {
  const templates = [
    "Just saw something about {brand} on {platform}. They're saying {keyword}.",
    "Someone on {platform} is claiming that {brand} {keyword}. This could be concerning.",
    "{platform} user posted negative content about {brand}, saying they {keyword}.",
    "There's a trending post on {platform} about {brand} that mentions {keyword}.",
    "New {platform} post says {brand} is involved with {keyword}. Worth checking out.",
    "Potential issue for {brand} spotted on {platform}: {keyword}.",
    "A {platform} user with large following posted that {brand} {keyword}."
  ];
  
  const brands = ["YourBrand", "BrandX", "TechCorp", "EcoProducts"];
  const defaultKeywords = [
    "has poor customer service",
    "uses unethical practices",
    "is misleading customers",
    "has quality issues",
    "is being unfair",
    "is facing legal issues",
    "has security problems"
  ];
  
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const keywordsToUse = keywords && keywords.length > 0 ? keywords : defaultKeywords;
  const keyword = keywordsToUse[Math.floor(Math.random() * keywordsToUse.length)];
  
  const templateIndex = Math.floor(Math.random() * templates.length);
  return templates[templateIndex]
    .replace("{brand}", brand)
    .replace("{platform}", platform)
    .replace("{keyword}", keyword);
};
