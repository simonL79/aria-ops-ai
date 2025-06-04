
import { supabase } from '@/integrations/supabase/client';
import { ResponseStrategy } from './responseGenerator';
import { executeStrategy } from './strategyExecutor';

export interface PlatformStrategy {
  platform: string;
  strategy: ResponseStrategy;
  priority: number;
  timing: 'immediate' | 'delayed' | 'coordinated';
  dependencies: string[];
}

export interface CoordinationPlan {
  id: string;
  entityName: string;
  planName: string;
  platforms: PlatformStrategy[];
  executionSequence: string[];
  totalDuration: number;
  status: 'draft' | 'scheduled' | 'executing' | 'completed' | 'failed';
  createdAt: string;
  scheduledAt?: string;
  completedAt?: string;
}

export interface CrossPlatformMetrics {
  overallReach: number;
  platformSynergy: number;
  messageConsistency: number;
  timingOptimization: number;
  resourceEfficiency: number;
}

const PLATFORM_CONFIGS = {
  'twitter': {
    optimal_timing: [9, 12, 15, 18], // Hours
    max_frequency: 4, // per day
    synergy_platforms: ['linkedin', 'facebook'],
    content_style: 'concise'
  },
  'facebook': {
    optimal_timing: [10, 14, 19, 21],
    max_frequency: 2,
    synergy_platforms: ['instagram', 'twitter'],
    content_style: 'detailed'
  },
  'linkedin': {
    optimal_timing: [8, 12, 17],
    max_frequency: 1,
    synergy_platforms: ['twitter'],
    content_style: 'professional'
  },
  'reddit': {
    optimal_timing: [10, 14, 20, 22],
    max_frequency: 3,
    synergy_platforms: [],
    content_style: 'conversational'
  },
  'instagram': {
    optimal_timing: [11, 14, 17, 19],
    max_frequency: 2,
    synergy_platforms: ['facebook', 'twitter'],
    content_style: 'visual'
  }
};

export const createCoordinationPlan = async (
  entityName: string,
  strategies: ResponseStrategy[],
  targetPlatforms: string[]
): Promise<CoordinationPlan> => {
  try {
    console.log(`🎯 Creating cross-platform coordination plan for ${entityName}`);

    // Map strategies to platforms
    const platformStrategies = mapStrategiesToPlatforms(strategies, targetPlatforms);

    // Optimize execution sequence
    const executionSequence = optimizeExecutionSequence(platformStrategies);

    // Calculate total duration
    const totalDuration = calculateTotalDuration(platformStrategies, executionSequence);

    const plan: CoordinationPlan = {
      id: `coord-${Date.now()}`,
      entityName,
      planName: `Multi-platform response for ${entityName}`,
      platforms: platformStrategies,
      executionSequence,
      totalDuration,
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    // Store coordination plan
    await storePlan(plan);

    console.log(`✅ Coordination plan created: ${plan.id}`);
    return plan;

  } catch (error) {
    console.error('Failed to create coordination plan:', error);
    throw error;
  }
};

const mapStrategiesToPlatforms = (
  strategies: ResponseStrategy[],
  targetPlatforms: string[]
): PlatformStrategy[] => {
  const platformStrategies: PlatformStrategy[] = [];

  targetPlatforms.forEach((platform, index) => {
    // Select best strategy for this platform
    const bestStrategy = selectBestStrategyForPlatform(strategies, platform);
    
    if (bestStrategy) {
      platformStrategies.push({
        platform,
        strategy: adaptStrategyForPlatform(bestStrategy, platform),
        priority: calculatePlatformPriority(platform, bestStrategy),
        timing: determineTiming(platform, index, targetPlatforms.length),
        dependencies: findDependencies(platform, targetPlatforms)
      });
    }
  });

  return platformStrategies;
};

const selectBestStrategyForPlatform = (
  strategies: ResponseStrategy[],
  platform: string
): ResponseStrategy | null => {
  // Platform-specific strategy preferences
  const platformPreferences = {
    'twitter': ['engagement', 'counter_narrative'],
    'facebook': ['defensive', 'engagement'],
    'linkedin': ['proactive', 'engagement'],
    'reddit': ['counter_narrative', 'engagement'],
    'instagram': ['engagement', 'proactive']
  };

  const preferences = platformPreferences[platform] || ['defensive'];
  
  // Find strategy that matches platform preferences
  for (const preferredType of preferences) {
    const strategy = strategies.find(s => s.type === preferredType);
    if (strategy) return strategy;
  }

  // Fallback to first available strategy
  return strategies[0] || null;
};

const adaptStrategyForPlatform = (
  strategy: ResponseStrategy,
  platform: string
): ResponseStrategy => {
  const config = PLATFORM_CONFIGS[platform];
  if (!config) return strategy;

  // Adapt actions for platform
  const adaptedActions = strategy.actions.map(action => ({
    ...action,
    platform: platform,
    timeline: adaptTimingForPlatform(action.timeline, platform),
    action: adaptActionForPlatform(action.action, platform, config.content_style)
  }));

  return {
    ...strategy,
    id: `${strategy.id}-${platform}`,
    title: `${strategy.title} (${platform})`,
    actions: adaptedActions,
    resources: [...strategy.resources, `${platform} account`]
  };
};

const adaptTimingForPlatform = (originalTiming: string, platform: string): string => {
  const config = PLATFORM_CONFIGS[platform];
  if (!config) return originalTiming;

  // Adjust timing based on platform optimal hours
  const currentHour = new Date().getHours();
  const optimalHours = config.optimal_timing;
  const nextOptimalHour = optimalHours.find(h => h > currentHour) || optimalHours[0];

  return `${nextOptimalHour}:00 today`;
};

const adaptActionForPlatform = (
  action: string,
  platform: string,
  contentStyle: string
): string => {
  const adaptations = {
    'concise': (text: string) => text.length > 100 ? text.substring(0, 97) + '...' : text,
    'detailed': (text: string) => text,
    'professional': (text: string) => text.replace(/informal/gi, 'professional'),
    'conversational': (text: string) => text.replace(/deploy/gi, 'share'),
    'visual': (text: string) => text + ' (with accompanying visual content)'
  };

  const adapter = adaptations[contentStyle] || ((text: string) => text);
  return adapter(action);
};

const calculatePlatformPriority = (
  platform: string,
  strategy: ResponseStrategy
): number => {
  const platformWeights = {
    'twitter': 8,
    'facebook': 7,
    'linkedin': 6,
    'reddit': 5,
    'instagram': 4
  };

  const baseWeight = platformWeights[platform] || 3;
  const strategyWeight = strategy.priority === 'critical' ? 2 : 
                        strategy.priority === 'high' ? 1.5 : 1;

  return Math.round(baseWeight * strategyWeight);
};

const determineTiming = (
  platform: string,
  index: number,
  totalPlatforms: number
): 'immediate' | 'delayed' | 'coordinated' => {
  if (totalPlatforms === 1) return 'immediate';
  if (index === 0) return 'immediate';
  if (totalPlatforms > 3 && index < totalPlatforms - 1) return 'coordinated';
  return 'delayed';
};

const findDependencies = (platform: string, allPlatforms: string[]): string[] => {
  const config = PLATFORM_CONFIGS[platform];
  if (!config) return [];

  return allPlatforms.filter(p => 
    config.synergy_platforms.includes(p) && p !== platform
  );
};

const optimizeExecutionSequence = (platformStrategies: PlatformStrategy[]): string[] => {
  // Sort by priority and dependencies
  const sorted = [...platformStrategies].sort((a, b) => {
    if (a.dependencies.length !== b.dependencies.length) {
      return a.dependencies.length - b.dependencies.length; // Dependencies first
    }
    return b.priority - a.priority; // Then by priority
  });

  return sorted.map(ps => ps.platform);
};

const calculateTotalDuration = (
  platformStrategies: PlatformStrategy[],
  executionSequence: string[]
): number => {
  let totalMinutes = 0;
  
  executionSequence.forEach((platform, index) => {
    const strategy = platformStrategies.find(ps => ps.platform === platform);
    if (!strategy) return;

    // Base execution time per action
    const baseTime = strategy.strategy.actions.length * 15; // 15 minutes per action
    
    // Add coordination delay for non-immediate executions
    if (strategy.timing === 'delayed') {
      totalMinutes += 60; // 1 hour delay
    } else if (strategy.timing === 'coordinated') {
      totalMinutes += 30; // 30 minute coordination window
    }

    totalMinutes += baseTime;
  });

  return totalMinutes;
};

export const executeCoordinationPlan = async (planId: string): Promise<void> => {
  try {
    console.log(`🚀 Executing coordination plan: ${planId}`);

    const plan = await getPlan(planId);
    if (!plan) throw new Error('Plan not found');

    // Update plan status
    plan.status = 'executing';
    await updatePlan(plan);

    // Execute platforms in sequence
    for (const platform of plan.executionSequence) {
      const platformStrategy = plan.platforms.find(ps => ps.platform === platform);
      if (!platformStrategy) continue;

      try {
        // Wait for dependencies
        await waitForDependencies(platformStrategy, plan);

        // Execute strategy for this platform
        console.log(`🎯 Executing ${platform} strategy...`);
        await executeStrategy(platformStrategy.strategy.id);

        // Apply timing delays
        if (platformStrategy.timing === 'delayed') {
          await delay(60000); // 1 minute delay for demo
        } else if (platformStrategy.timing === 'coordinated') {
          await delay(30000); // 30 second delay for demo
        }

      } catch (error) {
        console.error(`❌ Failed to execute ${platform} strategy:`, error);
        // Continue with other platforms
      }
    }

    // Update plan completion
    plan.status = 'completed';
    plan.completedAt = new Date().toISOString();
    await updatePlan(plan);

    console.log(`✅ Coordination plan completed: ${planId}`);

  } catch (error) {
    console.error('Coordination plan execution failed:', error);
    throw error;
  }
};

const waitForDependencies = async (
  platformStrategy: PlatformStrategy,
  plan: CoordinationPlan
): Promise<void> => {
  // In a real implementation, this would check if dependent platforms have completed
  // For now, we'll simulate with a small delay
  if (platformStrategy.dependencies.length > 0) {
    console.log(`⏳ Waiting for dependencies: ${platformStrategy.dependencies.join(', ')}`);
    await delay(5000); // 5 second simulation
  }
};

export const calculateMetrics = async (planId: string): Promise<CrossPlatformMetrics> => {
  try {
    const plan = await getPlan(planId);
    if (!plan) throw new Error('Plan not found');

    // Calculate metrics based on plan execution
    const metrics: CrossPlatformMetrics = {
      overallReach: calculateOverallReach(plan),
      platformSynergy: calculatePlatformSynergy(plan),
      messageConsistency: calculateMessageConsistency(plan),
      timingOptimization: calculateTimingOptimization(plan),
      resourceEfficiency: calculateResourceEfficiency(plan)
    };

    // Store metrics
    await supabase.from('aria_ops_log').insert({
      operation_type: 'coordination_metrics',
      module_source: 'cross_platform_coordinator',
      success: true,
      entity_name: plan.entityName,
      operation_data: { planId, metrics } as any
    });

    return metrics;

  } catch (error) {
    console.error('Failed to calculate metrics:', error);
    throw error;
  }
};

const calculateOverallReach = (plan: CoordinationPlan): number => {
  // Simulate reach calculation based on platforms
  const platformReach = {
    'twitter': 0.8,
    'facebook': 0.9,
    'linkedin': 0.6,
    'reddit': 0.7,
    'instagram': 0.75
  };

  const totalReach = plan.platforms.reduce((sum, ps) => {
    return sum + (platformReach[ps.platform] || 0.5);
  }, 0);

  return Math.min(totalReach / plan.platforms.length, 1.0);
};

const calculatePlatformSynergy = (plan: CoordinationPlan): number => {
  let synergyScore = 0;
  let comparisons = 0;

  plan.platforms.forEach(ps1 => {
    plan.platforms.forEach(ps2 => {
      if (ps1.platform !== ps2.platform) {
        const config1 = PLATFORM_CONFIGS[ps1.platform];
        const config2 = PLATFORM_CONFIGS[ps2.platform];
        
        if (config1?.synergy_platforms.includes(ps2.platform)) {
          synergyScore += 1;
        }
        comparisons += 1;
      }
    });
  });

  return comparisons > 0 ? synergyScore / comparisons : 0;
};

const calculateMessageConsistency = (plan: CoordinationPlan): number => {
  // Simulate consistency based on strategy type alignment
  const strategyTypes = plan.platforms.map(ps => ps.strategy.type);
  const uniqueTypes = new Set(strategyTypes);
  
  return 1 - ((uniqueTypes.size - 1) / Math.max(strategyTypes.length - 1, 1));
};

const calculateTimingOptimization = (plan: CoordinationPlan): number => {
  const coordinatedPlatforms = plan.platforms.filter(ps => ps.timing === 'coordinated').length;
  return coordinatedPlatforms / plan.platforms.length;
};

const calculateResourceEfficiency = (plan: CoordinationPlan): number => {
  const totalActions = plan.platforms.reduce((sum, ps) => sum + ps.strategy.actions.length, 0);
  const avgActionsPerPlatform = totalActions / plan.platforms.length;
  
  // More efficient if actions are balanced across platforms
  return 1 - (Math.abs(avgActionsPerPlatform - 3) / 10); // Optimal around 3 actions per platform
};

// Helper functions
const storePlan = async (plan: CoordinationPlan): Promise<void> => {
  await supabase.from('aria_ops_log').insert({
    operation_type: 'coordination_plan',
    module_source: 'cross_platform_coordinator',
    success: true,
    entity_name: plan.entityName,
    operation_data: plan as any
  });
};

const getPlan = async (planId: string): Promise<CoordinationPlan | null> => {
  const { data } = await supabase
    .from('aria_ops_log')
    .select('*')
    .eq('operation_type', 'coordination_plan')
    .eq('operation_data->id', planId)
    .single();

  return data?.operation_data as CoordinationPlan || null;
};

const updatePlan = async (plan: CoordinationPlan): Promise<void> => {
  await supabase
    .from('aria_ops_log')
    .update({ operation_data: plan as any })
    .eq('operation_type', 'coordination_plan')
    .eq('operation_data->id', plan.id);
};

const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
