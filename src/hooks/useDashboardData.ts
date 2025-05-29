
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
      console.log('🔄 A.R.I.A™ LIVE DATA ENFORCEMENT: Fetching ONLY real data...');
      
      // STRICT: Clean any remaining mock/demo/test data
      console.log('🧹 LIVE DATA ENFORCEMENT: Purging all non-live data...');
      await supabase
        .from('scan_results')
        .delete()
        .or('content.ilike.%test%,content.ilike.%mock%,content.ilike.%demo%,content.ilike.%sample%,platform.eq.System,platform.eq.ARIA System,platform.eq.ARIA Monitor');

      await supabase
        .from('content_alerts')
        .delete()
        .or('content.ilike.%test%,content.ilike.%mock%,content.ilike.%demo%,content.ilike.%sample%');
      
      // Fetch ONLY verified live data (excluding any system messages)
      const { data: scanResults, error: scanError } = await supabase
        .from('scan_results')
        .select('*')
        .not('platform', 'eq', 'ARIA System')
        .not('platform', 'eq', 'ARIA Monitor')
        .not('platform', 'eq', 'System')
        .not('threat_type', 'eq', 'system_status')
        .not('threat_type', 'eq', 'monitoring_status')
        .eq('source_type', 'live_api')
        .order('created_at', { ascending: false })
        .limit(50);

      if (scanError) {
        console.error('❌ Error fetching LIVE scan results:', scanError);
        throw new Error(`Failed to fetch LIVE scan results: ${scanError.message}`);
      }

      // Fetch ONLY verified live content alerts
      const { data: contentAlerts, error: alertsError } = await supabase
        .from('content_alerts')
        .select('*')
        .not('platform', 'eq', 'System')
        .not('platform', 'eq', 'ARIA System')
        .eq('source_type', 'live_source')
        .order('created_at', { ascending: false })
        .limit(50);

      if (alertsError) {
        console.error('❌ Error fetching LIVE content alerts:', alertsError);
        throw new Error(`Failed to fetch LIVE content alerts: ${alertsError.message}`);
      }

      // Process ONLY verified live threat data
      const liveScanResults = (scanResults || []).filter(result => 
        result.source_type === 'live_api' &&
        result.platform !== 'ARIA System' && 
        result.platform !== 'System' &&
        result.threat_type !== 'system_status' &&
        result.threat_type !== 'monitoring_status' &&
        !result.content.toLowerCase().includes('scan completed') &&
        !result.content.toLowerCase().includes('clean scan') &&
        !result.content.toLowerCase().includes('test') &&
        !result.content.toLowerCase().includes('demo') &&
        !result.content.toLowerCase().includes('mock')
      );

      const liveContentAlerts = (contentAlerts || []).filter(alert =>
        alert.source_type === 'live_source' &&
        !alert.content.toLowerCase().includes('test') &&
        !alert.content.toLowerCase().includes('demo') &&
        !alert.content.toLowerCase().includes('mock')
      );

      console.log(`📊 LIVE DATA: Found ${liveScanResults.length} verified live scan results`);
      console.log(`📊 LIVE DATA: Found ${liveContentAlerts.length} verified live content alerts`);

      // Convert LIVE scan results to ContentAlert format
      const scanAlerts: ContentAlert[] = liveScanResults.map((result: any) => ({
        id: result.id,
        platform: result.platform || 'Unknown',
        content: result.content || 'No content available',
        date: new Date(result.created_at).toLocaleString(),
        severity: (result.severity as 'high' | 'medium' | 'low') || 'low',
        status: 'new' as const,
        url: result.url || '',
        threatType: result.threat_type || 'unknown',
        sourceType: 'live_scan' as const,
        confidenceScore: result.confidence_score || 85,
        sentiment: result.sentiment > 0 ? 'positive' as const : result.sentiment < -0.2 ? 'negative' as const : 'neutral' as const,
        detectedEntities: Array.isArray(result.detected_entities) 
          ? result.detected_entities.map((e: any) => typeof e === 'string' ? e : e.name || String(e))
          : [],
        potentialReach: result.potential_reach || 0
      }));

      // Convert LIVE content alerts to ContentAlert format
      const formattedContentAlerts: ContentAlert[] = liveContentAlerts.map((alert: any) => ({
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

      // Combine all VERIFIED LIVE alerts
      const allLiveAlerts = [...scanAlerts, ...formattedContentAlerts];
      
      if (allLiveAlerts.length === 0) {
        console.log('ℹ️ A.R.I.A™ LIVE DATA: No live threats detected - system clean and operational');
      } else {
        console.log(`✅ A.R.I.A™ LIVE DATA: Successfully loaded ${allLiveAlerts.length} verified live threats`);
      }
      
      setAlerts(allLiveAlerts);
      setClassifiedAlerts(allLiveAlerts);

      // Calculate metrics from LIVE data only
      const highSeverity = allLiveAlerts.filter(alert => alert.severity === 'high').length;
      const mediumSeverity = allLiveAlerts.filter(alert => alert.severity === 'medium').length;
      const totalReach = allLiveAlerts.reduce((sum, alert) => sum + (alert.potentialReach || 0), 0);
      
      const liveMetrics: MetricValue[] = [
        { id: 'total-threats', title: 'Live Threats', value: allLiveAlerts.length, change: 0, icon: 'alert-triangle', color: 'red' },
        { id: 'high-severity', title: 'High Severity', value: highSeverity, change: 0, icon: 'alert-circle', color: 'red' },
        { id: 'medium-severity', title: 'Medium Severity', value: mediumSeverity, change: 0, icon: 'alert', color: 'yellow' },
        { id: 'total-reach', title: 'Total Reach', value: totalReach, change: 0, icon: 'users', color: 'blue' }
      ];
      
      setMetrics(liveMetrics);

      // Calculate sentiment metrics from LIVE data
      const negative = allLiveAlerts.filter(alert => alert.sentiment === 'negative').length;
      const positive = allLiveAlerts.filter(alert => alert.sentiment === 'positive').length;
      const neutral = allLiveAlerts.filter(alert => alert.sentiment === 'neutral').length;

      setNegativeContent(negative);
      setPositiveContent(positive);
      setNeutralContent(neutral);

      // Set up sources based on LIVE platforms only
      const platformCounts = allLiveAlerts.reduce((acc: any, alert) => {
        acc[alert.platform] = (acc[alert.platform] || 0) + 1;
        return acc;
      }, {});

      const liveSources: ContentSource[] = Object.entries(platformCounts).map(([platform, count]: [string, any]) => ({
        id: platform.toLowerCase(),
        name: platform,
        type: 'live_source',
        status: 'connected',
        lastUpdate: new Date().toISOString(),
        metrics: {
          total: count,
          positive: allLiveAlerts.filter(a => a.platform === platform && a.sentiment === 'positive').length,
          negative: allLiveAlerts.filter(a => a.platform === platform && a.sentiment === 'negative').length,
          neutral: allLiveAlerts.filter(a => a.platform === platform && a.sentiment === 'neutral').length
        }
      }));

      setSources(liveSources);

      // Generate actions from LIVE data only
      const liveActions: ContentAction[] = allLiveAlerts.slice(0, 10).map((alert) => ({
        id: alert.id,
        type: alert.severity === 'high' ? 'urgent' as const : 'monitoring' as const,
        description: `${alert.severity.toUpperCase()} LIVE threat detected on ${alert.platform}`,
        status: 'pending' as const,
        platform: alert.platform,
        timestamp: alert.date
      }));

      setActions(liveActions);
      setRecentActivity(liveActions);

      // Clear any existing error
      setError(null);
      
    } catch (err: any) {
      console.error('❌ Critical error fetching LIVE data:', err);
      setError(`Failed to load LIVE data: ${err.message}`);
      
      // Set empty arrays for live-only enforcement
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

  // Set up real-time subscriptions for LIVE data updates only
  useEffect(() => {
    fetchData();

    // Subscribe to LIVE updates only
    const scanSubscription = supabase
      .channel('live_scan_updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'scan_results',
        filter: 'source_type=eq.live_api'
      }, () => {
        console.log('🔄 New LIVE scan result detected, refreshing dashboard...');
        fetchData();
      })
      .subscribe();

    const alertSubscription = supabase
      .channel('live_alert_updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'content_alerts',
        filter: 'source_type=eq.live_source'
      }, () => {
        console.log('🔄 New LIVE content alert detected, refreshing dashboard...');
        fetchData();
      })
      .subscribe();

    return () => {
      scanSubscription.unsubscribe();
      alertSubscription.unsubscribe();
    };
  }, [fetchData]);

  const simulateNewData = useCallback((scanResults: any[]) => {
    // This now processes ONLY real scan results - no simulation allowed
    if (!scanResults || scanResults.length === 0) return;
    
    console.log('🔄 Processing new LIVE scan results:', scanResults.length);
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
