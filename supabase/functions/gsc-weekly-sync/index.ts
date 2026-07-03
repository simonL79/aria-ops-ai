import { createClient } from "npm:@supabase/supabase-js@2";
import { requireAdmin, isAuthenticated } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-sync-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const SITE_URL = "sc-domain:ariaops.co.uk";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Format Date as YYYY-MM-DD (UTC)
function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Auth: either the cron shared secret, or an admin JWT (manual trigger).
  let triggeredBy = "cron";
  const syncSecret = Deno.env.get("GSC_SYNC_SECRET");
  const providedSecret = req.headers.get("x-sync-secret");

  if (syncSecret && providedSecret && providedSecret === syncSecret) {
    triggeredBy = "cron";
  } else {
    const auth = await requireAdmin(req);
    if (!isAuthenticated(auth)) return auth;
    triggeredBy = "manual";
  }

  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const gscKey = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
  if (!lovableKey || !gscKey) {
    return json({ error: "Search Console connection is not configured" }, 500);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const db = createClient(supabaseUrl, serviceKey);

  // GSC data lags ~2-3 days. Use a 7-day window ending 3 days ago.
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 3);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 6);
  const periodStart = fmt(start);
  const periodEnd = fmt(end);

  try {
    const encodedSite = encodeURIComponent(SITE_URL);
    const res = await fetch(
      `${GATEWAY}/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": gscKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: periodStart,
          endDate: periodEnd,
          dimensions: ["query"],
          rowLimit: 2500,
        }),
      },
    );

    if (!res.ok) {
      const detail = await res.text();
      await db.from("gsc_sync_runs").insert({
        site_url: SITE_URL,
        period_start: periodStart,
        period_end: periodEnd,
        status: "error",
        error: `GSC API ${res.status}`,
        triggered_by: triggeredBy,
      });
      console.error("GSC API error", res.status, detail.slice(0, 500));
      return json({ error: "Failed to fetch Search Console data" }, 502);
    }

    const payload = await res.json();
    const rows: Array<{
      keys: string[];
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    }> = payload.rows ?? [];

    // Load active tracked keywords to flag matches (case-insensitive).
    const { data: targets } = await db
      .from("keyword_targets")
      .select("keyword")
      .eq("active", true);
    const tracked = new Set(
      (targets ?? []).map((t: { keyword: string }) => t.keyword.toLowerCase().trim()),
    );

    let matched = 0;
    const records = rows.map((r) => {
      const keyword = r.keys[0] ?? "";
      const isTracked = tracked.has(keyword.toLowerCase().trim());
      if (isTracked) matched++;
      return {
        site_url: SITE_URL,
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

    if (records.length > 0) {
      // Upsert in chunks to stay within payload limits.
      const chunkSize = 500;
      for (let i = 0; i < records.length; i += chunkSize) {
        const chunk = records.slice(i, i + chunkSize);
        const { error } = await db
          .from("gsc_weekly_snapshots")
          .upsert(chunk, { onConflict: "site_url,keyword,period_start" });
        if (error) throw error;
      }
    }

    await db.from("gsc_sync_runs").insert({
      site_url: SITE_URL,
      period_start: periodStart,
      period_end: periodEnd,
      rows_upserted: records.length,
      tracked_matched: matched,
      status: "success",
      triggered_by: triggeredBy,
    });

    return json({
      success: true,
      period_start: periodStart,
      period_end: periodEnd,
      rows_upserted: records.length,
      tracked_matched: matched,
    });
  } catch (e) {
    console.error("gsc-weekly-sync error", e);
    await db.from("gsc_sync_runs").insert({
      site_url: SITE_URL,
      period_start: periodStart,
      period_end: periodEnd,
      status: "error",
      error: "Unexpected error during sync",
      triggered_by: triggeredBy,
    });
    return json({ error: "Sync failed" }, 500);
  }
});
