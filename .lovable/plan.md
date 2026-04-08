

# Level Up the Homepage -- Polish & Missing Sections

## What We'll Do

Add the missing sections to the homepage, add a typewriter effect to the hero headline, create an FAQ section, fix social links, and update the theme color to match your brand.

---

## 1. Add Missing Sections to Homepage

The `HowItWorksSection`, `PricingSection`, and `CTASection` components already exist but aren't on the homepage. We'll add them in a logical flow order and restyle `HowItWorksSection` to use the dark theme (currently white background, clashes with the rest of the site).

**Updated homepage section order:**
Hero → Social Links → Services → Add-On Services → How It Works (restyled dark) → Pricing (restyled dark) → Testimonials → FAQ (new) → Contact Form → CTA

---

## 2. Hero Typewriter Effect

Add an animated typewriter effect to the headline text "Elevate Your Digital Reputation" so the words type out character by character on load. Pure CSS + React state -- no library needed.

**File:** `HeroSection.tsx`

---

## 3. New FAQ Section

Create a new `FAQSection.tsx` with expandable accordion items using the existing `Collapsible` component. Dark-themed, scroll-animated. Topics:

- What is A.R.I.A?
- How fast do you respond to threats?
- Is my data confidential?
- What platforms do you monitor?
- How does pricing work?

---

## 4. Fix Social Links

Update `SocialLinksSection.tsx` to point to real A.R.I.A profiles (or remove the links and just show icons if no real profiles exist yet). Add X/Twitter icon alongside the existing four.

---

## 5. Restyle Existing Sections for Dark Theme

- `HowItWorksSection`: Change from white bg to black bg with white/gray text and orange accents
- `PricingSection`: Change from `bg-background` to black bg with orange accent borders

---

## 6. Update Theme Color

Change `index.html` theme-color from `#247CFF` (blue) to `#F97316` (orange) to match the site's actual brand palette.

---

## Files Changed

| File | Change |
|------|--------|
| `src/pages/HomePage.tsx` | Add HowItWorks, Pricing, FAQ, CTA sections |
| `src/components/sections/HeroSection.tsx` | Add typewriter animation |
| `src/components/sections/FAQSection.tsx` | **New** -- accordion FAQ |
| `src/components/sections/HowItWorksSection.tsx` | Restyle to dark theme |
| `src/components/sections/PricingSection.tsx` | Restyle to dark theme |
| `src/components/sections/SocialLinksSection.tsx` | Add X icon, update hrefs |
| `index.html` | Fix theme-color meta |

