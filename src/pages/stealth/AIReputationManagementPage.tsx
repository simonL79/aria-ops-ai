import React from 'react';
import { Brain, Shield, Radar } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';

const cfg: StealthPageConfig = {
  path: '/ai-reputation-management',
  title: 'AI Reputation Management — A.R.I.A™',
  metaDescription:
    'AI reputation management, monitoring, defence and repair. A.R.I.A protects how Google, ChatGPT, Gemini and Perplexity describe you — and changes the answer when needed.',
  breadcrumbName: 'AI Reputation Management',
  serviceType: 'AI-native reputation management and defence',
  heroEyebrow: 'AI Reputation Management',
  h1: (
    <>
      <span className="text-primary">AI reputation management</span> for the people and brands AI now judges first.
    </>
  ),
  heroSubhead:
    'AI reputation intelligence, monitoring and repair across the human web and the LLM web. A.R.I.A doesn\'t just track what AI says about you — we change it.',
  problem: {
    heading: 'Monitoring is not defence.',
    body: [
      'A new wave of AI visibility platforms can now tell you what ChatGPT, Gemini and Perplexity are saying about you. That\'s useful — but it\'s the equivalent of a smoke alarm. It does not put the fire out.',
      'When a hostile narrative is being repeated inside an LLM\'s answer, the cost is no longer "lost SEO traffic". It\'s lost deals, lost partnerships, lost trust before a human ever clicks a link. The window between detection and damage is collapsing.',
      'A.R.I.A is built for the next layer: AI-powered reputation management that operates as defence — detecting threats, classifying them, suppressing them, and reshaping the open-web context AI systems learn from.',
    ],
  },
  capabilities: [
    {
      icon: Radar,
      title: 'Detect',
      body: 'Continuous reputation threat monitoring across Google, AI Overviews, ChatGPT, Gemini, Perplexity, social platforms, news, reviews and the dark web. Every signal scored 0–10.',
    },
    {
      icon: Shield,
      title: 'Defend',
      body: 'Active suppression of negative content, legal-grade removal pathways (GDPR, RTBF, outdated content), and counter-narrative deployment when an attack is in flight.',
    },
    {
      icon: Brain,
      title: 'Reshape',
      body: 'AI narrative control — publishing structured, machine-readable authority content so LLMs ingest accurate context and answer the credibility question in your favour.',
    },
  ],
  keywordClusters: [
    {
      title: 'AI Reputation Intelligence',
      items: [
        'AI reputation management',
        'AI reputation intelligence',
        'AI reputation protection',
        'AI reputation monitoring',
        'AI reputation defence',
        'AI reputation repair',
        'AI-powered reputation management',
        'Reputation intelligence platform',
        'Reputation command centre',
        'Autonomous reputation monitoring',
      ],
    },
    {
      title: 'AI Brand & Narrative',
      items: [
        'AI brand monitoring',
        'AI narrative control',
        'AI misinformation monitoring',
        'AI hallucination monitoring',
        'Brand visibility in AI search',
        'AI crisis detection',
        'Predictive reputation analysis',
        'Early warning reputation system',
      ],
    },
    {
      title: 'Threat Scoring & Risk',
      items: [
        'Reputation risk analysis',
        'Reputation risk score',
        'Online threat score',
        'Digital threat score',
        'AI threat score',
        'Reputation threat monitoring',
        'Online threat monitoring',
        'Digital threat intelligence',
      ],
    },
  ],
  methodology: [
    { step: '01', title: 'Detect', body: 'Live scanning across Google, LLMs, social and the dark web with severity-scored alerts.' },
    { step: '02', title: 'Classify', body: 'Each signal is graded for intent, reach, decay and commercial impact before any response.' },
    { step: '03', title: 'Suppress', body: 'Hostile content is buried, delisted or removed through SEO, legal and platform-policy routes.' },
    { step: '04', title: 'Reshape', body: 'Authority assets are published as structured data LLMs can ingest, so the AI answer flips.' },
    { step: '05', title: 'Monitor', body: 'Continuous re-scoring. We track LLM responses weekly to confirm the narrative has held.' },
  ],
  comparison: {
    competitorLabel: 'AI visibility monitors',
    rows: [
      { feature: 'Track what AI says about you', competitor: true, aria: true },
      { feature: 'Change what AI says about you', competitor: false, aria: true },
      { feature: 'Active negative-content suppression', competitor: false, aria: true },
      { feature: 'GDPR / RTBF / outdated-content removal', competitor: false, aria: true },
      { feature: 'Human-led crisis response', competitor: false, aria: true },
      { feature: 'Threat scoring 0–10', competitor: 'Partial', aria: true },
      { feature: 'Authority content deployment', competitor: false, aria: true },
      { feature: 'Operator-delivered, not self-serve', competitor: false, aria: true },
    ],
  },
  faqs: [
    {
      q: 'What is AI reputation management?',
      a: 'AI reputation management is the discipline of monitoring, defending and reshaping how AI systems — Google AI Overviews, ChatGPT, Gemini, Perplexity, Copilot — describe a person, brand or business. It extends classical online reputation management into the LLM and agentic web.',
    },
    {
      q: 'How is this different from an AI visibility tool like Otterly, Peec or Scrunch?',
      a: 'Those platforms tell you what AI currently says. A.R.I.A changes what AI says. We combine LLM visibility tracking with active suppression, removal, and authority-content deployment so the answer actually shifts.',
    },
    {
      q: 'How fast does AI reputation repair take?',
      a: 'Initial detection and suppression actions start within 48 hours. LLM-visible change typically lands within 30–90 days as authority assets are crawled and indexed by the models\' training and retrieval layers.',
    },
    {
      q: 'Do you guarantee removal of negative content?',
      a: 'No reputable provider can guarantee removal — anyone who does is misleading you. We pursue every viable legal, platform and SEO pathway and operate to evidence-based suppression standards.',
    },
    {
      q: 'Who is this for?',
      a: 'Founders, executives, athletes, public figures, investors and brands whose name is being queried by humans and AI systems with real commercial consequences attached.',
    },
    {
      q: 'Is the work confidential?',
      a: 'Yes. Engagements are operator-delivered under NDA. We do not list clients publicly.',
    },
  ],
  relatedLinks: [
    { to: '/ai-reputation-readiness', label: 'AI Reputation Readiness Audit' },
    { to: '/generative-engine-optimisation', label: 'Generative Engine Optimisation' },
    { to: '/suppress-negative-google-results', label: 'Suppress Negative Google Results' },
    { to: '/online-reputation-management-uk', label: 'Online Reputation Management (UK)' },
    { to: '/executive-reputation-protection', label: 'Executive Reputation Protection' },
  ],
};

const AIReputationManagementPage: React.FC = () => <StealthLandingPage cfg={cfg} />;
export default AIReputationManagementPage;
