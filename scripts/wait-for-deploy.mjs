#!/usr/bin/env node
/**
 * Poll the production site until the latest SEO build is detectably
 * live, i.e. the rendered <meta property="og:image"> on a sample
 * suppression page points at the page-specific /og/<slug>.jpg hero
 * (not the legacy /lovable-uploads/*.png fallback).
 *
 * Uses Playwright (chromium) so we read the post-hydration DOM, the
 * same way Googlebot's rendering pipeline does. Exits 0 when live,
 * non-zero on timeout.
 *
 *   BASE_URL=https://www.ariaops.co.uk \
 *   TIMEOUT_MS=900000 \
 *   node scripts/wait-for-deploy.mjs
 */
import { chromium } from 'playwright';

const BASE = (process.env.BASE_URL || 'https://www.ariaops.co.uk').replace(/\/$/, '');
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 15 * 60 * 1000); // 15 min
const INTERVAL_MS = Number(process.env.INTERVAL_MS || 30 * 1000);    // 30 s

const PROBE = {
  path: '/simon-lindsay/ksl',
  expectedImage: `${BASE}/og/simon-ksl.jpg`,
};

async function readOg(browser) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  try {
    await page.goto(`${BASE}${PROBE.path}`, { waitUntil: 'networkidle', timeout: 60_000 });
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
let attempt = 0;
let lastOg = '';
try {
  while (Date.now() - start < TIMEOUT_MS) {
    attempt += 1;
    try {
      lastOg = await readOg(browser);
      const ok = lastOg === PROBE.expectedImage;
      console.log(`[${attempt}] og:image=${lastOg || '(empty)'} ${ok ? '✅' : '…'}`);
      if (ok) {
        console.log(`✅ deploy detected after ${Math.round((Date.now() - start) / 1000)}s`);
        process.exit(0);
      }
    } catch (e) {
      console.log(`[${attempt}] probe error: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, INTERVAL_MS));
  }
  console.error(`❌ timed out after ${Math.round(TIMEOUT_MS / 1000)}s — last og:image: ${lastOg}`);
  process.exit(1);
} finally {
  await browser.close();
}
