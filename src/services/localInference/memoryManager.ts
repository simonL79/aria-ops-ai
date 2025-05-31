
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EntityMemory {
  id?: string;
  entityName: string;
  memoryType: string;
  content: string;
  context: any;
  timestamp: string;
  importance: number;
  decay: number;
}

export interface EntityRelationship {
  entityA: string;
  entityB: string;
  relationshipType: string;
  strength: number;
  context: string;
}

export interface ThreatPattern {
  patternId: string;
  entityName: string;
  threatType: string;
  indicators: string[];
  severity: number;
  frequency: number;
  lastSeen: string;
}

/**
 * Store entity memory in both Supabase and Qdrant
 */
export const storeEntityMemory = async (memory: EntityMemory): Promise<boolean> => {
  try {
    // Store in Supabase for persistence and auditing
    const { error: supabaseError } = await supabase
      .from('anubis_entity_memory')
      .insert({
        entity_name: memory.entityName,
        memory_type: memory.memoryType,
        memory_summary: memory.content,
        context_reference: memory.context,
        key_findings: {
          importance: memory.importance,
          decay: memory.decay,
          timestamp: memory.timestamp
        }
      });

    if (supabaseError) throw supabaseError;

    // Store in Qdrant for vector search
    const { error: qdrantError } = await supabase.functions.invoke('anubis-memory-store', {
      body: {
        entityName: memory.entityName,
        content: memory.content,
        memoryType: memory.memoryType,
        metadata: {
          importance: memory.importance,
          decay: memory.decay,
          timestamp: memory.timestamp,
          context: memory.context
        }
      }
    });

    if (qdrantError) throw qdrantError;

    return true;
  } catch (error) {
    console.error('Memory storage error:', error);
    toast.error('Failed to store entity memory');
    return false;
  }
};

/**
 * Recall relevant memories for entity context
 */
export const recallEntityMemories = async (
  entityName: string,
  query: string,
  limit: number = 5
): Promise<EntityMemory[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('anubis-memory-recall', {
      body: {
        entityName,
        query,
        limit
      }
    });

    if (error) throw error;

    return data?.memories || [];
  } catch (error) {
    console.error('Memory recall error:', error);
    return [];
  }
};

/**
 * Analyze and store threat patterns
 */
export const analyzeThreatPatterns = async (
  entityName: string,
  content: string,
  platform: string
): Promise<ThreatPattern | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('anubis-pattern-store', {
      body: {
        entityName,
        content,
        platform,
        analysisType: 'pattern_extraction'
      }
    });

    if (error) throw error;

    const pattern: ThreatPattern = {
      patternId: data.patternId,
      entityName: data.entityName,
      threatType: data.threatType,
      indicators: data.indicators,
      severity: data.severity,
      frequency: data.frequency,
      lastSeen: new Date().toISOString()
    };

    // Store pattern in existing anubis_pattern_log table
    await supabase.from('anubis_pattern_log').insert({
      entity_name: pattern.entityName,
      pattern_fingerprint: pattern.patternId,
      pattern_summary: `${pattern.threatType}: ${pattern.indicators.join(', ')}`,
      confidence_score: pattern.severity,
      recommended_response: `Detected ${pattern.threatType} pattern with ${pattern.frequency} occurrences`
    });

    return pattern;
  } catch (error) {
    console.error('Threat pattern analysis error:', error);
    return null;
  }
};

/**
 * Map entity relationships based on co-occurrence and context
 */
export const mapEntityRelationships = async (
  entities: string[],
  context: string
): Promise<EntityRelationship[]> => {
  try {
    const relationships: EntityRelationship[] = [];

    // Analyze pairwise relationships
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const entityA = entities[i];
        const entityB = entities[j];

        // Use local inference to determine relationship type and strength
        const { data, error } = await supabase.functions.invoke('local-threat-analysis', {
          body: {
            content: `Analyze the relationship between "${entityA}" and "${entityB}" in this context: ${context}`,
            entityName: `${entityA}+${entityB}`,
            analysisType: 'relationship_analysis'
          }
        });

        if (!error && data?.result) {
          relationships.push({
            entityA,
            entityB,
            relationshipType: data.result.relationshipType || 'associated',
            strength: data.result.strength || 0.5,
            context: context.substring(0, 200)
          });
        }
      }
    }

    // Store relationships in entity_graph table (existing table)
    for (const rel of relationships) {
      await supabase.from('entity_graph').insert({
        source_entity: rel.entityA,
        related_entity: rel.entityB,
        relationship_type: rel.relationshipType,
        frequency: Math.round(rel.strength * 10) // Convert strength to frequency
      });
    }

    return relationships;
  } catch (error) {
    console.error('Entity relationship mapping error:', error);
    return [];
  }
};

/**
 * Get comprehensive entity context for enhanced analysis
 */
export const getEntityContext = async (entityName: string): Promise<{
  memories: EntityMemory[];
  patterns: ThreatPattern[];
  relationships: EntityRelationship[];
  riskProfile: any;
}> => {
  try {
    const [memories, patterns, relationships, riskProfile] = await Promise.all([
      recallEntityMemories(entityName, 'threat context', 10),
      
      // Get patterns from anubis_pattern_log
      supabase
        .from('anubis_pattern_log')
        .select('*')
        .eq('entity_name', entityName)
        .order('first_detected', { ascending: false })
        .limit(5)
        .then(({ data }) => data || []),
      
      // Get relationships from entity_graph
      supabase
        .from('entity_graph')
        .select('*')
        .or(`source_entity.eq.${entityName},related_entity.eq.${entityName}`)
        .order('frequency', { ascending: false })
        .limit(10)
        .then(({ data }) => data || []),
      
      // Get risk profile from entity_risk_profiles
      supabase
        .from('entity_risk_profiles')
        .select('*')
        .eq('entity_name', entityName)
        .single()
        .then(({ data }) => data)
    ]);

    return {
      memories,
      patterns: patterns.map(p => ({
        patternId: p.pattern_fingerprint || '',
        entityName: p.entity_name || '',
        threatType: p.pattern_summary || 'unknown',
        indicators: p.pattern_summary ? [p.pattern_summary] : [],
        severity: p.confidence_score || 0,
        frequency: 1,
        lastSeen: p.first_detected || new Date().toISOString()
      })),
      relationships: relationships.map(r => ({
        entityA: r.source_entity || '',
        entityB: r.related_entity || '',
        relationshipType: r.relationship_type || 'unknown',
        strength: (r.frequency || 1) / 10, // Convert frequency back to strength
        context: `Related entities discovered through pattern analysis`
      })),
      riskProfile
    };
  } catch (error) {
    console.error('Entity context retrieval error:', error);
    return { memories: [], patterns: [], relationships: [], riskProfile: null };
  }
};
