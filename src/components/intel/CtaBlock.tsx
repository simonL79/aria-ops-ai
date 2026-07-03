import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CtaBlockProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

/** Contextual conversion block, styled as an operational callout. */
export function CtaBlock({
  title = "Request an Intelligence Assessment",
  description = "Get a confidential A.R.I.A assessment of your exposure across search, social and AI surfaces.",
  primaryLabel = "Request Assessment",
  primaryHref = "/intake",
  secondaryLabel,
  secondaryHref,
  className,
}: CtaBlockProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 to-card/60 p-6",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <p className="mb-5 max-w-2xl text-sm text-muted-foreground">{description}</p>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to={primaryHref}>
            {primaryLabel} <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
          </Link>
        </Button>
        {secondaryLabel && secondaryHref ? (
          <Button asChild variant="outline">
            <Link to={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}

export default CtaBlock;
