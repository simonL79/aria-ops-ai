#!/usr/bin/env node
/**
 * Image sitemap audit.
 *
 * Parses public/image-sitemap.xml and, for every <image:loc>:
 *   1. Confirms the file exists locally in the build output
 *      (dist/og/... if a build has run, otherwise public/og/...).
 *   2. Issues an HTTP HEAD against the production URL (override with
 *      BASE_URL) using the Googlebot-Image user agent and asserts
 *      status 200 + content-type image/jpeg.
 *
 * Exits non-zero on any failure. Local-only mode: pass --local to skip
 * the HTTP check (useful in pre-publish CI when the new assets aren't
 * live yet).
 *
 * Usage:
 *   node scripts/audit-image-sitemap.mjs
 *   BASE_URL=https://aria-ops-ai.lovable.app node scripts/audit-image-sitemap.mjs
 *   node scripts/audit-image-sitemap.mjs --local
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_URL = (process.env.BASE_URL || 'https://www.ariaops.co.uk').replace(/\/$/, '');
const LOCAL_ONLY = process.argv.includes('--local');
const UA = 'Googlebot-Image/1.0';

const SITEMAP_PATH = resolve('public/image-sitemap.xml');
if (!existsSync(SITEMAP_PATH)) {
  console.error(`❌ image sitemap not found at ${SITEMAP_PATH}`);
  process.exit(1);
}
const xml = readFileSync(SITEMAP_PATH, 'utf8');

/** Pull every <image:loc> URL from the sitemap. */
function extractImageLocs(xmlSrc) {
  const out = [];
  const re = /<image:loc>([^<]+)<\/image:loc>/g;
  let m;
  while ((m = re.exec(xmlSrc)) !== null) out.push(m[1].trim());
  return out;
}

/** Resolve sitemap absolute URL to local file path under dist/ or public/. */
function localPathFor(absUrl) {
  const u = new URL(absUrl);
  // Strip leading slash, e.g. "/og/simon-ksl.jpg" → "og/simon-ksl.jpg"
  const rel = u.pathname.replace(/^\//, '');
  const distPath   = resolve('dist', rel);
  const publicPath = resolve('public', rel);
  if (existsSync(distPath))   return { path: distPath,   source: 'dist' };
  if (existsSync(publicPath)) return { path: publicPath, source: 'public' };
  return null;
}

async function headCheck(url) {
  // Some CDNs reject HEAD; fall back to a 1-byte ranged GET if needed.
  const headers = { 'user-agent': UA, accept: 'image/*,*/*;q=0.8' };
  let res = await fetch(url, { method: 'HEAD', headers });
  if (res.status === 405 || res.status === 501) {
    res = await fetch(url, { method: 'GET', headers: { ...headers, range: 'bytes=0-0' } });
  }
  return {
    status: res.status,
    contentType: res.headers.get('content-type') || '',
    contentLength: res.headers.get('content-length'),
  };
}

const locs = extractImageLocs(xml);
if (locs.length === 0) {
  console.error('❌ No <image:loc> entries found in image-sitemap.xml');
  process.exit(1);
}

const results = [];
let failures = 0;

for (const loc of locs) {
  const row = { loc };
  const errors = [];

  // 1) Local file presence
  const local = localPathFor(loc);
  if (!local) {
    errors.push('local file not found in dist/ or public/');
  } else {
    row.localSource = local.source;
    row.localBytes = statSync(local.path).size;
    if (!local.path.toLowerCase().endsWith('.jpg') && !local.path.toLowerCase().endsWith('.jpeg')) {
      errors.push(`unexpected extension: ${local.path}`);
    }
  }

  // 2) HTTP check (rewrites the sitemap host to BASE_URL so we can audit
  //    a preview/staging environment without editing the file).
  if (!LOCAL_ONLY) {
    try {
      const u = new URL(loc);
      const httpUrl = `${BASE_URL}${u.pathname}`;
      row.checkedUrl = httpUrl;
      const { status, contentType, contentLength } = await headCheck(httpUrl);
      row.status = status;
      row.contentType = contentType;
      row.contentLength = contentLength;
      if (status !== 200 && status !== 206) errors.push(`HTTP ${status}`);
      if (!/^image\/jpe?g\b/i.test(contentType)) errors.push(`content-type=${contentType || '(none)'}`);
    } catch (e) {
      errors.push(`HTTP error: ${e.message}`);
    }
  }

  if (errors.length) {
    row.errors = errors.join(' | ');
    failures += 1;
  }
  results.push(row);
}

console.log(`Image sitemap audit (${locs.length} URLs)${LOCAL_ONLY ? ' — local only' : ` — UA "${UA}" → ${BASE_URL}`}`);
console.table(results.map(r => ({
  loc: r.loc.replace(BASE_URL, ''),
  local: r.localSource ? `${r.localSource} (${r.localBytes}B)` : '—',
  status: r.status ?? '—',
  contentType: r.contentType ?? '—',
  errors: r.errors ?? '',
})));

if (failures > 0) {
  console.error(`\n❌ ${failures} of ${locs.length} entries failed`);
  process.exit(1);
}
console.log(`\n✅ All ${locs.length} sitemap images present locally${LOCAL_ONLY ? '' : ' and serving 200 image/jpeg'}`);
