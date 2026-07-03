import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { threatMeta } from "./authority";
import { cn } from "@/lib/utils";
import { CONTENT_TYPE_LABELS, type ContentItem } from "@/lib/content/types";

interface RelatedIntelProps {
  items: ContentItem[];
  title?: string;
  className?: string;
  /** Builds the route for an item; defaults to the /intelligence renderer. */
  hrefFor?: (item: ContentItem) => string;
}

/** "Related intelligence" grid — the graph's onward links (no dead ends). */
export function RelatedIntel({
  items,
  title = "Connected Intelligence",
  className,
  hrefFor = (i) => `/intelligence/brief/${i.slug}`,
}: RelatedIntelProps) {
  if (!items?.length) return null;
  return (
    <section className={cn("", className)} aria-label={title}>
      <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const tm = threatMeta(item.threat_level);
          return (
            <Link key={item.id} to={hrefFor(item)} className="group">
              <Card className="flex h-full flex-col justify-between border-border bg-card/60 p-4 transition-colors hover:border-primary/50">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                      {CONTENT_TYPE_LABELS[item.type] ?? item.type}
                    </span>
                    <span className={cn("inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px]", tm.className)}>
                      <span className={cn("h-1 w-1 rounded-full", tm.dot)} />
                      {tm.label}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                    {item.title}
                  </h3>
                  {item.excerpt ? (
                    <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{item.excerpt}</p>
                  ) : null}
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  Open <ArrowUpRight className="h-3 w-3" aria-hidden />
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default RelatedIntel;
