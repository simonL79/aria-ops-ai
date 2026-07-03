import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
  level?: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  title?: string;
  className?: string;
}

/** Scroll-spy table of contents for long intelligence documents. */
export function TableOfContents({ items, title = "On this page", className }: TableOfContentsProps) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav className={cn("text-sm", className)} aria-label={title}>
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <ul className="space-y-1.5 border-l border-border">
        {items.map((it) => (
          <li key={it.id} style={{ paddingLeft: `${(it.level ?? 2) - 1}rem` }}>
            <a
              href={`#${it.id}`}
              className={cn(
                "-ml-px block border-l-2 py-0.5 pl-3 transition-colors",
                active === it.id
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default TableOfContents;
