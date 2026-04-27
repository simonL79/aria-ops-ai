// Requiem Scan — runs a SerpApi query, stores snapshot, updates job, writes audit log
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ScanRequest {
  job_id?: string;
  entity_name?: string;
  query?: string;
  client_id?: string | null;
  search_engine?: string;
  num?: number;
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SERPAPI_KEY = Deno.env.get("SERPAPI_API_KEY");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  try {
    if (!SERPAPI_KEY) {
      return new Response(
        JSON.stringify({ error: "SERPAPI_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let body: ScanRequest = {};
    try { body = await req.json(); } catch (_) {}

    let { job_id, entity_name, query, client_id, search_engine = "google", num = 20 } = body;

    if (job_id) {
      const { data: job, error } = await supabase
        .from("requiem_jobs")
        .select("*")
        .eq("id", job_id)
        .maybeSingle();
      if (error || !job) {
        return new Response(JSON.stringify({ error: "Job not found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      entity_name = job.entity_name;
      query = job.query;
      client_id = job.client_id;
    } else {
      if (!entity_name || !query) {
        return new Response(JSON.stringify({ error: "entity_name and query required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: created, error: createErr } = await supabase
        .from("requiem_jobs")
        .insert({
          client_id: client_id ?? null,
          entity_name,
          query,
          status: "running",
          started_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (createErr) throw createErr;
      job_id = created.id;
    }

    await supabase
      .from("requiem_jobs")
      .update({ status: "running", started_at: new Date().toISOString() })
      .eq("id", job_id);

    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.set("engine", search_engine);
    url.searchParams.set("q", query!);
    url.searchParams.set("num", String(num));
    url.searchParams.set("api_key", SERPAPI_KEY);

    const serpRes = await fetch(url.toString());
    if (!serpRes.ok) {
      const txt = await serpRes.text();
      await supabase.from("requiem_jobs").update({
        status: "failed",
        error_message: `SerpApi ${serpRes.status}: ${txt.slice(0, 500)}`,
        completed_at: new Date().toISOString(),
      }).eq("id", job_id);
      return new Response(JSON.stringify({ error: "SerpApi request failed", status: serpRes.status }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const raw = await serpRes.json();
    const organic = Array.isArray(raw.organic_results) ? raw.organic_results : [];
    const parsed = organic.map((r: any, idx: number) => ({
      position: r.position ?? idx + 1,
      title: r.title,
      link: r.link,
      displayed_link: r.displayed_link,
      snippet: r.snippet,
      source: r.source,
      domain: (() => { try { return new URL(r.link).hostname; } catch { return null; } })(),
    }));

    const { data: snap, error: snapErr } = await supabase
      .from("requiem_serp_snapshots")
      .insert({
        job_id,
        query,
        search_engine,
        raw_response: raw,
        parsed_results: parsed,
        total_results: parsed.length,
      })
      .select()
      .single();
    if (snapErr) throw snapErr;

    // Mirror into scan_results (best-effort, tolerate schema diffs)
    if (parsed.length > 0) {
      try {
        await supabase.from("scan_results").insert(
          parsed.slice(0, num).map((p: any) => ({
            content: p.snippet ?? p.title ?? "",
            url: p.link,
            platform: p.domain ?? "google",
            severity: "low",
            status: "new",
            serpapi_query_id: raw.search_metadata?.id ?? null,
            rank_position: p.position,
          })),
        );
      } catch (_e) { /* tolerate */ }
    }

    await supabase
      .from("requiem_jobs")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        result_summary: {
          total_results: parsed.length,
          snapshot_id: snap.id,
          top_domains: [...new Set(parsed.slice(0, 10).map((p: any) => p.domain))].filter(Boolean),
        },
      })
      .eq("id", job_id);

    await supabase.from("ops_audit_log").insert({
      module: "requiem",
      action: "scan_completed",
      entity_type: "requiem_job",
      entity_id: job_id,
      details: { entity_name, query, results: parsed.length },
    });

    return new Response(
      JSON.stringify({ success: true, job_id, snapshot_id: snap.id, total_results: parsed.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("requiem-scan error", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
