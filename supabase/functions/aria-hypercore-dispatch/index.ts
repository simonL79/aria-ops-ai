
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DispatchPayload {
  event_type: string;
  threat_id: string;
  entity_id: string;
  severity: string;
  payload_json: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get pending events from dispatch queue
    const { data: events, error } = await supabaseClient
      .from('event_dispatch')
      .select('*')
      .eq('dispatched', false)
      .order('created_at', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching events:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (!events || events.length === 0) {
      return new Response(JSON.stringify({ message: 'No pending events' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const processed = [];

    for (const event of events) {
      try {
        console.log(`Processing event: ${event.event_type} - Severity: ${event.severity}`);

        // Send Slack alert if webhook is configured
        const slackWebhook = Deno.env.get('SLACK_WEBHOOK_URL');
        if (slackWebhook) {
          const slackMessage = {
            text: `🚨 *A.R.I.A™ HyperCore Alert*`,
            attachments: [{
              color: event.severity === 'critical' ? 'danger' : event.severity === 'high' ? 'warning' : 'good',
              fields: [
                { title: 'Event Type', value: event.event_type, short: true },
                { title: 'Severity', value: event.severity.toUpperCase(), short: true },
                { title: 'Threat ID', value: event.threat_id || 'N/A', short: true },
                { title: 'Entity ID', value: event.entity_id || 'N/A', short: true }
              ]
            }]
          };

          if (event.payload_json) {
            const payload = typeof event.payload_json === 'string' 
              ? JSON.parse(event.payload_json) 
              : event.payload_json;
            
            if (payload.counter_message) {
              slackMessage.attachments[0].fields.push({
                title: 'Counter Message',
                value: payload.counter_message,
                short: false
              });
            }
            
            if (payload.actor_alias) {
              slackMessage.attachments[0].fields.push({
                title: 'Actor',
                value: payload.actor_alias,
                short: true
              });
            }
          }

          await fetch(slackWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(slackMessage)
          });
        }

        // Mark as dispatched
        await supabaseClient
          .from('event_dispatch')
          .update({ 
            dispatched: true, 
            dispatched_at: new Date().toISOString() 
          })
          .eq('id', event.id);

        processed.push(event.id);

      } catch (eventError) {
        console.error(`Error processing event ${event.id}:`, eventError);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed_events: processed.length,
      event_ids: processed 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error('Error in aria-hypercore-dispatch:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
