#!/usr/bin/env node
/**
 * Runs the rewrite pass + integrity check in a loop until clean (or max iterations).
 * Usage: node scripts/heal-routes.mjs
 */
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REWRITE = resolve(__dirname, "rewrite-broken-links.mjs");
const CHECK = resolve(__dirname, "check-route-integrity.mjs");
const MAX = 5;

for (let i = 1; i <= MAX; i++) {
  console.log(`\n=== Heal pass ${i}/${MAX} ===`);
  const r = spawnSync("node", [REWRITE], { stdio: "inherit" });
  // Rewriter exits 1 ONLY when unresolved broken links remain (no canonical
  // mapping). That is a hard CI failure — no further passes can help.
  if (r.status !== 0) {
    console.error(`\n✗ Rewriter reported unresolved broken links. Add a mapping to scripts/route-canonical-map.json or scripts/route-integrity.allowlist.json.`);
    process.exit(r.status ?? 1);
  }
  const c = spawnSync("node", [CHECK], { stdio: "inherit" });
  if (c.status === 0) {
    console.log(`\n✓ Routes healed in ${i} pass(es).`);
    process.exit(0);
  }
  if (i === MAX) {
    console.error(`\n✗ Route integrity could not converge after ${MAX} passes.`);
    process.exit(1);
  }
}
