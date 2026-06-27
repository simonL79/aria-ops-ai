# Sticky Pricing CTA Bar

## Goal
Pricing currently sits far down both pages (homepage pricing is ~8th section; Legal Shield packages are below a long hero). Add a slim, always-visible sticky bar so customers can jump to plans at any scroll depth — without reordering content.

## Behaviour
- A slim bar fixed near the bottom of the viewport (above the chat widget FAB), violet theme-matched.
- Shows a short value line + price hint and a primary button:
  - Homepage: "Protect your reputation — plans from £29/mo" → "View plans" → smooth-scrolls to `#pricing`.
  - Legal Shield: "ARIA Legal Shield — from £29/mo" → "See packages" → smooth-scrolls to `#packages`.
- Appears only after the user scrolls past the hero (~500px), so it doesn't crowd the first screen.
- Hides itself when the target pricing section is already on screen (so it's not redundant), then reappears after scrolling past it.
- Dismissible with a small "×" for the session (sessionStorage), so it doesn't nag a returning scroller.
- Fully responsive: on mobile it collapses to a compact button; positioned so it never overlaps the chat FAB (offset to the left / above it).

## Technical details
- New component: `src/components/widgets/StickyPricingBar.tsx`.
  - Props: `targetId` (e.g. `pricing` / `packages`), `label`, `ctaText`.
  - Uses a scroll listener (throttled via `requestAnimationFrame`) for the show-after-hero threshold and an `IntersectionObserver` on the target section to hide while pricing is visible.
  - Click handler: `document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })`.
  - Styling with semantic tokens (`bg-card/95 backdrop-blur border-border`, `bg-primary text-primary-foreground` button), `z` below modal but above content; bottom offset chosen to clear the chat FAB.
  - Dismiss state stored in `sessionStorage` keyed by `targetId`.
- Mount points:
  - Homepage (`src/pages/HomePage.tsx`): render `<StickyPricingBar targetId="pricing" .../>` (lazy, like ChatWidget).
  - Legal Shield (`src/pages/services/LegalShieldPage.tsx`): render `<StickyPricingBar targetId="packages" .../>`.
- No backend, routing, or pricing-data changes. Existing `#pricing` and `#packages` anchors already have `scroll-mt-24`, so landing position is correct.

## Out of scope
- No reordering of page sections.
- No changes to prices or the pricing components themselves.
