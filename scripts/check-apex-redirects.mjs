#!/usr/bin/env node
/**
 * Verifies that https://ariaops.co.uk/<path> issues a 301 redirect to
 * https://www.ariaops.co.uk/<path> for every public route.
 *
 * Routes are sourced from public/sitemap.xml so the check stays in sync
 * with what we ask Google to index. Fails if any route returns a status
 * other than 301 or a Location that isn't the canonical www URL.
 *
 * Usage:
 *   node scripts/check-apex-redirects.mjs
 *   CONCURRENCY=8 node scripts/check-apex-redirects.mjs
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const APEX = "https://ariaops.co.uk";
const CANONICAL = "https://www.ariaops.co.uk";
const CONCURRENCY = Number(process.env.CONCURRENCY || 6);
const TIMEOUT_MS = 15_000;

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

const sitemap = readFileSync(resolve(ROOT, "public/sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
const paths = Array.from(
  new Set(
    locs
      .filter((u) => u.startsWith(CANONICAL))
      .map((u) => u.slice(CANONICAL.length) || "/")
  )
);

if (paths.length === 0) {
  console.error("No routes found in public/sitemap.xml");
  process.exit(1);
}

async function check(path) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${APEX}${path}`, {
      method: "HEAD",
      redirect: "manual",
      signal: ctrl.signal,
    });
    const loc = res.headers.get("location") || "";
    const expected = `${CANONICAL}${path}`;
    // Normalise trailing slash for comparison
    const norm = (s) => s.replace(/\/$/, "");
    const ok = res.status === 301 && norm(loc) === norm(expected);
    return { path, status: res.status, location: loc, expected, ok };
  } catch (err) {
    return { path, status: 0, location: "", expected: `${CANONICAL}${path}`, ok: false, error: String(err.message || err) };
  } finally {
    clearTimeout(t);
  }
}

console.log(`\nApex → www redirect check`);
console.log(`─────────────────────────`);
console.log(`${DIM}Apex:${RESET} ${APEX}`);
console.log(`${DIM}Expect:${RESET} 301 → ${CANONICAL}`);
console.log(`${DIM}Routes:${RESET} ${paths.length} (from public/sitemap.xml)\n`);

const results = [];
const queue = [...paths];
async function worker() {
  while (queue.length) {
    const p = queue.shift();
    const r = await check(p);
    results.push(r);
    const mark = r.ok ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
    const detail = r.ok ? `301 → ${r.location}` : `${r.status || "ERR"} ${r.location || r.error || ""}`;
    console.log(`  ${mark} ${p}  ${DIM}${detail}${RESET}`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const failed = results.filter((r) => !r.ok);
console.log(`\n${failed.length === 0 ? GREEN + "✓" : RED + "✗"}${RESET} ${results.length - failed.length}/${results.length} routes redirect correctly\n`);

if (failed.length) {
  console.log(`${RED}Failures:${RESET}`);
  for (const f of failed) {
    console.log(`  ${f.path}`);
    console.log(`    expected: 301 → ${f.expected}`);
    console.log(`    got:      ${f.status || "ERR"} ${f.location || f.error || ""}`);
  }
  process.exit(1);
}
