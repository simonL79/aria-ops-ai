import { supabase } from '@/integrations/supabase/client';
import { ResponseStrategy } from './responseGenerator';

export interface CoordinationPlan {
  id: string;
  entityName: string;
  strategies: ResponseStrategy[];
  platforms: string[];
  timeline: string;
  dependencies: CoordinationDependency[];
  status: 'pending' | 'executing' | 'completed' | 'failed';
  createdAt: string;
  executedAt?: string;
}

export interface CoordinationDependency {
  strategyId: string;
  dependsOn: string[];
  executionOrder: number;
}

export interface CoordinationResult {
  planId: string;
  success: boolean;
  executedStrategies: string[];
  failedStrategies: string[];
  message: string;
}

/**
 * Create a cross-platform coordination plan
 */
export const createCoordinationPlan = async (
  entityName: string,
  strategies: ResponseStrategy[]
): Promise<CoordinationPlan> => {
  try {
    console.log(`🌐 Creating coordination plan for ${entityName} with ${strategies.length} strategies`);
    
    const planId = `coord-${Date.now()}`;
    const platforms = [...new Set(strategies.flatMap(s => 
      s.actions.map(a => a.platform).filter(Boolean)
    ))];
    
    // Create dependencies based on strategy priorities
    const dependencies = createDependencies(strategies);
    
    const plan: CoordinationPlan = {
      id: planId,
      entityName,
      strategies,
      platforms,
      timeline: calculateOptimalTimeline(strategies),
      dependencies,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Store the coordination plan in the database
    const { error } = await supabase.from('aria_ops_log').insert({
      operation_type: 'coordination_plan',
      module_source: 'cross_platform_coordinator',
      success: true,
      entity_name: entityName,
      operation_data: plan as any,
      created_at: new Date().toISOString()
    });

    if (error) {
      console.error('Failed to store coordination plan:', error);
      throw error;
    }

    console.log(`✅ Coordination plan created: ${planId}`);
    return plan;
    
  } catch (error) {
    console.error('Failed to create coordination plan:', error);
    throw error;
  }
};

/**
 * Execute a coordination plan
 */
export const executeCoordinationPlan = async (planId: string): Promise<CoordinationResult> => {
  try {
    console.log(`🚀 Executing coordination plan: ${planId}`);
    
    // Retrieve the coordination plan from the database
    const { data: planData, error } = await supabase
      .from('aria_ops_log')
      .select('*')
      .eq('operation_type', 'coordination_plan')
      .like('operation_data', `%${planId}%`)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !planData || planData.length === 0) {
      console.error('Coordination plan not found:', planId);
      throw new Error('Coordination plan not found');
    }

    const plan = planData[0].operation_data as unknown as CoordinationPlan;
    
    if (plan.status !== 'pending') {
      throw new Error(`Plan ${planId} is not in pending status: ${plan.status}`);
    }

    // Update plan status to executing
    plan.status = 'executing';
    plan.executedAt = new Date().toISOString();
    
    await supabase
      .from('aria_ops_log')
      .update({ 
        operation_data: plan as any,
        updated_at: new Date().toISOString()
      })
      .eq('id', planData[0].id);

    const executedStrategies: string[] = [];
    const failedStrategies: string[] = [];

    // Execute strategies in dependency order
    const sortedStrategies = sortByDependencies(plan.strategies, plan.dependencies);
    
    for (const strategy of sortedStrategies) {
      try {
        console.log(`🎯 Executing strategy: ${strategy.id}`);
        
        // Simulate strategy execution (in real implementation, this would execute actual actions)
        const executionResult = await simulateStrategyExecution(strategy);
        
        if (executionResult.success) {
          executedStrategies.push(strategy.id);
          console.log(`✅ Strategy ${strategy.id} executed successfully`);
        } else {
          failedStrategies.push(strategy.id);
          console.log(`❌ Strategy ${strategy.id} failed: ${executionResult.error}`);
        }
        
        // Log individual strategy execution
        await supabase.from('aria_ops_log').insert({
          operation_type: 'strategy_execution',
          module_source: 'cross_platform_coordinator',
          success: executionResult.success,
          entity_name: plan.entityName,
          operation_data: {
            strategyId: strategy.id,
            planId: planId,
            result: executionResult
          } as any
        });
        
      } catch (error) {
        console.error(`Strategy execution failed for ${strategy.id}:`, error);
        failedStrategies.push(strategy.id);
      }
    }

    // Update final plan status
    plan.status = failedStrategies.length === 0 ? 'completed' : 'failed';
    
    await supabase
      .from('aria_ops_log')
      .update({ operation_data: plan as any })
      .eq('id', planData[0].id);

    const result: CoordinationResult = {
      planId,
      success: failedStrategies.length === 0,
      executedStrategies,
      failedStrategies,
      message: `Executed ${executedStrategies.length}/${sortedStrategies.length} strategies successfully`
    };

    console.log(`🏁 Coordination plan ${planId} completed:`, result);
    return result;
    
  } catch (error) {
    console.error('Coordination plan execution failed:', error);
    throw error;
  }
};

/**
 * Create dependencies between strategies
 */
const createDependencies = (strategies: ResponseStrategy[]): CoordinationDependency[] => {
  const dependencies: CoordinationDependency[] = [];
  
  // Sort strategies by priority (critical first)
  const sortedStrategies = [...strategies].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  sortedStrategies.forEach((strategy, index) => {
    const dependsOn = index > 0 ? [sortedStrategies[index - 1].id] : [];
    
    dependencies.push({
      strategyId: strategy.id,
      dependsOn,
      executionOrder: index + 1
    });
  });

  return dependencies;
};

/**
 * Calculate optimal timeline for execution
 */
const calculateOptimalTimeline = (strategies: ResponseStrategy[]): string => {
  const maxTimeframe = Math.max(...strategies.map(s => {
    const timeframe = s.timeframe.toLowerCase();
    if (timeframe.includes('immediate')) return 1;
    if (timeframe.includes('hour')) return 24;
    if (timeframe.includes('day')) return 24 * parseInt(timeframe) || 24;
    return 48;
  }));

  return `${maxTimeframe} hours`;
};

/**
 * Sort strategies by their dependencies
 */
const sortByDependencies = (
  strategies: ResponseStrategy[],
  dependencies: CoordinationDependency[]
): ResponseStrategy[] => {
  const dependencyMap = new Map(dependencies.map(d => [d.strategyId, d]));
  
  return strategies.sort((a, b) => {
    const aOrder = dependencyMap.get(a.id)?.executionOrder || 0;
    const bOrder = dependencyMap.get(b.id)?.executionOrder || 0;
    return aOrder - bOrder;
  });
};

/**
 * Simulate strategy execution (replace with real execution logic)
 */
const simulateStrategyExecution = async (strategy: ResponseStrategy): Promise<{
  success: boolean;
  error?: string;
  executedActions: number;
}> => {
  // Simulate execution delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Simulate 90% success rate for testing
  const success = Math.random() > 0.1;
  
  return {
    success,
    error: success ? undefined : 'Simulated execution failure',
    executedActions: success ? strategy.actions.length : 0
  };
};

/**
 * Get coordination plan status
 */
export const getCoordinationPlanStatus = async (planId: string): Promise<CoordinationPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('aria_ops_log')
      .select('*')
      .eq('operation_type', 'coordination_plan')
      .like('operation_data', `%${planId}%`)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return null;
    }

    return data[0].operation_data as unknown as CoordinationPlan;
  } catch (error) {
    console.error('Failed to get coordination plan status:', error);
    return null;
  }
};

/**
 * Get coordination metrics for analytics
 */
export const getCoordinationMetrics = async (): Promise<{
  totalPlans: number;
  activePlans: number;
  completedPlans: number;
  successRate: number;
}> => {
  try {
    const { data, error } = await supabase
      .from('aria_ops_log')
      .select('operation_data')
      .eq('operation_type', 'coordination_plan');

    if (error) {
      console.error('Failed to get coordination metrics:', error);
      throw error;
    }

    const plans = data?.map(item => item.operation_data as unknown as CoordinationPlan) || [];
    const totalPlans = plans.length;
    const activePlans = plans.filter(p => p.status === 'executing').length;
    const completedPlans = plans.filter(p => p.status === 'completed').length;
    const successRate = totalPlans > 0 ? (completedPlans / totalPlans) * 100 : 0;

    return {
      totalPlans,
      activePlans,
      completedPlans,
      successRate
    };
  } catch (error) {
    console.error('Failed to get coordination metrics:', error);
    return {
      totalPlans: 0,
      activePlans: 0,
      completedPlans: 0,
      successRate: 0
    };
  }
};
