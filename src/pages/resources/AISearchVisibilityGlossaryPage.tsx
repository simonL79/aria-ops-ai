import React from 'react';
import ResourceLayout, { type ResourceConfig } from './ResourceLayout';

const TERMS: { term: string; slug: string; definition: string }[] = [
  { term: 'AI Overview', slug: 'ai-overview', definition: 'Google’s AI-generated summary that appears above traditional results, synthesised from web sources and Knowledge Graph signals.' },
  { term: 'AI Reputation Intelligence', slug: 'ai-reputation-intelligence', definition: 'The discipline of measuring and shaping how AI systems describe and recommend an entity.' },
  { term: 'AI Search', slug: 'ai-search', definition: 'Search interfaces (ChatGPT, Gemini, Perplexity, Copilot, AI Overviews) that return synthesised answers rather than blue-link lists.' },
  { term: 'Answer Engine Optimisation (AEO)', slug: 'aeo', definition: 'Optimisation discipline for being selected as the cited source inside AI-generated answers.' },
  { term: 'Citation', slug: 'citation', definition: 'The underlying source URL an LLM references when constructing an answer; influences both inclusion and ranking inside AI surfaces.' },
  { term: 'Citation Map', slug: 'citation-map', definition: 'A documented inventory of the sources most weighted by AI surfaces when describing a given entity or topic.' },
  { term: 'Coordinated Inauthentic Behaviour', slug: 'coordinated-inauthentic-behaviour', definition: 'A pattern of coordinated activity (review-bombing, sockpuppets, brigading) designed to manipulate sentiment signals.' },
  { term: 'Defamation Pre-Action', slug: 'defamation-pre-action', definition: 'Formal legal correspondence (typically under UK pre-action protocols) issued before defamation proceedings; often resolves takedown without court action.' },
  { term: 'Entity', slug: 'entity', definition: 'A resolvable real-world subject — person, organisation, brand — represented across schema, Wikipedia, Wikidata and search engines as a single canonical record.' },
  { term: 'Entity Engineering', slug: 'entity-engineering', definition: 'The deliberate alignment of schema, Wikidata, Crunchbase, LinkedIn and official surfaces so an entity is recognised consistently across AI and search.' },
  { term: 'Generative Engine Optimisation (GEO)', slug: 'geo', definition: 'Optimisation of content and entity signals so generative AI surfaces describe, cite and select the subject correctly.' },
  { term: 'Grounding', slug: 'grounding', definition: 'The practice (especially in Gemini) of tying an LLM answer to verifiable web sources, exposing those sources alongside the answer.' },
  { term: 'Hallucination', slug: 'hallucination', definition: 'A confidently presented but factually incorrect statement produced by an LLM about an entity, event or claim.' },
  { term: 'Hallucination Log', slug: 'hallucination-log', definition: 'A maintained record of known false claims made by LLMs about an entity, with assigned source-correction owners.' },
  { term: 'Knowledge Graph', slug: 'knowledge-graph', definition: 'A search engine’s internal structured representation of entities and their relationships; powers knowledge panels and AI grounding.' },
  { term: 'Knowledge Panel', slug: 'knowledge-panel', definition: 'The structured entity card Google shows alongside results; verifiable, claimable and a critical AI-search input.' },
  { term: 'LLM', slug: 'llm', definition: 'Large Language Model — generative AI systems like GPT, Gemini, Claude, Llama that produce conversational answers.' },
  { term: 'LLM Reputation Management', slug: 'llm-reputation-management', definition: 'Operator-led practice of measuring, correcting and influencing how LLMs describe a given entity.' },
  { term: 'llms.txt', slug: 'llms-txt', definition: 'A site-root file describing canonical content, entities and structure to crawling LLMs; analogue of robots.txt for AI surfaces.' },
  { term: 'Negative SEO', slug: 'negative-seo', definition: 'Deliberate techniques used by adversaries to damage a target’s search visibility — increasingly extended to AI-surface manipulation.' },
  { term: 'Outdated Content Tool', slug: 'outdated-content-tool', definition: 'Google’s self-serve tool for requesting refresh or removal of stale cached pages and snippets.' },
  { term: 'Prompt Set', slug: 'prompt-set', definition: 'A fixed list of standardised questions used to benchmark LLM outputs about an entity over time and across surfaces.' },
  { term: 'Push-Down', slug: 'push-down', definition: 'SEO suppression technique that displaces negative URLs from page one through engineered authoritative content.' },
  { term: 'Reputation Threat Score', slug: 'reputation-threat-score', definition: 'A composite, continuously updated 0–100 metric quantifying live reputation exposure across search, AI, social and dark-web surfaces.' },
  { term: 'Retrieval-Augmented Generation (RAG)', slug: 'rag', definition: 'LLM architecture pattern that grounds generated answers in live retrieved sources; central to AI-search behaviour.' },
  { term: 'Right to be Forgotten (RTBF)', slug: 'rtbf', definition: 'Right under UK/EU GDPR Article 17 to request delisting of personal data from search results in defined circumstances.' },
  { term: 'Schema.org', slug: 'schema-org', definition: 'Open vocabulary for structured data markup that helps search engines and LLMs understand entity facts and relationships.' },
  { term: 'Selectability', slug: 'selectability', definition: 'The likelihood that an LLM recommends a given entity when asked an open-ended buyer / investor / sponsor question.' },
  { term: 'Sentiment Trajectory', slug: 'sentiment-trajectory', definition: 'The direction-of-travel of sentiment about an entity over time across measured surfaces; more useful than a snapshot score.' },
  { term: 'Source-Correction', slug: 'source-correction', definition: 'Operator-led intervention to correct or replace the underlying source an LLM is using to generate a false or damaging output.' },
  { term: 'Stealth Page', slug: 'stealth-page', definition: 'Search- and LLM-discoverable page intentionally kept out of primary navigation to target a specific keyword cluster without diluting headline positioning.' },
  { term: 'Structured Data Reputation', slug: 'structured-data-reputation', definition: 'The reputational signal carried by machine-readable schema and structured data — increasingly the primary input to AI search.' },
  { term: 'Suppression', slug: 'suppression', definition: 'The combined legal, platform, SEO and AI-search work that reduces or eliminates the visibility of a damaging result.' },
  { term: 'Threat Actor', slug: 'threat-actor', definition: 'An identified individual or group running coordinated reputation-damaging activity against an entity.' },
  { term: 'Threat Cluster', slug: 'threat-cluster', definition: 'A graph of accounts, sources and URLs identified as operating coordinately against an entity.' },
  { term: 'Verbatim Output', slug: 'verbatim-output', definition: 'The exact raw text an LLM returns for a given prompt; the primary unit of evidence in LLM visibility audits.' },
  { term: 'Wikidata', slug: 'wikidata', definition: 'Open, structured-data knowledge base widely used by search engines and LLMs as a canonical entity reference.' },
  { term: 'Zero-Click', slug: 'zero-click', definition: 'A query that resolves entirely inside the AI answer or AI Overview without the user visiting any underlying source; dominant pattern in AI search.' },
];

const cfg: ResourceConfig = {
  path: '/resources/ai-search-visibility-glossary',
  title: 'AI Search Visibility Glossary | A.R.I.A™',
  metaDescription:
    'A working glossary of AI search visibility, GEO, AEO, LLM reputation and AI-era ORM terminology. Definitions used by A.R.I.A operators.',
  h1: 'AI Search Visibility Glossary',
  eyebrow: 'Working glossary',
  tldr:
    'A working glossary of the AI-era reputation vocabulary — AI search, GEO, AEO, entity engineering, LLM reputation, source-correction and more. Definitions used by A.R.I.A operators.',
  body: (
    <>
      <h2>How to use this glossary</h2>
      <p>
        Each term has a stable anchor so this page works as a reference for external articles,
        podcast show-notes and partner blog posts. Use the anchor (e.g.{' '}
        <code>/resources/ai-search-visibility-glossary#geo</code>) to link to specific definitions.
      </p>
      <h2>Terms</h2>
      <dl>
        {TERMS.map((t) => (
          <div key={t.slug} id={t.slug} className="scroll-mt-24 mb-6">
            <dt><strong>{t.term}</strong></dt>
            <dd>{t.definition}</dd>
          </div>
        ))}
      </dl>
    </>
  ),
  ctaHeading: 'Want A.R.I.A to engineer this for you?',
  ctaBody:
    'A.R.I.A runs full AI search visibility programmes — entity engineering, GEO content, source-influence and LLM-output correction — for founders, athletes and brands.',
  ctaLabel: 'Explore AI search visibility',
  ctaTo: '/ai-search-visibility',
  schemaType: 'DefinedTermSet',
  schemaExtras: {
    hasDefinedTerm: TERMS.map((t) => ({
      '@type': 'DefinedTerm',
      '@id': `https://www.ariaops.co.uk/resources/ai-search-visibility-glossary#${t.slug}`,
      name: t.term,
      description: t.definition,
    })),
  },
  related: [
    { to: '/ai-search-visibility', label: 'AI Search Visibility' },
    { to: '/llm-reputation-management', label: 'LLM Reputation Management' },
    { to: '/generative-engine-optimisation', label: 'Generative Engine Optimisation' },
    { to: '/resources/llm-visibility-audit-template', label: 'LLM Visibility Audit Template' },
  ],
  breadcrumbName: 'AI Search Visibility Glossary',
};

export default function AISearchVisibilityGlossaryPage() {
  return <ResourceLayout cfg={cfg} />;
}
