
import { useState, useEffect } from "react";
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";

export const useAlertSimulation = (initialAlerts: ContentAlert[] = []) => {
  const [activeAlerts, setActiveAlerts] = useState<ContentAlert[]>(initialAlerts);
  
  useEffect(() => {
    // Create a notification sound
    const notificationSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
    
    // Function to add a new alert
    const addNewAlert = () => {
      // Only add alerts sometimes (30% chance)
      if (Math.random() > 0.7) {
        const severities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        
        const platforms = ['Twitter', 'Reddit', 'Google News', 'Review Site'];
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        
        const contents = [
          "Just had a terrible experience with their customer service.",
          "This company's ethics are questionable. Here's what they don't tell you...",
          "Disappointed in the quality of their product. Not worth the price.",
          "Warning: Their policies have changed. Read before you purchase!",
          "Anyone else having issues with their app? It's been down for hours."
        ];
        const content = contents[Math.floor(Math.random() * contents.length)];
        
        const newAlert: ContentAlert = {
          id: `rt-${Date.now()}`,
          platform,
          content,
          date: 'Just now',
          severity,
          status: 'new'
        };
        
        setActiveAlerts(prev => [newAlert, ...prev].slice(0, 10)); // Keep max 10 alerts
        
        // Play notification sound for high severity alerts
        if (severity === 'high') {
          notificationSound.play().catch(e => console.error("Error playing notification:", e));
        }
        
        // Show toast for high severity alerts
        if (severity === 'high') {
          toast.warning(`New high priority alert from ${platform}`, {
            description: content.length > 60 ? content.substring(0, 60) + '...' : content
          });
        }
      }
    };
    
    // Set up interval for new alerts (every 30-60 seconds)
    const interval = setInterval(addNewAlert, Math.random() * 30000 + 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    activeAlerts,
    setActiveAlerts
  };
};
