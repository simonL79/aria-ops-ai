import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const BASE_URL = "https://www.ariaops.co.uk";

/**
 * Deterministic, illustrative reputation threat score (0-100) for an entity
 * name. This mirrors the public lead-magnet "reputation threat score" on the
 * site: it is a simulated estimate for guidance, not a live OSINT scan.
 */
function scoreForName(name: string): number {
  const normalized = name.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) % 100000;
  }
  // Map into a realistic 22-88 band.
  return 22 + (hash % 67);
}

function band(score: number): { level: string; summary: string } {
  if (score >= 70) return { level: "High", summary: "Significant reputation exposure detected; proactive defence recommended." };
  if (score >= 45) return { level: "Moderate", summary: "Some reputation risk indicators present; monitoring advised." };
  return { level: "Low", summary: "Limited reputation risk indicators at this time." };
}

export default defineTool({
  name: "estimate_reputation_threat_score",
  title: "Estimate reputation threat score",
  description:
    "Return an illustrative reputation threat score (0-100) and risk band for a given person or brand name. This is a simulated estimate matching the public lead-magnet tool, not a live OSINT scan.",
  inputSchema: {
    entity_name: z.string().min(1).describe("The person or brand name to estimate a reputation threat score for."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ entity_name }) => {
    const score = scoreForName(entity_name);
    const { level, summary } = band(score);
    const text = `Reputation threat score for "${entity_name}": ${score}/100 (${level} risk). ${summary} Request a full scan at ${BASE_URL}/scan.`;
    return {
      content: [{ type: "text", text }],
      structuredContent: {
        entity_name,
        score,
        level,
        summary,
        scan_url: `${BASE_URL}/scan`,
        note: "Simulated estimate for guidance only; not a live intelligence scan.",
      },
    };
  },
});
