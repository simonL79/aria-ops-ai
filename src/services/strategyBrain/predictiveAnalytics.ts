
import { supabase } from '@/integrations/supabase/client';
import { ResponseStrategy } from './responseGenerator';

export interface PredictionMetrics {
  successProbability: number;
  timeToComplete: number;
  resourceRequirement: number;
  riskLevel: number;
  confidenceScore: number;
}

export interface StrategyPrediction {
  strategyId: string;
  entityName: string;
  predictedOutcome: 'success' | 'partial' | 'failure';
  metrics: PredictionMetrics;
  recommendations: string[];
  alternativeStrategies: string[];
  predictionTimestamp: string;
}

export const predictStrategySuccess = async (
  strategy: ResponseStrategy,
  entityName: string,
  historicalContext?: any[]
): Promise<StrategyPrediction> => {
  try {
    console.log(`🔮 Predictive Analytics: Analyzing strategy ${strategy.id} for ${entityName}`);

    // Get historical performance data
    const { data: historicalData } = await supabase
      .from('strategy_responses')
      .select('*')
      .eq('entity_name', entityName)
      .eq('strategy_type', strategy.type)
      .not('execution_result', 'is', null)
      .order('created_at', { ascending: false })
      .limit(20);

    // Calculate success probability based on historical patterns
    const successProbability = calculateSuccessProbability(strategy, historicalData || []);
    
    // Predict time to completion
    const timeToComplete = predictTimeToComplete(strategy, historicalData || []);
    
    // Assess resource requirements
    const resourceRequirement = assessResourceRequirement(strategy);
    
    // Calculate risk level
    const riskLevel = calculateRiskLevel(strategy, entityName);
    
    // Generate confidence score
    const confidenceScore = calculateConfidenceScore(historicalData?.length || 0, successProbability);

    const metrics: PredictionMetrics = {
      successProbability,
      timeToComplete,
      resourceRequirement,
      riskLevel,
      confidenceScore
    };

    // Generate recommendations based on predictions
    const recommendations = generateRecommendations(metrics, strategy);
    
    // Suggest alternative strategies if needed
    const alternativeStrategies = suggestAlternatives(metrics, strategy);

    // Determine predicted outcome
    const predictedOutcome = determinePredictedOutcome(metrics);

    const prediction: StrategyPrediction = {
      strategyId: strategy.id,
      entityName,
      predictedOutcome,
      metrics,
      recommendations,
      alternativeStrategies,
      predictionTimestamp: new Date().toISOString()
    };

    // Store prediction for future analysis
    await storePrediction(prediction);

    return prediction;

  } catch (error) {
    console.error('Predictive analysis failed:', error);
    throw new Error('Failed to generate strategy prediction');
  }
};

const calculateSuccessProbability = (strategy: ResponseStrategy, historicalData: any[]): number => {
  if (historicalData.length === 0) return 0.7; // Default baseline

  const successfulStrategies = historicalData.filter(s => {
    const result = s.execution_result as any;
    return result?.executed_actions > (result?.failed_actions || 0);
  });

  const baseSuccess = successfulStrategies.length / historicalData.length;

  // Adjust based on strategy complexity
  const complexityFactor = strategy.actions.length > 5 ? 0.9 : 1.0;
  
  // Adjust based on priority
  const priorityFactor = strategy.priority === 'critical' ? 1.1 : 
                        strategy.priority === 'high' ? 1.05 : 1.0;

  return Math.min(baseSuccess * complexityFactor * priorityFactor, 0.95);
};

const predictTimeToComplete = (strategy: ResponseStrategy, historicalData: any[]): number => {
  if (historicalData.length === 0) {
    // Default estimates based on strategy type
    const typeEstimates = {
      'defensive': 4,
      'proactive': 8,
      'counter_narrative': 6,
      'legal': 24,
      'engagement': 12
    };
    return typeEstimates[strategy.type] || 8;
  }

  const completedStrategies = historicalData.filter(s => s.status === 'completed');
  if (completedStrategies.length === 0) return 8;

  const avgTime = completedStrategies.reduce((sum, s) => {
    const start = new Date(s.created_at);
    const end = new Date(s.execution_result?.completed_at || s.updated_at);
    return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
  }, 0) / completedStrategies.length;

  return Math.round(avgTime);
};

const assessResourceRequirement = (strategy: ResponseStrategy): number => {
  let baseRequirement = 0.5;

  // Factor in number of actions
  baseRequirement += strategy.actions.length * 0.1;

  // Factor in resource types
  const resourceMultiplier = strategy.resources.length * 0.15;
  baseRequirement += resourceMultiplier;

  // Factor in strategy type complexity
  const typeComplexity = {
    'defensive': 0.3,
    'proactive': 0.7,
    'counter_narrative': 0.6,
    'legal': 0.9,
    'engagement': 0.5
  };
  
  baseRequirement += typeComplexity[strategy.type] || 0.5;

  return Math.min(baseRequirement, 1.0);
};

const calculateRiskLevel = (strategy: ResponseStrategy, entityName: string): number => {
  let riskLevel = 0.3; // Base risk

  // Higher risk for legal strategies
  if (strategy.type === 'legal') riskLevel += 0.4;
  
  // Higher risk for counter-narrative
  if (strategy.type === 'counter_narrative') riskLevel += 0.3;
  
  // Higher risk for critical priority
  if (strategy.priority === 'critical') riskLevel += 0.2;

  // Factor in number of actions (more actions = more risk)
  riskLevel += strategy.actions.length * 0.05;

  return Math.min(riskLevel, 1.0);
};

const calculateConfidenceScore = (dataPoints: number, successProbability: number): number => {
  const dataConfidence = Math.min(dataPoints / 10, 1.0) * 0.5;
  const probabilityConfidence = successProbability * 0.3;
  const baseConfidence = 0.2;

  return dataConfidence + probabilityConfidence + baseConfidence;
};

const generateRecommendations = (metrics: PredictionMetrics, strategy: ResponseStrategy): string[] => {
  const recommendations: string[] = [];

  if (metrics.successProbability < 0.6) {
    recommendations.push('Consider strategy optimization before execution');
    recommendations.push('Review historical similar cases for improvements');
  }

  if (metrics.resourceRequirement > 0.8) {
    recommendations.push('Ensure adequate resource allocation');
    recommendations.push('Consider breaking into smaller phases');
  }

  if (metrics.riskLevel > 0.7) {
    recommendations.push('Implement additional risk mitigation measures');
    recommendations.push('Consider legal review before execution');
  }

  if (metrics.timeToComplete > 12) {
    recommendations.push('Set intermediate milestones for tracking');
    recommendations.push('Consider parallel execution of actions');
  }

  if (recommendations.length === 0) {
    recommendations.push('Strategy shows good success indicators');
    recommendations.push('Proceed with standard execution protocols');
  }

  return recommendations;
};

const suggestAlternatives = (metrics: PredictionMetrics, strategy: ResponseStrategy): string[] => {
  const alternatives: string[] = [];

  if (metrics.successProbability < 0.5) {
    alternatives.push('Defensive monitoring approach');
    alternatives.push('Gradual engagement strategy');
  }

  if (metrics.riskLevel > 0.8) {
    alternatives.push('Low-risk monitoring only');
    alternatives.push('Third-party mediated approach');
  }

  if (metrics.resourceRequirement > 0.9) {
    alternatives.push('Simplified action plan');
    alternatives.push('Automated response deployment');
  }

  return alternatives;
};

const determinePredictedOutcome = (metrics: PredictionMetrics): 'success' | 'partial' | 'failure' => {
  const overallScore = (
    metrics.successProbability * 0.4 +
    (1 - metrics.riskLevel) * 0.3 +
    (1 - metrics.resourceRequirement) * 0.2 +
    metrics.confidenceScore * 0.1
  );

  if (overallScore >= 0.75) return 'success';
  if (overallScore >= 0.5) return 'partial';
  return 'failure';
};

const storePrediction = async (prediction: StrategyPrediction): Promise<void> => {
  try {
    await supabase.from('aria_ops_log').insert({
      operation_type: 'strategy_prediction',
      module_source: 'predictive_analytics',
      success: true,
      entity_name: prediction.entityName,
      operation_data: prediction as any
    });
  } catch (error) {
    console.error('Failed to store prediction:', error);
  }
};

export const getBestStrategies = async (entityName: string, limit: number = 3): Promise<ResponseStrategy[]> => {
  try {
    const { data: strategies } = await supabase
      .from('strategy_responses')
      .select('*')
      .eq('entity_name', entityName)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!strategies || strategies.length === 0) return [];

    // Run predictions on all strategies
    const predictions = await Promise.all(
      strategies.map(async (strategy) => {
        const prediction = await predictStrategySuccess(strategy as any, entityName);
        return { strategy, prediction };
      })
    );

    // Sort by success probability and return top strategies
    return predictions
      .sort((a, b) => b.prediction.metrics.successProbability - a.prediction.metrics.successProbability)
      .slice(0, limit)
      .map(p => p.strategy as any);

  } catch (error) {
    console.error('Failed to get best strategies:', error);
    return [];
  }
};
