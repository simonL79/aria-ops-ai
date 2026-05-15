import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.ariaops.co.uk";

interface SEOProps {
  title: string;
  description: string;
  /** Path beginning with `/` — used to build canonical and og:url. */
  path: string;
  /** When true, emits `noindex, nofollow`. Use for auth, portal-gates, unsubscribe. */
  noIndex?: boolean;
  ogType?: "website" | "article";
  /** Optional JSON-LD object(s) to inject. */
  jsonLd?: object | object[];
}

/**
 * Per-route SEO head. Overrides the static tags in index.html for JS-executing
 * crawlers. Social-preview crawlers still see the index.html fallback.
 */
export function SEO({ title, description, path, noIndex, ogType = "website", jsonLd }: SEOProps) {
  const url = `${SITE_URL}${path}`;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}
      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(block)}</script>
      ))}
    </Helmet>
  );
}

export default SEO;
