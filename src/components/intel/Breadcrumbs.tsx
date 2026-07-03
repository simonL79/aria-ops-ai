import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  path: string;
}

interface IntelBreadcrumbsProps {
  crumbs: Crumb[];
  className?: string;
}

/** Intelligence-platform breadcrumb trail (visual; JSON-LD is emitted separately). */
export function IntelBreadcrumbs({ crumbs, className }: IntelBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-xs text-muted-foreground", className)}>
      <Link to="/" className="flex items-center gap-1 hover:text-foreground">
        <Home className="h-3.5 w-3.5" aria-hidden />
        <span className="sr-only">Home</span>
      </Link>
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={c.path} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
            {last ? (
              <span className="font-medium text-foreground" aria-current="page">
                {c.name}
              </span>
            ) : (
              <Link to={c.path} className="hover:text-foreground">
                {c.name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default IntelBreadcrumbs;
