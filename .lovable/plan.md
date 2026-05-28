## Objective
Add a sixth service pillar — **Legal Defence & Compliance** — to the homepage "Intelligence-Grade Protection" section, and create a matching stealth SEO landing page.

## Changes

### 1. Homepage — `src/components/sections/ServicesSection.tsx`
- Add sixth service object to the `services` array:
  - **Title:** Legal Defence & Compliance
  - **Icon:** `Scale` (from `lucide-react`)
  - **Capabilities:**
    1. GDPR takedowns & right-to-erasure enforcement
    2. Cease & desist automation
    3. Defamation case preparation & evidence packaging
    4. Regulatory compliance logging (SOC II / ISO 27001 aligned)
- Update subtitle copy from "Four integrated defence layers" to "Six integrated defence layers".

### 2. New Stealth Landing Page — `src/pages/stealth/LegalDefenceCompliancePage.tsx`
- Reuse the `StealthLandingPage` template pattern.
- Target keywords: `legal reputation defence`, `GDPR reputation takedown`, `defamation protection UK`, `compliance reputation management`, `cease and desist online reputation`
- Include: Hero H1, capability grid, methodology, competitor differentiation (vs traditional legal firms / ORM agencies), FAQ block, JSON-LD schema.

### 3. Routing — `src/App.tsx`
- Add lazy-loaded route: `/legal-defence-compliance`

### 4. Sitemap & LLM Visibility
- Add `<url>` entry in `public/sitemap.xml` (priority 0.8).
- Add solution alias in `public/llms.txt` under `## Solutions`.

### 5. Footer Internal Link
- Add link in Footer "Solutions" column pointing to `/legal-defence-compliance`.

## Out of Scope
- No new database tables or edge functions.
- No changes to pricing or existing service cards.

## Files
- Edit: `src/components/sections/ServicesSection.tsx`
- Edit: `src/App.tsx`
- Edit: `public/sitemap.xml`
- Edit: `public/llms.txt`
- Edit: `src/components/layout/Footer.tsx`
- Create: `src/pages/stealth/LegalDefenceCompliancePage.tsx`
