// Signed admin token (HMAC-SHA256) for Shield edge functions.
// Format: base64url(JSON(payload)) + "." + base64url(HMAC-SHA256(secret, base64url(payload)))

export type ShieldAction = 'promote' | 'transition' | 'capture';

interface ShieldTokenPayload {
  sub: string;
  act: ShieldAction;
  iat: number;
  exp: number;
  jti: string;
}

const enc = new TextEncoder();

function b64urlEncode(bytes: Uint8Array | string): string {
  const buf = typeof bytes === 'string' ? enc.encode(bytes) : bytes;
  let bin = '';
  for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function getSecret(): string {
  const s = Deno.env.get('SHIELD_ADMIN_HMAC_SECRET');
  if (!s || s.length < 32) throw new Error('SHIELD_ADMIN_HMAC_SECRET not configured');
  return s;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function signShieldToken(
  userId: string,
  action: ShieldAction,
  ttlSec = 300,
): Promise<{ token: string; expires_at: number }> {
  const now = Math.floor(Date.now() / 1000);
  const payload: ShieldTokenPayload = {
    sub: userId,
    act: action,
    iat: now,
    exp: now + ttlSec,
    jti: crypto.randomUUID(),
  };
  const payloadB64 = b64urlEncode(JSON.stringify(payload));
  const key = await hmacKey(getSecret());
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64)));
  return { token: `${payloadB64}.${b64urlEncode(sig)}`, expires_at: payload.exp };
}

export interface VerifiedShieldPayload {
  userId: string;
  jti: string;
  action: ShieldAction;
  iat: number;
  exp: number;
}

export async function verifyShieldToken(
  token: string | null,
  expectedAction: ShieldAction,
): Promise<VerifiedShieldPayload> {
  if (!token || typeof token !== 'string') throw new Error('missing token');
  const parts = token.split('.');
  if (parts.length !== 2) throw new Error('malformed token');
  const [payloadB64, sigB64] = parts;

  const key = await hmacKey(getSecret());
  const expectedSig = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64)),
  );
  const providedSig = b64urlDecode(sigB64);
  if (!timingSafeEqual(expectedSig, providedSig)) throw new Error('bad signature');

  let payload: ShieldTokenPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(b64urlDecode(payloadB64)));
  } catch {
    throw new Error('bad payload');
  }

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp < now) throw new Error('expired');
  if (payload.act !== expectedAction) throw new Error('action mismatch');
  if (!payload.sub) throw new Error('missing subject');

  return { userId: payload.sub, jti: payload.jti };
}
