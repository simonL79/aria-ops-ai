import React from 'react';
import { ArrowDownToLine, EyeOff, FileMinus, Gavel, Scale, Search } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';

const cfg: StealthPageConfig = {
  path: '/negative-search-result-suppression',
  title: 'Negative Search Result Suppression UK | A.R.I.A™',
  metaDescription:
    'Suppress negative Google results, push down harmful content, and remove outdated or defamatory material — combining legal, RTBF, SEO and AI search pathways.',
  h1: 'Negative Search Result Suppression',
  heroEyebrow: 'Push it down. Get it removed.',
  heroSubhead:
    'A.R.I.A combines legal, right-to-be-forgotten, SEO, GEO and entity-engineering pathways to suppress, delist or remove negative search results — and to prevent them resurfacing in AI search.',
  problem: {
    heading: 'Suppression alone isn’t enough anymore.',
    body: [
      'Traditional suppression buries a negative result under fresh content. That still works on classic Google SERPs — until Google AI Overviews, ChatGPT or Perplexity surfaces the suppressed story as a "fact" in a one-paragraph summary, where rank no longer matters.',
      'A.R.I.A treats suppression as one of four parallel pathways: legal (defamation, RTBF, takedown), platform (Google delisting, outdated-content tool, image removal), SEO/GEO (push-down and entity-engineering) and AI-search correction (so AI models stop repeating the story).',
      'The result is durable suppression — not the kind that quietly resurfaces six months later inside an AI summary.',
    ],
  },
  capabilities: [
    { icon: ArrowDownToLine, title: 'SERP push-down', body: 'Engineered authoritative content on owned, earned and entity surfaces so harmful URLs drop past page one and stay there.' },
    { icon: Gavel, title: 'Legal removal', body: 'Defamation pre-action, takedown letters, ICO and court routes — coordinated with specialist UK solicitors where required.' },
    { icon: Scale, title: 'Right to be forgotten', body: 'GDPR/UK GDPR Article 17 RTBF and Google delisting submissions, drafted to the standard the platforms actually accept.' },
    { icon: FileMinus, title: 'Outdated content removal', body: 'Google’s outdated-content tool, image removal, cached-page expiry and snippet refresh — exhausted before falling back to push-down.' },
    { icon: Search, title: 'AI-search correction', body: 'When the suppressed story resurfaces in ChatGPT, Gemini or AI Overviews, A.R.I.A executes targeted source-correction so the models stop repeating it.' },
    { icon: EyeOff, title: 'Data broker scrubbing', body: 'Personal data removed from data-broker and people-search sites that feed both search engines and AI models.' },
  ],
  keywordClusters: [
    {
      title: 'Suppression & removal',
      items: [
        'Negative search result suppression',
        'Suppress negative Google results',
        'Push down negative Google results',
        'Bury negative Google results',
        'Negative content removal',
        'Harmful content removal',
        'Reputation repair',
        'Reputation repair UK',
      ],
    },
    {
      title: 'Legal pathways',
      items: [
        'Right to be forgotten UK',
        'GDPR Article 17 request',
        'Defamation removal',
        'Defamation pre-action UK',
        'Smear campaign response',
        'Cease and desist letter',
        'Online libel removal UK',
      ],
    },
    {
      title: 'Platform pathways',
      items: [
        'Google delisting',
        'Outdated content removal',
        'Google outdated content tool',
        'Image removal Google',
        'Cached page removal',
        'News article suppression',
        'Forum post removal',
      ],
    },
  ],
  methodology: [
    { step: '01', title: 'Target audit', body: 'Every negative URL inventoried with severity grading, reach, decay trajectory, AI-search citation status and removal viability.' },
    { step: '02', title: 'Pathway selection', body: 'For each target, the cheapest viable pathway is selected first — legal, platform, SEO or AI-correction — with fallbacks documented.' },
    { step: '03', title: 'Legal & platform action', body: 'RTBF, defamation pre-action, takedown notices, ICO complaints and Google removal tools deployed against the highest-impact targets.' },
    { step: '04', title: 'SEO/GEO push-down', body: 'Engineered authoritative content published to own, partner and entity surfaces to displace surviving URLs from page one.' },
    { step: '05', title: 'AI-search correction', body: 'Targeted source-correction so ChatGPT, Gemini, Perplexity and AI Overviews stop surfacing the suppressed content as fact.' },
    { step: '06', title: 'Resurfacing monitor', body: 'Continuous scanning for resurfacing across both Google and AI surfaces, with automatic re-escalation.' },
  ],
  comparison: {
    competitorLabel: 'Igniyte / Minc / ReputationDefender',
    rows: [
      { feature: 'SEO push-down', competitor: true, aria: true },
      { feature: 'Right to be forgotten (UK GDPR)', competitor: 'Some', aria: true },
      { feature: 'Defamation legal pathway', competitor: 'Some', aria: true },
      { feature: 'Outdated content tool exhaustion', competitor: false, aria: true },
      { feature: 'AI-search resurfacing correction', competitor: false, aria: true },
      { feature: 'Data broker scrubbing', competitor: 'Limited', aria: 'Full' },
      { feature: 'Continuous resurfacing monitor (Google + AI)', competitor: false, aria: true },
    ],
  },
  faqs: [
    { q: 'How long does suppression take?', a: 'Legal/platform removals can resolve in 14–90 days. SEO push-down typically takes 3–6 months. AI-search correction tracks the underlying source-correction cycle — days to months depending on the model.' },
    { q: 'What can be legally removed in the UK?', a: 'Defamatory content, content that breaches GDPR (Article 17), revenge content, content protected by court order, and content the platforms themselves classify as removable (harassment, doxxing, non-consensual imagery, etc.).' },
    { q: 'Can you remove news articles?', a: 'Sometimes. UK news outlets rarely de-publish, but corrections, right-of-reply, updated context, RTBF delisting from Google and AI-source-correction can dramatically reduce reach and impact.' },
    { q: 'What if the content keeps coming back?', a: 'A.R.I.A’s resurfacing monitor watches Google and AI surfaces continuously and auto-escalates any reappearance. Reappearance is treated as a campaign, not an incident.' },
    { q: 'Will this work for content in ChatGPT or Gemini?', a: 'Yes — that is exactly what the AI-search-correction layer is for. We address the underlying source contamination so the models stop confidently repeating the content.' },
  ],
  relatedLinks: [
    { to: '/suppress-negative-google-results', label: 'Suppress Negative Google Results' },
    { to: '/online-reputation-management-uk', label: 'Online Reputation Management UK' },
    { to: '/crisis-reputation-management', label: 'Crisis Reputation Management' },
    { to: '/resources/negative-search-suppression-guide', label: 'Negative Search Suppression Guide' },
  ],
  serviceType: 'Negative search result suppression',
  breadcrumbName: 'Negative Search Result Suppression',
};

export default function NegativeSearchResultSuppressionPage() {
  return <StealthLandingPage cfg={cfg} />;
}
