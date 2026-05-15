# GSC URL Inspection — manual submission checklist

The Lovable Google Search Console connector does not proxy the URL
Inspection API (`searchconsole.googleapis.com/v1/urlInspection/index:inspect`),
and the connected account currently lacks Owner/Full access on
`https://www.ariaops.co.uk/` (sitemap submission returns 403). Until
both are fixed, submit the following URLs manually:

1. Open https://search.google.com/search-console
2. Select property: `https://www.ariaops.co.uk/`
3. For each URL below: paste into the top inspection bar, then click
   **Request Indexing** when the modal finishes.

| Query target                | URL to inspect |
|-----------------------------|----------------|
| Simon Lindsay KSL           | https://www.ariaops.co.uk/simon-lindsay/ksl |
| Simon Lindsay Glasgow       | https://www.ariaops.co.uk/simon-lindsay/glasgow |
| KSL Hair Simon Lindsay      | https://www.ariaops.co.uk/simon-lindsay/ksl-hair |
| Simon Lindsay reviews       | https://www.ariaops.co.uk/simon-lindsay/reviews |
| Simon Lindsay bankruptcy    | https://www.ariaops.co.uk/simon-lindsay/bankruptcy |
| KSL Hair complaints         | https://www.ariaops.co.uk/simon-lindsay/ksl-hair-complaints |

Also submit the image sitemap once via **Sitemaps → Add a new sitemap**:
`https://www.ariaops.co.uk/image-sitemap.xml`

## Tracking pickup in Google Images

`scripts/track-google-images.mjs` (powered by SerpAPI) polls each
target query and records:

- whether the suppression page is in the image results (and at what rank)
- whether the exact `/og/*.jpg` hero is the source image

Run on demand:

```
SERPAPI_API_KEY=… node scripts/track-google-images.mjs
```

A scheduled GitHub Action (`.github/workflows/google-images-tracker.yml`)
runs this daily and uploads the JSON report as a build artifact, so
you can watch the `heroLive` column flip from `no` → `YES` over time.

## Unblocking programmatic inspection later

Two things need to change before this can be automated:

1. The connected Google account must be added as an **Owner** (or
   Full user) on the `https://www.ariaops.co.uk/` GSC property.
2. The Lovable connector gateway needs to expose the
   `searchconsole/v1/urlInspection/index:inspect` path (or we drop
   the gateway and call Google directly with a service-account JWT
   plus the GSC scope).
