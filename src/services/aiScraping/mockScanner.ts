
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";
import { fetchContent } from "@/services/dataIngestion/contentFetcher";

// Define platforms for real-time monitoring
const availablePlatforms = [
  'Twitter', 'Reddit', 'News Article', 'Review Site', 
  'LinkedIn', 'TikTok', 'YouTube', 'Facebook', 'Blog'
];

// Scan parameter types
export interface ScanParameters {
  platforms?: string[];
  keywordFilters?: string[];
  prioritizeSeverity?: 'high' | 'medium' | 'low' | null;
  includeCustomerEnquiries?: boolean;
  maxResults?: number;
}

// Default scan parameters
export const defaultScanParameters: ScanParameters = {
  platforms: [],
  keywordFilters: [],
  prioritizeSeverity: null,
  includeCustomerEnquiries: true,
  maxResults: 5
};

// Global array to store all active alert listeners
const alertListeners: Array<(alert: ContentAlert) => void> = [];

// Register a listener for new alerts
export const registerAlertListener = (listener: (alert: ContentAlert) => void): void => {
  alertListeners.push(listener);
};

// Unregister a listener
export const unregisterAlertListener = (listener: (alert: ContentAlert) => void): void => {
  const index = alertListeners.indexOf(listener);
  if (index !== -1) {
    alertListeners.splice(index, 1);
  }
};

// Notify all registered listeners about a new alert
export const notifyAlertListeners = (alert: ContentAlert): void => {
  alertListeners.forEach(listener => listener(alert));
};

// Handle direct response from notification
export const respondToAlert = (alert: ContentAlert): void => {
  window.location.href = `/dashboard/engagement?alert=${alert.id}`;
};

// Process content fetched from real sources into ContentAlert format
const processContentToAlerts = (contents: any[], params?: ScanParameters): ContentAlert[] => {
  const p = params || defaultScanParameters;
  const alerts: ContentAlert[] = [];

  for (const item of contents) {
    // Determine if this is a customer enquiry based on content analysis
    const contentLower = item.content.toLowerCase();
    const isCustomerEnquiry = p.includeCustomerEnquiries && (
      contentLower.includes('help') || 
      contentLower.includes('?') || 
      contentLower.includes('how do i') ||
      contentLower.includes('contact') ||
      contentLower.includes('support') ||
      contentLower.includes('service')
    );

    // Skip customer enquiries if not including them
    if (isCustomerEnquiry && !p.includeCustomerEnquiries) {
      continue;
    }

    // Apply keyword filters if provided
    if (p.keywordFilters && p.keywordFilters.length > 0) {
      const matchesKeyword = p.keywordFilters.some(keyword => 
        contentLower.includes(keyword.toLowerCase())
      );

      if (!matchesKeyword) {
        continue;
      }
    }

    // Determine severity based on content sentiment analysis
    let severity: 'high' | 'medium' | 'low';
    
    if (p.prioritizeSeverity) {
      // Bias toward requested severity while maintaining some variation
      severity = Math.random() < 0.7 ? p.prioritizeSeverity : 
        (['high', 'medium', 'low'] as const).filter(s => s !== p.prioritizeSeverity)[
          Math.floor(Math.random() * 2)
        ];
    } else {
      // Analyze content to determine severity
      if (contentLower.includes('urgent') || 
          contentLower.includes('terrible') || 
          contentLower.includes('worst') ||
          contentLower.includes('disappointed')) {
        severity = 'high';
      } else if (contentLower.includes('issue') || 
                contentLower.includes('problem') || 
                contentLower.includes('concerned')) {
        severity = 'medium';
      } else {
        severity = 'low';
      }
    }

    // Create alert from content
    alerts.push({
      id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      platform: item.platform || item.sourceName || 'Web',
      content: item.content,
      date: 'Just now',
      severity,
      status: 'new',
      category: isCustomerEnquiry ? 'customer_enquiry' : undefined
    });

    // Apply maximum results limit
    if (alerts.length >= (p.maxResults || 5)) {
      break;
    }
  }

  return alerts;
};

// Perform a live scan and return real data
export const performLiveScan = async (params?: ScanParameters): Promise<ContentAlert[]> => {
  const p = params || defaultScanParameters;
  
  try {
    // Convert scan parameters to ingestion options
    const ingestionOptions = {
      sources: p.platforms?.map(platform => platform.toLowerCase()) || [],
      keywords: p.keywordFilters || ['brand', 'company', 'product', 'service'],
      maxResults: p.maxResults || 5
    };
    
    // Fetch content from real sources
    const contents = await fetchContent(ingestionOptions);
    
    // Process content into alerts
    const alerts = processContentToAlerts(contents, p);
    
    // Notify listeners about these new alerts
    alerts.forEach(alert => {
      notifyAlertListeners(alert);
    });
    
    // Show toast notification
    toast.success(`Scan complete: ${alerts.length} new alerts detected`, {
      description: alerts.some(a => a.severity === 'high') ? 
        "High priority concerns detected, action recommended." : 
        "No critical issues detected."
    });
    
    return alerts;
  } catch (error) {
    console.error("Error performing live scan:", error);
    toast.error("Scan failed", {
      description: "Could not complete the scan. Please try again."
    });
    return [];
  }
};

// Start a continuous scan process
export const startContinuousScan = (
  onNewAlert: (alert: ContentAlert) => void,
  intervalMs = 60000, // Default 1 minute
  params?: ScanParameters
): () => void => {
  // Register the provided callback as a listener
  registerAlertListener(onNewAlert);
  
  const p = params || defaultScanParameters;
  
  // Run the first scan immediately
  setTimeout(async () => {
    try {
      const initialAlerts = await performLiveScan(p);
      initialAlerts.forEach(onNewAlert);
    } catch (error) {
      console.error("Initial scan error:", error);
    }
  }, 5000);
  
  // Set up interval for ongoing scans
  const interval = setInterval(async () => {
    try {
      // Run scan with 30% chance each interval
      if (Math.random() < 0.3) {
        const newAlerts = await performLiveScan(p);
        
        // Process each new alert
        for (const newAlert of newAlerts) {
          onNewAlert(newAlert);
          
          // For high severity or customer enquiries, show toast
          if (newAlert.severity === 'high' || newAlert.category === 'customer_enquiry') {
            const isCustomer = newAlert.category === 'customer_enquiry';
            
            toast[isCustomer ? 'info' : 'warning'](
              `New ${isCustomer ? 'customer enquiry' : 'high priority alert'} detected`,
              {
                description: newAlert.content.substring(0, 80) + (newAlert.content.length > 80 ? '...' : ''),
                action: {
                  label: isCustomer ? "Respond Now" : "View Details",
                  onClick: () => {
                    // Navigate to engagement hub with the alert ID
                    window.location.href = `/dashboard/engagement?alert=${newAlert.id}`;
                  },
                },
                duration: 10000 // 10 seconds
              }
            );
            
            // Play notification sound
            try {
              const audio = new Audio('/urgent-notification.mp3');
              audio.volume = 0.5;
              audio.play().catch(e => console.log('Audio play prevented by browser policy:', e));
            } catch (err) {
              console.log('Audio notification not supported');
            }
          }
        }
      }
    } catch (error) {
      console.error("Continuous scan error:", error);
    }
  }, intervalMs);
  
  // Return a function to stop the scanning and remove the listener
  return () => {
    clearInterval(interval);
    unregisterAlertListener(onNewAlert);
  };
};
