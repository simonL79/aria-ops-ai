#!/usr/bin/env node
/**
 * Poll the production site until the latest SEO build is detectably
 * live across EVERY tracked suppression page — i.e. the rendered
 * <meta property="og:image"> on each page points at its
 * page-specific /og/<slug>.jpg hero (not the legacy
 * /lovable-uploads/*.png fallback).
 *
 * Uses Playwright (chromium) so we read the post-hydration DOM, the
 * same way Googlebot's rendering pipeline does. A page is considered
 * "live" once it matches; matched pages are skipped on subsequent
 * polls so we converge on the slowest CDN edge. Exits 0 once all
 * pages match, non-zero on timeout.
 *
 *   BASE_URL=https://www.ariaops.co.uk \
 *   TIMEOUT_MS=1800000 \
 *   node scripts/wait-for-deploy.mjs
 */
import { chromium } from 'playwright';

const BASE = (process.env.BASE_URL || 'https://www.ariaops.co.uk').replace(/\/$/, '');
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 30 * 60 * 1000); // 30 min
const INTERVAL_MS = Number(process.env.INTERVAL_MS || 30 * 1000);    // 30 s

const PROBES = [
  { path: '/simon-lindsay/ksl',                 slug: 'simon-ksl' },
  { path: '/simon-lindsay/glasgow',             slug: 'simon-glasgow' },
  { path: '/simon-lindsay/ksl-hair',            slug: 'simon-ksl-hair' },
  { path: '/simon-lindsay/reviews',             slug: 'simon-reviews' },
  { path: '/simon-lindsay/bankruptcy',          slug: 'simon-bankruptcy' },
  { path: '/simon-lindsay/ksl-hair-complaints', slug: 'simon-ksl-hair-complaints' },
].map((p) => ({ ...p, expected: `${BASE}/og/${p.slug}.jpg` }));

async function readOg(browser, path) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  try {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 60_000 });
    // Helmet may swap tags after hydration — wait a beat.
    await page.waitForTimeout(2000);
    const og = await page.locator('meta[property="og:image"]').first().getAttribute('content');
    return og || '';
  } finally {
    await ctx.close();
  }
}

const start = Date.now();
const browser = await chromium.launch();
const pending = new Map(PROBES.map((p) => [p.path, p]));
const lastSeen = new Map(); // path -> last og:image observed
let attempt = 0;
try {
  while (Date.now() - start < TIMEOUT_MS && pending.size > 0) {
    attempt += 1;
    console.log(`\n— attempt ${attempt} (${pending.size} pending / ${PROBES.length}) —`);
    for (const probe of [...pending.values()]) {
      try {
        const og = await readOg(browser, probe.path);
        lastSeen.set(probe.path, og);
        const ok = og === probe.expected;
        console.log(`  ${ok ? '✅' : '…'} ${probe.path} → ${og || '(empty)'}`);
        if (ok) pending.delete(probe.path);
      } catch (e) {
        console.log(`  ⚠ ${probe.path} probe error: ${e.message}`);
      }
    }
    if (pending.size === 0) {
      console.log(`\n✅ all ${PROBES.length} pages live after ${Math.round((Date.now() - start) / 1000)}s`);
      process.exit(0);
    }
    await new Promise((r) => setTimeout(r, INTERVAL_MS));
  }
  console.error(`\n❌ timed out after ${Math.round(TIMEOUT_MS / 1000)}s — ${pending.size} page(s) still stale:`);
  for (const probe of pending.values()) {
    console.error(`   ${probe.path}  expected ${probe.expected}  got ${lastSeen.get(probe.path) || '(empty)'}`);
  }
  process.exit(1);
} finally {
  await browser.close();
}
