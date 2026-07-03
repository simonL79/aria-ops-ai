import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, Minus } from "lucide-react";

export interface SerpResult {
  position: number;
  title: string;
  url: string;
  snippet?: string;
  sentiment?: "positive" | "negative" | "neutral";
}

interface SerpSnapshotProps {
  query?: string;
  results?: SerpResult[];
  title?: string;
  className?: string;
}

const DEFAULT: SerpResult[] = [
  { position: 1, title: "Official profile — verified", url: "example.com/profile", sentiment: "positive", snippet: "Authoritative owned property ranking first." },
  { position: 2, title: "Industry interview", url: "press.example.com/interview", sentiment: "positive" },
  { position: 3, title: "Forum discussion thread", url: "forum.example.com/thread", sentiment: "negative", snippet: "Unverified allegations circulating." },
  { position: 4, title: "News coverage", url: "news.example.com/story", sentiment: "neutral" },
];

const SENT = {
  positive: { icon: ShieldCheck, cls: "text-emerald-400" },
  negative: { icon: ShieldAlert, cls: "text-red-400" },
  neutral: { icon: Minus, cls: "text-muted-foreground" },
};

/** Google SERP snapshot with per-result sentiment. */
export function SerpSnapshot({ query = "your name", results = DEFAULT, title = "SERP Snapshot", className }: SerpSnapshotProps) {
  return (
    <figure className={cn("rounded-lg border border-border bg-card/60 p-5", className)}>
      <figcaption className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</figcaption>
      <p className="mb-4 text-xs text-muted-foreground">Query: <span className="font-mono text-foreground">“{query}”</span></p>
      <ol className="space-y-3">
        {results.map((r) => {
          const s = SENT[r.sentiment ?? "neutral"];
          const Icon = s.icon;
          return (
            <li key={r.position} className="flex gap-3">
              <span className="mt-0.5 font-mono text-xs text-muted-foreground">#{r.position}</span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Icon className={cn("h-3.5 w-3.5 shrink-0", s.cls)} aria-hidden />
                  {r.title}
                </p>
                <p className="truncate text-xs text-emerald-500/70">{r.url}</p>
                {r.snippet ? <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{r.snippet}</p> : null}
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

export default SerpSnapshot;
