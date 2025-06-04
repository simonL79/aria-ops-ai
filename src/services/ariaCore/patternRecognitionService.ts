
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * A.R.I.A™ Pattern Recognition Service
 * Advanced pattern analysis and threat prediction engine
 */
export class PatternRecognitionService {

  /**
   * Analyze patterns from intelligence memory and feedback
   */
  static async analyzePatterns(entityName: string): Promise<PatternAnalysis> {
    console.log(`🧠 A.R.I.A™: Analyzing patterns for ${entityName}`);
    
    try {
      // Get intelligence memory data
      const { data: memoryData } = await supabase
        .from('anubis_entity_memory')
        .select('*')
        .eq('entity_name', entityName)
        .order('created_at', { ascending: false })
        .limit(50);

      // Get feedback data
      const { data: feedbackData } = await supabase
        .from('anubis_feedback_memory')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      // Get pattern logs
      const { data: patternLogs } = await supabase
        .from('anubis_pattern_log')
        .select('*')
        .eq('entity_name', entityName)
        .order('first_detected', { ascending: false })
        .limit(20);

      const analysis = this.processPatternData(
        memoryData || [],
        feedbackData || [],
        patternLogs || []
      );

      // Store analysis results
      await this.storePatternAnalysis(entityName, analysis);

      return analysis;

    } catch (error) {
      console.error('Pattern analysis failed:', error);
      throw error;
    }
  }

  /**
   * Process raw data into pattern insights
   */
  private static processPatternData(
    memoryData: any[],
    feedbackData: any[],
    patternLogs: any[]
  ): PatternAnalysis {
    const patterns: PatternInsight[] = [];
    const trends: TrendAnalysis[] = [];
    const predictions: ThreatPrediction[] = [];

    // Analyze memory patterns
    const memoryPatterns = this.extractMemoryPatterns(memoryData);
    patterns.push(...memoryPatterns);

    // Analyze feedback patterns
    const feedbackPatterns = this.extractFeedbackPatterns(feedbackData);
    patterns.push(...feedbackPatterns);

    // Generate trend analysis
    trends.push(...this.analyzeTrends(memoryData, feedbackData));

    // Generate predictions
    predictions.push(...this.generatePredictions(patterns, trends));

    return {
      patterns,
      trends,
      predictions,
      confidence: this.calculateOverallConfidence(patterns),
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Extract patterns from memory data
   */
  private static extractMemoryPatterns(memoryData: any[]): PatternInsight[] {
    const patterns: PatternInsight[] = [];

    // Group by memory type
    const groupedMemory = memoryData.reduce((groups, memory) => {
      const type = memory.memory_type || 'unknown';
      if (!groups[type]) groups[type] = [];
      groups[type].push(memory);
      return groups;
    }, {} as Record<string, any[]>);

    // Analyze each group
    Object.entries(groupedMemory).forEach(([type, memories]) => {
      if (memories.length >= 2) {
        patterns.push({
          id: `memory_${type}_${Date.now()}`,
          type: 'memory_pattern',
          description: `Recurring ${type} memory pattern`,
          confidence: Math.min(0.9, memories.length * 0.15),
          frequency: memories.length,
          lastSeen: memories[0]?.created_at || new Date().toISOString(),
          indicators: memories.map(m => m.memory_summary).slice(0, 3),
          riskLevel: memories.length > 5 ? 'high' : 'medium'
        });
      }
    });

    return patterns;
  }

  /**
   * Extract patterns from feedback data
   */
  private static extractFeedbackPatterns(feedbackData: any[]): PatternInsight[] {
    const patterns: PatternInsight[] = [];

    // Analyze successful feedback patterns
    const successfulFeedback = feedbackData.filter(f => 
      f.feedback_score && f.feedback_score >= 4
    );

    if (successfulFeedback.length >= 3) {
      patterns.push({
        id: `feedback_success_${Date.now()}`,
        type: 'success_pattern',
        description: 'High-effectiveness strategy pattern',
        confidence: 0.8,
        frequency: successfulFeedback.length,
        lastSeen: successfulFeedback[0]?.created_at || new Date().toISOString(),
        indicators: successfulFeedback.map(f => f.operator_action).filter(Boolean).slice(0, 3),
        riskLevel: 'low'
      });
    }

    // Analyze failure patterns
    const failedFeedback = feedbackData.filter(f => 
      f.feedback_score && f.feedback_score <= 2
    );

    if (failedFeedback.length >= 2) {
      patterns.push({
        id: `feedback_failure_${Date.now()}`,
        type: 'failure_pattern',
        description: 'Low-effectiveness strategy pattern to avoid',
        confidence: 0.7,
        frequency: failedFeedback.length,
        lastSeen: failedFeedback[0]?.created_at || new Date().toISOString(),
        indicators: failedFeedback.map(f => f.operator_action).filter(Boolean).slice(0, 3),
        riskLevel: 'medium'
      });
    }

    return patterns;
  }

  /**
   * Analyze trends across data
   */
  private static analyzeTrends(memoryData: any[], feedbackData: any[]): TrendAnalysis[] {
    const trends: TrendAnalysis[] = [];

    // Memory volume trend
    const memoryTrend = this.calculateMemoryTrend(memoryData);
    if (memoryTrend) trends.push(memoryTrend);

    // Feedback quality trend
    const feedbackTrend = this.calculateFeedbackTrend(feedbackData);
    if (feedbackTrend) trends.push(feedbackTrend);

    return trends;
  }

  /**
   * Calculate memory volume trend
   */
  private static calculateMemoryTrend(memoryData: any[]): TrendAnalysis | null {
    if (memoryData.length < 5) return null;

    const recentMemories = memoryData.filter(m => {
      const created = new Date(m.created_at);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return created > weekAgo;
    });

    const olderMemories = memoryData.filter(m => {
      const created = new Date(m.created_at);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      return created <= weekAgo && created > twoWeeksAgo;
    });

    const recentCount = recentMemories.length;
    const olderCount = olderMemories.length;

    if (olderCount === 0) return null;

    const changePercentage = ((recentCount - olderCount) / olderCount) * 100;

    return {
      id: `memory_trend_${Date.now()}`,
      type: 'memory_volume',
      direction: changePercentage > 10 ? 'increasing' : changePercentage < -10 ? 'decreasing' : 'stable',
      magnitude: Math.abs(changePercentage),
      description: `Memory generation ${changePercentage > 0 ? 'increased' : 'decreased'} by ${Math.abs(changePercentage).toFixed(1)}%`,
      confidence: 0.7,
      timeframe: '7 days'
    };
  }

  /**
   * Calculate feedback quality trend
   */
  private static calculateFeedbackTrend(feedbackData: any[]): TrendAnalysis | null {
    const scoredFeedback = feedbackData.filter(f => f.feedback_score);
    if (scoredFeedback.length < 5) return null;

    const recentFeedback = scoredFeedback.slice(0, Math.floor(scoredFeedback.length / 2));
    const olderFeedback = scoredFeedback.slice(Math.floor(scoredFeedback.length / 2));

    const recentAvg = recentFeedback.reduce((sum, f) => sum + (f.feedback_score || 0), 0) / recentFeedback.length;
    const olderAvg = olderFeedback.reduce((sum, f) => sum + (f.feedback_score || 0), 0) / olderFeedback.length;

    const improvement = recentAvg - olderAvg;

    return {
      id: `feedback_trend_${Date.now()}`,
      type: 'effectiveness',
      direction: improvement > 0.2 ? 'increasing' : improvement < -0.2 ? 'decreasing' : 'stable',
      magnitude: Math.abs(improvement * 20), // Convert to percentage
      description: `Strategy effectiveness ${improvement > 0 ? 'improved' : 'declined'} by ${Math.abs(improvement * 20).toFixed(1)}%`,
      confidence: 0.8,
      timeframe: 'recent vs historical'
    };
  }

  /**
   * Generate threat predictions
   */
  private static generatePredictions(
    patterns: PatternInsight[],
    trends: TrendAnalysis[]
  ): ThreatPrediction[] {
    const predictions: ThreatPrediction[] = [];

    // High-risk pattern prediction
    const highRiskPatterns = patterns.filter(p => p.riskLevel === 'high');
    if (highRiskPatterns.length > 0) {
      predictions.push({
        id: `prediction_high_risk_${Date.now()}`,
        type: 'escalation_risk',
        description: 'Multiple high-risk patterns detected - increased vigilance recommended',
        probability: Math.min(0.9, highRiskPatterns.length * 0.2),
        timeframe: '1-3 days',
        confidence: 0.75,
        recommendedActions: [
          'Increase monitoring frequency',
          'Prepare counter-narrative templates',
          'Alert response team'
        ]
      });
    }

    // Effectiveness decline prediction
    const decliningTrends = trends.filter(t => t.direction === 'decreasing');
    if (decliningTrends.length > 0) {
      predictions.push({
        id: `prediction_decline_${Date.now()}`,
        type: 'effectiveness_decline',
        description: 'Current strategies showing declining effectiveness',
        probability: 0.6,
        timeframe: '1-2 weeks',
        confidence: 0.7,
        recommendedActions: [
          'Review and update strategy templates',
          'Collect additional feedback',
          'Consider new approach methods'
        ]
      });
    }

    return predictions;
  }

  /**
   * Calculate overall analysis confidence
   */
  private static calculateOverallConfidence(patterns: PatternInsight[]): number {
    if (patterns.length === 0) return 0;
    
    const avgConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length;
    return Math.round(avgConfidence * 100) / 100;
  }

  /**
   * Store pattern analysis results
   */
  private static async storePatternAnalysis(
    entityName: string,
    analysis: PatternAnalysis
  ): Promise<void> {
    try {
      // Store significant patterns
      for (const pattern of analysis.patterns) {
        if (pattern.confidence >= 0.6) {
          await supabase.from('anubis_pattern_log').insert({
            entity_name: entityName,
            pattern_fingerprint: pattern.id,
            pattern_summary: pattern.description,
            confidence_score: pattern.confidence,
            recommended_response: JSON.stringify(pattern.indicators)
          });
        }
      }

      // Log the analysis
      await supabase.from('aria_ops_log').insert({
        operation_type: 'pattern_analysis',
        module_source: 'pattern_recognition_service',
        success: true,
        entity_name: entityName,
        operation_data: {
          patterns_found: analysis.patterns.length,
          trends_identified: analysis.trends.length,
          predictions_generated: analysis.predictions.length,
          overall_confidence: analysis.confidence
        } as any
      });

    } catch (error) {
      console.error('Failed to store pattern analysis:', error);
    }
  }

  /**
   * Get recent pattern insights for entity
   */
  static async getRecentInsights(entityName: string): Promise<PatternInsight[]> {
    try {
      const { data } = await supabase
        .from('anubis_pattern_log')
        .select('*')
        .eq('entity_name', entityName)
        .order('first_detected', { ascending: false })
        .limit(10);

      return (data || []).map(log => ({
        id: log.pattern_fingerprint,
        type: 'stored_pattern',
        description: log.pattern_summary || 'Stored pattern',
        confidence: log.confidence_score || 0,
        frequency: 1,
        lastSeen: log.first_detected || new Date().toISOString(),
        indicators: [],
        riskLevel: log.confidence_score && log.confidence_score > 0.8 ? 'high' : 'medium'
      }));

    } catch (error) {
      console.error('Failed to get recent insights:', error);
      return [];
    }
  }
}

// Type definitions
interface PatternAnalysis {
  patterns: PatternInsight[];
  trends: TrendAnalysis[];
  predictions: ThreatPrediction[];
  confidence: number;
  lastUpdated: string;
}

interface PatternInsight {
  id: string;
  type: string;
  description: string;
  confidence: number;
  frequency: number;
  lastSeen: string;
  indicators: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

interface TrendAnalysis {
  id: string;
  type: string;
  direction: 'increasing' | 'decreasing' | 'stable';
  magnitude: number;
  description: string;
  confidence: number;
  timeframe: string;
}

interface ThreatPrediction {
  id: string;
  type: string;
  description: string;
  probability: number;
  timeframe: string;
  confidence: number;
  recommendedActions: string[];
}
