
import { supabase } from '@/integrations/supabase/client';

export interface AnubisActivityLog {
  action: string;
  details: string;
  user_email: string;
}

export const logAnubisActivity = async (activity: AnubisActivityLog) => {
  try {
    // Use existing activity_logs table instead of anubis_activity_log
    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        action: activity.action,
        details: activity.details,
        entity_type: 'anubis',
        user_email: activity.user_email
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error logging Anubis activity:', error);
    throw error;
  }
};

// System health check function
export const performSystemHealthCheck = async () => {
  try {
    // Check if core tables are accessible
    const healthChecks = await Promise.allSettled([
      supabase.from('scan_results').select('count').limit(1),
      supabase.from('entities').select('count').limit(1),
      supabase.from('aria_notifications').select('count').limit(1)
    ]);

    const healthStatus = {
      overall: 'healthy',
      scan_results: healthChecks[0].status === 'fulfilled' ? 'online' : 'offline',
      entities: healthChecks[1].status === 'fulfilled' ? 'online' : 'offline',
      notifications: healthChecks[2].status === 'fulfilled' ? 'online' : 'offline',
      timestamp: new Date().toISOString()
    };

    return healthStatus;
  } catch (error) {
    console.error('System health check failed:', error);
    return {
      overall: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// System metrics function
export const getSystemMetrics = async (timeframe: '1h' | '24h' | '7d' = '24h') => {
  try {
    const hours = timeframe === '1h' ? 1 : timeframe === '24h' ? 24 : 168;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    const [scanResults, notifications, entities] = await Promise.all([
      supabase
        .from('scan_results')
        .select('count')
        .gte('created_at', since),
      supabase
        .from('aria_notifications')
        .select('count')
        .gte('created_at', since),
      supabase
        .from('entities')
        .select('count')
        .gte('created_at', since)
    ]);

    return {
      timeframe,
      scan_results: scanResults.data?.length || 0,
      notifications: notifications.data?.length || 0,
      entities: entities.data?.length || 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to get system metrics:', error);
    return {
      timeframe,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Default export to match import expectations
export const anubisIntegrationService = {
  logActivity: logAnubisActivity,
  performSystemHealthCheck,
  getSystemMetrics
};

export default anubisIntegrationService;
