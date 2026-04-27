import { createClient } from 'npm:@supabase/supabase-js@2';
import { requireAdmin, isAuthenticated } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function sha256Hex(input: string) {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const auth = await requireAdmin(req);
    if (!isAuthenticated(auth)) return auth;

    const { alert_id, url } = await req.json();
    if (!alert_id || !url) {
      return new Response(JSON.stringify({ error: 'alert_id and url required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    let parsed: URL;
    try { parsed = new URL(url); } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    let status = 0, contentType = '', title = '', bodySnippet = '', hash = '';
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 10000);
      const res = await fetch(parsed.toString(), { signal: ctrl.signal, redirect: 'follow', headers: { 'User-Agent': 'ARIA-Shield-Capture/1.0' } });
      clearTimeout(t);
      status = res.status;
      contentType = res.headers.get('content-type') || '';
      const text = await res.text();
      bodySnippet = text.slice(0, 4000);
      hash = await sha256Hex(text);
      const m = text.match(/<title[^>]*>([^<]*)<\/title>/i);
      if (m) title = m[1].trim().slice(0, 300);
    } catch (fetchErr) {
      console.warn('capture fetch failed', fetchErr);
    }

    const { data, error } = await (admin as any).from('shield_evidence_items').insert({
      alert_id, evidence_type: 'url_metadata', source_url: parsed.toString(),
      source_platform: parsed.hostname, captured_text: bodySnippet, content_hash: hash,
      captured_by: auth.user.id, notes: title || null,
      metadata: { http_status: status, content_type: contentType, hostname: parsed.hostname },
    }).select('id').single();

    if (error) {
      console.error('evidence insert error', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ evidence_id: data.id, http_status: status, title }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('shield-capture-url-metadata error', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
