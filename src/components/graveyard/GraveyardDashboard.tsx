
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import GraveyardHeader from './GraveyardHeader';
import GraveyardStatsOverview from './GraveyardStatsOverview';
import GraveyardMainContent from './GraveyardMainContent';

const GraveyardDashboard = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    activePosts: 0,
    suppressedPosts: 0,
    averageRank: 0
  });
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: scanResults, error } = await supabase
        .from('scan_results')
        .select('*')
        .eq('source_type', 'legacy_content');

      if (error) throw error;

      const total = scanResults?.length || 0;
      const active = scanResults?.filter(r => r.status === 'new').length || 0;
      const suppressed = scanResults?.filter(r => r.status === 'resolved').length || 0;

      setStats({
        totalPosts: total,
        activePosts: active,
        suppressedPosts: suppressed,
        averageRank: total > 0 ? Math.round((active + suppressed) / total * 100) : 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch graveyard statistics');
    } finally {
      setLoading(false);
    }
  };

  const scanForLegacyContent = async () => {
    setIsScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-search-crawler', {
        body: {
          query: 'negative content legacy posts',
          scan_type: 'legacy_content',
          maxResults: 50
        }
      });

      if (error) throw error;

      toast.success(`Legacy content scan completed: ${data?.results?.length || 0} items found`);
      fetchStats();
    } catch (error) {
      console.error('Legacy content scan failed:', error);
      toast.error('Legacy content scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2">Loading GRAVEYARD™ data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GraveyardHeader 
        isScanning={isScanning}
        onScanForLegacyContent={scanForLegacyContent}
      />

      <GraveyardStatsOverview stats={stats} />

      <GraveyardMainContent onStatsChange={fetchStats} />
    </div>
  );
};

export default GraveyardDashboard;
