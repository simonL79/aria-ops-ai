## Problem
`BrandProtectionPage.tsx` still refers to "Four pillars" and "four overlapping disciplines" even though A.R.I.A™ now has six integrated defence layers. This creates inconsistency with `ServicesSection.tsx`.

## Scope
Update `src/pages/services/BrandProtectionPage.tsx` only. No other files need changes.

## Changes
1. **Heading (line 114):** `Four pillars, one system` → `Six pillars, one system`
2. **FAQ answer (line 17):** Update the sentence to say "six overlapping disciplines" and expand the list to include all six service pillars:
   - AI-driven threat detection
   - Narrative defence
   - Identity protection
   - Search positioning
   - AI reputation readiness
   - Legal removal & compliance
3. **Pillars grid (lines 65–86):** Expand the `pillars` array from 4 to 6 cards, adding:
   - **Search Positioning** (Search icon) — defensive ranking strategy, authority content layering
   - **AI Reputation Readiness** (Brain icon) — ChatGPT/Gemini/Perplexity interpretation, structured presence for the agentic web
4. **SEO/meta description (line 92):** Update to mention six disciplines.
5. **JSON-LD description (line 52):** Update to mention all six disciplines.

## Out of scope
- No routing, layout, or component changes.
- No pricing, database, or edge function work.
- No visual redesign — reuse existing card component.

## Files changed
- `src/pages/services/BrandProtectionPage.tsx` (edits only)