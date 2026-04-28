#!/usr/bin/env node
/**
 * Interactive triage for unresolved internal links.
 *
 * Workflow:
 *   1. Run the rewriter once to refresh reports/route-rewrite.json.
 *   2. For each unresolved link, prompt the operator with choices:
 *        m) Map → pick a registered route (or type a custom target)
 *        a) Allowlist → add a regex to ignoredLinkPaths
 *        s) Skip this link for now
 *        q) Quit triage (apply choices made so far)
 *   3. Persist edits to scripts/route-canonical-map.json and
 *      scripts/route-integrity.allowlist.json.
 *   4. Re-run the full heal loop and print final status.
 *
 * Usage:
 *   node scripts/triage-broken-links.mjs            # interactive
 *   node scripts/triage-broken-links.mjs --dry-run  # show plan, don't write
 *   node scripts/triage-broken-links.mjs --auto-allowlist  # allowlist all unresolved (no prompts)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const REPORT = join(ROOT, "reports/route-rewrite.json");
const MAP_PATH = join(__dirname, "route-canonical-map.json");
const ALLOWLIST_PATH = join(__dirname, "route-integrity.allowlist.json");
const REWRITER = join(__dirname, "rewrite-broken-links.mjs");
const HEAL = join(__dirname, "heal-routes.mjs");

const DRY_RUN = process.argv.includes("--dry-run");
const AUTO_ALLOW = process.argv.includes("--auto-allowlist");

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

// ---------- step 1: refresh report ----------
console.log(`${CYAN}▶ Refreshing rewrite report…${RESET}`);
const refresh = spawnSync("node", [REWRITER], { stdio: "pipe", encoding: "utf8" });
// Exit code 1 = unresolved links present, which is exactly what we want to triage.
if (refresh.status !== 0 && refresh.status !== 1) {
  console.error(`${RED}Rewriter crashed:${RESET}\n${refresh.stderr || refresh.stdout}`);
  process.exit(refresh.status ?? 2);
}
if (!existsSync(REPORT)) {
  console.error(`${RED}No report at ${REPORT}.${RESET}`);
  process.exit(2);
}
const report = JSON.parse(readFileSync(REPORT, "utf8"));
const unresolved = report.unresolved.items ?? [];

if (unresolved.length === 0) {
  console.log(`${GREEN}✓ No unresolved links — nothing to triage.${RESET}`);
  process.exit(0);
}

// Group by path so the operator decides once per unique path, not per occurrence.
const byPath = new Map();
for (const { file, path } of unresolved) {
  if (!byPath.has(path)) byPath.set(path, new Set());
  byPath.get(path).add(file);
}

console.log(
  `\n${BOLD}${YELLOW}${byPath.size} unique unresolved path(s) across ${unresolved.length} occurrence(s).${RESET}\n`
);

// ---------- load configs ----------
const map = JSON.parse(readFileSync(MAP_PATH, "utf8"));
const allowlist = JSON.parse(readFileSync(ALLOWLIST_PATH, "utf8"));

// Pull registered routes from App.tsx + nav-items.tsx for a quick suggestion menu.
const appSrc = readFileSync(join(ROOT, "src/App.tsx"), "utf8");
const navSrc = readFileSync(join(ROOT, "src/nav-items.tsx"), "utf8");
const registered = new Set();
for (const m of appSrc.matchAll(/<Route[^>]*\spath=["']([^"']+)["']/g)) registered.add(m[1]);
for (const m of navSrc.matchAll(/to:\s*["']([^"']+)["']/g)) registered.add(m[1]);
const registeredArr = [...registered].filter((r) => !r.includes(":") && !r.endsWith("*")).sort();

// Suggest the closest existing route (longest shared prefix).
function suggest(path) {
  let best = "";
  for (const r of registeredArr) {
    const len = sharedPrefix(path, r);
    if (len > best.length) best = r;
  }
  return best || "/";
}
function sharedPrefix(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return a.slice(0, i);
}

// Escape a literal path into an anchored regex for the allowlist.
function pathToAllowlistRegex(p) {
  const esc = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return `^${esc}(/.*)?$`;
}

// ---------- step 2: prompt per path ----------
const rl = createInterface({ input: stdin, output: stdout });
function ask(q) {
  return new Promise((res) => rl.question(q, (a) => res(a.trim())));
}

const decisions = []; // { path, action: 'map'|'allow'|'skip', target?, regex? }

for (const [path, files] of byPath) {
  console.log(`\n${BOLD}${YELLOW}${path}${RESET}  ${DIM}(${files.size} file${files.size > 1 ? "s" : ""})${RESET}`);
  for (const f of files) console.log(`  ${DIM}↳ ${f}${RESET}`);

  if (AUTO_ALLOW) {
    const regex = pathToAllowlistRegex(path);
    decisions.push({ path, action: "allow", regex });
    console.log(`  ${CYAN}auto-allowlist:${RESET} ${regex}`);
    continue;
  }

  const suggested = suggest(path);
  console.log(`  ${DIM}Suggested target: ${CYAN}${suggested}${RESET}`);
  console.log(
    `  ${BOLD}m${RESET})ap to route   ${BOLD}a${RESET})llowlist (regex)   ${BOLD}s${RESET})kip   ${BOLD}q${RESET})uit`
  );
  const choice = (await ask("  > ")).toLowerCase();

  if (choice === "q") break;
  if (choice === "" || choice === "s") {
    decisions.push({ path, action: "skip" });
    continue;
  }
  if (choice === "a") {
    const def = pathToAllowlistRegex(path);
    const r = await ask(`    Regex (default ${def}): `);
    decisions.push({ path, action: "allow", regex: r || def });
    continue;
  }
  if (choice === "m") {
    console.log(`    ${DIM}Pick a registered route or type a custom path.${RESET}`);
    registeredArr.slice(0, 15).forEach((r, i) => console.log(`      ${i + 1}) ${r}`));
    const t = await ask(`    Target [Enter=${suggested}]: `);
    let target = t || suggested;
    const idx = parseInt(t, 10);
    if (!isNaN(idx) && registeredArr[idx - 1]) target = registeredArr[idx - 1];
    if (!target.startsWith("/")) {
      console.log(`    ${RED}Target must start with /. Skipping.${RESET}`);
      decisions.push({ path, action: "skip" });
      continue;
    }
    decisions.push({ path, action: "map", target });
    continue;
  }
  decisions.push({ path, action: "skip" });
}
rl.close();

// ---------- step 3: apply ----------
const mapped = decisions.filter((d) => d.action === "map");
const allowed = decisions.filter((d) => d.action === "allow");
const skipped = decisions.filter((d) => d.action === "skip");

console.log(
  `\n${BOLD}Plan:${RESET} ${GREEN}${mapped.length} mapped${RESET}, ${CYAN}${allowed.length} allowlisted${RESET}, ${DIM}${skipped.length} skipped${RESET}`
);
for (const d of mapped) console.log(`  ${GREEN}map${RESET} ${d.path} → ${d.target}`);
for (const d of allowed) console.log(`  ${CYAN}allow${RESET} ${d.regex}`);

if (mapped.length === 0 && allowed.length === 0) {
  console.log(`${YELLOW}Nothing to apply. Exiting.${RESET}`);
  process.exit(0);
}

if (DRY_RUN) {
  console.log(`\n${YELLOW}--dry-run: no files written.${RESET}`);
  process.exit(0);
}

for (const { path, target } of mapped) map.rewrites[path] = target;
for (const { regex } of allowed) {
  if (!allowlist.ignoredLinkPaths.includes(regex)) allowlist.ignoredLinkPaths.push(regex);
}
writeFileSync(MAP_PATH, JSON.stringify(map, null, 2) + "\n");
writeFileSync(ALLOWLIST_PATH, JSON.stringify(allowlist, null, 2) + "\n");
console.log(`${GREEN}✓ Updated config files.${RESET}`);

// ---------- step 4: rerun heal loop ----------
console.log(`\n${CYAN}▶ Rerunning heal loop…${RESET}`);
const final = spawnSync("node", [HEAL], { stdio: "inherit" });
process.exit(final.status ?? 1);
