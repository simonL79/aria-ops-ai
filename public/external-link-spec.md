# External Link Spec — simon-lindsay.com ↔ ariaops.co.uk

Canonical anchor-text spec for reciprocal authority links between the
personal-brand domain and the A.R.I.A service domain. This file
documents the anchors used in code (outbound) and the anchors the
partner domain should use back (inbound) so they stay varied,
on-topic, and non-spammy.

## Outbound (ariaops.co.uk → simon-lindsay.com)

Rendered in `src/components/seo/ExternalAuthorityLinks.tsx`, mounted on:

- `/athlete-reputation-management`
- `/founder-reputation-protection`

Anchors (rotated):

- "commercial reputation protection for athletes" → `https://simon-lindsay.com/`
- "sports commercial strategist" → `https://simon-lindsay.com/commercial-strategist`
- "athlete commercial management" → `https://simon-lindsay.com/athlete-commercial-management`

Link attributes: dofollow, `rel="noopener"`. These are deliberate
authority links — do not add `nofollow` or `sponsored`.

## Inbound (simon-lindsay.com → ariaops.co.uk)

To be implemented in the simon-lindsay.com codebase. Use these
anchors, rotated across pages:

- "AI reputation protection" → `https://www.ariaops.co.uk/ai-reputation-management`
- "sports reputation management" → `https://www.ariaops.co.uk/athlete-reputation-management`
- "digital threat monitoring" → `https://www.ariaops.co.uk/reputation-threat-score`

Suggested page placements on simon-lindsay.com:

- Boxing / athlete pages → "sports reputation management"
- Commercial strategist pages → "AI reputation protection"
- Reputation intelligence / about → "digital threat monitoring"

Link attributes: dofollow, `rel="noopener"`. One link per page maximum
to keep the profile natural.

## Anchor rotation principles

1. Never repeat the same exact-match anchor more than twice across
   the full reciprocal set.
2. Mix branded ("A.R.I.A", "Simon Lindsay"), partial-match and
   keyword anchors over time as new pages are added.
3. Vary destination URL — do not point every link at the homepage.
