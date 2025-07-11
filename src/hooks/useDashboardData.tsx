
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
      
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .in('source_type', ['live_osint', 'live_scan', 'osint_intelligence'])
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Error fetching live alerts:', error);
        return [];
      }
      
      if (!data || data.length === 0) {
        console.log('📊 No live OSINT alerts found');
        return [];
      }
      
      console.log(`📊 Found ${data.length} live OSINT alerts`);
      
      return data.map(item => ({
        id: item.id,
        platform: item.platform || 'Unknown',
        content: item.content || '',
        date: new Date(item.created_at).toLocaleDateString(),
        severity: (['high', 'medium', 'low'].includes(item.severity) ? item.severity : 'low') as 'high' | 'medium' | 'low',
        status: (['new', 'read', 'dismissed', 'actioned', 'reviewing', 'resolved'].includes(item.status) ? item.status : 'new') as ContentAlert['status'],
        threatType: item.threat_type || 'reputation_risk',
        confidenceScore: item.confidence_score || 75,
        sourceType: item.source_type || 'live_osint',
        sentiment: item.sentiment > 0 ? 'positive' : item.sentiment < 0 ? 'negative' : 'neutral',
        potentialReach: item.potential_reach || 0,
        detectedEntities: Array.isArray(item.detected_entities) ? 
          item.detected_entities.map(String) : [],
        url: item.url || ''
      }));
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
        // Return default live sources if none configured
        return [
          {
            id: '1',
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
            id: '2', 
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
        type: (["urgent", "monitoring", "response"].includes(item.type) ? item.type : 'monitoring') as "urgent" | "monitoring" | "response",
        description: item.description,
        timestamp: new Date(item.created_at).toLocaleDateString(),
        status: (["pending", "completed", "failed"].includes(item.status) ? item.status : 'pending') as "pending" | "completed" | "failed",
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
      // Get real counts from live data
      const [alertsData, sourcesData] = await Promise.all([
        supabase
          .from('scan_results')
          .select('*')
          .in('source_type', ['live_osint', 'live_scan', 'osint_intelligence']),
        supabase
          .from('monitored_platforms')
          .select('*')
          .eq('active', true)
      ]);

      const totalMentions = alertsData.data?.length || 0;
      const negativeSentiment = alertsData.data?.filter(item => item.sentiment && item.sentiment < 0).length || 0;
      const activeSources = Math.max(sourcesData.data?.length || 0, 2); // At least Reddit + RSS
      const threatLevel = totalMentions > 0 ? Math.round((negativeSentiment / totalMentions) * 100) : 0;

      return [
        { 
          id: "1", 
          title: "Live Intelligence", 
          value: totalMentions, 
          change: 0, 
          icon: "trending-up", 
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
          title: "OSINT Sources", 
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
      console.error('Error fetching live metrics:', error);
      return [
        { id: "1", title: "Live Intelligence", value: 0, change: 0, icon: "trending-up", color: "blue", delta: 0, deltaType: "increase" },
        { id: "2", title: "Negative Signals", value: 0, change: 0, icon: "trending-down", color: "red", delta: 0, deltaType: "increase" },
        { id: "3", title: "OSINT Sources", value: 2, change: 0, icon: "trending-up", color: "green", delta: 0, deltaType: "increase" },
        { id: "4", title: "Threat Level", value: 0, change: 0, icon: "trending-down", color: "yellow", delta: 0, deltaType: "increase" }
      ];
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching live dashboard data...');
      
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
    setAlerts
  };
};
