import React from 'react';
import ResourceLayout, { type ResourceConfig } from './ResourceLayout';

const CHECKS = [
  { window: 'Hour 0 — Activation', items: [
    'One call to the named A.R.I.A operator lead.',
    'Confirm severity grade and active incident type.',
    'Activate first-72-hours playbook and start the clock.',
    'Confirm authorised spokespersons.',
    'Open shared incident log (timestamped, append-only).',
  ]},
  { window: 'Hour 0–6 — Containment', items: [
    'Full surface scan: Google, AI, social, news, dark web.',
    'Severity-grade each item; identify highest-leverage targets.',
    'File platform escalations (trust & safety, defamation, harassment).',
    'Prepare legal triggers: pre-action defamation, RTBF, takedown.',
    'File knowledge-panel correction where applicable.',
  ]},
  { window: 'Hour 6–24 — Correction', items: [
    'Launch AI-search source-correction loop.',
    'Launch SEO push-down with engineered authoritative content.',
    'Issue RTBF / defamation pre-action against highest-impact targets.',
    'Draft stakeholder briefing pack (sponsors, investors, board, federation).',
    'Brief authorised spokespersons; pre-clear lines with legal.',
  ]},
  { window: 'Hour 24–48 — Counter-narrative', items: [
    'Publish authoritative content on owned and earned surfaces.',
    'Deliver stakeholder briefings live, not by email.',
    'Follow up platform escalations; escalate non-responders.',
    'First diff: SERP composition + AI prompt-set vs baseline.',
    'Assess whether escalation to specialist UK solicitors is required.',
  ]},
  { window: 'Hour 48–72 — Stabilisation', items: [
    'Activate resurfacing monitor (Google + AI) with auto re-escalation.',
    'Severity trend report to your team and your board.',
    'Agree longer-arc plan: 7-day, 30-day, 90-day horizon.',
    'Transition from crisis cadence into durable defence cadence.',
    'Post-incident review scheduled (within 14 days, not later).',
  ]},
];

const cfg: ResourceConfig = {
  path: '/resources/crisis-reputation-response-checklist',
  title: 'Crisis Reputation Response Checklist (72h) | A.R.I.A™',
  metaDescription:
    'A first-72-hours crisis reputation response checklist. Hour-by-hour actions across search, AI, legal, platform and stakeholder lanes. Free playbook.',
  h1: 'Crisis Reputation Response Checklist',
  eyebrow: 'First 72 hours, hour-by-hour',
  tldr:
    'The first 72 hours decide most modern reputation crises. This checklist gives you the hour-by-hour actions — across search, AI, legal, platform and stakeholder lanes — so nothing is improvised under pressure.',
  body: (
    <>
      <h2>Why the first 72 hours matter most</h2>
      <p>
        Modern reputation crises crystallise in three days. Whatever the search surface, the AI
        summary and the headlines say at hour 72 is what most stakeholders will believe — long after
        the actual facts have settled. Anything you do not do in this window is roughly 10× more
        expensive to do later.
      </p>

      {CHECKS.map((c) => (
        <section key={c.window}>
          <h2>{c.window}</h2>
          <ul>
            {c.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </section>
      ))}

      <h2>What gets people in trouble</h2>
      <ul>
        <li>Treating it as a press problem instead of a multi-surface problem.</li>
        <li>Ignoring AI-search outputs because they "aren’t official".</li>
        <li>Briefing stakeholders by email rather than live.</li>
        <li>Skipping the resurfacing monitor and assuming the crisis is "over".</li>
        <li>Improvising the response instead of running a pre-built playbook.</li>
      </ul>

      <h2>Build it cold, use it hot</h2>
      <p>
        This checklist is most valuable when it is agreed with your team — manager, PR, lawyer,
        sponsor liaison, board secretary — before any incident. Build it calm. Use it calm. The
        worst possible time to design a crisis response is during one.
      </p>
    </>
  ),
  ctaHeading: 'Want A.R.I.A on standby?',
  ctaBody:
    'A.R.I.A’s crisis reputation engagements include a named operator lead, 24/7 activation and the full first-72-hours playbook — ready before any incident.',
  ctaLabel: 'Explore crisis reputation management',
  ctaTo: '/crisis-reputation-management',
  schemaType: 'HowTo',
  schemaExtras: {
    step: CHECKS.flatMap((c, ci) =>
      c.items.map((it, i) => ({
        '@type': 'HowToStep',
        position: ci * 10 + i + 1,
        name: `${c.window} — ${it}`,
      })),
    ),
  },
  related: [
    { to: '/crisis-reputation-management', label: 'Crisis Reputation Management' },
    { to: '/negative-search-result-suppression', label: 'Negative Search Result Suppression' },
    { to: '/executive-reputation-protection', label: 'Executive Reputation Protection' },
    { to: '/reputation-threat-score', label: 'Reputation Threat Score' },
  ],
  breadcrumbName: 'Crisis Reputation Response Checklist',
};

export default function CrisisReputationResponseChecklistPage() {
  return <ResourceLayout cfg={cfg} />;
}
