#!/usr/bin/env node
/**
 * Playwright head-tag test for /crisis-reputation-management.
 *
 * Renders the route with headless Chromium so react-helmet-async injects the
 * per-route <head> tags, then asserts the rendered canonical, OpenGraph and
 * Twitter tags exactly match the expected values from the page config
 * (src/pages/stealth/CrisisReputationManagementPage.tsx).
 *
 * The og:image / twitter:image content URL is bundler-dependent (Vite dev path
 * in preview, hashed /assets/*.png in production), so we assert those point at
 * the crisis OG asset by filename rather than a fixed absolute URL. Every other
 * tag is matched exactly.
 *
 * Usage:
 *   node scripts/test-crisis-head.mjs
 *   BASE_URL=http://localhost:8080 node scripts/test-crisis-head.mjs
 *   BASE_URL=https://www.ariaops.co.uk node scripts/test-crisis-head.mjs
 *
 * Exits non-zero on any assertion failure — drop-in for CI.
 */

import { chromium } from 'playwright';

const BASE_URL = (process.env.BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
const SITE_URL = 'https://www.ariaops.co.uk';
const PATH = '/crisis-reputation-management';

const TITLE = 'Crisis PR & Reputation Management | 24/7 | A.R.I.A™';
const DESCRIPTION =
  '24/7 operator-led crisis PR & reputation management. Live response across press, Google, AI search, social & legal for founders, executives & brands.';
const URL = `${SITE_URL}${PATH}`;
/** Substring the rendered og:image/twitter:image must contain (asset filename). */
const IMAGE_FILE = 'crisis-reputation-management';
const IMAGE_W = '1200';
const IMAGE_H = '630';
const IMAGE_TYPE = 'image/png';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 1800 } });
const page = await context.newPage();

const log = [];
const failures = [];

try {
  await page.goto(`${BASE_URL}${PATH}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });

  // Wait until Helmet has rewritten <title> to the per-route value.
  await page
    .waitForFunction((expected) => document.title === expected, TITLE, { timeout: 15_000 })
    .catch(() => {});

  const head = await page.evaluate(() => {
    const meta = (sel) => document.querySelector(sel)?.getAttribute('content') ?? null;
    return {
      title: document.title,
      description: meta('meta[name="description"]'),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
      ogTitle: meta('meta[property="og:title"]'),
      ogDescription: meta('meta[property="og:description"]'),
      ogUrl: meta('meta[property="og:url"]'),
      ogType: meta('meta[property="og:type"]'),
      ogImage: meta('meta[property="og:image"]'),
      ogImageW: meta('meta[property="og:image:width"]'),
      ogImageH: meta('meta[property="og:image:height"]'),
      ogImageType: meta('meta[property="og:image:type"]'),
      ogImageAlt: meta('meta[property="og:image:alt"]'),
      twitterCard: meta('meta[name="twitter:card"]'),
      twitterTitle: meta('meta[name="twitter:title"]'),
      twitterDescription: meta('meta[name="twitter:description"]'),
      twitterImage: meta('meta[name="twitter:image"]'),
    };
  });

  const check = (name, actual, expected) => {
    if (actual === expected) log.push(`✓ ${name} = ${actual}`);
    else failures.push(`${name}: got "${actual}" ≠ expected "${expected}"`);
  };
  const checkIncludes = (name, actual, needle) => {
    if (actual && actual.includes(needle)) log.push(`✓ ${name} contains "${needle}" (${actual})`);
    else failures.push(`${name}: "${actual}" does not contain "${needle}"`);
  };

  check('title', head.title, TITLE);
  check('description', head.description, DESCRIPTION);
  check('canonical', head.canonical, URL);
  check('og:title', head.ogTitle, TITLE);
  check('og:description', head.ogDescription, DESCRIPTION);
  check('og:url', head.ogUrl, URL);
  check('og:type', head.ogType, 'website');
  check('og:image:width', head.ogImageW, IMAGE_W);
  check('og:image:height', head.ogImageH, IMAGE_H);
  check('og:image:type', head.ogImageType, IMAGE_TYPE);
  check('og:image:alt', head.ogImageAlt, TITLE);
  checkIncludes('og:image', head.ogImage, IMAGE_FILE);
  check('twitter:card', head.twitterCard, 'summary_large_image');
  check('twitter:title', head.twitterTitle, TITLE);
  check('twitter:description', head.twitterDescription, DESCRIPTION);
  checkIncludes('twitter:image', head.twitterImage, IMAGE_FILE);

  // canonical and og:url must self-reference the route.
  assert(head.canonical === head.ogUrl, `canonical (${head.canonical}) ≠ og:url (${head.ogUrl})`);

  // No duplicate managed tags left behind by the static index.html fallback.
  const dupes = await page.evaluate(() => {
    const count = (sel) => document.querySelectorAll(sel).length;
    return {
      canonical: count('link[rel="canonical"]'),
      ogImage: count('meta[property="og:image"]'),
      twitterCard: count('meta[name="twitter:card"]'),
      ogTitle: count('meta[property="og:title"]'),
    };
  });
  for (const [tag, n] of Object.entries(dupes)) {
    if (n === 1) log.push(`✓ single ${tag} tag`);
    else failures.push(`${tag}: expected exactly 1 tag, found ${n}`);
  }
} catch (e) {
  failures.push(`Exception: ${e.message}`);
}

await browser.close();

console.log(`Crisis head-tag test against ${BASE_URL}${PATH}`);
for (const line of log) console.log('  ' + line);

if (process.env.GITHUB_ACTIONS === 'true') {
  for (const msg of failures) {
    console.log(
      `::error file=scripts/test-crisis-head.mjs,title=Crisis head-tag test::${msg.replace(/\r?\n/g, ' ')}`,
    );
  }
}

if (failures.length) {
  console.error(`\n❌ ${failures.length} assertion(s) failed:`);
  for (const msg of failures) console.error('  - ' + msg);
  process.exit(1);
}
console.log(`\n✅ All head tags on ${PATH} match expected values`);
