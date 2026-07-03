// Intelligence Centre hub — /intelligence
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import SEO from "@/components/seo/SEO";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, FileText, FlaskConical, FolderOpen, Brain, Shield, Search as SearchIcon, AlertTriangle, Scan, Trophy, Rocket, Building, User } from "lucide-react";
import { getPublishedItems, getFeaturedItems, INTELLIGENCE_CATEGORIES, itemHref, type CategoryDef } from "@/lib/content/queries";
import type { ContentItem } from "@/lib/content/types";
import { RelatedIntel, IntelBreadcrumbs } from "@/components/intel";
import IntelSearch from "@/components/intel/IntelSearch";
import { organizationSchema, breadcrumbSchema } from "@/lib/schema";

const ICON_MAP: Record<string, React.ElementType> = {
  User, Trophy, Rocket, Building, Scan, Brain, AlertTriangle, Search: SearchIcon, Shield, BookOpen, FileText, FlaskConical, FolderOpen,
};

function CategoryCard({ cat }: { cat: CategoryDef }) {
  const Icon = ICON_MAP[cat.icon ?? ""] ?? Shield;
  return (
    <Link to={`/intelligence/${cat.slug}`} className="group">
      <Card className="flex h-full flex-col justify-between border-border bg-card/60 p-5 transition-colors hover:border-primary/50">
        <div>
          <Icon className="mb-3 h-6 w-6 text-primary" aria-hidden />
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary">{cat.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
        </div>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
          Explore <ArrowRight className="h-3 w-3" />
        </span>
      </Card>
    </Link>
  );
}

export default function IntelligenceHubPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [featured, setFeatured] = useState<ContentItem[]>([]);
  const [filtered, setFiltered] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [all, feat] = await Promise.all([getPublishedItems(100), getFeaturedItems(6)]);
      setItems(all);
      setFiltered(all);
      setFeatured(feat);
      setLoading(false);
    })();
  }, []);

  const crumbs = [{ name: "Intelligence Centre", path: "/intelligence" }];

  return (
    <PublicLayout>
      <SEO
        title="Intelligence Centre — A.R.I.A™"
        description="Operational intelligence on reputation threats, defence strategies and AI monitoring. Guides, reports, case files and research from the A.R.I.A analyst desk."
        path="/intelligence"
        jsonLd={[organizationSchema(), breadcrumbSchema(crumbs)]}
      />

      <main className="container mx-auto px-4 py-12 sm:py-16">
        <IntelBreadcrumbs crumbs={crumbs} className="mb-6" />

        <header className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl intel-headline">Intelligence Centre</h1>
          <p className="mt-3 text-lg text-muted-foreground intel-summary">
            Operational intelligence on reputation threats, defence strategies, and AI monitoring — curated by the A.R.I.A analyst desk.
          </p>
        </header>

        <IntelSearch items={items} onFilter={setFiltered} className="mb-10 max-w-2xl" />

        {/* Featured */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Featured Intelligence</h2>
            <RelatedIntel items={featured} title="" hrefFor={itemHref} />
          </section>
        )}

        {/* Categories grid */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Browse by Category</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INTELLIGENCE_CATEGORIES.map((cat) => (
              <CategoryCard key={cat.slug} cat={cat} />
            ))}
          </div>
        </section>

        {/* All items / filtered */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            {filtered.length === items.length ? "Latest Intelligence" : `Results (${filtered.length})`}
          </h2>
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground">No intelligence found. Adjust your search.</p>
          ) : (
            <RelatedIntel items={filtered.slice(0, 12)} title="" hrefFor={itemHref} />
          )}
        </section>
      </main>
    </PublicLayout>
  );
}
