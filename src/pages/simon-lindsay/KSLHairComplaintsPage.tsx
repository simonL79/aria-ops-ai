import React from 'react';
import SimonClusterPage from '@/components/seo/SimonClusterPage';

const SimonLindsayKSLHairComplaintsPage = () => (
  <SimonClusterPage
    title="KSL Hair Complaints — Official Statement & Resolution Routes"
    description="Official statement on historical KSL Hair complaints, the formal UK insolvency wind-down, and the routes available to former customers seeking resolution."
    path="/simon-lindsay/ksl-hair-complaints"
    eyebrow="KSL Hair · Complaints"
    h1="KSL Hair complaints — the official statement"
    lede="KSL Hair Clinics ceased trading through formal UK insolvency procedures. This page is the on-record account of how complaints were handled, what routes remain open to former customers, and how Simon Lindsay engages with people who reach out today."
    personJobTitle="Founder of KSL Hair Clinics (former); Founder of A.R.I.A™"
    personKnowsAbout={[
      'KSL Hair Clinics',
      'Customer complaints handling',
      'UK consumer protection',
      'Insolvency creditor process',
      'Hair restoration industry',
    ]}
    sections={[
      {
        heading: 'Position',
        body: (
          <>
            <p>
              KSL Hair, like any consumer-facing clinical business, received complaints during its trading
              period. Complaints were handled through the company's internal customer-service process and,
              where appropriate, through the standard UK consumer-protection and clinical-regulatory
              channels available at the time.
            </p>
          </>
        ),
      },
      {
        heading: 'The formal wind-down',
        body: (
          <>
            <p>
              KSL Hair entered formal UK insolvency procedures conducted by licensed UK insolvency
              practitioners under the Insolvency Act 1986. From the date of insolvency, the appointed
              insolvency practitioner — not the former director — became the correct point of contact for
              creditor and customer claims.
            </p>
            <p>
              Former customers with outstanding claims should refer those claims through the published
              insolvency process. That is the legitimate UK statutory route.
            </p>
          </>
        ),
      },
      {
        heading: 'How Simon Lindsay engages today',
        body: (
          <>
            <p>
              Simon Lindsay receives messages from former KSL customers from time to time. Where messages
              are received in good faith, he responds personally, signposts to the correct insolvency or
              regulatory route, and answers questions about the wind-down within the limits of what a
              former director can lawfully discuss after insolvency.
            </p>
            <p>
              Where third-party content is defamatory, impersonating Simon, or knowingly false, it is
              addressed through the UK Defamation Act 2013, UK GDPR Article 17 and platform reporting —
              the same legitimate routes A.R.I.A™ operates for its clients.
            </p>
          </>
        ),
      },
    ]}
    faqs={[
      {
        q: 'Who do I contact about a historical KSL Hair complaint?',
        a: 'After the formal insolvency, the appointed UK insolvency practitioner is the correct point of contact for creditor and customer claims, not the former director.',
      },
      {
        q: 'Will Simon Lindsay respond personally?',
        a: 'Good-faith messages sent through the contact form on ariaops.co.uk are read and responded to. He signposts to the correct insolvency or regulatory route.',
      },
      {
        q: 'How is defamatory or impersonating content handled?',
        a: 'Through UK Defamation Act 2013, UK GDPR Article 17 erasure requests, and platform-level reporting — the same legitimate routes A.R.I.A™ operates for its clients.',
      },
    ]}
    related={[
      { label: 'KSL Hair — full history', href: '/simon-lindsay/ksl-hair' },
      { label: 'Simon Lindsay — Reviews & References', href: '/simon-lindsay/reviews' },
      { label: 'Online Impersonation (UK)', href: '/services/online-impersonation-uk' },
      { label: 'Remove Google Reviews (UK)', href: '/services/remove-google-reviews' },
    ]}
  />
);

export default SimonLindsayKSLHairComplaintsPage;
