
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { commandId, commandText } = await req.json();

    if (!commandId || !commandText) {
      return new Response(
        JSON.stringify({ error: 'Command ID and text are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Classify command intent using OpenAI
    let intent = 'general';
    let confidence = 0.5;
    let summary = 'Command processed with basic classification';
    
    if (OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are A.R.I.A™'s command classification AI. Analyze operator commands and return JSON with:
                - intent: scan_threats, system_status, anubis_check, threat_response, intelligence_gather, data_query, or general
                - confidence: 0-1 confidence score
                - summary: brief description of what the command requests
                - execution_plan: specific steps to execute the command
                - priority: low, medium, high, or critical
                
                Be precise and actionable in your classification.`
              },
              {
                role: 'user',
                content: `Classify this A.R.I.A™ operator command: "${commandText}"`
              }
            ],
            temperature: 0.3,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const classification = JSON.parse(data.choices[0].message.content);
          intent = classification.intent || 'general';
          confidence = classification.confidence || 0.5;
          summary = classification.summary || summary;
        }
      } catch (error) {
        console.error('OpenAI classification error:', error);
      }
    }

    // Update command with AI classification
    const { error: updateError } = await supabase
      .from('operator_command_log')
      .update({
        intent,
        command_summary: summary,
        priority: confidence > 0.8 ? 'high' : confidence > 0.6 ? 'medium' : 'low'
      })
      .eq('id', commandId);

    if (updateError) {
      throw updateError;
    }

    // Create feedback entry
    const { error: feedbackError } = await supabase
      .from('command_response_feedback')
      .insert({
        command_id: commandId,
        execution_status: 'success',
        summary: `AI classified command as '${intent}' with ${Math.round(confidence * 100)}% confidence`,
        created_by: 'AI_Classifier'
      });

    if (feedbackError) {
      console.error('Feedback insertion error:', feedbackError);
    }

    // Generate remediation suggestions for complex commands
    if (confidence < 0.6 || intent === 'general') {
      await supabase
        .from('command_remediation_suggestions')
        .insert({
          command_id: commandId,
          suggestion: 'Consider using more specific command syntax. Try commands like "anubis status", "scan threats", or "system health".',
          rationale: 'Low confidence classification suggests the command may be ambiguous',
          proposed_by: 'AI_Assistant'
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        intent,
        confidence,
        summary,
        commandId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error classifying command:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
