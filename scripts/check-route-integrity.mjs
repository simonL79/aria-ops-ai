#!/usr/bin/env node
/**
 * Route integrity check.
 * Fails the build if pages are missing, orphaned, links are broken, or routes duplicated.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = join(ROOT, "src");
const PAGES = join(SRC, "pages");

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

const allowlist = JSON.parse(
  readFileSync(join(__dirname, "route-integrity.allowlist.json"), "utf8")
);
const ignoredLinkRegexes = allowlist.ignoredLinkPaths.map((p) => new RegExp(p));
const ignoredOrphanPages = new Set(allowlist.ignoredOrphanPages);

// ---------- file walking ----------
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, out);
    else if (/\.(tsx?|jsx?)$/.test(entry)) out.push(full);
  }
  return out;
}

const allSrcFiles = walk(SRC);
const allPageFiles = walk(PAGES).filter((f) => f.endsWith(".tsx"));

// Strip JS/TS line + block comments to avoid false positives.
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:\\])\/\/[^\n]*/g, "$1");
}

// ---------- parse App.tsx ----------
const appPath = join(SRC, "App.tsx");
const navPath = join(SRC, "nav-items.tsx");
const appSrc = stripComments(readFileSync(appPath, "utf8"));
const navSrc = stripComments(readFileSync(navPath, "utf8"));

function extractImports(src, fromFile) {
  const re = /import\s+(?:[\w*\s{},]+?\s+from\s+)?["']([^"']+)["']/g;
  const imports = [];
  let m;
  while ((m = re.exec(src))) {
    const spec = m[1];
    if (!spec.startsWith(".")) continue;
    if (!/\/pages\//.test(spec) && !spec.startsWith("./pages/")) continue;
    const abs = resolve(dirname(fromFile), spec);
    imports.push({ spec, abs });
  }
  return imports;
}

function resolvePageImport(abs) {
  const candidates = [abs + ".tsx", abs + ".ts", join(abs, "index.tsx"), join(abs, "index.ts")];
  return candidates.find((c) => existsSync(c));
}

const pageImportsApp = extractImports(appSrc, appPath);
const pageImportsNav = extractImports(navSrc, navPath);
const allPageImports = [...pageImportsApp, ...pageImportsNav];

const importedPageFiles = new Set();
const missingImports = [];
for (const imp of allPageImports) {
  const resolved = resolvePageImport(imp.abs);
  if (!resolved) missingImports.push(imp.spec);
  else importedPageFiles.add(resolved);
}

// ---------- extract registered routes ----------
const routeRe = /<Route[^>]*\spath=["']([^"']+)["']/g;
const navItemsRe = /to:\s*["']([^"']+)["']/g;
const registeredRoutes = [];
let rm;
while ((rm = routeRe.exec(appSrc))) registeredRoutes.push(rm[1]);
while ((rm = navItemsRe.exec(navSrc))) registeredRoutes.push(rm[1]);

const routeCounts = new Map();
for (const r of registeredRoutes) routeCounts.set(r, (routeCounts.get(r) ?? 0) + 1);
const duplicateRoutes = [...routeCounts.entries()].filter(([, c]) => c > 1);

// Build a matcher set. Replace :params with regex.
const routeMatchers = registeredRoutes.map((r) => ({
  raw: r,
  re: new RegExp("^" + r.replace(/:[^/]+/g, "[^/]+").replace(/\*$/, ".*") + "$"),
}));

function isRegistered(path) {
  if (ignoredLinkRegexes.some((re) => re.test(path))) return true;
  return routeMatchers.some((m) => m.re.test(path));
}

// ---------- scan internal links ----------
const linkPatterns = [
  /\bto=["'](\/[^"']*)["']/g,
  /\bto=\{["'](\/[^"']*)["']\}/g,
  /\bhref=["'](\/[^"']*)["']/g,
  /\bnavigate\(\s*["'](\/[^"']*)["']/g,
  /<Navigate[^>]*\sto=["'](\/[^"']*)["']/g,
];

const brokenLinks = [];
let totalLinks = 0;
for (const file of allSrcFiles) {
  if (file === appPath || file === navPath) continue;
  const src = stripComments(readFileSync(file, "utf8"));
  for (const re of linkPatterns) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src))) {
      const raw = m[1].split(/[?#]/)[0]; // strip query/hash
      totalLinks++;
      if (!isRegistered(raw)) {
        brokenLinks.push({ file: relative(ROOT, file), path: raw });
      }
    }
  }
}

// ---------- detect orphan page files ----------
const orphans = [];
for (const file of allPageFiles) {
  if (importedPageFiles.has(file)) continue;
  const rel = relative(PAGES, file).replaceAll("\\", "/");
  if (ignoredOrphanPages.has(rel)) continue;
  orphans.push(rel);
}

// ---------- report ----------
const failures = [];
console.log("\nRoute Integrity Check");
console.log("─────────────────────");
console.log(`${GREEN}✓${RESET} ${importedPageFiles.size} page modules imported`);
console.log(
  `${duplicateRoutes.length === 0 ? GREEN + "✓" : RED + "✗"}${RESET} ${registeredRoutes.length} routes registered (${duplicateRoutes.length} duplicates)`
);
console.log(`${GREEN}✓${RESET} ${totalLinks} internal links scanned\n`);

if (missingImports.length) {
  failures.push("missing imports");
  console.log(`${RED}✗ Missing page modules (${missingImports.length}):${RESET}`);
  for (const s of missingImports) console.log(`  - ${s}`);
  console.log();
}
if (duplicateRoutes.length) {
  failures.push("duplicate routes");
  console.log(`${RED}✗ Duplicate routes (${duplicateRoutes.length}):${RESET}`);
  for (const [path, count] of duplicateRoutes) console.log(`  - ${path} (${count}×)`);
  console.log();
}
if (orphans.length) {
  failures.push("orphan pages");
  console.log(`${RED}✗ Orphan page files (${orphans.length}, not imported by App.tsx or nav-items.tsx):${RESET}`);
  for (const o of orphans) console.log(`  - src/pages/${o}`);
  console.log(`  ${DIM}If intentional, add the relative path to scripts/route-integrity.allowlist.json → ignoredOrphanPages.${RESET}\n`);
}
if (brokenLinks.length) {
  failures.push("broken links");
  console.log(`${RED}✗ Broken internal links (${brokenLinks.length}):${RESET}`);
  const grouped = new Map();
  for (const { file, path } of brokenLinks) {
    if (!grouped.has(path)) grouped.set(path, []);
    grouped.get(path).push(file);
  }
  for (const [path, files] of grouped) {
    console.log(`  ${YELLOW}${path}${RESET}`);
    for (const f of files) console.log(`    ${DIM}↳ ${f}${RESET}`);
  }
  console.log(`  ${DIM}If intentional (external/dynamic), add a regex to scripts/route-integrity.allowlist.json → ignoredLinkPaths.${RESET}\n`);
}

if (failures.length) {
  console.log(`${RED}Route integrity check FAILED: ${failures.join(", ")}.${RESET}\n`);
  process.exit(1);
} else {
  console.log(`${GREEN}Route integrity check passed.${RESET}\n`);
}
