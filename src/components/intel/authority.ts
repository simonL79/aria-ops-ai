// Presentation helpers for intelligence-platform authority metadata.
import type { ThreatLevel } from "@/lib/content/types";

export interface ThreatMeta {
  label: string;
  /** Tailwind classes using semantic tokens / theme palette. */
  className: string;
  dot: string;
}

const MAP: Record<string, ThreatMeta> = {
  critical: { label: "Critical", className: "border-red-500/40 bg-red-500/10 text-red-300", dot: "bg-red-500" },
  high: { label: "High", className: "border-amber-500/40 bg-amber-500/10 text-amber-300", dot: "bg-amber-500" },
  elevated: { label: "Elevated", className: "border-orange-500/40 bg-orange-500/10 text-orange-300", dot: "bg-orange-500" },
  moderate: { label: "Moderate", className: "border-yellow-500/40 bg-yellow-500/10 text-yellow-200", dot: "bg-yellow-400" },
  low: { label: "Low", className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300", dot: "bg-emerald-500" },
  informational: { label: "Informational", className: "border-sky-500/40 bg-sky-500/10 text-sky-300", dot: "bg-sky-400" },
};

export function threatMeta(level?: ThreatLevel | string | null): ThreatMeta {
  const key = (level ?? "informational").toString().toLowerCase();
  return MAP[key] ?? MAP.informational;
}

export function formatDate(value?: string | null): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
}

export function estimateReadingMinutes(text?: string | null, explicit?: number | null): number {
  if (explicit && explicit > 0) return explicit;
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
