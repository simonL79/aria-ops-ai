
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ThreatIngestionItem {
  raw_content: string;
  source: string;
  entity_match?: string;
  risk_score?: number;
}

export const addToThreatQueue = async (item: ThreatIngestionItem) => {
  try {
    const { data, error } = await supabase
      .from('threat_ingestion_queue')
      .insert({
        raw_content: item.raw_content,
        source: item.source,
        entity_match: item.entity_match,
        risk_score: item.risk_score,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    toast.success('Threat added to processing queue');
    return data;
  } catch (error) {
    console.error('Error adding to threat queue:', error);
    toast.error('Failed to add threat to queue');
    throw error;
  }
};

export const getQueueStatus = async () => {
  try {
    const { data, error } = await supabase
      .from('threat_ingestion_queue')
      .select('status, count(*)')
      .group('status');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching queue status:', error);
    return [];
  }
};

export const triggerPipelineProcessing = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('scrape-and-enrich-threat');
    
    if (error) throw error;
    
    toast.success(`Pipeline processing completed: ${data.processed || 0} items processed`);
    return data;
  } catch (error) {
    console.error('Pipeline processing error:', error);
    toast.error('Failed to trigger pipeline processing');
    throw error;
  }
};

export const getLiveThreats = async (entityId?: string) => {
  try {
    let query = supabase
      .from('threats')
      .select('*')
      .eq('is_live', true)
      .order('detected_at', { ascending: false });

    if (entityId) {
      query = query.eq('entity_id', entityId);
    }

    const { data, error } = await query.limit(50);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching live threats:', error);
    return [];
  }
};

export const getSystemHealth = async () => {
  try {
    const { data, error } = await supabase
      .from('system_health_checks')
      .select('*')
      .order('check_time', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching system health:', error);
    return [];
  }
};
