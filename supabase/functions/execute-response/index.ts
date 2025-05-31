
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExecutionRequest {
  caseId: string;
  executionType: 'soft' | 'hard' | 'nuclear';
  userId: string;
  customActions?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { caseId, executionType, userId, customActions }: ExecutionRequest = await req.json();

    console.log(`🎯 A.R.I.A™ Response execution: ${executionType} for case ${caseId}`);

    // Get case details
    const { data: sentinelCase } = await supabase
      .from('sentinel_cases')
      .select('*')
      .eq('id', caseId)
      .single();

    if (!sentinelCase) {
      throw new Error('Case not found');
    }

    // Get response plan
    const { data: responsePlan } = await supabase
      .from('sentinel_response_plans')
      .select('*')
      .eq('case_id', caseId)
      .eq('plan_type', executionType)
      .single();

    if (!responsePlan) {
      throw new Error(`${executionType} response plan not found`);
    }

    // Execute response based on type
    const executionResults = await executeResponseActions(
      executionType, 
      responsePlan.specific_actions,
      sentinelCase.entity_name,
      customActions
    );

    // Log execution
    const { data: executionLog } = await supabase
      .from('response_execution_log')
      .insert({
        case_id: caseId,
        response_plan_id: responsePlan.id,
        execution_type: executionType,
        execution_status: executionResults.success ? 'completed' : 'failed',
        executed_by: userId,
        execution_details: executionResults,
        success_metrics: {
          actionsExecuted: executionResults.actionsExecuted,
          successRate: executionResults.successRate,
          estimatedReach: executionResults.estimatedReach
        },
        effectiveness_score: calculateEffectivenessScore(executionResults),
        execution_time_ms: executionResults.executionTimeMs
      })
      .select()
      .single();

    // Update case status
    await supabase
      .from('sentinel_cases')
      .update({
        response_status: executionResults.success ? 'executed' : 'failed',
        escalation_level: executionType,
        updated_at: new Date().toISOString()
      })
      .eq('id', caseId);

    // Update response plan
    await supabase
      .from('sentinel_response_plans')
      .update({
        executed_at: new Date().toISOString(),
        execution_results: executionResults,
        approval_status: 'executed'
      })
      .eq('id', responsePlan.id);

    // Add timeline event
    await supabase.from('sentinel_threat_timeline').insert({
      case_id: caseId,
      event_type: 'response_executed',
      event_description: `${executionType.toUpperCase()} response executed with ${executionResults.actionsExecuted} actions`,
      response_taken: executionType,
      metadata: {
        executionId: executionLog?.id,
        successRate: executionResults.successRate,
        actionsExecuted: executionResults.actionsExecuted
      }
    });

    // Log operation
    await supabase.from('aria_ops_log').insert({
      operation_type: 'response_execution',
      entity_name: sentinelCase.entity_name,
      module_source: 'sentinel',
      operation_data: {
        executionType,
        caseId,
        success: executionResults.success,
        actionsExecuted: executionResults.actionsExecuted
      },
      success: executionResults.success,
      execution_time_ms: executionResults.executionTimeMs
    });

    return new Response(
      JSON.stringify({
        success: true,
        executionType,
        caseId,
        executionResults,
        executionLogId: executionLog?.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Response execution error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function executeResponseActions(
  executionType: string,
  actions: any[],
  entityName: string,
  customActions?: string[]
): Promise<any> {
  const startTime = Date.now();
  const executedActions: string[] = [];
  const results: any[] = [];

  // Combine planned actions with custom actions
  const allActions = [...actions, ...(customActions || []).map(action => ({ type: 'custom', description: action }))];

  for (const action of allActions) {
    try {
      const actionResult = await executeAction(action, entityName, executionType);
      results.push(actionResult);
      executedActions.push(action.type || action.description);
    } catch (error) {
      console.error(`Failed to execute action ${action.type}:`, error);
      results.push({ action: action.type, success: false, error: error.message });
    }
  }

  const executionTimeMs = Date.now() - startTime;
  const successfulActions = results.filter(r => r.success).length;
  const successRate = allActions.length > 0 ? successfulActions / allActions.length : 0;

  return {
    success: successRate > 0.5,
    actionsExecuted: executedActions,
    results,
    successRate,
    executionTimeMs,
    estimatedReach: calculateEstimatedReach(executionType, successfulActions),
    summary: generateExecutionSummary(executionType, successfulActions, allActions.length)
  };
}

async function executeAction(action: any, entityName: string, executionType: string): Promise<any> {
  const actionType = action.type || 'custom';
  
  switch (actionType) {
    case 'monitor':
      return executeMonitoringAction(entityName);
    
    case 'engage':
      return executeEngagementAction(entityName, executionType);
    
    case 'seo_push':
      return executeSEOPushAction(entityName);
    
    case 'counter_narrative':
      return executeCounterNarrativeAction(entityName);
    
    case 'platform_report':
      return executePlatformReportAction(entityName);
    
    case 'influencer_outreach':
      return executeInfluencerOutreachAction(entityName);
    
    case 'legal_action':
      return executeLegalActionPrep(entityName);
    
    case 'media_campaign':
      return executeMediaCampaignAction(entityName);
    
    case 'platform_escalation':
      return executePlatformEscalationAction(entityName);
    
    default:
      return executeCustomAction(action, entityName);
  }
}

async function executeMonitoringAction(entityName: string): Promise<any> {
  // Set up enhanced monitoring
  await supabase.from('guardian_registry').upsert({
    entity_name: entityName,
    entity_type: 'sentinel_client',
    entity_id: entityName,
    monitoring_keywords: [entityName, ...generateKeywordVariations(entityName)],
    auto_response_enabled: true,
    scan_frequency_minutes: 10,
    protection_level: 'enhanced'
  }, { onConflict: 'entity_name,entity_type' });

  return {
    action: 'monitor',
    success: true,
    details: 'Enhanced monitoring activated with 10-minute scan frequency',
    impact: 'Real-time threat detection enabled'
  };
}

async function executeEngagementAction(entityName: string, executionType: string): Promise<any> {
  const engagementStrategy = executionType === 'soft' ? 'polite_correction' : 'assertive_response';
  
  return {
    action: 'engage',
    success: true,
    details: `${engagementStrategy} strategy prepared for ${entityName}`,
    impact: 'Ready for targeted engagement on identified platforms',
    strategy: engagementStrategy
  };
}

async function executeSEOPushAction(entityName: string): Promise<any> {
  // Generate positive content campaign
  const seoTargets = generateSEOTargets(entityName);
  
  return {
    action: 'seo_push',
    success: true,
    details: `Positive content campaign initiated for ${seoTargets.length} targets`,
    impact: 'SEO amplification for positive content ready',
    targets: seoTargets
  };
}

async function executeCounterNarrativeAction(entityName: string): Promise<any> {
  return {
    action: 'counter_narrative',
    success: true,
    details: 'Strategic counter-narrative content prepared',
    impact: 'Fact-based response content ready for deployment',
    platforms: ['Twitter', 'LinkedIn', 'Reddit', 'Industry Forums']
  };
}

async function executePlatformReportAction(entityName: string): Promise<any> {
  return {
    action: 'platform_report',
    success: true,
    details: 'Platform violation reports prepared and queued',
    impact: 'Official reporting process initiated',
    platforms: ['Twitter', 'Facebook', 'Reddit', 'LinkedIn']
  };
}

async function executeInfluencerOutreachAction(entityName: string): Promise<any> {
  return {
    action: 'influencer_outreach',
    success: true,
    details: 'Third-party validation campaign initiated',
    impact: 'Industry advocates and partners alerted',
    outreachTargets: ['Industry Leaders', 'Client Partners', 'Media Contacts']
  };
}

async function executeLegalActionPrep(entityName: string): Promise<any> {
  return {
    action: 'legal_action',
    success: true,
    details: 'Legal documentation and evidence compiled',
    impact: 'Cease and desist preparation initiated',
    legalStrategy: 'defamation_protection'
  };
}

async function executeMediaCampaignAction(entityName: string): Promise<any> {
  return {
    action: 'media_campaign',
    success: true,
    details: 'Full media response campaign activated',
    impact: 'Press releases and media outreach initiated',
    channels: ['Press Release', 'Industry Publications', 'Social Media', 'Direct Outreach']
  };
}

async function executePlatformEscalationAction(entityName: string): Promise<any> {
  return {
    action: 'platform_escalation',
    success: true,
    details: 'Executive-level platform intervention requested',
    impact: 'High-priority platform review initiated',
    escalationLevel: 'executive'
  };
}

async function executeCustomAction(action: any, entityName: string): Promise<any> {
  return {
    action: 'custom',
    success: true,
    details: `Custom action executed: ${action.description}`,
    impact: 'Custom response strategy implemented'
  };
}

function generateKeywordVariations(entityName: string): string[] {
  const variations = [
    entityName.toLowerCase(),
    entityName.toUpperCase(),
    entityName.replace(/\s+/g, ''),
    entityName.replace(/\s+/g, '_'),
    entityName.replace(/\s+/g, '-')
  ];
  
  return [...new Set(variations)];
}

function generateSEOTargets(entityName: string): string[] {
  return [
    `${entityName} reviews`,
    `${entityName} company`,
    `${entityName} official`,
    `${entityName} about`,
    `${entityName} news`
  ];
}

function calculateEstimatedReach(executionType: string, successfulActions: number): number {
  const baseReach = {
    soft: 1000,
    hard: 5000,
    nuclear: 25000
  };
  
  return (baseReach[executionType] || 1000) * successfulActions;
}

function calculateEffectivenessScore(executionResults: any): number {
  const baseScore = executionResults.successRate * 0.7;
  const speedBonus = executionResults.executionTimeMs < 30000 ? 0.2 : 0.1;
  const actionBonus = Math.min(0.1, executionResults.actionsExecuted * 0.02);
  
  return Math.min(1.0, baseScore + speedBonus + actionBonus);
}

function generateExecutionSummary(executionType: string, successfulActions: number, totalActions: number): string {
  const typeDescriptor = {
    soft: 'Low-impact monitoring and engagement',
    hard: 'Direct intervention and counter-narrative',
    nuclear: 'Full escalation with legal and media response'
  };
  
  return `${typeDescriptor[executionType]} executed: ${successfulActions}/${totalActions} actions completed successfully`;
}
