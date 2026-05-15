import React from 'react';
import SimonClusterPage from '@/components/seo/SimonClusterPage';

const SimonLindsayCommercialStrategistPage = () => (
  <SimonClusterPage
    title="Simon Lindsay — Commercial Strategist (UK)"
    description="Simon Lindsay is a UK commercial strategist working across reputation intelligence, brand partnerships, and combat sports — structuring opportunities for athletes and public figures."
    path="/simon-lindsay/commercial-strategist"
    eyebrow="Simon Lindsay · Commercial Strategist"
    h1="Simon Lindsay — commercial strategist"
    lede="Beyond the technical work at A.R.I.A™, Simon Lindsay operates as a commercial strategist for athletes, creators, and public figures — structuring brand partnerships, sponsorship deals, and reputation-aware commercial opportunities across the UK and international markets."
    personJobTitle="Commercial Strategist & Founder, A.R.I.A™"
    personKnowsAbout={[
      'Commercial Strategy',
      'Brand Partnerships',
      'Sponsorship Negotiation',
      'Athlete Representation',
      'Talent Management',
    ]}
    sections={[
      {
        heading: 'What "commercial strategist" means in practice',
        body: (
          <>
            <p>
              Most "manager" titles in sport and entertainment are reactive — they negotiate deals that arrive
              on the desk. A commercial strategist works the other way: building the brand position first,
              then engineering the inbound demand that lets the talent pick the right partners.
            </p>
            <p>
              For Simon, that workflow is reputation-led. Every commercial conversation is built on a clean
              digital footprint and a controlled narrative — which is why the strategy work integrates so
              tightly with A.R.I.A™'s defence layer.
            </p>
          </>
        ),
      },
      {
        heading: 'Areas of focus',
        body: (
          <ul className="list-disc list-inside space-y-2">
            <li>Brand partnership structuring for athletes, creators, and public figures.</li>
            <li>Sponsorship negotiation across combat sports (boxing, BKFC) and adjacent verticals.</li>
            <li>Reputation-aware commercial positioning — pricing the brand on signal quality, not noise.</li>
            <li>Crisis-resilient deal structures with reputation triggers and exit clauses.</li>
            <li>Cross-border partnerships (UK ↔ US ↔ EU) with appropriate IP and image-rights protection.</li>
          </ul>
        ),
      },
      {
        heading: 'Why pair commercial strategy with reputation intelligence',
        body: (
          <p>
            A signed sponsorship is only as durable as the reputation underneath it. Simon's combined practice
            means partnerships are built on a measured threat surface, contracts contemplate reputational
            risk explicitly, and the same operator handling the deal is also positioned to defend it if the
            narrative shifts.
          </p>
        ),
      },
    ]}
    faqs={[
      {
        q: 'Does Simon Lindsay represent athletes commercially?',
        a: 'Simon structures commercial partnerships and brand deals for athletes and public figures, particularly across combat sports. This is advisory and deal-structuring work rather than full talent agency representation.',
      },
      {
        q: 'What industries does the commercial strategy work cover?',
        a: 'Primary verticals: combat sports (boxing, BKFC), broader sports and entertainment, AI and technology, and personal-brand commercialisation for executives and founders.',
      },
      {
        q: 'How does the strategy work integrate with A.R.I.A™?',
        a: 'Every commercial brief begins with a reputation baseline scan from A.R.I.A™. That scan informs partnership selection, contractual reputation triggers, and the defensive posture maintained around the deal once it is live.',
      },
    ]}
    related={[
      { label: 'Simon Lindsay — Boxing & BKFC', href: '/simon-lindsay/boxing' },
      { label: 'Simon Lindsay — Entrepreneur', href: '/simon-lindsay/entrepreneur' },
      { label: 'Brand Protection (UK)', href: '/services/brand-protection' },
    ]}
  />
);

export default SimonLindsayCommercialStrategistPage;
