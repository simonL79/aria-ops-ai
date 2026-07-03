## A.R.I.A™ Phase 2 — Intelligence Platform Expansion

**Prime directive:** Treat A.R.I.A as an operational AI intelligence platform, not a marketing website. Every interaction, component, label, page, navigation element, visualisation and content type reinforces that the user is accessing an operational intelligence system. Favour terminology — Intelligence, Assessment, Briefing, Threat, Analysis, Monitoring, Operations — where it improves clarity without hurting usability.

**Constraints (unchanged):** No redesign, no branding/colour/typography/nav/animation changes, no removal of existing functionality. Everything additive, built with the existing Tailwind tokens, shadcn primitives, and the existing `SEO` component. Reference tone: Palantir / Anduril / CrowdStrike.

**Working rule (STRICT):** Build each phase completely, test it, then STOP. I will not start the next phase until you approve.

---

### Core architectural decisions (from your feedback)
- **One content engine, not silos.** A single `content_items` table with a `type` discriminator (guide · report · research · case-study · tool · whitepaper · download · brief) powers everything. One editor, one renderer, one search, one tagging system, one JSON-LD schema generator.
- **Knowledge graph is the backbone.** A typed `content_links` graph connects every item to topics, threats, industries, professions, audiences, solutions, tools, reports and case studies. Nothing exists alone; no dead ends. This is the primary SEO + engagement asset.
- **Intelligence language everywhere:** Intelligence Report / Brief, Intelligence Centre (`/intelligence`), Operational Assets, "Read Intelligence Brief", "Search Intelligence…".
- **Programmatic taxonomy:** `/professions`, `/industries`, `/threat-types`, `/audiences`, `/solutions`. **No `/people`** (duplicate/thin/privacy risk).
- **Page authority strip** on content pages: Threat Level · Executive Risk · Detection Confidence · Updated · Reviewed · Verified.
- **Reusable intelligence visualisations** (data-driven, used everywhere): Threat Heatmap, Risk Matrix, Threat Timeline, Entity Graph, Search Visibility Chart, Sentiment Trend, Authority Score, SERP Snapshot, Brand Exposure Graph.

---

### Phase 1 — Data model, schema/graph engine & shared component kit  *(foundation)*
- Migration (additive; GRANTs + RLS; public `SELECT` on published rows, admin write via `has_role`): `content_items`, `content_categories`, `content_authors`, `content_links` (knowledge graph edges), `content_taxonomy` (professions/industries/threat-types/audiences/solutions), `content_leads`, `redirects`.
- `src/lib/schema/` — typed JSON-LD builders (Article, Report/Dataset, FAQPage, BreadcrumbList, Person/Author, Organization, SearchAction, Speakable, VideoObject) feeding the existing `SEO` `jsonLd` prop.
- `src/lib/graph/` — knowledge-graph resolver (related briefs, threats, industries, professions, case studies, reports, recommended/popular/newest) guaranteeing no dead ends.
- Shared kit (existing tokens/shadcn): `AuthorityStrip`, `IntelTimeline` (Incident→Detection→Investigation→Risk Score→Mitigation→Recovery→Monitoring), `TableOfContents`, `Breadcrumbs`, `AuthorByline`, `ReadingTime`, `SocialShare`, `FaqAccordion`, `RelatedIntel`, `NewsletterSignup`, `CtaBlock`, `ExpandableSection`, `StickySideNav`.
- Reusable viz primitives (recharts, already available): `ThreatHeatmap`, `RiskMatrix`, `SearchVisibilityChart`, `SentimentTrend`, `AuthorityScore`, `SerpSnapshot`, `BrandExposureGraph`, `EntityGraph`.
- **Test:** typecheck, render a scratch preview page mounting each component with sample data, verify schema builders emit valid JSON-LD. Then STOP for approval.

### Phase 2 — Intelligence Centre `/intelligence`
- `/intelligence` hub, `/intelligence/:category` (executive, athlete, founder, corporate, deepfakes, ai-monitoring, crisis, search-reputation, digital-threat-intel, research, guides, case-studies, reports), `/intelligence/:category/:slug` unified renderer for every `content_items.type`.
- Client-side "Search Intelligence…" with predictive suggestions + filters. Full Article/Report/FAQ/Breadcrumb/Author schema, authority strip, TOC, sticky nav, related intel from the graph, CTAs, newsletter.
- **Test:** seed 2–3 sample items per type, verify routing/search/graph/schema, Lighthouse spot check. STOP.

### Phase 3 — Pillar (capability) pages
- Ten capability pages via one `PillarLayout` (3–5k word capacity, expandable sections, auto-recommended supporting briefs from the graph): executive-reputation-management, reputation-intelligence, digital-reputation-protection, crisis-reputation-management, online-reputation-management, personal-reputation-management, executive-risk-monitoring, reputation-monitoring, search-engine-reputation (+ resolve overlap with existing `/ai-reputation-management` stealth page). STOP.

### Phase 4 — Programmatic generators
- Dynamic `/professions/:slug`, `/industries/:slug`, `/threat-types/:slug`, `/audiences/:slug`, `/solutions/:slug` from `content_taxonomy`: overview, common risks, threat scoring, recommended monitoring, examples, embedded viz, FAQs, related, CTA, unique metadata + canonical + schema + internal links. Thin-content guardrails (min fields before render/index). STOP.

### Phase 5 — Authority & Case Studies (same engine)
- Report renderer (executive summary, charts, stats, references/citations, PDF download, lead gate) and case-study renderer (problem/threat/`IntelTimeline`/actions/results/screenshots/stats/testimonial/downloads/related). Report templates seeded. STOP.

### Phase 6 — Interactive tools `/tools`
- Reputation Risk Score, Executive Exposure Calculator, Digital Footprint Scanner, Threat Score Calculator, Search Visibility Audit, Brand Trust Assessment. Shared `ToolShell`: scoring (reuse existing A.R.I.A scoring where available), recommendations, lead capture, downloadable report. STOP.

### Phase 7 — Ask A.R.I.A assistant + embedded dashboards
- Floating "Ask A.R.I.A" (bottom-right, all pages) that searches the content engine and answers via existing `chat` edge function + Lovable AI. Guide-embedded dashboards (e.g. Executive Risk Dashboard) composed from the viz primitives. STOP.

### Phase 8 — Global search, sitemaps/feeds, conversion, Admin CMS
- Global predictive intelligence search; extend sitemap for all content + image sitemap + RSS; automatic canonicals + pagination; contextual CTA system; Admin CMS (existing admin shell + `admin` role): author/manage all content types, categories, taxonomy, downloads, FAQs, scheduling, redirects, preview, graph/link tracking, metadata. STOP.

### Phase 9 (optional, needs explicit go-ahead) — Homepage repositioning
- Shift homepage narrative from "SaaS dashboard" to "intelligence capability". **Flag:** this touches the visual identity constraint, so it's isolated as a final, opt-in phase with before/after review — not bundled with the additive work.

---

### Technical notes
- Storage: existing Supabase project; new tables get explicit GRANTs + RLS; downloadable assets in a new storage bucket.
- Performance budget preserved (Lighthouse >90): route-level lazy loading, lazy images, hover-prefetch of linked briefs, recharts per-view.
- Accessibility: shadcn primitives, single `<main>`, labelled controls.
- Content authored by you — I build empty-state-friendly renderers, the engine, the graph, and seed taxonomy/sample rows only. No bulk AI article generation.

**Start:** Phase 1 only. I'll build it end-to-end, test, and stop for your approval before Phase 2.