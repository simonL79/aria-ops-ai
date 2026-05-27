## Goal

Build 5 deep, crawlable "stealth" landing pages — each owning one keyword cluster and one competitive lane. Stealth = full SEO surface (sitemap + llms.txt + JSON-LD + footer link) but absent from primary nav. Each page is engineered to outrank a specific competitor group on a specific intent.

## Competitive lane → page mapping

| # | Route | Competitors outflanked | Intent owned | Anchor query |
|---|-------|------------------------|--------------|--------------|
| 1 | `/ai-reputation-management` | Otterly AI, Peec AI, Scrunch AI | AI-native ORM (the lane they don't own — they only monitor, you defend) | "AI reputation management" |
| 2 | `/online-reputation-management-uk` | Igniyte, ReputationDefender, BrandYourself | UK ORM with AI layer (their core lane, fought on your hybrid edge) | "online reputation management UK" |
| 3 | `/suppress-negative-google-results` | Igniyte, ReputationDefender, Minc Law | Active suppression + removal + RTBF UK (high commercial intent) | "suppress negative Google results" |
| 4 | `/generative-engine-optimisation` | Otterly AI, Peec AI, Scrunch AI, Birdeye | GEO / AEO / AI Overview visibility (positioned as defence, not just tracking) | "generative engine optimisation" |
| 5 | `/executive-reputation-protection` | ReputationDefender, BrandYourself, Reputation.com | Founders, athletes, public figures, family (premium human-led, not SaaS) | "executive reputation protection" |

Each page covers 25–35 keywords from your block; no cannibalisation — keywords partitioned by intent.

## Page anatomy (applied to all 5)

Built on existing `PublicLayout` + `SEO` component, mirroring `AIReputationReadinessPage.tsx` so visual language stays consistent.

1. **Hero** — H1 with exact-match primary keyword, sub-headline with 2–3 secondary keywords, dual CTA (`/scan` + `/contact`).
2. **The problem** — 2–3 paragraphs naming the specific pain the competitor group fails on.
3. **The A.R.I.A approach** — 3-column capability grid (lucide icons).
4. **Keyword-cluster grid** — `What's covered` (same pattern just shipped on `/ai-reputation-readiness`), every targeted keyword surfaced as readable copy.
5. **Methodology** — 4–6 step numbered process tailored to the cluster (Detect → Classify → Suppress → Replace → Monitor variants).
6. **Comparison table** — A.R.I.A vs the named competitor archetype for that page (e.g. page 1 = "AI visibility monitor (Otterly/Peec/Scrunch)" vs A.R.I.A; page 2 = "Traditional UK ORM agency" vs A.R.I.A). 6–8 rows. This is the outranking weapon — competitors don't publish comparison pages against themselves, so we own the comparative SERP.
7. **Proof / trust band** — anonymised case-study tiles, SOC II / ISO 27001 / GDPR badges (reuse existing components).
8. **FAQ** — 6–8 People-Also-Ask-style questions (surfaces in Google PAA + AI Overviews).
9. **Internal-link rail** — links the other 4 stealth pages + `/ai-reputation-readiness` + relevant Simon Lindsay cluster pages.
10. **CTA band** — audit request.
11. **JSON-LD** — `Service` + `FAQPage` + `BreadcrumbList` on every page.

Target 1,800–2,500 words per page (your competitors' equivalent pages average ~1,200 — depth wins this category).

## Differentiation baked in

Every page leads with the same positioning statement so Google clusters them topically:
> "AI-era reputation intelligence for founders, athletes, public figures and brands — combining online reputation protection, AI search visibility, threat scoring and human-led crisis response."

Wedge angles per page:
- vs **Otterly/Peec/Scrunch**: "They tell you what AI says. A.R.I.A changes what AI says."
- vs **Igniyte/ReputationDefender**: "Traditional ORM ends at Google. A.R.I.A defends across ChatGPT, Gemini and Perplexity too."
- vs **Meltwater/Brandwatch**: "Listening tools surface noise. A.R.I.A scores threats and responds."
- vs **BrandYourself**: "Self-serve dashboards leave you to do the work. A.R.I.A is operator-delivered."

## SEO wiring

- `SEO` component per page (title <60 chars, description <160 chars, canonical, og, JSON-LD).
- Single H1, semantic H2/H3 hierarchy, alt text on all imagery.
- Each page added to `public/sitemap.xml` at `priority 0.9`, `changefreq monthly`.
- Each page added to `public/llms.txt` under a new `## Solutions` section with keyword-rich descriptions (so ChatGPT/Perplexity surface them).
- Lazy routes in `src/App.tsx`.
- Discreet "Solutions" column added to the footer linking all 5 — clean internal-link signal without nav bloat.
- Hub section on `/ai-reputation-readiness` linking down to all 5 → consolidates topical authority into one orchestrator page.

## Stealth posture

- Not added to header nav.
- Listed in footer + sitemap + llms.txt + JSON-LD `BreadcrumbList` (crawlable, not hidden — true cloaking is a Google penalty).
- No `noindex`. "Stealth" here = low-noise in nav, high-signal to crawlers.

## Out of scope

- No DB migrations, no edge functions, no Supabase changes.
- No design-system changes.
- No homepage hero rewrite.
- No paid-ads landing variants (follow-up).
- No `keyword_targets` seeding (frontend-only).

## Files to create / edit

**Create (5):**
- `src/pages/stealth/AIReputationManagementPage.tsx`
- `src/pages/stealth/OnlineReputationManagementUKPage.tsx`
- `src/pages/stealth/SuppressNegativeGoogleResultsPage.tsx`
- `src/pages/stealth/GenerativeEngineOptimisationPage.tsx`
- `src/pages/stealth/ExecutiveReputationProtectionPage.tsx`

**Edit (4):**
- `src/App.tsx` — 5 lazy imports + 5 routes
- `public/sitemap.xml` — 5 `<url>` entries
- `public/llms.txt` — new `## Solutions` section with 5 entries
- `src/components/layout/Footer.tsx` (or equivalent) — discreet "Solutions" column
- `src/pages/AIReputationReadinessPage.tsx` — hub link block to all 5

## Open questions

1. **Footer visibility** — discreet "Solutions" column (stronger SEO via internal links), or fully invisible (sitemap + llms.txt only, more stealth, weaker ranking signal)?
2. **Pricing on stealth pages** — show indicative pricing ("Audits from £497"), or keep fully gated behind the audit-request form like existing pages?
3. **Link to Simon Lindsay cluster** — should these 5 pages cross-link into `/simon-lindsay/*` (boosts the personal cluster), or stay strictly separated from the personal-brand pages?