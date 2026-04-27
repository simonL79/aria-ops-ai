import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { requireAdmin, isAuthenticated } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLATFORM_RECIPIENTS: Record<string, string> = {
  youtube: 'support+legal@youtube.com (use https://support.google.com/youtube/answer/2807622)',
  google: 'https://support.google.com/legal/troubleshooter/1114905',
  x: 'https://help.x.com/en/forms/safety-and-sensitive-content',
  twitter: 'https://help.x.com/en/forms/safety-and-sensitive-content',
  reddit: 'contact@reddit.com (use https://www.reddit.com/report)',
  facebook: 'https://www.facebook.com/help/contact/144059062408922',
  meta: 'https://www.facebook.com/help/contact/144059062408922',
  other: 'See target site privacy/legal contact',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const auth = await requireAdmin(req);
    if (!isAuthenticated(auth)) return auth;

    const body = await req.json().catch(() => ({}));
    const { client_id, target_url, platform, request_type, legal_basis, evidence } = body;

    if (!target_url || !platform || !request_type) {
      return new Response(JSON.stringify({ error: 'target_url, platform, request_type required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const recipient = PLATFORM_RECIPIENTS[platform.toLowerCase()] || PLATFORM_RECIPIENTS.other;

    // Generate letter via Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    let draftLetter = '';
    if (LOVABLE_API_KEY) {
      const prompt = `Draft a formal ${request_type.toUpperCase()} removal request letter to ${platform} regarding the URL: ${target_url}.

Legal basis: ${legal_basis || '(not specified)'}
Evidence: ${JSON.stringify(evidence || [], null, 2)}

The letter should be professional, concise, cite the relevant legal framework (GDPR Art. 17 for gdpr_erasure, DMCA 17 U.S.C. § 512 for dmca, applicable defamation/harassment law otherwise), state the harm, and demand removal within 14 days. Sign as "A.R.I.A Legal Operations". Output only the letter body, no preamble.`;

      const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${LOVABLE_API_KEY}` },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'You are a senior legal operations analyst drafting formal takedown requests.' },
            { role: 'user', content: prompt },
          ],
        }),
      });
      if (aiResp.ok) {
        const aiJson = await aiResp.json();
        draftLetter = aiJson.choices?.[0]?.message?.content || '';
      } else {
        console.error('AI letter draft failed:', aiResp.status, await aiResp.text());
      }
    }

    const { data, error } = await supabase
      .from('oblivion_takedowns')
      .insert({
        client_id: client_id || null,
        target_url,
        platform,
        request_type,
        legal_basis: legal_basis || null,
        evidence: evidence || [],
        status: 'draft',
        metadata: {
          draft_letter: draftLetter,
          recipient,
          drafted_by: auth.user.id,
          drafted_at: new Date().toISOString(),
        },
      })
      .select()
      .single();
    if (error) throw error;

    await supabase.from('aria_ops_log').insert({
      operation_type: 'takedown_drafted',
      module_source: 'oblivion',
      operation_data: { takedown_id: data.id, platform, request_type, target_url },
      success: true,
    });

    return new Response(JSON.stringify({ success: true, takedown: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('oblivion-draft error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
