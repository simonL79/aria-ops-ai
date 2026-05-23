## Fix JSON-LD ImageObject check (failing in CI)

### Root cause
The source already emits `Person.image` as a proper `ImageObject` 1920×1080 from `SimonClusterPage.tsx`, and all six suppression pages pass a `heroImage`. The check still failed because `.github/workflows/jsonld-image-check.yml` triggers on `push: branches: [main]` and runs `scripts/check-jsonld-images.mjs` against `https://www.ariaops.co.uk` **immediately** — before the Lovable production deploy of that same commit has gone live. The headless Playwright probe times out waiting (max 15s) for a `Person` JSON-LD node that production hasn't shipped yet, `findPerson` returns null on the stale HTML, and the script exits 1.

(`post-publish-seo-checks.yml` already gates itself on `wait-for-deploy.mjs` for exactly this reason. The standalone `jsonld-image-check` workflow does not.)

### Change
In `.github/workflows/jsonld-image-check.yml`, add a `wait-for-deploy` step before running the check, mirroring the pattern in `post-publish-seo-checks.yml`:

1. Keep the existing Playwright install (it's already required for `check-jsonld-images.mjs` with `RENDER=1`).
2. Add a new step that runs `node scripts/wait-for-deploy.mjs` with `BASE_URL` set to the same target. This polls each suppression page until the rendered `og:image` matches the page-specific `/og/<slug>.jpg`, which is a reliable "the latest build is live" signal.
3. Then run `node scripts/check-jsonld-images.mjs` as today.

Schedule runs (`cron 06:15 UTC`) and `workflow_dispatch` runs will sail through `wait-for-deploy` instantly (production is already live), so this only adds latency on the push trigger — which is exactly where the race lives.

No script changes. No JSON-LD changes. Source already satisfies the assertion.

### Out of scope
- Re-tuning `wait-for-deploy.mjs` timeouts.
- Any change to the Person/ImageObject schema or hero images.
- The other workflows we already repaired for the `node_version` typo.
