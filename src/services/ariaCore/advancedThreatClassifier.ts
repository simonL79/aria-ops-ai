
import { supabase } from '@/integrations/supabase/client';
import { IntelligenceValidationCore } from './intelligenceValidationCore';

/**
 * A.R.I.A™ Advanced Threat Classification Engine
 * Multi-agent analysis with CIA-grade threat modeling
 */
export class AdvancedThreatClassifier {

  /**
   * Multi-agent threat analysis with CIA validation
   */
  static async classifyThreatWithAgents(
    content: string,
    entityName: string,
    platform: string,
    context?: string
  ): Promise<{
    classification: ThreatClassification;
    agentAnalysis: AgentAnalysis;
    ciaValidated: boolean;
    confidence: number;
    recommendations: string[];
  }> {
    console.log(`🎯 Advanced Threat Classification initiated for: ${entityName}`);
    
    try {
      // Step 1: Validate through CIA Intelligence Core
      const validation = await IntelligenceValidationCore.validateIntelligence(
        content,
        entityName,
        platform,
        0.7, // Base confidence for threat analysis
        'threat_classification'
      );

      if (!validation.isValid) {
        return {
          classification: { category: 'Invalid Data', severity: 0, intent: 'unknown', impact: 'none' },
          agentAnalysis: { analyst: 'rejected', validator: 'rejected', strategist: 'rejected' },
          ciaValidated: false,
          confidence: 0,
          recommendations: ['Data rejected by CIA validation']
        };
      }

      // Step 2: Multi-agent analysis
      const analystResult = await this.analystAgent(content, entityName, platform);
      const validatorResult = await this.validatorAgent(content, analystResult, context);
      const strategistResult = await this.strategistAgent(analystResult, validatorResult, entityName);

      // Step 3: CIA-grade threat modeling
      const threatModel = this.buildCIAThreatModel(analystResult, validatorResult, strategistResult);

      // Step 4: Generate recommendations
      const recommendations = this.generateActionRecommendations(threatModel, strategistResult);

      // Step 5: Log the analysis
      await this.logThreatAnalysis(entityName, threatModel, validation.confidence);

      return {
        classification: threatModel,
        agentAnalysis: {
          analyst: analystResult.assessment,
          validator: validatorResult.validation,
          strategist: strategistResult.strategy
        },
        ciaValidated: true,
        confidence: validation.confidence,
        recommendations
      };

    } catch (error) {
      console.error('Advanced threat classification failed:', error);
      throw error;
    }
  }

  /**
   * Analyst Agent: Initial threat assessment
   */
  private static async analystAgent(
    content: string,
    entityName: string,
    platform: string
  ): Promise<AnalystResult> {
    const contentLower = content.toLowerCase();
    const entityLower = entityName.toLowerCase();
    
    // Intent analysis
    const intentPatterns = {
      attack: ['defame', 'expose', 'scam', 'fraud', 'fake', 'lie', 'corrupt', 'illegal'],
      concern: ['worried', 'concerned', 'questionable', 'suspicious', 'doubt'],
      neutral: ['mention', 'discuss', 'reference', 'about'],
      positive: ['excellent', 'great', 'recommend', 'trust', 'quality']
    };

    let intent = 'neutral';
    let intentScore = 0;

    for (const [type, keywords] of Object.entries(intentPatterns)) {
      const matches = keywords.filter(keyword => contentLower.includes(keyword)).length;
      if (matches > intentScore) {
        intent = type;
        intentScore = matches;
      }
    }

    // Impact assessment
    const platformWeight = this.getPlatformWeight(platform);
    const entityMentions = (contentLower.match(new RegExp(entityLower, 'g')) || []).length;
    const contentLength = content.length;
    
    const baseImpact = (intentScore * 0.4) + (platformWeight * 0.3) + (entityMentions * 0.2) + (contentLength > 200 ? 0.1 : 0);
    
    return {
      intent,
      intentConfidence: Math.min(intentScore / 3, 1.0),
      estimatedImpact: Math.min(baseImpact, 1.0),
      keyIndicators: intentPatterns[intent] || [],
      assessment: `${intent}_threat_detected`,
      platformAuthority: platformWeight
    };
  }

  /**
   * Validator Agent: Cross-reference and validation
   */
  private static async validatorAgent(
    content: string,
    analystResult: AnalystResult,
    context?: string
  ): Promise<ValidatorResult> {
    // Source authority validation
    const sourceAuthority = this.assessSourceAuthority(content, analystResult.platformAuthority);
    
    // Context validation
    const contextRelevance = context ? this.validateContext(content, context) : 0.5;
    
    // Pattern matching against known threat signatures
    const threatSignature = this.matchThreatSignatures(content);
    
    // Validation confidence
    const validationConfidence = (sourceAuthority * 0.4) + (contextRelevance * 0.3) + (threatSignature * 0.3);
    
    return {
      sourceAuthority,
      contextRelevance,
      threatSignature,
      validationConfidence,
      validation: validationConfidence > 0.6 ? 'validated' : validationConfidence > 0.3 ? 'partial' : 'rejected'
    };
  }

  /**
   * Strategist Agent: Response strategy and prioritization
   */
  private static async strategistAgent(
    analystResult: AnalystResult,
    validatorResult: ValidatorResult,
    entityName: string
  ): Promise<StrategistResult> {
    // Priority calculation
    const priority = this.calculateThreatPriority(analystResult, validatorResult);
    
    // Response strategy
    const strategy = this.determineResponseStrategy(priority, analystResult.intent);
    
    // Timeline recommendation
    const timeline = this.recommendTimeline(priority, strategy);
    
    // Resource requirements
    const resources = this.assessResourceRequirements(strategy, priority);
    
    return {
      priority,
      strategy,
      timeline,
      resources,
      escalationRequired: priority >= 0.8,
      strategy: `${strategy}_response`
    };
  }

  /**
   * Build CIA-grade threat model
   */
  private static buildCIAThreatModel(
    analyst: AnalystResult,
    validator: ValidatorResult,
    strategist: StrategistResult
  ): ThreatClassification {
    const severity = Math.round((analyst.estimatedImpact * 0.4 + validator.validationConfidence * 0.3 + strategist.priority * 0.3) * 10);
    
    return {
      category: this.mapCategoryFromIntent(analyst.intent),
      severity,
      intent: analyst.intent,
      impact: this.mapImpactLevel(analyst.estimatedImpact),
      sourceAuthority: validator.sourceAuthority,
      confidence: validator.validationConfidence,
      priority: strategist.priority,
      responseStrategy: strategist.strategy
    };
  }

  /**
   * Generate action recommendations
   */
  private static generateActionRecommendations(
    threatModel: ThreatClassification,
    strategist: StrategistResult
  ): string[] {
    const recommendations = [];
    
    if (threatModel.severity >= 8) {
      recommendations.push('Immediate escalation required');
      recommendations.push('Legal review recommended');
      recommendations.push('Stakeholder notification');
    } else if (threatModel.severity >= 5) {
      recommendations.push('Enhanced monitoring');
      recommendations.push('Prepare counter-narrative');
      recommendations.push('Track source development');
    } else {
      recommendations.push('Standard monitoring');
      recommendations.push('Document for patterns');
    }
    
    if (strategist.escalationRequired) {
      recommendations.push('Executive team notification');
    }
    
    return recommendations;
  }

  /**
   * Helper methods
   */
  private static getPlatformWeight(platform: string): number {
    const weights = {
      'reddit': 0.7,
      'twitter': 0.8,
      'facebook': 0.6,
      'linkedin': 0.9,
      'youtube': 0.7,
      'instagram': 0.5,
      'tiktok': 0.6,
      'news': 0.9,
      'blog': 0.6
    };
    return weights[platform.toLowerCase()] || 0.5;
  }

  private static assessSourceAuthority(content: string, platformWeight: number): number {
    const authorityIndicators = ['verified', 'official', 'confirmed', 'reported by'];
    const matches = authorityIndicators.filter(indicator => 
      content.toLowerCase().includes(indicator)
    ).length;
    
    return Math.min((matches * 0.2) + (platformWeight * 0.8), 1.0);
  }

  private static validateContext(content: string, context: string): number {
    const contextWords = context.toLowerCase().split(' ');
    const contentLower = content.toLowerCase();
    const matches = contextWords.filter(word => contentLower.includes(word)).length;
    
    return Math.min(matches / contextWords.length, 1.0);
  }

  private static matchThreatSignatures(content: string): number {
    const signatures = [
      'leaked', 'exposed', 'scandal', 'investigation', 'lawsuit', 
      'fraud', 'scam', 'criminal', 'illegal', 'corruption'
    ];
    
    const contentLower = content.toLowerCase();
    const matches = signatures.filter(sig => contentLower.includes(sig)).length;
    
    return Math.min(matches / 5, 1.0);
  }

  private static calculateThreatPriority(analyst: AnalystResult, validator: ValidatorResult): number {
    return (analyst.estimatedImpact * 0.5) + (validator.validationConfidence * 0.3) + (analyst.intentConfidence * 0.2);
  }

  private static determineResponseStrategy(priority: number, intent: string): string {
    if (priority >= 0.8) return 'immediate';
    if (priority >= 0.6) return 'urgent';
    if (priority >= 0.4) return 'standard';
    return 'monitor';
  }

  private static recommendTimeline(priority: number, strategy: string): string {
    const timelines = {
      immediate: '< 1 hour',
      urgent: '< 4 hours',
      standard: '< 24 hours',
      monitor: '< 72 hours'
    };
    return timelines[strategy] || '< 72 hours';
  }

  private static assessResourceRequirements(strategy: string, priority: number): string[] {
    const baseResources = ['monitoring', 'documentation'];
    
    if (priority >= 0.8) {
      return [...baseResources, 'legal_team', 'pr_team', 'executive_notification'];
    } else if (priority >= 0.6) {
      return [...baseResources, 'content_team', 'social_media_team'];
    }
    
    return baseResources;
  }

  private static mapCategoryFromIntent(intent: string): string {
    const mapping = {
      attack: 'Reputation Attack',
      concern: 'Reputation Concern',
      neutral: 'Neutral Mention',
      positive: 'Positive Mention'
    };
    return mapping[intent] || 'Unknown';
  }

  private static mapImpactLevel(impact: number): string {
    if (impact >= 0.8) return 'critical';
    if (impact >= 0.6) return 'high';
    if (impact >= 0.4) return 'medium';
    return 'low';
  }

  /**
   * Log threat analysis for audit trail
   */
  private static async logThreatAnalysis(
    entityName: string,
    threatModel: ThreatClassification,
    confidence: number
  ): Promise<void> {
    try {
      await supabase.from('aria_ops_log').insert({
        operation_type: 'advanced_threat_classification',
        module_source: 'advanced_threat_classifier',
        success: true,
        entity_name: entityName,
        operation_data: {
          threat_model: threatModel,
          confidence,
          analysis_timestamp: new Date().toISOString(),
          cia_validated: true
        }
      });
    } catch (error) {
      console.error('Failed to log threat analysis:', error);
    }
  }
}

// Type definitions
interface ThreatClassification {
  category: string;
  severity: number;
  intent: string;
  impact: string;
  sourceAuthority?: number;
  confidence?: number;
  priority?: number;
  responseStrategy?: string;
}

interface AnalystResult {
  intent: string;
  intentConfidence: number;
  estimatedImpact: number;
  keyIndicators: string[];
  assessment: string;
  platformAuthority: number;
}

interface ValidatorResult {
  sourceAuthority: number;
  contextRelevance: number;
  threatSignature: number;
  validationConfidence: number;
  validation: string;
}

interface StrategistResult {
  priority: number;
  strategy: string;
  timeline: string;
  resources: string[];
  escalationRequired: boolean;
}

interface AgentAnalysis {
  analyst: string;
  validator: string;
  strategist: string;
}
