import React from 'react';
import { Building2, LineChart, ShieldAlert } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';

const cfg: StealthPageConfig = {
  path: '/corporate-reputation-management',
  title: 'Corporate Reputation Management — A.R.I.A™',
  metaDescription:
    'Corporate reputation management for companies, boards and brands. Threat detection, crisis defence, search suppression and AI narrative control — operator-delivered under NDA.',
  breadcrumbName: 'Corporate Reputation Management',
  serviceType: 'Corporate and brand reputation management',
  heroEyebrow: 'Corporate Reputation Management',
  h1: (
    <>
      <span className="text-primary">Corporate reputation management</span> — protecting enterprise value at search speed.
    </>
  ),
  heroSubhead:
    'Reputation management for companies, boards and brands. We detect threats early, defend the corporate narrative across Google and AI, and contain crises before they compound.',
  problem: {
    heading: 'For a company, reputation is balance-sheet risk.',
    body: [
      'A hostile article, a Glassdoor pile-on, a regulatory headline or a viral customer complaint can move procurement decisions, partnerships, hiring and valuation — often faster than PR can respond.',
      'Enterprise ORM platforms are built for review aggregation across locations; they were not designed for coordinated attacks, activist campaigns, or the AI answers buyers now trust before they ever visit your site.',
      'A.R.I.A runs corporate reputation management as an intelligence operation: continuous threat detection, board-level risk scoring, search suppression, authority building and operator-led crisis response — all under NDA.',
    ],
  },
  capabilities: [
    {
      icon: LineChart,
      title: 'Threat intelligence',
      body: 'Continuous monitoring across Google, news, social, review platforms and the dark web — with threats clustered to detect coordinated campaigns.',
    },
    {
      icon: Building2,
      title: 'Corporate narrative defence',
      body: 'Search suppression plus authority content that protects how Google and AI assistants describe the company, its leadership and its brands.',
    },
    {
      icon: ShieldAlert,
      title: 'Crisis containment',
      body: 'Operator-led response for live incidents — takedowns, escalation and message control to stop a story compounding.',
    },
  ],
  keywordClusters: [
    {
      title: 'Corporate & Brand',
      items: [
        'Corporate reputation management',
        'Company reputation management',
        'Brand reputation management',
        'Business reputation management',
        'Enterprise reputation management',
        'Board reputation protection',
        'B2B reputation management',
      ],
    },
    {
      title: 'Threats & Crisis',
      items: [
        'Corporate crisis management',
        'Reputation threat detection',
        'Coordinated attack detection',
        'Activist campaign response',
        'Negative press management',
        'Review attack response',
      ],
    },
    {
      title: 'Search & AI',
      items: [
        'Suppress negative company results',
        'Corporate Google suppression',
        'AI reputation management',
        'Brand authority content',
        'Executive narrative protection',
        'Continuous corporate monitoring',
      ],
    },
  ],
  methodology: [
    { step: '01', title: 'Corporate audit', body: 'Full surface review across Google, news, review platforms, social and dark-web mentions of the company and its leadership.' },
    { step: '02', title: 'Risk modelling', body: 'Threats scored 0–10 and clustered to distinguish noise from coordinated, board-level risk.' },
    { step: '03', title: 'Defend the surface', body: 'Search suppression, takedowns and outdated-content requests to clear and control the corporate first page.' },
    { step: '04', title: 'Authority build', body: 'Structured brand and leadership content engineered to outrank threats and be cited correctly by AI assistants.' },
    { step: '05', title: 'Standing watch', body: 'Continuous monitoring with operator escalation on anything scored ≥7 and a scheduled board briefing.' },
  ],
  comparison: {
    competitorLabel: 'Enterprise review-ORM platform',
    rows: [
      { feature: 'Review monitoring dashboard', competitor: true, aria: true },
      { feature: 'Coordinated-attack detection', competitor: false, aria: true },
      { feature: 'Search suppression & takedowns', competitor: 'Partial', aria: true },
      { feature: 'AI / LLM narrative control', competitor: false, aria: true },
      { feature: 'Operator-led crisis response', competitor: false, aria: true },
      { feature: 'Board-level threat scoring 0–10', competitor: false, aria: true },
      { feature: 'NDA-bound engagement', competitor: false, aria: true },
    ],
  },
  faqs: [
    {
      q: 'What is corporate reputation management?',
      a: 'It is the ongoing protection of how a company, its brands and its leadership are perceived across search and AI — combining threat detection, search suppression, authority content and crisis response.',
    },
    {
      q: 'How is A.R.I.A different from an enterprise ORM platform?',
      a: 'Enterprise platforms focus on aggregating reviews across locations. A.R.I.A adds coordinated-attack detection, search suppression, AI narrative control and operator-led crisis response designed for reputational threats, not just review scores.',
    },
    {
      q: 'Can you handle a live corporate crisis?',
      a: 'Yes. Our operators run live incident response — takedowns, escalation, message control and search containment — to stop a story compounding across channels.',
    },
    {
      q: 'Do you protect executives as well as the brand?',
      a: 'Yes. Leadership reputation is part of corporate scope, and can be extended to individual executive protection where a named person is under attack.',
    },
    {
      q: 'How is progress reported to the board?',
      a: 'Threats are scored 0–10 and summarised in a scheduled board briefing, with immediate operator escalation on anything scored ≥7.',
    },
    {
      q: 'Is the engagement confidential?',
      a: 'Yes. Every engagement is NDA-bound and we never disclose clients publicly.',
    },
  ],
  relatedLinks: [
    { to: '/online-reputation-repair', label: 'Online Reputation Repair' },
    { to: '/crisis-reputation-management', label: 'Crisis Reputation Management' },
    { to: '/executive-reputation-protection', label: 'Executive Reputation Protection' },
    { to: '/services/brand-protection', label: 'Brand Protection' },
    { to: '/personal-reputation-management', label: 'Personal Reputation Management' },
  ],
};

const CorporateReputationManagementPage: React.FC = () => <StealthLandingPage cfg={cfg} />;
export default CorporateReputationManagementPage;
