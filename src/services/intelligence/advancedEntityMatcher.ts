
import { supabase } from '@/integrations/supabase/client';

/**
 * CIA-Level Entity-Aware Matching Engine
 * Advanced entity resolution with disambiguation and false positive filtering
 */

export interface AdvancedEntityFingerprint {
  id: string;
  entity_id: string;
  primary_name: string;
  aliases: string[];
  organization?: string;
  locations: string[];
  context_tags: string[];
  false_positive_blocklist: string[];
}

export interface QueryVariant {
  id: string;
  query_text: string;
  query_type: 'exact' | 'contextual' | 'location' | 'organization';
  search_fingerprint_id: string;
}

export interface MatchDecision {
  source_url: string;
  raw_title?: string;
  raw_content: string;
  matched_entity: string;
  match_score: number;
  decision: 'accepted' | 'rejected' | 'quarantined';
  reason_discarded?: string;
  false_positive_detected: boolean;
  ner_entities: string[];
  context_matches: Record<string, number>;
}

// Helper function to safely convert JSON arrays to string arrays
const jsonArrayToStringArray = (jsonArray: any): string[] => {
  if (!Array.isArray(jsonArray)) return [];
  return jsonArray.filter(item => typeof item === 'string');
};

export class AdvancedEntityMatcher {
  private static readonly FALSE_POSITIVE_PATTERNS = [
    'lindsay lohan', 'simon cowell', 'lindsay graham', 'simon pegg',
    'lindsay fox', 'simon baker', 'lindsay duncan', 'simon le bon'
  ];

  /**
   * Create or update entity fingerprint
   */
  static async createEntityFingerprint(fingerprint: Omit<AdvancedEntityFingerprint, 'id'>): Promise<string> {
    const { data, error } = await supabase
      .from('entity_fingerprints_advanced')
      .insert({
        entity_id: fingerprint.entity_id,
        primary_name: fingerprint.primary_name,
        aliases: fingerprint.aliases,
        organization: fingerprint.organization,
        locations: fingerprint.locations,
        context_tags: fingerprint.context_tags,
        false_positive_blocklist: fingerprint.false_positive_blocklist
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to create entity fingerprint:', error);
      throw error;
    }

    return data.id;
  }

  /**
   * Generate intelligent query variants for disambiguated search
   */
  static generateQueryVariants(fingerprint: AdvancedEntityFingerprint): QueryVariant[] {
    const variants: QueryVariant[] = [];
    const searchFingerprintId = crypto.randomUUID();

    // Exact match queries
    variants.push({
      id: crypto.randomUUID(),
      query_text: `"${fingerprint.primary_name}"`,
      query_type: 'exact',
      search_fingerprint_id: searchFingerprintId
    });

    // Organization context queries
    if (fingerprint.organization) {
      variants.push({
        id: crypto.randomUUID(),
        query_text: `"${fingerprint.primary_name}" "${fingerprint.organization}"`,
        query_type: 'organization',
        search_fingerprint_id: searchFingerprintId
      });
    }

    // Location context queries
    fingerprint.locations.forEach(location => {
      variants.push({
        id: crypto.randomUUID(),
        query_text: `"${fingerprint.primary_name}" "${location}"`,
        query_type: 'location',
        search_fingerprint_id: searchFingerprintId
      });
    });

    // Context tag queries (for threat intelligence)
    fingerprint.context_tags.forEach(tag => {
      variants.push({
        id: crypto.randomUUID(),
        query_text: `"${fingerprint.primary_name}" "${tag}"`,
        query_type: 'contextual',
        search_fingerprint_id: searchFingerprintId
      });
    });

    // Alias queries
    fingerprint.aliases.forEach(alias => {
      variants.push({
        id: crypto.randomUUID(),
        query_text: `"${alias}"`,
        query_type: 'exact',
        search_fingerprint_id: searchFingerprintId
      });
    });

    return variants;
  }

  /**
   * Advanced entity matching with NER and contextual scoring
   */
  static analyzeContentMatch(
    content: string, 
    title: string = '', 
    fingerprint: AdvancedEntityFingerprint
  ): MatchDecision {
    const fullText = `${title} ${content}`.toLowerCase();
    let matchScore = 0;
    const contextMatches: Record<string, number> = {};
    const nerEntities: string[] = [];

    // Hard filter for known false positives
    const falsePositiveDetected = this.detectFalsePositive(fullText, fingerprint);
    if (falsePositiveDetected) {
      return {
        source_url: '',
        raw_title: title,
        raw_content: content,
        matched_entity: fingerprint.primary_name,
        match_score: 0,
        decision: 'rejected',
        reason_discarded: 'Known false positive detected',
        false_positive_detected: true,
        ner_entities: [],
        context_matches: {}
      };
    }

    // Primary name exact match (highest score)
    if (fullText.includes(fingerprint.primary_name.toLowerCase())) {
      matchScore += 1.0;
      nerEntities.push(fingerprint.primary_name);
      contextMatches['primary_name'] = 1.0;
    }

    // Alias matches
    for (const alias of fingerprint.aliases) {
      if (fullText.includes(alias.toLowerCase())) {
        matchScore += 0.7;
        nerEntities.push(alias);
        contextMatches['alias_match'] = 0.7;
        break;
      }
    }

    // Organization context boost
    if (fingerprint.organization && fullText.includes(fingerprint.organization.toLowerCase())) {
      matchScore += 0.3;
      contextMatches['organization'] = 0.3;
    }

    // Location context boost
    for (const location of fingerprint.locations) {
      if (fullText.includes(location.toLowerCase())) {
        matchScore += 0.2;
        contextMatches['location'] = 0.2;
        break;
      }
    }

    // Context tags boost (threat indicators)
    for (const tag of fingerprint.context_tags) {
      if (fullText.includes(tag.toLowerCase())) {
        matchScore += 0.1;
        contextMatches['context_tag'] = 0.1;
        break;
      }
    }

    // Determine decision based on score
    let decision: 'accepted' | 'rejected' | 'quarantined';
    let reasonDiscarded: string | undefined;

    if (matchScore >= 1.0) {
      decision = 'accepted';
    } else if (matchScore >= 0.6) {
      decision = 'quarantined';
      reasonDiscarded = 'Medium confidence - requires review';
    } else {
      decision = 'rejected';
      reasonDiscarded = `Low match score: ${matchScore.toFixed(2)} - insufficient entity evidence`;
    }

    return {
      source_url: '',
      raw_title: title,
      raw_content: content,
      matched_entity: fingerprint.primary_name,
      match_score: matchScore,
      decision,
      reason_discarded: reasonDiscarded,
      false_positive_detected: false,
      ner_entities: nerEntities,
      context_matches: contextMatches
    };
  }

  /**
   * Detect known false positives
   */
  private static detectFalsePositive(text: string, fingerprint: AdvancedEntityFingerprint): boolean {
    // Check global false positive patterns
    for (const pattern of this.FALSE_POSITIVE_PATTERNS) {
      if (text.includes(pattern)) {
        return true;
      }
    }

    // Check entity-specific blocklist
    for (const blocked of fingerprint.false_positive_blocklist) {
      if (text.includes(blocked.toLowerCase())) {
        return true;
      }
    }

    return false;
  }

  /**
   * Store query execution results
   */
  static async logQueryExecution(
    fingerprintId: string,
    variant: QueryVariant,
    platform: string,
    resultsCount: number,
    matchedCount: number,
    avgScore: number
  ): Promise<void> {
    try {
      await supabase.from('entity_query_variants').insert({
        entity_fingerprint_id: fingerprintId,
        query_text: variant.query_text,
        query_type: variant.query_type,
        search_fingerprint_id: variant.search_fingerprint_id,
        platform: platform,
        results_count: resultsCount,
        matched_count: matchedCount,
        avg_match_score: avgScore
      });
    } catch (error) {
      console.error('Failed to log query execution:', error);
    }
  }

  /**
   * Store match decision for audit trail
   */
  static async logMatchDecision(
    queryVariantId: string,
    decision: MatchDecision,
    sourceUrl: string
  ): Promise<void> {
    try {
      await supabase.from('entity_match_decisions').insert({
        query_variant_id: queryVariantId,
        source_url: sourceUrl,
        raw_title: decision.raw_title,
        raw_content: decision.raw_content,
        matched_entity: decision.matched_entity,
        match_score: decision.match_score,
        decision: decision.decision,
        reason_discarded: decision.reason_discarded,
        false_positive_detected: decision.false_positive_detected,
        ner_entities: decision.ner_entities,
        context_matches: decision.context_matches
      });
    } catch (error) {
      console.error('Failed to log match decision:', error);
    }
  }

  /**
   * Get entity precision statistics
   */
  static async getPrecisionStats(fingerprintId: string): Promise<any> {
    const { data, error } = await supabase
      .from('entity_precision_stats')
      .select('*')
      .eq('entity_fingerprint_id', fingerprintId)
      .order('scan_date', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Failed to get precision stats:', error);
      return null;
    }

    return data;
  }

  /**
   * Get entity fingerprint by entity name (not UUID) with proper type conversion
   * Fixed to search by text fields instead of treating entity names as UUIDs
   */
  static async getEntityFingerprint(entityName: string): Promise<AdvancedEntityFingerprint | null> {
    try {
      // Search by primary_name or entity_id (both are text fields, not UUIDs)
      const { data, error } = await supabase
        .from('entity_fingerprints_advanced')
        .select('*')
        .or(`primary_name.ilike.%${entityName}%,entity_id.ilike.%${entityName}%`)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Failed to get entity fingerprint:', error);
        return null;
      }

      if (!data) {
        console.log(`No entity fingerprint found for: ${entityName}`);
        return null;
      }

      // Convert Supabase Json types to proper arrays with type safety
      return {
        id: data.id,
        entity_id: data.entity_id,
        primary_name: data.primary_name,
        aliases: jsonArrayToStringArray(data.aliases),
        organization: data.organization,
        locations: jsonArrayToStringArray(data.locations),
        context_tags: jsonArrayToStringArray(data.context_tags),
        false_positive_blocklist: jsonArrayToStringArray(data.false_positive_blocklist)
      };
    } catch (error) {
      console.error('Error in getEntityFingerprint:', error);
      return null;
    }
  }
}
