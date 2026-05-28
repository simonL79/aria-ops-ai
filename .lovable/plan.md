## Goal
Replace the current dark cinematic theme with a light enterprise-SaaS palette across the entire app — A.R.I.A should look like an AI intelligence / risk command platform, not a luxury brand.

## New design tokens (HSL conversions of your hex)

| Role | Hex | HSL |
|---|---|---|
| Background | `#F4F6F8` | `210 17% 97%` |
| Card / surface | `#FFFFFF` | `0 0% 100%` |
| Foreground (text) | `#111827` | `220 39% 11%` |
| Primary (brand) | `#123C69` | `211 71% 24%` |
| Secondary (operational blue) | `#2E5EAA` | `215 58% 42%` |
| Accent (threat/CTA amber) | `#FFB020` | `38 100% 56%` |
| Success | `#16A34A` | `142 76% 36%` |
| Danger | `#DC2626` | `0 84% 60%` |
| Border / muted | `~#E5E7EB` | `220 13% 91%` |
| Muted foreground | `~#6B7280` | `220 9% 46%` |

## Files to change

1. **`src/index.css`**
   - Rewrite `:root` with the light tokens above. Remove `.dark` override (or mirror it to light) so the whole site renders light.
   - Strip the hard-coded `!important` black backgrounds on `html`, `body`, `#root` (lines 96–112). Replace with `@apply bg-background text-foreground`.
   - Update component utilities (`.corporate-gradient`, `.corporate-card`, glassmorphism helpers) to white-card / soft-grey variants. Remove gold-accented shadows; replace with subtle blue ring shadows.

2. **`tailwind.config.ts`**
   - Add `secondary-blue`, `success`, `danger`, `warning` color tokens mapping to the new CSS vars so components can reference them.
   - Keep existing semantic names (`primary`, `accent`, `destructive`) — only their HSL values change.

3. **Component sweep — replace hardcoded dark colors with tokens.** Search-and-replace targets:
   - `bg-black`, `bg-gray-950`, `bg-gray-900` → `bg-background` or `bg-card`
   - `from-black via-gray-* to-black` gradients → remove or replace with `bg-background`
   - `text-white` (on dark surfaces) → `text-foreground`
   - `border-white/10`, `border-primary/20` glassmorphism → `border-border`
   - `.glass-card` class → repurpose to white card with soft border + subtle shadow
   - Particle-network background (dark canvas) → either remove on light sections or restyle with low-opacity blue dots

   Primary files touched (non-exhaustive, based on grep): `ServicesSection.tsx`, `HeroSection.tsx`, `Footer.tsx`, `PublicLayout.tsx`, `Navbar*.tsx`, all `src/pages/stealth/*`, `src/pages/services/*`, `src/pages/resources/*`, the homepage sections.

4. **Memory update (`mem://style/visual-identity` + `mem://index.md` Core)**
   - Replace the "Dark AI aesthetic bg #000000, accent #F97316, glassmorphism" core rule with the new light enterprise palette so future work stays on-brand.

## Out of scope
- No copy/content changes.
- No layout restructuring — same sections, same components, only color/surface/shadow tokens shift.
- Admin/operator dashboards (`/admin/*`) keep their current dark theme unless you tell me otherwise — they're internal tools and a dark command-centre look still fits there.

## Risk / heads-up
This is a global visual change. Every page will look different on the next reload. I'll do the token swap first, then sweep components in a logical order (layout → homepage → stealth pages → resource pages) and verify in the preview after each major batch.

## Question before I start
**Should the `/admin/*` operator panels stay dark, or go light too?** They're currently the most dashboard-heavy surfaces and a dark command-centre look arguably suits operator UX. Default I'll assume: **admin stays dark, public site goes light.**