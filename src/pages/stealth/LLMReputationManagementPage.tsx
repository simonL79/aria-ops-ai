import React from 'react';
import { Brain, FileSearch, GitBranch, MessageSquareWarning, ShieldCheck, Workflow } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';

const cfg: StealthPageConfig = {
  path: '/llm-reputation-management',
  title: 'LLM Reputation Management | AI Model Reputation | A.R.I.A™',
  metaDescription:
    'Manage your reputation inside the large language models themselves — ChatGPT, Gemini, Claude, Perplexity, Copilot. Correct hallucinations, harden entity data, control narrative.',
  h1: 'LLM Reputation Management',
  heroEyebrow: 'Reputation inside the model',
  heroSubhead:
    'Large language models now describe people and companies before any human does. A.R.I.A manages what those models say — by correcting hallucinations, hardening your entity data, and influencing the sources the models trust.',
  problem: {
    heading: 'You cannot edit an LLM. You can shape what it learns.',
    body: [
      'When ChatGPT, Gemini or Perplexity describes you, it is summarising a private blend of pre-training data, web context and confident-sounding inference. There is no "edit" button. There is no contact form. And the output is now the first impression a real buyer, investor or sponsor sees.',
      'Most ORM agencies still optimise for Google rank. Most AI-visibility tools just measure outputs. Neither addresses the actual mechanism — which is entity integrity, source authority, structural parseability and active correction of false claims.',
      'A.R.I.A’s LLM reputation management practice is the operator layer that closes that gap. We work the inputs the models actually weight, prove movement with documented prompt-set diffs, and run a correction loop when a model confidently misrepresents you.',
    ],
  },
  capabilities: [
    { icon: Brain, title: 'Multi-model influence', body: 'ChatGPT, Gemini, Claude, Perplexity, Copilot — managed in parallel, not one model at a time.' },
    { icon: MessageSquareWarning, title: 'Hallucination correction', body: 'When a model fabricates facts about you, we identify the underlying source contamination and execute targeted source-correction.' },
    { icon: ShieldCheck, title: 'Entity hardening', body: 'Schema, Wikidata, Wikipedia, Crunchbase, LinkedIn and About pages aligned so models recognise one consistent, accurate version of you.' },
    { icon: FileSearch, title: 'Citation auditing', body: 'Map which sources the models actually cite — then prioritise the high-influence sources for active reputation work.' },
    { icon: GitBranch, title: 'Source-influence engineering', body: 'Build authority signals into the sources the models trust most, rather than chasing rank on long-tail blogs.' },
    { icon: Workflow, title: 'Continuous prompt diffing', body: 'Weekly model reruns of a documented prompt set, with diffs vs baseline so progress is measurable and defensible.' },
  ],
  keywordClusters: [
    {
      title: 'LLM reputation',
      items: [
        'LLM reputation management',
        'LLM reputation',
        'LLM brand reputation',
        'AI model reputation',
        'AI reputation intelligence',
        'AI reputation defence',
        'AI reputation protection',
      ],
    },
    {
      title: 'Models covered',
      items: [
        'ChatGPT reputation',
        'Gemini reputation',
        'Claude reputation',
        'Perplexity reputation',
        'Copilot reputation',
        'Google AI Overviews reputation',
      ],
    },
    {
      title: 'Underlying disciplines',
      items: [
        'Entity optimisation',
        'Knowledge graph alignment',
        'Structured data reputation',
        'Wikidata reputation',
        'Knowledge panel optimisation',
        'AI hallucination monitoring',
        'AI misinformation monitoring',
        'AI narrative control',
      ],
    },
  ],
  methodology: [
    { step: '01', title: 'Prompt-set baseline', body: 'Document and run a buyer, investor, sponsor and journalist prompt set across every major LLM. Verbatim outputs and citations logged.' },
    { step: '02', title: 'Source contamination map', body: 'Trace bad outputs back to the underlying source — outdated press, stale forum threads, contaminated data brokers, mis-cited reports.' },
    { step: '03', title: 'Entity hardening', body: 'Reconcile every public entity surface — schema, Wikidata, Crunchbase, LinkedIn, founder pages — into one consistent record.' },
    { step: '04', title: 'Source-influence engineering', body: 'Publish, suppress, correct or replace the underlying sources weighted by the models. Highest-leverage sources first.' },
    { step: '05', title: 'Correction loop', body: 'For active hallucinations, deploy a multi-channel correction (legal, editorial, schema, citation) so the next training and retrieval cycles pick it up.' },
    { step: '06', title: 'Continuous diffing', body: 'Weekly prompt-set rerun across all models. Output diffs published to the engagement dashboard.' },
  ],
  comparison: {
    competitorLabel: 'BrandYourself / Otterly / Peec',
    rows: [
      { feature: 'Tracks ChatGPT / Gemini / Perplexity outputs', competitor: true, aria: true },
      { feature: 'Corrects hallucinations at the source', competitor: false, aria: true },
      { feature: 'Entity hardening (Wikidata, schema, knowledge panel)', competitor: false, aria: true },
      { feature: 'Source-influence engineering', competitor: false, aria: true },
      { feature: 'Multi-model parallel management', competitor: 'Partial', aria: 'Full' },
      { feature: 'Legal pathway for defamatory model outputs', competitor: false, aria: true },
      { feature: 'Operator-led execution', competitor: false, aria: true },
    ],
  },
  faqs: [
    { q: 'Can you really change what an LLM says?', a: 'Yes — by changing what it reads. LLM outputs about an entity are driven by entity data, source authority and retrieval. A.R.I.A engineers all three so the next inference cycle produces a different output.' },
    { q: 'How long until ChatGPT or Gemini reflects the change?', a: 'Retrieval-based surfaces (Perplexity, Copilot, AI Overviews, ChatGPT search) update in days. Pure pre-training reflections update across training cycles — typically weeks to months — which is why entity and citation work is prioritised.' },
    { q: 'What if the model is repeating defamatory content?', a: 'A.R.I.A combines source-correction (so the model stops being fed it), legal escalation (against the underlying publisher) and platform escalation (to the model provider where appropriate).' },
    { q: 'Is this the same as GEO?', a: 'GEO and LLM reputation management overlap. GEO is the discipline of engineering content to be selected and cited; LLM reputation management is the wider practice of managing the model’s entire view of you, including correction of existing damage.' },
    { q: 'Do you cover open-source models too?', a: 'Yes. Llama, Mistral and other open-source surfaces are included where they have operational reach — agent ecosystems, third-party tools and embedded enterprise stacks.' },
  ],
  relatedLinks: [
    { to: '/ai-search-visibility', label: 'AI Search Visibility' },
    { to: '/generative-engine-optimisation', label: 'Generative Engine Optimisation' },
    { to: '/ai-reputation-management', label: 'AI Reputation Management' },
    { to: '/resources/llm-visibility-audit-template', label: 'LLM Visibility Audit Template' },
    { to: '/resources/ai-search-visibility-glossary', label: 'AI Search Visibility Glossary' },
  ],
  serviceType: 'LLM reputation management',
  breadcrumbName: 'LLM Reputation Management',
};

export default function LLMReputationManagementPage() {
  return <StealthLandingPage cfg={cfg} />;
}
