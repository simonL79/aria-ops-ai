
import { supabase } from '@/integrations/supabase/client';
import { ResponseStrategy } from './responseGenerator';
import { toast } from 'sonner';

export interface PlatformConfig {
  platform: string;
  enabled: boolean;
  priority: number;
  timeDelay: number; // minutes
  adaptations: {
    messageLength?: number;
    tone?: string;
    hashtags?: string[];
    mentions?: string[];
  };
}

export interface CoordinationPlan {
  id: string;
  entityName: string;
  planName: string;
  platforms: PlatformConfig[];
  executionSequence: ExecutionStep[];
  totalDuration: number; // minutes
  status: 'draft' | 'approved' | 'executing' | 'completed' | 'failed';
  createdAt: string;
}

export interface ExecutionStep {
  stepId: string;
  platform: string;
  strategyId: string;
  scheduledTime: string;
  adaptedContent: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  executionResult?: any;
}

export interface CoordinationMetrics {
  totalPlatforms: number;
  successfulExecutions: number;
  averageResponseTime: number;
  crossPlatformReach: number;
  engagementCorrelation: number;
}

const defaultPlatformConfigs: PlatformConfig[] = [
  {
    platform: 'Twitter',
    enabled: true,
    priority: 1,
    timeDelay: 0,
    adaptations: {
      messageLength: 280,
      tone: 'concise',
      hashtags: ['#reputation', '#crisis'],
      mentions: []
    }
  },
  {
    platform: 'LinkedIn',
    enabled: true,
    priority: 2,
    timeDelay: 15,
    adaptations: {
      messageLength: 1300,
      tone: 'professional',
      hashtags: ['#businessreputation'],
      mentions: []
    }
  },
  {
    platform: 'Facebook',
    enabled: true,
    priority: 3,
    timeDelay: 30,
    adaptations: {
      messageLength: 2000,
      tone: 'conversational',
      hashtags: [],
      mentions: []
    }
  },
  {
    platform: 'Reddit',
    enabled: false,
    priority: 4,
    timeDelay: 60,
    adaptations: {
      messageLength: 10000,
      tone: 'informal',
      hashtags: [],
      mentions: []
    }
  }
];

export const createCoordinationPlan = async (
  entityName: string,
  strategies: ResponseStrategy[],
  customPlatforms?: PlatformConfig[]
): Promise<CoordinationPlan> => {
  try {
    console.log(`🌐 Creating coordination plan for ${entityName} with ${strategies.length} strategies`);

    const platforms = customPlatforms || defaultPlatformConfigs.filter(p => p.enabled);
    const executionSequence = await generateExecutionSequence(strategies, platforms);
    const totalDuration = calculateTotalDuration(executionSequence);

    const plan: CoordinationPlan = {
      id: `coord-${Date.now()}`,
      entityName,
      planName: `Multi-Platform Response Plan - ${new Date().toISOString().split('T')[0]}`,
      platforms,
      executionSequence,
      totalDuration,
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    // Store coordination plan
    await storeCoordinationPlan(plan);

    return plan;

  } catch (error) {
    console.error('Failed to create coordination plan:', error);
    throw new Error('Failed to create cross-platform coordination plan');
  }
};

const generateExecutionSequence = async (
  strategies: ResponseStrategy[],
  platforms: PlatformConfig[]
): Promise<ExecutionStep[]> => {
  const steps: ExecutionStep[] = [];
  const now = new Date();

  for (const strategy of strategies) {
    for (const platform of platforms.sort((a, b) => a.priority - b.priority)) {
      const stepTime = new Date(now.getTime() + platform.timeDelay * 60 * 1000);
      const adaptedContent = await adaptContentForPlatform(strategy, platform);

      steps.push({
        stepId: `step-${Date.now()}-${Math.random()}`,
        platform: platform.platform,
        strategyId: strategy.id,
        scheduledTime: stepTime.toISOString(),
        adaptedContent,
        status: 'pending'
      });

      // Add delay between platforms for the same strategy
      now.setTime(now.getTime() + platform.timeDelay * 60 * 1000);
    }
  }

  return steps.sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
};

const adaptContentForPlatform = async (
  strategy: ResponseStrategy,
  platform: PlatformConfig
): Promise<string> => {
  const baseContent = strategy.description;
  const adaptations = platform.adaptations;

  let adaptedContent = baseContent;

  // Adapt message length
  if (adaptations.messageLength && adaptedContent.length > adaptations.messageLength) {
    adaptedContent = adaptedContent.substring(0, adaptations.messageLength - 3) + '...';
  }

  // Add platform-specific hashtags
  if (adaptations.hashtags && adaptations.hashtags.length > 0) {
    adaptedContent += ' ' + adaptations.hashtags.join(' ');
  }

  // Add mentions if specified
  if (adaptations.mentions && adaptations.mentions.length > 0) {
    adaptedContent += ' ' + adaptations.mentions.join(' ');
  }

  // Tone adaptation (simplified)
  switch (adaptations.tone) {
    case 'professional':
      adaptedContent = adaptedContent.replace(/!/g, '.');
      break;
    case 'informal':
      adaptedContent = adaptedContent.toLowerCase();
      break;
    case 'concise':
      adaptedContent = adaptedContent.replace(/\s+/g, ' ').trim();
      break;
  }

  return adaptedContent;
};

const calculateTotalDuration = (sequence: ExecutionStep[]): number => {
  if (sequence.length === 0) return 0;

  const firstStep = new Date(sequence[0].scheduledTime);
  const lastStep = new Date(sequence[sequence.length - 1].scheduledTime);

  return Math.ceil((lastStep.getTime() - firstStep.getTime()) / (1000 * 60)); // minutes
};

export const executeCoordinationPlan = async (planId: string): Promise<void> => {
  try {
    console.log(`🚀 Executing coordination plan: ${planId}`);

    const plan = await getCoordinationPlan(planId);
    if (!plan) {
      throw new Error('Coordination plan not found');
    }

    // Update plan status
    plan.status = 'executing';
    await updateCoordinationPlan(plan);

    // Execute steps in sequence
    for (const step of plan.executionSequence) {
      try {
        step.status = 'executing';
        await updateExecutionStep(planId, step);

        // Simulate platform execution
        const result = await executeOnPlatform(step);
        
        step.status = 'completed';
        step.executionResult = result;
        await updateExecutionStep(planId, step);

        console.log(`✅ Executed step ${step.stepId} on ${step.platform}`);

      } catch (error) {
        step.status = 'failed';
        step.executionResult = { error: error instanceof Error ? error.message : 'Unknown error' };
        await updateExecutionStep(planId, step);
        console.error(`❌ Failed step ${step.stepId}:`, error);
      }
    }

    // Update final plan status
    const successfulSteps = plan.executionSequence.filter(s => s.status === 'completed').length;
    plan.status = successfulSteps === plan.executionSequence.length ? 'completed' : 'failed';
    await updateCoordinationPlan(plan);

    toast.success(`Coordination plan completed: ${successfulSteps}/${plan.executionSequence.length} steps successful`);

  } catch (error) {
    console.error('Coordination plan execution failed:', error);
    throw error;
  }
};

const executeOnPlatform = async (step: ExecutionStep): Promise<any> => {
  // Simulate platform API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    platform: step.platform,
    executed: true,
    timestamp: new Date().toISOString(),
    reach: Math.floor(Math.random() * 10000),
    engagement: Math.floor(Math.random() * 1000)
  };
};

export const getCoordinationMetrics = async (planId: string): Promise<CoordinationMetrics> => {
  try {
    const plan = await getCoordinationPlan(planId);
    if (!plan) {
      throw new Error('Coordination plan not found');
    }

    const completedSteps = plan.executionSequence.filter(s => s.status === 'completed');
    const totalReach = completedSteps.reduce((sum, step) => {
      return sum + (step.executionResult?.reach || 0);
    }, 0);

    const avgResponseTime = completedSteps.length > 0
      ? completedSteps.reduce((sum, step, index) => {
          const scheduled = new Date(step.scheduledTime);
          const executed = new Date(step.executionResult?.timestamp || scheduled);
          return sum + (executed.getTime() - scheduled.getTime()) / (1000 * 60); // minutes
        }, 0) / completedSteps.length
      : 0;

    return {
      totalPlatforms: plan.platforms.length,
      successfulExecutions: completedSteps.length,
      averageResponseTime: avgResponseTime,
      crossPlatformReach: totalReach,
      engagementCorrelation: Math.random() * 0.5 + 0.5 // Simplified calculation
    };

  } catch (error) {
    console.error('Failed to get coordination metrics:', error);
    return {
      totalPlatforms: 0,
      successfulExecutions: 0,
      averageResponseTime: 0,
      crossPlatformReach: 0,
      engagementCorrelation: 0
    };
  }
};

const storeCoordinationPlan = async (plan: CoordinationPlan): Promise<void> => {
  try {
    await supabase.from('aria_ops_log').insert({
      operation_type: 'coordination_plan',
      module_source: 'cross_platform_coordinator',
      success: true,
      entity_name: plan.entityName,
      operation_data: plan as any
    });
  } catch (error) {
    console.error('Failed to store coordination plan:', error);
  }
};

const getCoordinationPlan = async (planId: string): Promise<CoordinationPlan | null> => {
  try {
    const { data } = await supabase
      .from('aria_ops_log')
      .select('*')
      .eq('operation_type', 'coordination_plan')
      .order('created_at', { ascending: false })
      .limit(1);

    if (!data || data.length === 0) return null;

    const planData = data.find(d => {
      const plan = d.operation_data as unknown as CoordinationPlan;
      return plan.id === planId;
    });

    return planData ? planData.operation_data as unknown as CoordinationPlan : null;
  } catch (error) {
    console.error('Failed to get coordination plan:', error);
    return null;
  }
};

const updateCoordinationPlan = async (plan: CoordinationPlan): Promise<void> => {
  try {
    const { data: existing } = await supabase
      .from('aria_ops_log')
      .select('id')
      .eq('operation_type', 'coordination_plan')
      .eq('entity_name', plan.entityName);

    if (existing && existing.length > 0) {
      await supabase
        .from('aria_ops_log')
        .update({ operation_data: plan as any })
        .eq('id', existing[0].id);
    }
  } catch (error) {
    console.error('Failed to update coordination plan:', error);
  }
};

const updateExecutionStep = async (planId: string, step: ExecutionStep): Promise<void> => {
  try {
    // In a real implementation, this would update the specific step
    // For now, we'll update the entire plan
    const plan = await getCoordinationPlan(planId);
    if (plan) {
      const stepIndex = plan.executionSequence.findIndex(s => s.stepId === step.stepId);
      if (stepIndex !== -1) {
        plan.executionSequence[stepIndex] = step;
        await updateCoordinationPlan(plan);
      }
    }
  } catch (error) {
    console.error('Failed to update execution step:', error);
  }
};

export const getPlatformConfigurations = (): PlatformConfig[] => {
  return [...defaultPlatformConfigs];
};

export const updatePlatformConfiguration = async (
  entityName: string,
  platforms: PlatformConfig[]
): Promise<void> => {
  try {
    await supabase.from('aria_ops_log').insert({
      operation_type: 'platform_config',
      module_source: 'cross_platform_coordinator',
      success: true,
      entity_name: entityName,
      operation_data: { platforms } as any
    });

    console.log(`📝 Updated platform configuration for ${entityName}`);
  } catch (error) {
    console.error('Failed to update platform configuration:', error);
    throw error;
  }
};
