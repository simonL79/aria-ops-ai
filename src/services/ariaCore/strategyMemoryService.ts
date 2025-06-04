
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * A.R.I.A™ Strategy Memory Service
 * Tracks and learns from successful counter-narrative strategies
 */
export class StrategyMemoryService {

  /**
   * Record successful strategy implementation
   */
  static async recordStrategySuccess(
    entityName: string,
    strategyId: string,
    outcomeData: StrategyOutcome
  ): Promise<boolean> {
    try {
      console.log(`📊 A.R.I.A™: Recording strategy success for ${entityName}`);

      // Store in entity memory
      await supabase.from('anubis_entity_memory').insert({
        entity_name: entityName,
        memory_type: 'response',
        memory_summary: `Successful strategy: ${outcomeData.strategyType}`,
        key_findings: {
          strategy_id: strategyId,
          outcome_data: outcomeData,
          success_metrics: outcomeData.metrics,
          lessons_learned: outcomeData.lessonsLearned
        } as any,
        context_reference: outcomeData.context
      });

      // Update pattern recognition
      await this.updatePatternRecognition(entityName, outcomeData);

      toast.success('✅ Strategy success recorded for future learning');
      return true;

    } catch (error) {
      console.error('Failed to record strategy success:', error);
      toast.error('❌ Failed to record strategy success');
      return false;
    }
  }

  /**
   * Get strategy recommendations based on historical success
   */
  static async getStrategyRecommendations(
    entityName: string,
    threatContext: any
  ): Promise<StrategyRecommendation[]> {
    try {
      console.log(`🎯 A.R.I.A™: Getting strategy recommendations for ${entityName}`);

      // Retrieve historical successful strategies
      const { data: memories } = await supabase
        .from('anubis_entity_memory')
        .select('*')
        .eq('entity_name', entityName)
        .eq('memory_type', 'response')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!memories || memories.length === 0) {
        return this.getDefaultRecommendations(threatContext);
      }

      // Analyze patterns and generate recommendations
      const recommendations = this.analyzeSuccessPatterns(memories, threatContext);
      
      return recommendations;

    } catch (error) {
      console.error('Failed to get strategy recommendations:', error);
      return this.getDefaultRecommendations(threatContext);
    }
  }

  /**
   * Update pattern recognition based on successful outcomes
   */
  private static async updatePatternRecognition(
    entityName: string,
    outcomeData: StrategyOutcome
  ): Promise<void> {
    try {
      const patternFingerprint = this.generatePatternFingerprint(outcomeData);
      
      await supabase.from('anubis_pattern_log').insert({
        entity_name: entityName,
        pattern_fingerprint: patternFingerprint,
        pattern_summary: `Successful ${outcomeData.strategyType} strategy`,
        confidence_score: outcomeData.successScore,
        previous_outcome: 'success',
        recommended_response: JSON.stringify({
          strategy_type: outcomeData.strategyType,
          key_factors: outcomeData.keySuccessFactors
        })
      });

    } catch (error) {
      console.error('Failed to update pattern recognition:', error);
    }
  }

  /**
   * Analyze success patterns from historical data
   */
  private static analyzeSuccessPatterns(
    memories: any[],
    threatContext: any
  ): StrategyRecommendation[] {
    const recommendations: StrategyRecommendation[] = [];

    // Group by strategy type
    const strategyGroups = memories.reduce((groups, memory) => {
      const findings = memory.key_findings || {};
      const strategyType = findings.outcome_data?.strategyType || 'unknown';
      
      if (!groups[strategyType]) {
        groups[strategyType] = [];
      }
      groups[strategyType].push(memory);
      return groups;
    }, {} as Record<string, any[]>);

    // Generate recommendations based on successful patterns
    Object.entries(strategyGroups).forEach(([strategyType, group]) => {
      if (group.length >= 2) { // Require at least 2 successes
        const avgSuccessScore = group.reduce((sum, memory) => {
          return sum + (memory.key_findings?.outcome_data?.successScore || 0.5);
        }, 0) / group.length;

        if (avgSuccessScore >= 0.7) {
          recommendations.push({
            id: `rec_${strategyType}_${Date.now()}`,
            strategyType,
            confidence: avgSuccessScore,
            reasoning: `Historical success rate: ${Math.round(avgSuccessScore * 100)}% (${group.length} instances)`,
            keyFactors: this.extractKeyFactors(group),
            adaptationNotes: this.generateAdaptationNotes(group, threatContext)
          });
        }
      }
    });

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Extract key success factors from historical data
   */
  private static extractKeyFactors(strategyGroup: any[]): string[] {
    const factors = new Set<string>();
    
    strategyGroup.forEach(memory => {
      const keyFactors = memory.key_findings?.outcome_data?.keySuccessFactors || [];
      keyFactors.forEach((factor: string) => factors.add(factor));
    });

    return Array.from(factors);
  }

  /**
   * Generate adaptation notes for current context
   */
  private static generateAdaptationNotes(
    strategyGroup: any[],
    threatContext: any
  ): string {
    const commonThemes = this.extractCommonThemes(strategyGroup);
    return `Adapt based on: ${commonThemes.join(', ')}. Current threat level: ${threatContext.severity || 'unknown'}`;
  }

  /**
   * Extract common themes from successful strategies
   */
  private static extractCommonThemes(strategyGroup: any[]): string[] {
    // Simplified theme extraction
    return ['transparency', 'quick response', 'stakeholder engagement'];
  }

  /**
   * Generate pattern fingerprint for recognition
   */
  private static generatePatternFingerprint(outcomeData: StrategyOutcome): string {
    const components = [
      outcomeData.strategyType,
      outcomeData.threatSeverity,
      outcomeData.platform
    ].filter(Boolean);
    
    return components.join('_').toLowerCase().replace(/\s+/g, '_');
  }

  /**
   * Get default recommendations when no historical data exists
   */
  private static getDefaultRecommendations(threatContext: any): StrategyRecommendation[] {
    return [
      {
        id: 'default_transparency',
        strategyType: 'transparency',
        confidence: 0.7,
        reasoning: 'Transparency strategies are generally effective for reputation management',
        keyFactors: ['clear communication', 'factual accuracy', 'timely response'],
        adaptationNotes: 'Customize based on specific threat context and stakeholder concerns'
      },
      {
        id: 'default_empathy',
        strategyType: 'empathetic_response',
        confidence: 0.65,
        reasoning: 'Empathetic responses help de-escalate tensions',
        keyFactors: ['understanding tone', 'acknowledgment', 'solution focus'],
        adaptationNotes: 'Use when dealing with concerned stakeholders or emotional responses'
      }
    ];
  }

  /**
   * Generate strategy effectiveness report
   */
  static async generateEffectivenessReport(entityName: string): Promise<EffectivenessReport> {
    try {
      const { data: memories } = await supabase
        .from('anubis_entity_memory')
        .select('*')
        .eq('entity_name', entityName)
        .eq('memory_type', 'response');

      if (!memories || memories.length === 0) {
        return {
          totalStrategies: 0,
          successRate: 0,
          mostEffectiveStrategy: 'N/A',
          improvementAreas: ['Build strategy history through implementation'],
          recommendations: []
        };
      }

      const totalStrategies = memories.length;
      const successfulStrategies = memories.filter(m => 
        m.key_findings?.outcome_data?.successScore >= 0.7
      ).length;
      
      const successRate = successfulStrategies / totalStrategies;

      return {
        totalStrategies,
        successRate,
        mostEffectiveStrategy: this.findMostEffectiveStrategy(memories),
        improvementAreas: this.identifyImprovementAreas(memories),
        recommendations: await this.getStrategyRecommendations(entityName, {})
      };

    } catch (error) {
      console.error('Failed to generate effectiveness report:', error);
      return {
        totalStrategies: 0,
        successRate: 0,
        mostEffectiveStrategy: 'Error generating report',
        improvementAreas: ['Check system configuration'],
        recommendations: []
      };
    }
  }

  private static findMostEffectiveStrategy(memories: any[]): string {
    let bestStrategy = 'N/A';
    let bestScore = 0;

    memories.forEach(memory => {
      const score = memory.key_findings?.outcome_data?.successScore || 0;
      if (score > bestScore) {
        bestScore = score;
        bestStrategy = memory.key_findings?.outcome_data?.strategyType || 'Unknown';
      }
    });

    return bestStrategy;
  }

  private static identifyImprovementAreas(memories: any[]): string[] {
    const areas = [];
    
    const avgScore = memories.reduce((sum, memory) => {
      return sum + (memory.key_findings?.outcome_data?.successScore || 0);
    }, 0) / memories.length;

    if (avgScore < 0.6) areas.push('Strategy selection optimization');
    if (memories.length < 5) areas.push('More strategy implementation data needed');
    
    return areas.length > 0 ? areas : ['Continue current approach'];
  }
}

// Type definitions
interface StrategyOutcome {
  strategyType: string;
  successScore: number;
  threatSeverity: string;
  platform: string;
  metrics: Record<string, number>;
  keySuccessFactors: string[];
  lessonsLearned: string[];
  context: string;
}

interface StrategyRecommendation {
  id: string;
  strategyType: string;
  confidence: number;
  reasoning: string;
  keyFactors: string[];
  adaptationNotes: string;
}

interface EffectivenessReport {
  totalStrategies: number;
  successRate: number;
  mostEffectiveStrategy: string;
  improvementAreas: string[];
  recommendations: StrategyRecommendation[];
}
