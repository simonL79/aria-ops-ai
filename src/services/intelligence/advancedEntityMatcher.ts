
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';
import { supabase } from '@/integrations/supabase/client';

export interface AdvancedEntityFingerprint {
  id: string;
  entity_name: string;
  alternate_names: string[];
  industries: string[];
  known_associates: string[];
  controversial_topics: string[];
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
   * Create entity fingerprint with live data validation using existing entities table
   */
  static async createEntityFingerprint(fingerprint: any): Promise<string> {
    // Validate input is live data
    if (!await LiveDataEnforcer.validateDataInput(fingerprint.entity_name, 'entity_fingerprint')) {
      throw new Error('Entity fingerprint blocked: Entity name appears to be simulation data');
    }

    try {
      const { data, error } = await supabase
        .from('entities')
        .insert([{
          name: fingerprint.entity_name,
          entity_type: fingerprint.entity_type || 'individual',
          risk_profile: {
            alternate_names: fingerprint.alternate_names || [],
            industries: fingerprint.industries || [],
            known_associates: fingerprint.known_associates || [],
            controversial_topics: fingerprint.controversial_topics || [],
            false_positive_blocklist: fingerprint.false_positive_blocklist || [],
            live_data_only: fingerprint.live_data_only,
            created_source: fingerprint.created_source
          }
        }])
        .select()
        .single();

      if (error) {
        console.error('Failed to create entity fingerprint:', error);
        throw new Error('Failed to create entity fingerprint');
      }

      console.log('✅ Created live entity fingerprint:', data.id);
      return data.id;

    } catch (error) {
      console.error('Entity fingerprint creation failed:', error);
      throw error;
    }
  }

  /**
   * Get entity fingerprint by name using existing entities table
   */
  static async getEntityFingerprint(entityName: string): Promise<AdvancedEntityFingerprint | null> {
    try {
      const { data, error } = await supabase
        .from('entities')
        .select('*')
        .eq('name', entityName)
        .single();

      if (error || !data) {
        return null;
      }

      const riskProfile = data.risk_profile as any || {};

      return {
        id: data.id,
        entity_name: data.name,
        alternate_names: riskProfile.alternate_names || [],
        industries: riskProfile.industries || [],
        known_associates: riskProfile.known_associates || [],
        controversial_topics: riskProfile.controversial_topics || [],
        false_positive_blocklist: riskProfile.false_positive_blocklist || [],
        live_data_only: riskProfile.live_data_only || true,
        created_source: riskProfile.created_source || 'unknown'
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
    if (contentLower.includes(fingerprint.entity_name.toLowerCase())) {
      matchFactors.push('primary_name_match');
      confidenceScore += 0.4;
    }

    // Alternate name matches
    for (const altName of fingerprint.alternate_names) {
      if (contentLower.includes(altName.toLowerCase())) {
        matchFactors.push(`alternate_name_match_${altName}`);
        confidenceScore += 0.2;
      }
    }

    // Industry context matches
    for (const industry of fingerprint.industries) {
      if (contentLower.includes(industry.toLowerCase())) {
        matchFactors.push(`industry_match_${industry}`);
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
   * Get precision statistics for entity using existing scan results
   */
  static async getPrecisionStats(entityId: string): Promise<any[]> {
    try {
      // Use existing scan_results table to get entity match statistics
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .contains('detected_entities', [entityId])
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
