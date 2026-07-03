import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface AuthorityScoreProps {
  score?: number; // 0..100
  label?: string;
  title?: string;
  className?: string;
}

function scoreColor(v: number) {
  if (v >= 75) return "hsl(150 60% 45%)";
  if (v >= 50) return "hsl(45 90% 55%)";
  if (v >= 30) return "hsl(25 90% 55%)";
  return "hsl(0 72% 55%)";
}

/** Radial authority / confidence gauge. */
export function AuthorityScore({ score = 82, label = "Authority Score", title, className }: AuthorityScoreProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const data = [{ name: label, value: clamped, fill: scoreColor(clamped) }];
  return (
    <figure className={cn("flex flex-col items-center rounded-lg border border-border bg-card/60 p-5", className)}>
      {title ? (
        <figcaption className="mb-2 self-start text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</figcaption>
      ) : null}
      <div className="relative h-40 w-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="72%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background={{ fill: "hsl(240 10% 18%)" }} dataKey="value" cornerRadius={8} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">{clamped}</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">/ 100</span>
        </div>
      </div>
      <p className="mt-2 text-xs font-medium text-muted-foreground">{label}</p>
    </figure>
  );
}

export default AuthorityScore;
