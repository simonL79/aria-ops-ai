import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { KnowledgeGraph } from "@/lib/graph/resolver";

interface EntityGraphProps {
  graph?: KnowledgeGraph;
  title?: string;
  className?: string;
  height?: number;
}

const TYPE_COLOR: Record<string, string> = {
  guide: "hsl(258 90% 66%)",
  report: "hsl(200 80% 55%)",
  research: "hsl(280 70% 65%)",
  "case-study": "hsl(25 90% 55%)",
  tool: "hsl(150 60% 45%)",
  brief: "hsl(220 60% 60%)",
  whitepaper: "hsl(190 70% 55%)",
  download: "hsl(45 90% 55%)",
};

const DEFAULT_GRAPH: KnowledgeGraph = {
  nodes: [
    { id: "exec", label: "Executive Reputation", type: "guide" },
    { id: "deep", label: "Deepfakes", type: "brief" },
    { id: "serp", label: "Search Reputation", type: "guide" },
    { id: "def", label: "Defamation", type: "brief" },
    { id: "score", label: "Threat Score", type: "tool" },
    { id: "case", label: "Case File", type: "case-study" },
    { id: "report", label: "Annual Report", type: "report" },
  ],
  edges: [
    { source: "exec", target: "deep", relation: "related", weight: 3 },
    { source: "exec", target: "serp", relation: "related", weight: 4 },
    { source: "serp", target: "def", relation: "related", weight: 2 },
    { source: "exec", target: "score", relation: "tool", weight: 3 },
    { source: "exec", target: "case", relation: "example", weight: 2 },
    { source: "score", target: "report", relation: "report", weight: 1 },
    { source: "deep", target: "case", relation: "example", weight: 1 },
  ],
};

/** Lightweight SVG knowledge-graph renderer (circular layout, no deps). */
export function EntityGraph({ graph = DEFAULT_GRAPH, title = "Knowledge Graph", className, height = 320 }: EntityGraphProps) {
  const { nodes, positions, edges } = useMemo(() => {
    const cx = 50;
    const cy = 50;
    const r = 38;
    const n = graph.nodes.length || 1;
    const pos = new Map<string, { x: number; y: number }>();
    graph.nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      pos.set(node.id, { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    });
    return { nodes: graph.nodes, positions: pos, edges: graph.edges };
  }, [graph]);

  return (
    <figure className={cn("rounded-lg border border-border bg-card/60 p-5", className)}>
      <figcaption className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</figcaption>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height }} role="img" aria-label={title}>
        {edges.map((e, i) => {
          const a = positions.get(e.source);
          const b = positions.get(e.target);
          if (!a || !b) return null;
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="hsl(258 40% 55% / 0.4)"
              strokeWidth={Math.min(1.2, 0.3 + e.weight * 0.2)}
            />
          );
        })}
        {nodes.map((node) => {
          const p = positions.get(node.id);
          if (!p) return null;
          const color = TYPE_COLOR[node.type] ?? "hsl(258 90% 66%)";
          return (
            <g key={node.id}>
              <circle cx={p.x} cy={p.y} r={2.6} fill={color} stroke="hsl(240 11% 9%)" strokeWidth={0.5} />
              <text
                x={p.x}
                y={p.y - 4}
                textAnchor="middle"
                fontSize={2.6}
                fill="hsl(210 40% 98%)"
                style={{ pointerEvents: "none" }}
              >
                {node.label.length > 18 ? `${node.label.slice(0, 17)}…` : node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

export default EntityGraph;
