
import { supabase } from '@/integrations/supabase/client';

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
}

export const fetchMetrics = async () => {
  try {
    // Fetch metrics from scan_results
    const { data: scanData, error: scanError } = await supabase
      .from('scan_results')
      .select('severity, status, created_at');

    if (scanError) throw scanError;

    const totalThreats = scanData?.length || 0;
    const highRiskThreats = scanData?.filter(item => item.severity === 'high').length || 0;
    const resolvedThreats = scanData?.filter(item => item.status === 'resolved').length || 0;
    const resolutionRate = totalThreats > 0 ? Math.round((resolvedThreats / totalThreats) * 100) : 0;

    return [
      {
        id: '1',
        title: 'Total Threats',
        value: totalThreats,
        delta: 0,
        icon: 'shield',
        color: 'blue'
      },
      {
        id: '2',
        title: 'High Risk',
        value: highRiskThreats,
        delta: 0,
        icon: 'trending-up',
        color: 'red'
      },
      {
        id: '3',
        title: 'Resolution Rate',
        value: resolutionRate,
        delta: 0,
        icon: 'activity',
        color: 'green'
      },
      {
        id: '4',
        title: 'Active Sources',
        value: 4,
        delta: 0,
        icon: 'trending-up',
        color: 'yellow'
      }
    ];
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return [];
  }
};

export const fetchAlerts = async () => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .eq('severity', 'high')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      title: `High severity threat detected`,
      content: item.content || 'Threat content',
      platform: item.platform || 'Unknown',
      severity: item.severity || 'medium',
      timestamp: item.created_at,
      status: item.status || 'new',
      sentiment: item.sentiment > 0 ? 'positive' : item.sentiment < 0 ? 'negative' : 'neutral',
      date: item.created_at,
      url: item.url || ''
    }));
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
};

export const fetchActionItems = async (): Promise<ActionItem[]> => {
  try {
    // Mock action items since we don't have a dedicated table
    return [
      {
        id: '1',
        title: 'Review High Priority Threats',
        description: 'Multiple high-severity threats require immediate attention',
        priority: 'high',
        status: 'pending',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Update Response Templates',
        description: 'Response templates need updating for new threat types',
        priority: 'medium',
        status: 'in_progress',
        created_at: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error('Error fetching action items:', error);
    return [];
  }
};

export const fetchSources = async () => {
  try {
    // Mock sources data
    return [
      { id: '1', name: 'Reddit OSINT', type: 'osint_source', status: 'active' },
      { id: '2', name: 'News Feeds', type: 'news_source', status: 'active' },
      { id: '3', name: 'Forum Scanner', type: 'forum_source', status: 'active' },
      { id: '4', name: 'RSS Monitor', type: 'rss_source', status: 'active' }
    ];
  } catch (error) {
    console.error('Error fetching sources:', error);
    return [];
  }
};
