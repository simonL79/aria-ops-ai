
import { supabase } from '@/integrations/supabase/client';

export interface ServerHealth {
  isOnline: boolean;
  responseTime: number;
  modelsLoaded: number;
  memoryUsage: number;
  lastCheck: string;
  endpoints: {
    threatClassify: boolean;
    summarize: boolean;
    legalDraft: boolean;
    memorySearch: boolean;
  };
}

export interface ModelStatus {
  name: string;
  loaded: boolean;
  size: string;
  lastUsed: string;
  inferences: number;
}

/**
 * Check local AI server health and capabilities
 */
export const checkServerHealth = async (): Promise<ServerHealth> => {
  const startTime = Date.now();
  
  try {
    // Check main server endpoint
    const response = await fetch('http://localhost:3001/api/tags', {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check individual endpoints
    const endpoints = await checkEndpoints();
    
    return {
      isOnline: true,
      responseTime,
      modelsLoaded: data.models?.length || 0,
      memoryUsage: Math.random() * 80 + 10, // Simulated for now
      lastCheck: new Date().toISOString(),
      endpoints
    };
    
  } catch (error) {
    console.warn('Local server health check failed:', error);
    
    return {
      isOnline: false,
      responseTime: Date.now() - startTime,
      modelsLoaded: 0,
      memoryUsage: 0,
      lastCheck: new Date().toISOString(),
      endpoints: {
        threatClassify: false,
        summarize: false,
        legalDraft: false,
        memorySearch: false
      }
    };
  }
};

/**
 * Check availability of specific AI endpoints
 */
const checkEndpoints = async () => {
  const endpoints = {
    threatClassify: false,
    summarize: false,
    legalDraft: false,
    memorySearch: false
  };
  
  const checkEndpoint = async (path: string): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:3001${path}`, {
        method: 'OPTIONS',
        signal: AbortSignal.timeout(2000)
      });
      return response.ok || response.status === 405; // OPTIONS might not be implemented
    } catch {
      return false;
    }
  };
  
  // Check each endpoint
  endpoints.threatClassify = await checkEndpoint('/threat-classify');
  endpoints.summarize = await checkEndpoint('/summarize');
  endpoints.legalDraft = await checkEndpoint('/legal-draft');
  endpoints.memorySearch = await checkEndpoint('/memory-search');
  
  return endpoints;
};

/**
 * Get detailed model information from local server
 */
export const getModelStatuses = async (): Promise<ModelStatus[]> => {
  try {
    const response = await fetch('http://localhost:3001/api/tags', {
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch model status');
    }
    
    const data = await response.json();
    
    return (data.models || []).map((model: any) => ({
      name: model.name || 'Unknown Model',
      loaded: true,
      size: model.size || 'Unknown',
      lastUsed: model.modified_at || new Date().toISOString(),
      inferences: Math.floor(Math.random() * 1000) // Simulated
    }));
    
  } catch (error) {
    console.error('Failed to get model statuses:', error);
    return [];
  }
};

/**
 * Log server health metrics for monitoring
 */
export const logServerMetrics = async (health: ServerHealth): Promise<void> => {
  try {
    await supabase.from('aria_ops_log').insert({
      operation_type: 'server_health_check',
      module_source: 'local_server_monitor',
      success: health.isOnline,
      operation_data: {
        responseTime: health.responseTime,
        modelsLoaded: health.modelsLoaded,
        memoryUsage: health.memoryUsage,
        endpoints: health.endpoints,
        timestamp: health.lastCheck
      }
    });
  } catch (error) {
    console.warn('Failed to log server metrics:', error);
  }
};

/**
 * Start continuous monitoring of local AI server
 */
export const startServerMonitoring = (onHealthUpdate: (health: ServerHealth) => void): NodeJS.Timeout => {
  const checkHealth = async () => {
    const health = await checkServerHealth();
    onHealthUpdate(health);
    await logServerMetrics(health);
  };
  
  // Initial check
  checkHealth();
  
  // Check every 30 seconds
  return setInterval(checkHealth, 30000);
};
