#!/usr/bin/env node
/**
 * Pre-deploy guard for the Supabase Edge Function slot cap.
 *
 * Supabase enforces a hard limit on the number of Edge Functions that can be
 * deployed per project. When that ceiling is hit, the next deploy silently
 * fails (or an unrelated function gets bumped). This script runs BEFORE a
 * deploy, counts the deployable functions in `supabase/functions/`, and:
 *
 *   1. FAILS (exit 1) if the count is at/over the cap, so CI blocks the deploy.
 *   2. WARNS if the count is within `SLOT_WARN_MARGIN` of the cap.
 *   3. Lists candidate functions that look safe to delete to free a slot —
 *      functions whose name is never referenced anywhere else in the repo
 *      (src/, other edge functions, config, workflows) and that are not on the
 *      protected keep-list (cron / webhook / shared-invoked functions).
 *
 * Env vars (all optional):
 *   EDGE_FUNCTION_CAP   integer cap to enforce            (default 100)
 *   SLOT_WARN_MARGIN    warn when free slots <= this      (default 5)
 *   FUNCTIONS_DIR       path to functions dir             (default supabase/functions)
 *
 * Usage:
 *   node scripts/check-edge-function-cap.mjs
 *   EDGE_FUNCTION_CAP=100 node scripts/check-edge-function-cap.mjs
 */

import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const CAP = Number.parseInt(process.env.EDGE_FUNCTION_CAP ?? '100', 10);
const WARN_MARGIN = Number.parseInt(process.env.SLOT_WARN_MARGIN ?? '5', 10);
const FUNCTIONS_DIR = process.env.FUNCTIONS_DIR ?? 'supabase/functions';

// Directories under supabase/functions that are NOT deployable functions.
const NON_FUNCTION_DIRS = new Set(['_shared', '_tests', '_utils']);

// Functions that MUST stay even if no static reference is found: they are
// triggered externally (pg_cron schedules, third-party webhooks) or invoked
// dynamically by other functions, so a repo-wide grep can't see the caller.
const PROTECTED = new Set([
  // pg_cron schedules
  'eidetic-autopilot',
  'eidetic-send-digest',
  'google-search-crawler',
  'requiem-cron',
  // webhook / provider-triggered
  'receive-article',
  'handle-email-suppression',
  'handle-email-unsubscribe',
  'send-transactional-email',
  // commonly invoked dynamically by other functions
  'slack-alert',
  // the new agent integration endpoint we are freeing a slot for
  'mcp',
]);

function listFunctions() {
  if (!existsSync(FUNCTIONS_DIR)) {
    console.error(`✗ functions dir not found: ${FUNCTIONS_DIR}`);
    process.exit(1);
  }
  return readdirSync(FUNCTIONS_DIR)
    .filter((name) => !name.startsWith('.') && !NON_FUNCTION_DIRS.has(name))
    .filter((name) => {
      try {
        return statSync(join(FUNCTIONS_DIR, name)).isDirectory();
      } catch {
        return false;
      }
    })
    .sort();
}

// Recursively collect text of every source file we want to scan for references,
// skipping the function's own directory so self-references don't count.
function collectRepoText(excludeDir) {
  const roots = ['src', FUNCTIONS_DIR, '.github/workflows', 'scripts', 'supabase/config.toml'];
  const chunks = [];
  const skipDirs = new Set(['node_modules', '.git', 'dist', 'build']);

  const walk = (path) => {
    let st;
    try {
      st = statSync(path);
    } catch {
      return;
    }
    if (st.isDirectory()) {
      if (path === excludeDir) return;
      for (const entry of readdirSync(path)) {
        if (skipDirs.has(entry)) continue;
        walk(join(path, entry));
      }
    } else if (st.isFile()) {
      if (/\.(ts|tsx|js|jsx|mjs|cjs|json|toml|yml|yaml|md)$/.test(path)) {
        try {
          chunks.push(readFileSync(path, 'utf8'));
        } catch {
          /* ignore unreadable file */
        }
      }
    }
  };

  for (const root of roots) walk(root);
  return chunks.join('\n');
}

const functions = listFunctions();
const count = functions.length;
const free = CAP - count;

console.log(`Edge Function slot check`);
console.log(`  cap:      ${CAP}`);
console.log(`  deployed: ${count}`);
console.log(`  free:     ${free}`);
console.log('');

function reportCandidates() {
  console.log('Candidate functions to delete (no static reference found, not protected):');
  let found = 0;
  for (const fn of functions) {
    if (PROTECTED.has(fn)) continue;
    const repoText = collectRepoText(join(FUNCTIONS_DIR, fn));
    // Match the function name as a whole token (invoke('name'), url "/name", etc).
    const re = new RegExp(`[\\"'\`/]${fn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\"'\`/]`);
    if (!re.test(repoText)) {
      console.log(`  • ${fn}`);
      found++;
    }
  }
  if (found === 0) {
    console.log('  (none found — every function is referenced or protected)');
    console.log('  Review supabase/functions/ manually to pick one to remove.');
  }
  return found;
}

if (count >= CAP) {
  console.error(`✗ Edge Function cap reached (${count}/${CAP}). Deployment blocked.`);
  console.error('  Free a slot by deleting an unused function before deploying.\n');
  reportCandidates();
  process.exit(1);
}

if (free <= WARN_MARGIN) {
  console.warn(`⚠ Only ${free} slot(s) left before the ${CAP} cap. Consider pruning soon.\n`);
  reportCandidates();
}

console.log(`✓ Under cap — deploy may proceed.`);
process.exit(0);
