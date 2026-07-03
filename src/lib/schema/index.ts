// JSON-LD schema builders for the A.R.I.A intelligence platform.
// These feed the existing `SEO` component's `jsonLd` prop.
// Domain constant kept in sync with src/components/seo/SEO.tsx.

import type { ContentItem, FaqItem, TaxonomyEntity } from "@/lib/content/types";

export const SITE_URL = "https://www.ariaops.co.uk";
export const ORG_NAME = "A.R.I.A™";

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG_NAME,
    url: SITE_URL,
    description:
      "A.R.I.A™ — operational AI Reputation Intelligence. Threat detection, monitoring and narrative defence for high-profile entities.",
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORG_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/intelligence?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export function faqSchema(faq: FaqItem[]) {
  if (!faq?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function personSchema(author: {
  name: string;
  slug?: string;
  title?: string | null;
  bio?: string | null;
  credentials?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.title ?? undefined,
    description: author.bio ?? undefined,
    knowsAbout: author.credentials?.length ? author.credentials : undefined,
    url: author.slug ? abs(`/intelligence/analyst/${author.slug}`) : undefined,
  };
}

export function speakableSchema(cssSelectors: string[] = [".intel-headline", ".intel-summary"]) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: { "@type": "SpeakableSpecification", cssSelector: cssSelectors },
  };
}

export function videoSchema(video: { name: string; description?: string; thumbnailUrl?: string; uploadDate?: string; contentUrl?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl ? [abs(video.thumbnailUrl)] : undefined,
    uploadDate: video.uploadDate,
    contentUrl: video.contentUrl ? abs(video.contentUrl) : undefined,
  };
}

/** Article or Report schema depending on the content type. */
export function contentItemSchema(item: ContentItem, path: string) {
  const isReport = item.type === "report" || item.type === "research" || item.type === "whitepaper";
  const base = {
    "@context": "https://schema.org",
    "@type": isReport ? "Report" : "Article",
    headline: item.title,
    description: item.excerpt ?? item.meta_description ?? undefined,
    image: item.cover_image ? abs(item.cover_image) : item.og_image ? abs(item.og_image) : undefined,
    datePublished: item.published_at ?? item.created_at,
    dateModified: item.updated_at,
    mainEntityOfPage: { "@type": "WebPage", "@id": abs(path) },
    author: item.author
      ? personSchema({
          name: item.author.name,
          slug: item.author.slug,
          title: item.author.title,
          bio: item.author.bio,
          credentials: item.author.credentials,
        })
      : { "@type": "Organization", name: ORG_NAME },
    publisher: {
      "@type": "Organization",
      name: ORG_NAME,
      url: SITE_URL,
    },
    keywords: item.tags?.length ? item.tags.join(", ") : undefined,
  };
  return base;
}

/** Compose all applicable schemas for a content item page. */
export function contentItemSchemaGraph(
  item: ContentItem,
  path: string,
  crumbs: { name: string; path: string }[],
) {
  const graph: object[] = [contentItemSchema(item, path), breadcrumbSchema(crumbs)];
  const faq = faqSchema(item.faq);
  if (faq) graph.push(faq);
  return graph;
}

/** Schema for a programmatic taxonomy landing page. */
export function taxonomySchema(entity: TaxonomyEntity, path: string, crumbs: { name: string; path: string }[]) {
  const graph: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: entity.meta_title ?? entity.name,
      description: entity.meta_description ?? entity.description ?? undefined,
      url: abs(path),
    },
    breadcrumbSchema(crumbs),
  ];
  const faq = faqSchema(entity.faq);
  if (faq) graph.push(faq);
  return graph;
}
