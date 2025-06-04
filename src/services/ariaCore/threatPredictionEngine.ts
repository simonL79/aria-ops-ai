import { supabase } from '@/integrations/supabase/client';

/**
 * A.R.I.A™ Real-time Threat Prediction Engine
 * Predictive analysis with confidence scoring
 */
export class ThreatPredictionEngine {

  /**
   * Predict threat evolution and escalation patterns
   */
  static async predictThreatEvolution(
    entityName: string,
    currentThreat: any,
    historicalContext: any[] = []
  ): Promise<ThreatPrediction> {
    console.log(`🔮 Threat prediction initiated for: ${entityName}`);
    
    try {
      // Analyze historical patterns
      const historicalPatterns = await this.analyzeHistoricalPatterns(entityName);
      
      // Current threat momentum
      const momentum = this.calculateThreatMomentum(currentThreat, historicalContext);
      
      // Platform-specific escalation patterns
      const platformRisk = this.assessPlatformEscalationRisk(currentThreat.platform);
      
      // Predict likelihood of escalation
      const escalationProbability = this.predictEscalation(momentum, platformRisk, historicalPatterns);
      
      // Timeline prediction
      const timelinePrediction = this.predictTimeline(escalationProbability, momentum);
      
      // Impact prediction
      const impactPrediction = this.predictMaxImpact(currentThreat, escalationProbability);
      
      // Generate early warning indicators
      const earlyWarnings = this.generateEarlyWarnings(escalationProbability, timelinePrediction);
      
      // Log prediction
      await this.logPrediction(entityName, escalationProbability, timelinePrediction);
      
      return {
        entityName,
        escalationProbability,
        timelinePrediction,
        impactPrediction,
        earlyWarnings,
        confidence: this.calculatePredictionConfidence(historicalPatterns, momentum),
        recommendedActions: this.generatePreventiveActions(escalationProbability, impactPrediction)
      };
      
    } catch (error) {
      console.error('Threat prediction failed:', error);
      throw error;
    }
  }

  /**
   * Analyze historical threat patterns for entity
   */
  private static async analyzeHistoricalPatterns(entityName: string): Promise<HistoricalPattern> {
    try {
      const { data: historicalThreats } = await supabase
        .from('scan_results')
        .select('*')
        .ilike('content', `%${entityName}%`)
        .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (!historicalThreats || historicalThreats.length === 0) {
        return {
          threatFrequency: 0,
          escalationPattern: 'unknown',
          seasonality: 'none',
          platformDistribution: {},
          averageLifespan: 0
        };
      }

      // Calculate threat frequency
      const threatFrequency = historicalThreats.length / 90; // threats per day
      
      // Analyze escalation patterns
      const escalationPattern = this.identifyEscalationPattern(historicalThreats);
      
      // Platform distribution
      const platformDistribution = this.analyzePlatformDistribution(historicalThreats);
      
      // Average threat lifespan
      const averageLifespan = this.calculateAverageLifespan(historicalThreats);
      
      return {
        threatFrequency,
        escalationPattern,
        seasonality: 'none', // Would need more sophisticated analysis
        platformDistribution,
        averageLifespan
      };
      
    } catch (error) {
      console.error('Historical pattern analysis failed:', error);
      return {
        threatFrequency: 0,
        escalationPattern: 'unknown',
        seasonality: 'none',
        platformDistribution: {},
        averageLifespan: 0
      };
    }
  }

  /**
   * Calculate threat momentum
   */
  private static calculateThreatMomentum(
    currentThreat: any,
    historicalContext: any[]
  ): number {
    // Velocity: how quickly similar threats are appearing
    const recentSimilar = historicalContext.filter(t => 
      Date.now() - new Date(t.created_at).getTime() < 24 * 60 * 60 * 1000
    ).length;
    
    // Intensity: severity and engagement
    const intensity = (currentThreat.severity || 1) / 10;
    
    // Growth rate
    const growthRate = recentSimilar / Math.max(historicalContext.length, 1);
    
    return Math.min((recentSimilar * 0.4) + (intensity * 0.4) + (growthRate * 0.2), 1.0);
  }

  /**
   * Assess platform-specific escalation risk
   */
  private static assessPlatformEscalationRisk(platform: string): number {
    const platformRisks = {
      'twitter': 0.9,  // High viral potential
      'reddit': 0.8,  // Community amplification
      'facebook': 0.7, // Broad reach
      'linkedin': 0.6, // Professional networks
      'youtube': 0.8,  // Video content spread
      'instagram': 0.6, // Visual content
      'tiktok': 0.9,   // Viral algorithm
      'news': 0.9,     // Media authority
      'blog': 0.5      // Limited initial reach
    };
    
    return platformRisks[platform?.toLowerCase()] || 0.5;
  }

  /**
   * Predict escalation probability
   */
  private static predictEscalation(
    momentum: number,
    platformRisk: number,
    historicalPatterns: HistoricalPattern
  ): number {
    const baseEscalation = (momentum * 0.4) + (platformRisk * 0.3);
    const historicalFactor = historicalPatterns.escalationPattern === 'high' ? 0.2 : 
                            historicalPatterns.escalationPattern === 'medium' ? 0.1 : 0.05;
    const frequencyFactor = Math.min(historicalPatterns.threatFrequency / 10, 0.1);
    
    return Math.min(baseEscalation + historicalFactor + frequencyFactor, 1.0);
  }

  /**
   * Predict timeline for escalation
   */
  private static predictTimeline(escalationProbability: number, momentum: number): TimelinePrediction {
    if (escalationProbability >= 0.8) {
      return {
        peak: '2-6 hours',
        duration: '24-48 hours',
        urgency: 'critical'
      };
    } else if (escalationProbability >= 0.6) {
      return {
        peak: '6-24 hours',
        duration: '2-5 days',
        urgency: 'high'
      };
    } else if (escalationProbability >= 0.4) {
      return {
        peak: '1-3 days',
        duration: '5-10 days',
        urgency: 'medium'
      };
    } else {
      return {
        peak: '3-7 days',
        duration: '1-2 weeks',
        urgency: 'low'
      };
    }
  }

  /**
   * Predict maximum impact
   */
  private static predictMaxImpact(currentThreat: any, escalationProbability: number): ImpactPrediction {
    const baseImpact = (currentThreat.severity || 1) / 10;
    const amplifiedImpact = baseImpact * (1 + escalationProbability);
    
    return {
      maxSeverity: Math.min(Math.round(amplifiedImpact * 10), 10),
      reachPotential: this.calculateReachPotential(currentThreat.platform, escalationProbability),
      businessImpact: this.assessBusinessImpact(amplifiedImpact),
      reputationRisk: Math.min(amplifiedImpact * 1.2, 1.0)
    };
  }

  /**
   * Generate early warning indicators
   */
  private static generateEarlyWarnings(
    escalationProbability: number,
    timeline: TimelinePrediction
  ): string[] {
    const warnings = [];
    
    if (escalationProbability >= 0.7) {
      warnings.push('High probability of viral spread');
      warnings.push('Multiple platform cross-contamination likely');
      warnings.push('Media pickup possible within ' + timeline.peak);
    }
    
    if (escalationProbability >= 0.5) {
      warnings.push('Increased social media monitoring required');
      warnings.push('Prepare counter-narrative materials');
      warnings.push('Stakeholder notification recommended');
    }
    
    if (escalationProbability >= 0.3) {
      warnings.push('Enhanced tracking recommended');
      warnings.push('Pattern monitoring active');
    }
    
    return warnings;
  }

  /**
   * Generate preventive actions
   */
  private static generatePreventiveActions(
    escalationProbability: number,
    impactPrediction: ImpactPrediction
  ): string[] {
    const actions = [];
    
    if (escalationProbability >= 0.8) {
      actions.push('Immediate crisis team activation');
      actions.push('Preemptive stakeholder communication');
      actions.push('Counter-narrative deployment');
      actions.push('Legal team standby');
    } else if (escalationProbability >= 0.6) {
      actions.push('Enhanced monitoring deployment');
      actions.push('Prepare response materials');
      actions.push('Brief key stakeholders');
    } else if (escalationProbability >= 0.4) {
      actions.push('Increase monitoring frequency');
      actions.push('Document for pattern analysis');
    } else {
      actions.push('Standard monitoring procedures');
    }
    
    return actions;
  }

  /**
   * Helper methods
   */
  private static identifyEscalationPattern(threats: any[]): string {
    if (threats.length < 3) return 'insufficient_data';
    
    const severities = threats.map(t => t.severity || 1);
    const avgSeverity = severities.reduce((a, b) => a + b, 0) / severities.length;
    
    if (avgSeverity >= 7) return 'high';
    if (avgSeverity >= 4) return 'medium';
    return 'low';
  }

  private static analyzePlatformDistribution(threats: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    threats.forEach(threat => {
      const platform = threat.platform || 'unknown';
      distribution[platform] = (distribution[platform] || 0) + 1;
    });
    return distribution;
  }

  private static calculateAverageLifespan(threats: any[]): number {
    // Simplified calculation - would need more sophisticated tracking
    return 72; // hours
  }

  private static calculateReachPotential(platform: string, escalationProbability: number): string {
    const basePotential = this.assessPlatformEscalationRisk(platform);
    const amplifiedPotential = basePotential * escalationProbability;
    
    if (amplifiedPotential >= 0.8) return 'viral';
    if (amplifiedPotential >= 0.6) return 'high';
    if (amplifiedPotential >= 0.4) return 'medium';
    return 'low';
  }

  private static assessBusinessImpact(amplifiedImpact: number): string {
    if (amplifiedImpact >= 0.8) return 'critical';
    if (amplifiedImpact >= 0.6) return 'high';
    if (amplifiedImpact >= 0.4) return 'medium';
    return 'low';
  }

  private static calculatePredictionConfidence(
    historicalPatterns: HistoricalPattern,
    momentum: number
  ): number {
    const dataQuality = historicalPatterns.threatFrequency > 0 ? 0.3 : 0.1;
    const momentumReliability = momentum > 0.1 ? 0.4 : 0.2;
    const baseConfidence = 0.3;
    
    return Math.min(dataQuality + momentumReliability + baseConfidence, 1.0);
  }

  /**
   * Log prediction for analysis
   */
  private static async logPrediction(
    entityName: string,
    escalationProbability: number,
    timeline: TimelinePrediction
  ): Promise<void> {
    try {
      await supabase.from('aria_ops_log').insert({
        operation_type: 'threat_prediction',
        module_source: 'threat_prediction_engine',
        success: true,
        entity_name: entityName,
        operation_data: {
          escalation_probability: escalationProbability,
          timeline_prediction: timeline as any,
          prediction_timestamp: new Date().toISOString()
        } as any
      });
    } catch (error) {
      console.error('Failed to log prediction:', error);
    }
  }
}

// Type definitions
interface ThreatPrediction {
  entityName: string;
  escalationProbability: number;
  timelinePrediction: TimelinePrediction;
  impactPrediction: ImpactPrediction;
  earlyWarnings: string[];
  confidence: number;
  recommendedActions: string[];
}

interface HistoricalPattern {
  threatFrequency: number;
  escalationPattern: string;
  seasonality: string;
  platformDistribution: Record<string, number>;
  averageLifespan: number;
}

interface TimelinePrediction {
  peak: string;
  duration: string;
  urgency: string;
}

interface ImpactPrediction {
  maxSeverity: number;
  reachPotential: string;
  businessImpact: string;
  reputationRisk: number;
}
