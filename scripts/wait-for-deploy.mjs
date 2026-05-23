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
import { writeFileSync, mkdirSync } from 'node:fs';

const BASE = (process.env.BASE_URL || 'https://www.ariaops.co.uk').replace(/\/$/, '');
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 30 * 60 * 1000); // 30 min
const INTERVAL_MS = Number(process.env.INTERVAL_MS || 30 * 1000);    // 30 s base
const MAX_INTERVAL_MS = Number(process.env.MAX_INTERVAL_MS || 4 * 60 * 1000); // cap 4 min
const BACKOFF_FACTOR = Number(process.env.BACKOFF_FACTOR || 1.5);
const JITTER_RATIO = Number(process.env.JITTER_RATIO || 0.2); // ±20%
const PROBE_TIMEOUT_MS = Number(process.env.PROBE_TIMEOUT_MS || 15_000);
const PROBE_RETRIES   = Number(process.env.PROBE_RETRIES   || 2);   // extra tries on transient failure
const RETRY_BACKOFF_MS = Number(process.env.RETRY_BACKOFF_MS || 1_500);

const jitter = (ms) => {
  const delta = ms * JITTER_RATIO;
  return Math.max(0, Math.round(ms + (Math.random() * 2 - 1) * delta));
};

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
      const delay = jitter(RETRY_BACKOFF_MS * Math.pow(2, attempt));
      console.log(`    ↻ ${probe.path} retry ${attempt + 1}/${PROBE_RETRIES} after ${delay}ms (${e.message})`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

const REPORT_DIR = process.env.REPORT_DIR || 'og-tracking';
const startWall = new Date().toISOString();
const start = Date.now();
const browser = await chromium.launch();
const ctx = await browser.newContext();
const pending = new Map(PROBES.map((p) => [p.path, p]));
const lastSeen = new Map();
const attemptLog = []; // [{ attempt, ts, results: [{ path, expected, og, ok, error, retries }] }]
let attempt = 0;
let backoffStreak = 0;

function writeReport(status) {
  try {
    mkdirSync(REPORT_DIR, { recursive: true });
    const finishedAt = new Date().toISOString();
    const elapsedMs = Date.now() - start;
    const finalRows = PROBES.map((p) => ({
      path: p.path,
      expected: p.expected,
      lastSeen: lastSeen.get(p.path) || null,
      live: lastSeen.get(p.path) === p.expected,
      stillPending: pending.has(p.path),
    }));
    const report = {
      base: BASE,
      status,
      startedAt: startWall,
      finishedAt,
      elapsedMs,
      attempts: attempt,
      total: PROBES.length,
      live: finalRows.filter((r) => r.live).length,
      stale: finalRows.filter((r) => !r.live).length,
      pages: finalRows,
      attemptLog,
    };
    const jsonPath = `${REPORT_DIR}/wait-for-deploy.json`;
    writeFileSync(jsonPath, JSON.stringify(report, null, 2));

    const rowHtml = finalRows.map((r) => `
      <tr class="${r.live ? 'ok' : 'bad'}">
        <td>${r.live ? '✅' : '❌'}</td>
        <td><code>${r.path}</code></td>
        <td><code>${r.expected}</code></td>
        <td><code>${r.lastSeen ?? '(none)'}</code></td>
      </tr>`).join('');
    const html = `<!doctype html><meta charset="utf-8">
<title>wait-for-deploy report — ${status}</title>
<style>
  body{font:14px/1.4 -apple-system,system-ui,sans-serif;background:#0b0b0b;color:#eee;padding:24px;max-width:1100px;margin:0 auto}
  h1{margin:0 0 4px;font-size:20px}
  .meta{color:#888;margin-bottom:18px}
  .status-pass{color:#4ade80}.status-fail{color:#f97316}
  table{border-collapse:collapse;width:100%;margin-bottom:24px}
  th,td{padding:8px 10px;text-align:left;border-bottom:1px solid #222;vertical-align:top}
  th{color:#aaa;font-weight:500}
  tr.bad{background:rgba(249,115,22,.08)}
  code{font:12px/1.3 ui-monospace,Menlo,monospace;color:#cbd5e1;word-break:break-all}
  details{margin-top:8px}
  pre{background:#111;padding:10px;overflow:auto;border-radius:6px;font-size:12px}
</style>
<h1>wait-for-deploy: <span class="status-${status === 'pass' ? 'pass' : 'fail'}">${status.toUpperCase()}</span></h1>
<div class="meta">${BASE} · ${attempt} attempt(s) · ${Math.round(elapsedMs / 1000)}s · ${report.live}/${report.total} live · started ${startWall}</div>
<table>
  <thead><tr><th></th><th>Path</th><th>Expected og:image</th><th>Last seen og:image</th></tr></thead>
  <tbody>${rowHtml}</tbody>
</table>
<details><summary>Per-attempt log (${attemptLog.length})</summary><pre>${JSON.stringify(attemptLog, null, 2).replace(/[<&]/g, (c) => ({ '<': '&lt;', '&': '&amp;' }[c]))}</pre></details>`;
    writeFileSync(`${REPORT_DIR}/wait-for-deploy.html`, html);
    console.log(`\n📄 Report written: ${jsonPath} + .html`);
  } catch (e) {
    console.error(`Report write failed: ${e.message}`);
  }
}

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
    const attemptEntry = { attempt, ts: new Date().toISOString(), results: [] };
    const pendingBefore = pending.size;
    for (const { probe, og, error } of results) {
      if (error) {
        console.log(`  ⚠ ${probe.path} probe error: ${error}`);
        attemptEntry.results.push({ path: probe.path, expected: probe.expected, og: null, ok: false, error });
        continue;
      }
      lastSeen.set(probe.path, og);
      const ok = og === probe.expected;
      console.log(`  ${ok ? '✅' : '…'} ${probe.path} → ${og || '(empty)'}`);
      attemptEntry.results.push({ path: probe.path, expected: probe.expected, og, ok, error: null });
      if (ok) pending.delete(probe.path);
    }
    attemptLog.push(attemptEntry);
    if (pending.size === 0) {
      console.log(`\n✅ all ${PROBES.length} pages live after ${Math.round((Date.now() - start) / 1000)}s`);
      writeReport('pass');
      process.exit(0);
    }
    // Exponential backoff between outer attempts when no progress was made;
    // reset to base interval as soon as a page flips live.
    if (pending.size < pendingBefore) {
      backoffStreak = 0;
    } else {
      backoffStreak += 1;
    }
    const rawDelay = Math.min(
      INTERVAL_MS * Math.pow(BACKOFF_FACTOR, backoffStreak),
      MAX_INTERVAL_MS,
    );
    const delay = jitter(rawDelay);
    const remaining = TIMEOUT_MS - (Date.now() - start);
    const sleepFor = Math.max(0, Math.min(delay, remaining));
    console.log(`  ⏲ next attempt in ${Math.round(sleepFor / 1000)}s (streak ${backoffStreak})`);
    await new Promise((r) => setTimeout(r, sleepFor));
  }
  console.error(`\n❌ timed out after ${Math.round(TIMEOUT_MS / 1000)}s — ${pending.size} page(s) still stale:`);
  for (const probe of pending.values()) {
    console.error(`   ${probe.path}  expected ${probe.expected}  got ${lastSeen.get(probe.path) || '(empty)'}`);
  }
  writeReport('fail');
  process.exit(1);
} finally {
  await ctx.close();
  await browser.close();
}
