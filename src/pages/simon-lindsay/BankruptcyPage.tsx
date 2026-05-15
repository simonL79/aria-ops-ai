import React from 'react';
import SimonClusterPage from '@/components/seo/SimonClusterPage';
import heroImage from '@/assets/hero-simon-bankruptcy.jpg';

const SimonLindsayBankruptcyPage = () => (
  <SimonClusterPage
    heroImage={heroImage}
    heroAlt="Simon Lindsay — corporate insolvency, the on-record account"
    title="Simon Lindsay — Corporate Insolvency: The On-Record Account"
    description="The on-record account of the KSL Hair corporate insolvency, what UK insolvency law actually means, and what Simon Lindsay built afterwards."
    path="/simon-lindsay/bankruptcy"
    eyebrow="Simon Lindsay · The record"
    h1="Simon Lindsay — corporate insolvency, in plain language"
    lede="When people search this term they want a clear, factual answer. This is it: what happened to KSL Hair, what UK insolvency procedure actually is, and what Simon Lindsay is doing now."
    personJobTitle="Founder, A.R.I.A™ — formerly founder of KSL Hair Clinics"
    personKnowsAbout={[
      'UK corporate insolvency',
      'Company restructuring',
      'Director duties',
      'Recovery and rebuild',
      'Reputation defence',
    ]}
    sections={[
      {
        heading: 'What actually happened',
        body: (
          <>
            <p>
              KSL Hair Clinics, the trading entity Simon Lindsay founded in Glasgow, entered formal UK
              insolvency procedures and ceased trading. The process was conducted through licensed UK
              insolvency practitioners under the Insolvency Act 1986.
            </p>
            <p>
              Insolvency is a statutory corporate process for resolving the affairs of a limited company
              that can no longer meet its liabilities. It is the legitimate, regulated route designed by
              UK law for exactly this situation.
            </p>
          </>
        ),
      },
      {
        heading: 'What corporate insolvency is — and is not',
        body: (
          <>
            <p>
              Corporate insolvency of a limited company is distinct from personal bankruptcy of a director.
              It is a statutory winding-up of a separate legal entity. It is not in itself a finding of
              personal wrongdoing, criminality or fraud against the founder.
            </p>
            <p>
              UK directors operating through limited companies use this framework regularly. It exists
              precisely so that businesses which cannot continue can be wound down in an orderly,
              creditor-protective way.
            </p>
          </>
        ),
      },
      {
        heading: 'What Simon Lindsay built next',
        body: (
          <>
            <p>
              After the KSL chapter Simon founded A.R.I.A™, a UK reputation intelligence platform. The
              work is informed directly by what he learned during the KSL period — how online narratives
              form, how they harden, and how UK law and platform processes can be used to defend against
              defamation, impersonation and hostile-campaign clusters.
            </p>
            <p>
              The throughline is simple: build something serious, take responsibility for the hard
              chapters, use the experience to help others.
            </p>
          </>
        ),
      },
    ]}
    faqs={[
      {
        q: 'Was Simon Lindsay personally bankrupt?',
        a: 'The KSL Hair trading entity entered formal UK corporate insolvency procedures. Corporate insolvency of a limited company is a separate legal process from personal bankruptcy of a director.',
      },
      {
        q: 'Is Simon Lindsay disqualified as a director?',
        a: 'No. He is the founder and active director of A.R.I.A™, operating from Glasgow under UK jurisdiction.',
      },
      {
        q: 'Why does this still appear in search results?',
        a: 'Historical news coverage persists in search indexes. A.R.I.A™ runs the same legitimate UK legal and SEO processes for any client whose past is over-indexed against their present work.',
      },
    ]}
    related={[
      { label: 'Simon Lindsay — KSL Hair (full history)', href: '/simon-lindsay/ksl-hair' },
      { label: 'Simon Lindsay — Entrepreneur', href: '/simon-lindsay/entrepreneur' },
      { label: 'Simon Lindsay — Reputation Intelligence', href: '/simon-lindsay/reputation-intelligence' },
    ]}
  />
);

export default SimonLindsayBankruptcyPage;
