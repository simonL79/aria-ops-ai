## Goal

Harden the existing ARIA Shield signed-token flow from "good admin capability" (8/10) to "production-optimal" (9.6/10) by adding replay protection, audit logging, shared constants, and tightening two RLS findings flagged by the security scanner.

Keep the current architecture (Supabase JWT → `requireAdmin` → HMAC token → action function). Do not replace it. Do not re-disable `verify_jwt`.

---

## 1. Database changes (additive only)

### 1a. `shield_used_jtis` — replay protection

```sql
create table public.shield_used_jtis (
  jti text primary key,
  user_id uuid,
  action text not null,
  consumed_by_function text not null,
  minted_at timestamptz,
  expires_at timestamptz not null,
  consumed_at timestamptz not null default now(),
  ip_address text,
  user_agent text
);
alter table public.shield_used_jtis enable row level security;
create policy "admins read shield_used_jtis"
  on public.shield_used_jtis for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
```

PK on `jti` makes replay rejection race-safe via unique-violation (`23505`).

### 1b. `shield_token_audit_events` — forensics

```sql
create table public.shield_token_audit_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,         -- mint_success | mint_denied | verify_success | verify_failed | verify_replay | verify_missing
  user_id uuid,
  action text,
  jti text,
  function_name text,
  success boolean not null,
  failure_reason text,
  ip_address text,
  user_agent text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.shield_token_audit_events enable row level security;
create policy "admins read shield_token_audit_events"
  on public.shield_token_audit_events for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create index on public.shield_token_audit_events (created_at desc);
create index on public.shield_token_audit_events (user_id, created_at desc);
```

### 1c. `user_roles` RLS hardening (security finding `user_roles_self_escalation`)

Add an explicit RESTRICTIVE policy chain so a future permissive misconfig cannot grant self-escalation:

```sql
alter table public.user_roles enable row level security;

-- Permissive (existing intent, re-stated)
drop policy if exists "users can read own roles" on public.user_roles;
create policy "users can read own roles"
  on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

drop policy if exists "admins manage user roles" on public.user_roles;
create policy "admins manage user roles"
  on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Restrictive hard-deny — split per command for portability
create policy "restrict insert user_roles to admins"
  as restrictive on public.user_roles for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "restrict update user_roles to admins"
  as restrictive on public.user_roles for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
create policy "restrict delete user_roles to admins"
  as restrictive on public.user_roles for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));
```

Service role still bypasses RLS for Edge Function bootstrap.

### 1d. `eidetic_resurfacing_events` Realtime hardening (security finding `eidetic_resurfacing_events_realtime_public`)

Re-issue all four policies against `authenticated` instead of `public` so anonymous WebSocket subscribers cannot even attempt to subscribe:

```sql
alter table public.eidetic_resurfacing_events enable row level security;
drop policy if exists "<existing select>" on public.eidetic_resurfacing_events;
-- (repeat drops for insert/update/delete)
create policy "authenticated admins read eidetic_resurfacing_events"
  on public.eidetic_resurfacing_events for select to authenticated
  using (public.is_current_user_admin());
create policy "authenticated admins insert eidetic_resurfacing_events"
  on public.eidetic_resurfacing_events for insert to authenticated
  with check (public.is_current_user_admin());
create policy "authenticated admins update eidetic_resurfacing_events"
  on public.eidetic_resurfacing_events for update to authenticated
  using (public.is_current_user_admin()) with check (public.is_current_user_admin());
create policy "authenticated admins delete eidetic_resurfacing_events"
  on public.eidetic_resurfacing_events for delete to authenticated
  using (public.is_current_user_admin());
```

(Drop names will be confirmed against live policy list before the migration runs. No data is touched — additive/policy-only.)

---

## 2. Shared modules

### 2a. `supabase/functions/_shared/shieldActions.ts` (new)

Single source of truth for action names and function→action mapping. Mirrored at `src/lib/shield/actions.ts` for the client. `invokeShield.ts` and `shield-mint-token` switch to importing from these.

### 2b. `supabase/functions/_shared/shieldToken.ts` (small change)

`verifyShieldToken` already returns `{ userId, jti }`. Extend the return shape to also include `action`, `iat`, `exp` so the consume helper can populate the JTI row without re-decoding.

### 2c. `supabase/functions/_shared/shieldTokenConsume.ts` (new)

Single helper used by all three action functions:

1. Read `x-shield-token`, `x-forwarded-for`/`cf-connecting-ip`, `user-agent`.
2. Call `verifyShieldToken(token, expectedAction)`.
3. `INSERT` into `shield_used_jtis` — unique violation = replay → reject.
4. Write `shield_token_audit_events` for `verify_success` / `verify_failed` / `verify_replay` / `verify_missing`.
5. Return decoded payload to caller.

Audit failures are best-effort (logged, never block) so logging cannot brick the action.

---

## 3. Edge Function updates

| Function | Change |
|---|---|
| `shield-mint-token` | After signing, write `mint_success` audit row (user, action, jti, ip, ua, expires_at in metadata). On `requireAdmin` rejection, write `mint_denied`. Never store the raw token. |
| `shield-promote-threat` | Replace inline `verifyShieldToken(..., 'promote')` with `consumeShieldToken({ req, supabaseAdmin, expectedAction: 'promote', functionName: 'shield-promote-threat' })`. |
| `shield-transition-alert` | Same swap with `expectedAction: 'transition'`. |
| `shield-capture-url-metadata` | Same swap with `expectedAction: 'capture'`. |

All three already create a service-role admin client — pass it into the helper to avoid creating a second client.

No change to `verify_jwt` settings or response shapes.

---

## 4. Client

`src/lib/shield/invokeShield.ts`: switch the hard-coded `FN_TO_ACTION` map to import from the new `src/lib/shield/actions.ts`. No behavior change. The in-memory token cache stays — but after this change, a cached token is still single-use server-side, so we'll mark cached tokens as consumed after a successful invoke and force a fresh mint on next call. (Otherwise the cache would guarantee a replay rejection on the second use.)

---

## 5. Out of scope (explicitly deferred)

- **IP/origin binding on tokens** — too many false rejects on mobile/VPN/IPv6. JTI + short TTL + audit covers the realistic theft window.
- **`pg_cron` cleanup of `shield_used_jtis`** — table stays small (5-min TTL × admin volume); a scheduled cleanup function can be added later if rows accumulate.
- **Migrating audit events into `aria_ops_log`** — dedicated table is cleaner for forensics and keeps ops log readable.

---

## 6. Verification

After implementation:

1. `tsc --noEmit` clean.
2. Manual edge-function curl checks via `supabase--curl_edge_functions`:
   - mint as admin → 200 + token
   - promote with valid token → 200; replay same token → 401
   - promote with transition-action token → 401
   - missing/expired token → 401
   - confirm `shield_token_audit_events` rows appear for each path
3. Run `supabase--linter` and re-check the two security findings (mark them fixed with explanations).
4. Update `mem://security/access-control` with the new restrictive policies and the JTI/audit tables.

---

## Result

| Area | Before | After |
|---|---|---|
| Token replay window | 5 min full reuse | one-shot per `jti` |
| Audit trail | none | every mint + every consume |
| Action drift risk | 2 hard-coded maps | 1 shared constant |
| `user_roles` self-escalation | permissive-only guard | permissive + restrictive hard-deny |
| `eidetic_resurfacing_events` Realtime | published to `public` role | `authenticated` admins only |

Estimated production-readiness: **9.6/10**.