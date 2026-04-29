# A.R.I.A SIGMA — Operations Handbook

A single source of truth for running A.R.I.A SIGMA day-to-day. If you can't find what you need here, add it — this file is the reference.

---

## 1. At-a-glance map

```text
                    ┌──────────────────────┐
                    │   Public site        │
                    │   ariaops.co.uk      │
                    │   Home / Pricing /   │
                    │   Blog / Free Scan   │
                    └──────────┬───────────┘
                               │ leads + intake
                               ▼
                    ┌──────────────────────┐
                    │   Intake             │
                    │  /secure-intake      │
                    │  /smart-intake       │
                    └──────────┬───────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Admin (/admin)                         │
│                                                             │
│  Clients   Shield    EIDETIC   Requiem   Genesis  Notif.    │
│     │         │         │         │         │        │      │
│     └─────────┴─────────┴────┬────┴─────────┴────────┘      │
│                              ▼                              │
│                  Edge Functions (Supabase)                  │
│                              ▼                              │
│            Supabase (Postgres + Storage + RLS)              │
└─────────────────────────────────────────────────────────────┘
```

Modules covered in this handbook: **Clients**, **Shield**, **EIDETIC**, **Requiem**, **Genesis Sentinel**, **Blog/AutoSEO**, **Notifications**.

---

## 2. Access & login

**What it is.** Admin access to A.R.I.A SIGMA is gated by the `admin` role in the `user_roles` table (never on `profiles`). The `ProtectedRoute` wrapper enforces this on the frontend; every privileged Edge Function enforces it again via `requireAdmin`.

**Where to click.**
- Login: `/auth` (or `/admin/login` for the admin-themed entry).
- After login, you land on `/admin` (Admin Dashboard).

**Daily checklist.**
- Confirm you're logged in as the right account before any destructive action.
- If a teammate needs admin access, an existing admin must grant it via the database (insert into `user_roles` with role `admin`). Never share credentials.

**Common issues.**
- *Redirected to `/auth` even though you're logged in* → you don't have the `admin` role. Ask an existing admin to add it.
- *401 on an Edge Function* → token expired. Refresh the page to re-issue the JWT.

**Escalate to.** Platform owner for new admin grants. Never grant admin via support requests.

---

## 3. Client onboarding

**What it is.** End-to-end flow to bring a new client under monitoring: identity, entity discovery, threat assessment, and defensive configuration.

**Where to click.** `/admin/client-onboarding`

**Daily checklist.**
1. **Client information** — full legal name, primary aliases, jurisdictions, contact.
2. **Entity discovery** — let the panel auto-suggest related entities; confirm or reject each.
3. **Threat assessment** — review the auto-generated risk score and adjust severity if you have context the system doesn't.
4. **Defense configuration** — pick the RSI mode (Defensive / Aggressive / Nuclear) and which response hooks are enabled.
5. **Activate** — flip the client to active. They now appear in `/admin/clients` and start receiving Shield alerts.

**Common issues.**
- *Entity discovery returns nothing* → manually add the primary entity and save; discovery will re-run on the next scan cycle.
- *Threat score stays at 0* → the OSINT scan hasn't completed yet. Give it 5–10 minutes and refresh.

**Escalate to.** Whoever owns Client Success for high-risk or VIP onboardings.

---

## 4. Client management

**What it is.** The roster of all clients under monitoring.

**Where to click.** `/admin/clients`

**Daily checklist.**
- Search by name or alias to pull up a client.
- Edit contact info, aliases, or defense config in place.
- **Archive** clients who churn — never delete. The platform is additive only (data integrity rule); deleting breaks historical reports and EIDETIC memory.
- Export a client snapshot via the export button when sending a recap to the client.

**Common issues.**
- *Edit doesn't save* → check the toast for the actual error; usually a missing required field or an RLS policy denying because you're impersonating a different role in DevTools.

**Escalate to.** Engineering if RLS is blocking a legitimate write.

---

## 5. Shield (alerts & evidence)

**What it is.** The triage queue for incoming threats (negative content, impersonations, doxxing, etc.). Each alert links to evidence and a state machine: `new → investigating → action → resolved/dismissed`.

**Where to click.**
- Dashboard: `/admin/shield`
- Queue: `/admin/shield/alerts`
- Single alert: `/admin/shield/alerts/:id`

**Daily checklist.**
1. Open the queue, filter by **New** + **High severity**.
2. For each alert: read the source, capture evidence (paste the URL into the **Capture Evidence** dialog — this calls the SSRF-guarded `shield-capture-url-metadata` function which fetches the page server-side and stores a hashed snapshot).
3. Decide: **Promote to Threat** (escalates to EIDETIC + legal pipeline), **Dismiss** (with a reason), or **Defer** (leave a note + revisit tomorrow).
4. Move state with the **Transition** button — this writes to the audit log.

**Common issues.**
- *"Invalid URL" or "URL targets a private or internal address"* → the SSRF guard rejected the URL. This is a feature, not a bug. Use a public URL only.
- *"DNS resolution failed"* → the hostname doesn't exist or is dead. Try the archived version (web.archive.org), but capture as a manual note.
- *Capture timed out (~10s)* → the source site is slow or hostile. Take a screenshot manually and attach via **Upload Evidence**.

**Escalate to.** Legal Ops if the alert needs a Cease & Desist or GDPR removal letter.

---

## 6. EIDETIC (memory & dispatches)

**What it is.** EIDETIC is the digital memory layer — it tracks how every entity, sentiment, and relationship decays over time and proposes "dispatches" (responses) when things resurface.

**Where to click.**
- Dashboard widgets live on `/admin` (and dedicated panels under `EideticDashboard` views).
- Alert preferences: `/admin/eidetic/preferences`
- Notifications inbox: `/admin/notifications`

**Daily checklist.**
- Check **Pending Dispatches** — each is a proposed response waiting for human approval. Approve, edit, or reject.
- Skim the **Decay Timeline** for any sentiment that's resurfacing (sudden spike on an old thread).
- Retry any **Failed Dispatches** — these are usually transient API failures. One retry is fine; if it fails twice, dig in.

**Common issues.**
- *Dispatch stuck on "queued" for >15 min* → check `/admin/notifications` for an error. Usually a missing recipient or a content-policy block from the AI gateway.
- *No pending dispatches even after a clear incident* → the autopilot threshold may be too high; lower it in `/admin/eidetic/preferences`.

**Escalate to.** Whoever owns the AI gateway / OpenAI fallback if dispatches consistently fail with "AI provider error".

---

## 7. Requiem (bulk SEO defense)

**What it is.** Requiem is the bulk reputation-defense engine — it generates and deploys positive content at scale to push down hostile search results.

**Where to click.** `/admin/requiem`

**Daily checklist.**
- Open the dashboard and review the most recent run: how many assets generated, how many published, how many errored.
- Launch a sweep for a client by selecting them and clicking **Run Pipeline**. Pick the keyword set and target platforms.
- Monitor the live log; expect the run to take 5–30 min depending on volume.
- Review GSC rank changes the next day — that's how you know it's working.

**Common issues.**
- *Pipeline errors with "AutoSEO webhook failed"* → AutoSEO is the upstream content engine. Check its status; do **not** try to generate articles in-house (that approach was rejected — use AutoSEO webhooks only).
- *Deployment errors on a specific platform* → that platform's GitHub Pages / IPFS / VPS target may be down. The pipeline will continue with the others.

**Escalate to.** Whoever owns AutoSEO + multi-platform deployment infrastructure.

---

## 8. Genesis Sentinel

**What it is.** The verification queue for newly discovered entities and events that need a human eyeball before they enter the live intelligence feed.

**Where to click.** `/admin/genesis-sentinel`

**Daily checklist.**
- Review pending verifications. For each: **Approve** (it goes live), **Reject** (with a reason — this trains the classifier), or **Hold** (needs more info).
- Aim to keep the queue under 50; if it grows, the classifier confidence threshold needs tuning.

**Common issues.**
- *Same false positive keeps appearing* → reject with a clear reason; the engine learns from the rejection metadata.

**Escalate to.** Whoever tunes the classifier weights.

---

## 9. Blog & AutoSEO

**What it is.** Blog publishing is webhook-driven via AutoSEO. Articles arrive at the `receive-article` Edge Function, are sanitized with DOMPurify, and stored in the blog table. The public `/blog` page reads from there.

**Where to click.**
- Public blog: `/blog`
- Admin (when shown): blog admin panel within `/admin`.

**Daily checklist.**
- Spot-check the latest 1–2 published posts on `/blog` for formatting glitches and broken images.
- If a post needs to be unpublished, do it via the database (set `published = false`), not by deleting the row.

**Common issues.**
- *Article didn't appear after webhook fired* → check `receive-article` Edge Function logs. The most common cause is a payload schema mismatch from AutoSEO.
- *Sitemap missing the new post* → it regenerates on a schedule via `generate-sitemap`; force a regeneration if urgent.

**Escalate to.** Whoever owns the AutoSEO integration.

---

## 10. Notifications

**What it is.** All transactional and alert email goes through `send-transactional-email` from the `notify.ariaops.co.uk` sender. Inbound notifications (digests, dispatch alerts, system warnings) land in `/admin/notifications`.

**Where to click.** `/admin/notifications`

**Daily checklist.**
- Clear the unread list once per day.
- Investigate any **system warning** (red badge) — these usually point to a failed cron or a quota issue.

**Common issues.**
- *Email isn't being delivered* → the recipient may have unsubscribed (`/unsubscribe`) or hit a suppression list. Check via the suppression handler.
- *Digest didn't fire* → check the `email-digest` Edge Function logs for the day.

**Escalate to.** Engineering if email infrastructure (DNS, SPF/DKIM/DMARC) needs changes.

---

## 11. Cadence: daily / weekly / monthly

**Every day** (≈15 min)
- [ ] Clear Shield triage (queue at `/admin/shield/alerts`).
- [ ] Approve / reject EIDETIC pending dispatches.
- [ ] Scan `/admin/notifications` for red badges.
- [ ] Glance at `/admin` dashboard counters — anomalies?

**Every week** (≈45 min)
- [ ] Review last week's Requiem runs and GSC rank deltas.
- [ ] Drain the Genesis Sentinel queue.
- [ ] Spot-check 2 random clients in `/admin/clients` — config still correct?
- [ ] Skim recent blog posts for quality.

**Every month** (≈2 hr)
- [ ] Rotate any secret older than 90 days (Supabase Edge Function secrets).
- [ ] Audit the `user_roles` table — anyone who left the team?
- [ ] Review the Atlas/SEO **rejected approaches** memory — make sure no one has accidentally re-added them.
- [ ] Export a client snapshot for VIP clients and send a recap.

---

## 12. Common issues & quick fixes

| Symptom | Likely cause | Quick fix |
|---|---|---|
| Redirected to `/auth` after login | Missing `admin` role | Add row to `user_roles` |
| 401 on Edge Function | JWT expired | Refresh page |
| Shield "Capture Evidence" rejects URL | SSRF guard caught a private/internal/invalid URL | Use a public URL or upload manually |
| Capture evidence times out | Source site slow/hostile | Screenshot + manual upload |
| EIDETIC dispatch stuck "queued" | AI provider error | Check notifications, retry once |
| Requiem run errors on AutoSEO | Upstream webhook failure | Check AutoSEO status, retry sweep |
| Blog post missing after webhook | Payload schema mismatch | Read `receive-article` logs |
| Sitemap stale | Cron hasn't run | Manually invoke `generate-sitemap` |
| Email not delivered | Recipient suppressed | Check suppression / unsubscribe table |
| Digest didn't fire | Cron failed | Check `email-digest` logs |

---

## 13. Escalation matrix

| Area | Owner | When to escalate |
|---|---|---|
| Shield triage decisions | Threat lead | Anything ambiguous; legal-touching content |
| Legal Ops (C&D, GDPR) | Legal Ops owner | Promoted threats needing letters |
| EIDETIC dispatch failures | AI/Platform owner | Repeated AI gateway errors |
| Requiem / AutoSEO | SEO infra owner | Webhook failures, GSC drops |
| Database / RLS | Engineering | Unexpected permission errors |
| Email infrastructure | Engineering | DNS, SPF/DKIM, deliverability |
| Billing / pricing | Commercial owner | Upgrade requests, refunds |
| Security incident | Platform owner + Engineering | Any suspected breach — page immediately |

**Severity definitions.**
- **SEV-1** — production-down or active data leak. Page immediately, no waiting.
- **SEV-2** — a major module is broken (Shield, EIDETIC, Requiem). Same-day fix.
- **SEV-3** — a single feature is degraded. Next-day fix.
- **SEV-4** — cosmetic or low-impact. Backlog.

---

## 14. Glossary

- **A.R.I.A SIGMA** — the platform itself.
- **Shield** — the alert/triage subsystem for incoming threats.
- **EIDETIC** — the digital memory layer that tracks sentiment/relationship decay and proposes responses.
- **Requiem** — the bulk SEO/reputation defense engine.
- **Genesis Sentinel** — the human-in-the-loop verification queue for newly discovered entities/events.
- **Anubis** — the autonomous core that runs background validation and orchestration.
- **RSI** — Reputation Saturation Index, with three modes: Defensive / Aggressive / Nuclear.
- **Clean Launch** — the corporate-intelligence risk-scoring product.
- **AutoSEO** — the upstream content-generation engine that feeds the blog and Requiem via webhooks.
- **Dispatch** — an EIDETIC-proposed response (email, post, takedown, etc.) awaiting approval or already sent.
- **Decay** — the gradual reduction in salience/visibility of an old sentiment or threat over time.

---

*This handbook is the source of truth. Edit `docs/OPS.md` and the in-app `/admin/ops` page updates on the next build.*
