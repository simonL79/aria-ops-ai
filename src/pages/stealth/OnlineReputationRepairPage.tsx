import React from 'react';
import { Wrench, TrendingUp, Search } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';

const cfg: StealthPageConfig = {
  path: '/online-reputation-repair',
  title: 'Online Reputation Repair — A.R.I.A™',
  metaDescription:
    'Online reputation repair for people and brands hit by negative search results, hostile articles and AI misinformation. Operator-delivered suppression, removal and rebuild under NDA.',
  breadcrumbName: 'Online Reputation Repair',
  serviceType: 'Online reputation repair and recovery',
  heroEyebrow: 'Online Reputation Repair',
  h1: (
    <>
      <span className="text-primary">Online reputation repair</span> — when the damage is already on page one.
    </>
  ),
  heroSubhead:
    'A structured recovery programme for individuals and brands facing negative search results, hostile press and AI misinformation. We remove what we can, suppress what we cannot, and rebuild the story that ranks.',
  problem: {
    heading: 'A damaged first page costs you before you ever speak.',
    body: [
      'A negative article, a review pile-on, an old court record or a viral post can dominate your search results for years — and every deal, application and introduction now starts with that page.',
      'Most "repair" offers stop at posting a few profiles and hoping. That rarely moves a determined negative result, and it does nothing about what AI assistants now repeat about you.',
      'A.R.I.A treats reputation repair as a measured recovery operation: audit the damage, remove what is removable, suppress the rest with authority content, and lock in the result with monitoring — all NDA-bound and operator-delivered.',
    ],
  },
  capabilities: [
    {
      icon: Search,
      title: 'Diagnose the damage',
      body: 'A full map of every negative surface — search results, news, reviews, social and AI answers — scored by how much each one is actually hurting you.',
    },
    {
      icon: Wrench,
      title: 'Remove & suppress',
      body: 'Takedown requests, data-broker delisting and outdated-content removal where possible; ranking suppression where removal is not.',
    },
    {
      icon: TrendingUp,
      title: 'Rebuild authority',
      body: 'Accurate, structured content engineered to outrank the negatives and to be cited correctly by ChatGPT, Gemini and Perplexity.',
    },
  ],
  keywordClusters: [
    {
      title: 'Repair & Recovery',
      items: [
        'Online reputation repair',
        'Reputation repair service',
        'Reputation recovery',
        'Fix my online reputation',
        'Google reputation repair',
        'Brand reputation repair',
        'Reputation rehabilitation',
      ],
    },
    {
      title: 'Negative Content',
      items: [
        'Remove negative search results',
        'Remove negative news articles',
        'Suppress negative Google results',
        'Push down bad search results',
        'Bury negative content',
        'Fix negative reviews online',
      ],
    },
    {
      title: 'AI & Monitoring',
      items: [
        'Correct AI misinformation',
        'Fix what ChatGPT says about me',
        'AI reputation repair',
        'Ongoing reputation monitoring',
        'Reputation threat scoring',
        'Authority content rebuild',
      ],
    },
  ],
  methodology: [
    { step: '01', title: 'Damage audit', body: 'Every negative surface catalogued across Google, news, reviews, social and AI assistants.' },
    { step: '02', title: 'Impact scoring', body: 'Each item scored 0–10 so removal and suppression effort targets what is causing real harm.' },
    { step: '03', title: 'Removal push', body: 'Takedowns, data-broker delisting and outdated-content requests pursued wherever content is removable.' },
    { step: '04', title: 'Suppress & rebuild', body: 'Authority content engineered to outrank the remaining negatives and re-frame the narrative.' },
    { step: '05', title: 'Hold the line', body: 'Continuous monitoring with operator escalation on resurfacing or new attacks scored ≥7.' },
  ],
  comparison: {
    competitorLabel: 'Typical reputation repair package',
    rows: [
      { feature: 'Search-result audit', competitor: true, aria: true },
      { feature: 'Content removal & takedown requests', competitor: 'Partial', aria: true },
      { feature: 'Suppression via ranked authority content', competitor: 'Partial', aria: true },
      { feature: 'AI misinformation correction', competitor: false, aria: true },
      { feature: 'Threat scoring 0–10', competitor: false, aria: true },
      { feature: 'Operator-delivered, not self-serve', competitor: false, aria: true },
      { feature: 'Continuous post-repair monitoring', competitor: false, aria: true },
    ],
  },
  faqs: [
    {
      q: 'What does online reputation repair involve?',
      a: 'It combines removing or suppressing harmful content with building accurate, authoritative material that ranks above it — so the first page of results, and what AI assistants say, reflects a fair picture.',
    },
    {
      q: 'Can you actually remove negative content?',
      a: 'Where content breaches platform policy, is defamatory, outdated or exposes personal data, we pursue removal and delisting. Where it cannot be removed, we suppress it by ranking stronger material above it.',
    },
    {
      q: 'How long does reputation repair take?',
      a: 'Initial suppression movement is typically visible within weeks; durable first-page change usually takes a few months depending on how entrenched the negatives are. We report progress throughout.',
    },
    {
      q: 'Do you fix what AI assistants say about me?',
      a: 'Yes. Correcting and re-shaping how ChatGPT, Gemini and Perplexity describe you is a core part of a modern repair, not an add-on.',
    },
    {
      q: 'Is this done for me or do I do the work?',
      a: 'It is fully operator-delivered. Our team runs the audit, removals, content build and monitoring on your behalf under NDA.',
    },
    {
      q: 'Is the engagement confidential?',
      a: 'Yes. Every engagement is NDA-bound and we never disclose clients.',
    },
  ],
  relatedLinks: [
    { to: '/personal-reputation-management', label: 'Personal Reputation Management' },
    { to: '/suppress-negative-google-results', label: 'Suppress Negative Google Results' },
    { to: '/negative-search-result-suppression', label: 'Negative Search Result Suppression' },
    { to: '/crisis-reputation-management', label: 'Crisis Reputation Management' },
    { to: '/corporate-reputation-management', label: 'Corporate Reputation Management' },
  ],
};

const OnlineReputationRepairPage: React.FC = () => <StealthLandingPage cfg={cfg} />;
export default OnlineReputationRepairPage;
