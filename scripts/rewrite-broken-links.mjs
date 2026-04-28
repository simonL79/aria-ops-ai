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
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = join(ROOT, "src");
const REPORTS_DIR = join(ROOT, "reports");
const REPORT_PATH = join(REPORTS_DIR, "route-rewrite.json");

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

// ---------- internal vs external classification ----------
// Schemes that mean "definitely not an internal app route".
const EXTERNAL_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i; // http:, https:, mailto:, tel:, sms:, ftp:, ws:, file:, data:, blob:, javascript:, chrome-extension:, etc.
// Protocol-relative URLs (//cdn.example.com/...) are external.
const PROTOCOL_RELATIVE_RE = /^\/\//;

/**
 * True only for app-internal route paths we may rewrite.
 * Rejects: external schemes, protocol-relative URLs, anchors, query-only,
 * relative paths, template-literal interpolations, empty strings.
 */
function isInternalPath(raw) {
  if (typeof raw !== "string" || raw.length === 0) return false;
  if (raw.includes("${")) return false;          // template literal with interpolation
  if (PROTOCOL_RELATIVE_RE.test(raw)) return false;
  if (EXTERNAL_SCHEME_RE.test(raw)) return false; // mailto:, tel:, http(s):, etc.
  if (raw.startsWith("#")) return false;          // pure fragment
  if (raw.startsWith("?")) return false;          // pure query
  if (!raw.startsWith("/")) return false;         // must be absolute app path
  return true;
}

// Capture group 1 = quote char, group 2 = path content. Accepts ", ', and `.
const linkPatterns = [
  { name: "to=\"...\"",      re: /\bto=(["'`])([^"'`\n]+)\1/g },
  { name: "to={\"...\"}",    re: /\bto=\{\s*(["'`])([^"'`\n]+)\1\s*\}/g },
  { name: "href=\"...\"",    re: /\bhref=(["'`])([^"'`\n]+)\1/g },
  { name: "navigate(\"...\")", re: /\bnavigate\(\s*(["'`])([^"'`\n]+)\1/g },
  { name: "<Navigate to=>",  re: /<Navigate\b[^>]*?\sto=(["'`])([^"'`\n]+)\1/g },
];

const files = walk(SRC).filter((f) => f !== join(SRC, "App.tsx") && f !== join(SRC, "nav-items.tsx"));
const rewrites = [];
const unresolved = [];
const skippedExternal = []; // for diagnostics only
let filesChanged = 0;

function rewritePath(file, fullPath) {
  const bare = fullPath.split(/[?#]/)[0];
  if (isRegistered(bare)) return null;
  const target = findRewrite(bare);
  if (!target) {
    unresolved.push({ file: relative(ROOT, file), path: bare });
    return null;
  }
  const suffix = fullPath.slice(bare.length); // preserve ?query / #hash
  const newPath = target + suffix;
  rewrites.push({ file: relative(ROOT, file), from: fullPath, to: newPath });
  return newPath;
}

for (const file of files) {
  const original = readFileSync(file, "utf8");
  let updated = original;

  for (const { re } of linkPatterns) {
    updated = updated.replace(re, (match, quote, path) => {
      if (!isInternalPath(path)) {
        if (EXTERNAL_SCHEME_RE.test(path) || PROTOCOL_RELATIVE_RE.test(path)) {
          skippedExternal.push({ file: relative(ROOT, file), path });
        }
        return match;
      }
      const newPath = rewritePath(file, path);
      if (!newPath) return match;
      // Replace only the captured path; keep surrounding quotes/attrs intact.
      return match.replace(quote + path + quote, quote + newPath + quote);
    });
  }

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
if (skippedExternal.length) {
  console.log(`\n${DIM}ℹ Skipped ${skippedExternal.length} external link(s) (http/https/mailto/tel/protocol-relative).${RESET}`);
}
// ---------- JSON report ----------
function groupByFile(items, valueKey) {
  const out = {};
  for (const item of items) {
    if (!out[item.file]) out[item.file] = [];
    out[item.file].push(item[valueKey] ?? item);
  }
  return out;
}

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  filesScanned: files.length,
  filesChanged,
  summary: {
    rewritten: rewrites.length,
    unresolved: unresolved.length,
    skippedExternal: skippedExternal.length,
  },
  rewritten: {
    total: rewrites.length,
    items: rewrites.map(({ file, from, to }) => ({ file, from, to })),
    byFile: groupByFile(
      rewrites.map(({ file, from, to }) => ({ file, change: { from, to } })),
      "change"
    ),
  },
  unresolved: {
    total: unresolved.length,
    items: unresolved.map(({ file, path }) => ({ file, path })),
    byFile: groupByFile(unresolved, "path"),
  },
  skippedExternal: {
    total: skippedExternal.length,
    items: skippedExternal.map(({ file, path }) => ({ file, path })),
    byFile: groupByFile(skippedExternal, "path"),
  },
};

mkdirSync(REPORTS_DIR, { recursive: true });
writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
console.log(`${DIM}Report: ${relative(ROOT, REPORT_PATH)}${RESET}\n`);

// Exit non-zero if any link remained unresolved — CI must fail so a human adds
// a canonical mapping or allowlist entry instead of leaving a dead link.
process.exit(unresolved.length > 0 ? 1 : 0);
