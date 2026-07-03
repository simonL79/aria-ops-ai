import { ShieldAlert, Activity, Gauge, CalendarClock, BadgeCheck, Eye } from "lucide-react";
import { threatMeta, formatDate } from "./authority";
import { cn } from "@/lib/utils";

interface AuthorityStripProps {
  threatLevel?: string | null;
  executiveRisk?: string | null;
  detectionConfidence?: number | null;
  updatedAt?: string | null;
  reviewed?: boolean;
  verified?: boolean;
  className?: string;
}

interface CellProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}

function Cell({ icon: Icon, label, value }: CellProps) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2">
      <Icon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

/**
 * Authority metadata strip — reinforces the "operational intelligence" framing.
 * Threat Level · Executive Risk · Detection Confidence · Updated · Reviewed · Verified.
 */
export function AuthorityStrip({
  threatLevel,
  executiveRisk,
  detectionConfidence,
  updatedAt,
  reviewed,
  verified,
  className,
}: AuthorityStripProps) {
  const tm = threatMeta(threatLevel);
  return (
    <div
      className={cn(
        "grid grid-cols-2 divide-x divide-y divide-border rounded-lg border border-border bg-card/60 backdrop-blur md:grid-cols-3 lg:grid-cols-6 lg:divide-y-0",
        className,
      )}
      role="group"
      aria-label="Intelligence authority metadata"
    >
      <div className="flex items-center gap-2.5 px-3 py-2">
        <ShieldAlert className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Threat Level</p>
          <span className={cn("mt-0.5 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold", tm.className)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", tm.dot)} />
            {tm.label}
          </span>
        </div>
      </div>
      <Cell icon={Activity} label="Executive Risk" value={executiveRisk ?? "Assessed"} />
      <Cell
        icon={Gauge}
        label="Detection Confidence"
        value={detectionConfidence != null ? `${detectionConfidence}%` : "—"}
      />
      <Cell icon={CalendarClock} label="Updated" value={formatDate(updatedAt)} />
      <Cell icon={BadgeCheck} label="Reviewed" value={reviewed ? "Yes" : "Pending"} />
      <Cell icon={Eye} label="Verified" value={verified ? "Verified" : "Unverified"} />
    </div>
  );
}

export default AuthorityStrip;
