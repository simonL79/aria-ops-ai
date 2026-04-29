// Bulk triage actions for EIDETIC resurfacing alerts
import { createClient } from 'npm:@supabase/supabase-js@2';
import { requireAdmin, isAuthenticated } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Action = 'acknowledge' | 'snooze' | 'unsnooze' | 'assign' | 'resolve' | 'reopen';

interface Body {
  alert_ids: string[];
  action: Action;
  notes?: string;
  snooze_minutes?: number;
  assign_to?: string | null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: aerr } = await supabase.auth.getClaims(token);
    if (aerr || !claims?.claims) return json({ error: 'Unauthorized' }, 401);
    const actor = claims.claims.sub as string;

    const body = (await req.json()) as Body;
    if (!Array.isArray(body.alert_ids) || body.alert_ids.length === 0) {
      return json({ error: 'alert_ids required' }, 400);
    }
    if (body.alert_ids.length > 200) return json({ error: 'Max 200 alerts per call' }, 400);

    const now = new Date().toISOString();
    const update: Record<string, unknown> = {};
    let newStatus = '';

    switch (body.action) {
      case 'acknowledge':
        update.acknowledged = true;
        update.acknowledged_at = now;
        update.acknowledged_by = actor;
        newStatus = 'active';
        break;
      case 'snooze': {
        const mins = Math.max(1, Math.min(body.snooze_minutes ?? 60, 60 * 24 * 30));
        update.status = 'snoozed';
        update.snoozed_until = new Date(Date.now() + mins * 60_000).toISOString();
        newStatus = 'snoozed';
        break;
      }
      case 'unsnooze':
        update.status = 'active';
        update.snoozed_until = null;
        newStatus = 'active';
        break;
      case 'assign':
        update.assigned_to = body.assign_to ?? null;
        newStatus = 'active';
        break;
      case 'resolve':
        update.status = 'resolved';
        update.resolved_at = now;
        update.resolved_by = actor;
        update.resolution_notes = body.notes ?? null;
        newStatus = 'resolved';
        break;
      case 'reopen':
        update.status = 'active';
        update.resolved_at = null;
        update.resolved_by = null;
        newStatus = 'active';
        break;
      default:
        return json({ error: 'Invalid action' }, 400);
    }

    // Fetch prior statuses for audit
    const { data: prior } = await supabase
      .from('eidetic_resurfacing_events')
      .select('id,status')
      .in('id', body.alert_ids);

    const { error: updErr } = await supabase
      .from('eidetic_resurfacing_events')
      .update(update)
      .in('id', body.alert_ids);
    if (updErr) return json({ error: updErr.message }, 400);

    const auditRows = (prior ?? []).map((p: { id: string; status: string }) => ({
      alert_id: p.id,
      action_type: body.action,
      actor,
      prior_status: p.status,
      new_status: newStatus,
      notes: body.notes ?? null,
      metadata: { snooze_minutes: body.snooze_minutes, assign_to: body.assign_to },
    }));
    if (auditRows.length) {
      await supabase.from('eidetic_alert_actions').insert(auditRows);
    }

    return json({ ok: true, updated: body.alert_ids.length });
  } catch (e) {
    console.error('triage-action error', e);
    return json({ error: 'Internal server error' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
