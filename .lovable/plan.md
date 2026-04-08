

# Sync Homepage Pricing Section with Pricing Page

The homepage `PricingSection` has different plan names (Private/Executive/Enterprise), no prices, and fewer features. The `PricingPage` is the source of truth with Individual/PRO/Enterprise plans, prices (£97, £297, Custom), descriptions, and full feature lists.

## Change

**File: `src/components/sections/PricingSection.tsx`**

Update the plans data to match `PricingPage.tsx` exactly:
- **Individual** — £97/month, 6 features
- **PRO** — £297/month, 8 features, Most Popular
- **Enterprise** — Custom pricing, 8 features

Update the card layout to include:
- Price + period display (matching the pricing page style)
- Description text
- Orange plan name styling (`text-orange-500 font-bold`)
- Keep the scroll-reveal animation (unique to the homepage section)

Only one file changes: `src/components/sections/PricingSection.tsx`.

