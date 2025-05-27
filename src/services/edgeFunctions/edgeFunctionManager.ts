
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EdgeFunctionHealth {
  function_name: string;
  status: 'healthy' | 'degraded' | 'down';
  last_execution: string;
  error_rate: number;
  avg_response_time: number;
}

export const checkEdgeFunctionHealth = async (): Promise<EdgeFunctionHealth[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('health-check', {
      body: { check_all_functions: true }
    });

    if (error) {
      console.error('Health check error:', error);
      return [];
    }

    return data?.functions || [];
  } catch (error) {
    console.error('Error checking edge function health:', error);
    return [];
  }
};

export const invokeWithFallback = async (functionName: string, payload: any, fallbackData: any = null) => {
  try {
    console.log(`Invoking edge function: ${functionName}`);
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload
    });

    if (error) {
      console.error(`Edge function ${functionName} error:`, error);
      
      if (fallbackData) {
        console.log(`Using fallback data for ${functionName}`);
        toast.warning(`${functionName} unavailable, using cached data`);
        return { data: fallbackData, error: null };
      }
      
      toast.error(`${functionName} service unavailable`);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error(`Error invoking ${functionName}:`, error);
    
    if (fallbackData) {
      return { data: fallbackData, error: null };
    }
    
    return { data: null, error };
  }
};

export const testAllEdgeFunctions = async () => {
  const functions = [
    'health-check',
    'enhanced-intelligence', 
    'discovery-scanner',
    'monitoring-scan',
    'google-search-crawler',
    'generate-response',
    'executive-reports'
  ];

  const results = [];

  for (const func of functions) {
    try {
      const start = Date.now();
      const { data, error } = await supabase.functions.invoke(func, {
        body: { test: true }
      });
      const duration = Date.now() - start;

      results.push({
        function_name: func,
        status: error ? 'down' : 'healthy',
        response_time: duration,
        error: error?.message || null
      });
    } catch (err) {
      results.push({
        function_name: func,
        status: 'down',
        response_time: 0,
        error: err.message
      });
    }
  }

  return results;
};
