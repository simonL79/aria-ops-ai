## Goal
Stop the standalone **OG render test (strict)** workflow from failing/timing out while preserving the actual validation that each Simon suppression page exposes the correct `/og/<slug>.jpg` image metadata.

## Findings
- `.github/workflows/og-render-test.yml` runs `scripts/test-og-rendered.mjs` directly against production.
- The script validates rendered Helmet metadata, including `og:image`, `twitter:image`, dimensions, and file dimensions.
- Live static HTML still contains the sitewide fallback image, so this workflow depends on JavaScript hydration and can fail if it runs before the latest production deploy is reflected or if Playwright waits too long per route.
- `post-publish-seo-checks.yml` already uses `scripts/wait-for-deploy.mjs` as the production-live gate before running the same strict render test.

## Plan
1. Update `.github/workflows/og-render-test.yml` to add a **Wait for production deploy** step before `Strict og:image render test`.
   - Use `node scripts/wait-for-deploy.mjs`.
   - Pass the same `BASE_URL` as the strict test.
   - Use the existing 30-minute timeout / 30-second interval pattern from `post-publish-seo-checks.yml`.

2. Align Playwright installation with the stable pattern already used elsewhere.
   - Replace the temporary `npm i --no-save playwright` install with `npx --yes playwright@1.47.0 install --with-deps chromium`.
   - This avoids dependency mutation and keeps the workflow consistent with the working SEO checks.

3. Harden `scripts/test-og-rendered.mjs` against CI runtime stalls without weakening assertions.
   - Change navigation from `waitUntil: 'networkidle'` to `waitUntil: 'domcontentloaded'`, matching the faster wait strategy used in `wait-for-deploy.mjs`.
   - Keep the explicit wait for the expected `og:image` after hydration.
   - Keep all strict assertions: exact `og:image`, exact `twitter:image`, `1920x1080`, `image/jpeg`, and served-file dimensions.

4. Update `.lovable/plan.md` with the root cause and applied fix for this workflow, replacing the previous JSON-LD-only note.

## Out of scope
- No queue/background-worker architecture: this failure is a GitHub Actions Playwright validation timeout/race, not Supabase Edge Function image generation.
- No changes to page content, SEO copy, JSON-LD schema, image assets, or the public site UI.