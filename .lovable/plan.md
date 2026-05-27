# Backlink Acquisition Engine — Build Plan

Three layers: (A) finish the stealth target-page set so every URL in the backlink campaign exists, (B) ship linkable assets so journalists, podcasters and bloggers have a reason to link, (C) wire the internal-link graph between `ariaops.co.uk` and `simon-lindsay.com` with rotated, varied anchor text.

## A. Stealth target pages (7 new)

Reuse the existing `StealthLandingPage` template — same anatomy, JSON-LD, FAQ, comparison table. One file each:

| Route | Cluster | Primary competitor lane |
|---|---|---|
| `/reputation-threat-score` | Threat scoring as a category | BrandYourself score, ReputationDefender scan |
| `/ai-search-visibility` | AI Overviews / ChatGPT / Perplexity visibility | Otterly, Peec, Scrunch |
| `/llm-reputation-management` | LLM-layer ORM | Otterly, Peec, BrandYourself |
| `/negative-search-result-suppression` | Suppression (alias of existing `/suppress-negative-google-results`, both live for anchor variety) | Igniyte, Minc, ReputationDefender |
| `/athlete-reputation-management` | Athletes, sponsorship-safe reputation | Reputation.com, BrandYourself |
| `/founder-reputation-protection` | Founders, exits, investor due-diligence reputation | ReputationDefender, BrandYourself |
| `/crisis-reputation-management` | Live crisis response | Igniyte, Status Labs |

Each page: exact-match H1, 1,800–2,500 words via the existing template, JSON-LD `Service` + `FAQPage` + `BreadcrumbList`, internal-link rail pointing to 3 sibling stealth pages and 1 linkable asset.

## B. Linkable assets (8 new)

Lightweight, high-utility pages designed to attract earned links. All under `/resources/`:

| Route | Type | Format |
|---|---|---|
| `/reputation-threat-score` (tool) | Free interactive scorer | Reuses the existing public threat-score UI; cross-linked as the "Free AI Reputation Threat Score" |
| `/resources/ai-reputation-readiness-checklist` | Checklist | 20-point checklist, copy-able, JSON-LD `HowTo` |
| `/resources/founder-reputation-risk-report` | Report template | Downloadable framework, JSON-LD `Article` |
| `/resources/athlete-reputation-protection-guide` | Long-form guide | 2,500-word guide, JSON-LD `Article` |
| `/resources/llm-visibility-audit-template` | Template | Auditable matrix (ChatGPT / Gemini / Perplexity / Copilot / AI Overviews), JSON-LD `HowTo` |
| `/resources/negative-search-suppression-guide` | Long-form guide | Step-by-step suppression playbook |
| `/resources/crisis-reputation-response-checklist` | Checklist | First-72-hours playbook |
| `/resources/ai-search-visibility-glossary` | Glossary | 40-term glossary with anchor IDs (huge for AI citations + deep-link backlinks) |

Shared `ResourceLayout` component so they all look consistent: hero, TL;DR, body, "How A.R.I.A helps" CTA band, JSON-LD.

## C. Internal-link graph

1. **A.R.I.A footer** — add a "Resources" column listing the 8 linkable assets, alongside the existing "Solutions" column.
2. **Stealth pages** — each target page links to 2 sibling stealth pages + 1 matching resource (e.g. `/athlete-reputation-management` → `/resources/athlete-reputation-protection-guide`).
3. **Resources** — each resource ends with a CTA linking to its matching target page using rotated anchor text from the supplied list.
4. **simon-lindsay.com ↔ ariaops.co.uk** — add an `ExternalAuthorityLinks` block:
   - On the existing `simon-lindsay/*` cluster pages and the new `/athlete-reputation-management` + `/founder-reputation-protection` pages, render outbound links to `simon-lindsay.com` with anchors: *commercial reputation protection for athletes*, *sports commercial strategist*, *athlete commercial management*.
   - Add a parallel inbound-link spec to `public/external-link-spec.md` listing the exact anchors `simon-lindsay.com` should use back to A.R.I.A: *AI reputation protection*, *sports reputation management*, *digital threat monitoring*. (We don't own simon-lindsay.com in this repo; the spec documents the canonical anchors for whoever maintains it.)

## D. Wiring

- `App.tsx` — 7 stealth + 8 resource lazy routes.
- `public/sitemap.xml` — 15 new `<url>` entries, priority 0.8 for resources, 0.9 for stealth.
- `public/llms.txt` — extend `## Solutions` with the new pages and add a `## Resources` section so LLMs surface the assets when asked "AI reputation checklist", "LLM visibility audit", etc.
- `Footer.tsx` — add "Resources" column.

## Out of scope

- No new DB tables, edge functions, design tokens, or homepage changes.
- No actual outreach automation — that's a separate workstream.
- No new threat-score logic — the existing public threat-score component is reused as the "free tool".
- We don't publish to simon-lindsay.com from this repo; only document the anchor spec.

## File count

- 7 new stealth pages
- 8 new resource pages + 1 `ResourceLayout`
- 1 new `ExternalAuthorityLinks` component
- 1 new `public/external-link-spec.md`
- Edits: `App.tsx`, `Footer.tsx`, `sitemap.xml`, `llms.txt`, existing `StealthLandingPage` (add internal-link rail prop if not already there), and the 2 simon-lindsay cluster touchpoints.

Roughly 20 new files, 6 edits.
