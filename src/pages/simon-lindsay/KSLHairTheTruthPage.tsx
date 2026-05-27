import React from 'react';
import SimonClusterPage from '@/components/seo/SimonClusterPage';
import heroImage from '@/assets/hero-simon-ksl-hair-the-truth.jpg';

const SimonLindsayKSLHairTheTruthPage = () => (
  <SimonClusterPage
    heroImage={heroImage}
    heroAlt="KSL Hair — the truth: verified, on-record account from founder Simon Lindsay"
    title="KSL Hair — The Truth | Verified Record, Founder Simon Lindsay"
    description="KSL Hair — the truth, on the record. Verified history of KSL Hair Clinics, the formal UK insolvency wind-down, how complaints are handled, and a direct response to the 'KSL Hair The Truth' Facebook page (inactive since 2021)."
    path="/simon-lindsay/ksl-hair-the-truth"
    eyebrow="KSL Hair · The Truth"
    h1="KSL Hair — the truth, on the record"
    lede="This is the verified, on-record account of KSL Hair Clinics and its founder Simon Lindsay: what KSL was, how it wound down through formal UK insolvency, how historical complaints are routed today, and a direct response to the 'KSL Hair The Truth' Facebook page that has been inactive since 2021."
    personJobTitle="Founder of KSL Hair Clinics (former); Founder of A.R.I.A™"
    personKnowsAbout={[
      'KSL Hair Clinics',
      'KSL Hair the truth',
      'Hair restoration UK',
      'FUE hair transplants',
      'UK insolvency process',
      'Consumer protection UK',
      'Reputation intelligence',
    ]}
    sections={[
      {
        heading: 'Why this page exists',
        body: (
          <>
            <p>
              People searching "KSL Hair the truth" deserve a verified, on-record answer rather than a
              single anonymous social-media page. The "KSL Hair The Truth" page on Facebook has not been
              updated since 2021 and does not represent the current, verified position of the former
              company or its founder.
            </p>
            <p>
              This page is published by Simon Lindsay — the founder of KSL Hair Clinics — under his real
              name, with a real contact route, and is updated as the position changes.
            </p>
          </>
        ),
      },
      {
        heading: 'What KSL Hair actually was',
        body: (
          <>
            <p>
              KSL Hair Clinics was a UK hair-restoration provider founded in Glasgow by Simon Lindsay. It
              offered FUE-based hair transplant procedures across multiple clinic locations and employed
              surgical and consultant staff. It was one of the more visible independent hair-transplant
              brands in Scotland during its trading period.
            </p>
          </>
        ),
      },
      {
        heading: 'The formal wind-down — the truth',
        body: (
          <>
            <p>
              The KSL Hair trading entity entered formal UK insolvency procedures conducted by licensed UK
              insolvency practitioners under the Insolvency Act 1986. From the date of insolvency the
              appointed insolvency practitioner — not the former director — became the correct point of
              contact for creditor and customer claims.
            </p>
            <p>
              Insolvency in the UK is a regulated, statutory mechanism for resolving a limited company's
              affairs. It is not, in itself, a finding of personal wrongdoing against any director.
            </p>
          </>
        ),
      },
      {
        heading: 'How historical complaints are handled today',
        body: (
          <>
            <p>
              Former customers with outstanding claims should refer those claims through the published
              insolvency process — that is the legitimate UK statutory route. Good-faith messages sent
              through the contact form on ariaops.co.uk are read by Simon personally and signposted to the
              correct insolvency or regulatory route, within the limits of what a former director can
              lawfully discuss after insolvency.
            </p>
            <p>
              Defamatory content, impersonation, or knowingly false statements are addressed through the
              UK Defamation Act 2013, UK GDPR Article 17 erasure requests, and platform-level reporting —
              the same legitimate routes A.R.I.A™ operates for its retained clients.
            </p>
          </>
        ),
      },
      {
        heading: 'Direct response: the "KSL Hair The Truth" Facebook page',
        body: (
          <>
            <p>
              An anonymous Facebook page titled "KSL Hair The Truth" was created during the KSL trading
              period. It has not been updated since 2021. It is not affiliated with KSL Hair, the appointed
              insolvency practitioner, or Simon Lindsay, and it does not reflect the verified, current
              position of any of those parties.
            </p>
            <p>
              Anyone with a genuine question about KSL Hair, the insolvency process, or Simon Lindsay's
              current work is invited to use the named, on-record contact route below rather than rely on
              an anonymous page that stopped being maintained four years ago.
            </p>
          </>
        ),
      },
      {
        heading: 'What Simon Lindsay does now',
        body: (
          <>
            <p>
              After KSL, Simon founded A.R.I.A™ — a UK reputation intelligence platform headquartered in
              Glasgow. The work focuses on detecting and defending against reputational threats for
              executives, athletes, and public-facing organisations, using OSINT, narrative defence, and UK
              legal frameworks.
            </p>
          </>
        ),
      },
    ]}
    faqs={[
      {
        q: 'Is the "KSL Hair The Truth" Facebook page official?',
        a: 'No. It is an anonymous third-party page that has not been updated since 2021. It is not affiliated with KSL Hair, the appointed UK insolvency practitioner, or Simon Lindsay, and does not reflect the verified current position of any of those parties.',
      },
      {
        q: 'What is the truth about KSL Hair?',
        a: 'KSL Hair Clinics was a UK hair-restoration provider founded in Glasgow by Simon Lindsay. The trading entity ceased trading through formal UK insolvency procedures under the Insolvency Act 1986. The appointed insolvency practitioner is the correct point of contact for historical creditor and customer claims.',
      },
      {
        q: 'Who do I contact about a historical KSL Hair issue?',
        a: 'After the formal insolvency, the appointed UK insolvency practitioner is the correct route for creditor and customer claims. Good-faith messages sent through the contact form on ariaops.co.uk are read by Simon Lindsay personally and signposted to the correct route.',
      },
      {
        q: 'What is Simon Lindsay doing now?',
        a: 'Simon Lindsay is the founder of A.R.I.A™, a UK reputation intelligence platform headquartered in Glasgow, serving executives, athletes, and public-facing organisations.',
      },
    ]}
    related={[
      { label: 'KSL Hair — full history', href: '/simon-lindsay/ksl-hair' },
      { label: 'KSL Hair — complaints (official statement)', href: '/simon-lindsay/ksl-hair-complaints' },
      { label: 'Simon Lindsay & KSL — founder record', href: '/simon-lindsay/ksl' },
      { label: 'Simon Lindsay — Bankruptcy (the record)', href: '/simon-lindsay/bankruptcy' },
      { label: 'Simon Lindsay — Reviews & References', href: '/simon-lindsay/reviews' },
      { label: 'Online Impersonation (UK)', href: '/services/online-impersonation-uk' },
    ]}
  />
);

export default SimonLindsayKSLHairTheTruthPage;
