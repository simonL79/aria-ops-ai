import { useState, useEffect } from 'react';
import { ContentAlert, ContentSource, ContentAction, MetricValue } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDashboardData = () => {
  const [alerts, setAlerts] = useState<ContentAlert[]>([]);
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [actions, setActions] = useState<ContentAction[]>([]);
  const [metrics, setMetrics] = useState<MetricValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveAlerts = async (): Promise<ContentAlert[]> => {
    try {
      console.log('🔍 Fetching live OSINT alerts...');
      
      // First try the new SIGMA scan results
      const { data: sigmaData, error: sigmaError } = await supabase
        .from('sigma_scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(25);

      // Also get traditional scan results
      const { data: traditionalData, error: traditionalError } = await supabase
        .from('scan_results')
        .select('*')
        .in('source_type', ['live_osint', 'live_scan', 'osint_intelligence'])
        .order('created_at', { ascending: false })
        .limit(25);

      const allResults: ContentAlert[] = [];

      // Process SIGMA results
      if (sigmaData && !sigmaError) {
        const sigmaAlerts = sigmaData.map(item => ({
          id: item.id,
          platform: item.platform || 'SIGMA',
          content: item.content || '',
          date: new Date(item.created_at).toLocaleDateString(),
          severity: (item.severity === 'critical' ? 'high' : item.severity === 'moderate' ? 'medium' : item.severity) as 'low' | 'medium' | 'high',
          status: 'new' as const,
          threatType: 'sigma_intelligence',
          confidenceScore: Math.round((item.confidence_score || 0.75) * 100),
          sourceType: item.source_type || 'sigma_osint',
          sentiment: (item.sentiment > 0 ? 'positive' : item.sentiment < 0 ? 'negative' : 'neutral') as 'positive' | 'negative' | 'neutral',
          potentialReach: 0,
          detectedEntities: item.detected_entities || [],
          url: item.url || ''
        }));
        allResults.push(...sigmaAlerts);
      }

      // Process traditional results
      if (traditionalData && !traditionalError) {
        const traditionalAlerts = traditionalData.map(item => ({
          id: item.id,
          platform: item.platform || 'Unknown',
          content: item.content || '',
          date: new Date(item.created_at).toLocaleDateString(),
          severity: (item.severity === 'critical' ? 'high' : item.severity === 'moderate' ? 'medium' : item.severity) as 'low' | 'medium' | 'high',
          status: (item.status as ContentAlert['status']) || 'new',
          threatType: item.threat_type || 'reputation_risk',
          confidenceScore: item.confidence_score || 75,
          sourceType: item.source_type || 'live_osint',
          sentiment: (item.sentiment > 0 ? 'positive' : item.sentiment < 0 ? 'negative' : 'neutral') as 'positive' | 'negative' | 'neutral',
          potentialReach: item.potential_reach || 0,
          detectedEntities: Array.isArray(item.detected_entities) ? 
            item.detected_entities.map(String) : [],
          url: item.url || ''
        }));
        allResults.push(...traditionalAlerts);
      }

      console.log(`📊 Found ${allResults.length} live intelligence alerts`);
      return allResults;
    } catch (error) {
      console.error('Error in fetchLiveAlerts:', error);
      return [];
    }
  };

  const fetchLiveSources = async (): Promise<ContentSource[]> => {
    try {
      const { data, error } = await supabase
        .from('monitored_platforms')
        .select('*')
        .eq('active', true);
      
      if (error) {
        console.error('Error fetching sources:', error);
        return [];
      }
      
      if (!data || data.length === 0) {
        // Return default live sources including SIGMA
        return [
          {
            id: '1',
            name: 'A.R.I.A™ SIGMA',
            type: 'sigma_intelligence',
            status: 'good',
            lastUpdate: new Date().toLocaleDateString(),
            metrics: { total: 0, positive: 0, negative: 0, neutral: 0 },
            positiveRatio: 0,
            total: 0,
            active: true,
            lastUpdated: new Date().toLocaleDateString(),
            mentionCount: 0,
            sentiment: 0
          },
          {
            id: '2',
            name: 'Reddit OSINT',
            type: 'osint_source',
            status: 'good',
            lastUpdate: new Date().toLocaleDateString(),
            metrics: { total: 0, positive: 0, negative: 0, neutral: 0 },
            positiveRatio: 0,
            total: 0,
            active: true,
            lastUpdated: new Date().toLocaleDateString(),
            mentionCount: 0,
            sentiment: 0
          },
          {
            id: '3', 
            name: 'RSS Intelligence',
            type: 'osint_source',
            status: 'good',
            lastUpdate: new Date().toLocaleDateString(),
            metrics: { total: 0, positive: 0, negative: 0, neutral: 0 },
            positiveRatio: 0,
            total: 0,
            active: true,
            lastUpdated: new Date().toLocaleDateString(),
            mentionCount: 0,
            sentiment: 0
          }
        ];
      }
      
      return data.map(item => ({
        id: item.id,
        name: item.name,
        type: 'osint_source',
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
      console.error('Error in fetchLiveSources:', error);
      return [];
    }
  };

  const fetchLiveActions = async (): Promise<ContentAction[]> => {
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
      
      if (!data || data.length === 0) {
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        type: (item.type as "urgent" | "monitoring" | "response") || 'monitoring',
        description: item.description,
        timestamp: new Date(item.created_at).toLocaleDateString(),
        status: (item.status as "pending" | "completed" | "failed") || 'pending',
        platform: item.platform,
        action: item.action,
        date: new Date(item.created_at).toLocaleDateString()
      }));
    } catch (error) {
      console.error('Error in fetchLiveActions:', error);
      return [];
    }
  };

  const fetchLiveMetrics = async (): Promise<MetricValue[]> => {
    try {
      // Get real counts from live data including SIGMA
      const [sigmaData, alertsData, sourcesData] = await Promise.all([
        supabase.from('sigma_scan_results').select('*'),
        supabase
          .from('scan_results')
          .select('*')
          .in('source_type', ['live_osint', 'live_scan', 'osint_intelligence']),
        supabase
          .from('monitored_platforms')
          .select('*')
          .eq('active', true)
      ]);

      const sigmaCount = sigmaData.data?.length || 0;
      const traditionalCount = alertsData.data?.length || 0;
      const totalMentions = sigmaCount + traditionalCount;
      
      const sigmaNegative = sigmaData.data?.filter(item => item.sentiment && item.sentiment < 0).length || 0;
      const traditionalNegative = alertsData.data?.filter(item => item.sentiment && item.sentiment < 0).length || 0;
      const negativeSentiment = sigmaNegative + traditionalNegative;
      
      const activeSources = Math.max(sourcesData.data?.length || 0, 3); // At least SIGMA + Reddit + RSS
      const threatLevel = totalMentions > 0 ? Math.round((negativeSentiment / totalMentions) * 100) : 0;

      return [
        { 
          id: "1", 
          title: "SIGMA Intelligence", 
          value: sigmaCount, 
          change: 0, 
          icon: "shield", 
          color: "blue", 
          delta: 0, 
          deltaType: "increase" 
        },
        { 
          id: "2", 
          title: "Negative Signals", 
          value: negativeSentiment, 
          change: 0, 
          icon: "trending-down", 
          color: "red", 
          delta: 0, 
          deltaType: "increase" 
        },
        { 
          id: "3", 
          title: "Live Sources", 
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
          icon: "alert-triangle", 
          color: "yellow", 
          delta: 0, 
          deltaType: "increase" 
        }
      ];
    } catch (error) {
      console.error('Error fetching live metrics:', error);
      return [
        { id: "1", title: "SIGMA Intelligence", value: 0, change: 0, icon: "shield", color: "blue", delta: 0, deltaType: "increase" },
        { id: "2", title: "Negative Signals", value: 0, change: 0, icon: "trending-down", color: "red", delta: 0, deltaType: "increase" },
        { id: "3", title: "Live Sources", value: 3, change: 0, icon: "trending-up", color: "green", delta: 0, deltaType: "increase" },
        { id: "4", title: "Threat Level", value: 0, change: 0, icon: "alert-triangle", color: "yellow", delta: 0, deltaType: "increase" }
      ];
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching live dashboard data with SIGMA integration...');
      
      const [liveAlerts, liveSources, liveActions, liveMetrics] = await Promise.all([
        fetchLiveAlerts(),
        fetchLiveSources(), 
        fetchLiveActions(),
        fetchLiveMetrics()
      ]);

      setAlerts(liveAlerts);
      setSources(liveSources);
      setActions(liveActions);
      setMetrics(liveMetrics);
      
      console.log(`✅ Dashboard data loaded: ${liveAlerts.length} alerts, ${liveSources.length} sources`);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      toast.error('Failed to fetch live dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate content counts from alerts
  const negativeContent = alerts.filter(alert => alert.sentiment === 'negative').length;
  const positiveContent = alerts.filter(alert => alert.sentiment === 'positive').length;
  const neutralContent = alerts.filter(alert => alert.sentiment === 'neutral').length;

  const simulateNewData = () => {
    console.log('Simulate new data called');
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    alerts,
    sources,
    actions, 
    metrics,
    loading,
    error,
    fetchData,
    simulateNewData,
    setAlerts,
    negativeContent,
    positiveContent,
    neutralContent
  };
};

async function fetchLiveSources(): Promise<ContentSource[]> {
  try {
    const { data, error } = await supabase
      .from('monitored_platforms')
      .select('*')
      .eq('active', true);
    
    if (error) {
      console.error('Error fetching sources:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [
        {
          id: '1',
          name: 'A.R.I.A™ SIGMA',
          type: 'sigma_intelligence',
          status: 'good',
          lastUpdate: new Date().toLocaleDateString(),
          metrics: { total: 0, positive: 0, negative: 0, neutral: 0 },
          positiveRatio: 0,
          total: 0,
          active: true,
          lastUpdated: new Date().toLocaleDateString(),
          mentionCount: 0,
          sentiment: 0
        },
        {
          id: '2',
          name: 'Reddit OSINT',
          type: 'osint_source',
          status: 'good',
          lastUpdate: new Date().toLocaleDateString(),
          metrics: { total: 0, positive: 0, negative: 0, neutral: 0 },
          positiveRatio: 0,
          total: 0,
          active: true,
          lastUpdated: new Date().toLocaleDateString(),
          mentionCount: 0,
          sentiment: 0
        },
        {
          id: '3', 
          name: 'RSS Intelligence',
          type: 'osint_source',
          status: 'good',
          lastUpdate: new Date().toLocaleDateString(),
          metrics: { total: 0, positive: 0, negative: 0, neutral: 0 },
          positiveRatio: 0,
          total: 0,
          active: true,
          lastUpdated: new Date().toLocaleDateString(),
          mentionCount: 0,
          sentiment: 0
        }
      ];
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      type: 'osint_source',
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
    console.error('Error in fetchLiveSources:', error);
    return [];
  }
}

async function fetchLiveActions(): Promise<ContentAction[]> {
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
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      type: (item.type as "urgent" | "monitoring" | "response") || 'monitoring',
      description: item.description,
      timestamp: new Date(item.created_at).toLocaleDateString(),
      status: (item.status as "pending" | "completed" | "failed") || 'pending',
      platform: item.platform,
      action: item.action,
      date: new Date(item.created_at).toLocaleDateString()
    }));
  } catch (error) {
    console.error('Error in fetchLiveActions:', error);
    return [];
  }
}

async function fetchLiveMetrics(): Promise<MetricValue[]> {
  try {
    const [sigmaData, alertsData, sourcesData] = await Promise.all([
      supabase.from('sigma_scan_results').select('*'),
      supabase
        .from('scan_results')
        .select('*')
        .in('source_type', ['live_osint', 'live_scan', 'osint_intelligence']),
      supabase
        .from('monitored_platforms')
        .select('*')
        .eq('active', true)
    ]);

    const sigmaCount = sigmaData.data?.length || 0;
    const traditionalCount = alertsData.data?.length || 0;
    const totalMentions = sigmaCount + traditionalCount;
    
    const sigmaNegative = sigmaData.data?.filter(item => item.sentiment && item.sentiment < 0).length || 0;
    const traditionalNegative = alertsData.data?.filter(item => item.sentiment && item.sentiment < 0).length || 0;
    const negativeSentiment = sigmaNegative + traditionalNegative;
    
    const activeSources = Math.max(sourcesData.data?.length || 0, 3); // At least SIGMA + Reddit + RSS
    const threatLevel = totalMentions > 0 ? Math.round((negativeSentiment / totalMentions) * 100) : 0;

    return [
      { 
        id: "1", 
        title: "SIGMA Intelligence", 
        value: sigmaCount, 
        change: 0, 
        icon: "shield", 
        color: "blue", 
        delta: 0, 
        deltaType: "increase" 
      },
      { 
        id: "2", 
        title: "Negative Signals", 
        value: negativeSentiment, 
        change: 0, 
        icon: "trending-down", 
        color: "red", 
        delta: 0, 
        deltaType: "increase" 
      },
      { 
        id: "3", 
        title: "Live Sources", 
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
        icon: "alert-triangle", 
        color: "yellow", 
        delta: 0, 
        deltaType: "increase" 
      }
    ];
  } catch (error) {
    console.error('Error fetching live metrics:', error);
    return [
      { id: "1", title: "SIGMA Intelligence", value: 0, change: 0, icon: "shield", color: "blue", delta: 0, deltaType: "increase" },
      { id: "2", title: "Negative Signals", value: 0, change: 0, icon: "trending-down", color: "red", delta: 0, deltaType: "increase" },
      { id: "3", title: "Live Sources", value: 3, change: 0, icon: "trending-up", color: "green", delta: 0, deltaType: "increase" },
      { id: "4", title: "Threat Level", value: 0, change: 0, icon: "alert-triangle", color: "yellow", delta: 0, deltaType: "increase" }
    ];
  }
}
