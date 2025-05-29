
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
    // For now, add to scan_results table until new schema is available
    const { data, error } = await supabase
      .from('scan_results')
      .insert({
        content: item.raw_content,
        platform: item.source,
        severity: item.risk_score && item.risk_score > 70 ? 'high' : 
                 item.risk_score && item.risk_score > 40 ? 'medium' : 'low',
        status: 'new',
        threat_type: 'reputation_risk',
        sentiment: 0,
        url: ''
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
      .from('scan_results')
      .select('status')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    
    // Count by status
    const statusCounts = data?.reduce((acc: any, item: any) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(statusCounts || {}).map(([status, count]) => ({
      status,
      count
    }));
  } catch (error) {
    console.error('Error fetching queue status:', error);
    return [];
  }
};

export const triggerPipelineProcessing = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('scrape-and-enrich-threat');
    
    if (error) throw error;
    
    toast.success(`Pipeline processing completed: ${data?.processed || 0} items processed`);
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
      .from('scan_results')
      .select('*')
      .in('severity', ['high', 'medium'])
      .order('created_at', { ascending: false });

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
    // Check recent scan activity as a health indicator
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    
    // Generate health status based on recent activity
    const recentActivity = data?.filter(item => 
      new Date(item.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    
    return [{
      id: '1',
      module: 'scanning',
      status: recentActivity?.length > 0 ? 'healthy' : 'warning',
      details: `${recentActivity?.length || 0} scans in last 24 hours`,
      check_time: new Date().toISOString()
    }];
  } catch (error) {
    console.error('Error fetching system health:', error);
    return [];
  }
};
