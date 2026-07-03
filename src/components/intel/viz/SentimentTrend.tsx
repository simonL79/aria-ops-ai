import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

export interface SentimentPoint {
  label: string;
  positive: number;
  negative: number;
  neutral?: number;
}

interface SentimentTrendProps {
  data?: SentimentPoint[];
  title?: string;
  className?: string;
}

const DEFAULT: SentimentPoint[] = [
  { label: "W1", positive: 40, negative: 45, neutral: 15 },
  { label: "W2", positive: 46, negative: 38, neutral: 16 },
  { label: "W3", positive: 52, negative: 32, neutral: 16 },
  { label: "W4", positive: 58, negative: 27, neutral: 15 },
  { label: "W5", positive: 63, negative: 22, neutral: 15 },
  { label: "W6", positive: 69, negative: 18, neutral: 13 },
];

/** Sentiment trend (positive vs negative) over time. */
export function SentimentTrend({ data = DEFAULT, title = "Sentiment Trend", className }: SentimentTrendProps) {
  return (
    <figure className={cn("rounded-lg border border-border bg-card/60 p-5", className)}>
      <figcaption className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</figcaption>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 18%)" />
            <XAxis dataKey="label" stroke="hsl(220 9% 60%)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(220 9% 60%)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(240 11% 9%)", border: "1px solid hsl(240 10% 18%)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "hsl(210 40% 98%)" }}
            />
            <Line type="monotone" dataKey="positive" stroke="hsl(150 60% 45%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="negative" stroke="hsl(0 72% 55%)" strokeWidth={2} dot={false} />
            {data.some((d) => d.neutral != null) ? (
              <Line type="monotone" dataKey="neutral" stroke="hsl(220 9% 60%)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}

export default SentimentTrend;
