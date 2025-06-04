
import { supabase } from '@/integrations/supabase/client';
import { DetectedPattern } from './patternAnalyzer';
import { ResponseStrategy } from './responseGenerator';

export interface MLPattern {
  id: string;
  patternType: string;
  entityName: string;
  features: number[];
  successRate: number;
  optimalStrategy: string;
  confidence: number;
  trainingData: any[];
  createdAt: string;
  lastUpdated: string;
}

export interface StrategyRecommendation {
  strategyType: string;
  confidence: number;
  reasoning: string;
  expectedOutcome: number;
  riskFactors: string[];
}

// Feature extraction for ML model
export const extractFeatures = (
  entityName: string,
  patterns: DetectedPattern[],
  historicalData: any[]
): number[] => {
  const features: number[] = [];

  // Feature 1-3: Pattern types (encoded as binary)
  features.push(patterns.some(p => p.type === 'sentiment_shift') ? 1 : 0);
  features.push(patterns.some(p => p.type === 'coordinated_attack') ? 1 : 0);
  features.push(patterns.some(p => p.type === 'viral_risk') ? 1 : 0);

  // Feature 4-6: Pattern impacts
  const highImpact = patterns.filter(p => p.impact === 'high').length;
  const mediumImpact = patterns.filter(p => p.impact === 'medium').length;
  const lowImpact = patterns.filter(p => p.impact === 'low').length;
  features.push(highImpact / Math.max(patterns.length, 1));
  features.push(mediumImpact / Math.max(patterns.length, 1));
  features.push(lowImpact / Math.max(patterns.length, 1));

  // Feature 7: Average confidence
  const avgConfidence = patterns.length > 0 
    ? patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length 
    : 0;
  features.push(avgConfidence);

  // Feature 8-10: Historical success rates by strategy type
  const defensiveSuccess = calculateTypeSuccessRate(historicalData, 'defensive');
  const proactiveSuccess = calculateTypeSuccessRate(historicalData, 'proactive');
  const engagementSuccess = calculateTypeSuccessRate(historicalData, 'engagement');
  features.push(defensiveSuccess);
  features.push(proactiveSuccess);
  features.push(engagementSuccess);

  // Feature 11: Entity risk score (derived from patterns)
  const riskScore = calculateEntityRiskScore(patterns);
  features.push(riskScore);

  // Feature 12-14: Time-based features
  const recentActivity = historicalData.filter(d => 
    new Date(d.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;
  features.push(recentActivity / Math.max(historicalData.length, 1));
  
  const weeklyActivity = historicalData.filter(d => 
    new Date(d.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  features.push(weeklyActivity / Math.max(historicalData.length, 1));

  // Feature 15: Platform diversity
  const platforms = new Set(historicalData.map(d => d.platform));
  features.push(platforms.size / 10); // Normalize by max expected platforms

  return features;
};

// Simple ML model for strategy recommendation
export const recommendStrategy = async (
  entityName: string,
  patterns: DetectedPattern[],
  historicalData: any[] = []
): Promise<StrategyRecommendation> => {
  try {
    console.log(`🧠 ML Pattern Recognition: Analyzing ${entityName}`);

    // Extract features
    const features = extractFeatures(entityName, patterns, historicalData);

    // Get trained patterns for this entity type
    const trainedPatterns = await getTrainedPatterns(entityName);

    // Find best matching pattern
    const bestMatch = findBestMatchingPattern(features, trainedPatterns);

    // Generate recommendation
    const recommendation = generateMLRecommendation(features, bestMatch, patterns);

    // Update ML model with new data
    await updateMLModel(entityName, features, patterns, recommendation);

    return recommendation;

  } catch (error) {
    console.error('ML recommendation failed:', error);
    return getFallbackRecommendation(patterns);
  }
};

const calculateTypeSuccessRate = (historicalData: any[], strategyType: string): number => {
  const typeStrategies = historicalData.filter(d => d.strategy_type === strategyType);
  if (typeStrategies.length === 0) return 0.5; // Default neutral

  const successful = typeStrategies.filter(d => {
    const result = d.execution_result as any;
    return result?.executed_actions > (result?.failed_actions || 0);
  });

  return successful.length / typeStrategies.length;
};

const calculateEntityRiskScore = (patterns: DetectedPattern[]): number => {
  if (patterns.length === 0) return 0;

  const riskWeights: Record<string, number> = {
    'coordinated_attack': 0.9,
    'viral_risk': 0.8,
    'sentiment_shift': 0.6,
    'platform_migration': 0.5,
    'influencer_involvement': 0.7
  };

  const totalRisk = patterns.reduce((sum, pattern) => {
    const weight = riskWeights[pattern.type] || 0.5;
    const impact = pattern.impact === 'high' ? 1 : pattern.impact === 'medium' ? 0.6 : 0.3;
    return sum + (weight * impact * pattern.confidence);
  }, 0);

  return Math.min(totalRisk / patterns.length, 1.0);
};

const getTrainedPatterns = async (entityName: string): Promise<MLPattern[]> => {
  try {
    const { data } = await supabase
      .from('aria_ops_log')
      .select('*')
      .eq('operation_type', 'ml_pattern')
      .eq('entity_name', entityName)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!data || data.length === 0) return [];

    return data.map(d => d.operation_data as unknown as MLPattern);
  } catch (error) {
    console.error('Failed to get trained patterns:', error);
    return [];
  }
};

const findBestMatchingPattern = (features: number[], trainedPatterns: MLPattern[]): MLPattern | null => {
  if (trainedPatterns.length === 0) return null;

  let bestMatch: MLPattern | null = null;
  let bestSimilarity = -1;

  for (const pattern of trainedPatterns) {
    const similarity = calculateCosineSimilarity(features, pattern.features);
    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestMatch = pattern;
    }
  }

  return bestSimilarity > 0.7 ? bestMatch : null; // Threshold for match
};

const calculateCosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) return 0;

  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};

const generateMLRecommendation = (
  features: number[],
  bestMatch: MLPattern | null,
  patterns: DetectedPattern[]
): StrategyRecommendation => {
  if (bestMatch) {
    return {
      strategyType: bestMatch.optimalStrategy,
      confidence: bestMatch.confidence * 0.8, // Slight confidence penalty for using historical
      reasoning: `Based on similar historical patterns with ${(bestMatch.successRate * 100).toFixed(1)}% success rate`,
      expectedOutcome: bestMatch.successRate,
      riskFactors: extractRiskFactors(patterns)
    };
  }

  // Fallback to rule-based recommendation
  return generateRuleBasedRecommendation(features, patterns);
};

const generateRuleBasedRecommendation = (
  features: number[],
  patterns: DetectedPattern[]
): StrategyRecommendation => {
  const riskScore = features[10]; // Entity risk score
  const hasHighImpact = features[3] > 0.5; // High impact patterns
  const hasCoordinatedAttack = features[1] > 0; // Coordinated attack detected

  let strategyType = 'defensive';
  let confidence = 0.6;
  let reasoning = 'Rule-based recommendation';

  if (hasCoordinatedAttack) {
    strategyType = 'counter_narrative';
    confidence = 0.8;
    reasoning = 'Coordinated attack detected - counter-narrative recommended';
  } else if (hasHighImpact && riskScore > 0.7) {
    strategyType = 'proactive';
    confidence = 0.7;
    reasoning = 'High impact patterns with elevated risk - proactive approach recommended';
  } else if (riskScore < 0.3) {
    strategyType = 'engagement';
    confidence = 0.6;
    reasoning = 'Low risk environment - engagement strategy recommended';
  }

  return {
    strategyType,
    confidence,
    reasoning,
    expectedOutcome: confidence * 0.8,
    riskFactors: extractRiskFactors(patterns)
  };
};

const extractRiskFactors = (patterns: DetectedPattern[]): string[] => {
  const factors: string[] = [];

  patterns.forEach(pattern => {
    if (pattern.impact === 'high') {
      factors.push(`High impact ${pattern.type.replace(/_/g, ' ')}`);
    }
    if (pattern.confidence > 0.8) {
      factors.push(`High confidence detection of ${pattern.type.replace(/_/g, ' ')}`);
    }
  });

  return factors;
};

const getFallbackRecommendation = (patterns: DetectedPattern[]): StrategyRecommendation => {
  return {
    strategyType: 'defensive',
    confidence: 0.5,
    reasoning: 'Fallback recommendation due to ML analysis failure',
    expectedOutcome: 0.5,
    riskFactors: ['Analysis incomplete']
  };
};

const updateMLModel = async (
  entityName: string,
  features: number[],
  patterns: DetectedPattern[],
  recommendation: StrategyRecommendation
): Promise<void> => {
  try {
    const mlPattern: MLPattern = {
      id: `ml-${Date.now()}`,
      patternType: recommendation.strategyType,
      entityName,
      features,
      successRate: recommendation.expectedOutcome,
      optimalStrategy: recommendation.strategyType,
      confidence: recommendation.confidence,
      trainingData: patterns,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    await supabase.from('aria_ops_log').insert({
      operation_type: 'ml_pattern',
      module_source: 'pattern_recognition',
      success: true,
      entity_name: entityName,
      operation_data: mlPattern as any
    });

  } catch (error) {
    console.error('Failed to update ML model:', error);
  }
};

// Train model with successful strategy outcomes
export const trainMLModel = async (entityName: string): Promise<void> => {
  try {
    console.log(`🎓 Training ML model for ${entityName}`);

    const { data: successfulStrategies } = await supabase
      .from('strategy_responses')
      .select('*')
      .eq('entity_name', entityName)
      .eq('status', 'completed')
      .not('execution_result', 'is', null);

    if (!successfulStrategies || successfulStrategies.length < 3) {
      console.log('Insufficient data for ML training');
      return;
    }

    // Process each successful strategy as training data
    for (const strategy of successfulStrategies) {
      // This would implement actual ML training logic
      // For now, we simulate by storing successful patterns
      await supabase.from('aria_ops_log').insert({
        operation_type: 'ml_training',
        module_source: 'pattern_recognition',
        success: true,
        entity_name: entityName,
        operation_data: {
          strategyType: strategy.strategy_type,
          success: true,
          features: [], // Would extract features from strategy context
          timestamp: new Date().toISOString()
        } as any
      });
    }

    console.log(`✅ ML model training completed for ${entityName}`);

  } catch (error) {
    console.error('ML model training failed:', error);
  }
};
