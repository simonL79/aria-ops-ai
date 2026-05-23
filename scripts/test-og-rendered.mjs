#!/usr/bin/env node
/**
 * Strict OG image CI test.
 *
 * For each suppression page:
 *   1. Render with headless Chromium so Helmet-injected <meta> tags resolve.
 *   2. Read the live og:image and twitter:image content URLs.
 *   3. Assert they exactly match the expected /og/<slug>.jpg absolute URL.
 *   4. Fetch the image bytes and assert dimensions match the expected
 *      width/height advertised by og:image:width / og:image:height meta.
 *   5. Cross-check against the project-wide constants (1920x1080).
 *
 * Exits non-zero on any mismatch — drop-in for CI.
 *
 * Usage:
 *   node scripts/test-og-rendered.mjs
 *   BASE_URL=https://aria-ops-ai.lovable.app node scripts/test-og-rendered.mjs
 */

import { chromium } from 'playwright';

const BASE_URL = (process.env.BASE_URL || 'https://www.ariaops.co.uk').replace(/\/$/, '');
const EXPECTED_W = 1920;
const EXPECTED_H = 1080;

const PAGES = [
  { path: '/simon-lindsay/ksl',                  image: '/og/simon-ksl.jpg' },
  { path: '/simon-lindsay/glasgow',              image: '/og/simon-glasgow.jpg' },
  { path: '/simon-lindsay/ksl-hair',             image: '/og/simon-ksl-hair.jpg' },
  { path: '/simon-lindsay/reviews',              image: '/og/simon-reviews.jpg' },
  { path: '/simon-lindsay/bankruptcy',           image: '/og/simon-bankruptcy.jpg' },
  { path: '/simon-lindsay/ksl-hair-complaints',  image: '/og/simon-ksl-hair-complaints.jpg' },
];

/** Walk JPEG SOF markers for true pixel dimensions. */
function jpegDimensions(buf) {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  if (u8[0] !== 0xff || u8[1] !== 0xd8) throw new Error('Not a JPEG');
  let i = 2;
  while (i < u8.length) {
    if (u8[i] !== 0xff) throw new Error(`Bad marker at ${i}`);
    let marker = u8[i + 1]; i += 2;
    while (marker === 0xff) { marker = u8[i]; i += 1; }
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
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

async function fetchImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) throw new Error(`Non-image content-type: ${ct}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  return { ...jpegDimensions(buf), bytes: buf.length, contentType: ct };
}

async function readMetaFromPage(page, url, expectedAbs) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  // Wait until Helmet has rewritten og:image to the page-specific value (not
  // the sitewide default). Time out gracefully so we still capture whatever
  // is there for the report.
  await page.waitForFunction(
    (expected) => {
      const m = document.querySelector('meta[property="og:image"]');
      return m && m.getAttribute('content') === expected;
    },
    expectedAbs,
    { timeout: 10_000 },
  ).catch(() => {});

  return page.evaluate(() => {
    const get = (sel) => document.querySelector(sel)?.getAttribute('content') || null;
    return {
      ogImage:       get('meta[property="og:image"]'),
      ogImageW:      get('meta[property="og:image:width"]'),
      ogImageH:      get('meta[property="og:image:height"]'),
      ogImageType:   get('meta[property="og:image:type"]'),
      twitterImage:  get('meta[name="twitter:image"]'),
    };
  });
}

const browser = await chromium.launch();
const context = await browser.newContext({ userAgent: 'aria-og-ci/1.0' });
const page = await context.newPage();

const results = [];
let failures = 0;

for (const { path, image } of PAGES) {
  const url = `${BASE_URL}${path}`;
  const expectedAbs = `${BASE_URL}${image}`;
  const row = { path, expected: expectedAbs };
  const errors = [];

  try {
    const meta = await readMetaFromPage(page, url, expectedAbs);
    row.ogImage = meta.ogImage;
    row.twitterImage = meta.twitterImage;
    row.metaW = meta.ogImageW;
    row.metaH = meta.ogImageH;
    row.metaType = meta.ogImageType;

    if (meta.ogImage !== expectedAbs)
      errors.push(`og:image=${meta.ogImage} ≠ expected`);
    if (meta.twitterImage !== expectedAbs)
      errors.push(`twitter:image=${meta.twitterImage} ≠ expected`);
    if (Number(meta.ogImageW) !== EXPECTED_W)
      errors.push(`og:image:width=${meta.ogImageW} ≠ ${EXPECTED_W}`);
    if (Number(meta.ogImageH) !== EXPECTED_H)
      errors.push(`og:image:height=${meta.ogImageH} ≠ ${EXPECTED_H}`);
    if (meta.ogImageType && meta.ogImageType !== 'image/jpeg')
      errors.push(`og:image:type=${meta.ogImageType} ≠ image/jpeg`);

    // Compare meta dimensions to actual served file.
    const dims = await fetchImage(expectedAbs);
    row.fileW = dims.width;
    row.fileH = dims.height;
    row.fileBytes = dims.bytes;

    if (dims.width !== EXPECTED_W || dims.height !== EXPECTED_H)
      errors.push(`file=${dims.width}x${dims.height} ≠ ${EXPECTED_W}x${EXPECTED_H}`);
    if (Number(meta.ogImageW) !== dims.width || Number(meta.ogImageH) !== dims.height)
      errors.push(`meta(${meta.ogImageW}x${meta.ogImageH}) ≠ file(${dims.width}x${dims.height})`);
  } catch (e) {
    errors.push(`Exception: ${e.message}`);
  }

  if (errors.length) {
    row.errors = errors.join(' | ');
    failures += 1;
  }
  results.push(row);
}

await browser.close();

console.log(`Strict OG render test against ${BASE_URL}`);
console.table(results);

if (failures > 0) {
  console.error(`\n❌ ${failures} page(s) failed`);
  process.exit(1);
}
console.log(`\n✅ All ${PAGES.length} pages: rendered og:image matches expected URL and ${EXPECTED_W}x${EXPECTED_H} dimensions`);
