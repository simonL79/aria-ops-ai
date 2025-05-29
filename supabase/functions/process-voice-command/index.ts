
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { command, userId } = await req.json();

    if (!command) {
      return new Response(
        JSON.stringify({ error: 'Command is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Use OpenAI to process the command intent
    let intent = 'general';
    let context = 'operator_console';
    let priority = 'medium';

    if (OPENAI_API_KEY) {
      try {
        const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
                content: `You are A.R.I.A™'s command processor. Analyze operator voice commands and return JSON with:
                - intent: scan_threats, system_status, anubis_check, threat_response, intelligence_gather, or general
                - context: specific system or module being targeted
                - priority: low, medium, high, or critical
                - action: specific action to take
                - confidence: 0-1 confidence score`
              },
              {
                role: 'user',
                content: `Process this operator command: "${command}"`
              }
            ],
            temperature: 0.3,
          }),
        });

        if (gptResponse.ok) {
          const gptData = await gptResponse.json();
          const analysis = JSON.parse(gptData.choices[0].message.content);
          intent = analysis.intent || 'general';
          context = analysis.context || 'operator_console';
          priority = analysis.priority || 'medium';
        }
      } catch (error) {
        console.error('OpenAI processing error:', error);
      }
    }

    // Log the command to activity_logs for now (until operator tables are created)
    const { data: commandLog, error: logError } = await supabase
      .from('activity_logs')
      .insert({
        action: command,
        entity_type: 'voice_command',
        entity_id: userId,
        details: JSON.stringify({ intent, context, priority, source: 'voice' }),
        user_id: userId
      })
      .select()
      .single();

    if (logError) {
      console.error('Error logging command:', logError);
    }

    // Generate contextual response
    let response = '';
    const cmd = command.toLowerCase();

    if (cmd.includes('status') || cmd.includes('health')) {
      response = `System status check initiated. Priority: ${priority}. Intent: ${intent}.`;
    } else if (cmd.includes('scan') || cmd.includes('threat')) {
      response = `Threat scanning protocol activated. Target: ${context}. Priority: ${priority}.`;
    } else if (cmd.includes('anubis')) {
      response = `ANUBIS system query processed. Module: ${context}. Status: Active.`;
    } else {
      response = `Command acknowledged. Intent: ${intent}. Processing with ${priority} priority.`;
    }

    // Log response as notification
    await supabase
      .from('aria_notifications')
      .insert({
        entity_name: 'Voice Command Processor',
        event_type: 'voice_response',
        summary: response,
        priority: priority
      });

    return new Response(
      JSON.stringify({
        success: true,
        command,
        intent,
        context,
        priority,
        response,
        commandId: commandLog?.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing voice command:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
