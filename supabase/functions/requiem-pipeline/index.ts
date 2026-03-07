import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { requireAdmin, isAuthenticated } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── Configuration ──────────────────────────────────────────
const AUTHORITY_WEIGHTS: Record<string, number> = {
  "bbc.co.uk": 1.0, "theguardian.com": 1.0, "itv.com": 0.9, "sky.com": 0.9,
  "independent.co.uk": 0.9, "dailymail.co.uk": 0.8, "mirror.co.uk": 0.8,
  "express.co.uk": 0.7, "metro.co.uk": 0.7, "reddit.com": 0.3, "facebook.com": 0.2,
};

const NEGATIVE_TERMS = new Set([
  "allegations", "accused", "bullying", "misconduct", "inappropriate", "sexual",
  "scandal", "investigation", "sacked", "axed", "complaints", "court", "trial",
]);

const PARA_SYNONYMS: Record<string, string> = {
  if: "whether", and: "&", the: "tha", is: "be",
};

// ── Helpers ────────────────────────────────────────────────
function domainWeight(url: string): number {
  try {
    const host = new URL(url).hostname.replace("www.", "");
    for (const [k, v] of Object.entries(AUTHORITY_WEIGHTS)) {
      if (host.includes(k)) return v;
    }
  } catch { /* ignore */ }
  return 0.5;
}

function isNegative(text: string): boolean {
  const lower = text.toLowerCase();
  return [...NEGATIVE_TERMS].some((t) => lower.includes(t));
}

function hashId(value: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  let hash = 0;
  for (const byte of data) {
    hash = ((hash << 5) - hash + byte) | 0;
  }
  return Math.abs(hash).toString(16).slice(0, 12);
}

function antiCorrelate(paragraphs: string[]): string[] {
  const shuffled = [...paragraphs].sort(() => Math.random() - 0.5);
  return shuffled.map((p) => {
    const words = p.split(" ");
    return words
      .map((w) => {
        const lw = w.toLowerCase();
        if (lw in PARA_SYNONYMS && Math.random() < 0.2) return PARA_SYNONYMS[lw];
        return w;
      })
      .join(" ");
  });
}

function randomName(): string {
  const firsts = ["James", "Sarah", "Michael", "Emma", "David", "Rachel", "Thomas", "Laura", "Daniel", "Sophie"];
  const lasts = ["Mitchell", "Carter", "Brooks", "Hayes", "Coleman", "Bennett", "Reed", "Phillips", "Foster", "Ward"];
  return `${firsts[Math.floor(Math.random() * firsts.length)]} ${lasts[Math.floor(Math.random() * lasts.length)]}`;
}

function randomTitle(wordCount = 7): string {
  const words = ["Digital", "Strategic", "Analysis", "Report", "Reputation", "Intelligence", "Media",
    "Brand", "Narrative", "Assessment", "Overview", "Insight", "Review", "Profile",
    "Framework", "Platform", "Coverage", "Monitoring", "Impact", "Protection"];
  const result: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    result.push(words[Math.floor(Math.random() * words.length)]);
  }
  return result.join(" ");
}

function randomDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * 30));
  return d.toLocaleDateString("en-GB", { month: "long", day: "numeric", year: "numeric" });
}

// ── Phase 1: RIE Scan ──────────────────────────────────────
async function rieScan(url: string) {
  console.log(`[RIE] Scanning: ${url}`);
  const resp = await fetch(url, {
    headers: { "User-Agent": "ARIA-Requiem-Scanner/1.0" },
  });
  if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
  const html = await resp.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  if (!doc) throw new Error("Parse failed");

  const title = doc.querySelector("title")?.textContent?.trim() || "Untitled";
  const paragraphs = Array.from(doc.querySelectorAll("p"))
    .map((p) => p.textContent?.trim() || "")
    .filter((t) => t.length > 40);

  const imgTag = doc.querySelector("img");
  let imageUrl = "";
  if (imgTag) {
    const src = imgTag.getAttribute("src");
    if (src) {
      try {
        imageUrl = new URL(src, url).href;
      } catch {
        imageUrl = src;
      }
    }
  }

  const contentText = paragraphs.join(" ");
  const negative = isNegative(title + " " + contentText);
  const authority = domainWeight(url);

  const entityIdentity = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: title,
    alternateName: [],
    description: "",
    sameAs: [],
    dateGenerated: new Date().toISOString(),
  };

  return { title, contentText, paragraphs, imageUrl, negative, authority, entityIdentity };
}

// ── Phase 2: Payload Generation ─────────────────────────────
function generatePayloads(
  scanResult: { title: string; paragraphs: string[]; imageUrl: string },
  variantCount: number,
  meshFilenames: string[]
) {
  const payloads: Array<{
    filename: string;
    title: string;
    authorName: string;
    pubDate: string;
    htmlContent: string;
    variantIndex: number;
  }> = [];

  const seenTitles = new Set<string>();

  for (let vi = 0; vi < variantCount; vi++) {
    const title = randomTitle(7);
    if (seenTitles.has(title)) continue;
    seenTitles.add(title);

    const author = randomName();
    const pubDate = randomDate();
    const distorted = antiCorrelate(scanResult.paragraphs);
    const filename = `${hashId(title + crypto.randomUUID())}.html`;
    meshFilenames.push(filename);

    const parts: string[] = [
      `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${title}</title></head><body>`,
      `<h1>${title}</h1><p>By ${author} on ${pubDate}</p>`,
    ];

    if (scanResult.imageUrl) {
      const alt = title.split(" ").slice(0, 3).join(" ");
      parts.push(`<img src="${scanResult.imageUrl}" alt="${alt}" loading="lazy" />`);
    }

    for (const p of distorted) {
      let line = `<p>${p}</p>`;
      const others = meshFilenames.filter((m) => m !== filename);
      if (others.length > 0 && Math.random() < 0.3) {
        const link = others[Math.floor(Math.random() * others.length)];
        line = `<p>${p} <a href="${link}">Read more</a></p>`;
      }
      parts.push(line);
    }

    parts.push("</body></html>");

    payloads.push({
      filename,
      title,
      authorName: author,
      pubDate,
      htmlContent: parts.join("\n"),
      variantIndex: vi,
    });
  }

  return payloads;
}

// ── Main Handler ────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const auth = await requireAdmin(req);
    if (!isAuthenticated(auth)) return auth;

    const { urls, variantCount = 20, jobId } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(
        JSON.stringify({ error: "urls array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Create or update job record
    let activeJobId = jobId;
    if (!activeJobId) {
      const { data: job, error: jobErr } = await adminClient
        .from("requiem_jobs")
        .insert({
          job_type: "full_pipeline",
          status: "scanning",
          urls,
          variant_count: variantCount,
          started_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (jobErr) throw jobErr;
      activeJobId = job.id;
    } else {
      await adminClient
        .from("requiem_jobs")
        .update({ status: "scanning", started_at: new Date().toISOString() })
        .eq("id", activeJobId);
    }

    // ── PHASE 1: RIE Scan ──
    console.log(`[REQUIEM] Phase 1 — Scanning ${urls.length} URLs`);
    const scanResults: any[] = [];
    for (const url of urls) {
      try {
        const result = await rieScan(url);
        const { data: scanRow } = await adminClient
          .from("requiem_scan_results")
          .insert({
            job_id: activeJobId,
            url,
            title: result.title,
            content_text: result.contentText.slice(0, 10000),
            is_negative: result.negative,
            authority_score: result.authority,
            entity_identity: result.entityIdentity,
            paragraphs: result.paragraphs.slice(0, 50),
            image_url: result.imageUrl,
          })
          .select("id")
          .single();

        scanResults.push({ ...result, id: scanRow?.id, url });
        console.log(`[RIE] ✅ ${result.title.slice(0, 60)} | neg=${result.negative} auth=${result.authority}`);
      } catch (e) {
        console.error(`[RIE] ❌ ${url}: ${e.message}`);
        scanResults.push({ url, error: e.message });
      }
    }

    await adminClient
      .from("requiem_jobs")
      .update({ status: "generating", scan_results: scanResults.map((s) => ({ url: s.url, title: s.title, negative: s.negative, authority: s.authority })) })
      .eq("id", activeJobId);

    // ── PHASE 2: Payload Generation ──
    console.log(`[REQUIEM] Phase 2 — Generating payloads (${variantCount} variants each)`);
    const meshFilenames: string[] = [];
    let totalPayloads = 0;

    for (const scan of scanResults) {
      if (scan.error || !scan.paragraphs || scan.paragraphs.length === 0) continue;

      const payloads = generatePayloads(scan, variantCount, meshFilenames);

      // Batch insert payloads
      const payloadRows = payloads.map((p) => ({
        job_id: activeJobId,
        scan_result_id: scan.id,
        filename: p.filename,
        title: p.title,
        author_name: p.authorName,
        pub_date: p.pubDate,
        html_content: p.htmlContent,
        variant_index: p.variantIndex,
      }));

      if (payloadRows.length > 0) {
        await adminClient.from("requiem_payloads").insert(payloadRows);
        totalPayloads += payloadRows.length;
      }
    }

    // ── Complete ──
    await adminClient
      .from("requiem_jobs")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        generated_pages: [{ total: totalPayloads, mesh_size: meshFilenames.length }],
      })
      .eq("id", activeJobId);

    console.log(`[REQUIEM] ✅ Pipeline complete — ${scanResults.length} scanned, ${totalPayloads} payloads generated`);

    return new Response(
      JSON.stringify({
        success: true,
        jobId: activeJobId,
        scanned: scanResults.length,
        payloadsGenerated: totalPayloads,
        meshSize: meshFilenames.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[REQUIEM] Pipeline error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Pipeline failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
