
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MemoryFootprint {
  id: string;
  entity_name: string;
  content_url: string;
  content_type: 'article' | 'social_post' | 'forum_post' | 'review';
  relevancy_score: number;
  velocity_score: number;
  decay_score: number;
  first_seen: string;
  last_updated: string;
  status: 'active' | 'decaying' | 'archived';
}

export interface DecayProfile {
  id: string;
  profile_name: string;
  content_types: string[];
  decay_parameters: any;
  is_active: boolean;
  created_at: string;
}

export const scanMemoryFootprints = async (entityName: string) => {
  try {
    console.log('Scanning memory footprints via edge functions...');
    
    const { data, error } = await supabase.functions.invoke('enhanced-intelligence', {
      body: {
        entity_name: entityName,
        scan_type: 'memory_footprint',
        include_historical: true
      }
    });

    if (error) {
      console.error('Memory footprint scan error:', error);
      toast.error('Failed to scan memory footprints');
      return [];
    }

    toast.success(`Scanned ${data?.footprints?.length || 0} memory footprints`);
    return data?.footprints || [];

  } catch (error) {
    console.error('Error scanning memory footprints:', error);
    toast.error('Memory footprint scan failed');
    return [];
  }
};

export const calculateDecayScores = async (footprintIds: string[]) => {
  try {
    const { data, error } = await supabase.functions.invoke('enhanced-intelligence', {
      body: {
        action: 'calculate_decay',
        footprint_ids: footprintIds
      }
    });

    if (error) {
      console.error('Decay calculation error:', error);
      toast.error('Failed to calculate decay scores');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error calculating decay scores:', error);
    return null;
  }
};

export const triggerMemoryRecalibration = async (profileId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('enhanced-intelligence', {
      body: {
        action: 'memory_recalibration',
        profile_id: profileId
      }
    });

    if (error) {
      console.error('Memory recalibration error:', error);
      toast.error('Failed to trigger memory recalibration');
      return null;
    }

    toast.success('Memory recalibration initiated');
    return data;
  } catch (error) {
    console.error('Error triggering memory recalibration:', error);
    return null;
  }
};
