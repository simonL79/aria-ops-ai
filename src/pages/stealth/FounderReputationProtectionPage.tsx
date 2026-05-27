import React from 'react';
import { Briefcase, Building2, FileSearch, LineChart, ShieldAlert, UserCheck } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';
import ExternalAuthorityLinks from '@/components/seo/ExternalAuthorityLinks';

const cfg: StealthPageConfig = {
  path: '/founder-reputation-protection',
  title: 'Founder Reputation Protection | Investor-Grade ORM | A.R.I.A™',
  metaDescription:
    'Investor-grade reputation protection for founders. Pre-due-diligence audits, AI search defence, historic content cleanup, hostile-narrative response.',
  h1: 'Founder Reputation Protection',
  heroEyebrow: 'Investor-grade reputation defence',
  heroSubhead:
    'Investors, acquirers and customers prompt an AI about you before they meet you. A.R.I.A protects the founder reputation surface — across Google, AI search, news, social and historic content — so the meeting starts where it should.',
  problem: {
    heading: 'Founder reputation now closes — or kills — rounds.',
    body: [
      'VC due-diligence teams, M&A diligence partners and enterprise procurement now begin with an AI prompt about the founder. A single confidently-wrong ChatGPT paragraph, a years-old story misframed, a competitor-seeded narrative or an old company that ran into trouble can quietly torpedo a round, a deal or a hire.',
      'Generic ORM treats this as a Google ranking problem. It isn’t. It is an entity-integrity, AI-search, narrative and historic-content problem — and it needs to be defended pre-emptively, not during a live deal.',
      'A.R.I.A operates as the founder’s reputation desk: pre-emptive audit, historic cleanup, AI-search engineering, hostile-narrative response and a live crisis playbook tied to the founder’s actual team.',
    ],
  },
  capabilities: [
    { icon: FileSearch, title: 'Pre-due-diligence audit', body: 'A reputation audit modelled on what real VC and M&A diligence teams actually run — so you find what they’ll find first.' },
    { icon: Building2, title: 'Historic company cleanup', body: 'Old companies, dissolved entities, prior trading names and director-history articles triaged, suppressed or contextualised.' },
    { icon: ShieldAlert, title: 'Hostile narrative response', body: 'Competitor-seeded narratives, activist campaigns and coordinated review-bombs detected and countered before they distort diligence.' },
    { icon: UserCheck, title: 'AI search defence', body: 'ChatGPT, Gemini, Perplexity and AI Overviews engineered so they describe the founder the way the founder’s investors would.' },
    { icon: LineChart, title: 'Continuous reputation health', body: 'Monthly reputation health reports designed to be shareable with the board, lead investor and chair.' },
    { icon: Briefcase, title: 'Deal-mode escalation', body: 'When a live deal opens, monitoring intensifies and a deal-mode protocol activates — daily checks, instant escalation, lawyer-on-call.' },
  ],
  keywordClusters: [
    {
      title: 'Founders & executives',
      items: [
        'Founder reputation protection',
        'Founder reputation management',
        'Executive reputation management',
        'CEO reputation management',
        'C-suite reputation protection',
        'Reputation protection for founders',
        'Investor-grade reputation audit',
      ],
    },
    {
      title: 'Deal & diligence',
      items: [
        'Pre-deal reputation clearance',
        'Pre-due-diligence reputation audit',
        'M&A reputation diligence',
        'VC due-diligence reputation check',
        'Enterprise procurement reputation screen',
        'Hostile narrative defence',
      ],
    },
    {
      title: 'Surfaces & threats',
      items: [
        'Google reputation suppression for founders',
        'AI search visibility for founders',
        'LLM reputation for founders',
        'Founder doxxing protection',
        'Founder privacy protection',
        'Historic company cleanup',
        'Activist campaign defence',
      ],
    },
  ],
  methodology: [
    { step: '01', title: 'Pre-due-diligence audit', body: 'Full reputation surface mapped through the lens of real VC and M&A diligence — Google, AI, news, social, historic companies, director history, court records.' },
    { step: '02', title: 'Historic cleanup', body: 'Old entities, prior brands, defunct companies and misreported stories triaged into legal removal, platform delisting, push-down or AI-source-correction.' },
    { step: '03', title: 'Entity engineering', body: 'Founder schema, Wikipedia/Wikidata, Crunchbase, LinkedIn and About pages aligned so AI models recognise one consistent founder narrative.' },
    { step: '04', title: 'Hostile-narrative monitor', body: 'Always-on detection for competitor-seeded narratives, activist campaigns and coordinated negative review activity with operator-led counter-response.' },
    { step: '05', title: 'Deal-mode escalation', body: 'When a round, sale or hire opens, monitoring intensifies and a defined response protocol activates with named on-call contacts.' },
    { step: '06', title: 'Board-grade reporting', body: 'Monthly reputation health report designed to be shared with the board, lead investor and chair — quantified and defensible.' },
  ],
  comparison: {
    competitorLabel: 'BrandYourself / ReputationDefender / generic ORM',
    rows: [
      { feature: 'Google search suppression', competitor: true, aria: true },
      { feature: 'Pre-due-diligence audit (VC/M&A grade)', competitor: false, aria: true },
      { feature: 'Historic company cleanup', competitor: false, aria: true },
      { feature: 'AI search defence (ChatGPT/Gemini/Perplexity)', competitor: false, aria: true },
      { feature: 'Hostile-narrative detection', competitor: false, aria: true },
      { feature: 'Deal-mode escalation', competitor: false, aria: true },
      { feature: 'Board-grade reputation health report', competitor: false, aria: true },
      { feature: 'Operator-led response', competitor: false, aria: true },
    ],
  },
  faqs: [
    { q: 'When is the right time to engage A.R.I.A?', a: 'Pre-emptively — 6–12 months before a planned raise, sale or major hire. Reputation engineering compounds; doing it inside a live deal is reactive and far more expensive.' },
    { q: 'Will this work if I have a difficult prior company in my history?', a: 'Yes. Historic company cleanup is one of the most common engagements — contextualising, suppressing, delisting or AI-correcting the legacy so it doesn’t distort current diligence.' },
    { q: 'Can the work be shared with my board or lead investor?', a: 'Yes. The monthly reputation health report is intentionally designed to be board-grade and shareable.' },
    { q: 'What happens if a hostile story breaks during a live round?', a: 'Deal-mode escalation activates: daily scans, named operator on-call, lawyer-on-call, AI-search correction, push-down and direct narrative response coordinated with your team.' },
    { q: 'Do you work with VC firms?', a: 'Yes — both directly with portfolio founders and as the diligence-grade reputation layer for the firm itself.' },
  ],
  relatedLinks: [
    { to: '/executive-reputation-protection', label: 'Executive Reputation Protection' },
    { to: '/athlete-reputation-management', label: 'Athlete Reputation Management' },
    { to: '/crisis-reputation-management', label: 'Crisis Reputation Management' },
    { to: '/resources/founder-reputation-risk-report', label: 'Founder Reputation Risk Report' },
  ],
  serviceType: 'Founder reputation protection',
  breadcrumbName: 'Founder Reputation Protection',
};

export default function FounderReputationProtectionPage() {
  return (
    <>
      <StealthLandingPage cfg={cfg} />
      <ExternalAuthorityLinks />
    </>
  );
}
