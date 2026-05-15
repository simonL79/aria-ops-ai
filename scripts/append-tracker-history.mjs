#!/usr/bin/env node
/**
 * Append the most recent Google Images tracker JSON to a rolling
 * markdown report so we can eyeball the heroLive trajectory over time
 * without unpacking artifacts.
 *
 * Reads the newest file under og-tracking/ (created by
 * track-google-images.mjs when REPORT_DIR=og-tracking) and appends a
 * one-row-per-query block to og-tracking/history.md.
 *
 *   node scripts/append-tracker-history.mjs
 */
import { readdirSync, readFileSync, existsSync, appendFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const DIR = resolve('og-tracking');
const HISTORY = join(DIR, 'history.md');

if (!existsSync(DIR)) {
  console.error('og-tracking/ not found — nothing to append');
  process.exit(0);
}

const files = readdirSync(DIR)
  .filter((f) => f.endsWith('.json'))
  .sort();
if (files.length === 0) {
  console.error('No tracker JSON files found');
  process.exit(0);
}
const latest = files[files.length - 1];
const data = JSON.parse(readFileSync(join(DIR, latest), 'utf8'));
const stamp = data.stamp ?? new Date().toISOString();
const trigger = process.env.TRIGGER_LABEL ?? 'manual';

if (!existsSync(HISTORY)) {
  mkdirSync(DIR, { recursive: true });
  writeFileSync(
    HISTORY,
    '# Google Images tracker — heroLive history\n\n' +
      'Auto-appended after every production deploy and on the daily 07:00 UTC schedule.\n\n',
  );
}

const esc = (v) => String(v ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const short = (url, max = 60) => {
  if (!url) return '—';
  return url.length > max ? `${url.slice(0, max - 1)}…` : url;
};

const lines = [
  `## ${stamp} — _${trigger}_`,
  '',
  '| Query | Hero live (raw) | Page rank | Image rank | Expected page | Expected image | Matched source | Matched thumbnail |',
  '|---|---|---|---|---|---|---|---|',
];
for (const r of data.rows ?? []) {
  const heroLiveBool = r.imageMatchRank !== null; // raw boolean
  const heroLiveCell = `\`${heroLiveBool}\`${heroLiveBool ? ' ✅' : ''}`;
  lines.push(
    `| ${esc(r.query)} | ${heroLiveCell} | ${r.pageMatchRank ?? '—'} | ${r.imageMatchRank ?? '—'} | ${esc(short(r.expectedPage))} | ${esc(short(r.expectedImg))} | ${esc(short(r.matchedSource))} | ${esc(short(r.matchedThumbnail, 50))} |`,
  );
  if (r.error) {
    lines.push(`| ${esc(r.query)} | — | — | — | — | — | _error: ${esc(r.error)}_ | — |`);
  }
}
lines.push('', '');
appendFileSync(HISTORY, lines.join('\n'));
console.log(`Appended ${data.rows?.length ?? 0} rows from ${latest} → ${HISTORY}`);
