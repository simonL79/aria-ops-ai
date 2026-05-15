import React from 'react';
import SimonClusterPage from '@/components/seo/SimonClusterPage';

const SimonLindsayAriaPage = () => (
  <SimonClusterPage
    title="Simon Lindsay & A.R.I.A™ — Founder of AI Reputation Intelligence"
    description="Simon Lindsay founded A.R.I.A™ (AI Reputation Intelligence Agent) to detect, analyse, and defend against reputational threats at machine speed for UK clients."
    path="/simon-lindsay/aria"
    eyebrow="Simon Lindsay · A.R.I.A™"
    h1="Simon Lindsay — founder of A.R.I.A™"
    lede="A.R.I.A™ — AI Reputation Intelligence Agent — is the operational platform Simon Lindsay built to monitor, score, and defend against reputational threats facing executives, athletes, and public figures. This page covers the founding thesis, the platform architecture, and Simon's role inside the organisation."
    personJobTitle="Founder & CEO, A.R.I.A™"
    personKnowsAbout={[
      'A.R.I.A™ platform',
      'Reputation Intelligence',
      'Threat Detection',
      'Anubis Engine',
      'Requiem Pipeline',
      'EIDETIC Memory',
    ]}
    sections={[
      {
        heading: 'What A.R.I.A™ is',
        body: (
          <>
            <p>
              A.R.I.A™ is a closed-loop reputation defence system. It scans the open web, social platforms, forums,
              and surfaceable dark-web mentions, scores findings on a 1–10 severity scale, and routes high-priority
              items into a response pipeline — narrative defence, takedown notices, or legal escalation.
            </p>
            <p>
              It is intentionally service-led, not SaaS-led. Clients engage with operators rather than logging into
              a complex dashboard. The platform exists to make those operators faster and more accurate, not to
              replace them.
            </p>
          </>
        ),
      },
      {
        heading: 'Simon\'s role at A.R.I.A™',
        body: (
          <>
            <p>
              Simon Lindsay is the founder, product architect, and lead operator. He sets the threat-scoring
              doctrine, owns the client relationships at the senior tier, and is directly accountable for
              service-level outcomes.
            </p>
            <p>
              Internally, this means he is the named contact on every retained brief. Externally, it means
              clients work with the founder, not a delegated account manager.
            </p>
          </>
        ),
      },
      {
        heading: 'A.R.I.A™ core modules',
        body: (
          <ul className="list-disc list-inside space-y-2">
            <li><strong className="text-foreground">Anubis Engine</strong> — autonomous orchestration core for background validation.</li>
            <li><strong className="text-foreground">Requiem Pipeline</strong> — bulk SEO and reputation defence engine.</li>
            <li><strong className="text-foreground">EIDETIC Memory</strong> — long-term sentiment and relationship tracking.</li>
            <li><strong className="text-foreground">Threat Analysis Tree</strong> — entity clustering for hostile-campaign detection.</li>
            <li><strong className="text-foreground">Legal Ops</strong> — automated GDPR and Cease & Desist generation.</li>
          </ul>
        ),
      },
    ]}
    faqs={[
      {
        q: 'What does A.R.I.A™ stand for?',
        a: 'A.R.I.A™ stands for AI Reputation Intelligence Agent. It is the reputation defence platform founded and operated by Simon Lindsay.',
      },
      {
        q: 'Is A.R.I.A™ a SaaS product or a service?',
        a: 'Service-led. Clients are onboarded through a confidential brief and assigned a human operator. The platform powers the operator — clients are not asked to drive a complex SaaS dashboard themselves.',
      },
      {
        q: 'What jurisdictions does A.R.I.A™ operate under?',
        a: 'Primary operations are UK-based, structured around the Defamation Act 2013, Malicious Communications Act 1988, Communications Act 2003 s.127, and UK GDPR. International briefs are accepted on a case-by-case basis under signed NDA.',
      },
    ]}
    related={[
      { label: 'Simon Lindsay — AI', href: '/simon-lindsay/ai' },
      { label: 'Simon Lindsay — Reputation Intelligence', href: '/simon-lindsay/reputation-intelligence' },
      { label: 'Brand Protection (UK)', href: '/services/brand-protection' },
    ]}
  />
);

export default SimonLindsayAriaPage;
