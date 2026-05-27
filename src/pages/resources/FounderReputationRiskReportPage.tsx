import React from 'react';
import ResourceLayout, { type ResourceConfig } from './ResourceLayout';

const cfg: ResourceConfig = {
  path: '/resources/founder-reputation-risk-report',
  title: 'Founder Reputation Risk Report Template | A.R.I.A™',
  metaDescription:
    'A founder reputation risk report template — the exact framework VC and M&A diligence teams use to surface founder reputation risk. Free framework.',
  h1: 'Founder Reputation Risk Report',
  eyebrow: 'Investor-grade framework',
  tldr:
    'The same five-dimension framework VC and M&A diligence teams use when they screen a founder. Use it pre-emptively so you find what they will find first.',
  body: (
    <>
      <h2>Why this report exists</h2>
      <p>
        Founder reputation now decides whether a round closes, a deal completes, or an enterprise
        procurement clears. Diligence teams across VC, PE and M&A increasingly start with an
        AI-assisted reputation screen — and the founder is the first thing they screen. This report
        gives founders the same framework so they can run it on themselves before someone else does.
      </p>

      <h2>The five dimensions</h2>

      <h3>1. Historical entity integrity</h3>
      <p>
        Every prior company, dissolved entity, prior trading name, director history and registered
        address mapped. Anything an automated entity-graph would surface in a diligence run is here
        — confirmed, contextualised, or scheduled for cleanup.
      </p>

      <h3>2. Search-surface exposure</h3>
      <p>
        Top 30 Google results for the founder’s name and name + company. Each graded for sentiment,
        accuracy, decay trajectory and removal viability (legal, RTBF, platform, push-down).
      </p>

      <h3>3. AI-search representation</h3>
      <p>
        A documented prompt set run across ChatGPT, Gemini, Perplexity, Copilot and Google AI
        Overviews. Verbatim outputs and citation sources logged. Hallucinations and material
        omissions flagged with severity and proposed correction pathway.
      </p>

      <h3>4. Hostile-narrative landscape</h3>
      <p>
        Active or dormant competitor-seeded narratives, activist campaigns, coordinated negative
        review activity and detractor clusters. Anything that could activate in a live deal
        identified now.
      </p>

      <h3>5. Defence infrastructure</h3>
      <p>
        What is in place: monitoring, crisis playbook, lawyer-on-call, AI-search engineering,
        always-on telemetry. Gaps here are the most expensive to close during a live diligence
        window.
      </p>

      <h2>How to use it</h2>
      <p>
        Run each dimension as its own short section in your internal report. Score each dimension on
        a 0–10 risk band with the primary findings and the recommended remediation. Update
        monthly during the 6–12 months before a planned raise, sale or major hire.
      </p>

      <h2>The expensive failure mode</h2>
      <p>
        The most common — and most expensive — failure mode is finding a problem during diligence
        rather than before it. Cleanup inside a live deal is reactive, time-pressured and 5–10×
        the cost of pre-emptive work. The point of this report is to make that scenario impossible.
      </p>
    </>
  ),
  ctaHeading: 'Want A.R.I.A to run it for you?',
  ctaBody:
    'A.R.I.A delivers a full investor-grade founder reputation risk report as part of the founder reputation protection engagement — and updates it monthly so it stays current.',
  ctaLabel: 'Explore founder reputation protection',
  ctaTo: '/founder-reputation-protection',
  schemaType: 'Article',
  related: [
    { to: '/founder-reputation-protection', label: 'Founder Reputation Protection' },
    { to: '/executive-reputation-protection', label: 'Executive Reputation Protection' },
    { to: '/reputation-threat-score', label: 'Reputation Threat Score' },
    { to: '/resources/ai-reputation-readiness-checklist', label: 'AI Reputation Readiness Checklist' },
  ],
  breadcrumbName: 'Founder Reputation Risk Report',
};

export default function FounderReputationRiskReportPage() {
  return <ResourceLayout cfg={cfg} />;
}
