import { defineMcp } from "@lovable.dev/mcp-js";
import listServicesTool from "./tools/list-services";
import estimateThreatScoreTool from "./tools/estimate-threat-score";
import searchBlogTool from "./tools/search-blog";

export default defineMcp({
  name: "ariaops-mcp",
  title: "A.R.I.A Reputation Intelligence MCP",
  version: "0.1.0",
  instructions:
    "Tools for A.R.I.A (ariaops.co.uk), a reputation intelligence and crisis PR platform. Use `list_reputation_services` to see available services, `estimate_reputation_threat_score` for an illustrative risk estimate for a name, and `search_blog_posts` to find published insight articles.",
  tools: [listServicesTool, estimateThreatScoreTool, searchBlogTool],
});
