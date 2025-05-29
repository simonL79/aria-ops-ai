
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
    const { data, error } = await supabase
      .from('monitoring_status')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching monitoring status:', error);
      return {
        isActive: false,
        sources: 0,
        platforms: 0,
        lastRun: new Date().toISOString()
      };
    }

    return {
      isActive: data.is_active || false,
      sources: data.sources_count || 0,
      platforms: 5,
      lastRun: data.last_run || new Date().toISOString()
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
    const { error } = await supabase
      .from('monitoring_status')
      .update({ 
        is_active: true, 
        last_run: new Date().toISOString() 
      })
      .eq('id', '1');

    if (error) throw error;
  } catch (error) {
    console.error('Error starting monitoring:', error);
    throw error;
  }
};

export const stopMonitoring = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from('monitoring_status')
      .update({ is_active: false })
      .eq('id', '1');

    if (error) throw error;
  } catch (error) {
    console.error('Error stopping monitoring:', error);
    throw error;
  }
};

export const runMonitoringScan = async (): Promise<ScanResult[]> => {
  try {
    // Trigger the enhanced intelligence edge function for live scanning
    const { data, error } = await supabase.functions.invoke('enhanced-intelligence', {
      body: { 
        scanType: 'live_monitoring',
        enableLiveData: true
      }
    });

    if (error) throw error;

    // Return the live threats as scan results
    const { data: liveThreats, error: threatsError } = await supabase
      .from('threats')
      .select('*')
      .eq('is_live', true)
      .order('detected_at', { ascending: false })
      .limit(20);

    if (threatsError) throw threatsError;

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
    console.error('Error running monitoring scan:', error);
    throw error;
  }
};

export const getMentionsAsAlerts = async (): Promise<ContentAlert[]> => {
  try {
    const { data, error } = await supabase
      .from('threats')
      .select('*')
      .eq('is_live', true)
      .order('detected_at', { ascending: false })
      .limit(50);

    if (error) throw error;

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
    console.error('Error fetching mentions:', error);
    return [];
  }
};

export const updateScanResultStatus = async (id: string, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('threats')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating threat status:', error);
    return false;
  }
};
