import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.ariaops.co.uk";
/** Sitewide social preview used when a route does not supply its own image. Matches the fallback in index.html. */
const FALLBACK_IMAGE = `${SITE_URL}/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png`;
const FALLBACK_IMAGE_DIMS = { width: 1200, height: 630, type: "image/png" } as const;

interface SEOProps {
  title: string;
  description: string;
  /** Path beginning with `/` — used to build canonical and og:url. */
  path: string;
  /** When true, emits `noindex, nofollow`. Use for auth, portal-gates, unsubscribe. */
  noIndex?: boolean;
  ogType?: "website" | "article";
  /** Absolute or root-relative image URL for og:image / twitter:image. Falls back to the sitewide preview when omitted. */
  image?: string;
  /** og:image pixel width. Defaults to 1920 for a supplied image. */
  imageWidth?: number;
  /** og:image pixel height. Defaults to 1080 for a supplied image. */
  imageHeight?: number;
  /** og:image MIME type. Defaults to image/jpeg for a supplied image. */
  imageType?: string;
  /** Optional JSON-LD object(s) to inject. */
  jsonLd?: object | object[];
}

/**
 * Per-route SEO head. Overrides the static tags in index.html for JS-executing
 * crawlers. The static index.html tags carry data-rh="true" so react-helmet-async
 * replaces (rather than duplicates) them, while remaining the fallback that
 * non-JS social-preview crawlers read. og:image is always emitted (per-route
 * image or the sitewide fallback) so no stale duplicate is left behind.
 */
export function SEO({ title, description, path, noIndex, ogType = "website", image, imageWidth, imageHeight, imageType, jsonLd }: SEOProps) {
  const url = `${SITE_URL}${path}`;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const absImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`
    : FALLBACK_IMAGE;
  const imgWidth = image ? (imageWidth ?? 1920) : FALLBACK_IMAGE_DIMS.width;
  const imgHeight = image ? (imageHeight ?? 1080) : FALLBACK_IMAGE_DIMS.height;
  const imgType = image ? (imageType ?? "image/jpeg") : FALLBACK_IMAGE_DIMS.type;

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
      <meta property="og:image" content={absImage} />
      <meta property="og:image:width" content={String(imgWidth)} />
      <meta property="og:image:height" content={String(imgHeight)} />
      <meta property="og:image:type" content={imgType} />
      <meta property="og:image:alt" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={absImage} />
      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}
      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(block)}</script>
      ))}
    </Helmet>
  );
}

export default SEO;
