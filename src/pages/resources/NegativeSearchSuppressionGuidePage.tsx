import React from 'react';
import ResourceLayout, { type ResourceConfig } from './ResourceLayout';

const cfg: ResourceConfig = {
  path: '/resources/negative-search-suppression-guide',
  title: 'Negative Search Result Suppression Guide UK | A.R.I.A™',
  metaDescription:
    'A step-by-step UK guide to suppressing negative search results — legal removal, right to be forgotten, push-down SEO and AI-search correction.',
  h1: 'Negative Search Result Suppression Guide',
  eyebrow: 'Step-by-step playbook',
  tldr:
    'How to suppress, delist or remove negative Google results — combining legal, RTBF, platform, SEO and AI-search-correction pathways. UK-focused, but principles apply globally.',
  body: (
    <>
      <h2>Read this first</h2>
      <p>
        Modern suppression is not just push-down SEO. A negative URL that drops to page two of Google
        will frequently still surface inside ChatGPT, Gemini or Google AI Overviews as a
        confident-sounding fact. Durable suppression means addressing all four pathways in parallel:
        legal, platform, SEO, and AI-search.
      </p>

      <h2>Step 1 — Inventory & grade</h2>
      <p>
        List every negative URL across the top 30 Google results for the relevant name, brand or
        topic. For each, capture: sentiment, accuracy, reach, decay trajectory, AI-search citation
        status, and removal viability.
      </p>

      <h2>Step 2 — Pick the cheapest viable pathway first</h2>
      <ul>
        <li><strong>Legal:</strong> defamation pre-action, ICO complaint, court order, takedown.</li>
        <li><strong>Right to be forgotten (UK):</strong> Article 17 UK GDPR delisting request to Google.</li>
        <li><strong>Platform:</strong> Google outdated-content tool, image removal, cached page removal, snippet refresh, knowledge panel correction.</li>
        <li><strong>SEO push-down:</strong> engineered authoritative content on owned, earned and entity surfaces.</li>
        <li><strong>AI-search correction:</strong> source-correction so ChatGPT, Gemini, Perplexity and AI Overviews stop citing the URL.</li>
      </ul>
      <p>
        Each pathway has very different cost, time and risk profiles. Cheapest viable first;
        fallback documented in advance.
      </p>

      <h2>Step 3 — Run legal & platform pathways in parallel</h2>
      <p>
        Legal pre-action and platform removals usually have the highest leverage and are time-cheap
        to start. Fire both in week one, then move to SEO and AI-search work in parallel rather than
        waiting.
      </p>

      <h2>Step 4 — Engineer durable push-down</h2>
      <p>
        Push-down only works if the replacement content is genuinely better than what it’s
        displacing. Owned long-form, entity-rich content; earned third-party placements on
        high-authority domains; structured-data-rich profile pages. Not link-farm filler.
      </p>

      <h2>Step 5 — Close the AI-search loop</h2>
      <p>
        Once the URL is suppressed on Google, check it against your LLM prompt set. If ChatGPT,
        Gemini or Perplexity still surfaces the story, run targeted source-correction so the models
        stop training on or retrieving from the contaminated source.
      </p>

      <h2>Step 6 — Resurfacing monitor</h2>
      <p>
        Resurfacing is the failure mode that ends most suppression projects. Continuous monitoring
        across both Google and AI surfaces, with automatic re-escalation, is mandatory — not
        optional.
      </p>

      <h2>UK-specific notes</h2>
      <p>
        UK GDPR Article 17 (RTBF) is broader than US precedent. UK defamation pre-action is
        comparatively cheap and fast for clear-cut cases. UK news outlets rarely de-publish, but
        corrections, right-of-reply and updated context drastically reduce the reach and accuracy
        of historic stories.
      </p>
    </>
  ),
  ctaHeading: 'Want A.R.I.A to run it for you?',
  ctaBody:
    'A.R.I.A’s suppression engagements combine all five pathways — legal, RTBF, platform, push-down and AI-search correction — with continuous resurfacing monitoring.',
  ctaLabel: 'Explore negative search result suppression',
  ctaTo: '/negative-search-result-suppression',
  schemaType: 'Article',
  related: [
    { to: '/negative-search-result-suppression', label: 'Negative Search Result Suppression' },
    { to: '/suppress-negative-google-results', label: 'Suppress Negative Google Results' },
    { to: '/online-reputation-management-uk', label: 'Online Reputation Management UK' },
    { to: '/crisis-reputation-management', label: 'Crisis Reputation Management' },
  ],
  breadcrumbName: 'Negative Search Suppression Guide',
};

export default function NegativeSearchSuppressionGuidePage() {
  return <ResourceLayout cfg={cfg} />;
}
