// Using built-in Deno.serve
import { createClient } from 'npm:@supabase/supabase-js@2';
import { requireUser, isUser } from '../_shared/userAuth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const auth = await requireUser(req);
    if (!isUser(auth)) return auth;

    const { submission_id } = await req.json();
    if (!submission_id) {
      return new Response(JSON.stringify({ error: 'submission_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: sub } = await admin
      .from('portal_removal_submissions')
      .select('*')
      .eq('id', submission_id)
      .single();
    if (!sub || sub.user_id !== auth.user.id) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: items } = await admin
      .from('portal_removal_items')
      .select('id, url, excerpt, category, severity')
      .eq('submission_id', submission_id)
      .eq('user_confirmed', true)
      .eq('user_dismissed', false);

    const confirmed = (items ?? []).filter((i: any) => i.url);
    if (confirmed.length === 0) {
      return new Response(JSON.stringify({ error: 'No confirmed items with URLs' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a Requiem job directly (service-role, bypassing admin-only edge function).
    const urls = confirmed.map((c: any) => c.url);
    const { data: job, error: jobErr } = await admin
      .from('requiem_jobs')
      .insert({
        job_type: 'portal_removal',
        status: 'queued',
        urls,
        variant_count: 20,
        client_id: sub.client_id,
        entity_config: {
          source: 'client_portal',
          submission_id,
          requested_by: auth.user.id,
          item_count: confirmed.length,
        },
      })
      .select('id')
      .single();

    if (jobErr) {
      console.error('requiem_jobs insert failed', jobErr);
      return new Response(JSON.stringify({ error: 'Dispatch failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await admin
      .from('portal_removal_items')
      .update({ removal_status: 'queued' })
      .in('id', confirmed.map((c: any) => c.id));

    await admin
      .from('portal_removal_submissions')
      .update({
        status: 'dispatched',
        confirmed_at: new Date().toISOString(),
        dispatched_at: new Date().toISOString(),
        requiem_run_id: job.id,
      })
      .eq('id', submission_id);

    return new Response(
      JSON.stringify({ ok: true, requiem_run_id: job.id, dispatched: confirmed.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('portal-removal-dispatch error', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
