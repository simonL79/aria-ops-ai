import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MemoryFootprint {
  id: string;
  entity_name?: string;
  content_url: string | null;
  memory_context: string | null;
  narrative_summary: string | null;
  memory_type: string | null;
  narrative_category: string | null;
  decay_score: number | null;
  threat_persistence_30d: number | null;
  threat_persistence_90d: number | null;
  threat_persistence_365d: number | null;
  authority_weight: number | null;
  first_seen: string | null;
  last_seen: string | null;
  is_active: boolean | null;
  ai_scored_at: string | null;
}

/**
 * Scan memory footprints for an entity using the dedicated eidetic-search edge function,
 * with a direct DB fallback that queries the live memory_footprints table.
 */
export const scanMemoryFootprints = async (entityName: string): Promise<MemoryFootprint[]> => {
  try {
    console.log('[EIDETIC] Scanning memory footprints for:', entityName);

    // Primary path: dedicated semantic search function
    const { data, error } = await supabase.functions.invoke('eidetic-search', {
      body: { query: entityName, match_count: 50, match_threshold: 0.5 },
    });

    if (!error && Array.isArray(data?.results) && data.results.length > 0) {
      toast.success(`Found ${data.results.length} memory footprints`);
      return data.results as MemoryFootprint[];
    }

    // Fallback: direct table read (live data, no mocks)
    const { data: rows, error: dbError } = await supabase
      .from('memory_footprints')
      .select('*')
      .or(`memory_context.ilike.%${entityName}%,narrative_summary.ilike.%${entityName}%`)
      .order('last_seen', { ascending: false, nullsFirst: false })
      .limit(50);

    if (dbError) {
      console.error('[EIDETIC] Footprint fallback query failed:', dbError);
      toast.error('Failed to scan memory footprints');
      return [];
    }

    toast.success(`Found ${rows?.length ?? 0} memory footprints`);
    return (rows ?? []) as unknown as MemoryFootprint[];
  } catch (err) {
    console.error('[EIDETIC] scanMemoryFootprints error:', err);
    toast.error('Memory footprint scan failed');
    return [];
  }
};

/**
 * Trigger AI scoring (decay + threat persistence + authority weight) for the
 * provided footprint IDs via the dedicated eidetic-ai-score edge function.
 */
export const calculateDecayScores = async (footprintIds: string[]) => {
  if (!footprintIds.length) return null;
  try {
    console.log('[EIDETIC] Scoring footprints:', footprintIds.length);
    const { data, error } = await supabase.functions.invoke('eidetic-ai-score', {
      body: { footprint_ids: footprintIds },
    });

    if (error) {
      console.error('[EIDETIC] Decay scoring error:', error);
      toast.error('Failed to calculate decay scores');
      return null;
    }

    toast.success(`Scored ${data?.processed ?? 0} footprints`);
    return data;
  } catch (err) {
    console.error('[EIDETIC] calculateDecayScores error:', err);
    toast.error('Decay scoring failed');
    return null;
  }
};

/**
 * Run a recalibration sweep via the eidetic-autopilot edge function. The
 * autopilot re-evaluates decay/threat trajectories and emits resurfacing
 * events for any footprints whose state has changed materially.
 */
export const triggerMemoryRecalibration = async (entityName?: string) => {
  try {
    console.log('[EIDETIC] Triggering autopilot recalibration', entityName ?? '(global)');
    const { data, error } = await supabase.functions.invoke('eidetic-autopilot', {
      body: { entity_name: entityName, manual: true },
    });

    if (error) {
      console.error('[EIDETIC] Autopilot error:', error);
      toast.error('Failed to trigger memory recalibration');
      return null;
    }

    toast.success(
      `Recalibration complete — ${data?.footprints_processed ?? 0} processed, ${data?.anomalies_detected ?? 0} anomalies`
    );
    return data;
  } catch (err) {
    console.error('[EIDETIC] triggerMemoryRecalibration error:', err);
    toast.error('Memory recalibration failed');
    return null;
  }
};
