## Fix OG render test (strict) workflow + sweep `node_version` typo

### Root cause
Same bug as the Google Images tracker: `actions/setup-node@v4` is given `node_version:` (underscore) instead of `node-version:` (hyphen). Without the correct key, setup-node errors out / doesn't pin Node, and downstream `npx playwright install --with-deps chromium` ran for ~3 min before the job ultimately failed.

Six workflows have the same typo:
- `.github/workflows/og-render-test.yml`
- `.github/workflows/image-sitemap-audit.yml`
- `.github/workflows/jsonld-image-check.yml`
- `.github/workflows/og-image-check.yml`
- `.github/workflows/post-deploy-tracker.yml`
- `.github/workflows/post-publish-seo-checks.yml`

### Change
Sed-replace `node_version:` → `node-version:` in each of the six workflow files. No script changes; no other logic touched.

### Out of scope
If the OG render test continues to fail after the Node fix (e.g. real og:image mismatches against production), that's a content/asset issue we'd address in a follow-up — this plan only repairs the workflow plumbing.
