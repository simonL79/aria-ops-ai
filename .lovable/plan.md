# Terms, Privacy & Disclaimer — Rebuild

Operator: **Simon Lindsay Consultancy T/A A.R.I.A™** — ariaops.co.uk
Governing law: **Scotland / Scottish courts**

## 1. Shared legal layout component

Create `src/components/legal/LegalDocument.tsx`:
- Wraps content in `PublicLayout` (Header + Footer already themed)
- Dark luxury surface: `bg-background` page, `bg-card` panel with `border-border/40`, champagne `text-primary` accent rule, gold underline on H1
- Props: `title`, `lastUpdated`, `children`
- Typography: serif/display H1, `text-foreground` body, `text-muted-foreground` for fine print, anchored section IDs for ToC
- Sticky table-of-contents on `lg:` viewports, collapsible on mobile
- Includes `<SEO>` with title/description/path

## 2. Rebuild `src/pages/Terms.tsx`

Replace placeholder with full content following the user's blueprint, organised as 12 numbered sections:

1. Business identity — Simon Lindsay T/A A.R.I.A™, ariaops.co.uk, Scottish law
2. What A.R.I.A provides — service list (monitoring, scoring, suppression support…), with explicit "no guaranteed removal/control" disclaimer wording
3. No guaranteed outcome — bullet list of what cannot be guaranteed
4. AI disclaimer — outputs are advisory; may be incomplete/delayed/inaccurate
5. Not legal/financial/medical advice — instruct qualified solicitors for legal action
6. Client responsibilities — accuracy, lawfulness, authorisation, no harassment
7. Lawful use — prohibited uses (silence criticism, impersonate, manipulate reviews, etc.)
8. Third-party platforms — no control over Google/Meta/TikTok/X/YouTube/Reddit/news/review sites/ChatGPT/Gemini/Perplexity/Copilot
9. Payments & cancellations — pay before work, 3-day onboarding, 90-day initial term, cancel after initial term, no refunds for work commenced
10. Confidentiality — mutual, with lawful exceptions
11. Limitation of liability — cap + excluded loss types; preserve non-excludable liabilities (death, personal injury, fraud)
12. Governing law & contact — Scotland; contact route via `/contact`

Add "Last updated" date and link to Privacy Policy + Disclaimer at the foot.

## 3. Refresh `src/pages/PrivacyPolicyPage.tsx`

Check current contents; if placeholder/light-themed, rewrite to cover: data collected, lawful basis (UK GDPR), purpose, retention, sharing (Supabase/edge providers), security, data subject rights, contact route (`/request-data-access`). Use the new `LegalDocument` shell.

## 4. Refresh `src/pages/DisclaimerPage.tsx` as Acceptable Use / Service Disclaimer

Combine acceptable-use rules (section 7 of Terms expanded) + service disclaimer (AI accuracy + no guarantees). Use the new `LegalDocument` shell.

## 5. Cross-link & footer

Verify `Footer.tsx` links to `/terms`, `/privacy-policy`, `/disclaimer`. No new routes needed (all three already exist in `nav-items.tsx`).

## Out of scope

- No backend / DB changes
- No new routes
- No copy for cookie banner (separate task if needed)
- Final legal sign-off remains the user's responsibility; copy is a strong working draft, not solicitor-reviewed advice

## Files touched

- new: `src/components/legal/LegalDocument.tsx`
- edit: `src/pages/Terms.tsx`
- edit: `src/pages/PrivacyPolicyPage.tsx`
- edit: `src/pages/DisclaimerPage.tsx`
- possible edit: `src/components/layout/Footer.tsx` (only if links missing)
