import React from 'react';
import ResourceLayout, { type ResourceConfig } from './ResourceLayout';

const CHECKLIST = [
  { group: 'Entity & identity', items: [
    'Single canonical name and spelling used across every owned property.',
    'Schema.org Person / Organization markup live on the homepage and about page.',
    'Wikidata entity created or claimed, with sourced statements.',
    'LinkedIn, Crunchbase and About pages aligned to the same biography.',
    'Knowledge panel claimed where eligible (Google, Bing).',
  ]},
  { group: 'AI search readiness', items: [
    'llms.txt file published at the site root and kept current.',
    'A documented prompt set tested across ChatGPT, Gemini, Perplexity, Copilot and Google AI Overviews.',
    'Citation map showing the top 20 sources the models actually use.',
    'Long-form, structurally rich GEO content on at least three high-priority topics.',
    'Hallucination log — known false claims by model, with assigned source-correction owner.',
  ]},
  { group: 'Search-surface hygiene', items: [
    'Top 20 Google results audited and graded for sentiment, accuracy and removal viability.',
    'Right-to-be-forgotten requests submitted for every outdated / inaccurate result.',
    'Outdated content tool exhausted on all stale cached pages and images.',
    'Data broker and people-search removals filed.',
    'Defamatory or harmful content escalated through legal pre-action where applicable.',
  ]},
  { group: 'Defence & response', items: [
    'Always-on monitoring across Google, AI, social, news and dark web.',
    'First-72-hours crisis playbook documented and pre-approved with your team.',
    'Named lawyer-on-call for defamation and privacy.',
    'Reputation threat score baselined and tracked monthly.',
    'Quarterly board-grade reputation health report scheduled.',
  ]},
];

const cfg: ResourceConfig = {
  path: '/resources/ai-reputation-readiness-checklist',
  title: 'AI Reputation Readiness Checklist (20-Point) | A.R.I.A™',
  metaDescription:
    'A 20-point AI reputation readiness checklist covering entity integrity, AI search readiness, search-surface hygiene and crisis response. Free to use.',
  h1: 'AI Reputation Readiness Checklist',
  eyebrow: '20-point checklist',
  tldr:
    'Twenty checks across four domains — entity, AI search, search-surface hygiene and defence. If you can confidently tick every item, you are AI-reputation ready. If not, each gap is the next thing to fix.',
  body: (
    <>
      <h2>Who this checklist is for</h2>
      <p>
        Founders, executives, athletes, public figures and brand teams who want a clean, defensible
        view of where their reputation surface stands across both classic Google and the AI layer.
        Each item is binary: it is either done or it isn’t. No vanity metrics.
      </p>
      <h2>The 20 checks</h2>
      {CHECKLIST.map((g) => (
        <section key={g.group}>
          <h3>{g.group}</h3>
          <ul>
            {g.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </section>
      ))}
      <h2>How to use it</h2>
      <p>
        Score honestly. Anything you can’t evidence with a screenshot, file or live URL counts as a
        miss. Then sequence the misses by leverage — entity and AI-search items typically unlock the
        most downstream protection, followed by search-surface hygiene and finally defence
        infrastructure.
      </p>
      <p>
        If you want it done for you, the A.R.I.A AI Reputation Readiness Audit runs all 20 checks,
        grades the evidence, and hands back a prioritised remediation plan.
      </p>
    </>
  ),
  ctaHeading: 'Want this run for you?',
  ctaBody:
    'The A.R.I.A audit runs all 20 checks against live data, grades the evidence and delivers a prioritised plan — typically inside 10 working days.',
  ctaLabel: 'Request AI reputation management',
  ctaTo: '/ai-reputation-management',
  schemaType: 'HowTo',
  schemaExtras: {
    step: CHECKLIST.flatMap((g, gi) =>
      g.items.map((it, i) => ({
        '@type': 'HowToStep',
        position: gi * 5 + i + 1,
        name: it,
      })),
    ),
  },
  related: [
    { to: '/ai-reputation-readiness', label: 'AI Reputation Readiness service' },
    { to: '/resources/llm-visibility-audit-template', label: 'LLM Visibility Audit Template' },
    { to: '/resources/crisis-reputation-response-checklist', label: 'Crisis Reputation Response Checklist' },
    { to: '/reputation-threat-score', label: 'Reputation Threat Score' },
  ],
  breadcrumbName: 'AI Reputation Readiness Checklist',
};

export default function AIReputationReadinessChecklistPage() {
  return <ResourceLayout cfg={cfg} />;
}
