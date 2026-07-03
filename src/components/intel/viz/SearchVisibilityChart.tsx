import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

export interface VisibilityPoint {
  label: string;
  visibility: number;
  threats?: number;
}

interface SearchVisibilityChartProps {
  data?: VisibilityPoint[];
  title?: string;
  className?: string;
}

const DEFAULT: VisibilityPoint[] = [
  { label: "Jan", visibility: 42, threats: 12 },
  { label: "Feb", visibility: 48, threats: 10 },
  { label: "Mar", visibility: 55, threats: 14 },
  { label: "Apr", visibility: 61, threats: 8 },
  { label: "May", visibility: 68, threats: 6 },
  { label: "Jun", visibility: 74, threats: 5 },
];

/** Search visibility over time with threat overlay. */
export function SearchVisibilityChart({ data = DEFAULT, title = "Search Visibility", className }: SearchVisibilityChartProps) {
  return (
    <figure className={cn("rounded-lg border border-border bg-card/60 p-5", className)}>
      <figcaption className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</figcaption>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="vis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(258 90% 66%)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(258 90% 66%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 18%)" />
            <XAxis dataKey="label" stroke="hsl(220 9% 60%)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(220 9% 60%)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(240 11% 9%)", border: "1px solid hsl(240 10% 18%)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "hsl(210 40% 98%)" }}
            />
            <Area type="monotone" dataKey="visibility" stroke="hsl(258 90% 66%)" strokeWidth={2} fill="url(#vis)" />
            <Area type="monotone" dataKey="threats" stroke="hsl(25 90% 55%)" strokeWidth={1.5} fillOpacity={0} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}

export default SearchVisibilityChart;
