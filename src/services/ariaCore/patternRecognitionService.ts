
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * A.R.I.A™ Pattern Recognition Service
 * Advanced pattern learning and threat correlation
 */
export class PatternRecognitionService {

  /**
   * Analyze and store threat patterns
   */
  static async analyzePatterns(
    entityName: string,
    threatData: any[],
    contextData?: any
  ): Promise<PatternAnalysis> {
    try {
      console.log(`🔍 A.R.I.A™: Analyzing patterns for ${entityName}`);

      const analysis = {
        entityName,
        patternsDetected: 0,
        correlationScore: 0,
        riskTrends: [],
        recommendations: [],
        timestamp: new Date().toISOString()
      };

      // Analyze temporal patterns
      const temporalPatterns = this.analyzeTemporalPatterns(threatData);
      analysis.patternsDetected += temporalPatterns.length;

      // Analyze platform patterns
      const platformPatterns = this.analyzePlatformPatterns(threatData);
      analysis.patternsDetected += platformPatterns.length;

      // Analyze sentiment patterns
      const sentimentPatterns = this.analyzeSentimentPatterns(threatData);
      analysis.patternsDetected += sentimentPatterns.length;

      // Calculate overall correlation score
      analysis.correlationScore = this.calculateCorrelationScore(
        temporalPatterns,
        platformPatterns,
        sentimentPatterns
      );

      // Generate risk trends
      analysis.riskTrends = this.generateRiskTrends(threatData);

      // Generate pattern-based recommendations
      analysis.recommendations = this.generatePatternRecommendations(
        temporalPatterns,
        platformPatterns,
        sentimentPatterns
      );

      // Store patterns in database
      await this.storePatternAnalysis(entityName, analysis);

      return analysis;

    } catch (error) {
      console.error('Pattern analysis failed:', error);
      throw error;
    }
  }

  /**
   * Get historical pattern data for entity
   */
  static async getPatternHistory(
    entityName: string,
    timeRange?: string
  ): Promise<PatternHistory[]> {
    try {
      const { data: patterns } = await supabase
        .from('anubis_pattern_log')
        .select('*')
        .eq('entity_name', entityName)
        .order('first_detected', { ascending: false })
        .limit(50);

      if (!patterns) return [];

      return patterns.map(pattern => ({
        id: pattern.id,
        patternFingerprint: pattern.pattern_fingerprint,
        summary: pattern.pattern_summary,
        confidence: pattern.confidence_score,
        firstDetected: pattern.first_detected,
        outcome: pattern.previous_outcome,
        recommendedResponse: pattern.recommended_response
      }));

    } catch (error) {
      console.error('Failed to get pattern history:', error);
      return [];
    }
  }

  /**
   * Predict threat evolution based on patterns
   */
  static async predictThreatEvolution(
    entityName: string,
    currentThreats: any[]
  ): Promise<ThreatPrediction[]> {
    try {
      console.log(`🔮 A.R.I.A™: Predicting threat evolution for ${entityName}`);

      const patterns = await this.getPatternHistory(entityName);
      const predictions: ThreatPrediction[] = [];

      // Analyze each current threat against historical patterns
      for (const threat of currentThreats) {
        const matchingPatterns = patterns.filter(pattern => 
          this.patternMatches(threat, pattern)
        );

        if (matchingPatterns.length > 0) {
          const prediction = this.generateThreatPrediction(threat, matchingPatterns);
          predictions.push(prediction);
        }
      }

      return predictions.sort((a, b) => b.confidence - a.confidence);

    } catch (error) {
      console.error('Threat prediction failed:', error);
      return [];
    }
  }

  /**
   * Learn from pattern outcomes
   */
  static async learnFromOutcome(
    entityName: string,
    patternId: string,
    outcome: 'success' | 'failure' | 'partial',
    effectiveness: number
  ): Promise<boolean> {
    try {
      console.log(`📚 A.R.I.A™: Learning from pattern outcome`);

      // Update pattern confidence based on outcome
      const confidenceAdjustment = effectiveness > 0.7 ? 0.1 : -0.1;

      const { error } = await supabase
        .from('anubis_pattern_log')
        .update({
          previous_outcome: outcome,
          confidence_score: supabase.raw(`LEAST(1.0, GREATEST(0.0, confidence_score + ${confidenceAdjustment}))`)
        })
        .eq('id', patternId);

      if (error) throw error;

      // Log learning event
      await supabase.rpc('log_anubis_check', {
        check_name: 'pattern_learning',
        result: `Pattern learning: ${outcome} (effectiveness: ${effectiveness})`,
        passed: outcome === 'success',
        severity: outcome === 'failure' ? 'medium' : 'low',
        notes: `Pattern ID: ${patternId}`
      });

      toast.success('🎯 Pattern learning updated');
      return true;

    } catch (error) {
      console.error('Failed to learn from outcome:', error);
      return false;
    }
  }

  /**
   * Analyze temporal patterns in threats
   */
  private static analyzeTemporalPatterns(threatData: any[]): TemporalPattern[] {
    const patterns: TemporalPattern[] = [];
    
    // Group threats by time periods
    const hourlyDistribution = this.groupByHour(threatData);
    const dailyDistribution = this.groupByDay(threatData);
    
    // Detect peak activity periods
    const peakHours = this.findPeaks(hourlyDistribution);
    if (peakHours.length > 0) {
      patterns.push({
        type: 'peak_activity',
        description: `Peak threat activity at hours: ${peakHours.join(', ')}`,
        confidence: 0.8,
        timeframe: 'hourly'
      });
    }

    // Detect day-of-week patterns
    const weekendActivity = this.analyzeWeekendActivity(dailyDistribution);
    if (weekendActivity.isSignificant) {
      patterns.push({
        type: 'weekend_pattern',
        description: weekendActivity.description,
        confidence: weekendActivity.confidence,
        timeframe: 'weekly'
      });
    }

    return patterns;
  }

  /**
   * Analyze platform distribution patterns
   */
  private static analyzePlatformPatterns(threatData: any[]): PlatformPattern[] {
    const patterns: PlatformPattern[] = [];
    
    const platformDistribution = threatData.reduce((acc, threat) => {
      const platform = threat.platform || 'unknown';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalThreats = threatData.length;
    
    Object.entries(platformDistribution).forEach(([platform, count]) => {
      const percentage = count / totalThreats;
      
      if (percentage >= 0.4) { // Platform represents 40%+ of threats
        patterns.push({
          type: 'platform_concentration',
          platform,
          percentage,
          description: `High concentration on ${platform} (${Math.round(percentage * 100)}%)`,
          confidence: 0.9
        });
      }
    });

    return patterns;
  }

  /**
   * Analyze sentiment patterns
   */
  private static analyzeSentimentPatterns(threatData: any[]): SentimentPattern[] {
    const patterns: SentimentPattern[] = [];
    
    const sentiments = threatData
      .filter(t => t.sentiment_score !== undefined)
      .map(t => t.sentiment_score);

    if (sentiments.length === 0) return patterns;

    const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
    const sentimentVariance = this.calculateVariance(sentiments);

    if (avgSentiment <= -0.6) {
      patterns.push({
        type: 'highly_negative',
        averageSentiment: avgSentiment,
        variance: sentimentVariance,
        description: `Consistently negative sentiment (avg: ${avgSentiment.toFixed(2)})`,
        confidence: 0.85
      });
    }

    if (sentimentVariance < 0.1) {
      patterns.push({
        type: 'sentiment_consistency',
        averageSentiment: avgSentiment,
        variance: sentimentVariance,
        description: 'Consistent sentiment pattern detected',
        confidence: 0.7
      });
    }

    return patterns;
  }

  /**
   * Calculate overall correlation score
   */
  private static calculateCorrelationScore(
    temporal: TemporalPattern[],
    platform: PlatformPattern[],
    sentiment: SentimentPattern[]
  ): number {
    const totalPatterns = temporal.length + platform.length + sentiment.length;
    if (totalPatterns === 0) return 0;

    const avgConfidence = [
      ...temporal.map(p => p.confidence),
      ...platform.map(p => p.confidence),
      ...sentiment.map(p => p.confidence)
    ].reduce((a, b) => a + b, 0) / totalPatterns;

    return Math.min(1.0, avgConfidence * (totalPatterns / 10));
  }

  /**
   * Generate risk trends
   */
  private static generateRiskTrends(threatData: any[]): RiskTrend[] {
    const trends: RiskTrend[] = [];
    
    // Sort threats by date
    const sortedThreats = threatData.sort((a, b) => 
      new Date(a.created_at || a.detected_at).getTime() - 
      new Date(b.created_at || b.detected_at).getTime()
    );

    // Analyze volume trend
    const volumeTrend = this.analyzeVolumeTrend(sortedThreats);
    if (volumeTrend) trends.push(volumeTrend);

    // Analyze severity trend
    const severityTrend = this.analyzeSeverityTrend(sortedThreats);
    if (severityTrend) trends.push(severityTrend);

    return trends;
  }

  /**
   * Generate pattern-based recommendations
   */
  private static generatePatternRecommendations(
    temporal: TemporalPattern[],
    platform: PlatformPattern[],
    sentiment: SentimentPattern[]
  ): string[] {
    const recommendations: string[] = [];

    // Temporal recommendations
    temporal.forEach(pattern => {
      if (pattern.type === 'peak_activity') {
        recommendations.push('Increase monitoring during peak activity hours');
      }
      if (pattern.type === 'weekend_pattern') {
        recommendations.push('Adjust response team availability for weekend patterns');
      }
    });

    // Platform recommendations
    platform.forEach(pattern => {
      if (pattern.type === 'platform_concentration') {
        recommendations.push(`Focus counter-narrative efforts on ${pattern.platform}`);
      }
    });

    // Sentiment recommendations
    sentiment.forEach(pattern => {
      if (pattern.type === 'highly_negative') {
        recommendations.push('Deploy empathetic response strategies for negative sentiment');
      }
      if (pattern.type === 'sentiment_consistency') {
        recommendations.push('Consistent sentiment detected - prepare standardized responses');
      }
    });

    return recommendations;
  }

  /**
   * Store pattern analysis in database
   */
  private static async storePatternAnalysis(
    entityName: string,
    analysis: PatternAnalysis
  ): Promise<void> {
    try {
      await supabase.from('anubis_pattern_log').insert({
        entity_name: entityName,
        pattern_fingerprint: `analysis_${Date.now()}`,
        pattern_summary: `Pattern analysis: ${analysis.patternsDetected} patterns detected`,
        confidence_score: analysis.correlationScore,
        recommended_response: JSON.stringify(analysis.recommendations)
      });
    } catch (error) {
      console.error('Failed to store pattern analysis:', error);
    }
  }

  // Helper methods
  private static groupByHour(threats: any[]): Record<number, number> {
    return threats.reduce((acc, threat) => {
      const hour = new Date(threat.created_at || threat.detected_at).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
  }

  private static groupByDay(threats: any[]): Record<number, number> {
    return threats.reduce((acc, threat) => {
      const day = new Date(threat.created_at || threat.detected_at).getDay();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
  }

  private static findPeaks(distribution: Record<number, number>): number[] {
    const entries = Object.entries(distribution).map(([k, v]) => [parseInt(k), v]);
    const avg = entries.reduce((sum, [, count]) => sum + count, 0) / entries.length;
    
    return entries
      .filter(([, count]) => count > avg * 1.5)
      .map(([hour]) => hour);
  }

  private static analyzeWeekendActivity(distribution: Record<number, number>) {
    const weekdays = [1, 2, 3, 4, 5].reduce((sum, day) => sum + (distribution[day] || 0), 0);
    const weekends = [0, 6].reduce((sum, day) => sum + (distribution[day] || 0), 0);
    
    const total = weekdays + weekends;
    if (total === 0) return { isSignificant: false, description: '', confidence: 0 };
    
    const weekendPercentage = weekends / total;
    
    return {
      isSignificant: weekendPercentage > 0.4,
      description: `${Math.round(weekendPercentage * 100)}% of activity occurs on weekends`,
      confidence: Math.min(0.9, weekendPercentage * 2)
    };
  }

  private static calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b) / values.length;
  }

  private static analyzeVolumeTrend(threats: any[]): RiskTrend | null {
    // Simple trend analysis - could be enhanced
    const recentThreats = threats.slice(-10);
    const olderThreats = threats.slice(-20, -10);
    
    if (recentThreats.length < 5 || olderThreats.length < 5) return null;
    
    const recentAvg = recentThreats.length / 10;
    const olderAvg = olderThreats.length / 10;
    
    const change = (recentAvg - olderAvg) / olderAvg;
    
    return {
      type: 'volume',
      direction: change > 0.2 ? 'increasing' : change < -0.2 ? 'decreasing' : 'stable',
      magnitude: Math.abs(change),
      description: `Threat volume ${change > 0.2 ? 'increasing' : change < -0.2 ? 'decreasing' : 'stable'}`,
      confidence: Math.min(0.9, Math.abs(change) * 2)
    };
  }

  private static analyzeSeverityTrend(threats: any[]): RiskTrend | null {
    // Analyze severity progression
    const recentSeverities = threats.slice(-10)
      .map(t => this.normalizeSeverity(t.severity || t.threat_level))
      .filter(s => s !== null);
    
    if (recentSeverities.length < 5) return null;
    
    const avgSeverity = recentSeverities.reduce((a, b) => a + b!, 0) / recentSeverities.length;
    
    return {
      type: 'severity',
      direction: avgSeverity > 0.7 ? 'increasing' : avgSeverity < 0.3 ? 'decreasing' : 'stable',
      magnitude: avgSeverity,
      description: `Average threat severity: ${avgSeverity.toFixed(2)}`,
      confidence: 0.8
    };
  }

  private static normalizeSeverity(severity: any): number | null {
    if (typeof severity === 'number') return Math.min(1, severity / 10);
    if (typeof severity === 'string') {
      const severityMap = { low: 0.2, medium: 0.5, high: 0.8, critical: 1.0 };
      return severityMap[severity.toLowerCase() as keyof typeof severityMap] || null;
    }
    return null;
  }

  private static patternMatches(threat: any, pattern: PatternHistory): boolean {
    // Simple pattern matching - could be enhanced with ML
    const threatFingerprint = `${threat.platform}_${threat.threat_type || 'unknown'}_${threat.severity || 'unknown'}`;
    return pattern.patternFingerprint.includes(threatFingerprint) || 
           threatFingerprint.includes(pattern.patternFingerprint);
  }

  private static generateThreatPrediction(
    threat: any,
    patterns: PatternHistory[]
  ): ThreatPrediction {
    const bestPattern = patterns.reduce((prev, current) => 
      prev.confidence > current.confidence ? prev : current
    );

    return {
      threatId: threat.id,
      predictedEvolution: 'escalation',
      probability: bestPattern.confidence * 0.8,
      timeframe: '24-48 hours',
      confidence: bestPattern.confidence,
      basedOnPattern: bestPattern.patternFingerprint,
      recommendedActions: ['Monitor closely', 'Prepare response templates', 'Alert response team']
    };
  }
}

// Type definitions
interface PatternAnalysis {
  entityName: string;
  patternsDetected: number;
  correlationScore: number;
  riskTrends: RiskTrend[];
  recommendations: string[];
  timestamp: string;
}

interface PatternHistory {
  id: string;
  patternFingerprint: string;
  summary: string;
  confidence: number;
  firstDetected: string;
  outcome?: string;
  recommendedResponse?: string;
}

interface ThreatPrediction {
  threatId: string;
  predictedEvolution: string;
  probability: number;
  timeframe: string;
  confidence: number;
  basedOnPattern: string;
  recommendedActions: string[];
}

interface TemporalPattern {
  type: string;
  description: string;
  confidence: number;
  timeframe: string;
}

interface PlatformPattern {
  type: string;
  platform: string;
  percentage: number;
  description: string;
  confidence: number;
}

interface SentimentPattern {
  type: string;
  averageSentiment: number;
  variance: number;
  description: string;
  confidence: number;
}

interface RiskTrend {
  type: string;
  direction: string;
  magnitude: number;
  description: string;
  confidence: number;
}
