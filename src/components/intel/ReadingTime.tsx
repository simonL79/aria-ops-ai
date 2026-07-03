import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { estimateReadingMinutes } from "./authority";

interface ReadingTimeProps {
  minutes?: number | null;
  text?: string | null;
  className?: string;
}

/** Compact reading-time indicator using intelligence terminology. */
export function ReadingTime({ minutes, text, className }: ReadingTimeProps) {
  const mins = estimateReadingMinutes(text, minutes);
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs text-muted-foreground", className)}>
      <Clock className="h-3.5 w-3.5" aria-hidden />
      {mins} min brief
    </span>
  );
}

export default ReadingTime;
