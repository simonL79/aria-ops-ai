import React from 'react';
import { MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';

const cfg: StealthPageConfig = {
  path: '/online-reputation-management-uk',
  title: 'Online Reputation Management UK — A.R.I.A™',
  metaDescription:
    'UK online reputation management with an AI defence layer. Reputation repair, suppression and monitoring for founders, executives and brands across England, Scotland and the UK.',
  breadcrumbName: 'Online Reputation Management UK',
  serviceType: 'UK online reputation management and repair',
  heroEyebrow: 'Online Reputation Management UK',
  h1: (
    <>
      <span className="text-primary">Online reputation management</span> for the UK — built for the AI era.
    </>
  ),
  heroSubhead:
    'UK-based reputation management agency combining classical ORM, Google search suppression and AI search defence. For founders, executives, athletes and brands across the UK, Scotland and Glasgow.',
  problem: {
    heading: 'Traditional UK ORM stops at Google. That\'s no longer enough.',
    body: [
      'The legacy UK ORM market — Igniyte, ReputationDefender, BrandYourself — was built for an internet where Google was the only verdict that mattered. Build positive content, push the negative to page two, hold the line.',
      'That model is breaking. ChatGPT, Gemini, Perplexity and Google\'s own AI Overviews now answer the credibility question before a single search result is clicked. A reputation that looks clean on Google can still be lethal inside an LLM\'s answer.',
      'A.R.I.A is a UK reputation specialist with an AI defence layer built in. The full traditional ORM toolkit — suppression, removal, monitoring, authority content — plus active defence across the LLM web.',
    ],
  },
  capabilities: [
    {
      icon: MapPin,
      title: 'UK-grounded',
      body: 'Operated from the UK. Direct experience with UK courts, ICO complaints, GDPR right-to-be-forgotten, and the platforms UK reputation cases actually need.',
    },
    {
      icon: ShieldCheck,
      title: 'Full ORM toolkit',
      body: 'Negative search result suppression, harmful content removal, defamation and false-content pathways, review management, crisis response.',
    },
    {
      icon: Sparkles,
      title: 'AI defence layer',
      body: 'Every UK engagement includes LLM visibility tracking and AI narrative defence — so ChatGPT and Gemini describe you correctly too.',
    },
  ],
  keywordClusters: [
    {
      title: 'UK ORM Services',
      items: [
        'Online reputation management UK',
        'Reputation management agency',
        'Reputation management company UK',
        'Reputation repair UK',
        'Online reputation repair',
        'ORM consultant UK',
        'Online reputation consultant UK',
        'Reputation specialist UK',
        'AI ORM UK',
      ],
    },
    {
      title: 'Scotland & Glasgow',
      items: [
        'Reputation management Glasgow',
        'Reputation management Scotland',
        'Reputation specialist Glasgow',
        'Glasgow ORM agency',
        'Scotland reputation repair',
      ],
    },
    {
      title: 'Audit & Monitoring',
      items: [
        'Online reputation audit',
        'Reputation audit',
        'Personal brand audit',
        'Executive reputation audit',
        'Brand risk audit',
        'Reputation monitoring platform',
        'Real-time reputation monitoring',
        'Social media reputation monitoring',
      ],
    },
    {
      title: 'AI Layer (Included)',
      items: [
        'AI reputation management',
        'AI reputation monitoring',
        'AI reputation defence',
        'LLM reputation management',
        'Brand visibility in AI search',
      ],
    },
  ],
  methodology: [
    { step: '01', title: 'UK reputation audit', body: 'Full surface review: Google UK, news, social, Companies House signals, AI answers, dark web.' },
    { step: '02', title: 'Risk scoring', body: 'Every threat scored 0–10 for severity, reach and commercial impact under UK context.' },
    { step: '03', title: 'Suppress & remove', body: 'Page-one suppression, ICO/GDPR removal requests, defamation routes where applicable.' },
    { step: '04', title: 'Authority content', body: 'On-brand assets engineered to outrank hostile pages and to be cited by AI systems.' },
    { step: '05', title: 'Continuous defence', body: 'Monthly reporting on Google rank, AI answers and emerging threats — operator-led, not self-serve.' },
  ],
  comparison: {
    competitorLabel: 'Traditional UK ORM agency',
    rows: [
      { feature: 'UK-based operations', competitor: true, aria: true },
      { feature: 'Google search suppression', competitor: true, aria: true },
      { feature: 'GDPR / right to be forgotten UK', competitor: 'Partial', aria: true },
      { feature: 'ChatGPT / Gemini / Perplexity defence', competitor: false, aria: true },
      { feature: 'Google AI Overview optimisation', competitor: false, aria: true },
      { feature: 'Threat scoring 0–10', competitor: false, aria: true },
      { feature: 'Operator-delivered (not dashboard-only)', competitor: 'Partial', aria: true },
      { feature: 'Coverage for Scotland / Glasgow', competitor: 'Partial', aria: true },
    ],
  },
  faqs: [
    {
      q: 'Are you a UK-based reputation management agency?',
      a: 'Yes. A.R.I.A is operated from the UK with direct experience of UK platforms, UK media, ICO complaints, GDPR right-to-be-forgotten and UK defamation pathways.',
    },
    {
      q: 'Do you serve clients in Scotland and Glasgow?',
      a: 'Yes. We work with clients across Scotland and have specific operational coverage for Glasgow. Engagements are remote-first with on-site work where needed.',
    },
    {
      q: 'How much does UK online reputation management cost?',
      a: 'Engagements are scoped to severity. Audits start from a fixed fee; ongoing defence is priced per quarter based on threat volume and asset deployment. Pricing is shared after the initial audit conversation.',
    },
    {
      q: 'Can you remove negative Google results in the UK?',
      a: 'Where lawful, yes — via GDPR right-to-be-forgotten requests, ICO escalation, defamation routes and outdated-content delisting. Where removal is not viable, we suppress through ranking and authority content.',
    },
    {
      q: 'What\'s the difference between you and Igniyte or ReputationDefender?',
      a: 'They are classical ORM agencies operating to a pre-AI playbook. A.R.I.A combines the same suppression and content toolkit with active defence across ChatGPT, Gemini and Perplexity — and we score every threat 0–10 instead of running an opaque retainer.',
    },
    {
      q: 'Is the engagement confidential?',
      a: 'All UK engagements are NDA-bound and operator-delivered. We never list clients publicly.',
    },
  ],
  relatedLinks: [
    { to: '/ai-reputation-management', label: 'AI Reputation Management' },
    { to: '/suppress-negative-google-results', label: 'Suppress Negative Google Results' },
    { to: '/executive-reputation-protection', label: 'Executive Reputation Protection' },
    { to: '/ai-reputation-readiness', label: 'AI Reputation Readiness Audit' },
    { to: '/simon-lindsay/glasgow', label: 'Glasgow operations' },
  ],
};

const OnlineReputationManagementUKPage: React.FC = () => <StealthLandingPage cfg={cfg} />;
export default OnlineReputationManagementUKPage;
