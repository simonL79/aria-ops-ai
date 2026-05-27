import React from 'react';
import { UserCheck, Lock, Users } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';

const cfg: StealthPageConfig = {
  path: '/executive-reputation-protection',
  title: 'Executive Reputation Protection — A.R.I.A™',
  metaDescription:
    'Reputation protection for founders, executives, athletes, public figures and their families. Privacy, doxxing defence, AI narrative control. Operator-delivered under NDA.',
  breadcrumbName: 'Executive Reputation Protection',
  serviceType: 'Executive, founder, athlete and public-figure reputation protection',
  heroEyebrow: 'Executive & Public-Figure Protection',
  h1: (
    <>
      <span className="text-primary">Executive reputation protection</span> — for the people whose name is the asset.
    </>
  ),
  heroSubhead:
    'Personal reputation management for founders, executives, athletes, celebrities and public figures. Online protection, privacy, doxxing defence and AI narrative control — including family scope.',
  problem: {
    heading: 'When your name is the asset, every attack is commercial.',
    body: [
      'For most people, a hostile article is unpleasant. For a founder mid-raise, an athlete pre-contract, an executive pre-IPO or a public figure under scrutiny, it\'s a direct hit on enterprise value, transfer fees, partnership pipelines and personal safety.',
      'The legacy options are uneven. Self-serve platforms like BrandYourself give you a dashboard but leave the work to you. Enterprise tools like Reputation.com are built for multi-location brands, not individuals. ReputationDefender does individual work but predates the AI era.',
      'A.R.I.A is built for the high-profile individual case: human-led, NDA-bound, scoped to include family where required, and operating across the human web, the LLM web and the privacy/identity layer at once.',
    ],
  },
  capabilities: [
    {
      icon: UserCheck,
      title: 'Individual-first',
      body: 'Engagement scoped to the person — founder, executive, athlete, public figure — not a brand template. Family members brought into scope where required.',
    },
    {
      icon: Lock,
      title: 'Privacy & identity',
      body: 'Personal data removal, data broker delisting, doxxing protection, online harassment response and digital identity hardening.',
    },
    {
      icon: Users,
      title: 'AI narrative defence',
      body: 'Active control of how ChatGPT, Gemini and Perplexity describe you and your work — critical when the next investor, board or buyer asks AI first.',
    },
  ],
  keywordClusters: [
    {
      title: 'Personal & Executive',
      items: [
        'Personal reputation management',
        'Executive reputation management',
        'Founder reputation management',
        'Public figure reputation management',
        'High-profile individual reputation management',
        'Personal brand protection',
        'Executive reputation audit',
        'Personal brand audit',
      ],
    },
    {
      title: 'Sports & Athletes',
      items: [
        'Athlete reputation management',
        'Sports reputation management',
        'Athlete digital protection',
        'Reputation protection for athletes',
        'Influencer reputation management',
        'Celebrity reputation management',
      ],
    },
    {
      title: 'Privacy & Identity',
      items: [
        'Digital identity protection',
        'Personal data removal',
        'Data broker removal',
        'Privacy protection service',
        'Executive privacy protection',
        'Founder privacy protection',
        'Doxxing protection',
        'Online harassment protection',
        'Family reputation protection',
      ],
    },
  ],
  methodology: [
    { step: '01', title: 'Confidential audit', body: 'Full surface review across Google, LLMs, social, data brokers and dark-web mentions of the principal and immediate family.' },
    { step: '02', title: 'Risk modelling', body: 'Threats scored 0–10 against personal, commercial and physical-safety dimensions.' },
    { step: '03', title: 'Privacy lockdown', body: 'Data-broker removal, doxxing-vector closure, account hardening and personal-information takedown sweeps.' },
    { step: '04', title: 'Narrative defence', body: 'Authority content engineered to outrank hostile pages and to be cited correctly by AI assistants.' },
    { step: '05', title: 'Ongoing watch', body: 'Continuous monitoring with operator escalation on anything scored ≥7. Quarterly principal briefing.' },
  ],
  comparison: {
    competitorLabel: 'Self-serve personal ORM platform',
    rows: [
      { feature: 'Personal reputation dashboard', competitor: true, aria: true },
      { feature: 'Operator-delivered (you don\'t do the work)', competitor: false, aria: true },
      { feature: 'Data broker removal', competitor: 'Partial', aria: true },
      { feature: 'Doxxing & harassment response', competitor: false, aria: true },
      { feature: 'Family members in scope', competitor: false, aria: true },
      { feature: 'ChatGPT / Gemini narrative defence', competitor: false, aria: true },
      { feature: 'Threat scoring 0–10', competitor: false, aria: true },
      { feature: 'NDA-bound, operator-briefed', competitor: false, aria: true },
    ],
  },
  faqs: [
    {
      q: 'Who is executive reputation protection for?',
      a: 'Founders pre-raise or pre-exit, executives in high-visibility roles, professional athletes, public figures, board members and family offices — anyone whose individual reputation carries direct commercial weight.',
    },
    {
      q: 'Do you include family members?',
      a: 'Yes. Where the principal\'s exposure extends to spouses, children or close relatives — common in athlete, public-figure and high-net-worth cases — scope is extended under the same NDA.',
    },
    {
      q: 'How is this different from BrandYourself or ReputationDefender?',
      a: 'BrandYourself is largely self-serve software. ReputationDefender does individual work but uses pre-AI methods. A.R.I.A is operator-delivered, AI-era, and built specifically for cases where individual reputation has six-, seven- or eight-figure commercial consequences.',
    },
    {
      q: 'Can you protect against doxxing and online harassment?',
      a: 'Yes. We close doxxing vectors (data brokers, exposed PII, account leakage), escalate platform takedowns, coordinate with law-enforcement where appropriate, and harden personal digital identity.',
    },
    {
      q: 'Is engagement confidential?',
      a: 'Yes. NDA-bound. We never list clients publicly. Reporting is delivered to the principal directly.',
    },
    {
      q: 'How fast can you start?',
      a: 'Confidential audit within 48 hours of NDA execution. Active defence engaged within the same week for ≥7 severity cases.',
    },
  ],
  relatedLinks: [
    { to: '/ai-reputation-management', label: 'AI Reputation Management' },
    { to: '/online-reputation-management-uk', label: 'Online Reputation Management (UK)' },
    { to: '/suppress-negative-google-results', label: 'Suppress Negative Google Results' },
    { to: '/generative-engine-optimisation', label: 'Generative Engine Optimisation' },
    { to: '/ai-reputation-readiness', label: 'AI Reputation Readiness Audit' },
  ],
};

const ExecutiveReputationProtectionPage: React.FC = () => <StealthLandingPage cfg={cfg} />;
export default ExecutiveReputationProtectionPage;
