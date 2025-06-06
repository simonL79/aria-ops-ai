import { supabase } from '@/integrations/supabase/client';

export interface AdvancedEntityFingerprint {
  id: string;
  entity_name: string;
  entity_type: string;
  alternate_names: string[];
  industries: string[];
  known_associates: string[];
  controversial_topics: string[];
  false_positive_blocklist: string[];
  live_data_only: boolean;
  created_source: string;
  last_updated: string;
  created_at: string;
}

export interface EntityMatchResult {
  entity_name: string;
  content_snippet: string;
  match_score: number;
  decision: 'accepted' | 'rejected' | 'pending';
  false_positive_detected: boolean;
  reasoning: string;
}

export class AdvancedEntityMatcher {
  
  /**
   * Get entity fingerprint by name - using actual database schema
   */
  static async getEntityFingerprint(entityName: string): Promise<AdvancedEntityFingerprint | null> {
    try {
      const { data, error } = await supabase
        .from('entity_fingerprints')
        .select('*')
        .eq('entity_name', entityName)
        .single();

      if (error) {
        console.error('Error fetching entity fingerprint:', error);
        return null;
      }

      // Transform database result to match interface using actual column names
      return {
        id: data.id,
        entity_name: data.entity_name,
        entity_type: data.entity_type || 'individual',
        alternate_names: data.alternate_names || [],
        industries: data.industries || [],
        known_associates: data.known_associates || [],
        controversial_topics: data.controversial_topics || [],
        false_positive_blocklist: data.false_positive_blocklist || [],
        live_data_only: data.live_data_only !== false,
        created_source: data.created_source || 'unknown',
        last_updated: data.last_updated,
        created_at: data.created_at
      };
    } catch (error) {
      console.error('Failed to get entity fingerprint:', error);
      return null;
    }
  }

  /**
   * Create new entity fingerprint using correct database schema
   */
  static async createEntityFingerprint(fingerprintData: Omit<AdvancedEntityFingerprint, 'id' | 'last_updated' | 'created_at'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('entity_fingerprints')
        .insert({
          entity_name: fingerprintData.entity_name,
          entity_type: fingerprintData.entity_type,
          alternate_names: fingerprintData.alternate_names,
          industries: fingerprintData.industries,
          known_associates: fingerprintData.known_associates,
          controversial_topics: fingerprintData.controversial_topics,
          false_positive_blocklist: fingerprintData.false_positive_blocklist,
          live_data_only: fingerprintData.live_data_only,
          created_source: fingerprintData.created_source
        })
        .select('id')
        .single();

      if (error) {
        throw new Error(`Failed to create entity fingerprint: ${error.message}`);
      }

      console.log('✅ Entity fingerprint created successfully');
      return data.id;
    } catch (error) {
      console.error('Failed to create entity fingerprint:', error);
      throw error;
    }
  }

  /**
   * Analyze content for entity matches with advanced precision
   */
  static analyzeContentMatch(
    content: string, 
    url: string, 
    fingerprint: AdvancedEntityFingerprint
  ): EntityMatchResult {
    const contentLower = content.toLowerCase();
    const entityLower = fingerprint.entity_name.toLowerCase();
    
    let matchScore = 0;
    let reasoning = '';
    let falsePositiveDetected = false;

    // Check for false positive blocklist
    for (const blockedTerm of fingerprint.false_positive_blocklist) {
      if (contentLower.includes(blockedTerm.toLowerCase())) {
        falsePositiveDetected = true;
        reasoning += `False positive detected: "${blockedTerm}". `;
        break;
      }
    }

    // Exact name match
    if (contentLower.includes(entityLower)) {
      matchScore += 0.4;
      reasoning += 'Exact entity name match found. ';
    }

    // Alternate names check
    for (const altName of fingerprint.alternate_names) {
      if (contentLower.includes(altName.toLowerCase())) {
        matchScore += 0.3;
        reasoning += `Alternate name "${altName}" matched. `;
        break;
      }
    }

    // Context relevance (industry keywords)
    for (const industry of fingerprint.industries) {
      if (contentLower.includes(industry.toLowerCase())) {
        matchScore += 0.1;
        reasoning += `Industry context "${industry}" found. `;
      }
    }

    // Known associates check
    for (const associate of fingerprint.known_associates) {
      if (contentLower.includes(associate.toLowerCase())) {
        matchScore += 0.1;
        reasoning += `Known associate "${associate}" mentioned. `;
      }
    }

    // Controversial topics check
    for (const topic of fingerprint.controversial_topics) {
      if (contentLower.includes(topic.toLowerCase())) {
        matchScore += 0.1;
        reasoning += `Controversial topic "${topic}" detected. `;
      }
    }

    // Determine decision
    let decision: 'accepted' | 'rejected' | 'pending' = 'pending';
    
    if (falsePositiveDetected) {
      decision = 'rejected';
      reasoning += 'Rejected due to false positive detection.';
    } else if (matchScore >= 0.7) {
      decision = 'accepted';
      reasoning += 'High confidence match accepted.';
    } else if (matchScore >= 0.4) {
      decision = 'pending';
      reasoning += 'Medium confidence - requires review.';
    } else {
      decision = 'rejected';
      reasoning += 'Low confidence match rejected.';
    }

    return {
      entity_name: fingerprint.entity_name,
      content_snippet: content.substring(0, 200),
      match_score: Math.min(matchScore, 1.0),
      decision,
      false_positive_detected: falsePositiveDetected,
      reasoning: reasoning.trim()
    };
  }

  /**
   * Get precision statistics for an entity fingerprint
   */
  static async getPrecisionStats(fingerprintId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('entity_precision_stats')
        .select('*')
        .eq('entity_fingerprint_id', fingerprintId)
        .order('scan_date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching precision stats:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get precision stats:', error);
      return [];
    }
  }

  /**
   * Update entity fingerprint with new data
   */
  static async updateEntityFingerprint(
    entityName: string, 
    updates: Partial<AdvancedEntityFingerprint>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('entity_fingerprints')
        .update({
          ...updates,
          last_updated: new Date().toISOString()
        })
        .eq('entity_name', entityName);

      if (error) {
        console.error('Error updating entity fingerprint:', error);
        return false;
      }

      console.log('✅ Entity fingerprint updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update entity fingerprint:', error);
      return false;
    }
  }
}
