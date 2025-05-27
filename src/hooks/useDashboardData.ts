
import { useState, useEffect, useCallback } from "react";
import {
  ContentAlert,
  ContentSource,
  ContentAction,
  MetricValue,
  ResponseToneStyle,
  SeoContent as SeoContentType,
} from "@/types/dashboard";
import { 
  fetchRealAlerts, 
  fetchRealSources, 
  fetchRealActions, 
  fetchRealMetrics 
} from "@/data/mockDashboardData";

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
    try {
      const [
        metricsData,
        alertsData,
        sourcesData,
        actionsData,
      ] = await Promise.all([
        fetchRealMetrics(),
        fetchRealAlerts(),
        fetchRealSources(),
        fetchRealActions(),
      ]);

      setMetrics(metricsData);
      setAlerts(alertsData);
      setClassifiedAlerts(alertsData);
      setSources(sourcesData);
      setActions(actionsData);
      setRecentActivity(actionsData);
      setSeoContent([]);

      // Calculate content metrics from real data
      const negative = alertsData.filter(
        (alert) => alert.sentiment === "negative"
      ).length;
      const positive = alertsData.filter(
        (alert) => alert.sentiment === "positive"
      ).length;
      const neutral = alertsData.filter(
        (alert) => alert.sentiment === "neutral"
      ).length;

      setNegativeContent(negative);
      setPositiveContent(positive);
      setNeutralContent(neutral);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const simulateNewData = useCallback((scanResults: any[]) => {
    if (!scanResults || scanResults.length === 0) return;
    
    const newAlerts = scanResults.map((result: any) => ({
      id: result.id,
      platform: result.platform,
      content: result.content,
      date: new Date(result.date || result.created_at).toLocaleString(),
      severity: result.severity,
      status: result.status,
      threatType: result.threatType || result.threat_type,
      confidenceScore: result.confidenceScore || result.confidence_score || 75,
      sourceType: result.sourceType || result.source_type || 'scan',
      sentiment: result.sentiment || 'neutral',
      potentialReach: result.potentialReach || result.potential_reach || 0,
      detectedEntities: result.detectedEntities || result.detected_entities || [],
      url: result.url || '',
      source_credibility_score: result.source_credibility_score,
      media_is_ai_generated: result.media_is_ai_generated,
      ai_detection_confidence: result.ai_detection_confidence,
      incident_playbook: result.incident_playbook
    }));
    
    setAlerts(prev => [...newAlerts, ...prev]);
    setClassifiedAlerts(prev => [...newAlerts, ...prev]);
    
    const newNegativeCount = scanResults.filter((r: any) => r.severity === 'high').length;
    setNegativeContent(prev => prev + newNegativeCount);
  }, []);

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
