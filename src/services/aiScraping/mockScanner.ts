
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";

// Mock data for scanning results
const mockPlatforms = [
  'Twitter', 'Reddit', 'News Article', 'Review Site', 
  'LinkedIn', 'TikTok', 'YouTube', 'Facebook', 'Blog'
];

const mockContents = [
  "Just had a terrible experience with their customer service.",
  "This company's ethics are questionable. Here's what they don't tell you...",
  "Disappointed in the quality of their product. Not worth the price.",
  "Warning: Their policies have changed. Read before you purchase!",
  "Anyone else having issues with their app? It's been down for hours.",
  "Hello, I'm interested in your services. Could you provide more information?",
  "I've been trying to contact support for 3 days with no response. This is unacceptable.",
  "How do I request a refund for my recent purchase? Order #12345",
  "Do you offer discounts for bulk orders? We're looking to purchase for our entire team.",
  "I found your product through a friend's recommendation. What are your pricing options?"
];

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

// Generate a random mock alert
export const generateMockAlert = (): ContentAlert => {
  const isCustomerEnquiry = Math.random() < 0.3;
  const platform = mockPlatforms[Math.floor(Math.random() * mockPlatforms.length)];
  const content = mockContents[Math.floor(Math.random() * mockContents.length)];
  const severities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
  const severity = isCustomerEnquiry ? 
    (Math.random() < 0.2 ? 'high' : 'medium') : // Customer enquiries are often medium or high priority
    severities[Math.floor(Math.random() * severities.length)];
  
  return {
    id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    platform,
    content,
    date: 'Just now',
    severity,
    status: 'new',
    category: isCustomerEnquiry ? 'customer_enquiry' : undefined
  };
};

// Simulate a scan and return mock data
export const performLiveScan = async (): Promise<ContentAlert[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate between 1-3 alerts
  const count = Math.floor(Math.random() * 3) + 1;
  const alerts: ContentAlert[] = [];
  
  for (let i = 0; i < count; i++) {
    const alert = generateMockAlert();
    alerts.push(alert);
    // Notify all listeners about this new alert
    notifyAlertListeners(alert);
  }
  
  // Show toast notification
  toast.success(`Scan complete: ${alerts.length} new alerts detected`, {
    description: alerts.some(a => a.severity === 'high') ? 
      "High priority threats detected, immediate action recommended." : 
      "No critical threats detected."
  });
  
  return alerts;
};

// Start a continuous scan process
export const startContinuousScan = (
  onNewAlert: (alert: ContentAlert) => void,
  intervalMs = 30000 // Default 30 seconds
): () => void => {
  // Register the provided callback as a listener
  registerAlertListener(onNewAlert);
  
  // Immediately run the first scan
  setTimeout(async () => {
    const initialAlerts = await performLiveScan();
    initialAlerts.forEach(onNewAlert);
  }, 5000);
  
  // Set up interval for ongoing scans
  const interval = setInterval(async () => {
    // 40% chance of finding new alerts on each scan
    if (Math.random() < 0.4) {
      const newAlert = generateMockAlert();
      onNewAlert(newAlert);
      // Also notify all other registered listeners
      notifyAlertListeners(newAlert);
      
      // For high severity or customer enquiries, show toast
      if (newAlert.severity === 'high' || newAlert.category === 'customer_enquiry') {
        const isCustomer = newAlert.category === 'customer_enquiry';
        toast[isCustomer ? 'info' : 'warning'](
          `New ${isCustomer ? 'customer enquiry' : 'high priority alert'} detected`,
          {
            description: newAlert.content.substring(0, 80) + (newAlert.content.length > 80 ? '...' : '')
          }
        );
        
        // Try to play a notification sound
        try {
          const audio = new Audio('/notification-sound.mp3');
          audio.volume = 0.5;
          audio.play().catch(e => console.log('Audio play prevented by browser policy:', e));
        } catch (err) {
          console.log('Audio notification not supported');
        }
      }
    }
  }, intervalMs);
  
  // Return a function to stop the scanning and remove the listener
  return () => {
    clearInterval(interval);
    unregisterAlertListener(onNewAlert);
  };
};
