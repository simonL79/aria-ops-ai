import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const BASE_URL = "https://www.ariaops.co.uk";

// Import-safe: read env inside the handler, never at module top level.
function getSupabase() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase URL / publishable key not configured");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "search_blog_posts",
  title: "Search blog & insights",
  description:
    "Search the A.R.I.A / ariaops.co.uk published blog and insights articles about reputation management, crisis PR and AI search visibility. Returns matching article titles, summaries and URLs.",
  inputSchema: {
    query: z.string().min(1).describe("Keywords to search article titles and summaries for."),
    limit: z.number().int().min(1).max(20).optional().describe("Max results to return (default 5)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }) => {
    const max = limit ?? 5;
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("blog_posts")
        .select("title, slug, summary, canonical_url, published_at")
        .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
        .order("published_at", { ascending: false })
        .limit(max);

      if (error) {
        return { content: [{ type: "text", text: `Search failed: ${error.message}` }], isError: true };
      }

      const results = (data ?? []).map((p: any) => ({
        title: p.title,
        summary: p.summary,
        url: p.canonical_url || `${BASE_URL}/blog/${p.slug}`,
        published_at: p.published_at,
      }));

      if (results.length === 0) {
        return { content: [{ type: "text", text: `No articles found for "${query}".` }] };
      }

      const text = results
        .map((r: any) => `- ${r.title}: ${r.summary ?? ""} (${r.url})`)
        .join("\n");
      return { content: [{ type: "text", text }], structuredContent: { results } };
    } catch (e) {
      return {
        content: [{ type: "text", text: e instanceof Error ? e.message : "Unknown error" }],
        isError: true,
      };
    }
  },
});
