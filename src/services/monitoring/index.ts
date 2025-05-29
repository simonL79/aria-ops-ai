
import { supabase } from "@/integrations/supabase/client";
import { ContentAlert } from "@/types/dashboard";

export interface MonitoringStatus {
  isActive: boolean;
  sources: number;
  platforms: number;
  lastRun: string;
}

export interface ScanResult {
  id: string;
  platform: string;
  content: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  status: string;
  threatType?: string;
  sourceType?: string;
  confidenceScore?: number;
  sentiment?: number;
  detectedEntities?: string[];
  url?: string;
  source_credibility_score?: number;
  media_is_ai_generated?: boolean;
  ai_detection_confidence?: number;
  incident_playbook?: string;
  category?: string;
  potentialReach?: number;
}

export const getMonitoringStatus = async (): Promise<MonitoringStatus> => {
  try {
    console.log('Fetching live monitoring status...');
    
    const { data, error } = await supabase
      .from('live_status')
      .select('*')
      .single();

    if (error) {
      console.log('Creating initial monitoring status...');
      // Create initial status if it doesn't exist
      const { data: newStatus, error: insertError } = await supabase
        .from('live_status')
        .insert({
          name: 'Live Monitoring',
          active_threats: 0,
          last_threat_seen: new Date().toISOString(),
          last_report: new Date().toISOString(),
          system_status: 'LIVE'
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating monitoring status:', insertError);
        return {
          isActive: true,
          sources: 0,
          platforms: 5,
          lastRun: new Date().toISOString()
        };
      }
      
      return {
        isActive: true,
        sources: 0,
        platforms: 5,
        lastRun: newStatus.last_report || new Date().toISOString()
      };
    }

    console.log('Live monitoring status retrieved:', data);
    
    return {
      isActive: data.system_status === 'LIVE',
      sources: data.active_threats || 0,
      platforms: 5,
      lastRun: data.last_report || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting monitoring status:', error);
    return {
      isActive: false,
      sources: 0,
      platforms: 0,
      lastRun: new Date().toISOString()
    };
  }
};

export const startMonitoring = async (): Promise<void> => {
  try {
    console.log('Starting live monitoring...');
    
    const { error } = await supabase
      .from('live_status')
      .upsert({
        name: 'Live Monitoring',
        active_threats: 0,
        last_threat_seen: new Date().toISOString(),
        last_report: new Date().toISOString(),
        system_status: 'LIVE'
      }, { onConflict: 'name' });

    if (error) throw error;
    
    console.log('Live monitoring started successfully');
  } catch (error) {
    console.error('Error starting monitoring:', error);
    throw error;
  }
};

export const stopMonitoring = async (): Promise<void> => {
  try {
    console.log('Stopping live monitoring...');
    
    const { error } = await supabase
      .from('live_status')
      .update({ 
        system_status: 'STALE',
        last_report: new Date().toISOString()
      })
      .eq('name', 'Live Monitoring');

    if (error) throw error;
    
    console.log('Live monitoring stopped');
  } catch (error) {
    console.error('Error stopping monitoring:', error);
    throw error;
  }
};

export const runMonitoringScan = async (): Promise<ScanResult[]> => {
  try {
    console.log('Running live monitoring scan...');
    
    // Trigger the threat processing pipeline
    const { data: pipelineData, error: pipelineError } = await supabase.functions.invoke('process-threat-ingestion');
    
    if (pipelineError) {
      console.error('Pipeline error:', pipelineError);
    } else {
      console.log('Pipeline processing completed:', pipelineData);
    }

    // Get live threats from the database
    const { data: liveThreats, error: threatsError } = await supabase
      .from('threats')
      .select('*')
      .eq('is_live', true)
      .order('detected_at', { ascending: false })
      .limit(20);

    if (threatsError) {
      console.error('Error fetching live threats:', threatsError);
      throw threatsError;
    }

    console.log('Live threats retrieved:', liveThreats?.length || 0);

    return liveThreats?.map(threat => ({
      id: threat.id,
      platform: threat.source,
      content: threat.content,
      date: threat.detected_at,
      severity: threat.risk_score > 70 ? 'high' : threat.risk_score > 40 ? 'medium' : 'low',
      status: threat.status,
      threatType: threat.threat_type,
      sourceType: 'live_scan',
      confidenceScore: Math.round(threat.risk_score),
      sentiment: threat.sentiment === 'positive' ? 1 : threat.sentiment === 'negative' ? -1 : 0,
      detectedEntities: [],
      url: '',
      potentialReach: 0
    })) || [];
  } catch (error) {
    console.error('Error running live monitoring scan:', error);
    throw error;
  }
};

export const getMentionsAsAlerts = async (): Promise<ContentAlert[]> => {
  try {
    console.log('Fetching live mentions as alerts...');
    
    const { data, error } = await supabase
      .from('threats')
      .select('*')
      .eq('is_live', true)
      .order('detected_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching live mentions:', error);
      throw error;
    }

    console.log('Live mentions retrieved:', data?.length || 0);

    return data?.map(threat => ({
      id: threat.id,
      platform: threat.source,
      content: threat.content,
      date: threat.detected_at,
      severity: threat.risk_score > 70 ? 'high' : threat.risk_score > 40 ? 'medium' : 'low',
      status: threat.status === 'resolved' ? 'resolved' : 'new',
      url: '',
      threatType: threat.threat_type,
      detectedEntities: [],
      sourceType: 'live_scan',
      confidenceScore: Math.round(threat.risk_score),
      sentiment: threat.sentiment === 'positive' ? 'positive' : threat.sentiment === 'negative' ? 'negative' : 'neutral'
    })) || [];
  } catch (error) {
    console.error('Error fetching live mentions:', error);
    return [];
  }
};

export const updateScanResultStatus = async (id: string, status: string): Promise<boolean> => {
  try {
    console.log('Updating threat status:', id, status);
    
    const { error } = await supabase
      .from('threats')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating threat status:', error);
      throw error;
    }
    
    console.log('Threat status updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating threat status:', error);
    return false;
  }
};
