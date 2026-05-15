## What the data says

Across the last few exchanges three signals line up:

1. **Three SEO findings still open** — duplicate per-route titles/descriptions, Google Search Console not connected, and mobile image aspect-ratio warnings.
2. **Your beachhead is the UK** — "online reputation management" UK (1,600/mo, KDI 57), "how to remove google reviews" UK (720/mo, KDI 34), "brand protection" UK (720/mo, KDI 27). All winnable, all match what A.R.I.A actually sells.
3. **The incumbent link playbook is junk** — Igniyte and ReputationDefender both rank on spam-directory backlinks. You'll win on PR + legally-grounded content, not link volume.

This plan is two phases: fix the foundations the SEO scanner is flagging, then build the content that turns the keyword opportunity into traffic.

---

## Phase 1 — Close the open SEO findings

### 1.1 Per-route titles and descriptions (`metadata_quality`)
- Install `react-helmet-async`; wrap `src/main.tsx` in `<HelmetProvider>`.
- Remove the `<link rel="canonical">` from `index.html` so Helmet owns canonicals (avoids double-canonical bug).
- Add `<Helmet>` to every public, indexable route with a unique title (<60 chars) and description (50–160 chars):

  ```text
  /                            Index
  /auth                        Authentication
  /cybersecurity-framework     CybersecurityFrameworkPage
  /portal/no-access            PortalNoAccess
  /blog/:slug                  BlogPostPage  (dynamic — pull from post)
  /unsubscribe                 UnsubscribePage  (also add noindex)
  ```
  Admin, `/portal/*` and `/dashboard/*` routes stay out — they're auth-gated and shouldn't be indexed.

### 1.2 Google Search Console (`gsc`)
- Trigger the connector picker for `google_search_console`.
- Run the META verification flow against `https://www.ariaops.co.uk/`.
- Submit `/sitemap.xml` once verified.

### 1.3 Mobile aspect-ratio images (`lighthouse_mobile`)
- Audit `<img>` usage on the homepage and any public route. Wrap each in an `aspect-*` container with `object-cover`, or add explicit `width`/`height` matching the source file.
- Republish so Lighthouse re-scans the live build.

---

## Phase 2 — Ship 3 UK authority pages (turn the research into traffic)

Each page is a new public route, gets its own Helmet block, lands in the sitemap, and is written for UK readers/jurisdiction. All three target KDIs you can realistically rank for.

### 2.1 `/services/remove-google-reviews` — UK guide to fake-review removal
- **Targets:** "how to remove google reviews" (720/mo), "how to remove fake google reviews" (90/mo), plus the long-tail cluster.
- **Content:** Step-by-step Google flagging walkthrough, what counts as a Google policy violation, when to escalate (defamation, Malicious Communications Act 1988, Communications Act 2003 s.127), soft CTA: *"If Google won't remove it, here's when A.R.I.A steps in."*
- **JSON-LD:** `FAQPage` covering the question keywords ("can google remove fake reviews", "does google remove fake reviews", etc.).

### 2.2 `/services/online-impersonation-uk` — UK legal guide
- **Targets:** "online impersonation" (KDI 26 — easy), plus UK-specific long-tail.
- **Content:** What counts as impersonation under UK law, evidence-gathering steps, platform reporting routes (Meta/X/TikTok/LinkedIn), Action Fraud + ICO escalation, when A.R.I.A's Legal Ops can take over.
- **Why this wins:** the current SERP is dominated by US legal sites — there's no strong UK page on this topic.

### 2.3 `/services/brand-protection` — premium UK brand-protection page
- **Targets:** "brand protection" UK (720/mo, $17.68 CPC, KDI 27).
- **Content:** Threat detection → narrative defense → legal removal pipeline. Position against the directory-link agencies by leading with AI threat detection and the autonomous-response angle (your actual differentiator).

### 2.4 Sitemap + linking
- Add the three new routes to `public/sitemap.xml`.
- Cross-link them from the homepage's services section so internal authority flows in.

---

## Phase 3 (light-touch, post-launch) — earn the right kind of links

Don't repeat the incumbent playbook. Two repeatable motions only:

- **Reporter sourcing:** get Simon onto Qwoted / ResponseSource / Featured.com answering AI-deepfake, executive-impersonation, and online-defamation queries. One placement in BBC/FT/Wired tier press is worth 10,000 directory links.
- **Charity + legal-aid outreach:** pitch the `/services/online-impersonation-uk` page to Cyber Helpline, Refuge, Suzy Lamplugh Trust as a free citizen resource. Those links are exactly what Google's E-E-A-T signal rewards.

---

## Technical notes (for implementation)

- **Helmet adoption:** must remove the static canonical from `index.html` at the same commit Helmet ships, otherwise every page gets two canonicals.
- **Sitemap mechanism:** `public/sitemap.xml` is currently hand-edited. Three new static routes can be added in place — no migration needed unless we later want to auto-include published blog posts.
- **No new backend / no schema changes** — Phase 1 and 2 are entirely frontend + content.
- **Phase 2 content** can be written by you (founder voice) or via the existing AutoSEO webhook flow — your choice. Per project memory, in-house generation is rejected, so AutoSEO is the path if you don't want to write them yourself.

---

## What I need from you to start

1. **Phase 1 — go ahead?** I'll do all three findings in one pass.
2. **Phase 2 — green-light all three pages, or pick a subset?**
3. **Phase 2 content authoring — you write, or trigger AutoSEO?**
