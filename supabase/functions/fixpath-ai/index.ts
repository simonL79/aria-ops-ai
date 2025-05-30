
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('[FIXPATH-AI] === A.R.I.A™ AI FIX PATH GENERATOR ===');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entity, threatLevel, riskScore, threatContext, generateActions = true } = await req.json();
    console.log('[FIXPATH-AI] Generating AI fix path for:', entity, 'threat level:', threatLevel);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Log fix path generation start
    await supabase.from('mission_chain_log').insert({
      entity,
      step_number: 1,
      action: 'AI_FIXPATH_GENERATION_INITIATED',
      module: 'fixpath-ai',
      status: 'executed',
      log_details: `AI fix path generation started for threat level: ${threatLevel}`
    });

    // Generate AI-powered fix path steps
    const generateAIFixPath = async (entity: string, threatLevel: string, riskScore: number, context: string): Promise<any[]> => {
      const baseSteps = [];
      
      // Immediate response steps based on threat level
      if (threatLevel === 'critical') {
        baseSteps.push(
          {
            step: 1,
            action: "IMMEDIATE CONTAINMENT",
            description: "Deploy CEREBRA™ AI memory override to neutralize negative associations",
            module: "cerebra",
            priority: "critical",
            estimated_time: "15 minutes",
            success_probability: 0.85
          },
          {
            step: 2,
            action: "COUNTER-NARRATIVE DEPLOYMENT",
            description: "Activate RSI™ reputation shielding with AI-generated positive content",
            module: "rsi",
            priority: "critical", 
            estimated_time: "30 minutes",
            success_probability: 0.80
          },
          {
            step: 3,
            action: "LEGAL RESPONSE ACTIVATION",
            description: "Initiate legal documentation and platform reporting protocols",
            module: "legal",
            priority: "high",
            estimated_time: "2 hours",
            success_probability: 0.75
          },
          {
            step: 4,
            action: "EIDETIC FOOTPRINT MANAGEMENT",
            description: "Deploy EIDETIC™ decay acceleration for negative search results",
            module: "eidetic",
            priority: "high",
            estimated_time: "24 hours",
            success_probability: 0.70
          }
        );
      } else if (threatLevel === 'high') {
        baseSteps.push(
          {
            step: 1,
            action: "RSI SENTIMENT INTERVENTION",
            description: "Deploy targeted RSI™ response to improve sentiment trajectory",
            module: "rsi",
            priority: "high",
            estimated_time: "1 hour",
            success_probability: 0.75
          },
          {
            step: 2,
            action: "MONITORING ENHANCEMENT",
            description: "Increase SIGMA live monitoring frequency and alert sensitivity",
            module: "sigma",
            priority: "medium",
            estimated_time: "30 minutes",
            success_probability: 0.90
          },
          {
            step: 3,
            action: "PREPARATORY DOCUMENTATION",
            description: "Prepare legal response templates and platform contact protocols",
            module: "legal",
            priority: "medium",
            estimated_time: "2 hours",
            success_probability: 0.85
          }
        );
      } else if (threatLevel === 'moderate') {
        baseSteps.push(
          {
            step: 1,
            action: "PROACTIVE MONITORING",
            description: "Continue enhanced SIGMA monitoring with trend analysis",
            module: "sigma",
            priority: "medium",
            estimated_time: "Ongoing",
            success_probability: 0.95
          },
          {
            step: 2,
            action: "RSI TEMPLATE PREPARATION",
            description: "Prepare RSI™ response templates for rapid deployment",
            module: "rsi",
            priority: "low",
            estimated_time: "1 hour",
            success_probability: 0.90
          },
          {
            step: 3,
            action: "SENTIMENT TRACKING",
            description: "Monitor sentiment trends and establish baseline metrics",
            module: "analytics",
            priority: "low",
            estimated_time: "Ongoing",
            success_probability: 0.95
          }
        );
      } else {
        baseSteps.push(
          {
            step: 1,
            action: "STANDARD MONITORING",
            description: "Maintain standard SIGMA monitoring protocols",
            module: "sigma",
            priority: "low",
            estimated_time: "Ongoing",
            success_probability: 0.98
          },
          {
            step: 2,
            action: "ANUBIS HEALTH CHECKS",
            description: "Continue periodic ANUBIS™ system health validation",
            module: "anubis",
            priority: "low",
            estimated_time: "Daily",
            success_probability: 0.95
          }
        );
      }

      // Add AI-enhanced contextual steps if OpenAI is available
      if (openaiKey && context) {
        try {
          const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4',
              messages: [
                {
                  role: 'system',
                  content: 'You are A.R.I.A™ AI, an expert in digital threat mitigation. Generate specific actionable steps based on threat context.'
                },
                {
                  role: 'user',
                  content: `Generate 2-3 specific mitigation steps for entity "${entity}" with threat level "${threatLevel}" and context: "${context}". Focus on practical, implementable actions.`
                }
              ],
              max_tokens: 500,
              temperature: 0.3
            })
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            const aiSuggestions = aiData.choices[0]?.message?.content || '';
            
            // Parse AI suggestions and add as additional steps
            const aiSteps = parseAISuggestions(aiSuggestions, baseSteps.length);
            baseSteps.push(...aiSteps);
          }
        } catch (error) {
          console.error('[FIXPATH-AI] OpenAI API error:', error);
        }
      }

      return baseSteps;
    };

    // Generate the fix path
    const fixPathSteps = await generateAIFixPath(entity, threatLevel, riskScore || 0, threatContext || '');

    // Store fix path in database
    const { data: fixPathData, error: fixPathError } = await supabase
      .from('fix_paths')
      .insert({
        entity_name: entity,
        threat_level: threatLevel,
        steps: fixPathSteps
      })
      .select()
      .single();

    if (fixPathError) {
      console.error('[FIXPATH-AI] Error storing fix path:', fixPathError);
    }

    // Generate action triggers if requested
    const actionTriggers = [];
    if (generateActions) {
      console.log('[FIXPATH-AI] Generating action triggers...');
      
      for (const step of fixPathSteps.slice(0, 3)) { // Trigger first 3 actions
        const { data: triggerData, error: triggerError } = await supabase
          .from('action_triggers')
          .insert({
            entity_name: entity,
            module_name: step.module,
            action_type: step.action,
            input_context: {
              step_number: step.step,
              description: step.description,
              priority: step.priority,
              threat_level: threatLevel,
              estimated_time: step.estimated_time,
              success_probability: step.success_probability
            },
            status: 'queued',
            triggered_by: 'fixpath-ai'
          })
          .select()
          .single();

        if (!triggerError && triggerData) {
          actionTriggers.push(triggerData);
        }
      }
    }

    // Log completion
    await supabase.from('mission_chain_log').insert({
      entity,
      step_number: 2,
      action: 'AI_FIXPATH_GENERATION_COMPLETE',
      module: 'fixpath-ai',
      status: 'executed',
      log_details: `Generated ${fixPathSteps.length} AI-optimized fix path steps, ${actionTriggers.length} action triggers created`
    });

    console.log('[FIXPATH-AI] AI fix path generation completed successfully');

    return new Response(JSON.stringify({
      success: true,
      status: 'fixpath_generated',
      fix_path_id: fixPathData?.id,
      steps: fixPathSteps,
      action_triggers: actionTriggers,
      summary: `AI-generated ${fixPathSteps.length}-step mitigation plan for ${threatLevel} threat level`,
      estimated_resolution_time: calculateEstimatedTime(fixPathSteps),
      overall_success_probability: calculateOverallProbability(fixPathSteps)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('[FIXPATH-AI] Error:', error);
    return new Response(JSON.stringify({
      error: 'AI fix path generation failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function parseAISuggestions(aiText: string, startStep: number): any[] {
  const steps = [];
  const lines = aiText.split('\n').filter(line => line.trim());
  
  let stepNumber = startStep + 1;
  for (const line of lines.slice(0, 3)) { // Max 3 AI steps
    if (line.includes(':')) {
      const [action, description] = line.split(':', 2);
      steps.push({
        step: stepNumber++,
        action: action.trim().replace(/^\d+\.?\s*/, '').toUpperCase(),
        description: description.trim(),
        module: "ai_enhanced",
        priority: "medium",
        estimated_time: "2-4 hours",
        success_probability: 0.70
      });
    }
  }
  
  return steps;
}

function calculateEstimatedTime(steps: any[]): string {
  const timeEstimates = steps.map(step => {
    const time = step.estimated_time?.toLowerCase() || '';
    if (time.includes('minute')) return parseInt(time) || 30;
    if (time.includes('hour')) return (parseInt(time) || 1) * 60;
    if (time.includes('day')) return (parseInt(time) || 1) * 1440;
    return 60; // Default 1 hour
  });
  
  const totalMinutes = Math.max(...timeEstimates);
  if (totalMinutes < 60) return `${totalMinutes} minutes`;
  if (totalMinutes < 1440) return `${Math.round(totalMinutes / 60)} hours`;
  return `${Math.round(totalMinutes / 1440)} days`;
}

function calculateOverallProbability(steps: any[]): number {
  const probabilities = steps.map(step => step.success_probability || 0.7);
  return Math.round(probabilities.reduce((acc, prob) => acc * prob, 1) * 100) / 100;
}
