import React from 'react';
import { Search, Trash2, ShieldAlert } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';

const cfg: StealthPageConfig = {
  path: '/suppress-negative-google-results',
  title: 'Suppress Negative Google Results — A.R.I.A™',
  metaDescription:
    'Suppress, remove and bury negative Google search results. UK right-to-be-forgotten, outdated content removal, defamation pathways and authority suppression. Operator-delivered.',
  breadcrumbName: 'Suppress Negative Google Results',
  serviceType: 'Negative search result suppression and content removal',
  heroEyebrow: 'Search Suppression & Removal',
  h1: (
    <>
      <span className="text-primary">Suppress negative Google results</span> — and remove them where the law allows.
    </>
  ),
  heroSubhead:
    'Negative search result suppression, harmful content removal, right-to-be-forgotten UK and outdated-content delisting. Two parallel pathways — legal and SEO — pursued together.',
  problem: {
    heading: 'A single negative result on page one can cost more than every marketing pound you spend.',
    body: [
      'When someone searches your name and a hostile article, fake review or stale controversy lands in the top three results, the deal is dead before the call. The harm is measurable, immediate and ongoing.',
      'Most ORM agencies pick one lane — SEO suppression OR legal removal — and quietly hope the other doesn\'t become necessary. That\'s how cases drag for 18 months.',
      'A.R.I.A runs both pathways in parallel from day one: every viable removal route (GDPR, RTBF UK, ICO, defamation, outdated content, platform policy) plus active suppression through authority assets engineered to outrank the hostile page.',
    ],
  },
  capabilities: [
    {
      icon: Trash2,
      title: 'Remove where possible',
      body: 'Right-to-be-forgotten UK, GDPR Article 17, outdated-content delisting, defamation removal, platform-policy takedowns. Documented, evidence-based, lawful routes only.',
    },
    {
      icon: Search,
      title: 'Suppress where not',
      body: 'When removal isn\'t viable, we deploy authority assets engineered for page-one displacement — owned domains, structured content, citation networks.',
    },
    {
      icon: ShieldAlert,
      title: 'Monitor & hold',
      body: 'Continuous SERP monitoring. The moment a suppressed result climbs back or a new hostile page appears, defence is re-engaged automatically.',
    },
  ],
  keywordClusters: [
    {
      title: 'Suppression',
      items: [
        'Negative search result suppression',
        'Search result suppression',
        'SEO suppression',
        'Negative article suppression',
        'Negative content suppression',
        'Negative review suppression',
        'Suppress negative Google results',
        'Bury negative search results',
        'Remove negative search results',
        'Google search reputation repair',
        'Google reputation management',
        'Reputation SEO',
      ],
    },
    {
      title: 'Removal & Legal',
      items: [
        'Right to be forgotten UK',
        'Delisting request UK',
        'Content removal UK',
        'Harmful content removal',
        'Defamation removal',
        'False content removal',
        'Outdated content removal',
        'GDPR removal request',
      ],
    },
    {
      title: 'Crisis & Attack Response',
      items: [
        'Smear campaign response',
        'False allegation response',
        'Online attack response',
        'Crisis reputation management',
        'Reputation crisis response',
        'Media crisis management',
        'Online crisis management',
        'Digital PR for reputation',
      ],
    },
  ],
  methodology: [
    { step: '01', title: 'Triage', body: 'Every hostile result classified: removable, suppressible, monitor-only. Severity scored 0–10.' },
    { step: '02', title: 'Legal track', body: 'Removal requests filed under every applicable pathway — GDPR, ICO, platform policy, defamation.' },
    { step: '03', title: 'SEO track', body: 'In parallel, authority assets and citation networks deployed to displace the hostile page from page one.' },
    { step: '04', title: 'Reinforce', body: 'Structured data and entity signals locked in so the suppression holds against re-emergence.' },
    { step: '05', title: 'Monitor', body: 'Weekly SERP re-checks. Any climb-back triggers immediate counter-action.' },
  ],
  comparison: {
    competitorLabel: 'Single-lane ORM agency',
    rows: [
      { feature: 'SEO suppression', competitor: true, aria: true },
      { feature: 'Right to be forgotten UK', competitor: 'Partial', aria: true },
      { feature: 'Defamation removal route', competitor: 'Partial', aria: true },
      { feature: 'Outdated content delisting', competitor: false, aria: true },
      { feature: 'Both legal + SEO tracks in parallel', competitor: false, aria: true },
      { feature: 'Weekly SERP monitoring', competitor: 'Partial', aria: true },
      { feature: 'Threat re-scored 0–10', competitor: false, aria: true },
      { feature: 'AI Overview / LLM defence included', competitor: false, aria: true },
    ],
  },
  faqs: [
    {
      q: 'Can you actually remove a negative Google result?',
      a: 'Sometimes, yes — via GDPR right-to-be-forgotten, outdated-content delisting, defamation, ICO complaints or platform takedown. Where removal is not viable, we suppress the result off page one with authority content.',
    },
    {
      q: 'How long does suppression take?',
      a: 'Page-one displacement typically lands within 60–120 days depending on the hostile page\'s domain authority and the keyword competition. Removal pathways resolve faster (2–8 weeks) when criteria are met.',
    },
    {
      q: 'What is the right to be forgotten in the UK?',
      a: 'Under UK GDPR Article 17 and the post-Costeja framework, EU/UK citizens can request that search engines delist URLs returning their name where the content is inaccurate, irrelevant, excessive or outdated. We file these requests directly and escalate to the ICO when denied.',
    },
    {
      q: 'Can I remove a Facebook page about me that\'s no longer active?',
      a: 'Yes — stale Facebook pages are strong candidates for Google\'s outdated-content removal tool, especially when the underlying activity stopped years ago. We handle the submission and follow-up.',
    },
    {
      q: 'Do you suppress fake or malicious reviews?',
      a: 'Yes — through platform-policy reporting where the review breaches terms, defamation routes where actionable, and SEO suppression where neither applies.',
    },
    {
      q: 'Is the work guaranteed?',
      a: 'Removal can never be guaranteed by any reputable provider. Suppression is measured against agreed SERP targets and reported weekly.',
    },
  ],
  relatedLinks: [
    { to: '/ai-reputation-management', label: 'AI Reputation Management' },
    { to: '/online-reputation-management-uk', label: 'Online Reputation Management (UK)' },
    { to: '/ai-reputation-readiness', label: 'AI Reputation Readiness Audit' },
    { to: '/executive-reputation-protection', label: 'Executive Reputation Protection' },
    { to: '/services/remove-google-reviews', label: 'Remove Google Reviews' },
  ],
};

const SuppressNegativeGoogleResultsPage: React.FC = () => <StealthLandingPage cfg={cfg} />;
export default SuppressNegativeGoogleResultsPage;
