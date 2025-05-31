
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchActionItems } from '@/services/api/dashboardApiService';
import type { ContentAlert, ContentSource, ContentAction, MetricValue } from '@/types/dashboard';

interface DashboardMetrics {
  totalThreats: number;
  highRiskThreats: number;
  activeSources: number;
  resolutionRate: number;
}

interface DashboardSource {
  id: string;
  name: string;
  type: string;
  status: string;
}

// ActionItem interface to match the API response
interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
}

export const useDashboardData = () => {
  const [contentAlerts, setContentAlerts] = useState<ContentAlert[]>([]);
  const [actionItems, setActionItems] = useState<ContentAction[]>([]);
  const [metrics, setMetrics] = useState<MetricValue[]>([]);
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        loadContentAlerts(),
        loadActionItems(),
        loadSources()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const loadContentAlerts = async () => {
    try {
      // Use existing scan_results table instead of content_alerts
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const alerts: ContentAlert[] = (data || []).map(item => ({
        id: item.id,
        platform: item.platform || 'Unknown',
        content: item.content || 'Threat content',
        date: new Date(item.created_at).toLocaleDateString(),
        severity: (['high', 'medium', 'low'].includes(item.severity) ? item.severity : 'low') as 'high' | 'medium' | 'low',
        status: (['new', 'read', 'dismissed', 'actioned', 'reviewing', 'resolved'].includes(item.status) ? item.status : 'new') as ContentAlert['status'],
        url: item.url || '',
        sourceType: item.source_type || 'scan_result',
        threatType: item.threat_type || 'reputation_risk',
        confidenceScore: item.confidence_score || 75,
        sentiment: item.sentiment > 0 ? 'positive' : item.sentiment < 0 ? 'negative' : 'neutral',
        potentialReach: item.potential_reach || 0,
        detectedEntities: Array.isArray(item.detected_entities) ? 
          item.detected_entities.map(String) : []
      }));

      setContentAlerts(alerts);
      
      // Calculate metrics
      const totalThreats = alerts.length;
      const highRiskThreats = alerts.filter(alert => alert.severity === 'high').length;
      const resolvedThreats = alerts.filter(alert => alert.status === 'resolved').length;
      const resolutionRate = totalThreats > 0 ? Math.round((resolvedThreats / totalThreats) * 100) : 0;
      
      // Convert DashboardMetrics to MetricValue array
      const metricsArray: MetricValue[] = [
        { 
          id: "1", 
          title: "Total Threats", 
          value: totalThreats, 
          change: 0, 
          icon: "trending-up", 
          color: "blue" 
        },
        { 
          id: "2", 
          title: "High Risk", 
          value: highRiskThreats, 
          change: 0, 
          icon: "trending-down", 
          color: "red" 
        },
        { 
          id: "3", 
          title: "Active Sources", 
          value: sources.length, 
          change: 0, 
          icon: "trending-up", 
          color: "green" 
        },
        { 
          id: "4", 
          title: "Resolution Rate", 
          value: resolutionRate, 
          change: 0, 
          icon: "trending-up", 
          color: "yellow" 
        }
      ];
      
      setMetrics(metricsArray);
    } catch (error) {
      console.error('Error loading content alerts:', error);
    }
  };

  const loadActionItems = async () => {
    try {
      const items = await fetchActionItems();
      
      // Convert ActionItem[] to ContentAction[] with correct status mapping
      const contentActions: ContentAction[] = items.map((item: ActionItem) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        priority: item.priority,
        status: item.status === 'in_progress' ? 'pending' : 
                item.status === 'completed' ? 'completed' : 'failed',
        type: 'urgent' as const,
        platform: 'system' as const,
        timestamp: item.created_at
      }));
      
      setActionItems(contentActions);
    } catch (error) {
      console.error('Error loading action items:', error);
    }
  };

  const loadSources = async () => {
    try {
      // Mock sources data since we don't have a sources table
      const mockSources: ContentSource[] = [
        { 
          id: '1', 
          name: 'Reddit OSINT', 
          type: 'osint_source', 
          status: 'good',
          lastUpdate: new Date().toLocaleDateString(),
          metrics: { total: 0, positive: 0, negative: 0, neutral: 0 }
        },
        { 
          id: '2', 
          name: 'News Feeds', 
          type: 'news_source', 
          status: 'good',
          lastUpdate: new Date().toLocaleDateString(),
          metrics: { total: 0, positive: 0, negative: 0, neutral: 0 }
        },
        { 
          id: '3', 
          name: 'Forum Scanner', 
          type: 'forum_source', 
          status: 'good',
          lastUpdate: new Date().toLocaleDateString(),
          metrics: { total: 0, positive: 0, negative: 0, neutral: 0 }
        },
        { 
          id: '4', 
          name: 'RSS Monitor', 
          type: 'rss_source', 
          status: 'good',
          lastUpdate: new Date().toLocaleDateString(),
          metrics: { total: 0, positive: 0, negative: 0, neutral: 0 }
        }
      ];
      setSources(mockSources);
    } catch (error) {
      console.error('Error loading sources:', error);
    }
  };

  const fetchData = loadDashboardData;

  // Create aliases for different property names used across components
  const alerts = contentAlerts;
  const actions = actionItems;

  return {
    // Original properties
    contentAlerts,
    actionItems,
    isLoading,
    refreshData: loadDashboardData,
    
    // Additional properties expected by other components
    alerts,
    actions,
    metrics,
    sources,
    loading,
    error,
    fetchData
  };
};
