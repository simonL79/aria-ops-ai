
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
      console.log('🔄 Fetching real data from database...');
      
      // Fetch real scan results
      const { data: scanResults, error: scanError } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (scanError) {
        console.error('❌ Error fetching scan results:', scanError);
        throw new Error(`Failed to fetch scan results: ${scanError.message}`);
      }

      // Fetch real content alerts
      const { data: contentAlerts, error: alertsError } = await supabase
        .from('content_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (alertsError) {
        console.error('❌ Error fetching content alerts:', alertsError);
        throw new Error(`Failed to fetch content alerts: ${alertsError.message}`);
      }

      // Convert scan results to ContentAlert format
      const scanAlerts: ContentAlert[] = (scanResults || []).map((result: any) => ({
        id: result.id,
        platform: result.platform || 'Unknown',
        content: result.content || 'No content available',
        date: new Date(result.created_at).toLocaleString(),
        severity: (result.severity as 'high' | 'medium' | 'low') || 'low',
        status: 'new' as const,
        url: result.url || '',
        threatType: result.threat_type || 'unknown',
        sourceType: 'scan' as const,
        confidenceScore: result.confidence_score || 75,
        sentiment: result.sentiment > 0 ? 'positive' as const : result.sentiment < -0.2 ? 'negative' as const : 'neutral' as const,
        detectedEntities: Array.isArray(result.detected_entities) 
          ? result.detected_entities.map((e: any) => typeof e === 'string' ? e : e.name || String(e))
          : [],
        potentialReach: result.potential_reach || 0
      }));

      // Convert content alerts to ContentAlert format
      const formattedContentAlerts: ContentAlert[] = (contentAlerts || []).map((alert: any) => ({
        id: alert.id,
        platform: alert.platform || 'Unknown',
        content: alert.content || 'No content available',
        date: new Date(alert.created_at).toLocaleString(),
        severity: (alert.severity as 'high' | 'medium' | 'low') || 'low',
        status: 'new' as const,
        url: alert.url || '',
        threatType: alert.threat_type || 'unknown',
        sourceType: alert.source_type || 'alert',
        confidenceScore: alert.confidence_score || 75,
        sentiment: alert.sentiment > 0 ? 'positive' as const : alert.sentiment < -0.2 ? 'negative' as const : 'neutral' as const,
        detectedEntities: Array.isArray(alert.detected_entities) 
          ? alert.detected_entities.map((e: any) => typeof e === 'string' ? e : e.name || String(e))
          : [],
        potentialReach: alert.potential_reach || 0
      }));

      // Combine all alerts
      const allAlerts = [...scanAlerts, ...formattedContentAlerts];
      
      console.log(`✅ Successfully loaded ${allAlerts.length} real alerts from database`);
      
      setAlerts(allAlerts);
      setClassifiedAlerts(allAlerts);

      // Calculate real metrics from the actual data - using correct MetricValue structure
      const highSeverity = allAlerts.filter(alert => alert.severity === 'high').length;
      const mediumSeverity = allAlerts.filter(alert => alert.severity === 'medium').length;
      const totalReach = allAlerts.reduce((sum, alert) => sum + (alert.potentialReach || 0), 0);
      
      const realMetrics: MetricValue[] = [
        { id: 'total-threats', title: 'Total Threats', value: allAlerts.length, change: 0, icon: 'alert-triangle', color: 'red' },
        { id: 'high-severity', title: 'High Severity', value: highSeverity, change: 0, icon: 'alert-circle', color: 'red' },
        { id: 'medium-severity', title: 'Medium Severity', value: mediumSeverity, change: 0, icon: 'alert', color: 'yellow' },
        { id: 'total-reach', title: 'Total Reach', value: totalReach, change: 0, icon: 'users', color: 'blue' }
      ];
      
      setMetrics(realMetrics);

      // Calculate sentiment metrics from real data
      const negative = allAlerts.filter(alert => alert.sentiment === 'negative').length;
      const positive = allAlerts.filter(alert => alert.sentiment === 'positive').length;
      const neutral = allAlerts.filter(alert => alert.sentiment === 'neutral').length;

      setNegativeContent(negative);
      setPositiveContent(positive);
      setNeutralContent(neutral);

      // Set up real sources based on actual platforms found - using correct ContentSource structure
      const platformCounts = allAlerts.reduce((acc: any, alert) => {
        acc[alert.platform] = (acc[alert.platform] || 0) + 1;
        return acc;
      }, {});

      const realSources: ContentSource[] = Object.entries(platformCounts).map(([platform, count]: [string, any]) => ({
        id: platform.toLowerCase(),
        name: platform,
        type: 'social',
        status: 'connected',
        lastUpdate: new Date().toISOString(),
        metrics: {
          total: count,
          positive: allAlerts.filter(a => a.platform === platform && a.sentiment === 'positive').length,
          negative: allAlerts.filter(a => a.platform === platform && a.sentiment === 'negative').length,
          neutral: allAlerts.filter(a => a.platform === platform && a.sentiment === 'neutral').length
        }
      }));

      setSources(realSources);

      // Generate real actions from the data
      const realActions: ContentAction[] = allAlerts.slice(0, 10).map((alert) => ({
        id: alert.id,
        type: alert.severity === 'high' ? 'urgent' as const : 'monitoring' as const,
        description: `${alert.severity.toUpperCase()} threat detected on ${alert.platform}`,
        status: 'pending' as const,
        platform: alert.platform,
        timestamp: alert.date
      }));

      setActions(realActions);
      setRecentActivity(realActions);

      // Clear any existing error
      setError(null);
      
    } catch (err: any) {
      console.error('❌ Critical error fetching real data:', err);
      setError(`Failed to load real data: ${err.message}`);
      
      // Don't fall back to mock data - show the error instead
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

  // Set up real-time subscriptions for live data updates
  useEffect(() => {
    fetchData();

    // Subscribe to real-time updates
    const scanSubscription = supabase
      .channel('dashboard_scan_updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'scan_results'
      }, () => {
        console.log('🔄 New scan result detected, refreshing dashboard...');
        fetchData();
      })
      .subscribe();

    const alertSubscription = supabase
      .channel('dashboard_alert_updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'content_alerts'
      }, () => {
        console.log('🔄 New content alert detected, refreshing dashboard...');
        fetchData();
      })
      .subscribe();

    return () => {
      scanSubscription.unsubscribe();
      alertSubscription.unsubscribe();
    };
  }, [fetchData]);

  const simulateNewData = useCallback((scanResults: any[]) => {
    // This now processes real scan results, not mock data
    if (!scanResults || scanResults.length === 0) return;
    
    console.log('🔄 Processing new real scan results:', scanResults.length);
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
