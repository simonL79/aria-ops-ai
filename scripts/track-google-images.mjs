#!/usr/bin/env node
/**
 * Track when each suppression page's hero image starts appearing in
 * Google Images results for its target query. Uses SerpAPI
 * (google_images engine) — needs SERPAPI_API_KEY in env.
 *
 * For every (query, expected page URL, expected image URL) tuple we:
 *   1. Query Google Images.
 *   2. Look for an image result whose `link` (page) OR `original`
 *      (image source) matches the expected page or hero image.
 *   3. Report rank, thumbnail, and whether the expected hero is live.
 *
 * Exit code is always 0 — this is a tracker, not a gate. Run on a
 * schedule and watch the JSON log under /mnt/documents/og-tracking/.
 *
 *   SERPAPI_API_KEY=... node scripts/track-google-images.mjs
 */

import { writeFileSync, mkdirSync } from 'node:fs';

const KEY = process.env.SERPAPI_API_KEY;
if (!KEY) {
  console.error('SERPAPI_API_KEY missing');
  process.exit(2);
}

const BASE = 'https://www.ariaops.co.uk';

const TARGETS = [
  { query: 'Simon Lindsay KSL',            page: '/simon-lindsay/ksl',                 image: '/og/simon-ksl.jpg' },
  { query: 'Simon Lindsay Glasgow',        page: '/simon-lindsay/glasgow',             image: '/og/simon-glasgow.jpg' },
  { query: 'KSL Hair Simon Lindsay',       page: '/simon-lindsay/ksl-hair',            image: '/og/simon-ksl-hair.jpg' },
  { query: 'Simon Lindsay reviews',        page: '/simon-lindsay/reviews',             image: '/og/simon-reviews.jpg' },
  { query: 'Simon Lindsay bankruptcy',     page: '/simon-lindsay/bankruptcy',          image: '/og/simon-bankruptcy.jpg' },
  { query: 'KSL Hair complaints',          page: '/simon-lindsay/ksl-hair-complaints', image: '/og/simon-ksl-hair-complaints.jpg' },
];

async function searchImages(q) {
  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.set('engine', 'google_images');
  url.searchParams.set('q', q);
  url.searchParams.set('hl', 'en');
  url.searchParams.set('gl', 'uk');
  url.searchParams.set('api_key', KEY);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`SerpAPI ${res.status}`);
  const json = await res.json();
  return json.images_results ?? [];
}

const stamp = new Date().toISOString();
const rows = [];

for (const t of TARGETS) {
  const expectedPage = `${BASE}${t.page}`;
  const expectedImg  = `${BASE}${t.image}`;
  const row = {
    query: t.query, expectedPage, expectedImg,
    pageMatchRank: null, imageMatchRank: null,
    matchedThumbnail: null, matchedSource: null,
  };
  try {
    const results = await searchImages(t.query);
    results.forEach((r, idx) => {
      const rank = idx + 1;
      const linkHit = r.link && r.link.startsWith(expectedPage);
      const imgHit  = r.original && r.original === expectedImg;
      if (linkHit && row.pageMatchRank === null) {
        row.pageMatchRank = rank;
        row.matchedThumbnail = r.thumbnail;
        row.matchedSource = r.original;
      }
      if (imgHit && row.imageMatchRank === null) {
        row.imageMatchRank = rank;
        row.matchedThumbnail = r.thumbnail;
        row.matchedSource = r.original;
      }
    });
    row.totalResults = results.length;
  } catch (e) {
    row.error = e.message;
  }
  rows.push(row);
}

const summary = rows.map((r) => ({
  query: r.query,
  pageRank: r.pageMatchRank ?? '—',
  imageRank: r.imageMatchRank ?? '—',
  heroLive: r.imageMatchRank !== null ? 'YES' : 'no',
}));
console.log(`Google Images tracking @ ${stamp}`);
console.table(summary);

const REPORT_DIR = process.env.REPORT_DIR || '/mnt/documents/og-tracking';
mkdirSync(REPORT_DIR, { recursive: true });
const safeStamp = stamp.replace(/[:.]/g, '-');
const outFile = `${REPORT_DIR}/${safeStamp}.json`;
writeFileSync(outFile, JSON.stringify({ stamp, rows }, null, 2));
console.log(`\nFull report: ${outFile}`);

// CSV export — one row per tracked query, RFC 4180-ish quoting so it
// opens cleanly in Excel/Google Sheets without further munging.
const csvEscape = (v) => {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csvHeader = ['stamp', 'query', 'pageMatchRank', 'imageMatchRank', 'heroLive', 'expectedPage', 'expectedImg', 'matchedSource', 'matchedThumbnail', 'totalResults', 'error'];
const csvLines = [csvHeader.join(',')];
for (const r of rows) {
  csvLines.push([
    stamp,
    r.query,
    r.pageMatchRank ?? '',
    r.imageMatchRank ?? '',
    r.imageMatchRank !== null,   // raw boolean
    r.expectedPage,
    r.expectedImg,
    r.matchedSource ?? '',
    r.matchedThumbnail ?? '',
    r.totalResults ?? '',
    r.error ?? '',
  ].map(csvEscape).join(','));
}
const csvFile = `${REPORT_DIR}/${safeStamp}.csv`;
writeFileSync(csvFile, csvLines.join('\n') + '\n');
console.log(`CSV export:  ${csvFile}`);

// -----------------------------------------------------------------
// Regression / strict gating.
//
// FAIL_MODE controls when this script exits non-zero:
//   off        — never fail (default behaviour, used by tracker-only runs)
//   strict     — fail if ANY query has heroLive=false this run
//   regression — fail only if a query was heroLive=true in the previous
//                snapshot but is now false (real regression)
// Default is "strict" for post-deploy runs so missed pickups are loud.
// -----------------------------------------------------------------
const FAIL_MODE = (process.env.FAIL_MODE || 'off').toLowerCase();
const dead = rows.filter((r) => r.imageMatchRank === null);
const live = rows.filter((r) => r.imageMatchRank !== null);

console.log(`\nheroLive summary: ${live.length}/${rows.length} live, ${dead.length} not-live`);

if (FAIL_MODE === 'strict' && dead.length > 0) {
  console.error('\n❌ STRICT mode: heroLive=false for the following queries:');
  for (const r of dead) {
    console.error(`   • ${r.query}`);
    console.error(`       expected image: ${r.expectedImg}`);
    console.error(`       expected page:  ${r.expectedPage}`);
    console.error(`       SerpAPI hits:   ${r.totalResults ?? 0}${r.error ? ` (error: ${r.error})` : ''}`);
  }
  console.error(`\nFix: confirm /og/<slug>.jpg is live, image-sitemap.xml is submitted in GSC, and the page is indexable. Re-run when Google has had time to recrawl.`);
  process.exit(1);
}

if (FAIL_MODE === 'regression') {
  // Compare against the most recent prior snapshot in REPORT_DIR.
  const { readdirSync, readFileSync } = await import('node:fs');
  const prior = readdirSync(REPORT_DIR)
    .filter((f) => f.endsWith('.json') && f !== `${safeStamp}.json`)
    .sort();
  const last = prior.at(-1);
  if (!last) {
    console.log('No prior snapshot to diff against — regression check skipped.');
  } else {
    const prev = JSON.parse(readFileSync(`${REPORT_DIR}/${last}`, 'utf8'));
    const prevLive = new Set((prev.rows ?? []).filter((r) => r.imageMatchRank !== null).map((r) => r.query));
    const regressed = rows.filter((r) => prevLive.has(r.query) && r.imageMatchRank === null);
    if (regressed.length > 0) {
      console.error(`\n❌ REGRESSION vs ${last}: ${regressed.length} query(ies) lost heroLive:`);
      for (const r of regressed) console.error(`   • ${r.query}  (expected ${r.expectedImg})`);
      process.exit(1);
    }
    console.log(`No regressions vs ${last}.`);
  }
}

