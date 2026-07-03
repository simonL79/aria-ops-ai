// Intelligence item renderer — /intelligence/:category/:slug
import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import SEO from "@/components/seo/SEO";
import { getItemBySlug, getCategoryDef, itemHref, formatBucketSlug } from "@/lib/content/queries";
import { getRelatedIntel } from "@/lib/graph/resolver";
import type { ContentItem, ContentSection } from "@/lib/content/types";
import { CONTENT_TYPE_LABELS, CONTENT_TYPE_CTA } from "@/lib/content/types";
import {
  AuthorityStrip,
  IntelBreadcrumbs,
  AuthorByline,
  ReadingTime,
  SocialShare,
  FaqAccordion,
  RelatedIntel,
  NewsletterSignup,
  CtaBlock,
  TableOfContents,
  ExpandableSection,
} from "@/components/intel";
import { contentItemSchemaGraph } from "@/lib/schema";
import { ArrowLeft } from "lucide-react";

function BodySection({ section }: { section: ContentSection }) {
  const Tag = section.level === 3 ? "h3" : "h2";
  return (
    <section id={section.id ?? section.heading.toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-24">
      <Tag className="mb-3 text-xl font-semibold text-foreground">{section.heading}</Tag>
      {section.body && <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: section.body }} />}
    </section>
  );
}

export default function IntelligenceItemPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const location = useLocation();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [related, setRelated] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    (async () => {
      const fetched = await getItemBySlug(slug);
      setItem(fetched);
      if (fetched) {
        const rel = await getRelatedIntel(fetched, 6);
        setRelated(rel);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <PublicLayout>
        <main className="container mx-auto px-4 py-16 text-muted-foreground">Loading intelligence…</main>
      </PublicLayout>
    );
  }

  if (!item) {
    return (
      <PublicLayout>
        <SEO title="Not Found — A.R.I.A™" description="Intelligence brief not found." path={location.pathname} noIndex />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Intelligence Not Found</h1>
          <Link to="/intelligence" className="text-primary hover:underline">Return to Intelligence Centre</Link>
        </main>
      </PublicLayout>
    );
  }

  const catDef = getCategoryDef(category ?? "") ?? getCategoryDef(formatBucketSlug(item.type));
  const catName = catDef?.name ?? item.category?.name ?? "Intelligence";
  const catSlug = item.category?.slug ?? formatBucketSlug(item.type);
  const path = `/intelligence/${catSlug}/${item.slug}`;

  const crumbs = [
    { name: "Intelligence Centre", path: "/intelligence" },
    { name: catName, path: `/intelligence/${catSlug}` },
    { name: item.title, path },
  ];

  const tocItems = item.sections?.map((s) => ({
    id: s.id ?? s.heading.toLowerCase().replace(/\s+/g, "-"),
    label: s.heading,
    level: s.level ?? 2,
  })) ?? [];

  const typeLabel = CONTENT_TYPE_LABELS[item.type] ?? item.type;

  return (
    <PublicLayout>
      <SEO
        title={item.meta_title ?? `${item.title} — A.R.I.A™`}
        description={item.meta_description ?? item.excerpt ?? "Intelligence from A.R.I.A"}
        path={path}
        ogType="article"
        image={item.og_image ?? item.cover_image ?? undefined}
        jsonLd={contentItemSchemaGraph(item, path, crumbs)}
      />

      <main className="container mx-auto px-4 py-12 sm:py-16">
        <IntelBreadcrumbs crumbs={crumbs} className="mb-6" />

        <Link to={`/intelligence/${catSlug}`} className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to {catName}
        </Link>

        {/* Header */}
        <header className="mb-8 max-w-3xl">
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-primary/80">
            {typeLabel}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl intel-headline">{item.title}</h1>
          {item.subtitle && <p className="mt-2 text-lg text-muted-foreground">{item.subtitle}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {item.author && <AuthorByline author={item.author} />}
            <ReadingTime text={item.body} minutes={item.reading_minutes} />
          </div>
        </header>

        <AuthorityStrip
          threatLevel={item.threat_level}
          executiveRisk={item.executive_risk}
          detectionConfidence={item.detection_confidence}
          updatedAt={item.updated_at}
          reviewed={item.reviewed}
          verified={item.verified}
          className="mb-10"
        />

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          {/* Main content */}
          <article className="prose prose-invert max-w-none">
            {item.excerpt && <p className="lead text-lg text-muted-foreground intel-summary">{item.excerpt}</p>}

            {item.cover_image && (
              <img src={item.cover_image} alt="" className="my-6 rounded-lg border border-border" loading="lazy" />
            )}

            {item.sections?.map((s, i) => <BodySection key={i} section={s} />)}

            {item.body && !item.sections?.length && (
              <div dangerouslySetInnerHTML={{ __html: item.body }} />
            )}

            {item.faq?.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-4 text-xl font-semibold text-foreground">Frequently Asked Questions</h2>
                <FaqAccordion items={item.faq} />
              </section>
            )}
          </article>

          {/* Sidebar */}
          <aside className="mt-10 lg:mt-0">
            {tocItems.length > 0 && <TableOfContents items={tocItems} className="mb-8 sticky top-24" />}
            <SocialShare path={path} title={item.title} className="mb-8" />
            <NewsletterSignup className="mb-8" />
            <CtaBlock title="Need tailored intelligence?" description="Request a bespoke briefing from the A.R.I.A analyst desk." primaryLabel="Request Briefing" primaryHref="/secure-intake" />
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <RelatedIntel items={related} title="Connected Intelligence" hrefFor={itemHref} className="mt-16" />
        )}
      </main>
    </PublicLayout>
  );
}
