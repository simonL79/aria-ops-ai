
import { useState, useEffect } from 'react';
import { ContentAlert } from '@/types/dashboard';
import { playNotificationSound } from '@/utils/notificationSound';

interface UseAlertSimulationResult {
  activeAlerts: ContentAlert[];
  setActiveAlerts: React.Dispatch<React.SetStateAction<ContentAlert[]>>;
  addAlert: (alert: ContentAlert) => void;
  removeAlert: (alertId: string) => void;
  markAsRead: (alertId: string) => void;
}

// Sample platforms for generating random alerts
const PLATFORMS = ['Twitter', 'Reddit', 'News Article', 'Review Site', 'LinkedIn', 'TikTok', 'Facebook', 'Blog'];
const SEVERITY = ['high', 'medium', 'low'] as const;

export const useAlertSimulation = (initialAlerts: ContentAlert[] = []): UseAlertSimulationResult => {
  const [activeAlerts, setActiveAlerts] = useState<ContentAlert[]>(initialAlerts);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  
  // Function to generate a random alert
  const generateRandomAlert = (): ContentAlert => {
    const id = Math.random().toString(36).substring(2, 11);
    const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
    const severity = SEVERITY[Math.floor(Math.random() * SEVERITY.length)];
    const currentDate = new Date().toISOString();
    
    return {
      id,
      platform,
      content: `New mention on ${platform} about your brand. This might require your attention.`,
      date: currentDate, // Changed from 'timestamp' to 'date' to match the ContentAlert type
      severity,
      status: 'new', // Changed from 'unread' to 'new' to match the ContentAlert type
      url: `/dashboard/engagement?alert=${id}`
      // Removed the author property as it's not part of the ContentAlert type
    };
  };
  
  // Add a new alert
  const addAlert = (alert: ContentAlert) => {
    setActiveAlerts(prev => [alert, ...prev]);
    // Fixed by passing the correct string type instead of a boolean
    playNotificationSound(alert.severity === 'high' ? 'urgent' : 'alert');
  };
  
  // Remove an alert
  const removeAlert = (alertId: string) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };
  
  // Mark an alert as read
  const markAsRead = (alertId: string) => {
    setActiveAlerts(prev => 
      prev.map(alert => alert.id === alertId ? {...alert, status: 'read'} : alert)
    );
  };
  
  // Start/stop simulation on mount/unmount
  useEffect(() => {
    setSimulationRunning(true);
    return () => setSimulationRunning(false);
  }, []);
  
  // Periodically add new alerts
  useEffect(() => {
    if (!simulationRunning) return;
    
    const interval = setInterval(() => {
      // Only add a new alert 30% of the time
      if (Math.random() < 0.3) {
        addAlert(generateRandomAlert());
      }
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [simulationRunning]);
  
  return {
    activeAlerts,
    setActiveAlerts,
    addAlert,
    removeAlert,
    markAsRead,
  };
};
