import { cn } from "@/lib/utils";

export interface TimelineStage {
  label: string;
  detail?: string;
  timestamp?: string;
  status?: "complete" | "active" | "pending";
}

const DEFAULT_STAGES: TimelineStage[] = [
  { label: "Incident" },
  { label: "Detection" },
  { label: "Investigation" },
  { label: "Risk Score" },
  { label: "Mitigation" },
  { label: "Recovery" },
  { label: "Monitoring" },
];

interface IntelTimelineProps {
  stages?: TimelineStage[];
  title?: string;
  className?: string;
}

/**
 * Reusable, data-driven intelligence lifecycle timeline.
 * Defaults to the standard case-file lifecycle but accepts any stages.
 */
export function IntelTimeline({ stages = DEFAULT_STAGES, title = "Operational Lifecycle", className }: IntelTimelineProps) {
  return (
    <section className={cn("rounded-lg border border-border bg-card/60 p-5", className)} aria-label={title}>
      <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <ol className="relative space-y-6 border-l border-border pl-6">
        {stages.map((stage, i) => {
          const status = stage.status ?? "complete";
          return (
            <li key={`${stage.label}-${i}`} className="relative">
              <span
                className={cn(
                  "absolute -left-[27px] flex h-3.5 w-3.5 items-center justify-center rounded-full border-2",
                  status === "active" && "border-primary bg-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.2)]",
                  status === "complete" && "border-primary bg-primary/40",
                  status === "pending" && "border-border bg-background",
                )}
                aria-hidden
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="text-sm font-semibold text-foreground">
                  <span className="mr-2 text-xs font-mono text-primary/70">{String(i + 1).padStart(2, "0")}</span>
                  {stage.label}
                </p>
                {stage.timestamp ? (
                  <time className="text-xs font-mono text-muted-foreground">{stage.timestamp}</time>
                ) : null}
              </div>
              {stage.detail ? <p className="mt-1 text-sm text-muted-foreground">{stage.detail}</p> : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default IntelTimeline;
