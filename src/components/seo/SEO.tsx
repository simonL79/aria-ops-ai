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
  /** Absolute or root-relative image URL for og:image / twitter:image. */
  image?: string;
  /** Optional JSON-LD object(s) to inject. */
  jsonLd?: object | object[];
}

/**
 * Per-route SEO head. Overrides the static tags in index.html for JS-executing
 * crawlers. Social-preview crawlers still see the index.html fallback.
 */
export function SEO({ title, description, path, noIndex, ogType = "website", image, jsonLd }: SEOProps) {
  const url = `${SITE_URL}${path}`;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const absImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`
    : undefined;

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
      {absImage ? <meta property="og:image" content={absImage} /> : null}
      {absImage ? <meta property="og:image:width" content="1920" /> : null}
      {absImage ? <meta property="og:image:height" content="1080" /> : null}
      {absImage ? <meta property="og:image:type" content="image/jpeg" /> : null}
      {absImage ? <meta property="og:image:alt" content={title} /> : null}
      {absImage ? <meta name="twitter:card" content="summary_large_image" /> : null}
      {absImage ? <meta name="twitter:image" content={absImage} /> : null}
      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}
      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(block)}</script>
      ))}
    </Helmet>
  );
}

export default SEO;
