
## Tier 9: Hook Execution Engine

Currently both `eidetic-dispatch-response` and `eidetic-approve-dispatch` only insert "queued" / "draft" / "pending" rows into downstream tables. They never actually trigger Requiem's pipeline, generate a legal document, or publish a counter-narrative. This tier wires them through to live execution.

### Approach

Refactor the per-action logic into a single shared executor (`_shared/eidetic-executors.ts`) used by both auto-dispatch and the approval flow, so behaviour is identical whether an action fires automatically or after operator approval.

### What each action will actually do

**1. `requiem` → real Requiem pipeline launch**
- Insert `persona_saturation_campaigns` row (audit trail, status `dispatched`).
- Then `supabase.functions.invoke('requiem-pipeline', { body: { urls: [event.content_url], variantCount: payload.config.variantCount ?? 10 } })`.
- Store the returned `jobId`, `payloadsGenerated`, and `meshSize` in `eidetic_dispatched_responses.result` so operators can jump to `/admin/requiem/<jobId>`.

**2. `legal_erasure` → real legal document generation**
- Insert `data_subject_requests` row (status `pending`).
- Then `supabase.functions.invoke('legal-document-generator', { body: { action: 'generate_document', entityName, documentType: payload.config.documentType ?? 'privacy_violation', details: { sourceUrl, excerpt, eventId, dsrId } } })`.
- Link the returned `document_id` back to the DSR via metadata, store both IDs in `result`.

**3. `counter_narrative` → generate + publish**
- Insert `counter_narratives` row.
- Then `supabase.functions.invoke('persona-saturation', { body: { action: 'deploy', payload: { title, content, platforms: payload.config.platforms ?? ['github-pages'] } } })` to actually publish.
- Store deployed URLs in `result.deployments`.

### Failure handling & observability

- Each downstream invoke is wrapped: a queue-row is always created first (so we keep an audit trail even if downstream fails), then the live action runs; failures mark the dispatch `failed` with `error_message` but leave the queued artifact for manual retry.
- New `result` shape: `{ artifact_id, downstream: { function, ok, data?, error? } }`.
- All steps `console.log` with `[EIDETIC-EXEC]` prefix for log filtering.

### Retry path

Add a small `eidetic-retry-dispatch` edge function: takes a `dispatch_id` that is `failed`, re-runs only the downstream invoke (not the artifact insert), updates `result`/`status`. Wire a "Retry" button in `AdminNotificationsPage` (or wherever dispatched responses are listed) — if no list exists yet, add a minimal `DispatchedResponsesPanel` to `EideticDashboard` showing recent dispatches with status badges + retry.

### Files

**New**
- `supabase/functions/_shared/eidetic-executors.ts` — `executeRequiem`, `executeLegalErasure`, `executeCounterNarrative`, plus `executeAction` dispatcher.
- `supabase/functions/eidetic-retry-dispatch/index.ts` — admin-guarded retry endpoint.
- `src/components/eidetic/DispatchedResponsesPanel.tsx` — recent dispatches with status + retry button.

**Modified**
- `supabase/functions/eidetic-dispatch-response/index.ts` — replace inline `executeAction` with shared import.
- `supabase/functions/eidetic-approve-dispatch/index.ts` — same.
- `src/components/eidetic/EideticDashboard.tsx` — mount the new panel.

### Notes / dependencies

- No DB migration required — existing `eidetic_dispatched_responses.result` (jsonb) already accommodates the new shape.
- `persona-saturation` requires `GITHUB_TOKEN` (and optionally Reddit creds) to actually publish; without them counter_narrative deployment will record a `failed` downstream but the draft narrative still exists. I'll surface this clearly in the result payload rather than silently failing.
- `requiem-pipeline` and `legal-document-generator` already exist and are admin-guarded; since we invoke them service-side using the service role key from the dispatcher, auth passes.

Approve to implement.
