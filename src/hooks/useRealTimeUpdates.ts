
import { useState, useEffect } from 'react';
import { useWebSocket } from '@/services/websocket/websocketService';
import { ContentAlert } from '@/types/dashboard';
import { ThreatVector } from '@/types/intelligence';
import { toast } from 'sonner';

// URL for the WebSocket connection
// This would typically come from environment variables
const WS_URL = import.meta.env.VITE_WS_URL || 'wss://api.yourdomain.com/ws';

// Hook for handling real-time dashboard updates
export const useRealTimeUpdates = (enableWebSocket = true) => {
  const [realtimeAlerts, setRealtimeAlerts] = useState<ContentAlert[]>([]);
  const [threatVectors, setThreatVectors] = useState<ThreatVector[]>([]);
  const [reputationScore, setReputationScore] = useState<number | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Use our WebSocket connection
  const { status, lastMessage, sendMessage } = useWebSocket(enableWebSocket ? WS_URL : undefined);
  
  // Process incoming WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;
    
    switch (lastMessage.type) {
      case 'alert':
        const newAlert = lastMessage.data as ContentAlert;
        setRealtimeAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Keep last 50 alerts
        
        // Handle high-priority alerts with enhanced notifications
        if (notificationsEnabled && newAlert.severity === 'high') {
          // Play sound alert if browser supports audio
          try {
            const audio = new Audio('/notification-sound.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio play prevented by browser policy:', e));
          } catch (err) {
            console.log('Audio notification not supported');
          }
          
          // Show more prominent toast for high priority alerts
          toast.error(`🚨 HIGH RISK ALERT: ${newAlert.platform}`, {
            description: newAlert.content.length > 60 ? 
              `${newAlert.content.substring(0, 60)}...` : 
              newAlert.content,
            duration: 10000, // 10 seconds
          });
          
          // Send browser notification if supported and permitted
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("ARIA - High Risk Alert", {
              body: `${newAlert.platform}: ${newAlert.content.substring(0, 120)}...`,
              icon: "/favicon.ico"
            });
          }
        }
        break;
      case 'threat':
        const threatUpdate = lastMessage.data as ThreatVector;
        setThreatVectors(prev => {
          // Update existing threat vector or add new one
          const exists = prev.findIndex(t => t.type === threatUpdate.type) >= 0;
          if (exists) {
            return prev.map(t => t.type === threatUpdate.type ? threatUpdate : t);
          } else {
            return [...prev, threatUpdate].slice(0, 20); // Keep max 20 threat vectors
          }
        });
        break;
      case 'metric_update':
        if (lastMessage.data.reputationScore !== undefined) {
          setReputationScore(lastMessage.data.reputationScore);
        }
        break;
      default:
        // Ignore other message types
        break;
    }
  }, [lastMessage, notificationsEnabled]);
  
  // Function to subscribe to specific data updates
  const subscribeToUpdates = (topics: string[]) => {
    if (status === 'connected') {
      sendMessage('system', { action: 'subscribe', topics });
      return true;
    }
    return false;
  };
  
  // Function to unsubscribe from updates
  const unsubscribeFromUpdates = (topics: string[]) => {
    if (status === 'connected') {
      sendMessage('system', { action: 'unsubscribe', topics });
      return true;
    }
    return false;
  };
  
  // Function to toggle notifications
  const toggleNotifications = () => {
    // If enabling notifications and browser permissions aren't granted yet, request them
    if (!notificationsEnabled && "Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    
    setNotificationsEnabled(!notificationsEnabled);
    return !notificationsEnabled;
  };
  
  // Request notification permissions on initial load
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      // Delay the permission request to not overwhelm the user
      const timer = setTimeout(() => {
        Notification.requestPermission();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  return {
    connectionStatus: status,
    realtimeAlerts,
    threatVectors,
    reputationScore,
    notificationsEnabled,
    toggleNotifications,
    subscribeToUpdates,
    unsubscribeFromUpdates,
    clearAlerts: () => setRealtimeAlerts([])
  };
};
