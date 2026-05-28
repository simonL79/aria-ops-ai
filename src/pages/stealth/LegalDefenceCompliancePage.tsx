import React from 'react';
import { Scale, Gavel, FileCheck } from 'lucide-react';
import StealthLandingPage, { type StealthPageConfig } from './StealthLandingPage';

const cfg: StealthPageConfig = {
  path: '/legal-defence-compliance',
  title: 'Legal Defence & Compliance — A.R.I.A™',
  metaDescription:
    'Reputation-grade legal defence and compliance: GDPR takedowns, defamation pre-action, cease & desist automation, right to be forgotten UK, SOC II / ISO 27001 aligned audit trail.',
  breadcrumbName: 'Legal Defence & Compliance',
  serviceType: 'Legal reputation defence, GDPR takedown, defamation pre-action and compliance logging',
  heroEyebrow: 'Legal Defence & Compliance',
  h1: (
    <>
      <span className="text-primary">Legal defence & compliance</span> — the statutory layer of reputation protection.
    </>
  ),
  heroSubhead:
    'GDPR takedowns, right-to-erasure enforcement, defamation pre-action, automated cease & desist, and compliance-grade audit logging — engineered to sit underneath every A.R.I.A defence operation.',
  problem: {
    heading: 'SEO push-down alone does not satisfy a defamation case, a regulator or a board.',
    body: [
      'Most reputation work stops at content suppression. That leaves the underlying liability — defamatory claims, unlawful personal data, breached NDAs, regulator-relevant disclosures — fully intact and still indexable.',
      'Law firms can pursue the legal route, but rarely instrument the technical surface: which URLs, which cached snapshots, which AI citations, which data brokers, which mirrors. ORM agencies do the opposite — content work without statutory weight.',
      'A.R.I.A merges the two lanes. Every defence operation is evidenced, logged and compliance-aligned, ready to escalate into a UK GDPR Article 17 request, a defamation pre-action protocol letter, a platform takedown, or a regulator submission.',
    ],
  },
  capabilities: [
    {
      icon: Scale,
      title: 'GDPR & RTBF takedowns',
      body: 'UK GDPR Article 17 (right to erasure) requests, Google delisting under EU/UK rulings, data-broker removal and ICO escalation where a controller refuses to comply.',
    },
    {
      icon: Gavel,
      title: 'Defamation & C&D automation',
      body: 'Pre-action protocol letters, automated cease & desist generation with evidence packs, platform abuse-team escalation, and counsel-ready case files.',
    },
    {
      icon: FileCheck,
      title: 'Compliance-grade logging',
      body: 'Every action evidenced to a SOC II / ISO 27001-aligned audit trail. Board-grade reporting, regulator submission packs, chain-of-custody preserved.',
    },
  ],
  keywordClusters: [
    {
      title: 'Legal Reputation Defence',
      items: [
        'Legal reputation defence',
        'Defamation protection UK',
        'Defamation pre-action protocol',
        'Cease and desist online reputation',
        'Cease and desist automation',
        'Online defamation removal',
        'Libel and slander response',
        'Reputation litigation support',
      ],
    },
    {
      title: 'GDPR & Right to Be Forgotten',
      items: [
        'GDPR reputation takedown',
        'Right to be forgotten UK',
        'UK GDPR Article 17',
        'Google delisting request',
        'Outdated content removal',
        'Data broker removal',
        'ICO escalation',
        'Personal data erasure',
      ],
    },
    {
      title: 'Compliance & Audit',
      items: [
        'Compliance reputation management',
        'SOC II aligned reporting',
        'ISO 27001 aligned audit trail',
        'Regulatory disclosure response',
        'Board-grade reputation reporting',
        'Chain-of-custody evidence',
        'Reputation compliance logging',
        'Statutory takedown evidence pack',
      ],
    },
  ],
  methodology: [
    { step: '01', title: 'Legal surface mapping', body: 'Every hostile URL, cached snapshot, AI citation and mirror catalogued with jurisdiction, controller and likely statutory pathway.' },
    { step: '02', title: 'Pathway selection', body: 'For each item: RTBF, defamation pre-action, platform abuse, ICO, regulator submission or hybrid — chosen by speed, severity and probability of removal.' },
    { step: '03', title: 'Evidence packaging', body: 'Screenshots, archive captures, timestamps, hash digests and provenance assembled into a counsel-ready evidence pack per item.' },
    { step: '04', title: 'Action & escalation', body: 'C&D letters dispatched, RTBF requests filed, platform escalations opened, counsel briefed where threshold met. Status tracked per item.' },
    { step: '05', title: 'Audit & compliance close', body: 'Outcome logged to a SOC II / ISO 27001-aligned trail. Board, principal or regulator receives a signed compliance report on request.' },
  ],
  comparison: {
    competitorLabel: 'Traditional law firm or single-lane ORM',
    rows: [
      { feature: 'Defamation pre-action letters', competitor: true, aria: true },
      { feature: 'Technical surface mapping (URLs, mirrors, AI citations)', competitor: false, aria: true },
      { feature: 'GDPR / RTBF takedown filing', competitor: 'Partial', aria: true },
      { feature: 'Automated cease & desist with evidence pack', competitor: false, aria: true },
      { feature: 'Data broker delisting', competitor: false, aria: true },
      { feature: 'AI-search source correction', competitor: false, aria: true },
      { feature: 'SOC II / ISO 27001-aligned audit trail', competitor: false, aria: true },
      { feature: 'Coordinated with SEO suppression in parallel', competitor: false, aria: true },
    ],
  },
  faqs: [
    {
      q: 'Are you a law firm?',
      a: 'No. A.R.I.A is a reputation intelligence operator. We instrument the technical and evidentiary surface, file statutory takedowns (RTBF, GDPR Article 17, platform abuse, data brokers), and prepare counsel-ready files. Where active litigation is required, we hand to instructed counsel with the evidence pack already built.',
    },
    {
      q: 'What is UK GDPR Article 17 and when does it apply?',
      a: 'Article 17 of the UK GDPR gives data subjects the right to have personal data erased where it is no longer necessary, was unlawfully processed, or where consent is withdrawn. We assess each hostile item against the Article 17 thresholds and file directly with the controller, escalating to the ICO where refused.',
    },
    {
      q: 'How do you handle defamation cases?',
      a: 'We assemble a counsel-ready evidence pack — archived captures, timestamps, hash digests, provenance — and dispatch a pre-action protocol letter or automated cease & desist. Where the threshold for litigation is met, instructed counsel takes the case forward with the technical record already complete.',
    },
    {
      q: 'Is your audit trail admissible?',
      a: 'Our logging is engineered against SOC II and ISO 27001-aligned controls with chain-of-custody preservation. The evidence pack is structured to be relied on by counsel, regulators and boards. Final admissibility in any specific proceeding is for instructed counsel to confirm.',
    },
    {
      q: 'How fast can a takedown be initiated?',
      a: 'For ≥7 severity items: C&D dispatched within 24 hours of NDA execution and evidence capture. RTBF and platform filings within 48 hours. Litigation hand-off, where required, within the same week.',
    },
    {
      q: 'Does this work alongside the SEO suppression service?',
      a: 'Yes — they are designed to run in parallel. Legal Defence removes what can be removed at the source; SEO suppression pushes down what cannot. Together they close both the statutory and the visibility surface.',
    },
  ],
  relatedLinks: [
    { to: '/suppress-negative-google-results', label: 'Suppress Negative Google Results' },
    { to: '/negative-search-result-suppression', label: 'Negative Search Result Suppression' },
    { to: '/crisis-reputation-management', label: 'Crisis Reputation Management' },
    { to: '/executive-reputation-protection', label: 'Executive Reputation Protection' },
    { to: '/online-reputation-management-uk', label: 'Online Reputation Management (UK)' },
  ],
};

const LegalDefenceCompliancePage: React.FC = () => <StealthLandingPage cfg={cfg} />;
export default LegalDefenceCompliancePage;
