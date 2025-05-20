
import { useState, useEffect } from "react";
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";
import { startContinuousScan, performLiveScan } from "@/services/aiScraping/mockScanner";

export const useAlertSimulation = (initialAlerts: ContentAlert[] = []) => {
  const [activeAlerts, setActiveAlerts] = useState<ContentAlert[]>(initialAlerts);
  
  useEffect(() => {
    // Initial scan for getting some data
    performLiveScan().then(newAlerts => {
      if (newAlerts.length > 0) {
        setActiveAlerts(prev => [...newAlerts, ...prev].slice(0, 10));
      }
    }).catch(err => {
      console.error("Error in initial scan:", err);
    });
    
    // Set up continuous scanning
    const stopScanning = startContinuousScan((newAlert) => {
      setActiveAlerts(prev => [newAlert, ...prev].slice(0, 10)); // Keep max 10 alerts
      
      // Play notification sound for high severity alerts and customer enquiries
      if (newAlert.severity === 'high' || newAlert.category === 'customer_enquiry') {
        try {
          const notificationSound = new Audio('/urgent-notification.mp3');
          notificationSound.play().catch(e => console.error("Error playing notification:", e));
        } catch (err) {
          console.error("Audio notification error:", err);
        }
        
        // Show toast for high severity alerts or customer enquiries
        if (newAlert.severity === 'high') {
          toast.warning(`New high priority alert from ${newAlert.platform}`, {
            description: newAlert.content.length > 60 ? newAlert.content.substring(0, 60) + '...' : newAlert.content,
            action: {
              label: "View & Respond",
              onClick: () => {
                window.location.href = `/dashboard/engagement?alert=${newAlert.id}`;
              }
            }
          });
        } else if (newAlert.category === 'customer_enquiry') {
          toast.info(`New customer enquiry from ${newAlert.platform}`, {
            description: newAlert.content.length > 60 ? newAlert.content.substring(0, 60) + '...' : newAlert.content,
            action: {
              label: "Respond",
              onClick: () => {
                window.location.href = `/dashboard/engagement?alert=${newAlert.id}`;
              }
            }
          });
        }
      }
    });
    
    return () => {
      stopScanning();
    };
  }, []);

  return {
    activeAlerts,
    setActiveAlerts
  };
};
