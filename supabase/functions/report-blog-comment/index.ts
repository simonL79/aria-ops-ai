import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const AUTO_HIDE_REPORT_THRESHOLD = 3;
const HOURLY_LIMIT = 10;
const DAILY_LIMIT = 50;
const RECAPTCHA_MIN_SCORE = 0.5;

async function hashIp(ip: string): Promise<string> {
  const salt = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? 'aria';
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function clientIp(req: Request): string {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
}

async function verifyRecaptcha(token: string, ip: string): Promise<{ ok: boolean; score?: number; reason?: string }> {
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
      return { ok: false, score: json.score, reason: 'CAPTCHA score too low' };
    }
    if (json.action && json.action !== 'report_comment') {
      return { ok: false, reason: 'CAPTCHA action mismatch' };
    }
    return { ok: true, score: json.score };
  } catch (_e) {
    return { ok: false, reason: 'CAPTCHA verification error' };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const comment_id = String(body.comment_id ?? '').trim();
    const reason = body.reason ? String(body.reason).slice(0, 200) : null;
    const captcha_token = String(body.captcha_token ?? '');

    if (!comment_id) {
      return new Response(JSON.stringify({ error: 'Missing comment_id' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const ip = clientIp(req);
    const captcha = await verifyRecaptcha(captcha_token, ip);
    if (!captcha.ok) {
      return new Response(JSON.stringify({ error: captcha.reason || 'CAPTCHA failed' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const ip_hash = await hashIp(ip);

    // Rate limiting: per-IP hourly / daily caps
    const now = Date.now();
    const hourAgo = new Date(now - 60 * 60 * 1000).toISOString();
    const dayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();

    const [{ count: hourCount }, { count: dayCount }] = await Promise.all([
      supabase.from('blog_report_rate_limits').select('id', { count: 'exact', head: true }).eq('ip_hash', ip_hash).gte('reported_at', hourAgo),
      supabase.from('blog_report_rate_limits').select('id', { count: 'exact', head: true }).eq('ip_hash', ip_hash).gte('reported_at', dayAgo),
    ]);

    if ((hourCount ?? 0) >= HOURLY_LIMIT || (dayCount ?? 0) >= DAILY_LIMIT) {
      return new Response(JSON.stringify({ error: 'Report rate limit exceeded. Try again later.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: comment } = await supabase.from('blog_comments').select('id, status, report_count').eq('id', comment_id).maybeSingle();
    if (!comment) {
      return new Response(JSON.stringify({ error: 'Comment not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { error: insErr } = await supabase
      .from('blog_comment_reports')
      .insert({ comment_id, reason, reporter_ip_hash: ip_hash });

    if (insErr) {
      if (insErr.code === '23505') {
        return new Response(JSON.stringify({ ok: true, already_reported: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      console.error('report insert error', insErr);
      return new Response(JSON.stringify({ error: 'Failed to record report' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Track for rate limiting (only on successful new report)
    await supabase.from('blog_report_rate_limits').insert({ ip_hash });

    const { count } = await supabase
      .from('blog_comment_reports')
      .select('id', { count: 'exact', head: true })
      .eq('comment_id', comment_id);

    const reportCount = count ?? 0;
    const updates: Record<string, unknown> = { report_count: reportCount };
    let autoHidden = false;
    if (reportCount >= AUTO_HIDE_REPORT_THRESHOLD && comment.status === 'visible') {
      updates.status = 'hidden';
      updates.hidden_reason = `Auto-hidden: ${reportCount} user reports`;
      autoHidden = true;
    }
    await supabase.from('blog_comments').update(updates).eq('id', comment_id);

    if (autoHidden) {
      await supabase.from('moderation_audit_log').insert({
        comment_id,
        action: 'auto_hide_reports',
        reason: `Reached ${reportCount} reports`,
        metadata: { report_count: reportCount },
      });
    }

    return new Response(JSON.stringify({ ok: true, report_count: reportCount, auto_hidden: autoHidden }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
