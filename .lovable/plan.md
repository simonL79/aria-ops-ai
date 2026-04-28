# Build-time route integrity check

Add a script that runs during the Vite build (via a plugin) and **fails the build** if any route or page is unreachable. This enforces what we just cleaned up so it never regresses.

## What it validates

For every build, the check parses `src/App.tsx`, `src/nav-items.tsx`, and every file under `src/pages/`, then enforces these rules:

1. **No missing page modules** — every `import` from `./pages/...` must resolve to a real `.tsx` file. (Catches dangling imports after a deletion.)
2. **No orphan page files** — every `.tsx` under `src/pages/` (excluding `NotFound.tsx`, `Index.tsx`, and `*/index.tsx` barrels) must be imported by either `App.tsx` or `nav-items.tsx`.
3. **No broken internal links** — every literal `to="/..."` and `navigate("/...")` string in `src/**/*.{ts,tsx}` must match a registered route in `App.tsx` or `nav-items.tsx`. Dynamic params (`/blog/:slug`) match by prefix. URLs with query strings/hashes are normalized.
4. **No duplicate routes** — the same path cannot be registered twice across `App.tsx` and `nav-items.tsx`.

Strings inside `node_modules`, generated files, comments, and template-literal expressions are skipped. A small allowlist file (`scripts/route-integrity.allowlist.json`) covers external URLs and intentional exceptions (e.g., `/portal/*` sub-routes generated dynamically).

## Implementation

**New files:**
- `scripts/check-route-integrity.mjs` — pure Node script. Uses regex parsing (no AST deps) to extract:
  - imports from `./pages/...` in `App.tsx` + `nav-items.tsx`
  - `<Route path="...">` entries in `App.tsx`
  - `to: "/..."` entries in the `navItems` array
  - `to="/..."`, `to={"..."}`, `href="/..."`, and `navigate("/...")` literals across `src/**`
  - all `.tsx` files under `src/pages/`
  Then cross-references them and prints a categorized report. Exits `1` on any violation.
- `scripts/route-integrity.allowlist.json` — array of regex patterns for paths to ignore (external URLs, wildcards, anchors).
- `vite-plugins/route-integrity.ts` — tiny Vite plugin that runs the script in `buildStart` and throws on failure. Only active during `vite build` (skipped in `vite dev` to avoid slowing HMR).

**Edited files:**
- `vite.config.ts` — register the plugin.
- `package.json` — add a `check:routes` script (`node scripts/check-route-integrity.mjs`) so it can also be run manually.

## Output example

```
Route Integrity Check
─────────────────────
✓ 27 page modules imported
✓ 41 routes registered (0 duplicates)
✓ 138 internal links validated

✗ FAIL: src/pages/admin/FooPage.tsx is not imported anywhere
✗ FAIL: src/components/x.tsx links to "/old-route" which is not registered
```

Clean run prints only the green summary lines and exits `0`.

## Verification

After implementation, run:
- `node scripts/check-route-integrity.mjs` — must exit 0 against the current cleaned-up tree.
- Temporarily add a `<Link to="/does-not-exist">` somewhere → script exits 1.
- The Vite build (run automatically by the harness) must succeed.

## Out of scope

- No new test framework (Vitest/Jest install) — this is a build-time guard, not a unit test. Lighter, faster, and runs every build.
- No runtime navigation testing.
- No cleanup of layout sidebars (`DashboardSidebar`, `MainNav`) — but the new check will surface their stale links so they can be addressed next.
