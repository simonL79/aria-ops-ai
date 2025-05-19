
import { useState, useEffect } from 'react';
import { useWebSocket } from '@/services/websocket/websocketService';
import { ContentAlert } from '@/types/dashboard';
import { ThreatVector } from '@/types/intelligence';

// URL for the WebSocket connection
// This would typically come from environment variables
const WS_URL = import.meta.env.VITE_WS_URL || 'wss://api.yourdomain.com/ws';

// Hook for handling real-time dashboard updates
export const useRealTimeUpdates = (enableWebSocket = true) => {
  const [realtimeAlerts, setRealtimeAlerts] = useState<ContentAlert[]>([]);
  const [threatVectors, setThreatVectors] = useState<ThreatVector[]>([]);
  const [reputationScore, setReputationScore] = useState<number | null>(null);
  
  // Use our WebSocket connection
  const { status, lastMessage, sendMessage } = useWebSocket(enableWebSocket ? WS_URL : undefined);
  
  // Process incoming WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;
    
    switch (lastMessage.type) {
      case 'alert':
        const newAlert = lastMessage.data as ContentAlert;
        setRealtimeAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Keep last 50 alerts
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
  }, [lastMessage]);
  
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
  
  return {
    connectionStatus: status,
    realtimeAlerts,
    threatVectors,
    reputationScore,
    subscribeToUpdates,
    unsubscribeFromUpdates,
    clearAlerts: () => setRealtimeAlerts([])
  };
};
