import React from 'react';
import { Activity, AlertTriangle, Gauge, Radar, ShieldAlert, Target } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';

const cfg: StealthPageConfig = {
  path: '/reputation-threat-score',
  title: 'Reputation Threat Score | AI Risk Scoring | A.R.I.A™',
  metaDescription:
    'A live reputation threat score that quantifies how exposed a person, founder or brand is across Google, AI search and social — with the operator-led response built in.',
  h1: 'Reputation Threat Score',
  heroEyebrow: 'Quantified reputation risk',
  heroSubhead:
    'A single, defensible number that tells you how exposed you are right now — across Google, ChatGPT, Gemini, Perplexity, social platforms and the open web — and exactly what to do about it.',
  problem: {
    heading: 'Most "reputation scores" are vanity metrics.',
    body: [
      'BrandYourself gives you a number. ReputationDefender gives you a scan. Neither tells you whether ChatGPT will recommend you to a client tomorrow, whether Google AI Overviews will surface a six-year-old story above your bio, or whether a coordinated review-bomb is about to land. They score what is easy to score, not what actually decides outcomes.',
      'A.R.I.A’s reputation threat score is engineered the other way around. It starts from the decisions that actually matter — investor due diligence, sponsorship sign-off, hiring, journalist research, AI-agent recommendations — and works backwards into the signals that move them. Each score is built from live OSINT, AI-search citations, sentiment trajectory, entity-graph integrity and active-campaign detection, and is recalculated continuously.',
      'The result is a number you can defend in a boardroom, hand to a lawyer, or use to brief a sponsor — not a marketing badge.',
    ],
  },
  capabilities: [
    {
      icon: Gauge,
      title: 'Live 0–100 score',
      body: 'Composite of search exposure, AI-search misalignment, sentiment, threat-actor activity and recovery velocity. Recalculated on every scan.',
    },
    {
      icon: Radar,
      title: 'Cross-surface coverage',
      body: 'Google SERPs, Google AI Overviews, ChatGPT, Gemini, Perplexity, Copilot, social platforms, review platforms, news, forums and the dark web.',
    },
    {
      icon: AlertTriangle,
      title: 'Severity tiering',
      body: 'Each contributing signal is graded 1–10 with a documented rationale, so you know which items are noise and which are actually nuclear.',
    },
    {
      icon: Target,
      title: 'Decision-grade thresholds',
      body: 'Bands aligned to real decisions: investor-ready, sponsor-safe, hire-safe, crisis-mode. Not a generic A/B/C/D grade.',
    },
    {
      icon: ShieldAlert,
      title: 'Active-campaign detection',
      body: 'Threat-actor clustering identifies coordinated smear campaigns and review-bombing before they distort the score.',
    },
    {
      icon: Activity,
      title: 'Recovery trajectory',
      body: 'Tracks score velocity over time so you can prove improvement to investors, sponsors and boards — not just a snapshot.',
    },
  ],
  keywordClusters: [
    {
      title: 'Scoring & measurement',
      items: [
        'Reputation threat score',
        'AI reputation threat score',
        'Reputation risk score',
        'Reputation risk assessment',
        'Online reputation audit',
        'Executive reputation audit',
        'Brand reputation audit',
        'Digital reputation health check',
      ],
    },
    {
      title: 'Monitoring inputs',
      items: [
        'AI reputation monitoring',
        'Brand monitoring',
        'Social media reputation monitoring',
        'Online narrative monitoring',
        'Public perception monitoring',
        'Predictive reputation analysis',
        'Sentiment trajectory',
        'Threat-actor clustering',
      ],
    },
    {
      title: 'Decision use-cases',
      items: [
        'Investor due-diligence reputation check',
        'Sponsor due-diligence',
        'Pre-hire executive screening',
        'Pre-deal reputation clearance',
        'Crisis severity grading',
        'Board-reportable reputation metric',
        'Insurance underwriting input',
      ],
    },
  ],
  methodology: [
    { step: '01', title: 'Baseline scan', body: 'Full surface scan of Google, AI search, social, news and dark web. Every signal logged, graded and timestamped.' },
    { step: '02', title: 'Entity graph build', body: 'Disambiguate the subject from namesakes and merge all aliases, handles, registered entities and historical mentions into a single graph.' },
    { step: '03', title: 'Threat clustering', body: 'Detect whether negative signals are organic, coordinated, or a single bad actor amplified by AI surfaces.' },
    { step: '04', title: 'Score computation', body: 'Composite 0–100 score with full breakdown by contributing dimension — published to a private dashboard you can share with stakeholders.' },
    { step: '05', title: 'Continuous recalculation', body: 'Score updates on every scan cycle. Velocity, deltas and root-cause attribution are tracked so you can prove direction of travel.' },
    { step: '06', title: 'Operator response', body: 'High-severity items are escalated to a human operator for legal, SEO, GEO and narrative response — not just left on a dashboard.' },
  ],
  comparison: {
    competitorLabel: 'BrandYourself / ReputationDefender scans',
    rows: [
      { feature: 'Single composite score', competitor: true, aria: true },
      { feature: 'Covers ChatGPT / Gemini / Perplexity / AI Overviews', competitor: false, aria: true },
      { feature: 'Severity tiering with documented rationale', competitor: false, aria: true },
      { feature: 'Active-campaign / coordinated-attack detection', competitor: false, aria: true },
      { feature: 'Decision-grade thresholds (investor / sponsor / hire)', competitor: false, aria: true },
      { feature: 'Velocity tracking (improvement over time)', competitor: 'Limited', aria: 'Full' },
      { feature: 'Operator response built in', competitor: false, aria: true },
      { feature: 'Board-defensible methodology', competitor: false, aria: true },
    ],
  },
  faqs: [
    { q: 'How is the reputation threat score calculated?', a: 'It is a weighted composite of search-surface exposure, AI-search misalignment, sentiment trajectory, threat-actor activity, recovery velocity and entity-graph integrity. Each dimension is individually scored and the methodology is documented so the result is defensible.' },
    { q: 'How is this different from a BrandYourself score?', a: 'BrandYourself and similar tools score what is visible on Google. A.R.I.A scores what is visible — and influential — across Google, AI search, social, news and the dark web, and includes active-campaign detection that consumer tools do not perform.' },
    { q: 'Can the score be shared with investors or sponsors?', a: 'Yes. Each score comes with a methodology brief and signal breakdown that is intentionally built to be shared with investors, sponsors, lenders, insurers and boards.' },
    { q: 'How often is the score updated?', a: 'Continuously. Standard subscriptions refresh on a daily cycle; crisis engagements run continuous scanning.' },
    { q: 'Does a high score guarantee suppression?', a: 'No score is a guarantee. The score quantifies risk and pinpoints what to act on — A.R.I.A’s operator team then executes legal, SEO, GEO and narrative response on the items flagged.' },
    { q: 'Is the score affected by AI hallucinations?', a: 'Yes — AI-search misalignment is a core dimension. If ChatGPT or Gemini confidently misrepresent you, the score reflects that risk and the response engine corrects the underlying entity data.' },
    { q: 'Can I get a free indicative score?', a: 'Yes. The free Reputation Threat Score on /scan returns a public-grade indicative score. The full operator-grade score is delivered as part of the AI Reputation Readiness Audit.' },
  ],
  relatedLinks: [
    { to: '/ai-reputation-management', label: 'AI Reputation Management' },
    { to: '/ai-search-visibility', label: 'AI Search Visibility' },
    { to: '/llm-reputation-management', label: 'LLM Reputation Management' },
    { to: '/resources/ai-reputation-readiness-checklist', label: 'AI Reputation Readiness Checklist' },
    { to: '/scan', label: 'Run the free threat scan' },
  ],
  serviceType: 'Reputation threat scoring',
  breadcrumbName: 'Reputation Threat Score',
};

export default function ReputationThreatScorePage() {
  return <StealthLandingPage cfg={cfg} />;
}
