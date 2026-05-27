## Goal

Position A.R.I.A as **"reputation intelligence for the AI-driven internet"** — covering the Human Web, LLM Web, and Agentic Web — and turn it into a sellable service: **AI Reputation Readiness**.

## What to build

### 1. New pillar page: `/ai-reputation-readiness`

Premium service landing page with these sections:
- Hero: "Reputation intelligence for the AI-driven internet" + sub: "The next web won't just be searched — it will be interpreted by AI."
- The Three Webs framework (Human / LLM / Agentic) — three-card grid explaining each layer and the question it answers ("Can people find me?" / "What does AI think I am?" / "Would an AI choose me?")
- What we check (audit checklist): Google surface, AI tool answers, negative associations, missing authority content, trust signals, agent-recommendation likelihood
- Who it's for: executives, founders, athletes, brands, investors
- The 5 client questions (Google, AI tools, name search risks, agent recommendation, structured presence)
- CTA → audit request form
- FAQ + JSON-LD (Service + FAQPage schema)

### 2. Lead magnet: AI Reputation Readiness Audit request

- Reuse existing `ScanRequestForm` pattern, or extend `reputation_scan_submissions` with a `scan_type` field (`standard` | `ai_readiness`) — additive, no destructive schema changes
- Embedded on the new pillar page and linked from homepage

### 3. Homepage repositioning (light touch)

- Update `HeroSection` tagline to reference the AI-driven internet
- Add a 5th service card to `ServicesSection.tsx` for "AI Reputation Readiness" (icon: Bot/Brain) linking to `/ai-reputation-readiness`
- Or replace one of the four — recommend **adding** as a featured 5th in a highlighted row above the existing four

### 4. Blog post

- New post in `src/data/blog/ariaPosts.ts`: "The Three Webs: Why Reputation Now Means Being Understood by AI" — uses the framework copy verbatim from your message
- Cross-links to the pillar page

### 5. SEO + discoverability

- Add `/ai-reputation-readiness` to `public/sitemap.xml` (priority 0.9)
- Add to `public/llms.txt` under Pages
- Add route in `src/App.tsx`

## Open questions

1. **Service card placement** — add as 5th card (recommended), or replace one of the existing four?
2. **Pricing** — show a price (e.g. "Audit from £497") or keep gated behind a request form?
3. **Audit deliverable** — what does the client actually receive? (PDF report, dashboard, call?) This shapes the form copy and follow-up.
4. **Homepage hero rewrite** — keep current tagline and add a secondary line, or fully reposition the hero around the AI-driven internet message?

Answer those and I'll build it.
