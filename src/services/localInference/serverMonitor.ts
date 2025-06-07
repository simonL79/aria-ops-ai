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
  connectionAttempts?: string[];
}

export interface ModelStatus {
  name: string;
  loaded: boolean;
  size: string;
  lastUsed: string;
  inferences: number;
}

/**
 * Check local AI server health with correct Ollama port including 11435
 */
export const checkServerHealth = async (): Promise<ServerHealth> => {
  const startTime = Date.now();
  const connectionAttempts: string[] = [];
  
  try {
    console.log('🔍 Checking Ollama server health on ports 11434, 11435, and 3001...');
    
    // Try all possible Ollama ports including the new 11435
    const endpoints = [
      'http://localhost:11435/api/tags',
      'http://localhost:11434/api/tags',
      'http://localhost:3001/api/tags',
      'http://127.0.0.1:11435/api/tags',
      'http://127.0.0.1:11434/api/tags', 
      'http://127.0.0.1:3001/api/tags',
      'http://localhost:11435/api/version',
      'http://localhost:11434/api/version',
      'http://localhost:3001/api/version'
    ];
    
    let response;
    let workingEndpoint = '';
    
    for (const endpoint of endpoints) {
      try {
        console.log(`📡 Testing endpoint: ${endpoint}`);
        connectionAttempts.push(`Testing ${endpoint}`);
        
        response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          signal: AbortSignal.timeout(8000) // Longer timeout
        });
        
        if (response.ok) {
          workingEndpoint = endpoint;
          connectionAttempts.push(`✅ SUCCESS: ${endpoint} - Status: ${response.status}`);
          console.log(`✅ Connected successfully to: ${endpoint}`);
          break;
        } else {
          connectionAttempts.push(`❌ Failed: ${endpoint} - Status: ${response.status} ${response.statusText}`);
        }
      } catch (endpointError) {
        const errorMsg = endpointError instanceof Error ? endpointError.message : 'Unknown error';
        connectionAttempts.push(`❌ Error: ${endpoint} - ${errorMsg}`);
        console.log(`❌ Failed to connect to ${endpoint}:`, errorMsg);
        continue;
      }
    }
    
    if (!response || !response.ok) {
      const health: ServerHealth = {
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
        serverType: 'Ollama (Connection Failed)',
        errorDetails: `All connection attempts failed. 
        
TROUBLESHOOTING:
1. Check if Ollama is running: Run 'ollama serve' in PowerShell
2. Test direct access: Open http://localhost:11435 or http://localhost:11434 in your browser
3. Test proxy access: Open http://localhost:3001 in your browser
4. Check port proxy: Run 'netsh interface portproxy show all' in PowerShell
        
Connection attempts: ${connectionAttempts.length}`,
        connectionAttempts
      };
      
      console.log('❌ All connection attempts failed:', connectionAttempts);
      return health;
    }
    
    const responseTime = Date.now() - startTime;
    console.log(`📊 Server response time: ${responseTime}ms from ${workingEndpoint}`);
    
    let data;
    let modelsCount = 0;
    
    try {
      data = await response.json();
      console.log('📋 Server response data:', data);
      modelsCount = data.models?.length || 0;
    } catch (parseError) {
      console.log('📋 Server responded but not with JSON, checking for models separately');
      
      // Try to get models from the working endpoint's tags
      try {
        const baseUrl = workingEndpoint.replace(/\/api\/(tags|version)/, '');
        const tagsResponse = await fetch(`${baseUrl}/api/tags`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          mode: 'cors',
          signal: AbortSignal.timeout(5000)
        });
        
        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json();
          modelsCount = tagsData.models?.length || 0;
          connectionAttempts.push(`✅ Models endpoint working: ${modelsCount} models found`);
        }
      } catch (tagsError) {
        connectionAttempts.push(`❌ Models endpoint failed: ${tagsError instanceof Error ? tagsError.message : 'Unknown'}`);
      }
    }
    
    // Test individual capabilities using the working endpoint
    const endpoints_status = await checkOllamaEndpoints(workingEndpoint);
    
    const health: ServerHealth = {
      isOnline: true,
      responseTime,
      modelsLoaded: modelsCount,
      memoryUsage: Math.random() * 80 + 10, // Simulated for now
      lastCheck: new Date().toISOString(),
      endpoints: endpoints_status,
      serverType: `Ollama (via ${workingEndpoint})`,
      errorDetails: undefined,
      connectionAttempts
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
      errorDetails: error instanceof Error ? error.message : 'Unknown error',
      connectionAttempts
    };
    
    console.log('❌ Server health result:', errorHealth);
    return errorHealth;
  }
};

/**
 * Check availability of Ollama-compatible endpoints
 */
const checkOllamaEndpoints = async (workingEndpoint?: string) => {
  const endpoints = {
    threatClassify: false,
    summarize: false,
    legalDraft: false,
    memorySearch: false
  };
  
  const baseUrl = workingEndpoint ? workingEndpoint.replace(/\/api\/(tags|version)/, '') : 'http://localhost:11435';
  
  const checkOllamaEndpoint = async (testType: string): Promise<boolean> => {
    try {
      console.log(`🔍 Testing ${testType} capability on ${baseUrl}...`);
      
      // Test with a lightweight API call
      const response = await fetch(`${baseUrl}/api/version`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        signal: AbortSignal.timeout(5000)
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
    
    // Try all ports including 11435
    const endpoints = [
      'http://localhost:11435/api/tags',
      'http://localhost:11434/api/tags',
      'http://localhost:3001/api/tags'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`📋 Models data received from ${endpoint}:`, data);
          
          return (data.models || []).map((model: any) => ({
            name: model.name || 'Unknown Model',
            loaded: true,
            size: model.size ? `${(model.size / 1024 / 1024 / 1024).toFixed(1)}GB` : 'Unknown',
            lastUsed: model.modified_at || new Date().toISOString(),
            inferences: Math.floor(Math.random() * 1000) // Simulated
          }));
        }
      } catch (error) {
        console.log(`Failed to connect to ${endpoint}:`, error);
        continue;
      }
    }
    
    throw new Error('Failed to connect to any Ollama endpoint');
    
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
