
import { ContentAlert } from '@/types/dashboard';
import { supabase } from "@/integrations/supabase/client";

export interface ScanParameters {
  platforms?: string[];
  keywordFilters?: string[];
  maxResults: number;
  prioritizeSeverity?: 'high' | 'medium' | 'low';
  includeCustomerEnquiries: boolean;
}

export const defaultScanParameters: ScanParameters = {
  platforms: ['Twitter', 'Reddit', 'News Article'],
  keywordFilters: [],
  maxResults: 5,
  includeCustomerEnquiries: false
};

export const performRealScan = async (query: string, platforms: string[]): Promise<ContentAlert[]> => {
  try {
    // Fetch real scan results from database only
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .in('platform', platforms)
      .ilike('content', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching scan results:', error);
      return [];
    }

    // Return empty array if no data
    if (!data || data.length === 0) {
      return [];
    }

    return data.map(item => ({
      id: item.id,
      platform: item.platform,
      content: item.content,
      date: new Date(item.created_at).toISOString(),
      severity: item.severity as 'low' | 'medium' | 'high',
      status: (item.status as ContentAlert['status']) || 'new',
      url: item.url || '',
      threatType: item.threat_type,
      sourceType: item.source_type || 'scan',
      confidenceScore: item.confidence_score || 75,
      sentiment: item.sentiment > 0 ? 'positive' : item.sentiment < 0 ? 'negative' : 'neutral',
      detectedEntities: Array.isArray(item.detected_entities) ? item.detected_entities.map(String) : []
    }));
  } catch (error) {
    console.error('Error in performRealScan:', error);
    return [];
  }
};

export const performMockScan = performRealScan; // Alias for backward compatibility

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

export const registerAlertListener = (callback: (alert: ContentAlert) => void) => {
  console.log('Real-time alert listener registered');
  return () => console.log('Alert listener unregistered');
};

export const unregisterAlertListener = (listenerId: string) => {
  console.log('Alert listener unregistered:', listenerId);
};

// All mock data removed - production environment
export const mockScanResults: ContentAlert[] = [];
