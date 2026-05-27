import React from 'react';
import ResourceLayout, { type ResourceConfig } from './ResourceLayout';

const MATRIX = [
  { surface: 'ChatGPT', signals: ['Verbatim response', 'Cited sources', 'Hallucinated facts', 'Material omissions', 'Sentiment'] },
  { surface: 'Gemini', signals: ['Verbatim response', 'Grounded sources', 'Hallucinated facts', 'Material omissions', 'Sentiment'] },
  { surface: 'Perplexity', signals: ['Verbatim response', 'Citation rank order', 'Hallucinated facts', 'Material omissions', 'Sentiment'] },
  { surface: 'Copilot', signals: ['Verbatim response', 'Cited sources', 'Hallucinated facts', 'Material omissions', 'Sentiment'] },
  { surface: 'Claude', signals: ['Verbatim response', 'Source reasoning', 'Hallucinated facts', 'Material omissions', 'Sentiment'] },
  { surface: 'Google AI Overviews', signals: ['Overview text', 'Cited carousel', 'Hallucinated facts', 'Material omissions', 'Sentiment'] },
];

const PROMPTS = [
  'Who is {{name}}?',
  'What does {{company}} do?',
  'Is {{name}} trustworthy?',
  'Tell me about {{name}}’s career.',
  'What controversies has {{name}} been involved in?',
  'Who founded {{company}}? Are they reputable?',
  'What do clients say about {{company}}?',
  'Should I work with {{name}}?',
  'Compare {{company}} to its competitors.',
  'Is {{name}} a good fit for a sponsorship / partnership / investment?',
];

const cfg: ResourceConfig = {
  path: '/resources/llm-visibility-audit-template',
  title: 'LLM Visibility Audit Template | Free | A.R.I.A™',
  metaDescription:
    'A free LLM visibility audit template. Document and grade ChatGPT, Gemini, Perplexity, Copilot, Claude and Google AI Overviews against a standard prompt set.',
  h1: 'LLM Visibility Audit Template',
  eyebrow: 'Free template',
  tldr:
    'A repeatable audit template for measuring exactly how an entity is described across every major LLM surface. Run it monthly. Compare diffs over time. Use it to prove movement.',
  body: (
    <>
      <h2>What this template does</h2>
      <p>
        Standardises how you measure LLM visibility so the data is comparable across surfaces, over
        time, and across stakeholders. Without a fixed prompt set and a fixed signal matrix, every
        review is anecdotal.
      </p>

      <h2>The signal matrix</h2>
      <p>For each LLM surface, capture the following:</p>
      <table>
        <thead>
          <tr>
            <th>Surface</th>
            <th>Signals to capture</th>
          </tr>
        </thead>
        <tbody>
          {MATRIX.map((row) => (
            <tr key={row.surface}>
              <td><strong>{row.surface}</strong></td>
              <td>{row.signals.join(' · ')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>The standard prompt set</h2>
      <p>
        Run the same prompts against every surface, every cycle. Swap <code>{'{{name}}'}</code>{' '}
        and <code>{'{{company}}'}</code> for the audit subject.
      </p>
      <ol>
        {PROMPTS.map((p) => (
          <li key={p}><code>{p}</code></li>
        ))}
      </ol>

      <h2>Grading rubric</h2>
      <p>
        For each (surface × prompt) cell, assign a 0–10 grade:
      </p>
      <ul>
        <li><strong>0–3:</strong> Materially wrong, defamatory, or actively damaging.</li>
        <li><strong>4–6:</strong> Mostly accurate but with notable omissions or stale facts.</li>
        <li><strong>7–8:</strong> Accurate and reasonably complete.</li>
        <li><strong>9–10:</strong> Accurate, complete, on-narrative, and selects the subject when appropriate.</li>
      </ul>

      <h2>Cycle cadence</h2>
      <p>
        Monthly is the minimum to detect drift. Weekly during active reputation work. Daily during a
        live crisis. Always capture the raw verbatim output — diffs over time are the most valuable
        artefact this audit produces.
      </p>

      <h2>What to do with the output</h2>
      <p>
        Any cell scoring below 7 is a remediation target. Sequence by severity × surface reach.
        Source-correction (fixing the underlying citation source) is almost always higher-leverage
        than trying to talk the model directly out of an answer.
      </p>
    </>
  ),
  ctaHeading: 'Want A.R.I.A to run it for you?',
  ctaBody:
    'A.R.I.A runs this audit continuously, executes the source-correction loop and proves movement with weekly prompt-set diffs — for founders, athletes and brands.',
  ctaLabel: 'Explore LLM reputation management',
  ctaTo: '/llm-reputation-management',
  schemaType: 'HowTo',
  schemaExtras: {
    step: PROMPTS.map((p, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: `Run prompt: ${p}`,
    })),
  },
  related: [
    { to: '/llm-reputation-management', label: 'LLM Reputation Management' },
    { to: '/ai-search-visibility', label: 'AI Search Visibility' },
    { to: '/generative-engine-optimisation', label: 'Generative Engine Optimisation' },
    { to: '/resources/ai-search-visibility-glossary', label: 'AI Search Visibility Glossary' },
  ],
  breadcrumbName: 'LLM Visibility Audit Template',
};

export default function LLMVisibilityAuditTemplatePage() {
  return <ResourceLayout cfg={cfg} />;
}
