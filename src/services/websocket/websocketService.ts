
// WebSocket connection service for real-time updates
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ContentAlert } from '@/types/dashboard';

// Define the message types we expect to receive
type WebSocketMessageType = 
  | 'alert' 
  | 'threat' 
  | 'metric_update' 
  | 'status_change'
  | 'system';

interface WebSocketMessage {
  type: WebSocketMessageType;
  data: any;
  timestamp: string;
}

// Connection status
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// WebSocket configuration
let socket: WebSocket | null = null;
let reconnectTimer: number | null = null;
const RECONNECT_DELAY = 5000; // 5 seconds between reconnection attempts

// Audio notification elements
let notificationSound: HTMLAudioElement | null = null;
let urgentNotificationSound: HTMLAudioElement | null = null;

// Initialize audio elements (preload them)
const initializeAudio = () => {
  try {
    if (!notificationSound) {
      notificationSound = new Audio('/notification-sound.mp3');
      notificationSound.preload = 'auto';
      notificationSound.volume = 0.3;
    }
    
    if (!urgentNotificationSound) {
      urgentNotificationSound = new Audio('/urgent-notification.mp3');
      urgentNotificationSound.preload = 'auto';
      urgentNotificationSound.volume = 0.5;
    }
  } catch (err) {
    console.log('Audio initialization failed:', err);
  }
};

/**
 * Initialize WebSocket connection
 */
export const initializeWebSocket = (url: string) => {
  try {
    // Initialize audio for notifications
    initializeAudio();
    
    // Close existing connection if any
    if (socket) {
      socket.close();
    }

    // Create new WebSocket connection
    socket = new WebSocket(url);
    
    // Set up event handlers
    socket.onopen = () => {
      console.log('WebSocket connection established');
      // Clear reconnect timer if one exists
      if (reconnectTimer) {
        window.clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      // Dispatch a connected event
      window.dispatchEvent(new CustomEvent('ws:status_change', { 
        detail: { status: 'connected' } 
      }));
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed', event);
      
      // Dispatch a disconnected event
      window.dispatchEvent(new CustomEvent('ws:status_change', { 
        detail: { status: 'disconnected' } 
      }));
      
      // Try to reconnect
      if (!reconnectTimer) {
        reconnectTimer = window.setTimeout(() => {
          initializeWebSocket(url);
        }, RECONNECT_DELAY);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Dispatch an error event
      window.dispatchEvent(new CustomEvent('ws:status_change', { 
        detail: { status: 'error', error } 
      }));
    };

    socket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        // Handle message based on type
        switch (message.type) {
          case 'alert':
            // Play sound for high-severity alerts
            if (message.data.severity === 'high') {
              try {
                urgentNotificationSound?.play().catch(e => console.log('Audio play prevented:', e));
              } catch (err) {
                console.log('Audio notification failed:', err);
              }
            }
            // Dispatch an alert event
            window.dispatchEvent(new CustomEvent('ws:alert', { 
              detail: message.data 
            }));
            break;
          case 'threat':
            // Play normal notification for threats
            try {
              notificationSound?.play().catch(e => console.log('Audio play prevented:', e));
            } catch (err) {
              console.log('Audio notification failed:', err);
            }
            // Dispatch a threat event
            window.dispatchEvent(new CustomEvent('ws:threat', { 
              detail: message.data 
            }));
            break;
          case 'metric_update':
            // Dispatch a metric update event
            window.dispatchEvent(new CustomEvent('ws:metric_update', { 
              detail: message.data 
            }));
            break;
          case 'status_change':
            // Dispatch a status change event
            window.dispatchEvent(new CustomEvent('ws:status_change', { 
              detail: message.data 
            }));
            break;
          case 'system':
            // Handle system messages like ping/pong
            console.log('System message:', message.data);
            break;
          default:
            console.warn('Unknown message type:', message);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    return true;
  } catch (error) {
    console.error('Failed to initialize WebSocket:', error);
    return false;
  }
};

/**
 * Send a message through the WebSocket
 */
export const sendWebSocketMessage = (type: WebSocketMessageType, data: any): boolean => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('WebSocket not connected');
    return false;
  }

  try {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: new Date().toISOString()
    };
    socket.send(JSON.stringify(message));
    return true;
  } catch (error) {
    console.error('Error sending WebSocket message:', error);
    return false;
  }
};

/**
 * Close the WebSocket connection
 */
export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
  
  if (reconnectTimer) {
    window.clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
};

/**
 * Hook to use WebSocket connection
 */
export const useWebSocket = (url?: string) => {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  
  useEffect(() => {
    // Connect to WebSocket if URL is provided
    if (url) {
      setStatus('connecting');
      initializeWebSocket(url);
    }
    
    // Set up event listeners
    const handleStatusChange = (e: CustomEvent) => {
      setStatus(e.detail.status);
      
      // Show toast notification on connection changes
      if (e.detail.status === 'connected') {
        toast.success('Real-time connection established');
      } else if (e.detail.status === 'disconnected') {
        toast.warning('Real-time connection lost, attempting to reconnect...');
      } else if (e.detail.status === 'error') {
        toast.error('Real-time connection error');
      }
    };
    
    const handleMessage = (e: CustomEvent) => {
      setLastMessage({
        type: e.type.replace('ws:', '') as WebSocketMessageType,
        data: e.detail,
        timestamp: new Date().toISOString()
      });
    };
    
    // Add event listeners
    window.addEventListener('ws:status_change', handleStatusChange as EventListener);
    window.addEventListener('ws:alert', handleMessage as EventListener);
    window.addEventListener('ws:threat', handleMessage as EventListener);
    window.addEventListener('ws:metric_update', handleMessage as EventListener);
    
    // Clean up on unmount
    return () => {
      window.removeEventListener('ws:status_change', handleStatusChange as EventListener);
      window.removeEventListener('ws:alert', handleMessage as EventListener);
      window.removeEventListener('ws:threat', handleMessage as EventListener);
      window.removeEventListener('ws:metric_update', handleMessage as EventListener);
      
      // Close connection if this was the component that opened it
      if (url) {
        closeWebSocket();
      }
    };
  }, [url]);
  
  // Return connection utilities
  return {
    status,
    lastMessage,
    sendMessage: sendWebSocketMessage,
    closeConnection: closeWebSocket
  };
};

// Hook for real-time alerts specifically
export const useRealTimeAlerts = (url?: string) => {
  const [alerts, setAlerts] = useState<ContentAlert[]>([]);
  const wsConnection = useWebSocket(url);
  
  useEffect(() => {
    const handleAlert = (e: CustomEvent) => {
      const newAlert = e.detail as ContentAlert;
      setAlerts(prev => [newAlert, ...prev].slice(0, 10)); // Keep max 10 alerts
      
      // Show toast for high severity alerts
      if (newAlert.severity === 'high') {
        toast.warning(`New high priority alert from ${newAlert.platform}`, {
          description: newAlert.content.length > 60 ? 
            newAlert.content.substring(0, 60) + '...' : 
            newAlert.content
        });
      }
    };
    
    // Add event listener
    window.addEventListener('ws:alert', handleAlert as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('ws:alert', handleAlert as EventListener);
    };
  }, []);
  
  return {
    alerts,
    connectionStatus: wsConnection.status,
    sendAlert: (alert: ContentAlert) => wsConnection.sendMessage('alert', alert)
  };
};
