
import { useEffect } from 'react';
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";

export const useNotifications = (
  activeAlerts: ContentAlert[], 
  notificationsEnabled: boolean,
  onViewDetail?: (alert: ContentAlert) => void,
  onRespond?: (alertId: string) => void
) => {
  
  // High priority notification system
  useEffect(() => {
    if (!notificationsEnabled) return;
    
    // Check if there's a new high severity alert or customer enquiry
    const highPriorityAlerts = activeAlerts.filter(
      alert => (alert.severity === 'high' || alert.category === 'customer_enquiry') && alert.status === 'new'
    );
    
    if (highPriorityAlerts.length > 0) {
      // Get most recent high priority alert
      const latestAlert = highPriorityAlerts[0];
      
      // Try to identify targets
      let targetText = "";
      if (latestAlert.detectedEntities && latestAlert.detectedEntities.length > 0) {
        targetText = ` • Targeting: ${latestAlert.detectedEntities[0]}${latestAlert.detectedEntities.length > 1 ? ' & others' : ''}`;
      } else {
        const properNouns = latestAlert.content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
        if (properNouns && properNouns.length > 0) {
          targetText = ` • Potential target: ${properNouns[0]}`;
        }
      }
      
      // Play notification sound if browser supports it
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play prevented by browser policy:', e));
      } catch (err) {
        console.log('Audio notification not supported');
      }
      
      // Show toast with different styling based on if it's a customer enquiry or high alert
      if (latestAlert.category === 'customer_enquiry') {
        toast.info(`👤 CUSTOMER ENQUIRY: ${latestAlert.platform}`, {
          description: `${latestAlert.content.length > 60 ? 
            `${latestAlert.content.substring(0, 60)}...` : 
            latestAlert.content}${targetText}`,
          duration: 10000, // 10 seconds
          action: {
            label: "Respond",
            onClick: () => onRespond?.(latestAlert.id),
          }
        });
      } else {
        toast.error(`🚨 HIGH RISK ALERT: ${latestAlert.platform}`, {
          description: `${latestAlert.content.length > 60 ? 
            `${latestAlert.content.substring(0, 60)}...` : 
            latestAlert.content}${targetText}${latestAlert.recommendation ? 
            `\n\nRecommendation: ${latestAlert.recommendation.substring(0, 80)}...` : ''}`,
          duration: 10000, // 10 seconds
          action: {
            label: "View Now",
            onClick: () => onViewDetail?.(latestAlert),
          }
        });
      }
      
      // If browser supports notifications API, send browser notification too
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(latestAlert.category === 'customer_enquiry' ? 
            "Customer Enquiry" : 
            "ARIA - High Risk Alert", {
            body: `${latestAlert.platform}: ${latestAlert.content.substring(0, 100)}...${targetText}`,
            icon: "/favicon.ico"
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission();
        }
      }
    }
  }, [activeAlerts, notificationsEnabled, onViewDetail, onRespond]);
};
