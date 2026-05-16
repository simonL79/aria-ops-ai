## Audit results (production: www.ariaops.co.uk)

Measured on `/`, mobile viewport:

| Metric | Now | Target |
|---|---|---|
| FCP | 1.99s | <1.5s |
| Full load | 2.55s | <2.0s |
| Main JS bundle | **389 KB** (one chunk) | <150 KB initial |
| LCP image | **225 KB PNG** | <60 KB WebP |
| CLS | 0.068 (65 shifts) | <0.02 |
| Render-blocking CSS | 22 KB | fine, leave |
| 4xx errors on landing | **3** (vite.svg 404, supabase 401×3, 406×3) | 0 |
| Eager route imports | **80+** in App.tsx | ~5 (rest lazy) |

### Verdict

Not optimised. The site loads in ~2.5s on a good connection, but every visitor — including someone landing on a tiny `/simon-lindsay/ksl` page — downloads the entire app's 389 KB JS bundle plus a 225 KB hero PNG. There are also broken requests firing on every page load.

---

## Plan: 6 fixes, ordered by impact

### 1. Route-level code splitting (biggest win, ~60% bundle cut)

`src/App.tsx` statically imports 80+ page components, so they all end up in one chunk. Convert every page import to `React.lazy()` and wrap `<Routes>` in `<Suspense fallback={<PageLoader />}>`. Keep `Index` and `Authentication` eager (likely first-paint).

Expected: 389 KB → ~140 KB initial JS. Each route becomes its own ~10–40 KB chunk loaded on navigation.

### 2. Optimise the LCP image (~165 KB saved)

`/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png` (225 KB) is the hero logo/image.

- Re-encode as WebP (likely <60 KB) and AVIF, keep PNG as fallback via `<picture>`.
- Add `<link rel="preload" as="image" href="/og/hero.webp" fetchpriority="high" type="image/webp">` to `index.html`.
- Set explicit `width`/`height` on the `<img>` to kill its layout shift.

### 3. Fix the broken favicon (`vite.svg` 404, 1.16s wasted)

`index.html` references `/vite.svg` which doesn't exist in `public/`. Replace with a real favicon (`/favicon.ico` or `/favicon.svg`) — the 1.16s "other" resource is purely this 404 retry path.

### 4. Defer non-critical landing queries

Three Supabase calls fire during initial paint on `/`:
- `monitored_platforms?select=count` (1.14s)
- `system_config?select=…` (1.14s)
- `functions/v1/ai-news-feed` (886ms)

Plus repeated 401/406 `system_config` writes (probably from `useAnubisSystemIntegration` running for anon users). Gate these behind:
- `useAuth().user` (skip if not signed in), or
- `useEffect` with `requestIdleCallback`, so they don't compete with FCP.

This alone will probably knock 300–500ms off perceived load.

### 5. Fix the animated-cursor CLS (0.022 of 0.068)

`span.inline-block.w-[3px].h-[0.9em].bg-primary.ml-1.animate-pulse.align-text-bottom` is shifting layout. Wrap typewriter/cursor text in a fixed-width container or use `min-height` on the parent so the cursor doesn't push neighbours.

### 6. Audit + lazy-load the heavy graph/ML deps

`package.json` bundles:
- `@huggingface/transformers` — tens of MB on disk; if it's only used in one admin page, it must be dynamically `import()`-ed inside that page, never at module top-level.
- `cytoscape` + `react-cytoscapejs` + `react-force-graph-2d` + `recharts` — same: admin-only, must be route-split (covered by #1).
- `@clerk/clerk-react` — repo uses Supabase auth elsewhere. If Clerk isn't actually wired in, remove it (it auto-bundles ~80 KB).

I'll grep for each before deleting/lazy-loading anything.

---

## Technical notes

- Use `React.lazy(() => import("./pages/Foo"))`; no need to change Vite config — Vite/Rollup handles chunking automatically once imports are dynamic.
- For the image, drop the optimised files into `public/og/` (or `src/assets/` if imported from a component) — don't run `vite-imagetools` yet; that's a separate decision.
- I'll leave the CI workflow changes (Playwright cache, OG render test) alone — those are already settled.

## Out of scope (ask if you want these too)

- SSR/Next.js migration for true social-preview SEO (large project change).
- `vite-imagetools` plugin (adds build complexity; one-shot encoding is fine for now).
- Replacing Supabase polling with realtime subscriptions.
- Service worker / offline support.

## Verification

After implementing, I'll re-run the browser performance profile against production once you publish, and report the new numbers side-by-side with the table above.