#!/usr/bin/env node
/**
 * Verify that every suppression page exposes JSON-LD where Person.image
 * is an ImageObject with width=1920 and height=1080.
 *
 * Usage:
 *   node scripts/check-jsonld-images.mjs
 *   BASE_URL=https://aria-ops-ai.lovable.app node scripts/check-jsonld-images.mjs
 *
 * SPA caveat: Helmet injects <script type="application/ld+json"> client-side.
 * We try a static fetch first; if no JSON-LD blocks are present we fall back
 * to a headless render via Playwright (only required when --render is passed
 * or the env var RENDER=1 is set, so plain CI without Playwright still works).
 *
 * Exits non-zero on any structural mismatch (Person.image missing, not an
 * ImageObject, or wrong dimensions). Pages with NO JSON-LD found at all
 * produce a warning (so we don't break before the new build is published).
 */

const BASE_URL = (process.env.BASE_URL || 'https://www.ariaops.co.uk').replace(/\/$/, '');
const EXPECTED_W = 1920;
const EXPECTED_H = 1080;
const USE_RENDER = process.env.RENDER === '1' || process.argv.includes('--render');

const PAGES = [
  { path: '/simon-lindsay/ksl',                  image: '/og/simon-ksl.jpg' },
  { path: '/simon-lindsay/glasgow',              image: '/og/simon-glasgow.jpg' },
  { path: '/simon-lindsay/ksl-hair',             image: '/og/simon-ksl-hair.jpg' },
  { path: '/simon-lindsay/reviews',              image: '/og/simon-reviews.jpg' },
  { path: '/simon-lindsay/bankruptcy',           image: '/og/simon-bankruptcy.jpg' },
  { path: '/simon-lindsay/ksl-hair-complaints',  image: '/og/simon-ksl-hair-complaints.jpg' },
];

/** Extract every <script type="application/ld+json"> body from raw HTML. */
function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    try {
      blocks.push(JSON.parse(raw));
    } catch {
      // Some apps wrap in CDATA or have leading comments; try a salvage parse.
      try { blocks.push(JSON.parse(raw.replace(/^<!--|-->$/g, '').trim())); }
      catch { /* skip malformed */ }
    }
  }
  return blocks;
}

/** Walk a JSON-LD value (object, array, or @graph) and yield every node. */
function* walkNodes(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { for (const n of node) yield* walkNodes(n); return; }
  yield node;
  if (Array.isArray(node['@graph'])) for (const n of node['@graph']) yield* walkNodes(n);
}

function findPerson(blocks) {
  for (const block of blocks) {
    for (const node of walkNodes(block)) {
      const t = node['@type'];
      if (t === 'Person' || (Array.isArray(t) && t.includes('Person'))) return node;
    }
  }
  return null;
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'aria-jsonld-check/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function fetchRenderedHtml(url) {
  // Only loaded when needed so plain CI doesn't require Playwright.
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
    // Helmet typically injects within a tick of hydration.
    await page.waitForFunction(
      () => document.querySelectorAll('script[type="application/ld+json"]').length > 0,
      null,
      { timeout: 10_000 },
    ).catch(() => {});
    return await page.content();
  } finally {
    await browser.close();
  }
}

function validatePerson(person, expectedImageAbs) {
  const img = person.image;
  if (!img) return { ok: false, reason: 'Person.image missing' };
  if (typeof img === 'string') {
    return { ok: false, reason: `Person.image is a string ("${img}"), expected ImageObject` };
  }
  const t = img['@type'];
  const isImageObject = t === 'ImageObject' || (Array.isArray(t) && t.includes('ImageObject'));
  if (!isImageObject) return { ok: false, reason: `Person.image @type=${JSON.stringify(t)}, expected ImageObject` };

  const w = Number(img.width);
  const h = Number(img.height);
  if (w !== EXPECTED_W || h !== EXPECTED_H) {
    return { ok: false, reason: `width/height = ${w}x${h}, expected ${EXPECTED_W}x${EXPECTED_H}` };
  }
  const url = img.contentUrl || img.url;
  if (url && !url.endsWith(expectedImageAbs.replace(BASE_URL, '')) && url !== expectedImageAbs) {
    return { ok: false, reason: `contentUrl=${url}, expected ${expectedImageAbs}` };
  }
  return { ok: true, contentUrl: url, width: w, height: h };
}

const results = [];
let failures = 0;
let warnings = 0;

for (const { path, image } of PAGES) {
  const url = `${BASE_URL}${path}`;
  const expectedImageAbs = `${BASE_URL}${image}`;
  const row = { path };

  try {
    let html = await fetchHtml(url);
    let blocks = extractJsonLdBlocks(html);

    if (blocks.length === 0 && USE_RENDER) {
      row.rendered = true;
      html = await fetchRenderedHtml(url);
      blocks = extractJsonLdBlocks(html);
    }

    row.jsonLdBlocks = blocks.length;

    if (blocks.length === 0) {
      row.warning = 'No JSON-LD found (SPA — pass RENDER=1 to headless-render)';
      warnings += 1;
      results.push(row);
      continue;
    }

    const person = findPerson(blocks);
    if (!person) {
      row.error = 'No Person node in JSON-LD';
      failures += 1;
      results.push(row);
      continue;
    }

    const v = validatePerson(person, expectedImageAbs);
    if (!v.ok) {
      row.error = v.reason;
      failures += 1;
    } else {
      row.contentUrl = v.contentUrl;
      row.width = v.width;
      row.height = v.height;
    }
  } catch (e) {
    row.error = `Fetch failed: ${e.message}`;
    failures += 1;
  }

  results.push(row);
}

console.log(`JSON-LD ImageObject check against ${BASE_URL}${USE_RENDER ? ' (headless render enabled)' : ''}`);
console.table(results);

if (failures > 0) {
  console.error(`\n❌ ${failures} failure(s), ${warnings} warning(s)`);
  process.exit(1);
}
if (warnings > 0) {
  console.warn(`\n⚠️  ${warnings} warning(s) — re-run with RENDER=1 once Playwright is installed`);
} else {
  console.log(`\n✅ All Person.image entries are ImageObject @ ${EXPECTED_W}x${EXPECTED_H}`);
}
