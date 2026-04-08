

# Animate the Hero Logo

The logo at `h-80` (320px) is a large static image. We'll add layered animations to make it feel alive and fill the space with visual interest.

## Changes

**File: `src/components/sections/HeroSection.tsx`**

Replace the plain `<Logo>` wrapper with an animated logo container that includes:

1. **Fade-in + scale entrance** — logo fades in from slightly scaled down (0.8 → 1) over 1.2s on mount
2. **Continuous subtle float** — slow up/down oscillation (translateY ±8px over 6s, infinite)
3. **Radial glow ring** — an animated pulsing ring behind the logo using a pseudo-element or sibling div (orange/primary gradient, opacity pulsing 0.1→0.3 over 3s)
4. **Soft scanline sweep** — a thin horizontal light line that sweeps top-to-bottom across the logo every 4s (gives an "AI scanning" feel)

All CSS-only via Tailwind keyframes + inline styles. No JS animation libraries needed.

**File: `tailwind.config.ts`**

Add keyframes:
- `float`: `0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) }`
- `scanline`: a vertical sweep animation
- `ring-pulse`: scale + opacity pulse for the glow ring

**File: `src/components/sections/HeroSection.tsx`** structure change:

```
<div className="relative flex justify-center mb-6">
  {/* Glow ring behind logo */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-ring-pulse" />
  </div>
  {/* Scanline overlay */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="animate-scanline ..." />
  </div>
  {/* Logo with entrance + float */}
  <div className="animate-fade-in-scale animate-float">
    <Logo variant="light" size="10x" />
  </div>
</div>
```

Two files changed. Pure CSS animations, no dependencies.

