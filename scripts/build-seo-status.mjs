#!/usr/bin/env node
/**
 * Aggregate every Google Images tracker JSON snapshot under
 * og-tracking/ into a single browser-friendly file:
 *
 *   public/seo-status/tracker-history.json
 *
 * Shape:
 *   {
 *     generatedAt: ISO string,
 *     queries:  ["Simon Lindsay KSL", ...],
 *     runs: [
 *       { stamp, trigger, results: { "<query>": { pageRank, imageRank, heroLive } } }
 *     ]
 *   }
 *
 * The SEO status dashboard (/admin/seo-status) fetches this file.
 * Run automatically by the post-deploy-tracker workflow before commit.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const SRC = resolve('og-tracking');
const OUT_DIR = resolve('public/seo-status');
const OUT = join(OUT_DIR, 'tracker-history.json');

mkdirSync(OUT_DIR, { recursive: true });

const runs = [];
const querySet = new Set();

if (existsSync(SRC)) {
  const files = readdirSync(SRC).filter((f) => f.endsWith('.json')).sort();
  for (const f of files) {
    try {
      const data = JSON.parse(readFileSync(join(SRC, f), 'utf8'));
      const results = {};
      for (const r of data.rows ?? []) {
        querySet.add(r.query);
        results[r.query] = {
          pageRank: r.pageMatchRank ?? null,
          imageRank: r.imageMatchRank ?? null,
          heroLive: r.imageMatchRank !== null,
        };
      }
      runs.push({
        stamp: data.stamp ?? f.replace(/\.json$/, ''),
        trigger: data.trigger ?? null,
        results,
      });
    } catch (e) {
      console.warn(`skip ${f}: ${e.message}`);
    }
  }
}

const payload = {
  generatedAt: new Date().toISOString(),
  queries: [...querySet],
  runs,
};
writeFileSync(OUT, JSON.stringify(payload, null, 2));
console.log(`Wrote ${OUT} — ${runs.length} runs, ${querySet.size} queries`);
