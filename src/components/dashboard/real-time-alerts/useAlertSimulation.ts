
import { useState, useEffect } from 'react';
import { ContentAlert } from '@/types/dashboard';
import { playNotificationSound } from '@/utils/notificationSound';
import { useWebSocket } from '@/services/websocket/websocketService';

interface UseAlertSimulationResult {
  activeAlerts: ContentAlert[];
  setActiveAlerts: React.Dispatch<React.SetStateAction<ContentAlert[]>>;
  addAlert: (alert: ContentAlert) => void;
  removeAlert: (alertId: string) => void;
  markAsRead: (alertId: string) => void;
  respondToAlert: (alertId: string) => void;
}

// Sample platforms for generating random alerts
const PLATFORMS = ['Twitter', 'Reddit', 'News Article', 'Review Site', 'LinkedIn', 'TikTok', 'Facebook', 'Blog'];
const SEVERITY = ['high', 'medium', 'low'] as const;

export const useAlertSimulation = (initialAlerts: ContentAlert[] = []): UseAlertSimulationResult => {
  const [activeAlerts, setActiveAlerts] = useState<ContentAlert[]>(initialAlerts);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  
  // Connect to WebSocket for real-time updates if available
  const { status: wsStatus, lastMessage } = useWebSocket();
  
  // Function to generate a random alert
  const generateRandomAlert = (): ContentAlert => {
    const id = Math.random().toString(36).substring(2, 11);
    const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
    const severity = SEVERITY[Math.floor(Math.random() * SEVERITY.length)];
    const currentDate = new Date().toISOString();
    const isCustomerEnquiry = Math.random() > 0.8; // 20% chance of being a customer enquiry
    
    return {
      id,
      platform,
      content: isCustomerEnquiry 
        ? `Customer asking about your products/services on ${platform}. Requires response.`
        : `New mention on ${platform} about your brand. This might require your attention.`,
      date: currentDate,
      severity,
      status: 'new',
      url: `/dashboard/engagement?alert=${id}`,
      category: isCustomerEnquiry ? 'customer_enquiry' : undefined
    };
  };
  
  // Add a new alert
  const addAlert = (alert: ContentAlert) => {
    setActiveAlerts(prev => [alert, ...prev]);
    // Play the appropriate notification sound
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
  
  // Respond to an alert (navigate to the engagement hub)
  const respondToAlert = (alertId: string) => {
    // Mark as actioned and prepare to respond
    setActiveAlerts(prev => 
      prev.map(alert => alert.id === alertId ? {...alert, status: 'actioned'} : alert)
    );
    
    // In a real app, you might want to do more here like:
    // - Track that someone is responding
    // - Update database status
    // - Log action history
    
    // Navigate programmatically in the component that uses this hook
  };
  
  // Process incoming WebSocket messages if available
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'alert') {
      const newAlert = lastMessage.data as ContentAlert;
      addAlert(newAlert);
    }
  }, [lastMessage]);
  
  // Start/stop simulation on mount/unmount
  useEffect(() => {
    // Only run simulation if we don't have a real websocket connection
    if (wsStatus !== 'connected') {
      setSimulationRunning(true);
    }
    return () => setSimulationRunning(false);
  }, [wsStatus]);
  
  // Periodically add new alerts if simulation is running
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
    respondToAlert
  };
};
