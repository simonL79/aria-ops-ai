import React from 'react';
import { UserCheck, ShieldCheck, Sparkles } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';

const cfg: StealthPageConfig = {
  path: '/personal-reputation-management',
  title: 'Personal Reputation Management — A.R.I.A™',
  metaDescription:
    'Personal reputation management for individuals whose name carries commercial weight. Google suppression, privacy, AI narrative control and human-led defence under NDA.',
  breadcrumbName: 'Personal Reputation Management',
  serviceType: 'Personal online reputation management for individuals',
  heroEyebrow: 'Personal Reputation Management',
  h1: (
    <>
      <span className="text-primary">Personal reputation management</span> — engineered around one name: yours.
    </>
  ),
  heroSubhead:
    'Operator-delivered personal reputation management for professionals, founders and public individuals. We control what Google and AI assistants say about you — and keep it that way.',
  problem: {
    heading: 'Your name is searched before every introduction.',
    body: [
      'Clients, investors, hiring committees, partners and dates all run the same silent check: they type your name into Google — and, increasingly, into ChatGPT. Whatever surfaces first becomes the story, whether or not it is fair or current.',
      'Self-serve tools hand you a dashboard and leave the work to you. That does not help when a single hostile page, an outdated news story or an AI hallucination is shaping first impressions you never get to make in person.',
      'A.R.I.A runs personal reputation management as a done-for-you engagement: we audit your entire personal search surface, suppress what is harming you, build authority that outranks it, and monitor it continuously — all NDA-bound.',
    ],
  },
  capabilities: [
    {
      icon: UserCheck,
      title: 'Built around the individual',
      body: 'A programme scoped to you as a person — your name, aliases, roles and the queries that actually decide how people perceive you.',
    },
    {
      icon: ShieldCheck,
      title: 'Suppress & protect',
      body: 'Data-broker delisting, personal information removal, outdated-content requests and suppression of negative results down the first two pages.',
    },
    {
      icon: Sparkles,
      title: 'AI narrative control',
      body: 'Active shaping of how ChatGPT, Gemini and Perplexity describe you, backed by authority content designed to be cited correctly.',
    },
  ],
  keywordClusters: [
    {
      title: 'Personal ORM',
      items: [
        'Personal reputation management',
        'Personal online reputation management',
        'Individual reputation management',
        'Personal brand protection',
        'Personal reputation repair',
        'Manage my Google results',
        'Clean up my online image',
      ],
    },
    {
      title: 'Privacy & Removal',
      items: [
        'Personal information removal',
        'Remove personal details from Google',
        'Data broker removal',
        'Outdated content removal',
        'Doxxing protection',
        'Online harassment support',
      ],
    },
    {
      title: 'AI & Search',
      items: [
        'What does ChatGPT say about me',
        'AI reputation management',
        'Google name suppression',
        'Negative result suppression',
        'Personal authority content',
        'Ongoing reputation monitoring',
      ],
    },
  ],
  methodology: [
    { step: '01', title: 'Personal audit', body: 'Full review of your name across Google, LLMs, social, data brokers and news — mapped to the queries that matter.' },
    { step: '02', title: 'Risk scoring', body: 'Each finding scored 0–10 by reputational and commercial impact so effort goes where it counts.' },
    { step: '03', title: 'Suppress & remove', body: 'Personal-data takedowns, data-broker delisting and outdated-content requests to clear harmful surfaces.' },
    { step: '04', title: 'Authority build', body: 'Owned, structured content engineered to outrank hostile pages and to be cited correctly by AI assistants.' },
    { step: '05', title: 'Continuous watch', body: 'Ongoing monitoring with operator escalation on anything scored ≥7, plus a periodic personal briefing.' },
  ],
  comparison: {
    competitorLabel: 'Self-serve personal ORM app',
    rows: [
      { feature: 'Personal reputation dashboard', competitor: true, aria: true },
      { feature: 'Done-for-you (operator-delivered)', competitor: false, aria: true },
      { feature: 'Personal information & data-broker removal', competitor: 'Partial', aria: true },
      { feature: 'Negative Google result suppression', competitor: 'Partial', aria: true },
      { feature: 'ChatGPT / Gemini narrative control', competitor: false, aria: true },
      { feature: 'Threat scoring 0–10', competitor: false, aria: true },
      { feature: 'NDA-bound engagement', competitor: false, aria: true },
    ],
  },
  faqs: [
    {
      q: 'What is personal reputation management?',
      a: 'It is the ongoing practice of shaping what appears when someone searches your name — across Google and AI assistants — by removing or suppressing harmful content and building accurate, authoritative material that ranks in its place.',
    },
    {
      q: 'How is this different from a self-serve tool?',
      a: 'Self-serve platforms give you software and leave the execution to you. A.R.I.A is done-for-you: our operators run the audit, the removals, the authority build and the monitoring on your behalf under NDA.',
    },
    {
      q: 'Can you remove negative search results about me?',
      a: 'Where content is removable, we pursue takedowns, data-broker delisting and outdated-content requests. Where it is not, we suppress it by ranking stronger, accurate material above it.',
    },
    {
      q: 'Do you control what AI assistants say about me?',
      a: 'Yes. We actively work to correct and shape how ChatGPT, Gemini and Perplexity describe you, using structured authority content designed to be cited.',
    },
    {
      q: 'Is the engagement confidential?',
      a: 'Always. Every engagement is NDA-bound and we never list clients publicly.',
    },
    {
      q: 'How quickly do you start?',
      a: 'A confidential personal audit is delivered within 48 hours of NDA execution, with active work beginning the same week for higher-severity cases.',
    },
  ],
  relatedLinks: [
    { to: '/online-reputation-repair', label: 'Online Reputation Repair' },
    { to: '/executive-reputation-protection', label: 'Executive Reputation Protection' },
    { to: '/suppress-negative-google-results', label: 'Suppress Negative Google Results' },
    { to: '/ai-reputation-management', label: 'AI Reputation Management' },
    { to: '/corporate-reputation-management', label: 'Corporate Reputation Management' },
  ],
};

const PersonalReputationManagementPage: React.FC = () => <StealthLandingPage cfg={cfg} />;
export default PersonalReputationManagementPage;
