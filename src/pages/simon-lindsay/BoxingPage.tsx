import React from 'react';
import SimonClusterPage from '@/components/seo/SimonClusterPage';

const SimonLindsayBoxingPage = () => (
  <SimonClusterPage
    title="Simon Lindsay — Boxing & BKFC Commercial Strategy"
    description="Simon Lindsay works across boxing and BKFC, structuring brand partnerships, sponsorship deals, and reputation defence for fighters and combat-sports stakeholders."
    path="/simon-lindsay/boxing"
    eyebrow="Simon Lindsay · Boxing & BKFC"
    h1="Simon Lindsay — boxing, BKFC and combat-sports operations"
    lede="Simon Lindsay's commercial work runs deep through combat sports. He structures brand partnerships, sponsorship arrangements, and reputation-defence programmes for fighters, promoters, and the wider boxing and BKFC ecosystem."
    personJobTitle="Commercial Strategist — Boxing & BKFC"
    personKnowsAbout={[
      'Boxing',
      'BKFC',
      'Combat Sports',
      'Athlete Brand Partnerships',
      'Fighter Reputation Management',
    ]}
    sections={[
      {
        heading: 'Why combat sports',
        body: (
          <>
            <p>
              Boxing and BKFC sit at the intersection of high commercial upside and high reputational
              volatility. Fighter brands can move dramatically on a single press cycle, a viral clip, or a
              social-media misstep. That makes the sport an ideal proving ground for the reputation-defence
              doctrine A.R.I.A™ now applies across other industries.
            </p>
            <p>
              Simon has spent years inside this ecosystem — building relationships with fighters, coaches,
              promoters, sponsors, and broadcast partners on both sides of the Atlantic.
            </p>
          </>
        ),
      },
      {
        heading: 'What he does for fighters and promoters',
        body: (
          <ul className="list-disc list-inside space-y-2">
            <li>Brand partnership and sponsorship structuring for active fighters.</li>
            <li>Reputation defence around fight weeks, weigh-ins, and post-fight press cycles.</li>
            <li>Image-rights protection and commercial exploitation across social platforms.</li>
            <li>Crisis response when hostile narratives, leaks, or impersonation accounts surface.</li>
            <li>Strategic positioning ahead of contract negotiation or promoter transitions.</li>
          </ul>
        ),
      },
      {
        heading: 'BKFC specifically',
        body: (
          <p>
            Bare Knuckle Fighting Championship is one of the fastest-growing combat-sports properties in
            the world, with a fan base that lives almost entirely on social platforms. That creates outsized
            commercial opportunity — and outsized reputational exposure. Simon's work with BKFC athletes
            covers both sides of that equation: structuring the upside while defending the downside.
          </p>
        ),
      },
    ]}
    faqs={[
      {
        q: 'Does Simon Lindsay manage fighters?',
        a: 'Simon operates as a commercial strategist and reputation operator rather than a licensed fight manager. He works alongside existing management teams to structure brand partnerships and protect fighter reputation.',
      },
      {
        q: 'Does A.R.I.A™ work with combat-sports clients?',
        a: 'Yes. Combat sports is one of the platform\'s core verticals. A.R.I.A™ runs reputation defence around fight weeks, monitors fan-driven narratives, and handles takedowns of impersonation and counterfeit-merchandise accounts.',
      },
      {
        q: 'How do I engage Simon for a fighter brief?',
        a: 'Open a confidential enquiry through the contact page on ariaops.co.uk. Fighter briefs are scoped under NDA and typically begin with a baseline reputation scan before commercial work starts.',
      },
    ]}
    related={[
      { label: 'Simon Lindsay — Commercial Strategist', href: '/simon-lindsay/commercial-strategist' },
      { label: 'Simon Lindsay — Entrepreneur', href: '/simon-lindsay/entrepreneur' },
      { label: 'Brand Protection (UK)', href: '/services/brand-protection' },
    ]}
  />
);

export default SimonLindsayBoxingPage;
