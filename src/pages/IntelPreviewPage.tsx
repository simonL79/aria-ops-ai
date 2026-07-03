import { SEO } from "@/components/seo/SEO";
import {
  AuthorityStrip,
  IntelTimeline,
  TableOfContents,
  IntelBreadcrumbs,
  AuthorByline,
  ReadingTime,
  SocialShare,
  FaqAccordion,
  RelatedIntel,
  NewsletterSignup,
  CtaBlock,
  ExpandableSection,
  StickySideNav,
  ThreatHeatmap,
  RiskMatrix,
  SearchVisibilityChart,
  SentimentTrend,
  AuthorityScore,
  SerpSnapshot,
  BrandExposureGraph,
  EntityGraph,
} from "@/components/intel";
import {
  organizationSchema,
  websiteSchema,
  contentItemSchemaGraph,
  taxonomySchema,
} from "@/lib/schema";
import type { ContentItem, TaxonomyEntity } from "@/lib/content/types";

const sampleItem: ContentItem = {
  id: "sample-1",
  slug: "executive-reputation-intelligence",
  type: "guide",
  category_id: null,
  author_id: null,
  title: "Executive Reputation Intelligence: A Field Manual",
  subtitle: "How A.R.I.A detects, scores and neutralises reputation threats",
  excerpt: "An operational overview of executive reputation threat detection and response.",
  body: "Sample body ".repeat(400),
  cover_image: null,
  status: "published",
  published_at: new Date().toISOString(),
  featured: true,
  threat_level: "high",
  executive_risk: "Elevated",
  detection_confidence: 92,
  reviewed: true,
  reviewed_at: new Date().toISOString(),
  verified: true,
  meta_title: null,
  meta_description: null,
  canonical_url: null,
  og_image: null,
  tags: ["executive", "deepfakes", "search"],
  sections: [],
  faq: [
    { question: "How do I remove defamatory search results?", answer: "Through a combination of legal action, de-indexing requests and suppression." },
    { question: "How does the Threat Score work?", answer: "It aggregates signals across search, social, news and AI surfaces into a 0–100 index." },
  ],
  references_list: [],
  downloads: [],
  stats: [],
  viz: [],
  reading_minutes: 8,
  view_count: 1200,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  author: {
    id: "a1",
    slug: "aria-desk",
    name: "A.R.I.A Intelligence Desk",
    title: "Reputation Intelligence Analysts",
    bio: "The A.R.I.A analyst team.",
    credentials: ["OSINT", "SIGINT"],
    avatar_url: null,
  },
};

const sampleTaxonomy: TaxonomyEntity = {
  id: "t1",
  slug: "healthcare",
  kind: "industry",
  name: "Healthcare",
  description: "Reputation intelligence for healthcare organisations.",
  overview: "Overview text.",
  common_risks: ["Malpractice narratives", "Review manipulation"],
  recommended_monitoring: ["Search", "Review platforms"],
  examples: [],
  faq: [{ question: "Is this GDPR compliant?", answer: "Yes." }],
  threat_level: "elevated",
  meta_title: "Healthcare Reputation Intelligence",
  meta_description: "Protect healthcare reputations.",
  published: true,
  sort_order: 0,
};

const crumbs = [
  { name: "Intelligence", path: "/intelligence" },
  { name: "Executive", path: "/intelligence/executive" },
  { name: sampleItem.title, path: `/intelligence/executive/${sampleItem.slug}` },
];

const toc = [
  { id: "s-authority", label: "Authority", level: 2 },
  { id: "s-timeline", label: "Timeline", level: 2 },
  { id: "s-viz", label: "Visualisations", level: 2 },
  { id: "s-faq", label: "FAQ", level: 2 },
];

// Validate schema builders produce output (logged for QA).
const schemaGraph = [
  organizationSchema(),
  websiteSchema(),
  ...contentItemSchemaGraph(sampleItem, `/intelligence/executive/${sampleItem.slug}`, crumbs),
  ...taxonomySchema(sampleTaxonomy, "/industries/healthcare", [{ name: "Industries", path: "/industries" }]),
];

export default function IntelPreviewPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <SEO title="Intel Component Preview" description="QA preview of the intelligence component kit" path="/intel-preview" noIndex jsonLd={schemaGraph} />

      <IntelBreadcrumbs crumbs={crumbs} className="mb-4" />
      <h1 className="intel-headline text-3xl font-bold text-foreground">{sampleItem.title}</h1>
      <p className="intel-summary mt-2 text-muted-foreground">{sampleItem.subtitle}</p>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <AuthorByline author={sampleItem.author} publishedAt={sampleItem.published_at} readingMinutes={sampleItem.reading_minutes} />
        <ReadingTime text={sampleItem.body} minutes={sampleItem.reading_minutes} />
        <SocialShare path={`/intelligence/executive/${sampleItem.slug}`} title={sampleItem.title} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_260px]">
        <div className="space-y-8">
          <section id="s-authority">
            <AuthorityStrip
              threatLevel={sampleItem.threat_level}
              executiveRisk={sampleItem.executive_risk}
              detectionConfidence={sampleItem.detection_confidence}
              updatedAt={sampleItem.updated_at}
              reviewed={sampleItem.reviewed}
              verified={sampleItem.verified}
            />
          </section>

          <section id="s-timeline">
            <IntelTimeline />
          </section>

          <section id="s-viz" className="grid gap-6 md:grid-cols-2">
            <ThreatHeatmap />
            <RiskMatrix />
            <SearchVisibilityChart />
            <SentimentTrend />
            <AuthorityScore title="Detection Confidence" score={92} />
            <SerpSnapshot />
            <BrandExposureGraph />
            <EntityGraph />
          </section>

          <ExpandableSection title="Methodology" defaultOpen>
            <p>How A.R.I.A scores threats across surfaces.</p>
          </ExpandableSection>

          <section id="s-faq">
            <FaqAccordion items={sampleItem.faq} />
          </section>

          <RelatedIntel items={[sampleItem, { ...sampleItem, id: "sample-2", title: "Deepfake Threat Landscape", threat_level: "critical" }]} />

          <CtaBlock secondaryLabel="Run Threat Score" secondaryHref="/tools" />
          <NewsletterSignup />
        </div>

        <StickySideNav>
          <TableOfContents items={toc} />
          <SocialShare path={`/intelligence/executive/${sampleItem.slug}`} title={sampleItem.title} className="flex-col items-start" />
        </StickySideNav>
      </div>
    </div>
  );
}
