import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const AUTO_HIDE_REPORT_THRESHOLD = 3;

async function hashIp(ip: string): Promise<string> {
  const salt = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? 'aria';
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function clientIp(req: Request): string {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
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

    if (!comment_id) {
      return new Response(JSON.stringify({ error: 'Missing comment_id' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: comment } = await supabase.from('blog_comments').select('id, status, report_count').eq('id', comment_id).maybeSingle();
    if (!comment) {
      return new Response(JSON.stringify({ error: 'Comment not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const ip_hash = await hashIp(clientIp(req));

    const { error: insErr } = await supabase
      .from('blog_comment_reports')
      .insert({ comment_id, reason, reporter_ip_hash: ip_hash });

    if (insErr) {
      // Unique violation = already reported by this IP
      if (insErr.code === '23505') {
        return new Response(JSON.stringify({ ok: true, already_reported: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      console.error('report insert error', insErr);
      return new Response(JSON.stringify({ error: 'Failed to record report' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Recount and possibly auto-hide
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
