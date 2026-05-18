import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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
    const post_id = String(body.post_id ?? '').trim();
    const author_name = String(body.author_name ?? '').trim();
    const content = String(body.content ?? '').trim();

    if (!post_id || !author_name || !content) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (author_name.length > 80 || content.length > 2000 || content.length < 2) {
      return new Response(JSON.stringify({ error: 'Invalid length' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Confirm post exists
    const { data: post } = await supabase.from('blog_posts').select('id').eq('id', post_id).maybeSingle();
    if (!post) {
      return new Response(JSON.stringify({ error: 'Invalid post' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const ip = clientIp(req);
    const ip_hash = await hashIp(ip);

    // Rate limit: max 5 comments per IP per 10 min
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('blog_comments')
      .select('id', { count: 'exact', head: true })
      .eq('reporter_ip_hash', ip_hash)
      .gte('created_at', since);
    if ((count ?? 0) >= 5) {
      return new Response(JSON.stringify({ error: 'Too many comments, slow down' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Blocklist check
    const { data: terms } = await supabase.from('moderation_blocklist').select('term,severity');
    const lower = content.toLowerCase();
    let autoHide = false;
    let matchedTerm: string | null = null;
    for (const t of terms ?? []) {
      const term = String(t.term).toLowerCase();
      if (term && lower.includes(term)) {
        autoHide = true;
        matchedTerm = term;
        break;
      }
    }

    const status = autoHide ? 'hidden' : 'visible';
    const hidden_reason = autoHide ? `Auto-hidden: matched blocklist term` : null;

    const { data: inserted, error } = await supabase
      .from('blog_comments')
      .insert({ post_id, author_name, content, status, hidden_reason, reporter_ip_hash: ip_hash })
      .select('id, author_name, content, created_at, status')
      .single();

    if (error || !inserted) {
      console.error('insert error', error);
      return new Response(JSON.stringify({ error: 'Failed to save comment' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (autoHide) {
      await supabase.from('moderation_audit_log').insert({
        comment_id: inserted.id,
        action: 'auto_hide_blocklist',
        reason: 'Matched blocklist term',
        metadata: { term: matchedTerm },
      });
    }

    return new Response(JSON.stringify({
      ok: true,
      auto_hidden: autoHide,
      comment: autoHide ? null : inserted,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
