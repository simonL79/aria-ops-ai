
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ModelBiasProfile {
  id: string;
  entity_name: string;
  model?: string;
  factual_accuracy_score?: number;
  tone?: string;
  memory_extracted?: boolean;
  bias_level?: number;
  notes?: string;
  last_verified: string;
  created_at: string;
}

export interface CerebraOverridePacket {
  id: string;
  entity_name?: string;
  override_prompt?: string;
  context_type?: string;
  target_model?: string;
  effectiveness_score?: number;
  deployed_at?: string;
  created_at: string;
  status: string;
}

export interface AIInfluenceMap {
  id: string;
  entity_name?: string;
  source_platform?: string;
  echo_type?: string;
  matched_content?: string;
  visibility_score?: number;
  ai_model_origin?: string;
  captured_at: string;
  verified?: boolean;
}

export interface CerebraCorrectionHistory {
  id: string;
  entity_name?: string;
  target_model?: string;
  before_response?: string;
  after_response?: string;
  correction_type?: string;
  success?: boolean;
  corrected_at: string;
  override_packet_id?: string;
}

export interface CerebraBiasDashboard {
  entity_name: string;
  model: string;
  avg_accuracy: number;
  avg_bias: number;
  critical_mentions: number;
  inaccuracies: number;
  total_profiles: number;
  last_checked: string;
  first_detected: string;
}

export interface CerebraInfluenceSummary {
  entity_name: string;
  total_echoes: number;
  peak_visibility: number;
  hallucinated_mentions: number;
  direct_quotes: number;
  ai_summaries: number;
  spread_channels: number;
  model_sources: number;
  latest_detection: string;
}

export const getModelBiasProfiles = async (): Promise<ModelBiasProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('model_bias_profile')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching model bias profiles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getModelBiasProfiles:', error);
    return [];
  }
};

export const createModelBiasProfile = async (
  profile: Omit<Partial<ModelBiasProfile>, 'id' | 'created_at' | 'last_verified'> & { entity_name: string }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('model_bias_profile')
      .insert([profile]);

    if (error) {
      console.error('Error creating model bias profile:', error);
      toast.error('Failed to create bias profile');
      return false;
    }

    toast.success('Model bias profile created successfully');
    return true;
  } catch (error) {
    console.error('Error in createModelBiasProfile:', error);
    toast.error('Failed to create bias profile');
    return false;
  }
};

export const getCerebraOverridePackets = async (): Promise<CerebraOverridePacket[]> => {
  try {
    const { data, error } = await supabase
      .from('cerebra_override_packets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching override packets:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCerebraOverridePackets:', error);
    return [];
  }
};

export const createOverridePacket = async (
  packet: Omit<Partial<CerebraOverridePacket>, 'id' | 'created_at'> & { entity_name: string }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cerebra_override_packets')
      .insert([packet]);

    if (error) {
      console.error('Error creating override packet:', error);
      toast.error('Failed to create override packet');
      return false;
    }

    toast.success('Override packet created successfully');
    return true;
  } catch (error) {
    console.error('Error in createOverridePacket:', error);
    toast.error('Failed to create override packet');
    return false;
  }
};

export const deployOverridePacket = async (packetId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cerebra_override_packets')
      .update({ 
        status: 'deployed',
        deployed_at: new Date().toISOString()
      })
      .eq('id', packetId);

    if (error) {
      console.error('Error deploying override packet:', error);
      toast.error('Failed to deploy override packet');
      return false;
    }

    toast.success('Override packet deployed successfully');
    return true;
  } catch (error) {
    console.error('Error in deployOverridePacket:', error);
    toast.error('Failed to deploy override packet');
    return false;
  }
};

export const getAIInfluenceMap = async (): Promise<AIInfluenceMap[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_influence_map')
      .select('*')
      .order('captured_at', { ascending: false });

    if (error) {
      console.error('Error fetching AI influence map:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAIInfluenceMap:', error);
    return [];
  }
};

export const getCerebraBiasDashboard = async (): Promise<CerebraBiasDashboard[]> => {
  try {
    const { data, error } = await supabase
      .from('cerebra_bias_dashboard')
      .select('*');

    if (error) {
      console.error('Error fetching CEREBRA bias dashboard:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCerebraBiasDashboard:', error);
    return [];
  }
};

export const getCerebraInfluenceSummary = async (): Promise<CerebraInfluenceSummary[]> => {
  try {
    const { data, error } = await supabase
      .from('cerebra_influence_summary')
      .select('*');

    if (error) {
      console.error('Error fetching CEREBRA influence summary:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCerebraInfluenceSummary:', error);
    return [];
  }
};

export const refreshCerebraViews = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('refresh_cerebra_views');

    if (error) {
      console.error('Error refreshing CEREBRA views:', error);
      toast.error('Failed to refresh CEREBRA views');
      return false;
    }

    toast.success('CEREBRA views refreshed successfully');
    return true;
  } catch (error) {
    console.error('Error in refreshCerebraViews:', error);
    toast.error('Failed to refresh CEREBRA views');
    return false;
  }
};
