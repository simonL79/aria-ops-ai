## Fix Post-deploy Google Images tracker workflow

The GitHub Action fails in ~25s because of three issues in `.github/workflows/google-images-tracker.yml` and the script it runs:

### 1. Invalid `setup-node` input
```yaml
- uses: actions/setup-node@v4
  with:
    node_version: '20'   # ❌ wrong key
```
The correct key is `node-version` (hyphen). With the wrong key, Node isn't pinned and the step config is rejected/ignored.

### 2. Writing to `/mnt/documents/` on a GitHub runner
`/mnt/documents/` is a Lovable sandbox path. On `ubuntu-latest` it doesn't exist and isn't writable, so both `mkdir -p` (silently swallowed by `|| true`) and the script's `writeFileSync` to `/mnt/documents/og-tracking/...` fail. Also the artifact upload path points to the same nonexistent directory.

Fix: write reports to a workspace-relative directory (e.g. `./og-tracking`) and upload from there. The script already supports this via `REPORT_DIR` env var — we just pass it in:
```yaml
env:
  SERPAPI_API_KEY: ${{ secrets.SERPAPI_API_KEY }}
  REPORT_DIR: ./og-tracking
run: |
  mkdir -p "$REPORT_DIR"
  node scripts/track-google-images.mjs
```
And:
```yaml
- uses: actions/upload-artifact@v4
  with:
    name: og-tracking-${{ github.run_id }}
    path: og-tracking/*.json
    if-no-files-found: ignore
```

### 3. `SERPAPI_API_KEY` missing in repo secrets
If the secret isn't configured, `scripts/track-google-images.mjs` exits 2 immediately ("SERPAPI_API_KEY missing"). The 25s failure window is consistent with checkout + setup-node + immediate script exit.

Action: confirm `SERPAPI_API_KEY` is set under repo → Settings → Secrets and variables → Actions. If you want, we can also make the workflow skip gracefully (instead of failing) when the secret is absent — say the word and I'll add a guard.

### Files to change
- `.github/workflows/google-images-tracker.yml` — fix `node-version`, switch report path to `./og-tracking`, pass `REPORT_DIR`, update artifact path.

No changes needed in `scripts/track-google-images.mjs` (it already honours `REPORT_DIR`).
