import { createClient } from 'npm:@supabase/supabase-js@2';
import { requireAdmin, isAuthenticated } from '../_shared/auth.ts';
import { signShieldToken } from '../_shared/shieldToken.ts';
import { ALLOWED_SHIELD_ACTIONS, isShieldAction, type ShieldAction } from '../_shared/shieldActions.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function clientMeta(req: Request) {
  const fwd = req.headers.get('x-forwarded-for');
  const ip = fwd?.split(',')[0]?.trim() || req.headers.get('cf-connecting-ip') || null;
  return { ip_address: ip, user_agent: req.headers.get('user-agent') };
}

async function audit(admin: any, evt: Record<string, unknown>) {
  try {
    await admin.from('shield_token_audit_events').insert({
      function_name: 'shield-mint-token',
      metadata: {},
      ...evt,
    });
  } catch (err) {
    console.warn('shield-mint-token audit insert failed', err);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const meta = clientMeta(req);

  try {
    const auth = await requireAdmin(req);
    if (!isAuthenticated(auth)) {
      await audit(admin, {
        event_type: 'mint_denied',
        success: false,
        failure_reason: 'not_admin_or_unauthenticated',
        ...meta,
      });
      return auth;
    }

    const body = await req.json().catch(() => ({}));
    const action = body?.action;
    if (!isShieldAction(action)) {
      await audit(admin, {
        event_type: 'mint_denied',
        user_id: auth.user.id,
        success: false,
        failure_reason: 'invalid_action',
        ...meta,
        metadata: { allowed: ALLOWED_SHIELD_ACTIONS, received: action ?? null },
      });
      return new Response(JSON.stringify({ error: 'invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { token, expires_at } = await signShieldToken(auth.user.id, action as ShieldAction, 300);

    // Decode jti from the token payload (base64url JSON before the '.')
    let jti: string | null = null;
    try {
      const payloadB64 = token.split('.')[0];
      const pad = payloadB64.length % 4 === 0 ? '' : '='.repeat(4 - (payloadB64.length % 4));
      const json = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/') + pad));
      jti = json?.jti ?? null;
    } catch { /* non-fatal */ }

    await audit(admin, {
      event_type: 'mint_success',
      user_id: auth.user.id,
      action,
      jti,
      success: true,
      ...meta,
      metadata: { expires_at },
    });

    return new Response(JSON.stringify({ token, expires_at }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('shield-mint-token error', e);
    await audit(admin, {
      event_type: 'mint_error',
      success: false,
      failure_reason: 'internal_error',
      ...meta,
    });
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
