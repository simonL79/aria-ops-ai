import React from 'react';
import SimonClusterPage from '@/components/seo/SimonClusterPage';

const SimonLindsayEntrepreneurPage = () => (
  <SimonClusterPage
    title="Simon Lindsay — Entrepreneur, Founder of A.R.I.A™"
    description="Simon Lindsay is a UK-based entrepreneur, founder of A.R.I.A™ reputation intelligence, and a commercial strategist working across AI, sport, and brand partnerships."
    path="/simon-lindsay/entrepreneur"
    eyebrow="Simon Lindsay · Entrepreneur"
    h1="Simon Lindsay — entrepreneur and founder profile"
    lede="Simon Lindsay is a UK entrepreneur whose ventures span artificial intelligence, reputation defence, combat sports, and commercial brand strategy. He is the founder of A.R.I.A™ — the reputation intelligence platform serving executives, athletes, and public figures across the UK and internationally."
    personJobTitle="Entrepreneur & Founder, A.R.I.A™"
    personKnowsAbout={[
      'Entrepreneurship',
      'AI Reputation Intelligence',
      'Brand Strategy',
      'Commercial Partnerships',
      'Combat Sports Industry',
    ]}
    sections={[
      {
        heading: 'Founding story',
        body: (
          <>
            <p>
              Simon's path into entrepreneurship runs through a decade of operating in environments where
              reputation is the asset that matters most: combat sports, celebrity management, and brand
              partnerships. Repeated exposure to the speed of modern reputational attacks — and the inability
              of traditional PR firms to respond at machine pace — was the genesis of A.R.I.A™.
            </p>
            <p>
              The company was founded with a single product premise: detection in hours, not weeks; response
              backed by real legal mechanisms; and an operator-led service model where the founder remains
              accountable to every brief.
            </p>
          </>
        ),
      },
      {
        heading: 'What he builds',
        body: (
          <>
            <p>
              <strong className="text-foreground">A.R.I.A™ — AI Reputation Intelligence.</strong> The flagship
              platform combining OSINT scanning, LLM-driven analysis, narrative defence, and a Legal Ops desk.
            </p>
            <p>
              <strong className="text-foreground">Commercial Strategy.</strong> Brand partnerships and
              sponsorship structuring for athletes, creators, and public figures — particularly across the
              boxing and BKFC ecosystems.
            </p>
            <p>
              <strong className="text-foreground">Operator Doctrine.</strong> Internal frameworks (Persona
              Saturation, Threat Analysis Tree, Legal Ops automation) that give A.R.I.A™ operators a defined
              playbook for each threat category.
            </p>
          </>
        ),
      },
      {
        heading: 'Operating principles',
        body: (
          <ul className="list-disc list-inside space-y-2">
            <li>Anonymity by default — reputation work that gets boasted about defeats its own purpose.</li>
            <li>Operator-led delivery — every brief routes to a real human, not a ticketing queue.</li>
            <li>Live-data only — no mock metrics, no vanity dashboards.</li>
            <li>UK-grounded legal posture — Defamation Act, Malicious Communications, UK GDPR.</li>
          </ul>
        ),
      },
    ]}
    faqs={[
      {
        q: 'What companies has Simon Lindsay founded?',
        a: 'Simon is the founder of A.R.I.A™ (AI Reputation Intelligence Agent), the reputation defence platform operating at ariaops.co.uk. He also operates commercial strategy advisory work across combat sports and entertainment.',
      },
      {
        q: 'Where is Simon Lindsay based?',
        a: 'Simon operates A.R.I.A™ from the United Kingdom, serving UK and international clients. The company is structured around UK statute and operates under signed NDAs with all retained clients.',
      },
      {
        q: 'How do I contact Simon for a commercial brief?',
        a: 'Use the contact page on ariaops.co.uk to open a confidential brief. Initial conversations are typically scoped within 48 hours.',
      },
    ]}
    related={[
      { label: 'Simon Lindsay — Commercial Strategist', href: '/simon-lindsay/commercial-strategist' },
      { label: 'Simon Lindsay — A.R.I.A™ Founder', href: '/simon-lindsay/aria' },
      { label: 'Simon Lindsay — Boxing & BKFC', href: '/simon-lindsay/boxing' },
    ]}
  />
);

export default SimonLindsayEntrepreneurPage;
