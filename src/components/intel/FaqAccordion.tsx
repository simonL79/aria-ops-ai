import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/content/types";

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  className?: string;
}

/** FAQ accordion (JSON-LD FAQPage is emitted separately via the schema builder). */
export function FaqAccordion({ items, title = "Intelligence FAQ", className }: FaqAccordionProps) {
  if (!items?.length) return null;
  return (
    <section className={cn("", className)} aria-label={title}>
      <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
      <Accordion type="single" collapsible className="rounded-lg border border-border bg-card/60">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="px-4 last:border-b-0">
            <AccordionTrigger className="text-left text-sm font-medium">{item.question}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export default FaqAccordion;
