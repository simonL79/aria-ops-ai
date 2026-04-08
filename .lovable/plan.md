

# ARIA Ops UI Upgrade + Public Threat Score Lead Funnel

This is a front-end-only upgrade to reposition the website as frontier AI technology with a powerful lead-generation tool. No dashboards, no admin portals, no SaaS complexity.

---

## Phase 1: Hero Section Overhaul

**File: `src/components/sections/HeroSection.tsx`** — Full rewrite

- Remove the executive portrait image and 2-column grid layout
- New single-column, centered hero with:
  - Typewriter headline: "AI Reputation Intelligence That Detects Risk Before It Escalates"
  - Subheading: "ARIA Ops combines AI signal monitoring, predictive threat analysis, and strategic human response systems to protect reputations in real time."
  - Two CTA buttons: "Get Free Threat Score" (scrolls to threat score section) + "Book Private Consultation" (links to /scan)
- Replace `ParticleBackground` with a refined grid overlay + soft animated glow lines (CSS-only using radial gradients and subtle keyframe animations)
- Remove Trustpilot stars, ISO badges, and social verification block from the hero (move trust signals to a dedicated section)
- Dark graphite background (`bg-gradient-to-b from-gray-950 to-black`)
- Keep Logo component at the top

---

## Phase 2: Public Threat Score Tool (Lead Magnet)

**New file: `src/components/sections/ThreatScoreSection.tsx`**

This is the centrepiece lead-generation feature, placed prominently on the homepage.

**Form inputs** (glassmorphism card, dark styling):
- Full name / brand name
- Main industry (dropdown: Tech, Finance, Entertainment, Sports, Legal, Other)
- Website or main social profile URL
- Public visibility level (Low / Medium / High — radio buttons)
- Recent press or controversy? (Yes / No toggle)
- Email address (required)
- Instagram / X / LinkedIn handle

**On submit**:
- Save data to Supabase `contact_submissions` table (reuse existing schema or insert with metadata)
- Animate to a result card showing:
  - Animated circular score gauge (0-100) with smooth count-up
  - Risk label: Low Exposure / Elevated Monitoring Required / High Narrative Risk / Critical Public Vulnerability
  - 3 generated insight strings based on inputs (deterministic logic from visibility level + controversy flag + industry)
  - CTA: "Receive Full AI Threat Breakdown" button linking to /scan or booking

**Score calculation** — simple client-side algorithm:
- Base score from visibility level (Low=25, Medium=50, High=70)
- +15 if recent controversy = yes
- +10 if no website provided
- +5 if missing social handles
- Capped at 100

---

## Phase 3: Services Section Repositioning

**File: `src/components/sections/ServicesSection.tsx`** — Update content and card design

Rename the three services:
1. **AI Threat Detection** — emerging narrative risks, hostile content discovery, search vulnerability, sentiment volatility
2. **Narrative Defense** — strategic response architecture, content counterweights, press balancing, social narrative correction
3. **Identity Protection** — impersonation scanning, profile cloning risk, synthetic content detection, misinformation containment

Add a fourth card:
4. **Search Positioning** — defensive ranking, reputation-safe visibility, authority content layering, long-term search resilience

Change grid to `md:grid-cols-2 lg:grid-cols-4`. Update icons to match (Shield, Swords, Fingerprint, Search).

---

## Phase 4: Trust & Conversion Sections

**New file: `src/components/sections/TrustSection.tsx`**

Replace the scattered trust signals with a dedicated premium section:
- "Discreet Client Sectors" — anonymized icons (athletes, founders, public figures, family offices)
- "Anonymised Outcomes" — 3-4 case study cards with redacted client details but real metrics
- "Response Time Promise" — "Critical threats actioned within 4 hours"
- "AI-Led Scanning Methodology" — brief visual explainer
- "Private Onboarding Flow" — step icons showing confidential intake process

**File: `src/components/sections/CTASection.tsx`** — Update copy

- Headline: "Know Your Risk Before The World Does"
- Subtext: "Request a private consultation with our intelligence team"
- Keep existing form but update button text and styling

---

## Phase 5: Homepage Composition & Section Order

**File: `src/pages/HomePage.tsx`** — Reorder sections

New order:
1. HeroSection (upgraded)
2. ThreatScoreSection (new lead magnet)
3. ServicesSection (repositioned)
4. HowItWorksSection (keep as-is, already dark themed)
5. TrustSection (new)
6. TestimonialsSection (keep)
7. PricingSection (keep, already synced)
8. FAQSection (keep)
9. ContactFormSection (keep)
10. CTASection (updated copy)
11. SocialLinksSection (move to bottom)

Remove `AddOnServicesSection` — its content is now folded into the repositioned services.

---

## Phase 6: UI Polish

**File: `src/index.css`** — Add utility classes:
- `.glass-card` — `bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl`
- `.glow-line` — subtle animated border glow keyframe
- Grid overlay background pattern (CSS `background-image` with fine lines)

**File: `tailwind.config.ts`** — Add keyframes:
- `glow-pulse` for score gauge
- `grid-fade` for hero background pattern

---

## Files Summary

| File | Action |
|------|--------|
| `src/components/sections/HeroSection.tsx` | Rewrite — new headline, CTAs, grid overlay bg |
| `src/components/sections/ThreatScoreSection.tsx` | **New** — public threat score lead magnet |
| `src/components/sections/ServicesSection.tsx` | Update — 4 services, new names/content |
| `src/components/sections/TrustSection.tsx` | **New** — trust signals + anonymised outcomes |
| `src/components/sections/CTASection.tsx` | Update copy |
| `src/pages/HomePage.tsx` | Reorder sections, add new ones, remove AddOnServices |
| `src/index.css` | Add glass-card and glow utilities |
| `tailwind.config.ts` | Add glow-pulse and grid-fade keyframes |

No new dependencies. No backend changes. No dashboard/SaaS components.

---

## Implementation Order

Given the scope, I will build in 3 passes:
1. **Hero + Threat Score** (Phases 1-2) — the highest-impact changes
2. **Services + Trust + CTA** (Phases 3-4) — content repositioning
3. **Homepage composition + polish** (Phases 5-6) — final assembly

