# Signed Admin Token Flow for Shield Edge Functions

## Goal
Stop relying on `verify_jwt = false` for Shield edge functions. Instead, the client gets a short-lived HMAC-signed admin token from a JWT-protected "minter" function, then passes it to Shield functions which verify the signature.

## Why
Currently `shield-promote-threat`, `shield-transition-alert`, and `shield-capture-url-metadata` are registered with `verify_jwt = false` so our in-function `requireAdmin` can run. That works but disables Supabase's platform-level JWT gate. A signed token gives us:
- `verify_jwt = true` re-enabled (defense in depth)
- Short TTL (5 min) tokens, scoped per-function
- Secret never reaches the browser

## Architecture

```text
Browser (admin user)
   |
   |  1. supabase.functions.invoke('shield-mint-token', { action })
   |     [JWT verified by platform → requireAdmin in code]
   v
shield-mint-token  --returns-->  { token: "<payload>.<hmac>", exp }
   |
   |  2. supabase.functions.invoke('shield-promote-threat',
   |       { body, headers: { 'x-shield-token': token } })
   |     [JWT verified by platform + HMAC verified in code]
   v
shield-promote-threat / shield-transition-alert / shield-capture-url-metadata
```

## Changes

### 1. New secret
- `SHIELD_ADMIN_HMAC_SECRET` (random 32+ bytes) — added via the secrets tool when build mode resumes.

### 2. New shared module `supabase/functions/_shared/shieldToken.ts`
- `signShieldToken(userId, action, ttlSec=300)` — returns `base64url(payload).base64url(hmac)`
- `verifyShieldToken(token, expectedAction)` — verifies HMAC, exp, action; returns `{ userId }` or throws
- Uses Web Crypto `HMAC-SHA256`

### 3. New edge function `shield-mint-token`
- `verify_jwt = true` (default)
- Calls existing `requireAdmin(req)` 
- Body: `{ action: 'promote' | 'transition' | 'capture' }`
- Returns: `{ token, expires_at }`

### 4. Update existing shield functions
- Remove `verify_jwt = false` entries from `supabase/config.toml`
- Replace `requireAdmin(req)` call with `verifyShieldToken(req.headers.get('x-shield-token'), '<action>')`
- CORS: add `x-shield-token` to `Access-Control-Allow-Headers`

### 5. New client helper `src/lib/shield/invokeShield.ts`
```ts
export async function invokeShield(fn, action, body) {
  const { data: t } = await supabase.functions.invoke('shield-mint-token', { body: { action } });
  return supabase.functions.invoke(fn, {
    body,
    headers: { 'x-shield-token': t.token },
  });
}
```

### 6. Update 3 callers to use the helper
- `src/components/shield/EvidenceUploadDialog.tsx`
- `src/components/shield/PromoteToShieldButton.tsx`
- `src/pages/admin/shield/ShieldAlertDetail.tsx`

## Token format
```
payload = { sub: userId, act: 'promote', exp: <unix_sec>, iat: <unix_sec>, jti: <uuid> }
token   = base64url(JSON(payload)) + '.' + base64url(HMAC_SHA256(secret, base64url(payload)))
```
TTL: 300 seconds. `act` must match the function's expected action.

## Out of scope
- Replay protection via `jti` store (TTL is short; can add a `shield_token_jti` table later if needed)
- Rotating the HMAC secret (manual via secrets tool)

## Approval needed for
1. Adding the `SHIELD_ADMIN_HMAC_SECRET` runtime secret
2. Editing `supabase/config.toml` to remove the three `verify_jwt = false` blocks
3. Creating one new edge function and one shared module
4. Editing three existing shield functions and three client files

Approve to proceed.
