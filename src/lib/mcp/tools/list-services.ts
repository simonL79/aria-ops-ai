import { defineTool } from "@lovable.dev/mcp-js";

const BASE_URL = "https://www.ariaops.co.uk";

const SERVICES: { name: string; path: string; description: string }[] = [
  { name: "AI Reputation Management", path: "/ai-reputation-management", description: "Manage how AI models and LLMs represent a person or brand." },
  { name: "Online Reputation Management (UK)", path: "/online-reputation-management-uk", description: "Full-service UK online reputation management." },
  { name: "Suppress Negative Google Results", path: "/suppress-negative-google-results", description: "Push down and suppress damaging Google search results." },
  { name: "Negative Search Result Suppression", path: "/negative-search-result-suppression", description: "Systematic suppression of negative search results." },
  { name: "Generative Engine Optimisation", path: "/generative-engine-optimisation", description: "Optimise visibility across generative AI search engines." },
  { name: "AI Search Visibility", path: "/ai-search-visibility", description: "Improve how entities appear in AI-powered search." },
  { name: "LLM Reputation Management", path: "/llm-reputation-management", description: "Correct and shape LLM outputs about an entity." },
  { name: "Executive Reputation Protection", path: "/executive-reputation-protection", description: "Reputation protection for senior executives." },
  { name: "Founder Reputation Protection", path: "/founder-reputation-protection", description: "Reputation protection for founders and entrepreneurs." },
  { name: "Athlete Reputation Management", path: "/athlete-reputation-management", description: "Reputation management for professional athletes." },
  { name: "Crisis Reputation Management", path: "/crisis-reputation-management", description: "Crisis PR and reputation response during active incidents." },
  { name: "Crisis Communications", path: "/crisis-communications", description: "Crisis communications strategy and execution." },
  { name: "Corporate Reputation Management", path: "/corporate-reputation-management", description: "Reputation management for companies and brands." },
  { name: "Personal Reputation Management", path: "/personal-reputation-management", description: "Reputation management for private individuals." },
  { name: "Online Reputation Repair", path: "/online-reputation-repair", description: "Repair damaged online reputations." },
  { name: "Legal Defence & Compliance", path: "/legal-defence-compliance", description: "Legal-led reputation defence and compliance support." },
  { name: "Remove Google Reviews", path: "/services/remove-google-reviews", description: "Remove fake or defamatory Google reviews." },
  { name: "Online Impersonation (UK)", path: "/services/online-impersonation-uk", description: "Tackle online impersonation and fake profiles." },
  { name: "Brand Protection", path: "/services/brand-protection", description: "Protect brand assets and identity online." },
  { name: "Legal Shield", path: "/services/legal-shield", description: "Legal escalation workflow for reputation threats." },
];

export default defineTool({
  name: "list_reputation_services",
  title: "List reputation services",
  description:
    "List the reputation management and crisis PR services offered by A.R.I.A / ariaops.co.uk, with a short description and a URL for each.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const services = SERVICES.map((s) => ({ ...s, url: `${BASE_URL}${s.path}` }));
    const text = services
      .map((s) => `- ${s.name}: ${s.description} (${s.url})`)
      .join("\n");
    return {
      content: [{ type: "text", text }],
      structuredContent: { services },
    };
  },
});
