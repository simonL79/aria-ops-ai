// Using built-in Deno.serve
import { createClient } from 'npm:@supabase/supabase-js@2';
import { requireUser, isUser } from '../_shared/userAuth.ts';
import { validatePublicUrl } from '../_shared/ssrfGuard.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface FlaggedItem {
  url: string | null;
  excerpt: string;
  category: string;
  severity: number;
  ai_rationale: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const auth = await requireUser(req);
    if (!isUser(auth)) return auth;

    const { submission_id } = await req.json();
    if (!submission_id || typeof submission_id !== 'string') {
      return new Response(JSON.stringify({ error: 'submission_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Load submission and verify ownership
    const { data: sub, error: subErr } = await admin
      .from('portal_removal_submissions')
      .select('*')
      .eq('id', submission_id)
      .single();

    if (subErr || !sub) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (sub.user_id !== auth.user.id) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await admin
      .from('portal_removal_submissions')
      .update({ status: 'scanning', scan_started_at: new Date().toISOString() })
      .eq('id', submission_id);

    // Build prompt context
    let context = '';
    if (sub.source_url) {
      const guard = await validatePublicUrl(sub.source_url);
      if (!guard.ok) {
        context = `URL: ${sub.source_url}\n\n(URL rejected by SSRF guard: ${guard.error}; analyzing URL string only.)`;
      } else try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 10000);
        const r = await fetch(guard.url!.toString(), {
          headers: { 'User-Agent': 'ARIA-PortalScanner/1.0' },
          redirect: 'manual',
          signal: ctrl.signal,
        });
        clearTimeout(t);
        if (r.ok) {
          const html = await r.text();
          const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
            .replace(/<style[\s\S]*?<\/style>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 6000);
          context = `URL: ${sub.source_url}\n\nExtracted page text:\n${text}`;
        } else {
          context = `URL: ${sub.source_url}\n\n(Unable to fetch page; analyze the URL itself.)`;
        }
      } catch {
        context = `URL: ${sub.source_url}\n\n(Fetch error; analyze the URL itself.)`;
      }
    }
    if (sub.source_text) {
      context += `\n\nClient-supplied content:\n${sub.source_text.slice(0, 6000)}`;
    }
    if (sub.notes) {
      context += `\n\nClient notes:\n${sub.notes.slice(0, 1000)}`;
    }

    // Call Lovable AI gateway
    const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content:
              'You are a reputation-defense analyst. Identify discrete pieces of content that are potentially defamatory, harassing, privacy-violating, misinformation, or otherwise harmful to the subject. Respond ONLY with valid JSON of shape {"items": [{"excerpt": string, "category": "defamation"|"misinformation"|"privacy"|"harassment"|"other", "severity": 1-10, "ai_rationale": string, "url": string|null}]}. Return up to 8 items. If nothing is concerning, return {"items": []}.',
          },
          { role: 'user', content: context || 'No content supplied.' },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error('AI gateway error', aiResp.status, errText);
      await admin
        .from('portal_removal_submissions')
        .update({ status: 'failed' })
        .eq('id', submission_id);
      return new Response(JSON.stringify({ error: 'AI scan failed' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiJson = await aiResp.json();
    let items: FlaggedItem[] = [];
    try {
      const content = aiJson.choices?.[0]?.message?.content ?? '{}';
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;
      items = Array.isArray(parsed.items) ? parsed.items : [];
    } catch (e) {
      console.error('Parse failed', e);
    }

    // Insert flagged items
    if (items.length > 0) {
      const rows = items.slice(0, 20).map((it) => ({
        submission_id,
        url: it.url ?? sub.source_url,
        excerpt: String(it.excerpt ?? '').slice(0, 2000),
        category: ['defamation', 'misinformation', 'privacy', 'harassment', 'other'].includes(it.category)
          ? it.category
          : 'other',
        severity: Math.max(1, Math.min(10, Number(it.severity) || 5)),
        ai_rationale: String(it.ai_rationale ?? '').slice(0, 1000),
      }));
      await admin.from('portal_removal_items').insert(rows);
    }

    await admin
      .from('portal_removal_submissions')
      .update({ status: 'reviewing', scan_completed_at: new Date().toISOString() })
      .eq('id', submission_id);

    return new Response(JSON.stringify({ ok: true, item_count: items.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('portal-removal-scan error', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
