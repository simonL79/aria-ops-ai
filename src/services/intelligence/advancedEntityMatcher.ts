
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';
import { supabase } from '@/integrations/supabase/client';

export interface AdvancedEntityFingerprint {
  id: string;
  entity_id: string;
  primary_name: string;
  aliases: string[];
  organization?: string;
  locations: string[];
  context_tags: string[];
  false_positive_blocklist: string[];
  live_data_only: boolean;
  created_source: string;
}

export interface EntityMatchResult {
  decision: 'accepted' | 'quarantined' | 'rejected';
  confidence_score: number;
  match_factors: string[];
  false_positive_detected: boolean;
  reasoning: string;
}

export class AdvancedEntityMatcher {
  /**
   * Create entity fingerprint with live data validation
   */
  static async createEntityFingerprint(fingerprint: any): Promise<string> {
    // Validate input is live data
    if (!await LiveDataEnforcer.validateDataInput(fingerprint.primary_name, 'entity_fingerprint')) {
      throw new Error('Entity fingerprint blocked: Primary name appears to be simulation data');
    }

    try {
      const { data, error } = await supabase
        .from('entity_fingerprints')
        .insert([{
          entity_id: fingerprint.entity_id,
          primary_name: fingerprint.primary_name,
          aliases: fingerprint.aliases,
          organization: fingerprint.organization,
          locations: fingerprint.locations,
          context_tags: fingerprint.context_tags,
          false_positive_blocklist: fingerprint.false_positive_blocklist,
          live_data_only: fingerprint.live_data_only,
          created_source: fingerprint.created_source
        }])
        .select()
        .single();

      if (error) {
        console.error('Failed to create entity fingerprint:', error);
        throw new Error('Failed to create entity fingerprint');
      }

      console.log('✅ Created live entity fingerprint:', data.entity_id);
      return data.entity_id;

    } catch (error) {
      console.error('Entity fingerprint creation failed:', error);
      throw error;
    }
  }

  /**
   * Get entity fingerprint by name
   */
  static async getEntityFingerprint(entityName: string): Promise<AdvancedEntityFingerprint | null> {
    try {
      const { data, error } = await supabase
        .from('entity_fingerprints')
        .select('*')
        .eq('primary_name', entityName)
        .eq('live_data_only', true)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        entity_id: data.entity_id,
        primary_name: data.primary_name,
        aliases: data.aliases || [],
        organization: data.organization,
        locations: data.locations || [],
        context_tags: data.context_tags || [],
        false_positive_blocklist: data.false_positive_blocklist || [],
        live_data_only: data.live_data_only,
        created_source: data.created_source
      };

    } catch (error) {
      console.error('Failed to get entity fingerprint:', error);
      return null;
    }
  }

  /**
   * Analyze content match against entity fingerprint
   */
  static analyzeContentMatch(
    content: string,
    url: string,
    fingerprint: AdvancedEntityFingerprint
  ): EntityMatchResult {
    const contentLower = content.toLowerCase();
    const matchFactors: string[] = [];
    let confidenceScore = 0;

    // Check for simulation content first
    const simulationKeywords = fingerprint.false_positive_blocklist.filter(keyword => 
      ['mock', 'test', 'demo', 'simulation', 'fake'].some(sim => keyword.includes(sim))
    );

    for (const simKeyword of simulationKeywords) {
      if (contentLower.includes(simKeyword.toLowerCase())) {
        return {
          decision: 'rejected',
          confidence_score: 0,
          match_factors: ['simulation_detected'],
          false_positive_detected: true,
          reasoning: `Simulation keyword detected: ${simKeyword}`
        };
      }
    }

    // Primary name match
    if (contentLower.includes(fingerprint.primary_name.toLowerCase())) {
      matchFactors.push('primary_name_match');
      confidenceScore += 0.4;
    }

    // Alias matches
    for (const alias of fingerprint.aliases) {
      if (contentLower.includes(alias.toLowerCase())) {
        matchFactors.push(`alias_match_${alias}`);
        confidenceScore += 0.2;
      }
    }

    // Context tag matches
    for (const tag of fingerprint.context_tags) {
      if (contentLower.includes(tag.toLowerCase())) {
        matchFactors.push(`context_match_${tag}`);
        confidenceScore += 0.1;
      }
    }

    // False positive check
    for (const blockword of fingerprint.false_positive_blocklist) {
      if (contentLower.includes(blockword.toLowerCase())) {
        return {
          decision: 'rejected',
          confidence_score: Math.max(0, confidenceScore - 0.5),
          match_factors: matchFactors,
          false_positive_detected: true,
          reasoning: `False positive detected: ${blockword}`
        };
      }
    }

    // Decision logic
    let decision: 'accepted' | 'quarantined' | 'rejected';
    if (confidenceScore >= 0.7) decision = 'accepted';
    else if (confidenceScore >= 0.4) decision = 'quarantined';
    else decision = 'rejected';

    return {
      decision,
      confidence_score: Math.min(1, confidenceScore),
      match_factors: matchFactors,
      false_positive_detected: false,
      reasoning: `Score: ${confidenceScore.toFixed(2)}, Factors: ${matchFactors.join(', ')}`
    };
  }

  /**
   * Get precision statistics for entity
   */
  static async getPrecisionStats(entityId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('entity_match_stats')
        .select('*')
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Failed to get precision stats:', error);
        return [];
      }

      return data || [];

    } catch (error) {
      console.error('Precision stats error:', error);
      return [];
    }
  }
}
