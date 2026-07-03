#!/usr/bin/env node
/**
 * Re-submit sitemap.xml to Google Search Console.
 *
 * Run this after FAQ updates (or any content change) so Google
 * re-discovers the affected pages promptly. Submitting a sitemap is
 * the correct programmatic route — Google's public API has no
 * request-indexing endpoint for regular content pages.
 *
 * It calls the Search Console API through the Lovable connector
 * gateway, which forwards the connected account's OAuth token:
 *
 *   PUT /webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}
 *
 * then reads back the processing status
 *
 *   GET /webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}
 *
 * Required env vars:
 *   LOVABLE_API_KEY              — auth to the connector gateway
 *   GOOGLE_SEARCH_CONSOLE_API_KEY — the gateway forwards the OAuth token
 *
 * Optional env vars:
 *   SITE_URL     (default https://www.ariaops.co.uk/)
 *   SITEMAP_URL  (default {SITE_URL}sitemap.xml)
 *
 * Usage:
 *   LOVABLE_API_KEY=… GOOGLE_SEARCH_CONSOLE_API_KEY=… node scripts/submit-sitemap.mjs
 *   # override targets:
 *   SITEMAP_URL=https://www.ariaops.co.uk/image-sitemap.xml node scripts/submit-sitemap.mjs
 */

const GATEWAY = 'https://connector-gateway.lovable.dev/google_search_console';

const SITE_URL = (process.env.SITE_URL || 'https://www.ariaops.co.uk/').replace(/\/?$/, '/');
const SITEMAP_URL = process.env.SITEMAP_URL || `${SITE_URL}sitemap.xml`;

const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
const GSC_API_KEY = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

if (!LOVABLE_API_KEY) fail('Missing LOVABLE_API_KEY env var.');
if (!GSC_API_KEY) fail('Missing GOOGLE_SEARCH_CONSOLE_API_KEY env var.');

const headers = {
  Authorization: `Bearer ${LOVABLE_API_KEY}`,
  'X-Connection-Api-Key': GSC_API_KEY,
};

const enc = encodeURIComponent;
const base = `${GATEWAY}/webmasters/v3/sites/${enc(SITE_URL)}/sitemaps/${enc(SITEMAP_URL)}`;

async function main() {
  console.log(`🔎 Site:    ${SITE_URL}`);
  console.log(`📄 Sitemap: ${SITEMAP_URL}`);

  // 1) Submit (PUT) — a 204 means Google accepted the submission.
  const put = await fetch(base, { method: 'PUT', headers });
  if (!put.ok) {
    const body = await put.text().catch(() => '');
    fail(`Sitemap submission failed: HTTP ${put.status} ${body}`);
  }
  console.log(`✅ Submitted sitemap (HTTP ${put.status}).`);

  // 2) Read back the processing status (GET).
  const get = await fetch(base, { headers });
  if (!get.ok) {
    const body = await get.text().catch(() => '');
    // Submission already succeeded; status read is best-effort.
    console.warn(`⚠️  Could not read sitemap status: HTTP ${get.status} ${body}`);
    process.exit(0);
  }

  const status = await get.json();
  const errors = Number(status.errors ?? 0);
  const warnings = Number(status.warnings ?? 0);
  const submittedCount = status.contents?.reduce?.(
    (n, c) => n + Number(c.submitted ?? 0),
    0,
  );

  console.log('📊 Sitemap status:');
  console.log(`   lastSubmitted:  ${status.lastSubmitted ?? 'n/a'}`);
  console.log(`   lastDownloaded: ${status.lastDownloaded ?? 'not yet downloaded'}`);
  console.log(`   errors:         ${errors}`);
  console.log(`   warnings:       ${warnings}`);
  if (submittedCount != null) console.log(`   URLs submitted: ${submittedCount}`);

  if (errors > 0) fail(`Sitemap has ${errors} error(s) — check Search Console.`);
  console.log('🎉 Sitemap re-submitted successfully; discovery stays current.');
}

main().catch((err) => fail(err?.message || String(err)));
