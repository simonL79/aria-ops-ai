
import { supabase } from '@/integrations/supabase/client';
import { ResponseStrategy } from './responseGenerator';
import { toast } from 'sonner';

export interface StrategyExecutionResult {
  success: boolean;
  message: string;
  executedActions: number;
  failedActions: number;
  details: any;
}

export const executeStrategy = async (
  strategyId: string
): Promise<StrategyExecutionResult> => {
  try {
    console.log(`🚀 Strategy Brain: Executing strategy ${strategyId}`);

    // Get strategy from database
    const { data: strategy, error } = await supabase
      .from('strategy_responses')
      .select('*')
      .eq('strategy_id', strategyId)
      .single();

    if (error || !strategy) {
      throw new Error('Strategy not found');
    }

    // Update status to executing
    await supabase
      .from('strategy_responses')
      .update({ 
        status: 'executing',
        executed_at: new Date().toISOString()
      })
      .eq('strategy_id', strategyId);

    // Simulate execution of actions
    const actions = strategy.actions as any[] || [];
    let executedActions = 0;
    let failedActions = 0;
    const executionDetails: any[] = [];

    for (const action of actions) {
      try {
        // Simulate action execution
        const result = await simulateActionExecution(action, strategy);
        executionDetails.push({
          action: action.action,
          status: 'completed',
          result: result,
          timestamp: new Date().toISOString()
        });
        executedActions++;
      } catch (error) {
        executionDetails.push({
          action: action.action,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
        failedActions++;
      }
    }

    // Update strategy with execution results
    const finalStatus = failedActions === 0 ? 'completed' : 'partial';
    await supabase
      .from('strategy_responses')
      .update({ 
        status: finalStatus,
        execution_result: {
          executed_actions: executedActions,
          failed_actions: failedActions,
          details: executionDetails,
          completed_at: new Date().toISOString()
        }
      })
      .eq('strategy_id', strategyId);

    return {
      success: failedActions === 0,
      message: `Strategy executed: ${executedActions} actions completed, ${failedActions} failed`,
      executedActions,
      failedActions,
      details: executionDetails
    };

  } catch (error) {
    console.error('Strategy execution failed:', error);
    
    // Update strategy status to failed
    await supabase
      .from('strategy_responses')
      .update({ 
        status: 'cancelled',
        execution_result: {
          error: error instanceof Error ? error.message : 'Unknown error',
          failed_at: new Date().toISOString()
        }
      })
      .eq('strategy_id', strategyId);

    throw error;
  }
};

const simulateActionExecution = async (action: any, strategy: any): Promise<any> => {
  // Simulate different types of actions
  const delay = Math.random() * 2000 + 500; // 0.5-2.5 seconds
  await new Promise(resolve => setTimeout(resolve, delay));

  switch (action.action?.toLowerCase()) {
    case 'deploy positive content across affected platforms':
      return {
        platforms_deployed: action.platform?.split(', ') || ['social'],
        content_pieces: Math.floor(Math.random() * 5) + 3,
        estimated_reach: Math.floor(Math.random() * 10000) + 5000
      };

    case 'file platform violation reports':
      return {
        reports_filed: Math.floor(Math.random() * 3) + 1,
        platforms: action.platform?.split(', ') || ['platform'],
        reference_numbers: [`REP-${Date.now()}`]
      };

    case 'activate influencer network for positive amplification':
      return {
        influencers_contacted: Math.floor(Math.random() * 10) + 5,
        expected_reach: Math.floor(Math.random() * 50000) + 20000,
        response_rate: '75%'
      };

    case 'monitor sentiment metrics hourly':
      return {
        monitoring_activated: true,
        frequency: 'hourly',
        dashboard_link: '/analytics/sentiment'
      };

    default:
      return {
        action_type: 'generic',
        status: 'completed',
        message: 'Action executed successfully'
      };
  }
};

export const getStrategyStatus = async (strategyId: string) => {
  const { data, error } = await supabase
    .from('strategy_responses')
    .select('status, execution_result, executed_at')
    .eq('strategy_id', strategyId)
    .single();

  if (error) throw error;
  return data;
};

export const cancelStrategy = async (strategyId: string) => {
  const { error } = await supabase
    .from('strategy_responses')
    .update({ 
      status: 'cancelled',
      execution_result: {
        cancelled_at: new Date().toISOString(),
        reason: 'User cancelled'
      }
    })
    .eq('strategy_id', strategyId);

  if (error) throw error;
};
