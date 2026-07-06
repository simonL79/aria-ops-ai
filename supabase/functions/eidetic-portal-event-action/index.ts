import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const ACTIONS = new Set(['acknowledge', 'snooze', 'resolve', 'reopen']);

function bad(msg: string, status = 400) {
  return new Response(JSON.stringify({ error: msg }), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return bad('Unauthorized', 401);

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claims?.claims?.sub) return bad('Unauthorized', 401);
    const userId = claims.claims.sub as string;

    const body = await req.json().catch(() => ({}));
    const { event_id, action } = body ?? {};
    if (!event_id || typeof event_id !== 'string') return bad('event_id required');
    if (!action || !ACTIONS.has(action)) return bad('invalid action');

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Load the event and confirm the caller is allowed to act on it.
    const { data: ev, error: evErr } = await (admin.from('eidetic_resurfacing_events') as any)
      .select('id, client_id')
      .eq('id', event_id)
      .maybeSingle();
    if (evErr) return bad('lookup failed', 500);
    if (!ev) return bad('event not found', 404);

    // Authorization: admin OR the user owns the client tied to this event.
    const { data: isAdmin } = await (admin.rpc as any)('has_role', { _user_id: userId, _role: 'admin' });
    let allowed = !!isAdmin;
    if (!allowed && ev.client_id) {
      const { data: owns } = await (admin.rpc as any)('user_owns_client', {
        _user_id: userId,
        _client_id: ev.client_id,
      });
      allowed = !!owns;
    }
    if (!allowed) return bad('Forbidden', 403);

    const now = new Date().toISOString();
    const update: Record<string, any> = {};

    if (action === 'acknowledge') {
      update.acknowledged = true;
      update.acknowledged_at = now;
      update.acknowledged_by = userId;
      update.status = 'acknowledged';
    } else if (action === 'snooze') {
      const hours = Number(body.hours);
      if (!Number.isFinite(hours) || hours <= 0 || hours > 24 * 90) return bad('invalid snooze duration');
      update.snoozed_until = new Date(Date.now() + hours * 3600_000).toISOString();
      update.status = 'snoozed';
    } else if (action === 'resolve') {
      update.resolved_at = now;
      update.resolved_by = userId;
      update.status = 'resolved';
      if (typeof body.resolution_notes === 'string') {
        update.resolution_notes = body.resolution_notes.slice(0, 2000);
      }
    } else if (action === 'reopen') {
      update.status = 'active';
      update.resolved_at = null;
      update.resolved_by = null;
      update.snoozed_until = null;
    }

    const { data: updated, error: upErr } = await (admin.from('eidetic_resurfacing_events') as any)
      .update(update)
      .eq('id', event_id)
      .select('*')
      .maybeSingle();
    if (upErr) return bad('update failed', 500);

    return new Response(JSON.stringify({ ok: true, event: updated }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('portal-event-action error', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
