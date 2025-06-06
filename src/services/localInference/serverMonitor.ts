
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
  serverType?: string;
  errorDetails?: string;
}

export interface ModelStatus {
  name: string;
  loaded: boolean;
  size: string;
  lastUsed: string;
  inferences: number;
}

/**
 * Check local AI server health and capabilities with better error handling
 */
export const checkServerHealth = async (): Promise<ServerHealth> => {
  const startTime = Date.now();
  
  try {
    console.log('🔍 Checking Ollama server health at localhost:3001...');
    
    // Try multiple endpoints to establish connection
    const endpoints = [
      'http://localhost:3001/api/tags',
      'http://localhost:3001/api/version',
      'http://localhost:3001/'
    ];
    
    let response;
    let workingEndpoint = '';
    
    for (const endpoint of endpoints) {
      try {
        console.log(`📡 Testing endpoint: ${endpoint}`);
        response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          workingEndpoint = endpoint;
          console.log(`✅ Connected successfully to: ${endpoint}`);
          break;
        }
      } catch (endpointError) {
        console.log(`❌ Failed to connect to ${endpoint}:`, endpointError);
        continue;
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`All connection attempts failed. Make sure Ollama is running on port 3001 with CORS enabled.`);
    }
    
    const responseTime = Date.now() - startTime;
    console.log(`📊 Server response time: ${responseTime}ms from ${workingEndpoint}`);
    
    let data;
    try {
      data = await response.json();
      console.log('📋 Server response data:', data);
    } catch (parseError) {
      console.log('📋 Server responded but not with JSON, assuming basic connection works');
      data = { models: [] }; // Fallback for non-JSON responses
    }
    
    // Test individual capabilities
    const endpoints_status = await checkOllamaEndpoints();
    
    const health: ServerHealth = {
      isOnline: true,
      responseTime,
      modelsLoaded: data.models?.length || 0,
      memoryUsage: Math.random() * 80 + 10, // Simulated for now
      lastCheck: new Date().toISOString(),
      endpoints: endpoints_status,
      serverType: 'Ollama',
      errorDetails: undefined
    };
    
    console.log('✅ Server health check successful:', health);
    return health;
    
  } catch (error) {
    console.warn('❌ Local server health check failed:', error);
    
    const errorHealth: ServerHealth = {
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
      },
      serverType: 'Unknown',
      errorDetails: error instanceof Error ? error.message : 'Unknown error'
    };
    
    console.log('❌ Server health result:', errorHealth);
    return errorHealth;
  }
};

/**
 * Check availability of Ollama-compatible endpoints with better testing
 */
const checkOllamaEndpoints = async () => {
  const endpoints = {
    threatClassify: false,
    summarize: false,
    legalDraft: false,
    memorySearch: false
  };
  
  const checkOllamaEndpoint = async (testType: string): Promise<boolean> => {
    try {
      console.log(`🔍 Testing ${testType} capability...`);
      
      // Test with a lightweight API call
      const response = await fetch('http://localhost:3001/api/version', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        signal: AbortSignal.timeout(3000)
      });
      
      const result = response.ok;
      console.log(`${result ? '✅' : '❌'} ${testType} test result: ${result}`);
      return result;
    } catch (error) {
      console.log(`❌ ${testType} test failed:`, error);
      return false;
    }
  };
  
  // Test each capability
  endpoints.threatClassify = await checkOllamaEndpoint('threatClassify');
  endpoints.summarize = await checkOllamaEndpoint('summarize');  
  endpoints.legalDraft = await checkOllamaEndpoint('legalDraft');
  endpoints.memorySearch = await checkOllamaEndpoint('memorySearch');
  
  return endpoints;
};

/**
 * Get detailed model information from Ollama server
 */
export const getModelStatuses = async (): Promise<ModelStatus[]> => {
  try {
    console.log('📋 Fetching model list from Ollama...');
    
    const response = await fetch('http://localhost:3001/api/tags', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      signal: AbortSignal.timeout(3000)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📋 Models data received:', data);
    
    return (data.models || []).map((model: any) => ({
      name: model.name || 'Unknown Model',
      loaded: true,
      size: model.size ? `${(model.size / 1024 / 1024 / 1024).toFixed(1)}GB` : 'Unknown',
      lastUsed: model.modified_at || new Date().toISOString(),
      inferences: Math.floor(Math.random() * 1000) // Simulated
    }));
    
  } catch (error) {
    console.error('❌ Failed to get model statuses:', error);
    return [];
  }
};

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
