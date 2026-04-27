# Portal Plan Upgrade Flow

Let Basic-tier portal clients upgrade their package to unlock Reputation Defence features (Removal Request → Requiem). Reuses the existing `create-checkout` edge function and Stripe integration.

## What the user will see

1. **New "Upgrade Plan" item** in the Portal sidebar (highlighted for Basic-tier users).
2. **`/portal/upgrade` page** showing:
   - Current plan badge (Basic / Individual / PRO) pulled from `client_portal_clients.tier`.
   - Three plan cards (Basic £29, Individual £97, PRO £397) with feature lists. Current plan is marked, lower tiers are disabled.
   - Highlight: "Reputation Defence & Removal Requests" is shown as locked on Basic, included on Individual & PRO.
   - "Upgrade" button on each eligible higher tier → opens Stripe Checkout in a new tab.
3. **Removal Request gating**: when a Basic-tier user opens `/portal/removal`, they see an upgrade prompt (lock screen with CTA to `/portal/upgrade`) instead of the wizard.
4. **Dashboard nudge**: if tier is `basic`, the Overview card shows a small "Upgrade to unlock Reputation Defence →" link.
5. **Post-checkout**: Stripe redirects to `/thank-you?session_id=…` (already exists). After payment the operator updates the client's tier in admin (manual today — see "Future" below).

## Technical changes

### Frontend
- **`src/pages/portal/PortalUpgrade.tsx`** (new): fetches the user's current `tier` from `client_portal_clients`, renders the three plan cards, and on click invokes the existing `create-checkout` edge function with the chosen `planId` (`individual` | `pro`), then `window.open(data.url, '_blank')`.
- **`src/components/portal/PortalLayout.tsx`**: add `{ to: '/portal/upgrade', label: 'Upgrade Plan', icon: ArrowUpCircle }` nav item.
- **`src/App.tsx`**: register `/portal/upgrade` route (protected, same wrapper as other portal routes).
- **`src/pages/portal/PortalRemoval.tsx`**: at top of component, fetch tier; if `tier === 'basic'`, render an `UpgradeRequiredCard` (lock icon + copy + button to `/portal/upgrade`) instead of the wizard.
- **`src/pages/portal/PortalDashboard.tsx`**: when `stats.tier === 'basic'`, render a subtle inline upgrade CTA under the tier badge.
- **New small component** `src/components/portal/UpgradeRequiredCard.tsx` — reusable lock screen for any Basic-gated feature.

### Backend
- **No new edge function needed.** Reuse `supabase/functions/create-checkout/index.ts` — it already authenticates the user, validates `planId` server-side against the price map, and returns a Stripe Checkout URL.
- **No DB migration needed.** Tier already lives on `client_portal_clients.tier`. Operator updates it manually after a successful upgrade (matches current onboarding workflow).

### Tier gating logic
A single helper `isBasicTier(tier)` in the upgrade card / removal page keeps the rule centralized: `tier?.toLowerCase() === 'basic'`. Individual and PRO both unlock Removal Requests.

## Out of scope (call out for follow-up)
- **Automatic tier sync after payment**: today the operator must update `client_portal_clients.tier` manually after Stripe confirms the subscription. A Stripe webhook → `tier` update is a logical next step but is not part of this change.
- **Downgrade/cancellation flow**: not included; users contact support.
- **Proration handling**: Stripe handles it natively at checkout; no app-side work.

## Files touched
- `src/pages/portal/PortalUpgrade.tsx` (new)
- `src/components/portal/UpgradeRequiredCard.tsx` (new)
- `src/components/portal/PortalLayout.tsx`
- `src/pages/portal/PortalRemoval.tsx`
- `src/pages/portal/PortalDashboard.tsx`
- `src/App.tsx`
