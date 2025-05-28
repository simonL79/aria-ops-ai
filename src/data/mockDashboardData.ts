
import { ContentAlert, ContentSource, ContentAction, MetricValue } from "@/types/dashboard";
import { supabase } from "@/integrations/supabase/client";

// Function to fetch real alerts from database only - NO MOCK DATA
export const fetchRealAlerts = async (): Promise<ContentAlert[]> => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
    
    // Return empty array if no data - NO FALLBACK TO MOCK
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      platform: item.platform,
      content: item.content,
      date: new Date(item.created_at).toLocaleDateString(),
      severity: item.severity as 'high' | 'medium' | 'low',
      status: (item.status as ContentAlert['status']) || 'new',
      threatType: item.threat_type,
      confidenceScore: item.confidence_score,
      sourceType: item.source_type,
      sentiment: item.sentiment > 0 ? 'positive' : item.sentiment < 0 ? 'negative' : 'neutral',
      potentialReach: item.potential_reach,
      detectedEntities: Array.isArray(item.detected_entities) ? item.detected_entities.map(String) : [],
      url: item.url
    }));
  } catch (error) {
    console.error('Error in fetchRealAlerts:', error);
    return [];
  }
};

// Function to fetch real sources from database only - NO MOCK DATA
export const fetchRealSources = async (): Promise<ContentSource[]> => {
  try {
    const { data, error } = await supabase
      .from('monitored_platforms')
      .select('*')
      .eq('active', true);
    
    if (error) {
      console.error('Error fetching sources:', error);
      return [];
    }
    
    // Return empty array if no data - NO FALLBACK TO MOCK
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(item => ({
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
  } catch (error) {
    console.error('Error in fetchRealSources:', error);
    return [];
  }
};

// Function to fetch real actions from database only - NO MOCK DATA
export const fetchRealActions = async (): Promise<ContentAction[]> => {
  try {
    const { data, error } = await supabase
      .from('content_actions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('Error fetching actions:', error);
      return [];
    }
    
    // Return empty array if no data - NO FALLBACK TO MOCK
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      type: item.type,
      description: item.description,
      timestamp: new Date(item.created_at).toLocaleDateString(),
      status: item.status,
      platform: item.platform,
      action: item.action,
      date: new Date(item.created_at).toLocaleDateString()
    }));
  } catch (error) {
    console.error('Error in fetchRealActions:', error);
    return [];
  }
};

// Function to calculate real metrics from database only - NO MOCK DATA
export const fetchRealMetrics = async (): Promise<MetricValue[]> => {
  try {
    const [alertsData, sourcesData] = await Promise.all([
      supabase.from('scan_results').select('*'),
      supabase.from('monitored_platforms').select('*')
    ]);

    const totalMentions = alertsData.data?.length || 0;
    const negativeSentiment = alertsData.data?.filter(item => item.sentiment < 0).length || 0;
    const activeSources = sourcesData.data?.filter(item => item.active).length || 0;
    const threatLevel = totalMentions > 0 ? Math.round((negativeSentiment / totalMentions) * 100) : 0;

    return [
      { 
        id: "1", 
        title: "Total Mentions", 
        value: totalMentions, 
        change: 0, 
        icon: "trending-up", 
        color: "blue", 
        delta: 0, 
        deltaType: "increase" 
      },
      { 
        id: "2", 
        title: "Negative Sentiment", 
        value: negativeSentiment, 
        change: 0, 
        icon: "trending-down", 
        color: "red", 
        delta: 0, 
        deltaType: "increase" 
      },
      { 
        id: "3", 
        title: "Active Sources", 
        value: activeSources, 
        change: 0, 
        icon: "trending-up", 
        color: "green", 
        delta: 0, 
        deltaType: "increase" 
      },
      { 
        id: "4", 
        title: "Threat Level", 
        value: threatLevel, 
        change: 0, 
        icon: "trending-down", 
        color: "yellow", 
        delta: 0, 
        deltaType: "increase" 
      }
    ];
  } catch (error) {
    console.error('Error fetching metrics:', error);
    // Return zeros instead of mock data - NEVER MOCK
    return [
      { id: "1", title: "Total Mentions", value: 0, change: 0, icon: "trending-up", color: "blue", delta: 0, deltaType: "increase" },
      { id: "2", title: "Negative Sentiment", value: 0, change: 0, icon: "trending-down", color: "red", delta: 0, deltaType: "increase" },
      { id: "3", title: "Active Sources", value: 0, change: 0, icon: "trending-up", color: "green", delta: 0, deltaType: "increase" },
      { id: "4", title: "Threat Level", value: 0, change: 0, icon: "trending-down", color: "yellow", delta: 0, deltaType: "increase" }
    ];
  }
};

// ALL MOCK DATA REMOVED - PRODUCTION LIVE ONLY
export const mockAlerts: ContentAlert[] = [];
export const mockClassifiedAlerts: ContentAlert[] = [];
