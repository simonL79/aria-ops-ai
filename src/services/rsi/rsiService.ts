
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RSIThreatSimulation {
  id: string;
  client_id: string;
  threat_topic: string;
  threat_level: number;
  likelihood_score: number;
  simulation_status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface RSIActivationLog {
  id: string;
  client_id: string;
  threat_simulation_id: string;
  trigger_type: string;
  matched_threat: string;
  activation_status: 'initiated' | 'active' | 'completed' | 'failed';
  triggered_at: string;
}

export const triggerRSISimulation = async (threatTopic: string, clientId?: string): Promise<RSIThreatSimulation | null> => {
  try {
    console.log('Triggering RSI simulation via edge function...');
    
    const { data, error } = await supabase.functions.invoke('rsi-threat-simulator', {
      body: {
        threat_topic: threatTopic,
        client_id: clientId,
        simulation_type: 'manual'
      }
    });

    if (error) {
      console.error('RSI simulation edge function error:', error);
      toast.error('Failed to trigger RSI simulation');
      return null;
    }

    toast.success('RSI threat simulation initiated');
    return data?.simulation || null;

  } catch (error) {
    console.error('Error triggering RSI simulation:', error);
    toast.error('RSI simulation failed');
    return null;
  }
};

export const getRSIActivationLogs = async (clientId?: string): Promise<RSIActivationLog[]> => {
  try {
    const query = supabase
      .from('rsi_activation_logs')
      .select('*')
      .order('triggered_at', { ascending: false });

    if (clientId) {
      query.eq('client_id', clientId);
    }

    const { data, error } = await query.limit(50);

    if (error) {
      console.error('Error fetching RSI activation logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRSIActivationLogs:', error);
    return [];
  }
};

export const generateRSIReports = async (campaignId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('executive-reports', {
      body: {
        report_type: 'rsi_effectiveness',
        campaign_id: campaignId
      }
    });

    if (error) {
      console.error('RSI report generation error:', error);
      toast.error('Failed to generate RSI report');
      return null;
    }

    toast.success('RSI effectiveness report generated');
    return data;
  } catch (error) {
    console.error('Error generating RSI reports:', error);
    return null;
  }
};
