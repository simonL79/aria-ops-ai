
import { supabase } from '@/integrations/supabase/client';

export interface StrategyAnalytics {
  totalStrategies: number;
  successRate: number;
  avgExecutionTime: number;
  topPerformingTypes: Array<{
    type: string;
    successRate: number;
    count: number;
  }>;
  recentTrends: Array<{
    date: string;
    strategiesCreated: number;
    strategiesCompleted: number;
  }>;
}

export const getStrategyAnalytics = async (entityName: string): Promise<StrategyAnalytics> => {
  try {
    // Get all strategies for entity
    const { data: strategies, error } = await supabase
      .from('strategy_responses')
      .select('*')
      .eq('entity_name', entityName)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const totalStrategies = strategies?.length || 0;
    const completedStrategies = strategies?.filter(s => s.status === 'completed') || [];
    const successRate = totalStrategies > 0 ? (completedStrategies.length / totalStrategies) * 100 : 0;

    // Calculate average execution time
    const executionTimes = completedStrategies
      .filter(s => s.executed_at && s.execution_result?.completed_at)
      .map(s => {
        const start = new Date(s.executed_at!);
        const end = new Date(s.execution_result.completed_at);
        return (end.getTime() - start.getTime()) / (1000 * 60); // minutes
      });

    const avgExecutionTime = executionTimes.length > 0 
      ? executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length 
      : 0;

    // Analyze performance by strategy type
    const typePerformance = new Map<string, { total: number; completed: number }>();
    
    strategies?.forEach(strategy => {
      const type = strategy.strategy_type;
      const current = typePerformance.get(type) || { total: 0, completed: 0 };
      current.total++;
      if (strategy.status === 'completed') current.completed++;
      typePerformance.set(type, current);
    });

    const topPerformingTypes = Array.from(typePerformance.entries())
      .map(([type, data]) => ({
        type,
        successRate: data.total > 0 ? (data.completed / data.total) * 100 : 0,
        count: data.total
      }))
      .sort((a, b) => b.successRate - a.successRate);

    // Generate recent trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentStrategies = strategies?.filter(s => 
      new Date(s.created_at) >= sevenDaysAgo
    ) || [];

    const trendMap = new Map<string, { created: number; completed: number }>();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trendMap.set(dateStr, { created: 0, completed: 0 });
    }

    recentStrategies.forEach(strategy => {
      const createdDate = strategy.created_at.split('T')[0];
      const trend = trendMap.get(createdDate);
      if (trend) {
        trend.created++;
        if (strategy.status === 'completed') trend.completed++;
      }
    });

    const recentTrends = Array.from(trendMap.entries()).map(([date, data]) => ({
      date,
      strategiesCreated: data.created,
      strategiesCompleted: data.completed
    }));

    return {
      totalStrategies,
      successRate,
      avgExecutionTime,
      topPerformingTypes,
      recentTrends
    };

  } catch (error) {
    console.error('Failed to get strategy analytics:', error);
    throw error;
  }
};

export const getGlobalStrategyStats = async (): Promise<{
  totalEntitiesMonitored: number;
  totalStrategiesExecuted: number;
  globalSuccessRate: number;
  mostActiveEntity: string;
}> => {
  try {
    const { data: strategies, error } = await supabase
      .from('strategy_responses')
      .select('entity_name, status')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) throw error;

    const entities = new Set(strategies?.map(s => s.entity_name) || []);
    const totalEntitiesMonitored = entities.size;
    const totalStrategiesExecuted = strategies?.length || 0;
    const completedStrategies = strategies?.filter(s => s.status === 'completed').length || 0;
    const globalSuccessRate = totalStrategiesExecuted > 0 
      ? (completedStrategies / totalStrategiesExecuted) * 100 
      : 0;

    // Find most active entity
    const entityCounts = new Map<string, number>();
    strategies?.forEach(s => {
      entityCounts.set(s.entity_name, (entityCounts.get(s.entity_name) || 0) + 1);
    });

    const mostActiveEntity = Array.from(entityCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    return {
      totalEntitiesMonitored,
      totalStrategiesExecuted,
      globalSuccessRate,
      mostActiveEntity
    };

  } catch (error) {
    console.error('Failed to get global strategy stats:', error);
    return {
      totalEntitiesMonitored: 0,
      totalStrategiesExecuted: 0,
      globalSuccessRate: 0,
      mostActiveEntity: 'Unknown'
    };
  }
};
