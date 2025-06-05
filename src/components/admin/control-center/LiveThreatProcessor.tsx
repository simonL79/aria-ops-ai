
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LiveThreatProcessorProps {
  selectedEntity: string;
  onThreatUpdate: (threats: any[]) => void;
}

const LiveThreatProcessor: React.FC<LiveThreatProcessorProps> = ({
  selectedEntity,
  onThreatUpdate
}) => {
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (selectedEntity) {
      processLiveThreats();
      const interval = setInterval(processLiveThreats, 15000); // Check every 15 seconds
      return () => clearInterval(interval);
    }
  }, [selectedEntity]);

  const processLiveThreats = async () => {
    if (!selectedEntity || processing) return;

    setProcessing(true);
    try {
      // Get live scan results for entity
      const { data: scanResults } = await supabase
        .from('scan_results')
        .select('*')
        .ilike('content', `%${selectedEntity}%`)
        .eq('source_type', 'live_osint')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(20);

      // Get narrative clusters
      const { data: narratives } = await supabase
        .from('narrative_clusters')
        .select('*')
        .eq('entity_name', selectedEntity)
        .order('created_at', { ascending: false })
        .limit(10);

      // Process and format threats
      const processedThreats = [
        ...(scanResults || []).map(result => ({
          id: result.id,
          type: 'scan_result',
          severity: result.severity || 'medium',
          content: result.content,
          platform: result.platform,
          url: result.url,
          timestamp: result.created_at,
          threatLevel: mapSeverityToLevel(result.severity)
        })),
        ...(narratives || []).map(narrative => ({
          id: narrative.id,
          type: 'narrative_cluster',
          severity: narrative.intent_label === 'attack' ? 'high' : 'medium',
          content: narrative.cluster_summary,
          platform: narrative.source_platform,
          timestamp: narrative.created_at,
          threatLevel: narrative.intent_label === 'attack' ? 'high' : 'medium'
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      onThreatUpdate(processedThreats);

      // Log processing
      await supabase.from('aria_ops_log').insert({
        operation_type: 'live_threat_processing',
        entity_name: selectedEntity,
        module_source: 'live_threat_processor',
        success: true,
        operation_data: {
          threats_processed: processedThreats.length,
          scan_results: scanResults?.length || 0,
          narratives: narratives?.length || 0,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Live threat processing failed:', error);
      // Don't show toast for background processing errors
    } finally {
      setProcessing(false);
    }
  };

  const mapSeverityToLevel = (severity: string): string => {
    switch (severity) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      default: return 'low';
    }
  };

  // This component runs in the background
  return null;
};

export default LiveThreatProcessor;
