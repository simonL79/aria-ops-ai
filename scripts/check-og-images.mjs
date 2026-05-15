#!/usr/bin/env node
/**
 * Verify that every suppression page serves the correct hero image
 * via og:image and twitter:image, and that the image is 1600x896.
 *
 * Usage:
 *   node scripts/check-og-images.mjs            # against production
 *   BASE_URL=https://preview... node scripts/check-og-images.mjs
 *
 * Strategy:
 *  1. Render each page with a headless browser (Helmet sets meta after hydration).
 *     We use a lightweight approach: fetch the SPA HTML, then for each expected
 *     image URL fetch the image bytes and parse JPEG SOF for width/height.
 *  2. Also assert the public OG copy exists at /og/<slug>.jpg.
 *
 * Exits non-zero on any mismatch so CI fails loudly.
 */

const BASE_URL = (process.env.BASE_URL || 'https://www.ariaops.co.uk').replace(/\/$/, '');
const EXPECTED_W = 1600;
const EXPECTED_H = 896;

const PAGES = [
  { path: '/simon-lindsay/ksl',                  image: '/og/simon-ksl.jpg' },
  { path: '/simon-lindsay/glasgow',              image: '/og/simon-glasgow.jpg' },
  { path: '/simon-lindsay/ksl-hair',             image: '/og/simon-ksl-hair.jpg' },
  { path: '/simon-lindsay/reviews',              image: '/og/simon-reviews.jpg' },
  { path: '/simon-lindsay/bankruptcy',           image: '/og/simon-bankruptcy.jpg' },
  { path: '/simon-lindsay/ksl-hair-complaints',  image: '/og/simon-ksl-hair-complaints.jpg' },
];

/** Parse JPEG dimensions from a Buffer/Uint8Array by walking SOF markers. */
function jpegDimensions(buf) {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  if (u8[0] !== 0xff || u8[1] !== 0xd8) throw new Error('Not a JPEG');
  let i = 2;
  while (i < u8.length) {
    if (u8[i] !== 0xff) throw new Error(`Bad marker at ${i}`);
    let marker = u8[i + 1];
    i += 2;
    while (marker === 0xff) { marker = u8[i]; i += 1; }
    // SOF markers (skip DHT/DAC/DRI/etc.). Avoid 0xC4/0xC8/0xCC.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      // segment length (2 bytes), precision (1), height (2), width (2)
      const height = (u8[i + 3] << 8) | u8[i + 4];
      const width  = (u8[i + 5] << 8) | u8[i + 6];
      return { width, height };
    }
    const segLen = (u8[i] << 8) | u8[i + 1];
    if (!segLen) throw new Error('Zero segment length');
    i += segLen;
  }
  throw new Error('No SOF marker found');
}

async function fetchImageDims(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) throw new Error(`Non-image content-type: ${ct}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  return { ...jpegDimensions(buf), bytes: buf.length, contentType: ct };
}

/**
 * Pull og:image / twitter:image out of rendered HTML.
 * Helmet writes these client-side, so for SPA hosts the static HTML may only
 * contain sitewide defaults. We still assert any meta we can see is a valid
 * absolute URL pointing at the project domain.
 */
function extractMeta(html) {
  const find = (re) => {
    const m = html.match(re);
    return m ? m[1] : null;
  };
  return {
    ogImage:      find(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i),
    twitterImage: find(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i),
  };
}

const results = [];
let failures = 0;

for (const { path, image } of PAGES) {
  const expectedAbs = `${BASE_URL}${image}`;
  const row = { path, expected: expectedAbs };

  try {
    const dims = await fetchImageDims(expectedAbs);
    row.imageWidth  = dims.width;
    row.imageHeight = dims.height;
    row.imageBytes  = dims.bytes;
    if (dims.width !== EXPECTED_W || dims.height !== EXPECTED_H) {
      row.imageError = `Expected ${EXPECTED_W}x${EXPECTED_H}, got ${dims.width}x${dims.height}`;
      failures += 1;
    }
  } catch (e) {
    row.imageError = `Image fetch failed: ${e.message}`;
    failures += 1;
  }

  try {
    const pageRes = await fetch(`${BASE_URL}${path}`);
    const html = await pageRes.text();
    const meta = extractMeta(html);
    row.htmlOgImage      = meta.ogImage;
    row.htmlTwitterImage = meta.twitterImage;
    // SPA caveat: only flag if a meta is present AND wrong.
    for (const [tag, val] of [['og:image', meta.ogImage], ['twitter:image', meta.twitterImage]]) {
      if (val && val !== expectedAbs) {
        // Sitewide default is acceptable on the static shell; only fail if the
        // URL is on our domain and points at a different /og/ image.
        if (val.startsWith(BASE_URL) && val.includes('/og/') && val !== expectedAbs) {
          row[`${tag}Error`] = `Got ${val}, expected ${expectedAbs}`;
          failures += 1;
        }
      }
    }
  } catch (e) {
    row.htmlError = `Page fetch failed: ${e.message}`;
    failures += 1;
  }

  results.push(row);
}

console.log(`OG image check against ${BASE_URL}`);
console.table(results);

if (failures > 0) {
  console.error(`\n❌ ${failures} failure(s)`);
  process.exit(1);
}
console.log('\n✅ All hero images present at 1600x896');
