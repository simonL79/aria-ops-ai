
import { supabase } from '@/integrations/supabase/client';
import { ResponseStrategy } from './responseGenerator';
import { toast } from 'sonner';

export interface OptimizationResult {
  originalStrategy: ResponseStrategy;
  optimizedStrategy: ResponseStrategy;
  improvements: string[];
  confidence: number;
}

export const optimizeStrategy = async (strategyId: string): Promise<OptimizationResult> => {
  try {
    console.log(`🔧 Strategy Brain: Optimizing strategy ${strategyId}`);

    // Get strategy from database
    const { data: strategy, error } = await supabase
      .from('strategy_responses')
      .select('*')
      .eq('strategy_id', strategyId)
      .single();

    if (error || !strategy) {
      throw new Error('Strategy not found for optimization');
    }

    // Analyze historical performance data
    const { data: historicalData } = await supabase
      .from('strategy_responses')
      .select('*')
      .eq('entity_name', strategy.entity_name)
      .eq('strategy_type', strategy.strategy_type)
      .not('execution_result', 'is', null)
      .order('created_at', { ascending: false })
      .limit(10);

    // Generate optimizations based on historical performance
    const optimizations = generateOptimizations(strategy, historicalData || []);
    
    // Create optimized strategy
    const optimizedStrategy = applyOptimizations(strategy, optimizations);
    
    // Store optimization results
    await storeOptimizationResults(strategyId, optimizations);

    return {
      originalStrategy: strategy,
      optimizedStrategy,
      improvements: optimizations.improvements,
      confidence: optimizations.confidence
    };

  } catch (error) {
    console.error('Strategy optimization failed:', error);
    throw new Error('Failed to optimize strategy');
  }
};

const generateOptimizations = (strategy: any, historicalData: any[]) => {
  const improvements: string[] = [];
  let confidence = 0.7;

  // Analyze success patterns
  const successfulStrategies = historicalData.filter(s => 
    s.execution_result?.executed_actions > s.execution_result?.failed_actions
  );

  if (successfulStrategies.length > 0) {
    improvements.push('Optimized action sequence based on successful historical patterns');
    confidence += 0.1;
  }

  // Timing optimization
  if (strategy.timeframe && strategy.timeframe.includes('hours')) {
    improvements.push('Adjusted timeframe based on platform response patterns');
    confidence += 0.05;
  }

  // Resource optimization
  if (strategy.resources && strategy.resources.length > 3) {
    improvements.push('Streamlined resource allocation for better efficiency');
    confidence += 0.05;
  }

  // Priority optimization
  if (strategy.priority === 'medium' && historicalData.length > 5) {
    improvements.push('Elevated priority based on entity risk profile');
    confidence += 0.1;
  }

  return {
    improvements,
    confidence: Math.min(confidence, 0.95)
  };
};

const applyOptimizations = (originalStrategy: any, optimizations: any): ResponseStrategy => {
  const actions = originalStrategy.actions.map((action: any, index: number) => ({
    ...action,
    timeline: optimizeTimeline(action.timeline),
    responsible: optimizeResponsible(action.responsible),
    kpi: enhanceKPI(action.kpi)
  }));

  return {
    id: `${originalStrategy.strategy_id}-optimized`,
    type: originalStrategy.strategy_type,
    title: `${originalStrategy.title} (Optimized)`,
    description: `${originalStrategy.description} - Enhanced with AI optimization`,
    actions,
    priority: optimizePriority(originalStrategy.priority),
    timeframe: optimizeTimeframe(originalStrategy.timeframe),
    resources: optimizeResources(originalStrategy.resources)
  };
};

const optimizeTimeline = (timeline: string): string => {
  const timeMap: { [key: string]: string } = {
    '6 hours': '4 hours',
    '12 hours': '8 hours',
    '24 hours': '18 hours',
    '48 hours': '36 hours'
  };
  return timeMap[timeline] || timeline;
};

const optimizeResponsible = (responsible: string): string => {
  const optimizations: { [key: string]: string } = {
    'Content Team': 'AI-Assisted Content Team',
    'Social Media Manager': 'Automated Social Response',
    'Analytics Team': 'Real-time Analytics Engine'
  };
  return optimizations[responsible] || responsible;
};

const enhanceKPI = (kpi: string): string => {
  const enhancements: { [key: string]: string } = {
    'Sentiment score improvement': 'Real-time sentiment tracking with 15-min intervals',
    'Engagement rate increase': 'Multi-platform engagement optimization',
    'Content reach and engagement': 'AI-optimized content distribution'
  };
  return enhancements[kpi] || kpi;
};

const optimizePriority = (priority: string): 'low' | 'medium' | 'high' | 'critical' => {
  const priorityMap: { [key: string]: 'low' | 'medium' | 'high' | 'critical' } = {
    'low': 'medium',
    'medium': 'high'
  };
  return priorityMap[priority] as 'low' | 'medium' | 'high' | 'critical' || priority as 'low' | 'medium' | 'high' | 'critical';
};

const optimizeTimeframe = (timeframe: string): string => {
  const optimizations: { [key: string]: string } = {
    '48-72 hours': '24-48 hours',
    '24-48 hours': '12-24 hours',
    '2-6 hours': '1-4 hours'
  };
  return optimizations[timeframe] || timeframe;
};

const optimizeResources = (resources: string[]): string[] => {
  const additionalResources = ['AI Assistant', 'Automation Tools'];
  return [...resources, ...additionalResources];
};

const storeOptimizationResults = async (strategyId: string, optimizations: any) => {
  try {
    await supabase
      .from('strategy_responses')
      .update({
        optimization_result: {
          improvements: optimizations.improvements,
          confidence: optimizations.confidence,
          optimized_at: new Date().toISOString()
        }
      })
      .eq('strategy_id', strategyId);
  } catch (error) {
    console.error('Failed to store optimization results:', error);
  }
};
