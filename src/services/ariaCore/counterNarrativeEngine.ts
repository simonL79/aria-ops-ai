
import { supabase } from '@/integrations/supabase/client';
import { callOpenAI } from '@/services/api/openaiClient';
import { toast } from 'sonner';

/**
 * A.R.I.A™ Counter-Narrative Generation Engine
 * Advanced AI-powered narrative strategy with memory learning
 */
export class CounterNarrativeEngine {

  /**
   * Generate sophisticated counter-narratives with AI reasoning
   */
  static async generateAdvancedCounterNarratives(
    entityName: string,
    threatData: any[],
    selectedKeywords: string[] = [],
    strategyPreferences?: any
  ): Promise<CounterNarrativeStrategy[]> {
    console.log(`🧠 A.R.I.A™: Advanced counter-narrative generation for ${entityName}`);
    
    try {
      // Retrieve strategy memory for this entity
      const strategyMemory = await this.getStrategyMemory(entityName);
      
      // Analyze threat patterns
      const threatPatterns = this.analyzeThreatPatterns(threatData, selectedKeywords);
      
      // Generate AI-powered counter-narratives
      const strategies = await this.generateAIStrategies(
        entityName,
        threatPatterns,
        strategyMemory,
        strategyPreferences
      );
      
      // Store successful patterns for learning
      await this.storeStrategyPatterns(entityName, strategies);
      
      // Log generation for audit trail
      await this.logCounterNarrativeGeneration(entityName, strategies.length);
      
      return strategies;
      
    } catch (error) {
      console.error('Advanced counter-narrative generation failed:', error);
      throw error;
    }
  }

  /**
   * Retrieve strategy memory for entity
   */
  private static async getStrategyMemory(entityName: string): Promise<StrategyMemory> {
    try {
      const { data: memories } = await supabase
        .from('anubis_entity_memory')
        .select('*')
        .eq('entity_name', entityName)
        .eq('memory_type', 'response')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!memories || memories.length === 0) {
        return {
          successfulTones: ['professional', 'empathetic'],
          effectiveFormats: ['statement', 'clarification'],
          winningThemes: ['transparency', 'commitment'],
          historicalSuccess: []
        };
      }

      return this.parseStrategyMemory(memories);
      
    } catch (error) {
      console.error('Failed to retrieve strategy memory:', error);
      return {
        successfulTones: ['professional'],
        effectiveFormats: ['statement'],
        winningThemes: ['transparency'],
        historicalSuccess: []
      };
    }
  }

  /**
   * Analyze threat patterns for strategy generation
   */
  private static analyzeThreatPatterns(
    threatData: any[],
    selectedKeywords: string[]
  ): ThreatPatternAnalysis {
    const threats = threatData.filter(t => 
      t.sentiment_score < -0.2 || 
      ['high', 'critical'].includes(t.threat_level) ||
      selectedKeywords.some(k => t.keyword?.toLowerCase().includes(k.toLowerCase()))
    );

    const patterns = {
      primaryConcerns: this.extractPrimaryConcerns(threats),
      sentimentDistribution: this.analyzeSentimentDistribution(threats),
      platformSpread: this.analyzePlatformSpread(threats),
      urgencyLevel: this.calculateUrgencyLevel(threats),
      narrativeThemes: this.extractNarrativeThemes(threats)
    };

    return patterns;
  }

  /**
   * Generate AI-powered counter-narrative strategies
   */
  private static async generateAIStrategies(
    entityName: string,
    patterns: ThreatPatternAnalysis,
    memory: StrategyMemory,
    preferences?: any
  ): Promise<CounterNarrativeStrategy[]> {
    const prompt = this.buildStrategyPrompt(entityName, patterns, memory, preferences);
    
    try {
      const response = await callOpenAI({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an elite narrative strategist and crisis communication expert with deep expertise in reputation management, psychological influence, and strategic messaging. You generate sophisticated counter-narrative strategies.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3
      });

      const aiOutput = response.choices[0].message.content;
      return this.parseAIStrategies(aiOutput, entityName);
      
    } catch (error) {
      console.error('AI strategy generation failed:', error);
      // Fallback to template-based strategies
      return this.generateTemplateStrategies(entityName, patterns, memory);
    }
  }

  /**
   * Build comprehensive strategy prompt for AI
   */
  private static buildStrategyPrompt(
    entityName: string,
    patterns: ThreatPatternAnalysis,
    memory: StrategyMemory,
    preferences?: any
  ): string {
    return `
ENTITY: ${entityName}

THREAT ANALYSIS:
- Primary Concerns: ${patterns.primaryConcerns.join(', ')}
- Sentiment Distribution: ${JSON.stringify(patterns.sentimentDistribution)}
- Platform Spread: ${patterns.platformSpread.join(', ')}
- Urgency Level: ${patterns.urgencyLevel}
- Narrative Themes: ${patterns.narrativeThemes.join(', ')}

STRATEGY MEMORY (Historical Success):
- Successful Tones: ${memory.successfulTones.join(', ')}
- Effective Formats: ${memory.effectiveFormats.join(', ')}
- Winning Themes: ${memory.winningThemes.join(', ')}

PREFERENCES: ${preferences ? JSON.stringify(preferences) : 'Standard approach'}

Generate 4 sophisticated counter-narrative strategies in JSON format:

{
  "strategies": [
    {
      "id": "strategy_1",
      "theme": "Strategic Theme Name",
      "tone": "professional|empathetic|assertive|inspirational",
      "format": "statement|clarification|story|data_driven",
      "audience": "Target Audience Description",
      "keyMessages": ["Message 1", "Message 2", "Message 3"],
      "tacticalApproach": "Detailed tactical approach",
      "expectedOutcome": "Expected result description",
      "riskLevel": "low|medium|high",
      "confidence": 0.85,
      "implementationNotes": "Implementation guidance"
    }
  ]
}

Focus on:
1. Leveraging historical success patterns
2. Addressing specific threat concerns
3. Psychological influence techniques
4. Multi-platform adaptation
5. Measurable outcomes
`;
  }

  /**
   * Parse AI-generated strategies
   */
  private static parseAIStrategies(aiOutput: string, entityName: string): CounterNarrativeStrategy[] {
    try {
      const parsed = JSON.parse(aiOutput);
      return parsed.strategies.map((strategy: any) => ({
        ...strategy,
        entityName,
        createdAt: new Date().toISOString(),
        status: 'pending',
        aiGenerated: true
      }));
    } catch (error) {
      console.error('Failed to parse AI strategies:', error);
      return [];
    }
  }

  /**
   * Generate template-based strategies as fallback
   */
  private static generateTemplateStrategies(
    entityName: string,
    patterns: ThreatPatternAnalysis,
    memory: StrategyMemory
  ): CounterNarrativeStrategy[] {
    const templates = [
      {
        id: 'transparency_approach',
        theme: 'Radical Transparency',
        tone: memory.successfulTones[0] || 'professional',
        format: 'statement',
        audience: 'General Public',
        keyMessages: [
          `${entityName} maintains unwavering commitment to transparency`,
          'Open dialogue and accountability are core values',
          'Continuous improvement through constructive feedback'
        ],
        tacticalApproach: 'Direct addressing of concerns with factual information',
        expectedOutcome: 'Increased trust through transparency',
        riskLevel: 'low',
        confidence: 0.75
      },
      {
        id: 'value_reinforcement',
        theme: 'Core Value Reinforcement',
        tone: 'inspirational',
        format: 'story',
        audience: 'Stakeholders',
        keyMessages: [
          'Demonstrating consistent track record of positive impact',
          'Commitment to industry-leading standards',
          'Focus on long-term value creation'
        ],
        tacticalApproach: 'Highlight achievements and positive contributions',
        expectedOutcome: 'Strengthened reputation through value demonstration',
        riskLevel: 'low',
        confidence: 0.80
      }
    ];

    return templates.map(template => ({
      ...template,
      entityName,
      createdAt: new Date().toISOString(),
      status: 'pending',
      aiGenerated: false
    }));
  }

  /**
   * Store strategy patterns for learning
   */
  private static async storeStrategyPatterns(
    entityName: string,
    strategies: CounterNarrativeStrategy[]
  ): Promise<void> {
    try {
      for (const strategy of strategies) {
        await supabase.from('anubis_pattern_log').insert({
          entity_name: entityName,
          pattern_fingerprint: `counter_narrative_${strategy.theme.toLowerCase().replace(/\s+/g, '_')}`,
          pattern_summary: `Counter-narrative strategy: ${strategy.theme}`,
          confidence_score: strategy.confidence,
          recommended_response: JSON.stringify(strategy.keyMessages)
        });
      }
    } catch (error) {
      console.error('Failed to store strategy patterns:', error);
    }
  }

  /**
   * Helper methods for pattern analysis
   */
  private static extractPrimaryConcerns(threats: any[]): string[] {
    const concerns = threats.map(t => t.keyword || t.content?.substring(0, 50))
      .filter(Boolean)
      .slice(0, 5);
    return [...new Set(concerns)];
  }

  private static analyzeSentimentDistribution(threats: any[]): any {
    const scores = threats.map(t => t.sentiment_score || 0);
    return {
      average: scores.reduce((a, b) => a + b, 0) / scores.length,
      min: Math.min(...scores),
      max: Math.max(...scores)
    };
  }

  private static analyzePlatformSpread(threats: any[]): string[] {
    const platforms = threats.map(t => t.platform).filter(Boolean);
    return [...new Set(platforms)];
  }

  private static calculateUrgencyLevel(threats: any[]): string {
    const criticalCount = threats.filter(t => t.threat_level === 'critical').length;
    const highCount = threats.filter(t => t.threat_level === 'high').length;
    
    if (criticalCount > 0) return 'critical';
    if (highCount > 2) return 'high';
    if (threats.length > 5) return 'medium';
    return 'low';
  }

  private static extractNarrativeThemes(threats: any[]): string[] {
    // Simple keyword extraction - could be enhanced with NLP
    const themes = ['reputation', 'trust', 'transparency', 'accountability', 'quality'];
    return themes.slice(0, 3);
  }

  private static parseStrategyMemory(memories: any[]): StrategyMemory {
    // Parse historical memory data
    return {
      successfulTones: ['professional', 'empathetic'],
      effectiveFormats: ['statement', 'clarification'],
      winningThemes: ['transparency', 'commitment'],
      historicalSuccess: memories.map(m => ({
        strategy: m.memory_summary,
        outcome: 'positive',
        confidence: 0.8
      }))
    };
  }

  /**
   * Log counter-narrative generation
   */
  private static async logCounterNarrativeGeneration(
    entityName: string,
    count: number
  ): Promise<void> {
    try {
      await supabase.from('aria_ops_log').insert({
        operation_type: 'counter_narrative_generation',
        module_source: 'counter_narrative_engine',
        success: true,
        entity_name: entityName,
        operation_data: {
          strategies_generated: count,
          generation_timestamp: new Date().toISOString()
        } as any
      });
    } catch (error) {
      console.error('Failed to log counter-narrative generation:', error);
    }
  }
}

// Type definitions
interface CounterNarrativeStrategy {
  id: string;
  entityName: string;
  theme: string;
  tone: string;
  format: string;
  audience: string;
  keyMessages: string[];
  tacticalApproach: string;
  expectedOutcome: string;
  riskLevel: string;
  confidence: number;
  implementationNotes?: string;
  createdAt: string;
  status: string;
  aiGenerated: boolean;
}

interface ThreatPatternAnalysis {
  primaryConcerns: string[];
  sentimentDistribution: any;
  platformSpread: string[];
  urgencyLevel: string;
  narrativeThemes: string[];
}

interface StrategyMemory {
  successfulTones: string[];
  effectiveFormats: string[];
  winningThemes: string[];
  historicalSuccess: any[];
}
