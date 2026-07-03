import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { requireAdmin, isAuthenticated } from '../_shared/auth.ts';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-sync-secret',
};

interface SearchRequest {
  action?: string;
  query?: string;
  maxResults?: number;
  useProxy?: boolean;
}

interface SearchResult {
  title: string;
  snippet: string;
  link: string;
}

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const GSC_SITE_URL = "sc-domain:ariaops.co.uk";

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/**
 * Pull the latest full week of Search Console query performance and upsert
 * per-keyword snapshots. Auth is either the cron vault token or an admin JWT.
 */
async function runGscWeeklySync(req: Request): Promise<Response> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const db = createClient(supabaseUrl, serviceKey);

  // Auth: cron vault token, else admin JWT
  let triggeredBy = 'cron';
  const providedSecret = req.headers.get('x-sync-secret');
  let cronAuthorized = false;
  if (providedSecret) {
    const { data: ok } = await db.rpc('verify_gsc_sync_secret', { _token: providedSecret });
    cronAuthorized = ok === true;
  }
  if (cronAuthorized) {
    triggeredBy = 'cron';
  } else {
    const auth = await requireAdmin(req);
    if (!isAuthenticated(auth)) return auth;
    triggeredBy = 'manual';
  }

  const lovableKey = Deno.env.get('LOVABLE_API_KEY');
  const gscKey = Deno.env.get('GOOGLE_SEARCH_CONSOLE_API_KEY');
  if (!lovableKey || !gscKey) {
    return jsonResponse({ error: 'Search Console connection is not configured' }, 500);
  }

  // GSC data lags ~3 days; use a 7-day window ending 3 days ago.
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 3);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 6);
  const periodStart = fmtDate(start);
  const periodEnd = fmtDate(end);

  try {
    const res = await fetch(
      `${GATEWAY}/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          'X-Connection-Api-Key': gscKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: periodStart,
          endDate: periodEnd,
          dimensions: ['query'],
          rowLimit: 2500,
        }),
      },
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error('GSC API error', res.status, detail.slice(0, 500));
      await db.from('gsc_sync_runs').insert({
        site_url: GSC_SITE_URL,
        period_start: periodStart,
        period_end: periodEnd,
        status: 'error',
        error: `GSC API ${res.status}`,
        triggered_by: triggeredBy,
      });
      return jsonResponse({ error: 'Failed to fetch Search Console data' }, 502);
    }

    const payload = await res.json();
    const rows: Array<{
      keys: string[];
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    }> = payload.rows ?? [];

    const { data: targets } = await db
      .from('keyword_targets')
      .select('keyword')
      .eq('active', true);
    const tracked = new Set(
      (targets ?? []).map((t: { keyword: string }) => t.keyword.toLowerCase().trim()),
    );

    let matched = 0;
    const records = rows.map((r) => {
      const keyword = r.keys[0] ?? '';
      const isTracked = tracked.has(keyword.toLowerCase().trim());
      if (isTracked) matched++;
      return {
        site_url: GSC_SITE_URL,
        keyword,
        period_start: periodStart,
        period_end: periodEnd,
        clicks: Math.round(r.clicks ?? 0),
        impressions: Math.round(r.impressions ?? 0),
        ctr: Number((r.ctr ?? 0).toFixed(6)),
        position: Number((r.position ?? 0).toFixed(2)),
        is_tracked: isTracked,
        updated_at: new Date().toISOString(),
      };
    });

    for (let i = 0; i < records.length; i += 500) {
      const chunk = records.slice(i, i + 500);
      const { error } = await db
        .from('gsc_weekly_snapshots')
        .upsert(chunk, { onConflict: 'site_url,keyword,period_start' });
      if (error) throw error;
    }

    await db.from('gsc_sync_runs').insert({
      site_url: GSC_SITE_URL,
      period_start: periodStart,
      period_end: periodEnd,
      rows_upserted: records.length,
      tracked_matched: matched,
      status: 'success',
      triggered_by: triggeredBy,
    });

    return jsonResponse({
      success: true,
      period_start: periodStart,
      period_end: periodEnd,
      rows_upserted: records.length,
      tracked_matched: matched,
    });
  } catch (e) {
    console.error('gsc-weekly-sync error', e);
    await db.from('gsc_sync_runs').insert({
      site_url: GSC_SITE_URL,
      period_start: periodStart,
      period_end: periodEnd,
      status: 'error',
      error: 'Unexpected error during sync',
      triggered_by: triggeredBy,
    });
    return jsonResponse({ error: 'Sync failed' }, 500);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: SearchRequest = await req.json().catch(() => ({}));

    // GSC weekly performance sync mode (own auth handling inside)
    if (requestData.action === 'gsc-weekly-sync') {
      return await runGscWeeklySync(req);
    }

    // Default: admin-only live Google SERP crawl
    const auth = await requireAdmin(req);
    if (!isAuthenticated(auth)) return auth;

    if (!requestData.query) {
      throw new Error('Search query is required');
    }

    console.log(`Processing search: "${requestData.query}"`);

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(requestData.query)}`;
    const maxResults = requestData.maxResults || 10;

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch search results: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    const parser = new DOMParser();
    const document = parser.parseFromString(html, 'text/html');

    if (!document) {
      throw new Error('Failed to parse HTML');
    }

    const results: SearchResult[] = [];
    const resultElements = document.querySelectorAll('div.g');

    for (const element of Array.from(resultElements).slice(0, maxResults)) {
      const titleElement = element.querySelector('h3');
      const linkElement = element.querySelector('a');
      const snippetElement = element.querySelector('div.VwiC3b');

      if (titleElement && linkElement && snippetElement) {
        results.push({
          title: titleElement.textContent || '',
          link: linkElement.getAttribute('href') || '',
          snippet: snippetElement.textContent || ''
        });
      }
    }

    console.log(`Found ${results.length} search results for "${requestData.query}"`);

    return new Response(JSON.stringify({
      query: requestData.query,
      results: results,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in google-search-crawler function:', error);

    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
