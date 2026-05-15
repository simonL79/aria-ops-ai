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
const outFile = `${REPORT_DIR}/${stamp.replace(/[:.]/g, '-')}.json`;
writeFileSync(outFile, JSON.stringify({ stamp, rows }, null, 2));
console.log(`\nFull report: ${outFile}`);
