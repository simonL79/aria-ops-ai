
import { useEffect } from 'react';
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";

export const useNotifications = (
  activeAlerts: ContentAlert[], 
  notificationsEnabled: boolean,
  onViewDetail?: (alert: ContentAlert) => void,
  onRespond?: (alertId: string) => void
) => {
  
  // Enhanced function to extract entity information
  const extractEntityInfo = (alert: ContentAlert) => {
    let entityText = "";
    let companyInfo = "";
    let socialTags = "";
    
    // Extract detected entities (names, companies)
    if (alert.detectedEntities && alert.detectedEntities.length > 0) {
      const entities = alert.detectedEntities;
      const companies = entities.filter(entity => 
        entity.includes('Inc') || entity.includes('Corp') || entity.includes('LLC') || 
        entity.includes('Ltd') || entity.includes('Company') || entity.includes('Group')
      );
      const people = entities.filter(entity => 
        /^[A-Z][a-z]+\s+[A-Z][a-z]+/.test(entity) && !companies.includes(entity)
      );
      
      if (people.length > 0) {
        entityText = `👤 ${people[0]}${people.length > 1 ? ` +${people.length - 1} others` : ''}`;
      }
      
      if (companies.length > 0) {
        companyInfo = `🏢 ${companies[0]}${companies.length > 1 ? ` +${companies.length - 1} companies` : ''}`;
      }
    }
    
    // Extract social handles and tags from content
    const handles = alert.content.match(/@[\w\d_]{2,}/g) || [];
    const hashtags = alert.content.match(/#[\w\d_]+/g) || [];
    
    if (handles.length > 0 || hashtags.length > 0) {
      const tags = [...handles.slice(0, 2), ...hashtags.slice(0, 2)];
      if (tags.length > 0) {
        socialTags = `🏷️ ${tags.join(' ')}${(handles.length + hashtags.length) > 2 ? '...' : ''}`;
      }
    }
    
    return { entityText, companyInfo, socialTags };
  };

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
      const { entityText, companyInfo, socialTags } = extractEntityInfo(latestAlert);
      
      // Build rich description with entity information
      let description = latestAlert.content.length > 60 ? 
        `${latestAlert.content.substring(0, 60)}...` : 
        latestAlert.content;
      
      // Add entity information to description
      const entityInfo = [entityText, companyInfo, socialTags].filter(Boolean);
      if (entityInfo.length > 0) {
        description += `\n\n${entityInfo.join(' • ')}`;
      }
      
      // Add recommendation if available
      if (latestAlert.recommendation) {
        description += `\n\n💡 ${latestAlert.recommendation.substring(0, 80)}...`;
      }
      
      // Add potential reach if available
      if (latestAlert.potentialReach) {
        description += `\n📊 Potential reach: ${latestAlert.potentialReach.toLocaleString()}`;
      }
      
      // Play notification sound if browser supports it
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play prevented by browser policy:', e));
      } catch (err) {
        console.log('Audio notification not supported');
      }
      
      // Show toast with enhanced information
      if (latestAlert.category === 'customer_enquiry') {
        toast.info(`👤 CUSTOMER ENQUIRY: ${latestAlert.platform}`, {
          description,
          duration: 12000, // 12 seconds for more complex info
          action: {
            label: "Respond",
            onClick: () => onRespond?.(latestAlert.id),
          }
        });
      } else {
        toast.error(`🚨 HIGH RISK ALERT: ${latestAlert.platform}`, {
          description,
          duration: 12000, // 12 seconds for more complex info
          action: {
            label: "View Details",
            onClick: () => onViewDetail?.(latestAlert),
          }
        });
      }
      
      // Enhanced browser notification with entity info
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          const title = latestAlert.category === 'customer_enquiry' ? 
            "ARIA - Customer Enquiry" : 
            "ARIA - High Risk Alert";
          
          let body = `${latestAlert.platform}: ${latestAlert.content.substring(0, 80)}...`;
          if (entityText || companyInfo) {
            body += `\n${[entityText, companyInfo].filter(Boolean).join(' • ')}`;
          }
          
          new Notification(title, {
            body,
            icon: "/favicon.ico",
            tag: latestAlert.id // Prevent duplicate notifications
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission();
        }
      }
    }
  }, [activeAlerts, notificationsEnabled, onViewDetail, onRespond]);
};
