// Intelligence category listing — /intelligence/:category
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import SEO from "@/components/seo/SEO";
import { getItemsByCategory, getCategoryDef, itemHref } from "@/lib/content/queries";
import type { ContentItem } from "@/lib/content/types";
import { RelatedIntel, IntelBreadcrumbs } from "@/components/intel";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function IntelligenceCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const catDef = getCategoryDef(category ?? "");
  const catName = catDef?.name ?? category ?? "Intelligence";
  const catDesc = catDef?.description ?? `Intelligence for ${category}`;

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    getItemsByCategory(category).then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [category]);

  const crumbs = [
    { name: "Intelligence Centre", path: "/intelligence" },
    { name: catName, path: `/intelligence/${category}` },
  ];

  return (
    <PublicLayout>
      <SEO
        title={`${catName} — A.R.I.A™`}
        description={catDesc}
        path={`/intelligence/${category}`}
        jsonLd={[organizationSchema(), breadcrumbSchema(crumbs)]}
      />

      <main className="container mx-auto px-4 py-12 sm:py-16">
        <IntelBreadcrumbs crumbs={crumbs} className="mb-6" />

        <Link to="/intelligence" className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Intelligence Centre
        </Link>

        <header className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{catName}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{catDesc}</p>
        </header>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-border bg-card/60 p-8 text-center">
            <p className="text-muted-foreground mb-4">No intelligence published yet for this category.</p>
            <Button asChild variant="outline">
              <Link to="/intelligence">Browse all Intelligence</Link>
            </Button>
          </div>
        ) : (
          <RelatedIntel items={items} title="" hrefFor={itemHref} />
        )}
      </main>
    </PublicLayout>
  );
}
