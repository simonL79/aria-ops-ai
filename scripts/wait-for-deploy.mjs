#!/usr/bin/env node
/**
 * Poll the production site until the latest SEO build is detectably
 * live across EVERY tracked suppression page — i.e. the rendered
 * <meta property="og:image"> on each page points at its
 * page-specific /og/<slug>.jpg hero (not the legacy
 * /lovable-uploads/*.png fallback).
 *
 * Optimisations vs. the naive version:
 *   - All pending pages are probed in parallel each attempt.
 *   - A single BrowserContext is reused for the whole run; we just
 *     open/close lightweight pages.
 *   - We use waitUntil:'domcontentloaded' and then poll the actual
 *     og:image meta until it equals the expected value (capped),
 *     instead of a fixed networkidle + sleep.
 *
 *   BASE_URL=https://www.ariaops.co.uk \
 *   TIMEOUT_MS=1800000 \
 *   node scripts/wait-for-deploy.mjs
 */
import { chromium } from 'playwright';

const BASE = (process.env.BASE_URL || 'https://www.ariaops.co.uk').replace(/\/$/, '');
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 30 * 60 * 1000); // 30 min
const INTERVAL_MS = Number(process.env.INTERVAL_MS || 30 * 1000);    // 30 s
const PROBE_TIMEOUT_MS = Number(process.env.PROBE_TIMEOUT_MS || 15_000);
const PROBE_RETRIES   = Number(process.env.PROBE_RETRIES   || 2);   // extra tries on transient failure
const RETRY_BACKOFF_MS = Number(process.env.RETRY_BACKOFF_MS || 1_500);

const PROBES = [
  { path: '/simon-lindsay/ksl',                 slug: 'simon-ksl' },
  { path: '/simon-lindsay/glasgow',             slug: 'simon-glasgow' },
  { path: '/simon-lindsay/ksl-hair',            slug: 'simon-ksl-hair' },
  { path: '/simon-lindsay/reviews',             slug: 'simon-reviews' },
  { path: '/simon-lindsay/bankruptcy',          slug: 'simon-bankruptcy' },
  { path: '/simon-lindsay/ksl-hair-complaints', slug: 'simon-ksl-hair-complaints' },
].map((p) => ({ ...p, expected: `${BASE}/og/${p.slug}.jpg` }));

async function readOgOnce(ctx, probe) {
  const page = await ctx.newPage();
  try {
    await page.goto(`${BASE}${probe.path}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    // Helmet swaps og:image after hydration; poll the actual value
    // until it equals what we expect (or the probe timeout fires).
    try {
      await page.waitForFunction(
        (expected) => document.querySelector('meta[property="og:image"]')?.content === expected,
        probe.expected,
        { timeout: PROBE_TIMEOUT_MS, polling: 500 },
      );
    } catch { /* fall through — read whatever's there now */ }
    return (await page.locator('meta[property="og:image"]').first().getAttribute('content')) || '';
  } finally {
    await page.close();
  }
}

// Wraps readOgOnce with bounded retry + exponential backoff so a single
// transient navigation/network blip doesn't waste a whole 30s outer cycle.
async function readOg(ctx, probe) {
  let lastErr;
  for (let attempt = 0; attempt <= PROBE_RETRIES; attempt++) {
    try {
      return await readOgOnce(ctx, probe);
    } catch (e) {
      lastErr = e;
      if (attempt === PROBE_RETRIES) break;
      const delay = RETRY_BACKOFF_MS * Math.pow(2, attempt);
      console.log(`    ↻ ${probe.path} retry ${attempt + 1}/${PROBE_RETRIES} after ${delay}ms (${e.message})`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

const start = Date.now();
const browser = await chromium.launch();
const ctx = await browser.newContext();
const pending = new Map(PROBES.map((p) => [p.path, p]));
const lastSeen = new Map();
let attempt = 0;
try {
  while (Date.now() - start < TIMEOUT_MS && pending.size > 0) {
    attempt += 1;
    console.log(`\n— attempt ${attempt} (${pending.size} pending / ${PROBES.length}) —`);
    const probes = [...pending.values()];
    const results = await Promise.all(probes.map(async (probe) => {
      try {
        const og = await readOg(ctx, probe);
        return { probe, og, error: null };
      } catch (e) {
        return { probe, og: null, error: e.message };
      }
    }));
    for (const { probe, og, error } of results) {
      if (error) {
        console.log(`  ⚠ ${probe.path} probe error: ${error}`);
        continue;
      }
      lastSeen.set(probe.path, og);
      const ok = og === probe.expected;
      console.log(`  ${ok ? '✅' : '…'} ${probe.path} → ${og || '(empty)'}`);
      if (ok) pending.delete(probe.path);
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
  await ctx.close();
  await browser.close();
}
