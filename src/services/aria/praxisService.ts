
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface InternalBehaviorSignal {
  id: string;
  entity_name?: string;
  signal_type?: string;
  signal_value?: string;
  severity?: number;
  captured_at: string;
  notes?: string;
  source?: string;
  metadata?: Record<string, any>;
}

export interface ToneDriftProfile {
  id: string;
  entity_name?: string;
  reference_period?: string;
  baseline_tone?: string;
  recent_tone?: string;
  drift_score?: number;
  deviation_keywords?: string[];
  created_at: string;
  updated_at: string;
  confidence_level?: number;
}

export interface PraxisRiskArchetype {
  id: string;
  entity_name?: string;
  forecast_type?: string;
  confidence_score?: number;
  supporting_signals?: string[];
  drift_score?: number;
  likely_visibility?: string;
  predicted_window?: string;
  triggered_at: string;
  status?: string;
  risk_level?: string;
  mitigation_suggested?: string;
  last_updated: string;
}

export interface PraxisCrisisSimulation {
  id: string;
  archetype_id?: string;
  entity_name?: string;
  simulated_narrative?: string;
  rsi_simulation_id?: string;
  outcome_projection?: string;
  triggered_by?: string;
  created_at: string;
  simulation_status?: string;
  effectiveness_score?: number;
  notes?: string;
}

export interface PraxisSignalCorrelation {
  id: string;
  entity_name?: string;
  signal_combination?: string[];
  correlation_strength?: number;
  forecast_type?: string;
  historical_accuracy?: number;
  created_at: string;
}

export interface PraxisForecastDashboard {
  entity_name: string;
  forecast_type: string;
  confidence_score: number;
  likely_visibility: string;
  risk_level: string;
  status: string;
  crisis_simulated: number;
  last_triggered: string;
  last_updated: string;
  active_signals: number;
}

export interface PraxisSignalTrend {
  entity_name: string;
  signal_type: string;
  signal_count: number;
  avg_severity: number;
  peak_severity: number;
  first_detected: string;
  latest_signal: string;
  trend_duration_days: number;
}

export const getInternalBehaviorSignals = async (): Promise<InternalBehaviorSignal[]> => {
  try {
    const { data, error } = await supabase
      .from('internal_behavior_signals')
      .select('*')
      .order('captured_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching internal behavior signals:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getInternalBehaviorSignals:', error);
    return [];
  }
};

export const createInternalBehaviorSignal = async (
  signal: Omit<InternalBehaviorSignal, 'id' | 'captured_at'> & { entity_name: string }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('internal_behavior_signals')
      .insert([signal]);

    if (error) {
      console.error('Error creating internal behavior signal:', error);
      toast.error('Failed to create behavior signal');
      return false;
    }

    toast.success('Behavior signal recorded successfully');
    return true;
  } catch (error) {
    console.error('Error in createInternalBehaviorSignal:', error);
    toast.error('Failed to create behavior signal');
    return false;
  }
};

export const getToneDriftProfiles = async (): Promise<ToneDriftProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('tone_drift_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tone drift profiles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getToneDriftProfiles:', error);
    return [];
  }
};

export const createToneDriftProfile = async (
  profile: Omit<ToneDriftProfile, 'id' | 'created_at' | 'updated_at'> & { entity_name: string }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tone_drift_profiles')
      .insert([profile]);

    if (error) {
      console.error('Error creating tone drift profile:', error);
      toast.error('Failed to create drift profile');
      return false;
    }

    toast.success('Tone drift profile created successfully');
    return true;
  } catch (error) {
    console.error('Error in createToneDriftProfile:', error);
    toast.error('Failed to create drift profile');
    return false;
  }
};

export const getPraxisRiskArchetypes = async (): Promise<PraxisRiskArchetype[]> => {
  try {
    const { data, error } = await supabase
      .from('praxis_risk_archetypes')
      .select('*')
      .order('triggered_at', { ascending: false });

    if (error) {
      console.error('Error fetching PRAXIS risk archetypes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getPraxisRiskArchetypes:', error);
    return [];
  }
};

export const createPraxisRiskArchetype = async (
  archetype: Omit<PraxisRiskArchetype, 'id' | 'triggered_at' | 'last_updated'> & { entity_name: string }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('praxis_risk_archetypes')
      .insert([archetype]);

    if (error) {
      console.error('Error creating PRAXIS risk archetype:', error);
      toast.error('Failed to create risk archetype');
      return false;
    }

    toast.success('Risk archetype created successfully');
    return true;
  } catch (error) {
    console.error('Error in createPraxisRiskArchetype:', error);
    toast.error('Failed to create risk archetype');
    return false;
  }
};

export const getPraxisCrisisSimulations = async (): Promise<PraxisCrisisSimulation[]> => {
  try {
    const { data, error } = await supabase
      .from('praxis_crisis_simulations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching PRAXIS crisis simulations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getPraxisCrisisSimulations:', error);
    return [];
  }
};

export const getPraxisForecastDashboard = async (): Promise<PraxisForecastDashboard[]> => {
  try {
    const { data, error } = await supabase
      .from('praxis_forecast_dashboard')
      .select('*');

    if (error) {
      console.error('Error fetching PRAXIS forecast dashboard:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getPraxisForecastDashboard:', error);
    return [];
  }
};

export const getPraxisSignalTrends = async (): Promise<PraxisSignalTrend[]> => {
  try {
    const { data, error } = await supabase
      .from('praxis_signal_trends')
      .select('*');

    if (error) {
      console.error('Error fetching PRAXIS signal trends:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getPraxisSignalTrends:', error);
    return [];
  }
};

export const refreshPraxisViews = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('refresh_praxis_views');

    if (error) {
      console.error('Error refreshing PRAXIS views:', error);
      toast.error('Failed to refresh PRAXIS views');
      return false;
    }

    toast.success('PRAXIS views refreshed successfully');
    return true;
  } catch (error) {
    console.error('Error in refreshPraxisViews:', error);
    toast.error('Failed to refresh PRAXIS views');
    return false;
  }
};

export const updateRiskArchetypeStatus = async (
  archetypeId: string, 
  status: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('praxis_risk_archetypes')
      .update({ 
        status,
        last_updated: new Date().toISOString()
      })
      .eq('id', archetypeId);

    if (error) {
      console.error('Error updating risk archetype status:', error);
      toast.error('Failed to update archetype status');
      return false;
    }

    toast.success('Risk archetype status updated');
    return true;
  } catch (error) {
    console.error('Error in updateRiskArchetypeStatus:', error);
    toast.error('Failed to update archetype status');
    return false;
  }
};
