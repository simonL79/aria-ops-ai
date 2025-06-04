
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * A.R.I.A™ Intelligence Memory Manager
 * Persistent cross-session intelligence with pattern learning
 */
export class IntelligenceMemoryManager {

  /**
   * Store intelligence memory with context correlation
   */
  static async storeIntelligenceMemory(
    entityName: string,
    memoryType: 'threat' | 'response' | 'pattern' | 'feedback',
    memoryData: IntelligenceMemory
  ): Promise<boolean> {
    try {
      console.log(`🧠 A.R.I.A™: Storing intelligence memory for ${entityName}`);

      // Store in Anubis entity memory with enhanced correlation
      const { error } = await supabase.from('anubis_entity_memory').insert({
        entity_name: entityName,
        memory_type: memoryType,
        memory_summary: memoryData.summary,
        key_findings: {
          intelligence_data: memoryData,
          correlation_score: memoryData.correlationScore,
          pattern_fingerprint: memoryData.patternFingerprint,
          learning_metadata: {
            confidence: memoryData.confidence,
            source_module: memoryData.sourceModule,
            timestamp: new Date().toISOString()
          }
        } as any,
        context_reference: memoryData.contextReference,
        created_by: 'intelligence_system'
      });

      if (error) throw error;

      // Store pattern recognition data
      await this.updatePatternRecognition(entityName, memoryData);

      toast.success('✅ Intelligence memory stored');
      return true;

    } catch (error) {
      console.error('Failed to store intelligence memory:', error);
      toast.error('❌ Failed to store intelligence memory');
      return false;
    }
  }

  /**
   * Recall intelligence memories with pattern correlation
   */
  static async recallIntelligenceMemory(
    entityName: string,
    queryContext?: string,
    memoryType?: string
  ): Promise<IntelligenceMemory[]> {
    try {
      console.log(`🔍 A.R.I.A™: Recalling intelligence for ${entityName}`);

      let query = supabase
        .from('anubis_entity_memory')
        .select('*')
        .eq('entity_name', entityName);

      if (memoryType) {
        query = query.eq('memory_type', memoryType);
      }

      const { data: memories } = await query
        .order('created_at', { ascending: false })
        .limit(20);

      if (!memories) return [];

      // Process and correlate memories
      const processedMemories = memories.map(memory => {
        const findings = memory.key_findings || {};
        const intelligenceData = typeof findings === 'object' && findings !== null ? 
          findings as any : {};

        return {
          id: memory.id,
          entityName: memory.entity_name,
          summary: memory.memory_summary,
          memoryType: memory.memory_type,
          correlationScore: intelligenceData.intelligence_data?.correlationScore || 0.5,
          patternFingerprint: intelligenceData.intelligence_data?.patternFingerprint || '',
          confidence: intelligenceData.learning_metadata?.confidence || 0.7,
          sourceModule: intelligenceData.learning_metadata?.source_module || 'unknown',
          contextReference: memory.context_reference,
          timestamp: memory.created_at,
          rawData: intelligenceData.intelligence_data || {}
        };
      });

      // Apply correlation scoring if query context provided
      if (queryContext) {
        return this.correlateMemories(processedMemories, queryContext);
      }

      return processedMemories;

    } catch (error) {
      console.error('Failed to recall intelligence memory:', error);
      return [];
    }
  }

  /**
   * Learn from operator feedback and update patterns
   */
  static async learnFromFeedback(
    entityName: string,
    feedbackData: OperatorFeedback
  ): Promise<boolean> {
    try {
      console.log(`📚 A.R.I.A™: Learning from feedback for ${entityName}`);

      // Store feedback in dedicated memory
      await this.storeIntelligenceMemory(entityName, 'feedback', {
        summary: `Operator feedback: ${feedbackData.action}`,
        correlationScore: feedbackData.effectiveness,
        patternFingerprint: this.generatePatternFingerprint(feedbackData),
        confidence: feedbackData.confidence || 0.8,
        sourceModule: 'operator_feedback',
        contextReference: feedbackData.threatId || 'general_feedback',
        rawData: feedbackData
      });

      // Update pattern recognition based on feedback
      if (feedbackData.effectiveness >= 0.7) {
        await this.reinforceSuccessfulPattern(entityName, feedbackData);
      } else if (feedbackData.effectiveness <= 0.3) {
        await this.flagIneffectivePattern(entityName, feedbackData);
      }

      // Store in feedback memory table
      const { error } = await supabase.from('anubis_feedback_memory').insert({
        entity_id: await this.getEntityId(entityName),
        source_module: 'intelligence_system',
        operator_action: feedbackData.action,
        feedback_score: Math.round(feedbackData.effectiveness * 10),
        action_result: feedbackData.outcome,
        notes: feedbackData.notes,
        threat_id: feedbackData.threatId
      });

      if (error) throw error;

      toast.success('🎯 System learned from feedback');
      return true;

    } catch (error) {
      console.error('Failed to learn from feedback:', error);
      toast.error('❌ Failed to process feedback');
      return false;
    }
  }

  /**
   * Generate intelligence recommendations based on memory patterns
   */
  static async generateIntelligenceRecommendations(
    entityName: string,
    currentThreat?: any
  ): Promise<IntelligenceRecommendation[]> {
    try {
      console.log(`💡 A.R.I.A™: Generating recommendations for ${entityName}`);

      // Recall relevant memories
      const memories = await this.recallIntelligenceMemory(entityName);
      const patterns = await this.getPatternHistory(entityName);

      // Analyze successful patterns
      const successfulPatterns = memories.filter(m => 
        m.memoryType === 'response' && m.confidence >= 0.7
      );

      const recommendations: IntelligenceRecommendation[] = [];

      // Pattern-based recommendations
      if (successfulPatterns.length > 0) {
        const topPattern = successfulPatterns.reduce((prev, current) => 
          prev.correlationScore > current.correlationScore ? prev : current
        );

        recommendations.push({
          id: `pattern_${Date.now()}`,
          type: 'pattern_based',
          title: 'Successful Pattern Identified',
          description: `Previous success with similar threats: ${topPattern.summary}`,
          confidence: topPattern.confidence,
          actionItems: this.extractActionItems(topPattern),
          correlationScore: topPattern.correlationScore,
          sourceMemories: [topPattern.id]
        });
      }

      // Threat correlation recommendations
      if (currentThreat) {
        const correlatedMemories = await this.findCorrelatedThreats(entityName, currentThreat);
        
        if (correlatedMemories.length > 0) {
          recommendations.push({
            id: `correlation_${Date.now()}`,
            type: 'threat_correlation',
            title: 'Similar Threat Detected',
            description: `Found ${correlatedMemories.length} similar previous threats`,
            confidence: 0.85,
            actionItems: ['Review historical responses', 'Apply proven strategies'],
            correlationScore: correlatedMemories[0].correlationScore,
            sourceMemories: correlatedMemories.map(m => m.id)
          });
        }
      }

      // Learning gap recommendations
      const learningGaps = this.identifyLearningGaps(memories, patterns);
      if (learningGaps.length > 0) {
        recommendations.push({
          id: `learning_${Date.now()}`,
          type: 'learning_improvement',
          title: 'Learning Opportunities',
          description: `Identified areas for system improvement`,
          confidence: 0.6,
          actionItems: learningGaps,
          correlationScore: 0.5,
          sourceMemories: []
        });
      }

      return recommendations.sort((a, b) => b.confidence - a.confidence);

    } catch (error) {
      console.error('Failed to generate intelligence recommendations:', error);
      return [];
    }
  }

  /**
   * Update pattern recognition from memory data
   */
  private static async updatePatternRecognition(
    entityName: string,
    memoryData: IntelligenceMemory
  ): Promise<void> {
    try {
      const { error } = await supabase.from('anubis_pattern_log').insert({
        entity_name: entityName,
        pattern_fingerprint: memoryData.patternFingerprint,
        pattern_summary: memoryData.summary,
        confidence_score: memoryData.confidence,
        recommended_response: JSON.stringify({
          source_module: memoryData.sourceModule,
          context: memoryData.contextReference
        })
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update pattern recognition:', error);
    }
  }

  /**
   * Correlate memories with query context
   */
  private static correlateMemories(
    memories: IntelligenceMemory[],
    queryContext: string
  ): IntelligenceMemory[] {
    return memories.map(memory => {
      // Simple correlation scoring based on text similarity
      const contextWords = queryContext.toLowerCase().split(' ');
      const memoryWords = memory.summary.toLowerCase().split(' ');
      
      const intersection = contextWords.filter(word => 
        memoryWords.some(mWord => mWord.includes(word) || word.includes(mWord))
      );
      
      const correlationBoost = intersection.length / contextWords.length;
      
      return {
        ...memory,
        correlationScore: Math.min(1.0, memory.correlationScore + correlationBoost * 0.3)
      };
    }).sort((a, b) => b.correlationScore - a.correlationScore);
  }

  /**
   * Generate pattern fingerprint for feedback
   */
  private static generatePatternFingerprint(feedback: OperatorFeedback): string {
    const components = [
      feedback.action,
      feedback.threatType || 'general',
      feedback.platform || 'unknown'
    ].filter(Boolean);
    
    return components.join('_').toLowerCase().replace(/\s+/g, '_');
  }

  /**
   * Reinforce successful patterns
   */
  private static async reinforceSuccessfulPattern(
    entityName: string,
    feedback: OperatorFeedback
  ): Promise<void> {
    try {
      // Update pattern confidence in database
      const fingerprint = this.generatePatternFingerprint(feedback);
      
      await supabase.rpc('log_anubis_check', {
        check_name: 'pattern_reinforcement',
        result: `Successful pattern reinforced: ${fingerprint}`,
        passed: true,
        severity: 'low',
        notes: `Effectiveness: ${feedback.effectiveness}`
      });

    } catch (error) {
      console.error('Failed to reinforce pattern:', error);
    }
  }

  /**
   * Flag ineffective patterns
   */
  private static async flagIneffectivePattern(
    entityName: string,
    feedback: OperatorFeedback
  ): Promise<void> {
    try {
      const fingerprint = this.generatePatternFingerprint(feedback);
      
      await supabase.rpc('log_anubis_check', {
        check_name: 'pattern_ineffective',
        result: `Ineffective pattern flagged: ${fingerprint}`,
        passed: false,
        severity: 'medium',
        notes: `Low effectiveness: ${feedback.effectiveness}`
      });

    } catch (error) {
      console.error('Failed to flag pattern:', error);
    }
  }

  /**
   * Get entity ID for database operations
   */
  private static async getEntityId(entityName: string): Promise<string> {
    try {
      const { data } = await supabase
        .from('entities')
        .select('id')
        .eq('name', entityName)
        .single();
      
      return data?.id || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Get pattern history for entity
   */
  private static async getPatternHistory(entityName: string): Promise<any[]> {
    try {
      const { data } = await supabase
        .from('anubis_pattern_log')
        .select('*')
        .eq('entity_name', entityName)
        .order('first_detected', { ascending: false })
        .limit(10);

      return data || [];
    } catch (error) {
      console.error('Failed to get pattern history:', error);
      return [];
    }
  }

  /**
   * Find correlated threats based on similarity
   */
  private static async findCorrelatedThreats(
    entityName: string,
    currentThreat: any
  ): Promise<IntelligenceMemory[]> {
    const memories = await this.recallIntelligenceMemory(entityName, 'threat');
    
    // Simple correlation based on threat characteristics
    return memories.filter(memory => {
      const threatData = memory.rawData;
      let correlation = 0;
      
      if (threatData.platform === currentThreat.platform) correlation += 0.3;
      if (threatData.severity === currentThreat.severity) correlation += 0.2;
      if (threatData.threatType === currentThreat.threatType) correlation += 0.4;
      
      return correlation >= 0.5;
    }).map(memory => ({
      ...memory,
      correlationScore: Math.min(1.0, memory.correlationScore + 0.2)
    }));
  }

  /**
   * Extract action items from successful memory
   */
  private static extractActionItems(memory: IntelligenceMemory): string[] {
    const actions = [];
    
    if (memory.sourceModule === 'counter_narrative') {
      actions.push('Deploy similar counter-narrative strategy');
    }
    if (memory.sourceModule === 'response_template') {
      actions.push('Use proven response template');
    }
    if (memory.confidence >= 0.8) {
      actions.push('High confidence - prioritize this approach');
    }
    
    return actions.length > 0 ? actions : ['Review and adapt previous approach'];
  }

  /**
   * Identify learning gaps in the system
   */
  private static identifyLearningGaps(
    memories: IntelligenceMemory[],
    patterns: any[]
  ): string[] {
    const gaps = [];
    
    if (memories.length < 5) {
      gaps.push('Collect more threat intelligence data');
    }
    
    const lowConfidenceCount = memories.filter(m => m.confidence < 0.6).length;
    if (lowConfidenceCount > memories.length * 0.5) {
      gaps.push('Improve confidence scoring mechanisms');
    }
    
    const recentMemories = memories.filter(m => 
      new Date(m.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    if (recentMemories.length === 0) {
      gaps.push('Increase recent threat analysis activity');
    }
    
    return gaps;
  }
}

// Type definitions
interface IntelligenceMemory {
  id?: string;
  entityName?: string;
  summary: string;
  memoryType?: string;
  correlationScore: number;
  patternFingerprint: string;
  confidence: number;
  sourceModule: string;
  contextReference: string;
  timestamp?: string;
  rawData?: any;
}

interface OperatorFeedback {
  action: string;
  effectiveness: number;
  confidence?: number;
  outcome: string;
  notes?: string;
  threatId?: string;
  threatType?: string;
  platform?: string;
}

interface IntelligenceRecommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: number;
  actionItems: string[];
  correlationScore: number;
  sourceMemories: string[];
}
