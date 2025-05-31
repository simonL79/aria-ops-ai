
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

    // Store pattern in database for trend analysis
    await supabase.from('anubis_threat_patterns').insert({
      entity_name: pattern.entityName,
      pattern_id: pattern.patternId,
      threat_type: pattern.threatType,
      indicators: pattern.indicators,
      severity_score: pattern.severity,
      frequency_count: pattern.frequency
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

    // Store relationships for future reference
    for (const rel of relationships) {
      await supabase.from('anubis_entity_relationships').insert({
        entity_a: rel.entityA,
        entity_b: rel.entityB,
        relationship_type: rel.relationshipType,
        strength_score: rel.strength,
        context_summary: rel.context
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
      
      supabase
        .from('anubis_threat_patterns')
        .select('*')
        .eq('entity_name', entityName)
        .order('created_at', { ascending: false })
        .limit(5)
        .then(({ data }) => data || []),
      
      supabase
        .from('anubis_entity_relationships')
        .select('*')
        .or(`entity_a.eq.${entityName},entity_b.eq.${entityName}`)
        .order('strength_score', { ascending: false })
        .limit(10)
        .then(({ data }) => data || []),
      
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
        patternId: p.pattern_id,
        entityName: p.entity_name,
        threatType: p.threat_type,
        indicators: p.indicators || [],
        severity: p.severity_score || 0,
        frequency: p.frequency_count || 0,
        lastSeen: p.created_at
      })),
      relationships: relationships.map(r => ({
        entityA: r.entity_a,
        entityB: r.entity_b,
        relationshipType: r.relationship_type,
        strength: r.strength_score,
        context: r.context_summary
      })),
      riskProfile
    };
  } catch (error) {
    console.error('Entity context retrieval error:', error);
    return { memories: [], patterns: [], relationships: [], riskProfile: null };
  }
};
