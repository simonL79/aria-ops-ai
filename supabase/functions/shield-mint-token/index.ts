import { requireAdmin, isAuthenticated } from '../_shared/auth.ts';
import { signShieldToken, type ShieldAction } from '../_shared/shieldToken.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALLOWED_ACTIONS: ShieldAction[] = ['promote', 'transition', 'capture'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const auth = await requireAdmin(req);
    if (!isAuthenticated(auth)) return auth;

    const { action } = await req.json().catch(() => ({}));
    if (!action || !ALLOWED_ACTIONS.includes(action)) {
      return new Response(JSON.stringify({ error: 'invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { token, expires_at } = await signShieldToken(auth.user.id, action as ShieldAction, 300);
    return new Response(JSON.stringify({ token, expires_at }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('shield-mint-token error', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
