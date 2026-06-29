#!/usr/bin/env node
/**
 * Core Web Vitals CI check (LCP / CLS) using headless Chromium.
 *
 * For each target page it:
 *   1. Loads the page and registers PerformanceObservers for
 *      `largest-contentful-paint` and `layout-shift` BEFORE first paint.
 *   2. Scrolls the full height to trigger any lazy/late layout shifts
 *      (the realistic worst case for CLS).
 *   3. Reports final LCP (ms) and cumulative CLS (unitless).
 *
 * The build FAILS if any page exceeds its budget. The Blog list page has a
 * hard CLS budget of 0.1 — this is the regression guard requested: the
 * skeleton-to-grid transition and the deferred SoroEmbed mount must not push
 * CLS back above 0.1.
 *
 * Usage:
 *   node scripts/check-web-vitals.mjs
 *   BASE_URL=http://localhost:4173 node scripts/check-web-vitals.mjs
 *
 * In CI we build + `vite preview` so we measure the *production* bundle
 * (pre-built, content-hashed AVIF/WebP) rather than the dev server, whose
 * on-demand imagetools transforms inflate LCP artificially.
 */

import { chromium } from 'playwright';

const BASE_URL = (process.env.BASE_URL || 'http://localhost:4173').replace(/\/$/, '');

// Per-page budgets. CLS is the enforced metric here; LCP is reported and
// budgeted generously so genuine network/CI variance doesn't flake the build.
const TARGETS = [
  { path: '/blog',                       cls: 0.1,  lcp: 4000, label: 'Blog list' },
  { path: '/',                           cls: 0.1,  lcp: 4000, label: 'Home' },
  { path: '/about',                      cls: 0.1,  lcp: 5000, label: 'About' },
  { path: '/services/legal-shield',      cls: 0.1,  lcp: 5000, label: 'Legal Shield' },
];

const SETTLE_MS = Number(process.env.SETTLE_MS || 3500);

async function measure(page, url) {
  // Install observers via an init script so they exist before any paint.
  await page.addInitScript(() => {
    window.__vitals = { cls: 0, lcp: 0 };
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Only shifts without recent user input count toward CLS.
          if (!entry.hadRecentInput) window.__vitals.cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });

      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) window.__vitals.lcp = last.renderTime || last.loadTime || last.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      /* observer types unsupported — leave defaults */
    }
  });

  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

  // Force lazy content + late shifts to materialise.
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight / 2));
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
    window.scrollTo(0, 0);
  });

  await page.waitForTimeout(SETTLE_MS);

  return page.evaluate(() => window.__vitals);
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 1800 } });

  const failures = [];
  const rows = [];

  for (const t of TARGETS) {
    const page = await context.newPage();
    const url = `${BASE_URL}${t.path}`;
    let result;
    try {
      result = await measure(page, url);
    } catch (err) {
      failures.push(`${t.label} (${t.path}): failed to load — ${err.message}`);
      await page.close();
      continue;
    }
    await page.close();

    const cls = Number(result.cls.toFixed(3));
    const lcp = Math.round(result.lcp);
    rows.push({ label: t.label, path: t.path, cls, lcp, clsBudget: t.cls, lcpBudget: t.lcp });

    if (cls > t.cls) {
      failures.push(`${t.label} (${t.path}): CLS ${cls} exceeds budget ${t.cls}`);
    }
    if (t.lcp && lcp > t.lcp) {
      failures.push(`${t.label} (${t.path}): LCP ${lcp}ms exceeds budget ${t.lcp}ms`);
    }
  }

  await browser.close();

  // Report
  console.log('\nCore Web Vitals report');
  console.log('─'.repeat(64));
  console.log('Page'.padEnd(20), 'CLS'.padEnd(10), 'CLS budget'.padEnd(12), 'LCP'.padEnd(10), 'LCP budget');
  for (const r of rows) {
    console.log(
      r.label.padEnd(20),
      String(r.cls).padEnd(10),
      String(r.clsBudget).padEnd(12),
      `${r.lcp}ms`.padEnd(10),
      `${r.lcpBudget}ms`,
    );
  }
  console.log('─'.repeat(64));

  if (failures.length) {
    for (const f of failures) console.log(`::error::${f}`);
    console.error(`\n❌ Web Vitals check failed (${failures.length} issue${failures.length > 1 ? 's' : ''}).`);
    process.exit(1);
  }

  console.log('\n✅ All pages within Core Web Vitals budgets (Blog CLS ≤ 0.1).');
}

main().catch((err) => {
  console.error('::error::Web Vitals check crashed:', err);
  process.exit(1);
});
