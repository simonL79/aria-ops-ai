import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listServicesTool from "./tools/list-services";
import estimateThreatScoreTool from "./tools/estimate-threat-score";
import searchBlogTool from "./tools/search-blog";

// The OAuth issuer must be the direct Supabase host, built from the project ref
// (inlined at build time, so this stays import-safe). Never derive it from
// SUPABASE_URL — a proxied host fails RFC 8414 issuer matching.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "ariaops-mcp",
  title: "A.R.I.A Reputation Intelligence MCP",
  version: "0.1.0",
  instructions:
    "Tools for A.R.I.A (ariaops.co.uk), a reputation intelligence and crisis PR platform. Use `list_reputation_services` to see available services, `estimate_reputation_threat_score` for an illustrative risk estimate for a name, and `search_blog_posts` to find published insight articles.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listServicesTool, estimateThreatScoreTool, searchBlogTool],
});
