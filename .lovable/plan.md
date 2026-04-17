

## Tier 4 — Resurfacing Detection + Alerts

**Goal:** When a previously decayed memory becomes "fresh" again (or a new high-threat memory appears), capture it as a structured **resurfacing event**, notify the operator in-app + via email, and surface it on the EIDETIC dashboard.

---

### 1. Database (additive only)

**New table: `eidetic_resurfacing_events`**
- `footprint_id` → `memory_footprints.id`
- `event_type`: `'decay_reversal' | 'threat_spike' | 'new_high_threat' | 'content_drift'`
- `severity`: `'low' | 'medium' | 'high' | 'critical'`
- `prev_decay_score`, `new_decay_score`, `decay_delta` numeric
- `prev_threat_30d`, `new_threat_30d`, `threat_delta` numeric
- `narrative_category` text
- `content_excerpt` text
- `content_url` text
- `acknowledged` bool default false
- `acknowledged_at`, `acknowledged_by`
- `notified_at` timestamptz (set when email sent)
- `metadata` jsonb
- `created_at` timestamptz

RLS: admin-only (matches every other EIDETIC table).

Index: `(acknowledged, created_at desc)` for the inbox view.

---

### 2. Autopilot integration

Modify `eidetic-autopilot` to **emit resurfacing events** instead of just incrementing a counter:

- **`decay_reversal`** — `prevDecay > 0.7 && new < 0.4` (existing rule; now logged structurally)
- **`threat_spike`** — `new threat_persistence_30d - prev > 0.3`
- **`content_drift`** — `contentChanged && narrative_category changed`
- **`new_high_threat`** — first AI score where `threat_persistence_30d >= 0.7`

Severity derived from delta magnitude.

Each event triggers an `aria_notifications` row (existing table) AND, for `severity in ('high','critical')`, calls a new **`eidetic-notify-resurfacing`** edge function that sends a transactional email.

---

### 3. Email notification edge function

**`eidetic-notify-resurfacing`** — service-role, no JWT.
- Input: `{ event_id }`
- Loads event + footprint, builds an HTML email summarizing what changed and why it matters, sends via existing transactional email infra (Resend on `notify.ariaops.co.uk`), logs to `email_send_log`, marks `notified_at` on the event.
- Recipient: configurable via secret `EIDETIC_ALERT_EMAIL` (fallback to `simon@ariaops.co.uk` if unset — I'll add the secret).

---

### 4. Frontend

**New component: `ResurfacingAlertsPanel.tsx`** — added to `EideticDashboard` above `AutopilotPanel`.

Shows:
- Unacknowledged alert count (red badge) at top
- Tabs: **Active** | **Acknowledged** | **All**
- Per-event card: severity pill, event type, narrative category, decay/threat deltas with sparkline-style arrows, content excerpt, URL link, "Acknowledge" button
- Realtime subscription to `eidetic_resurfacing_events`
- Empty state: "All clear — no resurfacing events"

**Toast on new event** — global subscription in `EideticDashboard` fires a sonner toast when a critical event arrives while panel is open.

---

### 5. Manual seeding for testing

Add a small "Trigger test resurfacing event" button to the existing `AutopilotPanel` (next to "Seed Test Footprint") that artificially flips a footprint's `decay_score` from 0.9 → 0.2 then runs autopilot, so the full pipeline (event → notification → email → toast) can be validated in one click.

---

### Files

**New:**
- `supabase/functions/eidetic-notify-resurfacing/index.ts`
- `src/components/eidetic/ResurfacingAlertsPanel.tsx`

**Modified:**
- `supabase/functions/eidetic-autopilot/index.ts` — emit structured events
- `src/components/eidetic/EideticDashboard.tsx` — mount alerts panel
- `src/components/eidetic/AutopilotPanel.tsx` — add test-trigger button
- `supabase/config.toml` — register new function (verify_jwt = false)

**Migration:** create `eidetic_resurfacing_events` + RLS + index.

**Secret:** `EIDETIC_ALERT_EMAIL` (will request via secrets tool if missing).

---

### Out of scope (saved for Tier 5/6)

- Memory graph visualization
- Decay timeline charts
- Bulk acknowledge / triage workflows
- SMS / Slack notifications

---

Approve to execute. I'll start with the migration, then secret, then code.

