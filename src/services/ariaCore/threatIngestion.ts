
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
        status: 'pending',
        detected_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    toast.success('Live threat added to processing queue');
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
      .select('status, created_at, source, risk_score')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    
    console.log('Live queue data fetched:', data?.length || 0, 'items');
    
    const statusCounts = data?.reduce((acc: any, item: any) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {}) || {};
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }));
  } catch (error) {
    console.error('Error fetching live queue status:', error);
    return [];
  }
};

export const triggerPipelineProcessing = async () => {
  try {
    console.log('Triggering live pipeline processing...');
    const { data, error } = await supabase.functions.invoke('process-threat-ingestion');
    
    if (error) {
      console.error('Pipeline error:', error);
      throw error;
    }
    
    console.log('Pipeline processing result:', data);
    toast.success(`Live pipeline completed: ${data?.processed || 0} threats processed`);
    return data;
  } catch (error) {
    console.error('Pipeline processing error:', error);
    toast.error('Failed to trigger live pipeline processing');
    throw error;
  }
};

export const getLiveThreats = async (entityId?: string) => {
  try {
    console.log('Fetching live threats from database...');
    
    let query = supabase
      .from('threats')
      .select('*')
      .eq('is_live', true)
      .order('detected_at', { ascending: false });

    if (entityId) {
      query = query.eq('entity_id', entityId);
    }

    const { data, error } = await query.limit(50);

    if (error) {
      console.error('Error fetching live threats:', error);
      throw error;
    }
    
    console.log('Live threats fetched:', data?.length || 0, 'items');
    return data || [];
  } catch (error) {
    console.error('Error fetching live threats:', error);
    return [];
  }
};

export const getSystemHealth = async () => {
  try {
    console.log('Fetching live system health...');
    
    const { data, error } = await supabase
      .from('system_health_checks')
      .select('*')
      .order('check_time', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
    
    console.log('System health data fetched:', data?.length || 0, 'checks');
    
    return data?.map(check => ({
      id: check.id,
      module: check.module,
      status: check.status,
      details: check.details,
      check_time: check.check_time
    })) || [];
  } catch (error) {
    console.error('Error fetching system health:', error);
    return [];
  }
};

// Force live data processing on startup
export const initializeLiveSystem = async () => {
  try {
    console.log('Initializing live A.R.I.A™ system...');
    
    // Trigger threat processing
    await triggerPipelineProcessing();
    
    // Get current queue status
    const queueStatus = await getQueueStatus();
    console.log('Current queue status:', queueStatus);
    
    // Get live threats
    const liveThreats = await getLiveThreats();
    console.log('Current live threats:', liveThreats.length);
    
    return {
      queueStatus,
      liveThreats: liveThreats.length,
      systemInitialized: true
    };
  } catch (error) {
    console.error('Failed to initialize live system:', error);
    throw error;
  }
};
