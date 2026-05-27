import React from 'react';
import { Bot, Compass, Database, Eye, Network, Sparkles } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';

const cfg: StealthPageConfig = {
  path: '/ai-search-visibility',
  title: 'AI Search Visibility | ChatGPT, Gemini, AI Overviews | A.R.I.A™',
  metaDescription:
    'Be findable, accurate and selectable in ChatGPT, Gemini, Perplexity, Copilot and Google AI Overviews. AI search visibility for founders, athletes and brands.',
  h1: 'AI Search Visibility',
  heroEyebrow: 'The new top of the funnel',
  heroSubhead:
    'AI assistants are now the first surface that describes you. If they describe you wrong, you lose deals before you even know you were in the room. A.R.I.A makes you findable, accurate and selectable across every major AI surface.',
  problem: {
    heading: 'Ranking on Google is no longer the finish line.',
    body: [
      'Buyers, journalists, investors and recruiters are increasingly starting with ChatGPT, Gemini or Perplexity — not Google. Whatever those models say about you in a single paragraph now shapes the meeting before anyone visits your site.',
      'AI visibility tools like Otterly, Peec and Scrunch can tell you what the models say. They do not change it. A.R.I.A does — by combining entity engineering, structured-data reputation, source-influence pathways and operator-led correction loops so the models update.',
      'The lane is called AI search visibility, generative engine optimisation (GEO), or answer engine optimisation (AEO). They describe the same shift: the question is no longer whether you rank, but whether you are correctly understood and selected.',
    ],
  },
  capabilities: [
    { icon: Bot, title: 'Multi-model coverage', body: 'ChatGPT, Gemini, Perplexity, Copilot, Claude and Google AI Overviews tracked and shaped in parallel — not one surface at a time.' },
    { icon: Eye, title: 'Citation analysis', body: 'Which sources do the models cite when describing you? We map them, then influence the high-leverage ones first.' },
    { icon: Database, title: 'Entity engineering', body: 'Schema.org, Wikipedia, Wikidata, Crunchbase and other entity sources are aligned so the models have one consistent, accurate version of you.' },
    { icon: Sparkles, title: 'GEO content production', body: 'Long-form, structurally rich content engineered to be parseable, citable and quotable by LLMs — not just clickable for humans.' },
    { icon: Network, title: 'Source-influence pathways', body: 'High-authority sources that the models actually weight are prioritised, not the long-tail blogs that legacy SEO chases.' },
    { icon: Compass, title: 'Selectability optimisation', body: 'Beyond being mentioned — being selected. Models are nudged via authority, recency and consistency signals to recommend you when relevant.' },
  ],
  keywordClusters: [
    {
      title: 'AI search & visibility',
      items: [
        'AI search visibility',
        'AI search optimisation',
        'ChatGPT visibility',
        'Gemini visibility',
        'Perplexity visibility',
        'Copilot visibility',
        'Claude visibility',
        'AI Overview optimisation',
        'AI Overview SEO',
      ],
    },
    {
      title: 'GEO & AEO',
      items: [
        'Generative engine optimisation',
        'GEO services',
        'Answer engine optimisation',
        'AEO services',
        'LLM SEO',
        'LLM-friendly content',
        'LLMs.txt strategy',
        'Conversational search optimisation',
      ],
    },
    {
      title: 'Entity & structure',
      items: [
        'Entity optimisation',
        'Knowledge panel optimisation',
        'Schema markup reputation',
        'Structured data reputation',
        'Knowledge graph alignment',
        'Wikidata reputation',
        'Machine-readable brand data',
        'Data provenance SEO',
      ],
    },
  ],
  methodology: [
    { step: '01', title: 'Baseline prompts', body: 'Run a documented set of buyer, investor, sponsor and journalist prompts across every major AI surface and record verbatim outputs and citations.' },
    { step: '02', title: 'Citation mapping', body: 'Identify the underlying sources the models weight, scored by influence on output, not just inclusion in citations.' },
    { step: '03', title: 'Entity engineering', body: 'Align schema, Wikipedia, Wikidata, Crunchbase, LinkedIn and About pages so the models have one consistent canonical entity to recognise.' },
    { step: '04', title: 'GEO content & source influence', body: 'Engineer long-form, citable content on the entity’s own and adjacent authority surfaces. High-leverage sources first.' },
    { step: '05', title: 'Continuous prompt testing', body: 'Weekly prompt-set rerun across all models with diffs vs baseline, so movement is provable.' },
    { step: '06', title: 'Operator correction loop', body: 'When a model confidently hallucinates, A.R.I.A executes targeted source-correction interventions to retrain the surface.' },
  ],
  comparison: {
    competitorLabel: 'Otterly / Peec / Scrunch (AI visibility monitoring)',
    rows: [
      { feature: 'Monitor what models say about you', competitor: true, aria: true },
      { feature: 'Change what models say about you', competitor: false, aria: true },
      { feature: 'Entity engineering (Wikidata, schema, knowledge panel)', competitor: false, aria: true },
      { feature: 'Source-influence pathway prioritisation', competitor: false, aria: true },
      { feature: 'GEO content production', competitor: false, aria: true },
      { feature: 'Hallucination correction loop', competitor: false, aria: true },
      { feature: 'Operator-led response', competitor: false, aria: true },
      { feature: 'Crisis-mode escalation', competitor: false, aria: true },
    ],
  },
  faqs: [
    { q: 'What is AI search visibility?', a: 'It is whether, how and how accurately you appear when someone asks an AI assistant — ChatGPT, Gemini, Perplexity, Copilot — about you, your company or your category. It has replaced Google-only visibility as the primary discoverability metric.' },
    { q: 'How is this different from GEO or AEO?', a: 'They are overlapping terms. Generative engine optimisation (GEO) and answer engine optimisation (AEO) describe the optimisation discipline. AI search visibility is the measurable outcome.' },
    { q: 'Why not just use Otterly or Peec?', a: 'Monitoring tools show you the problem. They do not engineer your entity, produce GEO content, influence source authority or correct hallucinations. A.R.I.A is the operator layer that does.' },
    { q: 'How long does it take to move AI outputs?', a: 'Entity and schema changes are reflected within days on some models and within 4–10 weeks on others. Source-influence work typically takes 6–12 weeks to compound.' },
    { q: 'Does this work for individuals or only companies?', a: 'Both. Personal AI search visibility is a core engagement type for founders, athletes, executives and public figures.' },
    { q: 'Will this work for new entities with no Wikipedia page?', a: 'Yes. Wikipedia is one signal among many. A.R.I.A engineers the full entity surface — schema, Wikidata, Crunchbase, LinkedIn, About pages and authoritative third-party content — even where Wikipedia is not in play.' },
  ],
  relatedLinks: [
    { to: '/generative-engine-optimisation', label: 'Generative Engine Optimisation' },
    { to: '/llm-reputation-management', label: 'LLM Reputation Management' },
    { to: '/ai-reputation-management', label: 'AI Reputation Management' },
    { to: '/resources/llm-visibility-audit-template', label: 'LLM Visibility Audit Template' },
    { to: '/resources/ai-search-visibility-glossary', label: 'AI Search Visibility Glossary' },
  ],
  serviceType: 'AI search visibility',
  breadcrumbName: 'AI Search Visibility',
};

export default function AISearchVisibilityPage() {
  return <StealthLandingPage cfg={cfg} />;
}
