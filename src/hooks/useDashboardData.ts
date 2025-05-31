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
}

export const useDashboardData = () => {
  const [contentAlerts, setContentAlerts] = useState<ContentAlert[]>([]);
  const [actionItems, setActionItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadContentAlerts(),
        loadActionItems()
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadContentAlerts = async () => {
    try {
      // Use existing scan_results table instead of content_alerts
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .eq('severity', 'high')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const alerts = (data || []).map(item => ({
        id: item.id,
        title: `High severity threat detected`,
        content: item.content || 'Threat content',
        platform: item.platform || 'Unknown',
        severity: item.severity || 'medium',
        timestamp: item.created_at,
        status: item.status || 'new'
      }));

      setContentAlerts(alerts);
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

  return {
    contentAlerts,
    actionItems,
    isLoading,
    refreshData: loadDashboardData
  };
};
