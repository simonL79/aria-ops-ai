
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
    // Return empty array for now since table doesn't exist yet
    console.log('Model bias profiles not available - table not yet created');
    return [];
  } catch (error) {
    console.error('Error in getModelBiasProfiles:', error);
    return [];
  }
};

export const createModelBiasProfile = async (
  profile: Omit<Partial<ModelBiasProfile>, 'id' | 'created_at' | 'last_verified'> & { entity_name: string }
): Promise<boolean> => {
  try {
    console.log('Creating model bias profile (simulated):', profile);
    toast.success('Model bias profile created successfully (simulated)');
    return true;
  } catch (error) {
    console.error('Error in createModelBiasProfile:', error);
    toast.error('Failed to create bias profile');
    return false;
  }
};

export const getCerebraOverridePackets = async (): Promise<CerebraOverridePacket[]> => {
  try {
    // Return empty array for now since table doesn't exist yet
    console.log('Cerebra override packets not available - table not yet created');
    return [];
  } catch (error) {
    console.error('Error in getCerebraOverridePackets:', error);
    return [];
  }
};

export const createOverridePacket = async (
  packet: Omit<Partial<CerebraOverridePacket>, 'id' | 'created_at'> & { entity_name: string }
): Promise<boolean> => {
  try {
    console.log('Creating override packet (simulated):', packet);
    toast.success('Override packet created successfully (simulated)');
    return true;
  } catch (error) {
    console.error('Error in createOverridePacket:', error);
    toast.error('Failed to create override packet');
    return false;
  }
};

export const deployOverridePacket = async (packetId: string): Promise<boolean> => {
  try {
    console.log('Deploying override packet (simulated):', packetId);
    toast.success('Override packet deployed successfully (simulated)');
    return true;
  } catch (error) {
    console.error('Error in deployOverridePacket:', error);
    toast.error('Failed to deploy override packet');
    return false;
  }
};

export const getAIInfluenceMap = async (): Promise<AIInfluenceMap[]> => {
  try {
    // Return empty array for now since table doesn't exist yet
    console.log('AI influence map not available - table not yet created');
    return [];
  } catch (error) {
    console.error('Error in getAIInfluenceMap:', error);
    return [];
  }
};

export const getCerebraBiasDashboard = async (): Promise<CerebraBiasDashboard[]> => {
  try {
    // Return empty array for now since view doesn't exist yet
    console.log('CEREBRA bias dashboard not available - view not yet created');
    return [];
  } catch (error) {
    console.error('Error in getCerebraBiasDashboard:', error);
    return [];
  }
};

export const getCerebraInfluenceSummary = async (): Promise<CerebraInfluenceSummary[]> => {
  try {
    // Return empty array for now since view doesn't exist yet
    console.log('CEREBRA influence summary not available - view not yet created');
    return [];
  } catch (error) {
    console.error('Error in getCerebraInfluenceSummary:', error);
    return [];
  }
};

export const refreshCerebraViews = async (): Promise<boolean> => {
  try {
    console.log('Refreshing CEREBRA views (simulated)');
    toast.success('CEREBRA views refreshed successfully (simulated)');
    return true;
  } catch (error) {
    console.error('Error in refreshCerebraViews:', error);
    toast.error('Failed to refresh CEREBRA views');
    return false;
  }
};
