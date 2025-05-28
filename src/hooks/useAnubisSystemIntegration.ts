
import { useState, useEffect } from 'react';
import { anubisIntegrationService } from '@/services/aria/anubisIntegrationService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useAnubisSystemIntegration = () => {
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [systemMetrics, setSystemMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Log page/component access
  const logComponentAccess = async (componentName: string, accessType: 'view' | 'interact' | 'modify' = 'view') => {
    if (!user) return;

    await anubisIntegrationService.logActivity({
      module: 'UI_TRACKING',
      activity_type: 'component_access',
      user_id: user.id,
      metadata: {
        component: componentName,
        access_type: accessType,
        timestamp: new Date().toISOString()
      },
      severity: 'info',
      source_component: componentName
    });
  };

  // Log user actions
  const logUserAction = async (action: string, details: any, severity: 'info' | 'warning' | 'error' | 'critical' = 'info') => {
    if (!user) return;

    await anubisIntegrationService.logActivity({
      module: 'USER_ACTIONS',
      activity_type: action,
      user_id: user.id,
      metadata: {
        action_details: details,
        timestamp: new Date().toISOString()
      },
      severity,
      source_component: 'UserInterface'
    });
  };

  // Log API calls
  const logApiCall = async (endpoint: string, method: string, status: number, responseTime?: number) => {
    await anubisIntegrationService.logActivity({
      module: 'API_TRACKING',
      activity_type: 'api_call',
      user_id: user?.id,
      metadata: {
        endpoint,
        method,
        status_code: status,
        response_time_ms: responseTime,
        timestamp: new Date().toISOString()
      },
      severity: status >= 400 ? 'error' : status >= 300 ? 'warning' : 'info',
      source_component: 'ApiClient'
    });
  };

  // Log errors
  const logError = async (error: Error, context: string) => {
    await anubisIntegrationService.logActivity({
      module: 'ERROR_TRACKING',
      activity_type: 'error_occurred',
      user_id: user?.id,
      metadata: {
        error_message: error.message,
        error_stack: error.stack,
        context,
        timestamp: new Date().toISOString()
      },
      severity: 'error',
      source_component: context
    });
  };

  // Get system health
  const checkSystemHealth = async () => {
    setIsLoading(true);
    try {
      const health = await anubisIntegrationService.performSystemHealthCheck();
      setSystemHealth(health);
      return health;
    } catch (error) {
      console.error('Failed to check system health:', error);
      toast.error('Failed to retrieve system health status');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get system metrics
  const getSystemMetrics = async (timeframe: '1h' | '24h' | '7d' = '24h') => {
    try {
      const metrics = await anubisIntegrationService.getSystemMetrics(timeframe);
      setSystemMetrics(metrics);
      return metrics;
    } catch (error) {
      console.error('Failed to get system metrics:', error);
      toast.error('Failed to retrieve system metrics');
      return null;
    }
  };

  // Auto-refresh system status
  useEffect(() => {
    checkSystemHealth();
    getSystemMetrics();

    // Refresh every 5 minutes
    const interval = setInterval(() => {
      checkSystemHealth();
      getSystemMetrics();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    // System status
    systemHealth,
    systemMetrics,
    isLoading,
    
    // Logging functions
    logComponentAccess,
    logUserAction,
    logApiCall,
    logError,
    
    // Status functions
    checkSystemHealth,
    getSystemMetrics
  };
};
