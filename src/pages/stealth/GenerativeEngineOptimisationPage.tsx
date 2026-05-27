import React from 'react';
import { Brain, Network, MessageCircle } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';

const cfg: StealthPageConfig = {
  path: '/generative-engine-optimisation',
  title: 'Generative Engine Optimisation (GEO) — A.R.I.A™',
  metaDescription:
    'Generative engine optimisation and answer engine optimisation. Control how ChatGPT, Gemini, Perplexity and Google AI Overviews describe you. Defence, not just tracking.',
  breadcrumbName: 'Generative Engine Optimisation',
  serviceType: 'Generative engine optimisation and AI search visibility',
  heroEyebrow: 'GEO / AEO / AI Search Defence',
  h1: (
    <>
      <span className="text-primary">Generative engine optimisation</span> — make AI describe you correctly.
    </>
  ),
  heroSubhead:
    'GEO, AEO and AI search visibility for ChatGPT, Gemini, Perplexity, Copilot and Google AI Overviews. Positioned as defence — not a dashboard that just tells you the problem.',
  problem: {
    heading: 'Knowing what AI says is not the same as fixing it.',
    body: [
      'A new category of AI visibility platforms — Otterly AI, Peec AI, Scrunch AI — emerged to answer one question: what are the LLMs saying about my brand? The market needed that answer. They built good products.',
      'But visibility is diagnosis, not treatment. When ChatGPT confidently repeats a wrong fact, a stale controversy or a competitor\'s narrative about you, no dashboard fixes it. Someone has to do the work of reshaping the underlying open-web context the model learned from.',
      'A.R.I.A operates as the defence layer. We use visibility tracking as input, then publish the structured authority content, entity signals and citation networks that change what the model returns. GEO done properly is a defence discipline, not a monitoring one.',
    ],
  },
  capabilities: [
    {
      icon: MessageCircle,
      title: 'LLM visibility tracking',
      body: 'Continuous monitoring of how ChatGPT, Gemini, Perplexity, Copilot and Google AI Overviews answer your branded queries.',
    },
    {
      icon: Network,
      title: 'Entity & schema work',
      body: 'Knowledge panel optimisation, structured data, schema markup, entity disambiguation and data-provenance signals so AI systems parse you correctly.',
    },
    {
      icon: Brain,
      title: 'AI narrative defence',
      body: 'Authority content deployed across the open web — engineered to be cited, summarised and retrieved by the next training and retrieval pass.',
    },
  ],
  keywordClusters: [
    {
      title: 'GEO / AEO',
      items: [
        'Generative engine optimisation',
        'GEO agency',
        'Answer engine optimisation',
        'AI Overview optimisation',
        'Google AI Overview reputation',
        'AI search visibility',
        'AI search optimisation',
        'AI search reputation',
        'Brand visibility in AI search',
      ],
    },
    {
      title: 'LLM Visibility',
      items: [
        'LLM reputation management',
        'LLM visibility',
        'ChatGPT reputation visibility',
        'Perplexity visibility',
        'Gemini search visibility',
        'AI brand monitoring',
        'AI narrative control',
        'AI misinformation monitoring',
        'AI hallucination monitoring',
      ],
    },
    {
      title: 'Entity & Schema',
      items: [
        'Entity optimisation',
        'Knowledge panel optimisation',
        'Entity reputation management',
        'Machine-readable brand data',
        'Data provenance SEO',
        'Structured data reputation',
        'Schema markup reputation',
        'Reputation SEO',
      ],
    },
  ],
  methodology: [
    { step: '01', title: 'AI baseline', body: 'Snapshot every major LLM\'s current answer for your name, brand, products and key queries.' },
    { step: '02', title: 'Gap diagnosis', body: 'Identify factual errors, missing context, hostile framings and unanchored entities.' },
    { step: '03', title: 'Entity lock', body: 'Knowledge panel, Wikidata, schema markup and structured-data work to anchor identity correctly.' },
    { step: '04', title: 'Authority deploy', body: 'Citable, structured assets published across owned and earned surfaces — engineered to be retrieved.' },
    { step: '05', title: 'Re-evaluate', body: 'Weekly LLM re-queries to confirm answer drift in your favour. Reinforcement where it hasn\'t held.' },
  ],
  comparison: {
    competitorLabel: 'AI visibility tool (monitoring-only)',
    rows: [
      { feature: 'Track ChatGPT / Gemini / Perplexity answers', competitor: true, aria: true },
      { feature: 'Change the answers', competitor: false, aria: true },
      { feature: 'Entity & schema deployment', competitor: false, aria: true },
      { feature: 'Authority content publishing', competitor: false, aria: true },
      { feature: 'Google AI Overview optimisation', competitor: 'Partial', aria: true },
      { feature: 'Active misinformation correction', competitor: false, aria: true },
      { feature: 'Combined with legal / removal pathways', competitor: false, aria: true },
      { feature: 'Operator-delivered (not self-serve dashboard)', competitor: false, aria: true },
    ],
  },
  faqs: [
    {
      q: 'What is generative engine optimisation (GEO)?',
      a: 'GEO is the practice of shaping how generative AI systems — ChatGPT, Gemini, Perplexity, Copilot, Google AI Overviews — describe a person, brand or business. It overlaps with answer engine optimisation (AEO) and extends classical SEO into LLM-mediated discovery.',
    },
    {
      q: 'How is GEO different from SEO?',
      a: 'SEO optimises for ranked search results. GEO optimises for being correctly understood, cited and recommended inside an AI-generated answer. The signal stack overlaps (authority, structured data, entity clarity) but the success metric is "what the model says", not "what position you rank".',
    },
    {
      q: 'How long until ChatGPT or Gemini changes its answer about me?',
      a: 'Retrieval-augmented answers (Perplexity, AI Overviews) can shift within days as the open web is re-crawled. Trained-knowledge answers (base ChatGPT, Gemini) typically shift on the next training pass — weeks to months depending on the model\'s update cadence.',
    },
    {
      q: 'Do you work with Otterly AI / Peec AI / Scrunch AI data?',
      a: 'Yes — we treat them as visibility inputs. They\'re useful tracking tools. A.R.I.A is the defence layer that acts on what they surface.',
    },
    {
      q: 'Can you optimise my knowledge panel?',
      a: 'Yes. Entity optimisation, Wikidata work, schema markup, and direct knowledge-panel signal management are part of the GEO engagement.',
    },
    {
      q: 'Who is GEO for?',
      a: 'Anyone whose name is queried in an AI assistant with commercial consequences attached — founders, executives, public figures, professional-services firms, B2B brands and consumer brands where consideration starts with "ask ChatGPT".',
    },
  ],
  relatedLinks: [
    { to: '/ai-reputation-management', label: 'AI Reputation Management' },
    { to: '/ai-reputation-readiness', label: 'AI Reputation Readiness Audit' },
    { to: '/online-reputation-management-uk', label: 'Online Reputation Management (UK)' },
    { to: '/suppress-negative-google-results', label: 'Suppress Negative Google Results' },
    { to: '/executive-reputation-protection', label: 'Executive Reputation Protection' },
  ],
};

const GenerativeEngineOptimisationPage: React.FC = () => <StealthLandingPage cfg={cfg} />;
export default GenerativeEngineOptimisationPage;
