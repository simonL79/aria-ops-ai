
import { ContentAlert, ContentSource, ContentAction, MetricValue } from "@/types/dashboard";
import { supabase } from "@/integrations/supabase/client";

/**
 * A.R.I.A™ Live Data Only - NO MOCK DATA ALLOWED
 * All functions fetch real live intelligence data from OSINT sources
 */

// Helper function to convert numeric sentiment to string label
const getSentimentLabel = (score: number): 'positive' | 'neutral' | 'negative' | 'threatening' => {
  if (score > 0.2) return 'positive';
  if (score < -0.4) return 'threatening';
  if (score < -0.1) return 'negative';
  return 'neutral';
};

// Function to fetch real alerts from live OSINT database only
export const fetchRealAlerts = async (): Promise<ContentAlert[]> => {
  try {
    console.log('🔍 Fetching live OSINT alerts only...');
    
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .eq('source_type', 'live_osint')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) {
      console.error('Error fetching live alerts:', error);
      return [];
    }
    
    // Only return real live data - NO FALLBACK TO MOCK
    if (!data || data.length === 0) {
      console.log('ℹ️ No live alerts found - run OSINT scan to populate');
      return [];
    }
    
    const liveAlerts = data.map(item => ({
      id: item.id,
      platform: item.platform,
      content: item.content,
      date: new Date(item.created_at).toLocaleDateString(),
      severity: item.severity as 'high' | 'medium' | 'low',
      status: (item.status as ContentAlert['status']) || 'new',
      threatType: item.threat_type,
      confidenceScore: item.confidence_score,
      sourceType: item.source_type,
      sentiment: getSentimentLabel(item.sentiment || 0),
      potentialReach: item.potential_reach,
      detectedEntities: Array.isArray(item.detected_entities) ? item.detected_entities.map(String) : [],
      url: item.url
    }));
    
    console.log(`✅ Loaded ${liveAlerts.length} live OSINT alerts`);
    return liveAlerts;
    
  } catch (error) {
    console.error('Error in fetchRealAlerts:', error);
    return [];
  }
};

// Function to fetch real sources from live monitoring only
export const fetchRealSources = async (): Promise<ContentSource[]> => {
  try {
    console.log('🔍 Fetching live source data only...');
    
    const { data, error } = await supabase
      .from('monitored_platforms')
      .select('*')
      .eq('active', true);
    
    if (error) {
      console.error('Error fetching live sources:', error);
      return [];
    }
    
    // Only return real live data - NO FALLBACK TO MOCK
    if (!data || data.length === 0) {
      console.log('ℹ️ No active monitoring sources - configure live sources');
      return [];
    }
    
    const liveSources = data.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type || 'platform',
      status: item.status as "critical" | "good" | "warning",
      lastUpdate: new Date(item.last_updated).toLocaleDateString(),
      metrics: {
        total: item.total || 0,
        positive: Math.floor((item.positive_ratio || 0) * (item.total || 0) / 100),
        negative: Math.floor((100 - (item.positive_ratio || 0)) * (item.total || 0) / 100),
        neutral: 0
      },
      positiveRatio: item.positive_ratio || 0,
      total: item.total || 0,
      active: item.active,
      lastUpdated: new Date(item.last_updated).toLocaleDateString(),
      mentionCount: item.mention_count || 0,
      sentiment: item.sentiment || 0
    }));
    
    console.log(`✅ Loaded ${liveSources.length} live monitoring sources`);
    return liveSources;
    
  } catch (error) {
    console.error('Error in fetchRealSources:', error);
    return [];
  }
};

// Function to fetch real actions from live system only
export const fetchRealActions = async (): Promise<ContentAction[]> => {
  try {
    console.log('🔍 Fetching live action data only...');
    
    const { data, error } = await supabase
      .from('content_actions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching live actions:', error);
      return [];
    }
    
    // Only return real live data - NO FALLBACK TO MOCK
    if (!data || data.length === 0) {
      console.log('ℹ️ No live actions found');
      return [];
    }
    
    const liveActions = data.map(item => {
      const mapType = (dbType: string): "urgent" | "monitoring" | "response" => {
        if (dbType === 'urgent' || dbType === 'monitoring' || dbType === 'response') {
          return dbType;
        }
        return 'monitoring';
      };

      const mapStatus = (dbStatus: string): "pending" | "completed" | "failed" => {
        if (dbStatus === 'pending' || dbStatus === 'completed' || dbStatus === 'failed') {
          return dbStatus;
        }
        return 'pending';
      };

      return {
        id: item.id,
        type: mapType(item.type),
        description: item.description,
        timestamp: new Date(item.created_at).toLocaleDateString(),
        status: mapStatus(item.status),
        platform: item.platform,
        action: item.action,
        date: new Date(item.created_at).toLocaleDateString()
      };
    });
    
    console.log(`✅ Loaded ${liveActions.length} live actions`);
    return liveActions;
    
  } catch (error) {
    console.error('Error in fetchRealActions:', error);
    return [];
  }
};

// Function to calculate real metrics from live database only
export const fetchRealMetrics = async (): Promise<MetricValue[]> => {
  try {
    console.log('🔍 Calculating live metrics only...');
    
    const [alertsData, sourcesData] = await Promise.all([
      supabase.from('scan_results').select('*').eq('source_type', 'live_osint'),
      supabase.from('monitored_platforms').select('*')
    ]);

    const totalMentions = alertsData.data?.length || 0;
    const negativeSentiment = alertsData.data?.filter(item => item.sentiment < -0.1).length || 0;
    const activeSources = sourcesData.data?.filter(item => item.active).length || 0;
    const threatLevel = totalMentions > 0 ? Math.round((negativeSentiment / totalMentions) * 100) : 0;

    const liveMetrics = [
      { 
        id: "1", 
        title: "Live Mentions", 
        value: totalMentions, 
        change: 0, 
        icon: "trending-up", 
        color: "blue", 
        delta: 0, 
        deltaType: "increase" as const
      },
      { 
        id: "2", 
        title: "Negative Sentiment", 
        value: negativeSentiment, 
        change: 0, 
        icon: "trending-down", 
        color: "red", 
        delta: 0, 
        deltaType: "increase" as const
      },
      { 
        id: "3", 
        title: "Active OSINT Sources", 
        value: activeSources, 
        change: 0, 
        icon: "trending-up", 
        color: "green", 
        delta: 0, 
        deltaType: "increase" as const
      },
      { 
        id: "4", 
        title: "Live Threat Level", 
        value: threatLevel, 
        change: 0, 
        icon: "trending-down", 
        color: "yellow", 
        delta: 0, 
        deltaType: "increase" as const
      }
    ];
    
    console.log(`✅ Calculated live metrics from ${totalMentions} OSINT results`);
    return liveMetrics;
    
  } catch (error) {
    console.error('Error fetching live metrics:', error);
    // Return zeros instead of mock data - NEVER MOCK
    return [
      { id: "1", title: "Live Mentions", value: 0, change: 0, icon: "trending-up", color: "blue", delta: 0, deltaType: "increase" as const },
      { id: "2", title: "Negative Sentiment", value: 0, change: 0, icon: "trending-down", color: "red", delta: 0, deltaType: "increase" as const },
      { id: "3", title: "Active OSINT Sources", value: 0, change: 0, icon: "trending-up", color: "green", delta: 0, deltaType: "increase" as const },
      { id: "4", title: "Live Threat Level", value: 0, change: 0, icon: "trending-down", color: "yellow", delta: 0, deltaType: "increase" as const }
    ];
  }
};

// ALL MOCK DATA COMPLETELY REMOVED - LIVE INTELLIGENCE ONLY
export const mockAlerts: ContentAlert[] = [];
export const mockClassifiedAlerts: ContentAlert[] = [];

// Block any attempt to use mock data
export const generateMockAlerts = (): ContentAlert[] => {
  console.error('🚫 BLOCKED: Mock data generation disabled. A.R.I.A™ uses 100% live OSINT intelligence.');
  throw new Error('Mock data operations are disabled. Use live OSINT scanning only.');
};

// Live data validation
export const validateLiveDataCompliance = async (): Promise<boolean> => {
  try {
    const { data: mockCheck } = await supabase
      .from('scan_results')
      .select('id')
      .or('content.ilike.%mock%,content.ilike.%test%,content.ilike.%demo%')
      .limit(1);
    
    const hasMockData = mockCheck && mockCheck.length > 0;
    
    if (hasMockData) {
      console.error('🚫 BLOCKED: Mock data detected in system');
      return false;
    }
    
    console.log('✅ Live data compliance validated');
    return true;
    
  } catch (error) {
    console.error('Live data validation failed:', error);
    return false;
  }
};
