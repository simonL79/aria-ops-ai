import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

export interface ExposurePoint {
  label: string;
  owned: number;
  earned: number;
  hostile: number;
}

interface BrandExposureGraphProps {
  data?: ExposurePoint[];
  title?: string;
  className?: string;
}

const DEFAULT: ExposurePoint[] = [
  { label: "Search", owned: 55, earned: 30, hostile: 15 },
  { label: "Social", owned: 40, earned: 38, hostile: 22 },
  { label: "News", owned: 25, earned: 60, hostile: 15 },
  { label: "AI Answers", owned: 48, earned: 34, hostile: 18 },
];

/** Stacked brand-exposure composition per surface (owned / earned / hostile). */
export function BrandExposureGraph({ data = DEFAULT, title = "Brand Exposure", className }: BrandExposureGraphProps) {
  return (
    <figure className={cn("rounded-lg border border-border bg-card/60 p-5", className)}>
      <figcaption className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</figcaption>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 18%)" />
            <XAxis dataKey="label" stroke="hsl(220 9% 60%)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(220 9% 60%)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(240 11% 9%)", border: "1px solid hsl(240 10% 18%)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "hsl(210 40% 98%)" }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="owned" stackId="a" fill="hsl(258 90% 66%)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="earned" stackId="a" fill="hsl(200 80% 55%)" />
            <Bar dataKey="hostile" stackId="a" fill="hsl(0 72% 55%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}

export default BrandExposureGraph;
