
import { useState, useEffect, useCallback } from "react";
import { supabase } from '@/integrations/supabase/client';
import {
  ContentAlert,
  ContentSource,
  ContentAction,
  MetricValue,
  ResponseToneStyle,
  SeoContent as SeoContentType,
} from "@/types/dashboard";

interface DashboardData {
  metrics: MetricValue[];
  alerts: ContentAlert[];
  classifiedAlerts: ContentAlert[];
  sources: ContentSource[];
  actions: ContentAction[];
  toneStyles: ResponseToneStyle[];
  recentActivity: ContentAction[];
  seoContent: SeoContentType[];
  negativeContent: number;
  positiveContent: number;
  neutralContent: number;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  simulateNewData: (scanResults: any[]) => void;
}

const useDashboardData = (): DashboardData => {
  const [metrics, setMetrics] = useState<MetricValue[]>([]);
  const [alerts, setAlerts] = useState<ContentAlert[]>([]);
  const [classifiedAlerts, setClassifiedAlerts] = useState<ContentAlert[]>([]);
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [actions, setActions] = useState<ContentAction[]>([]);
  const [toneStyles, setToneStyles] = useState<ResponseToneStyle[]>(['professional', 'casual', 'empathetic', 'assertive']);
  const [recentActivity, setRecentActivity] = useState<ContentAction[]>([]);
  const [seoContent, setSeoContent] = useState<SeoContentType[]>([]);
  const [negativeContent, setNegativeContent] = useState<number>(0);
  const [positiveContent, setPositiveContent] = useState<number>(0);
  const [neutralContent, setNeutralContent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 A.R.I.A™ OSINT DATA: Loading real intelligence data...');
      
      // Fetch ONLY real OSINT intelligence data
      const { data: scanResults, error: scanError } = await supabase
        .from('scan_results')
        .select('*')
        .eq('source_type', 'live_osint')
        .order('created_at', { ascending: false })
        .limit(100);

      if (scanError) {
        console.error('❌ Error fetching OSINT intelligence:', scanError);
        throw new Error(`Failed to fetch intelligence data: ${scanError.message}`);
      }

      // Fetch real content alerts
      const { data: contentAlerts, error: alertsError } = await supabase
        .from('content_alerts')
        .select('*')
        .eq('source_type', 'live_source')
        .order('created_at', { ascending: false })
        .limit(50);

      if (alertsError) {
        console.error('❌ Error fetching content alerts:', alertsError);
      }

      // Process OSINT intelligence data
      const osintResults = (scanResults || []).map((result: any) => ({
        id: result.id,
        platform: result.platform || 'Unknown',
        content: result.content || 'No content available',
        date: new Date(result.created_at).toLocaleString(),
        severity: (result.severity as 'high' | 'medium' | 'low') || 'low',
        status: 'new' as const,
        url: result.url || '',
        threatType: result.threat_type || 'unknown',
        sourceType: 'osint_intelligence' as const,
        confidenceScore: result.confidence_score || 85,
        sentiment: result.sentiment > 0 ? 'positive' as const : result.sentiment < -0.2 ? 'negative' as const : 'neutral' as const,
        detectedEntities: Array.isArray(result.detected_entities) 
          ? result.detected_entities.map((e: any) => typeof e === 'string' ? e : e.name || String(e))
          : [],
        potentialReach: result.potential_reach || 0
      }));

      // Process content alerts
      const formattedContentAlerts: ContentAlert[] = (contentAlerts || []).map((alert: any) => ({
        id: alert.id,
        platform: alert.platform || 'Unknown',
        content: alert.content || 'No content available',
        date: new Date(alert.created_at).toLocaleString(),
        severity: (alert.severity as 'high' | 'medium' | 'low') || 'low',
        status: 'new' as const,
        url: alert.url || '',
        threatType: alert.threat_type || 'unknown',
        sourceType: 'live_alert' as const,
        confidenceScore: alert.confidence_score || 85,
        sentiment: alert.sentiment > 0 ? 'positive' as const : alert.sentiment < -0.2 ? 'negative' as const : 'neutral' as const,
        detectedEntities: Array.isArray(alert.detected_entities) 
          ? alert.detected_entities.map((e: any) => typeof e === 'string' ? e : e.name || String(e))
          : [],
        potentialReach: alert.potential_reach || 0
      }));

      // Combine all real intelligence
      const allIntelligence = [...osintResults, ...formattedContentAlerts];
      
      console.log(`📊 A.R.I.A™ OSINT: Loaded ${allIntelligence.length} intelligence items`);
      console.log(`📊 Breakdown: ${osintResults.length} OSINT, ${formattedContentAlerts.length} alerts`);
      
      setAlerts(allIntelligence);
      setClassifiedAlerts(allIntelligence);

      // Calculate real-time metrics
      const highSeverity = allIntelligence.filter(alert => alert.severity === 'high').length;
      const mediumSeverity = allIntelligence.filter(alert => alert.severity === 'medium').length;
      const totalReach = allIntelligence.reduce((sum, alert) => sum + (alert.potentialReach || 0), 0);
      
      const osintMetrics: MetricValue[] = [
        { id: 'total-intelligence', title: 'Intelligence Items', value: allIntelligence.length, change: 0, icon: 'search', color: 'blue' },
        { id: 'high-risk', title: 'High Risk', value: highSeverity, change: 0, icon: 'alert-triangle', color: 'red' },
        { id: 'medium-risk', title: 'Medium Risk', value: mediumSeverity, change: 0, icon: 'alert', color: 'yellow' },
        { id: 'total-reach', title: 'Total Reach', value: totalReach, change: 0, icon: 'users', color: 'green' }
      ];
      
      setMetrics(osintMetrics);

      // Calculate sentiment distribution
      const negative = allIntelligence.filter(alert => alert.sentiment === 'negative').length;
      const positive = allIntelligence.filter(alert => alert.sentiment === 'positive').length;
      const neutral = allIntelligence.filter(alert => alert.sentiment === 'neutral').length;

      setNegativeContent(negative);
      setPositiveContent(positive);
      setNeutralContent(neutral);

      // Set up sources based on platforms
      const platformCounts = allIntelligence.reduce((acc: any, alert) => {
        acc[alert.platform] = (acc[alert.platform] || 0) + 1;
        return acc;
      }, {});

      const osintSources: ContentSource[] = Object.entries(platformCounts).map(([platform, count]: [string, any]) => ({
        id: platform.toLowerCase(),
        name: platform,
        type: 'osint_source',
        status: 'connected',
        lastUpdate: new Date().toISOString(),
        metrics: {
          total: count,
          positive: allIntelligence.filter(a => a.platform === platform && a.sentiment === 'positive').length,
          negative: allIntelligence.filter(a => a.platform === platform && a.sentiment === 'negative').length,
          neutral: allIntelligence.filter(a => a.platform === platform && a.sentiment === 'neutral').length
        }
      }));

      setSources(osintSources);

      // Generate actions from intelligence
      const osintActions: ContentAction[] = allIntelligence.slice(0, 10).map((alert) => ({
        id: alert.id,
        type: alert.severity === 'high' ? 'urgent' as const : 'monitoring' as const,
        description: `${alert.severity.toUpperCase()} intelligence from ${alert.platform}`,
        status: 'pending' as const,
        platform: alert.platform,
        timestamp: alert.date
      }));

      setActions(osintActions);
      setRecentActivity(osintActions);
      setError(null);
      
    } catch (err: any) {
      console.error('❌ Critical error fetching OSINT data:', err);
      setError(`Failed to load intelligence data: ${err.message}`);
      
      // Set empty arrays for error state
      setAlerts([]);
      setClassifiedAlerts([]);
      setMetrics([]);
      setSources([]);
      setActions([]);
      setRecentActivity([]);
      
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up real-time subscriptions for OSINT updates
  useEffect(() => {
    fetchData();

    // Subscribe to OSINT updates
    const osintSubscription = supabase
      .channel('osint_updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'scan_results',
        filter: 'source_type=eq.live_osint'
      }, () => {
        console.log('🔄 New OSINT intelligence detected, refreshing dashboard...');
        fetchData();
      })
      .subscribe();

    const alertSubscription = supabase
      .channel('alert_updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'content_alerts',
        filter: 'source_type=eq.live_source'
      }, () => {
        console.log('🔄 New alert detected, refreshing dashboard...');
        fetchData();
      })
      .subscribe();

    return () => {
      osintSubscription.unsubscribe();
      alertSubscription.unsubscribe();
    };
  }, [fetchData]);

  const simulateNewData = useCallback((scanResults: any[]) => {
    // Process real scan results only
    if (!scanResults || scanResults.length === 0) return;
    
    console.log('🔄 Processing new OSINT intelligence:', scanResults.length);
    fetchData(); // Refresh all data from database
  }, [fetchData]);

  return {
    metrics,
    alerts,
    classifiedAlerts,
    sources,
    actions,
    toneStyles,
    recentActivity,
    seoContent,
    negativeContent,
    positiveContent,
    neutralContent,
    loading,
    error,
    fetchData,
    simulateNewData,
  };
};

export { useDashboardData };
export default useDashboardData;
