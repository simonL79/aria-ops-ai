
import { ScanParameters } from '@/types/aiScraping';
import { ContentAlert } from '@/types/dashboard';

// Default scan parameters
export const defaultScanParameters: ScanParameters = {
  platforms: [],
  keywords: [],
  timeframe: "day",
  intensity: "medium",
  threatTypes: [],
  keywordFilters: [],
  maxResults: 3,
  includeCustomerEnquiries: true,
  prioritizeSeverity: "high"
};

// Store for alert listeners
const alertListeners: Array<(alert: ContentAlert) => void> = [];
const continuousListeners: Array<(alerts: ContentAlert[]) => void> = [];

/**
 * Register a function to be called when a new alert is detected
 */
export const registerAlertListener = (
  callback: (alert: ContentAlert) => void
): (() => void) => {
  alertListeners.push(callback);
  
  // Return unregister function
  return () => {
    const index = alertListeners.indexOf(callback);
    if (index > -1) {
      alertListeners.splice(index, 1);
    }
  };
};

/**
 * Unregister an alert listener
 */
export const unregisterAlertListener = (
  callback: (alert: ContentAlert) => void
): void => {
  const index = alertListeners.indexOf(callback);
  if (index > -1) {
    alertListeners.splice(index, 1);
  }
};

/**
 * Notify all registered listeners about a new alert
 */
export const notifyAlertListeners = (alert: ContentAlert): void => {
  alertListeners.forEach(listener => {
    try {
      listener(alert);
    } catch (err) {
      console.error('Error in alert listener:', err);
    }
  });
};

/**
 * Start continuous monitoring and notify listeners periodically
 */
export const startContinuousMonitoring = (
  callback: (alerts: ContentAlert[]) => void
): (() => void) => {
  continuousListeners.push(callback);
  
  // Set up interval for continuous monitoring
  const intervalId = setInterval(() => {
    // Only generate alerts occasionally (1 in 3 chance)
    if (Math.random() > 0.7) {
      const alertCount = Math.floor(Math.random() * 2) + 1; // 1-2 alerts
      const newAlerts: ContentAlert[] = [];
      
      for (let i = 0; i < alertCount; i++) {
        const alert: ContentAlert = {
          id: `alert-${Date.now()}-${i}`,
          platform: ['Twitter', 'Reddit', 'News Sites', 'Facebook'][Math.floor(Math.random() * 4)],
          content: `Live monitoring detected a new mention with potential reputation impact.`,
          date: new Date().toISOString().split('T')[0],
          severity: Math.random() > 0.7 ? 'high' : (Math.random() > 0.5 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
          status: 'new',
          url: `https://example.com/live-alert-${Date.now()}-${i}`,
          threatType: ['Reputation Risk', 'Customer Service', 'Product Issue'][Math.floor(Math.random() * 3)]
        };
        
        newAlerts.push(alert);
        
        // Also notify individual alert listeners
        notifyAlertListeners(alert);
      }
      
      // Notify continuous listeners with batch of alerts
      if (newAlerts.length > 0) {
        continuousListeners.forEach(listener => {
          try {
            listener(newAlerts);
          } catch (err) {
            console.error('Error in continuous listener:', err);
          }
        });
      }
    }
  }, 45000); // Check every 45 seconds
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    const index = continuousListeners.indexOf(callback);
    if (index > -1) {
      continuousListeners.splice(index, 1);
    }
  };
};

/**
 * Perform a live scan with the given parameters
 */
export const performLiveScan = async (
  params: ScanParameters = defaultScanParameters
): Promise<ContentAlert[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
  
  // Determine number of results to generate
  const resultCount = params.maxResults || 3;
  
  // Generate results based on parameters
  const results: ContentAlert[] = [];
  
  for (let i = 0; i < resultCount; i++) {
    // Determine if we should generate a high-priority result based on params
    let forcedSeverity: 'high' | 'medium' | 'low' | undefined = undefined;
    
    if (params.prioritizeSeverity) {
      if (Math.random() > 0.3) {
        forcedSeverity = params.prioritizeSeverity;
      }
    }
    
    // Select platform based on params or random if not specified
    const platform = params.platforms && params.platforms.length > 0
      ? params.platforms[Math.floor(Math.random() * params.platforms.length)]
      : ['Twitter', 'Reddit', 'News Sites', 'Facebook', 'TikTok', 'LinkedIn', 'Review Site'][Math.floor(Math.random() * 7)];
    
    // Generate alert
    const alert: ContentAlert = {
      id: `alert-${Date.now()}-${i}`,
      platform,
      content: generateContent(platform, params.keywordFilters),
      date: new Date().toISOString().split('T')[0],
      severity: forcedSeverity || (['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low'),
      status: 'new',
      url: `https://example.com/platform-${platform.toLowerCase().replace(/\s+/g, '-')}/alert-${i}`,
      threatType: params.threatTypes && params.threatTypes.length > 0
        ? params.threatTypes[Math.floor(Math.random() * params.threatTypes.length)]
        : ['Reputation Risk', 'Customer Service', 'Product Issue', 'Executive Mention', 'Competitive Intelligence'][Math.floor(Math.random() * 5)]
    };
    
    results.push(alert);
    
    // Also notify registered listeners
    notifyAlertListeners(alert);
  }
  
  return results;
};

// Helper function to generate content
const generateContent = (platform: string, keywords?: string[]): string => {
  const contentTemplates = [
    "Just heard about {brand}. Their product seems interesting.",
    "Has anyone tried {brand} products? Thinking of buying one.",
    "I'm not happy with my experience with {brand}. Customer service was terrible.",
    "Love the new release from {brand}! Definitely recommend it.",
    "Saw an ad for {brand} today. Looks promising but not sure yet.",
    "{brand} is getting a lot of negative press lately. Anyone know what's happening?",
    "The CEO of {brand} just made an interesting announcement about their future plans.",
    "Compared {brand} with their competitors, and honestly, they're falling behind."
  ];
  
  const brandNames = ["YourBrand", "RepShield", "TechGiant", "EcoFriendly"];
  let randomBrand = brandNames[Math.floor(Math.random() * brandNames.length)];
  
  // If we have keywords, use one of them occasionally
  if (keywords && keywords.length > 0 && Math.random() > 0.5) {
    randomBrand = keywords[Math.floor(Math.random() * keywords.length)];
  }
  
  const templateIndex = Math.floor(Math.random() * contentTemplates.length);
  let content = contentTemplates[templateIndex].replace("{brand}", randomBrand);
  
  // Add platform-specific formatting
  switch (platform) {
    case 'Twitter':
      content = `${content} #${randomBrand.replace(/\s+/g, '')} #technology`;
      break;
    case 'Reddit':
      content = `r/tech: ${content}\n\nWhat do you guys think? Has anyone had similar experiences?`;
      break;
    case 'News Sites':
      content = `BREAKING: ${content} Industry analysts predict this could impact their market position.`;
      break;
    case 'Review Site':
      const rating = Math.floor(Math.random() * 5) + 1;
      content = `★★★★☆ (${rating}/5): ${content}`;
      break;
    default:
      // No specific formatting needed
      break;
  }
  
  return content;
};
