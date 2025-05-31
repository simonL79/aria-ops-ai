
import { useState, useEffect } from 'react';
import { performComprehensiveScan } from '@/services/monitoring/monitoringScanService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MetricValue {
  id: string;
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export interface ContentAlert {
  id: string;
  content: string;
  platform: string;
  severity: 'low' | 'medium' | 'high';
  status: 'new' | 'read' | 'actioned' | 'resolved';
  date: string;
  url?: string;
  sourceType?: string;
  detectedEntities?: string[];
  category?: string;
  recommendation?: string;
}

export const useDashboardData = () => {
  const [metrics, setMetrics] = useState<MetricValue[]>([]);
  const [alerts, setAlerts] = useState<ContentAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Fetching A.R.I.A™ intelligence data...');
      
      // Perform comprehensive scan
      const scanResults = await performComprehensiveScan();
      
      // Convert scan results to alerts
      const convertedAlerts: ContentAlert[] = scanResults.map(result => ({
        id: result.id,
        content: result.content,
        platform: result.platform,
        severity: result.severity,
        status: result.status,
        date: new Date(result.created_at).toLocaleDateString(),
        url: result.url,
        sourceType: result.source_type || 'osint_intelligence',
        detectedEntities: result.detected_entities || [],
        category: result.severity === 'high' ? 'Critical' : 
                 result.severity === 'medium' ? 'Warning' : 'Neutral',
        recommendation: result.severity === 'high' ? 'Immediate action required' :
                       result.severity === 'medium' ? 'Monitor closely' : 'Standard monitoring'
      }));
      
      setAlerts(convertedAlerts);
      
      // Generate metrics from results
      const threatCount = scanResults.filter(r => r.severity === 'high').length;
      const mediumThreats = scanResults.filter(r => r.severity === 'medium').length;
      const totalAlerts = scanResults.length;
      const liveDataCount = scanResults.filter(r => 
        r.source_type === 'live_intelligence' || r.source_type === 'osint_intelligence'
      ).length;
      
      const newMetrics: MetricValue[] = [
        {
          id: 'threats',
          title: 'Active Threats',
          value: threatCount,
          icon: 'alert-triangle',
          color: threatCount > 0 ? 'red' : 'green'
        },
        {
          id: 'monitoring',
          title: 'Sources Monitored',
          value: '12+',
          icon: 'search',
          color: 'blue'
        },
        {
          id: 'alerts',
          title: 'Total Alerts',
          value: totalAlerts,
          icon: 'shield',
          color: totalAlerts > 5 ? 'yellow' : 'green'
        },
        {
          id: 'live_data',
          title: 'Live Intelligence',
          value: liveDataCount,
          icon: 'trending-up',
          color: 'green'
        }
      ];
      
      setMetrics(newMetrics);
      
      console.log(`✅ Dashboard data loaded: ${totalAlerts} alerts, ${threatCount} threats`);
      
    } catch (err) {
      console.error('❌ Dashboard data fetch error:', err);
      setError('Failed to load intelligence data. System may be initializing.');
      
      // Set minimal fallback data
      setMetrics([
        { id: 'status', title: 'System Status', value: 'Initializing', icon: 'alert', color: 'yellow' }
      ]);
      setAlerts([]);
      
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 2 minutes
  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, 120000); // 2 minutes
    
    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    alerts,
    loading,
    error,
    fetchData
  };
};
