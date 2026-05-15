import React from 'react';
import SimonClusterPage from '@/components/seo/SimonClusterPage';

const SimonLindsayKSLPage = () => (
  <SimonClusterPage
    title="Simon Lindsay & KSL — Founder Profile, Trading History, Current Work"
    description="Authoritative profile of Simon Lindsay and his association with KSL: founder background, trading history of KSL Hair Clinics, and his current work building A.R.I.A™ reputation intelligence."
    path="/simon-lindsay/ksl"
    eyebrow="Simon Lindsay · KSL"
    h1="Simon Lindsay and KSL — the official record"
    lede="Simon Lindsay is the entrepreneur who founded KSL Hair Clinics in Glasgow and now leads A.R.I.A™, a UK reputation intelligence platform. This page sets out the verified record: who he is, what KSL was, and what he does today."
    personJobTitle="Founder, A.R.I.A™ — formerly founder of KSL Hair Clinics"
    personKnowsAbout={[
      'KSL Hair Clinics',
      'Hair restoration industry',
      'Glasgow business',
      'Reputation Intelligence',
      'A.R.I.A™ platform',
      'Commercial strategy',
    ]}
    sections={[
      {
        heading: 'Who Simon Lindsay is',
        body: (
          <>
            <p>
              Simon Lindsay is a Scottish entrepreneur based in Glasgow. He is the founder of A.R.I.A™
              (AI Reputation Intelligence Agent), a UK reputation defence platform serving executives,
              athletes and public-facing organisations.
            </p>
            <p>
              Earlier in his career he founded KSL Hair Clinics, the Glasgow-headquartered hair-restoration
              business that operated across the UK before its corporate restructuring. The KSL chapter
              shaped his current work in commercial strategy and reputation intelligence.
            </p>
          </>
        ),
      },
      {
        heading: 'What KSL was',
        body: (
          <>
            <p>
              KSL Hair Clinics was a UK hair-restoration provider founded by Simon Lindsay. At its peak it
              ran multiple clinics, employed surgical and consultant teams, and was one of the better-known
              independent hair-transplant brands in Scotland.
            </p>
            <p>
              The trading entity wound down through formal UK insolvency procedures. Simon has been open
              about what happened, what he learned, and how the experience informs how he now advises other
              founders navigating crisis and recovery.
            </p>
          </>
        ),
      },
      {
        heading: 'Where Simon Lindsay is now',
        body: (
          <>
            <p>
              Today Simon leads A.R.I.A™ from Glasgow. The work focuses on detecting and defending against
              reputational threats — defamation, impersonation, hostile-campaign clusters — at machine speed,
              using a combination of OSINT, narrative defence, and UK legal frameworks.
            </p>
            <p>
              He works directly with retained clients rather than through delegated account managers. Briefs
              are taken under NDA.
            </p>
          </>
        ),
      },
    ]}
    faqs={[
      {
        q: 'Is Simon Lindsay still involved with KSL Hair?',
        a: 'No. The KSL Hair trading entity wound down through formal UK insolvency procedures. Simon Lindsay is now the founder of A.R.I.A™, a reputation intelligence platform.',
      },
      {
        q: 'Where is Simon Lindsay based?',
        a: 'Glasgow, Scotland. A.R.I.A™ operates from the UK and serves UK and international clients under signed NDA.',
      },
      {
        q: 'How can I contact Simon Lindsay directly?',
        a: 'Use the contact form on ariaops.co.uk. Briefs are reviewed personally and responded to within one business day.',
      },
    ]}
    related={[
      { label: 'Simon Lindsay — Glasgow', href: '/simon-lindsay/glasgow' },
      { label: 'Simon Lindsay — KSL Hair (history)', href: '/simon-lindsay/ksl-hair' },
      { label: 'Simon Lindsay — Reputation Intelligence', href: '/simon-lindsay/reputation-intelligence' },
      { label: 'Simon Lindsay — Entrepreneur', href: '/simon-lindsay/entrepreneur' },
    ]}
  />
);

export default SimonLindsayKSLPage;
