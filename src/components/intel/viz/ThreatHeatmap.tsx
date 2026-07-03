import { cn } from "@/lib/utils";

export interface HeatCell {
  label: string;
  value: number; // 0..100
}
export interface HeatRow {
  label: string;
  cells: HeatCell[];
}

interface ThreatHeatmapProps {
  rows?: HeatRow[];
  columns?: string[];
  title?: string;
  className?: string;
}

const DEFAULT_COLUMNS = ["Search", "Social", "News", "AI", "Dark Web"];
const DEFAULT_ROWS: HeatRow[] = [
  { label: "Defamation", cells: [72, 40, 55, 30, 18].map((v, i) => ({ label: DEFAULT_COLUMNS[i], value: v })) },
  { label: "Impersonation", cells: [35, 68, 22, 51, 44].map((v, i) => ({ label: DEFAULT_COLUMNS[i], value: v })) },
  { label: "Deepfakes", cells: [20, 58, 30, 82, 25].map((v, i) => ({ label: DEFAULT_COLUMNS[i], value: v })) },
  { label: "Leaks", cells: [15, 33, 40, 20, 76].map((v, i) => ({ label: DEFAULT_COLUMNS[i], value: v })) },
];

function heatColor(v: number) {
  // violet → amber → red intensity ramp using inline hsl (data viz, not theme surfaces)
  if (v >= 75) return "hsl(0 72% 45% / 0.85)";
  if (v >= 55) return "hsl(25 90% 50% / 0.8)";
  if (v >= 35) return "hsl(45 90% 55% / 0.7)";
  if (v >= 18) return "hsl(258 60% 55% / 0.55)";
  return "hsl(240 15% 40% / 0.35)";
}

/** Reusable threat heatmap (threat category × surface). */
export function ThreatHeatmap({ rows = DEFAULT_ROWS, columns = DEFAULT_COLUMNS, title = "Threat Surface Heatmap", className }: ThreatHeatmapProps) {
  return (
    <figure className={cn("rounded-lg border border-border bg-card/60 p-5", className)}>
      <figcaption className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</figcaption>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th className="p-1 text-left font-medium text-muted-foreground" />
              {columns.map((c) => (
                <th key={c} className="p-1 text-center font-medium text-muted-foreground">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th className="whitespace-nowrap p-1 text-left font-medium text-foreground">{row.label}</th>
                {row.cells.map((cell, i) => (
                  <td key={i} className="p-0">
                    <div
                      className="flex h-9 items-center justify-center rounded font-mono text-[11px] font-semibold text-white"
                      style={{ backgroundColor: heatColor(cell.value) }}
                      title={`${row.label} · ${cell.label}: ${cell.value}`}
                    >
                      {cell.value}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

export default ThreatHeatmap;
