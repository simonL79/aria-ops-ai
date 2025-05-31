
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchActionItems } from '@/services/api/dashboardApiService';

interface ContentAlert {
  id: string;
  title: string;
  content: string;
  platform: string;
  severity: string;
  timestamp: string;
  status: string;
  sentiment?: string;
  url?: string;
  date: string;
}

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

export const useDashboardData = () => {
  const [contentAlerts, setContentAlerts] = useState<ContentAlert[]>([]);
  const [actionItems, setActionItems] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalThreats: 0,
    highRiskThreats: 0,
    activeSources: 0,
    resolutionRate: 0
  });
  const [sources, setSources] = useState<DashboardSource[]>([]);
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

      const alerts = (data || []).map(item => ({
        id: item.id,
        title: `Threat detected: ${item.platform || 'Unknown'}`,
        content: item.content || 'Threat content',
        platform: item.platform || 'Unknown',
        severity: item.severity || 'medium',
        timestamp: item.created_at,
        status: item.status || 'new',
        sentiment: item.sentiment ? (item.sentiment > 0 ? 'positive' : item.sentiment < 0 ? 'negative' : 'neutral') : 'neutral',
        url: item.url || '',
        date: item.created_at
      }));

      setContentAlerts(alerts);
      
      // Calculate metrics
      const totalThreats = alerts.length;
      const highRiskThreats = alerts.filter(alert => alert.severity === 'high').length;
      const resolvedThreats = alerts.filter(alert => alert.status === 'resolved').length;
      const resolutionRate = totalThreats > 0 ? Math.round((resolvedThreats / totalThreats) * 100) : 0;
      
      setMetrics({
        totalThreats,
        highRiskThreats,
        activeSources: sources.length,
        resolutionRate
      });
    } catch (error) {
      console.error('Error loading content alerts:', error);
    }
  };

  const loadActionItems = async () => {
    try {
      const items = await fetchActionItems();
      setActionItems(items);
    } catch (error) {
      console.error('Error loading action items:', error);
    }
  };

  const loadSources = async () => {
    try {
      // Mock sources data since we don't have a sources table
      const mockSources = [
        { id: '1', name: 'Reddit OSINT', type: 'osint_source', status: 'active' },
        { id: '2', name: 'News Feeds', type: 'news_source', status: 'active' },
        { id: '3', name: 'Forum Scanner', type: 'forum_source', status: 'active' },
        { id: '4', name: 'RSS Monitor', type: 'rss_source', status: 'active' }
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
