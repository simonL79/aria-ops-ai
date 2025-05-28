
import { supabase } from "@/integrations/supabase/client";
import { ContentAlert } from '@/types/dashboard';
import { toast } from "sonner";

export interface LiveScanParameters {
  platforms: string[];
  keywords: string[];
  maxResults: number;
  includeRealTimeAlerts: boolean;
}

export const performLiveScan = async (
  query: string, 
  platforms: string[], 
  parameters: Partial<LiveScanParameters> = {}
): Promise<ContentAlert[]> => {
  try {
    console.log('Starting live scan with query:', query, 'platforms:', platforms);
    
    // Call the monitoring scan edge function for real data
    const { data, error } = await supabase.functions.invoke('monitoring-scan', {
      body: { 
        scanType: 'live',
        query,
        platforms,
        maxResults: parameters.maxResults || 50
      }
    });

    if (error) {
      console.error('Live scan error:', error);
      throw error;
    }

    if (data?.success && data.results) {
      console.log('Live scan completed successfully:', data.results.length, 'results');
      
      // Store results in database
      for (const result of data.results) {
        await supabase.from('scan_results').insert({
          platform: result.platform,
          content: result.content,
          url: result.url,
          severity: result.severity,
          status: 'new',
          threat_type: result.threat_type || 'reputation_risk',
          sentiment: result.sentiment || 0,
          source_type: 'live_scan'
        });
      }

      return data.results.map((result: any) => ({
        id: result.id,
        platform: result.platform,
        content: result.content,
        date: new Date().toISOString(),
        severity: result.severity as 'low' | 'medium' | 'high',
        status: 'new' as const,
        url: result.url || '',
        threatType: result.threat_type,
        sourceType: 'live_scan' as const,
        confidenceScore: result.confidenceScore || 85,
        sentiment: result.sentiment > 0 ? 'positive' : result.sentiment < 0 ? 'negative' : 'neutral',
        detectedEntities: result.detectedEntities || []
      }));
    }

    console.log('No results from live scan');
    return [];
  } catch (error) {
    console.error('Error in live scan:', error);
    toast.error('Live scan failed. Please check your connection.');
    throw error;
  }
};

export const performRealTimeMonitoring = async (): Promise<ContentAlert[]> => {
  try {
    console.log('Starting real-time monitoring scan...');
    
    const { data, error } = await supabase.functions.invoke('enhanced-intelligence', {
      body: { 
        scanType: 'real_time_monitoring',
        enableLiveData: true
      }
    });

    if (error) throw error;

    if (data?.threats) {
      // Process and store real threats
      const threats = data.threats.map((threat: any) => ({
        id: `threat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        platform: threat.platform,
        content: threat.content,
        date: new Date().toISOString(),
        severity: threat.severity as 'low' | 'medium' | 'high',
        status: 'new' as const,
        url: threat.url || '',
        threatType: threat.threatType,
        sourceType: 'real_time' as const,
        confidenceScore: threat.confidenceScore || 90,
        sentiment: threat.sentiment > 0 ? 'positive' : threat.sentiment < 0 ? 'negative' : 'neutral',
        detectedEntities: threat.detectedEntities || []
      }));

      return threats;
    }

    return [];
  } catch (error) {
    console.error('Real-time monitoring failed:', error);
    return [];
  }
};

export const getMonitoringStatus = async () => {
  try {
    const { data, error } = await supabase
      .from('monitoring_status')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching monitoring status:', error);
      return {
        isActive: false,
        sources: 0,
        platforms: 0,
        lastRun: new Date().toISOString()
      };
    }

    return {
      isActive: data.is_active || false,
      sources: data.sources_count || 0,
      platforms: 5,
      lastRun: data.last_run || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting monitoring status:', error);
    return {
      isActive: false,
      sources: 0,
      platforms: 0,
      lastRun: new Date().toISOString()
    };
  }
};
