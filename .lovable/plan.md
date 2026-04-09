

# Elevate the Homepage — Visual Depth and Premium Polish

## Overview

Add visual rhythm, credibility signals, ambient depth, and anonymised testimonials to transform the homepage from a flat scroll into a premium intelligence-grade experience.

## Changes

### 1. New: Featured In Credibility Bar
**File: `src/components/sections/FeaturedInSection.tsx`** (create)

A horizontal strip placed after the Hero showing "As Featured In" with text-based brand names (BBC, Forbes, Bloomberg, Financial Times, TechCrunch) in a CSS marquee scroll. Muted styling — `text-muted-foreground/40`, uppercase, spaced. No images.

### 2. New: Section Divider
**File: `src/components/ui/SectionDivider.tsx`** (create)

A reusable thin `<hr>`-like component with a gradient: `transparent → primary/20 → transparent`. Optional centered glow dot. Place between major section groups for visual breathing room.

### 3. New: Ambient Grid Overlay
**File: `src/components/ui/AmbientGrid.tsx`** (create)

4-6 small CSS circles with slow drift animation, positioned absolute behind content. Applied to Services and Trust sections for background depth.

### 4. Vary Section Backgrounds
**Files: `ServicesSection.tsx`, `TrustSection.tsx`, `PricingSection.tsx`**

- Services: `bg-gradient-to-b from-black via-gray-950 to-black`
- Trust: keep `bg-black` (contrast)
- Pricing: `bg-gradient-to-b from-black via-gray-950 to-black`

This creates alternating visual rhythm.

### 5. Anonymise Testimonials
**File: `src/components/sections/TestimonialsSection.tsx`**

Replace named individuals with discreet professional descriptors:
- "Sarah Chen, CMO" → "Chief Marketing Officer — Media & Entertainment"
- "Michael Rodriguez, Managing Partner" → "Managing Partner — Financial Services"
- "James Whitfield, CEO" → "CEO — Private Capital"
- "Priya Kapoor, PR Director" → "Director of Communications — Technology"
- "David Okonkwo, Founder" → "Founder & Investor — Venture Capital"

Replace initials avatar with a generic shield/lock icon. Aligns with the NDA/discretion messaging.

### 6. Compose into HomePage
**File: `src/pages/HomePage.tsx`**

- Insert `<FeaturedInSection />` after `<HeroSection />`
- Insert `<SectionDivider />` between: ThreatScore/Services, AINewsFeed/HowItWorks, Testimonials/Pricing, FAQ/Contact

### 7. Add Keyframes
**File: `tailwind.config.ts`**

Add `marquee` (horizontal scroll loop) and `drift` (slow random float) keyframes + animation utilities.

## Files Summary

| File | Action |
|------|--------|
| `FeaturedInSection.tsx` | Create |
| `SectionDivider.tsx` | Create |
| `AmbientGrid.tsx` | Create |
| `ServicesSection.tsx` | Edit bg |
| `PricingSection.tsx` | Edit bg |
| `TestimonialsSection.tsx` | Edit — anonymise |
| `HomePage.tsx` | Edit — compose |
| `tailwind.config.ts` | Edit — keyframes |

No new dependencies. All CSS-driven.

