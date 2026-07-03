import { cn } from "@/lib/utils";

export interface RiskPoint {
  label: string;
  likelihood: number; // 1..5
  impact: number; // 1..5
}

interface RiskMatrixProps {
  points?: RiskPoint[];
  title?: string;
  className?: string;
}

const DEFAULT_POINTS: RiskPoint[] = [
  { label: "Defamatory search results", likelihood: 4, impact: 5 },
  { label: "Executive impersonation", likelihood: 3, impact: 4 },
  { label: "Deepfake media", likelihood: 2, impact: 5 },
  { label: "Negative press cycle", likelihood: 4, impact: 3 },
];

function cellColor(score: number) {
  if (score >= 20) return "hsl(0 72% 45% / 0.35)";
  if (score >= 12) return "hsl(25 90% 50% / 0.3)";
  if (score >= 6) return "hsl(45 90% 55% / 0.25)";
  return "hsl(150 60% 45% / 0.2)";
}

/** 5×5 likelihood/impact risk matrix with plotted risks. */
export function RiskMatrix({ points = DEFAULT_POINTS, title = "Risk Matrix", className }: RiskMatrixProps) {
  const rows = [5, 4, 3, 2, 1]; // impact top→bottom
  const cols = [1, 2, 3, 4, 5]; // likelihood left→right
  return (
    <figure className={cn("rounded-lg border border-border bg-card/60 p-5", className)}>
      <figcaption className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</figcaption>
      <div className="flex gap-2">
        <div className="flex items-center">
          <span className="rotate-180 text-[10px] font-medium uppercase tracking-wider text-muted-foreground [writing-mode:vertical-rl]">
            Impact →
          </span>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-5 gap-1">
            {rows.map((impact) =>
              cols.map((likelihood) => {
                const score = impact * likelihood;
                const here = points.filter((p) => p.impact === impact && p.likelihood === likelihood);
                return (
                  <div
                    key={`${impact}-${likelihood}`}
                    className="relative flex min-h-[52px] items-center justify-center rounded border border-border/50 p-1 text-center"
                    style={{ backgroundColor: cellColor(score) }}
                  >
                    {here.map((p) => (
                      <span key={p.label} className="text-[10px] font-semibold leading-tight text-foreground">
                        {p.label}
                      </span>
                    ))}
                  </div>
                );
              }),
            )}
          </div>
          <p className="mt-2 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Likelihood →</p>
        </div>
      </div>
    </figure>
  );
}

export default RiskMatrix;
