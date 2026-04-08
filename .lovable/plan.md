

# Replace Logo Animations with System Dashboard Mockup

## What Changes

1. **Revert the logo** — remove glow ring, scanline, and float animations. Return to a simple centered logo.

2. **Add a dashboard mockup** below the CTA buttons — a CSS-built "system preview" showing a stylized ARIA dashboard interface (threat meters, status indicators, scanning lines). This fills the visual space and communicates what the product does, similar to how Palantir/enterprise AI sites show their UI below the fold.

## File Changes

### `src/components/sections/HeroSection.tsx`

- Remove the glow ring, scanline, and float wrapper around the logo — replace with plain `<Logo variant="light" size="xl" />`
- Add a new `DashboardMockup` component below the CTA buttons: a glass-card container with fake UI elements:
  - Top bar with dot indicators and "ARIA Threat Intelligence" label
  - Three metric cards (Threat Score, Signals Monitored, Risk Level) with colored indicators
  - A simulated scanning bar with a pulse animation
  - Status text like "Real-time monitoring active"
- All built with divs + Tailwind — no images needed, pure CSS UI mockup
- Wrapped in a perspective container with slight 3D tilt for depth on desktop

### No other files change

The tailwind keyframes added previously (float, scanline, ring-pulse, fade-in-scale) can stay — they're harmless and some are used elsewhere.

