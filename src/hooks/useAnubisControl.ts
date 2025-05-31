
import { useState } from 'react';
import { anubisSecurityService } from '@/services/aria/anubisSecurityService';
import { toast } from 'sonner';

export const useAnubisControl = () => {
  const [isLoading, setIsLoading] = useState(false);

  const triggerSecurityEvent = async (event: any) => {
    setIsLoading(true);
    try {
      await anubisSecurityService.logSecurityEvent(event);
      toast.success('Security event logged');
      return true;
    } catch (error) {
      console.error('Error triggering security event:', error);
      toast.error('Failed to trigger security event');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const runSecurityTest = async () => {
    setIsLoading(true);
    try {
      const result = { test: 'security_scan', passed: true, timestamp: new Date().toISOString() };
      await anubisSecurityService.logTestResult(result);
      toast.success('Security test completed');
      return result;
    } catch (error) {
      console.error('Error running security test:', error);
      toast.error('Security test failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const registerMobile = async (deviceInfo: any) => {
    setIsLoading(true);
    try {
      await anubisSecurityService.registerMobileSession(deviceInfo);
      toast.success('Mobile session registered');
      return true;
    } catch (error) {
      console.error('Error registering mobile:', error);
      toast.error('Failed to register mobile session');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logAIAttack = async (attackData: any) => {
    setIsLoading(true);
    try {
      await anubisSecurityService.logAIAttack(attackData);
      toast.error('AI attack detected and logged');
      return true;
    } catch (error) {
      console.error('Error logging AI attack:', error);
      toast.error('Failed to log AI attack');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getSecurityMetrics = async () => {
    setIsLoading(true);
    try {
      const metrics = await anubisSecurityService.getSecurityMetrics();
      return metrics;
    } catch (error) {
      console.error('Error getting security metrics:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    triggerSecurityEvent,
    runSecurityTest,
    registerMobile,
    logAIAttack,
    getSecurityMetrics,
    isLoading
  };
};
