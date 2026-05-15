import React from 'react';
import SimonClusterPage from '@/components/seo/SimonClusterPage';

const SimonLindsayGlasgowPage = () => (
  <SimonClusterPage
    title="Simon Lindsay Glasgow — Founder, A.R.I.A™ Reputation Intelligence"
    description="Simon Lindsay is a Glasgow-based entrepreneur and founder of A.R.I.A™, a UK reputation intelligence platform. Background, current work, and how to engage."
    path="/simon-lindsay/glasgow"
    eyebrow="Simon Lindsay · Glasgow"
    h1="Simon Lindsay — Glasgow entrepreneur and A.R.I.A™ founder"
    lede="Simon Lindsay is based in Glasgow and operates A.R.I.A™ from the city. This is the verified profile of his work, his Scottish business background, and the clients he serves from Glasgow."
    personJobTitle="Founder, A.R.I.A™ — Glasgow"
    personKnowsAbout={[
      'Glasgow',
      'Scotland',
      'UK entrepreneurship',
      'Hair restoration industry',
      'Reputation Intelligence',
      'A.R.I.A™ platform',
    ]}
    sections={[
      {
        heading: 'A Glasgow founder',
        body: (
          <>
            <p>
              Simon Lindsay was born and raised in the West of Scotland and built his businesses from
              Glasgow. The city is both his home and his operational base — A.R.I.A™ runs from a Glasgow
              footprint while serving clients across the UK and internationally.
            </p>
          </>
        ),
      },
      {
        heading: 'Glasgow business background',
        body: (
          <>
            <p>
              He founded KSL Hair Clinics, headquartered in Glasgow, which grew into one of Scotland's
              recognisable hair-restoration brands before its formal wind-down. That experience — running a
              consumer-facing clinical business through growth, scrutiny and restructuring — shaped his
              current work in reputation defence.
            </p>
            <p>
              He continues to mentor other Glasgow and Scotland-based founders informally, particularly in
              consumer healthcare, commercial strategy and crisis communications.
            </p>
          </>
        ),
      },
      {
        heading: 'A.R.I.A™ from Glasgow',
        body: (
          <>
            <p>
              A.R.I.A™ is operated from Glasgow under UK jurisdiction. Engagements are run from the city
              and delivered to clients across the UK, Europe, the Middle East and North America. Glasgow is
              the address on the brief; the work is global.
            </p>
          </>
        ),
      },
    ]}
    faqs={[
      {
        q: 'Is Simon Lindsay based in Glasgow?',
        a: 'Yes. Simon Lindsay lives and works in Glasgow, Scotland, and operates A.R.I.A™ from the city.',
      },
      {
        q: 'Does A.R.I.A™ only serve Glasgow clients?',
        a: 'No. A.R.I.A™ is headquartered in Glasgow but works with clients across the UK and internationally.',
      },
      {
        q: 'How do I arrange a meeting in Glasgow?',
        a: 'Use the contact form on ariaops.co.uk. In-person Glasgow meetings are available for retained clients under NDA.',
      },
    ]}
    related={[
      { label: 'Simon Lindsay — KSL', href: '/simon-lindsay/ksl' },
      { label: 'Simon Lindsay — Entrepreneur', href: '/simon-lindsay/entrepreneur' },
      { label: 'Simon Lindsay — Commercial Strategist', href: '/simon-lindsay/commercial-strategist' },
    ]}
  />
);

export default SimonLindsayGlasgowPage;
