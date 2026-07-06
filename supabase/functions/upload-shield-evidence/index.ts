import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Per-visitor (hashed IP) upload caps for the anonymous intake flow.
const HOURLY_LIMIT = 20;
const DAILY_LIMIT = 100;
const RECAPTCHA_MIN_SCORE = 0.5;
const RECAPTCHA_ACTION = 'shield_intake_upload';

const ACCEPTED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/heic',
  'application/pdf',
]);
const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB

const EICAR =
  'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';

function clientIp(req: Request): string {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
}

async function hashIp(ip: string): Promise<string> {
  const salt = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? 'aria';
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function verifyRecaptcha(token: string, ip: string): Promise<{ ok: boolean; reason?: string }> {
  const secret = Deno.env.get('RECAPTCHA_V3_SECRET_KEY');
  if (!secret) return { ok: false, reason: 'CAPTCHA not configured' };
  if (!token) return { ok: false, reason: 'Missing CAPTCHA token' };
  try {
    const params = new URLSearchParams({ secret, response: token, remoteip: ip });
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const json = await res.json();
    if (!json.success) return { ok: false, reason: 'CAPTCHA verification failed' };
    if (typeof json.score === 'number' && json.score < RECAPTCHA_MIN_SCORE) {
      return { ok: false, reason: 'CAPTCHA score too low' };
    }
    if (json.action && json.action !== RECAPTCHA_ACTION) {
      return { ok: false, reason: 'CAPTCHA action mismatch' };
    }
    return { ok: true };
  } catch (_e) {
    return { ok: false, reason: 'CAPTCHA verification error' };
  }
}

function magicMatches(declaredType: string, b: Uint8Array): boolean {
  const startsWith = (...sig: number[]) => sig.every((v, i) => b[i] === v);
  switch (declaredType) {
    case 'application/pdf':
      return startsWith(0x25, 0x50, 0x44, 0x46);
    case 'image/png':
      return startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
    case 'image/jpeg':
      return startsWith(0xff, 0xd8, 0xff);
    case 'image/gif':
      return startsWith(0x47, 0x49, 0x46, 0x38);
    case 'image/webp':
      return (
        startsWith(0x52, 0x49, 0x46, 0x46) &&
        b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
      );
    case 'image/heic':
      return b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70;
    default:
      return false;
  }
}

function hasExecutableSignature(head: Uint8Array): boolean {
  const eq = (off: number, ...sig: number[]) => sig.every((v, i) => head[off + i] === v);
  if (eq(0, 0x4d, 0x5a)) return true; // MZ (PE)
  if (eq(0, 0x7f, 0x45, 0x4c, 0x46)) return true; // ELF
  const mach = [0xfeedface, 0xfeedfacf, 0xcefaedfe, 0xcffaedfe, 0xcafebabe];
  const word = ((head[0] << 24) | (head[1] << 16) | (head[2] << 8) | head[3]) >>> 0;
  if (mach.includes(word)) return true; // Mach-O / Java class
  return false;
}

function fullAscii(bytes: Uint8Array): string {
  let s = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    s += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return s;
}

function validate(declaredType: string, bytes: Uint8Array): { ok: boolean; reason?: string } {
  if (bytes.length === 0) return { ok: false, reason: 'File is empty.' };
  if (bytes.length > MAX_FILE_BYTES) return { ok: false, reason: 'File exceeds the 15MB limit.' };
  if (!ACCEPTED_TYPES.has(declaredType)) return { ok: false, reason: 'Unsupported file type.' };
  if (!magicMatches(declaredType, bytes)) {
    return { ok: false, reason: 'File contents do not match its declared type.' };
  }
  if (hasExecutableSignature(bytes)) return { ok: false, reason: 'Embedded executable code detected.' };
  const text = fullAscii(bytes);
  if (text.includes(EICAR)) return { ok: false, reason: 'Malware test signature detected.' };
  if (declaredType === 'application/pdf') {
    const danger = ['/Launch', '/OpenAction', '/AA', '/JavaScript', '/JS', '/EmbeddedFile'];
    const hit = danger.find((d) => text.includes(d));
    if (hit) return { ok: false, reason: `PDF contains active/auto-run content (${hit}).` };
  }
  const head = text.slice(0, 8192).toLowerCase();
  const markers = ['<script', '<?php', '<%', '<!doctype html', '<html', 'powershell', 'cmd.exe'];
  const sHit = markers.find((m) => head.includes(m));
  if (sHit) return { ok: false, reason: 'Suspicious script content detected.' };
  return { ok: true };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.dataUrl !== 'string' || typeof body.type !== 'string') {
      return jsonResponse({ error: 'Invalid request body.' }, 400);
    }
    const type = String(body.type);
    const rawName = typeof body.name === 'string' ? body.name : 'evidence';
    const captchaToken = String(body.captcha_token ?? '');

    const ip = clientIp(req);
    const captcha = await verifyRecaptcha(captchaToken, ip);
    if (!captcha.ok) return jsonResponse({ error: captcha.reason || 'CAPTCHA failed' }, 403);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const ipHash = await hashIp(ip);
    const now = Date.now();
    const hourAgo = new Date(now - 60 * 60 * 1000).toISOString();
    const dayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();

    const [{ count: hourCount }, { count: dayCount }] = await Promise.all([
      supabase.from('shield_intake_upload_rate_limits').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', hourAgo),
      supabase.from('shield_intake_upload_rate_limits').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', dayAgo),
    ]);

    if ((hourCount ?? 0) >= HOURLY_LIMIT || (dayCount ?? 0) >= DAILY_LIMIT) {
      return jsonResponse({ error: 'Upload rate limit exceeded. Please try again later.' }, 429);
    }

    // Decode file
    const base64 = body.dataUrl.includes(',') ? body.dataUrl.split(',')[1] : body.dataUrl;
    let bytes: Uint8Array;
    try {
      const bin = atob(base64);
      bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    } catch {
      return jsonResponse({ error: 'Could not decode file.' }, 400);
    }

    const check = validate(type, bytes);
    if (!check.ok) return jsonResponse({ error: check.reason || 'File rejected.' }, 422);

    // Server-controlled, scoped path — clients cannot influence the folder.
    const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120) || 'evidence';
    const path = `intake/${crypto.randomUUID()}/${crypto.randomUUID()}-${safeName}`;

    const { error: upErr } = await supabase.storage
      .from('shield-evidence')
      .upload(path, bytes, { contentType: type, upsert: false });
    if (upErr) {
      console.error('shield-evidence upload failed');
      return jsonResponse({ error: 'Upload failed. Please try again.' }, 500);
    }

    // Record for rate limiting only after a successful upload.
    await supabase.from('shield_intake_upload_rate_limits').insert({ ip_hash: ipHash });

    return jsonResponse({ path, name: rawName, size: bytes.length, type });
  } catch (_err) {
    return jsonResponse({ error: 'Server error.' }, 500);
  }
});
