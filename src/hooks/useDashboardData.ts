
import { useState, useEffect } from 'react';
import { performComprehensiveScan } from '@/services/monitoring/monitoringScanService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MetricValue {
  id: string;
  title: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
  delta: number;
  deltaType: 'increase' | 'decrease';
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
  threatType?: string;
  confidenceScore?: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  potentialReach?: number;
}

export interface ContentSource {
  id: string;
  name: string;
  type: string;
  status: 'critical' | 'good' | 'warning';
  lastUpdate: string;
  metrics: {
    total: number;
    positive: number;
    negative: number;
    neutral: number;
  };
  positiveRatio: number;
  total: number;
  active: boolean;
  lastUpdated: string;
  mentionCount: number;
  sentiment: number;
}

export interface ContentAction {
  id: string;
  type: 'urgent' | 'monitoring' | 'response';
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  platform: string;
  action: string;
  date: string;
}

export const useDashboardData = () => {
  const [metrics, setMetrics] = useState<MetricValue[]>([]);
  const [alerts, setAlerts] = useState<ContentAlert[]>([]);
  const [classifiedAlerts, setClassifiedAlerts] = useState<ContentAlert[]>([]);
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [actions, setActions] = useState<ContentAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Content categorization
  const negativeContent = alerts.filter(alert => alert.sentiment === 'negative');
  const positiveContent = alerts.filter(alert => alert.sentiment === 'positive');
  const neutralContent = alerts.filter(alert => alert.sentiment === 'neutral');

  // Mock data for missing properties
  const toneStyles = [];
  const recentActivity = [];
  const seoContent = [];

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
        detectedEntities: Array.isArray(result.detected_entities) ? 
          result.detected_entities.map(entity => String(entity)) : [],
        category: result.severity === 'high' ? 'Critical' : 
                 result.severity === 'medium' ? 'Warning' : 'Neutral',
        recommendation: result.severity === 'high' ? 'Immediate action required' :
                       result.severity === 'medium' ? 'Monitor closely' : 'Standard monitoring',
        threatType: 'live_intelligence',
        confidenceScore: result.confidence_score || 75,
        sentiment: 'neutral',
        potentialReach: 0
      }));
      
      setAlerts(convertedAlerts);
      setClassifiedAlerts(convertedAlerts);
      
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
          change: 0,
          icon: 'alert-triangle',
          color: threatCount > 0 ? 'red' : 'green',
          delta: 0,
          deltaType: 'increase'
        },
        {
          id: 'monitoring',
          title: 'Sources Monitored',
          value: '12+',
          change: 0,
          icon: 'search',
          color: 'blue',
          delta: 0,
          deltaType: 'increase'
        },
        {
          id: 'alerts',
          title: 'Total Alerts',
          value: totalAlerts,
          change: 0,
          icon: 'shield',
          color: totalAlerts > 5 ? 'yellow' : 'green',
          delta: 0,
          deltaType: 'increase'
        },
        {
          id: 'live_data',
          title: 'Live Intelligence',
          value: liveDataCount,
          change: 0,
          icon: 'trending-up',
          color: 'green',
          delta: 0,
          deltaType: 'increase'
        }
      ];
      
      setMetrics(newMetrics);
      
      // Set default sources
      setSources([
        {
          id: '1',
          name: 'Reddit OSINT',
          type: 'osint_source',
          status: 'good',
          lastUpdate: new Date().toLocaleDateString(),
          metrics: { total: totalAlerts, positive: 0, negative: 0, neutral: totalAlerts },
          positiveRatio: 0,
          total: totalAlerts,
          active: true,
          lastUpdated: new Date().toLocaleDateString(),
          mentionCount: totalAlerts,
          sentiment: 0
        }
      ]);

      // Set default actions
      setActions([]);
      
      console.log(`✅ Dashboard data loaded: ${totalAlerts} alerts, ${threatCount} threats`);
      
    } catch (err) {
      console.error('❌ Dashboard data fetch error:', err);
      setError('Failed to load intelligence data. System may be initializing.');
      
      // Set minimal fallback data
      setMetrics([
        { 
          id: 'status', 
          title: 'System Status', 
          value: 'Initializing', 
          change: 0,
          icon: 'alert', 
          color: 'yellow',
          delta: 0,
          deltaType: 'increase'
        }
      ]);
      setAlerts([]);
      setClassifiedAlerts([]);
      setSources([]);
      setActions([]);
      
    } finally {
      setLoading(false);
    }
  };

  const simulateNewData = () => {
    console.log('Simulate new data called');
    fetchData();
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
    simulateNewData
  };
};
