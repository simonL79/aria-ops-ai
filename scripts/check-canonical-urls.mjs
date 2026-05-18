#!/usr/bin/env node
/**
 * Static audit: every canonical and og:url in the codebase must use
 * https://www.ariaops.co.uk. Fails the build on any mismatch.
 *
 * Scans:
 *   - index.html
 *   - public/sitemap.xml, public/image-sitemap.xml
 *   - src/**\/*.{ts,tsx,js,jsx,html} for:
 *       <link rel="canonical" href="...">
 *       <meta property="og:url" content="...">
 *       JSX: <link rel="canonical" href={`...`} /> / href="..."
 *       JSX: <meta property="og:url" content={`...`} /> / content="..."
 *
 * Dynamic expressions (template literals / variables) are resolved against
 * known SITE_URL / BASE_URL constants declared in the same file. If a value
 * cannot be statically resolved, it's reported as UNRESOLVED and fails.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = join(ROOT, "src");
const CANONICAL_BASE = "https://www.ariaops.co.uk";

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, out);
    else if (/\.(tsx?|jsx?|html)$/.test(e)) out.push(full);
  }
  return out;
}

const files = [];
if (existsSync(SRC)) files.push(...walk(SRC));
for (const extra of ["index.html", "public/sitemap.xml", "public/image-sitemap.xml"]) {
  const p = join(ROOT, extra);
  if (existsSync(p)) files.push(p);
}

// Resolve simple `const NAME = "literal"` declarations per file.
function fileConstants(src) {
  const map = new Map();
  const re = /\bconst\s+([A-Z_][A-Z0-9_]*)\s*=\s*(['"`])([^'"`\n]+)\2/g;
  let m;
  while ((m = re.exec(src))) map.set(m[1], m[3]);
  return map;
}

// Resolve a captured attribute value (either quoted string or {jsx expression}).
function resolveValue(raw, consts) {
  const t = raw.trim();
  // Quoted string: "..." or '...'
  const q = t.match(/^(["'])(.*)\1$/s);
  if (q) return q[2];
  // JSX expression: {`...`} or {VAR} or {`${VAR}/path`}
  const expr = t.replace(/^\{|\}$/g, "").trim();
  // Template literal
  const tpl = expr.match(/^`(.*)`$/s);
  if (tpl) {
    let out = tpl[1];
    let prev;
    do {
      prev = out;
      out = out.replace(/\$\{([A-Z_][A-Z0-9_]*)\}/g, (_, n) => consts.get(n) ?? `\u0000UNRESOLVED:${n}\u0000`);
    } while (out !== prev);
    if (out.includes("\u0000")) return null;
    // Template might still contain ${expr} we can't resolve
    if (/\$\{/.test(out)) return null;
    return out;
  }
  // Bare identifier
  if (/^[A-Z_][A-Z0-9_]*$/.test(expr)) return consts.get(expr) ?? null;
  // String concat: SITE_URL + "/x"
  const concat = expr.match(/^([A-Z_][A-Z0-9_]*)\s*\+\s*(["'])([^"'\n]*)\2$/);
  if (concat) {
    const base = consts.get(concat[1]);
    return base ? base + concat[3] : null;
  }
  return null;
}

const patterns = [
  // <link rel="canonical" href=...>  (quoted or jsx expr)
  { kind: "canonical", re: /<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=(\{[^}]+\}|"[^"]*"|'[^']*')/g },
  { kind: "canonical", re: /<link\b[^>]*\bhref=(\{[^}]+\}|"[^"]*"|'[^']*')[^>]*\brel=["']canonical["']/g },
  // <meta property="og:url" content=...>
  { kind: "og:url",    re: /<meta\b[^>]*\bproperty=["']og:url["'][^>]*\bcontent=(\{[^}]+\}|"[^"]*"|'[^']*')/g },
  { kind: "og:url",    re: /<meta\b[^>]*\bcontent=(\{[^}]+\}|"[^"]*"|'[^']*')[^>]*\bproperty=["']og:url["']/g },
];

// XML sitemap <loc>
const locRe = /<loc>\s*([^<\s]+)\s*<\/loc>/g;

const findings = [];
let checked = 0;

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const consts = fileConstants(src);
  const rel = relative(ROOT, file);

  for (const { kind, re } of patterns) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src))) {
      checked++;
      const resolved = resolveValue(m[1], consts);
      if (resolved == null) {
        findings.push({ file: rel, kind, value: m[1], reason: "unresolved" });
        continue;
      }
      if (!resolved.startsWith(CANONICAL_BASE)) {
        findings.push({ file: rel, kind, value: resolved, reason: "wrong-host" });
      }
    }
  }

  if (file.endsWith(".xml")) {
    locRe.lastIndex = 0;
    let m;
    while ((m = locRe.exec(src))) {
      checked++;
      if (!m[1].startsWith(CANONICAL_BASE)) {
        findings.push({ file: rel, kind: "sitemap:loc", value: m[1], reason: "wrong-host" });
      }
    }
  }
}

console.log("\nCanonical / og:url audit");
console.log("────────────────────────");
console.log(`${DIM}Base:${RESET} ${CANONICAL_BASE}`);
console.log(`${DIM}Files scanned:${RESET} ${files.length}`);
console.log(`${DIM}Tags checked:${RESET} ${checked}\n`);

if (findings.length === 0) {
  console.log(`${GREEN}✓ All canonical and og:url values use ${CANONICAL_BASE}${RESET}\n`);
  process.exit(0);
}

console.log(`${RED}✗ ${findings.length} mismatch(es):${RESET}\n`);
for (const f of findings) {
  const tag = f.reason === "unresolved" ? YELLOW + "UNRESOLVED" : RED + "WRONG-HOST";
  console.log(`  ${tag}${RESET} [${f.kind}] ${f.file}`);
  console.log(`    ${DIM}${f.value}${RESET}`);
}
console.log();
process.exit(1);
