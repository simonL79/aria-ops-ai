#!/usr/bin/env node
/**
 * Auto-rewrites broken internal links to their closest canonical route.
 *
 * Strategy:
 *   1. Parse registered routes from src/App.tsx and src/nav-items.tsx.
 *   2. For each link in src/**, if it doesn't match any route, look up a rewrite:
 *      a. Exact match in scripts/route-canonical-map.json
 *      b. Longest prefix match (suffix '/*' rules) in the map
 *      c. Fallback: longest registered route prefix that the broken path starts with
 *   3. Apply rewrites in-place. Print a summary.
 *
 * Allowlisted patterns (scripts/route-integrity.allowlist.json) are skipped.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = join(ROOT, "src");

const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

const allowlist = JSON.parse(
  readFileSync(join(__dirname, "route-integrity.allowlist.json"), "utf8")
);
const ignoredLinkRegexes = allowlist.ignoredLinkPaths.map((p) => new RegExp(p));

const canonical = JSON.parse(
  readFileSync(join(__dirname, "route-canonical-map.json"), "utf8")
);
const rewriteMap = canonical.rewrites;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, out);
    else if (/\.(tsx?|jsx?)$/.test(entry)) out.push(full);
  }
  return out;
}

function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:\\])\/\/[^\n]*/g, "$1");
}

// Parse registered routes (raw strings, no regex conversion needed for matching here).
const appSrc = stripComments(readFileSync(join(SRC, "App.tsx"), "utf8"));
const navSrc = stripComments(readFileSync(join(SRC, "nav-items.tsx"), "utf8"));
const routes = new Set();
for (const m of appSrc.matchAll(/<Route[^>]*\spath=["']([^"']+)["']/g)) routes.add(m[1]);
for (const m of navSrc.matchAll(/to:\s*["']([^"']+)["']/g)) routes.add(m[1]);

const routeMatchers = [...routes].map((r) => ({
  raw: r,
  re: new RegExp("^" + r.replace(/:[^/]+/g, "[^/]+").replace(/\*$/, ".*") + "$"),
}));

function isRegistered(path) {
  if (ignoredLinkRegexes.some((re) => re.test(path))) return true;
  return routeMatchers.some((m) => m.re.test(path));
}

// Build longest-first lists for prefix matching.
const exactRewrites = Object.entries(rewriteMap).filter(([k]) => !k.endsWith("/*"));
const prefixRewrites = Object.entries(rewriteMap)
  .filter(([k]) => k.endsWith("/*"))
  .map(([k, v]) => [k.slice(0, -2), v.endsWith("/*") ? v.slice(0, -2) : v])
  .sort((a, b) => b[0].length - a[0].length);

const registeredPrefixes = [...routes]
  .filter((r) => !r.includes(":") && !r.endsWith("*"))
  .sort((a, b) => b.length - a.length);

function findRewrite(path) {
  // 1. exact map
  for (const [from, to] of exactRewrites) {
    if (from === path) return to;
  }
  // 2. prefix map
  for (const [from, to] of prefixRewrites) {
    if (path === from || path.startsWith(from + "/")) {
      return to + path.slice(from.length);
    }
  }
  // 3. fallback: longest registered route that is a prefix of broken path
  for (const r of registeredPrefixes) {
    if (path.startsWith(r + "/")) return r;
  }
  return null;
}

const linkPatterns = [
  { re: /\bto=["'](\/[^"']*)["']/g, wrap: (p) => `to="${p}"` },
  { re: /\bto=\{["'](\/[^"']*)["']\}/g, wrap: (p) => `to={"${p}"}` },
  { re: /\bhref=["'](\/[^"']*)["']/g, wrap: (p) => `href="${p}"` },
  { re: /\bnavigate\(\s*["'](\/[^"']*)["']/g, wrap: (p) => `navigate("${p}"` },
  { re: /<Navigate([^>]*?)\sto=["'](\/[^"']*)["']/g, wrap: (p, attrs) => `<Navigate${attrs} to="${p}"` },
];

const files = walk(SRC).filter((f) => f !== join(SRC, "App.tsx") && f !== join(SRC, "nav-items.tsx"));
const rewrites = [];
const unresolved = [];
let filesChanged = 0;

for (const file of files) {
  const original = readFileSync(file, "utf8");
  let updated = original;

  // Pattern 1-4: single-capture
  for (const { re } of linkPatterns.slice(0, 4)) {
    updated = updated.replace(re, (match, path) => {
      const bare = path.split(/[?#]/)[0];
      if (isRegistered(bare)) return match;
      const target = findRewrite(bare);
      if (!target) {
        unresolved.push({ file: relative(ROOT, file), path: bare });
        return match;
      }
      const suffix = path.slice(bare.length); // preserve query/hash
      const newPath = target + suffix;
      rewrites.push({ file: relative(ROOT, file), from: path, to: newPath });
      return match.replace(path, newPath);
    });
  }
  // Pattern 5: <Navigate ... to="...">
  updated = updated.replace(linkPatterns[4].re, (match, attrs, path) => {
    const bare = path.split(/[?#]/)[0];
    if (isRegistered(bare)) return match;
    const target = findRewrite(bare);
    if (!target) {
      unresolved.push({ file: relative(ROOT, file), path: bare });
      return match;
    }
    const suffix = path.slice(bare.length);
    const newPath = target + suffix;
    rewrites.push({ file: relative(ROOT, file), from: path, to: newPath });
    return match.replace(path, newPath);
  });

  if (updated !== original) {
    writeFileSync(file, updated);
    filesChanged++;
  }
}

console.log("\nLink Rewrite Pass");
console.log("─────────────────");
if (rewrites.length === 0) {
  console.log(`${GREEN}✓ No broken links found.${RESET}`);
} else {
  console.log(`${GREEN}✓ Rewrote ${rewrites.length} link(s) across ${filesChanged} file(s):${RESET}`);
  const grouped = new Map();
  for (const { from, to, file } of rewrites) {
    const key = `${from} → ${to}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(file);
  }
  for (const [change, fileList] of grouped) {
    console.log(`  ${YELLOW}${change}${RESET}`);
    for (const f of fileList) console.log(`    ${DIM}↳ ${f}${RESET}`);
  }
}
if (unresolved.length) {
  console.log(`\n${YELLOW}⚠ ${unresolved.length} broken link(s) had no canonical mapping:${RESET}`);
  const seen = new Set();
  for (const { file, path } of unresolved) {
    const k = `${path}|${file}`;
    if (seen.has(k)) continue;
    seen.add(k);
    console.log(`  ${path}  ${DIM}(${file})${RESET}`);
  }
  console.log(`  ${DIM}Add to scripts/route-canonical-map.json or scripts/route-integrity.allowlist.json.${RESET}`);
}
console.log();
process.exit(0);
