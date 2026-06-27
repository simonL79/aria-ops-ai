# ARIA — The Digital Protection Platform

**Master positioning:** ARIA is no longer "an AI reputation platform." It is **The Digital Protection Platform** — *"Protect your identity, reputation, legal position and digital footprint from a single AI-powered intelligence platform."*

**Single design principle every page must satisfy:**
> Every page should feel like the opening sequence of a premium Netflix documentary about intelligence, technology and influence — not a software dashboard.

The emotion on arrival: *"These people know more about me than I do."* We sell **certainty and protection**, not software.

Delivered in three review-gated passes.

---

## Language rules (global, non-negotiable)

- **Remove every public reference to "Online Reputation Management" / "ORM."** Replace with: Digital Protection, Digital Intelligence, Identity Protection, Executive Protection, AI Visibility, Reputation Intelligence.
- One idea per section. Pattern: **large cinematic image → one headline sentence → small paragraph → one CTA → scroll.** No feature-card grids.
- Minimal text, no SaaS icon clutter.

---

## Design language (applies everywhere)

**Palette — charcoal + minimal accent**
- Near-black charcoal base (`~240 10% 5%`), layered glass surfaces, violet `258 90% 66%` only as a precise accent/status colour. No violet-flooded backgrounds.

**Typography**
- Premium pairing via `@fontsource` (display `Outfit`/`Sora`, body `Inter`/`Figtree`), imported in `main.tsx`, wired in `tailwind.config.ts`. Big, sparse statements.

**Motion**
- Slow, cinematic: ambient drift, parallax, breathing nodes, pulsing filaments. Respect `prefers-reduced-motion`. No fast pulses, spinners, arcade scanlines.

**Imagery — cinematic, documentary-grade (not stock)**
- AI-generated ultra-wide scenes that *tell a story*, colour-graded to charcoal/violet:
  - Hero: dark command centre / analyst silhouette, curved OLED, world map (MI6 × Apple).
  - Story scenes: executive arriving by helicopter, boxer walking into an arena, founder on stage, political advisor, family at home, luxury office, media control room.
  - Legal Shield: judge's bench, contracts, athlete signing, business deal.
- Every image graded for cohesion; saved to `src/assets/`, large files externalised via lovable-assets. Alt text on all.

---

## Pass 1 — Hero + Active Digital Footprint (the signature)

**Hero (`HeroSection.tsx`)**
- Full-bleed cinematic command-centre image, charcoal gradient overlay for legibility.
- Headline candidates (curiosity-driven): **"Protect what the world believes about you."** / "Control the narrative before someone else does." / "Your digital identity is now your greatest asset." (I'll build with one and note the alternates as easy swaps.)
- Sub-line = the master positioning sentence. **One** primary CTA; secondary as a quiet text link.
- Drifting AI-node overlay. Remove grid lattice, colored blobs, and the pasted dashboard mockup.

**Active Digital Footprint** (new `ActiveFootprintSection.tsx`, replaces `ThreatScoreSection`)
- A living constellation, **not a dashboard**. Central ARIA core with breathing nodes radiating out: Google, AI Search, News, Social, Reviews, Forums, Dark Web, Corporate Records.
- Lines pulse; small "intelligence packets" travel along filaments toward the core. **Nothing numerical, no counters, no "last scan."** Just alive.
- SVG + lightweight animation; reduced-motion fallback to a static elegant graph.

Review checkpoint.

---

## Pass 2 — Homepage as a documentary (`HomePage.tsx`)

Each section = one idea, cinematic image, one sentence, short paragraph, one CTA:

1. **Hero** (Pass 1).
2. **The new threat surface** — "Today's threats aren't just on Google. They're inside AI." Animated flow Google → ChatGPT → Gemini → Perplexity → AI Agents.
3. **ARIA Intelligence Engine** — the Active Digital Footprint (Pass 1).
4. **Who we protect** — Athletes, Founders, Families, Executives, Creators, Businesses, Governments. Typographic + cinematic, minimal.
5. **ARIA Legal Shield™ — product-launch treatment.** Not a card. Huge cinematic legal image (judge's bench / athlete signing / business deal), headline *"Legal protection shouldn't begin when the bill arrives,"* one CTA to `/services/legal-shield`.
6. **Mission (Simon, reimagined)** — remove biography. Jobs-style sequence: **Mission → Why ARIA exists → What we're building → Where we're going.** Sells the vision, not the person.
7. **Closing CTA** — cinematic, single statement + CTA.

Legacy sections (testimonials, pricing, FAQ, contact) kept but restyled to the new language and repositioned below the narrative. Lazy-loading preserved.

Review checkpoint.

---

## Pass 3 — Ecosystem + navigation + site-wide restyle

**The ARIA Ecosystem (3D, interactive)**
- Central **ARIA — Digital Protection** core; orbiting nodes: Identity, Legal, Reputation, Crisis, all resting on an "Intelligence Engine" base.
- Pseudo-3D depth (CSS transforms / layered parallax). On hover a node expands with a small animation; click navigates to the matching existing page.
- Frames ARIA as one connected protection system, not a list of services.

**Simplified navigation**
- Top-level reduced to: **Platform · Solutions · Legal Shield · Resources · About · Contact.** Everything else nests underneath (dropdowns / mega-menu). Updates `PublicLayout.tsx` desktop + mobile.

**Site-wide restyle**
- Apply charcoal/glass tokens, typography, reduced-icon language across inner pages (services, resources, legal, Simon cluster, stealth pages) so nothing reverts to the old purple-SaaS look. Purge remaining "ORM"/"reputation management" public copy in favour of the protection vocabulary.

---

## Technical notes

- **Tokens:** rewrite `src/index.css` `:root`/`.dark` to charcoal palette + glass gradient/shadow tokens. Semantic tokens only — no hardcoded `bg-black`/`text-white`.
- **Fonts:** `@fontsource` via `bun add`, imported in `main.tsx`, mapped in Tailwind config. No CDN / `index.html` edits.
- **Imagery:** generated into `src/assets/`, large files externalised with lovable-assets.
- **No backend/logic changes.** Routes, CTAs, Stripe, intake, admin lockdown untouched. Nav simplification only reorganises existing links.
- **SEO preserved:** `SEO`/JSON-LD intact, single H1 per page, alt text on every image, route-integrity allowlist respected. Update homepage title/description to the Digital Protection positioning.
- Verify each pass in preview (desktop + mobile) before continuing.

I'll begin with Pass 1 once you approve — generating the command-centre + footprint visuals first, then showing you the hero and the living Active Digital Footprint before moving on.
