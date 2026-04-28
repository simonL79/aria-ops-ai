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
  if (r.status !== 0) process.exit(r.status ?? 1);
  const c = spawnSync("node", [CHECK], { stdio: "inherit" });
  if (c.status === 0) {
    console.log(`\n✓ Routes healed in ${i} pass(es).`);
    process.exit(0);
  }
  if (i === MAX) {
    console.error(`\n✗ Could not converge after ${MAX} passes. See errors above.`);
    process.exit(1);
  }
}
