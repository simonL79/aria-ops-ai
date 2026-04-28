// Shield token consume helper.
// - verifies the HMAC token (action-bound, ttl-checked)
// - inserts the jti into shield_used_jtis (PK -> race-safe replay rejection)
// - writes a forensics row to shield_token_audit_events for every outcome
//
// Audit writes are best-effort and never block the action.

import { verifyShieldToken, type VerifiedShieldPayload } from './shieldToken.ts';
import type { ShieldAction } from './shieldActions.ts';

interface ConsumeOptions {
  req: Request;
  supabaseAdmin: any;
  expectedAction: ShieldAction;
  functionName: string;
}

interface AuditEvent {
  event_type: string;
  user_id?: string | null;
  action?: string | null;
  jti?: string | null;
  success: boolean;
  failure_reason?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  metadata?: Record<string, unknown>;
}

function extractClientMeta(req: Request): { ip_address: string | null; user_agent: string | null } {
  const fwd = req.headers.get('x-forwarded-for');
  const ip = fwd?.split(',')[0]?.trim() || req.headers.get('cf-connecting-ip') || null;
  return { ip_address: ip, user_agent: req.headers.get('user-agent') };
}

async function logEvent(supabaseAdmin: any, functionName: string, evt: AuditEvent): Promise<void> {
  try {
    await supabaseAdmin.from('shield_token_audit_events').insert({
      ...evt,
      function_name: functionName,
      metadata: evt.metadata ?? {},
    });
  } catch (err) {
    // Best-effort. Never let audit logging block the action.
    console.warn('shield audit log insert failed', err);
  }
}

export async function consumeShieldToken(opts: ConsumeOptions): Promise<VerifiedShieldPayload> {
  const { req, supabaseAdmin, expectedAction, functionName } = opts;
  const meta = extractClientMeta(req);
  const token = req.headers.get('x-shield-token');

  if (!token) {
    await logEvent(supabaseAdmin, functionName, {
      event_type: 'verify_missing',
      success: false,
      failure_reason: 'missing_token',
      ...meta,
    });
    throw new Error('missing_token');
  }

  let payload: VerifiedShieldPayload;
  try {
    payload = await verifyShieldToken(token, expectedAction);
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'verify_failed';
    await logEvent(supabaseAdmin, functionName, {
      event_type: 'verify_failed',
      success: false,
      failure_reason: reason,
      ...meta,
    });
    throw err;
  }

  // Single-use enforcement via PK collision on jti.
  const { error: insertErr } = await supabaseAdmin.from('shield_used_jtis').insert({
    jti: payload.jti,
    user_id: payload.userId,
    action: payload.action,
    consumed_by_function: functionName,
    minted_at: new Date(payload.iat * 1000).toISOString(),
    expires_at: new Date(payload.exp * 1000).toISOString(),
    ip_address: meta.ip_address,
    user_agent: meta.user_agent,
  });

  if (insertErr) {
    const isReplay = (insertErr as any).code === '23505';
    await logEvent(supabaseAdmin, functionName, {
      event_type: isReplay ? 'verify_replay' : 'verify_consume_error',
      user_id: payload.userId,
      action: payload.action,
      jti: payload.jti,
      success: false,
      failure_reason: isReplay ? 'replay_detected' : (insertErr.message || 'consume_failed'),
      ...meta,
    });
    throw new Error(isReplay ? 'replay_detected' : 'consume_failed');
  }

  await logEvent(supabaseAdmin, functionName, {
    event_type: 'verify_success',
    user_id: payload.userId,
    action: payload.action,
    jti: payload.jti,
    success: true,
    ...meta,
  });

  return payload;
}
