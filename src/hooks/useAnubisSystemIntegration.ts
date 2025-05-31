
import { useState, useEffect } from 'react';
import { anubisIntegrationService } from '@/services/aria/anubisIntegrationService';
import { toast } from 'sonner';

export const useAnubisSystemIntegration = () => {
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkSystemHealth = async () => {
    setIsLoading(true);
    try {
      const health = await anubisIntegrationService.performSystemHealthCheck();
      setSystemHealth(health);
      return health;
    } catch (error) {
      console.error('Error checking system health:', error);
      toast.error('Failed to check system health');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getSystemMetrics = async (timeframe: '7d' | '30d' = '7d') => {
    setIsLoading(true);
    try {
      const metricsData = await anubisIntegrationService.getSystemMetrics(timeframe);
      setMetrics(metricsData);
      return metricsData;
    } catch (error) {
      console.error('Error getting system metrics:', error);
      toast.error('Failed to get system metrics');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logActivity = async (activity: any) => {
    try {
      await anubisIntegrationService.logActivity(activity);
      return true;
    } catch (error) {
      console.error('Error logging activity:', error);
      return false;
    }
  };

  const logEmergencyStrike = async (threatId: string, action: string, userId?: string) => {
    try {
      await anubisIntegrationService.logEmergencyStrike(threatId, action, userId);
      toast.success('Emergency strike logged');
      return true;
    } catch (error) {
      console.error('Error logging emergency strike:', error);
      toast.error('Failed to log emergency strike');
      return false;
    }
  };

  const logSovraDecision = async (threatId: string, decision: string, confidence: number, userId?: string) => {
    try {
      await anubisIntegrationService.logSovraDecision(threatId, decision, confidence, userId);
      toast.success('Sovra decision logged');
      return true;
    } catch (error) {
      console.error('Error logging Sovra decision:', error);
      toast.error('Failed to log Sovra decision');
      return false;
    }
  };

  useEffect(() => {
    checkSystemHealth();
    getSystemMetrics();
  }, []);

  return {
    systemHealth,
    metrics,
    isLoading,
    checkSystemHealth,
    getSystemMetrics,
    logActivity,
    logEmergencyStrike,
    logSovraDecision
  };
};
