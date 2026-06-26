import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MAX_FILES = 10;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024; // ~20MB of decoded payload across all files
const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
];

type IncomingFile = {
  name?: string;
  type?: string;
  // base64 data URL: data:<mime>;base64,....
  dataUrl?: string;
};

const SYSTEM_PROMPT = `You are a paralegal assistant for ARIA Legal Shield.
You are given evidence files (screenshots, photos and PDFs of emails, messages, letters, contracts and invoices).
Your job is to read all visible text (OCR) and extract a chronological timeline of factual events.

Rules:
- Only include events that are clearly supported by the documents. Do not invent facts.
- Each event must have an ISO date (YYYY-MM-DD) when a date is visible or can be confidently inferred; if only a month/year is known use the first of the month; if no date at all, omit that event.
- Keep each "event" to one concise sentence describing what happened (who, what).
- Order events from earliest to latest.
- Return at most 25 events.
- Also return a short plain-text summary of all extracted text.

Respond with STRICT JSON only, no markdown, in this exact shape:
{"entries":[{"date":"YYYY-MM-DD","event":"..."}],"summary":"..."}`;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return jsonResponse({ error: "AI is not configured" }, 500);

    let payload: { files?: IncomingFile[] };
    try {
      payload = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid request body" }, 400);
    }

    const files = Array.isArray(payload.files) ? payload.files : [];
    if (files.length === 0) return jsonResponse({ error: "No files provided" }, 400);
    if (files.length > MAX_FILES) return jsonResponse({ error: `Up to ${MAX_FILES} files allowed` }, 400);

    let totalBytes = 0;
    const content: Array<Record<string, unknown>> = [
      {
        type: "text",
        text: "Extract all text and a chronological timeline of events from the following evidence files.",
      },
    ];

    for (const file of files) {
      const dataUrl = file.dataUrl ?? "";
      const type = file.type ?? "";
      if (!dataUrl.startsWith("data:")) continue;
      if (!ACCEPTED_TYPES.includes(type)) continue;

      // Rough size estimate from base64 length.
      const b64 = dataUrl.split(",")[1] ?? "";
      totalBytes += Math.floor((b64.length * 3) / 4);
      if (totalBytes > MAX_TOTAL_BYTES) {
        return jsonResponse({ error: "Total upload too large to analyse at once" }, 413);
      }

      if (type === "application/pdf") {
        content.push({
          type: "file",
          file: { filename: file.name || "evidence.pdf", file_data: dataUrl },
        });
      } else {
        content.push({ type: "image_url", image_url: { url: dataUrl } });
      }
    }

    if (content.length === 1) {
      return jsonResponse({ error: "No supported files to analyse" }, 400);
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) return jsonResponse({ error: "Too many requests. Please try again shortly." }, 429);
      if (status === 402) return jsonResponse({ error: "AI credits exhausted." }, 402);
      console.error("AI gateway error", status, await aiResponse.text());
      return jsonResponse({ error: "AI service unavailable" }, 502);
    }

    const data = await aiResponse.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";

    let parsed: { entries?: Array<{ date?: string; event?: string }>; summary?: string } = {};
    try {
      parsed = JSON.parse(typeof raw === "string" ? raw : JSON.stringify(raw));
    } catch {
      const match = typeof raw === "string" ? raw.match(/\{[\s\S]*\}/) : null;
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          parsed = {};
        }
      }
    }

    const entries = (parsed.entries ?? [])
      .map((e) => ({
        date: typeof e.date === "string" ? e.date.trim().slice(0, 10) : "",
        event: typeof e.event === "string" ? e.event.trim().slice(0, 300) : "",
      }))
      .filter((e) => e.event.length > 0)
      .slice(0, 25);

    return jsonResponse({
      entries,
      summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 4000) : "",
    });
  } catch (e) {
    console.error("extract-evidence-timeline error:", e);
    return jsonResponse({ error: "Unexpected error analysing evidence" }, 500);
  }
});
