
import { MetricValue, ContentSource, ContentAction, ResponseToneStyle, SeoContent } from "@/types/dashboard";
import { supabase } from "@/integrations/supabase/client";

export const getMetrics = async (): Promise<MetricValue[]> => {
  try {
    const [alertsData, sourcesData] = await Promise.all([
      supabase.from('scan_results').select('*'),
      supabase.from('monitored_platforms').select('*')
    ]);

    const totalMentions = alertsData.data?.length || 0;
    const negativeSentiment = alertsData.data?.filter(item => item.sentiment < 0).length || 0;
    const activeSources = sourcesData.data?.filter(item => item.active).length || 0;
    const threatLevel = Math.round((negativeSentiment / totalMentions) * 100) || 0;

    return [
      { id: "1", title: "Total Mentions", value: totalMentions, change: 0, icon: "trending-up", color: "blue", delta: 0, deltaType: "increase" },
      { id: "2", title: "Negative Sentiment", value: negativeSentiment, change: 0, icon: "trending-down", color: "red", delta: 0, deltaType: "increase" },
      { id: "3", title: "Active Sources", value: activeSources, change: 0, icon: "trending-up", color: "green", delta: 0, deltaType: "increase" },
      { id: "4", title: "Threat Level", value: threatLevel, change: 0, icon: "trending-down", color: "yellow", delta: 0, deltaType: "increase" }
    ];
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return [];
  }
};

export const getSources = async (): Promise<ContentSource[]> => {
  try {
    const { data, error } = await supabase
      .from('monitored_platforms')
      .select('*')
      .eq('active', true);
    
    if (error) throw error;
    
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
    console.error('Error fetching sources:', error);
    return [];
  }
};

export const getRecentActivity = async (): Promise<ContentAction[]> => {
  try {
    const { data, error } = await supabase
      .from('content_actions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
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
    console.error('Error fetching recent activity:', error);
    return [];
  }
};

export const getToneStyles = async (): Promise<ResponseToneStyle[]> => {
  return ['professional', 'casual', 'empathetic', 'assertive'];
};

export const getSeoContent = async (): Promise<SeoContent[]> => {
  // This would fetch from a real SEO content table if it exists
  return [];
};
