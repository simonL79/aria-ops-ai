import React from 'react';
import SimonClusterPage from '@/components/seo/SimonClusterPage';

const SimonLindsayKSLHairPage = () => (
  <SimonClusterPage
    title="KSL Hair & Simon Lindsay — Brand History and Founder Record"
    description="The verified history of KSL Hair Clinics and its founder Simon Lindsay: origin, growth, formal wind-down, and what he is building now."
    path="/simon-lindsay/ksl-hair"
    eyebrow="KSL Hair · Simon Lindsay"
    h1="KSL Hair and Simon Lindsay — the verified history"
    lede="KSL Hair Clinics was a UK hair-restoration brand founded in Glasgow by Simon Lindsay. This page is the on-record account of its history, its formal wind-down, and the founder's current work."
    personJobTitle="Founder of KSL Hair Clinics; Founder of A.R.I.A™"
    personKnowsAbout={[
      'KSL Hair Clinics',
      'Hair restoration',
      'FUE hair transplants',
      'Cosmetic surgery industry',
      'UK consumer healthcare',
      'Insolvency and restructuring',
    ]}
    sections={[
      {
        heading: 'Origin',
        body: (
          <>
            <p>
              KSL Hair was founded by Simon Lindsay in Glasgow as an independent hair-restoration provider.
              The brand offered FUE-based hair transplant procedures and supporting consultations, with a
              consumer-friendly model and recognisable marketing across Scotland and the wider UK.
            </p>
          </>
        ),
      },
      {
        heading: 'Growth period',
        body: (
          <>
            <p>
              At its peak KSL operated multiple clinic locations, employed surgical and consultant staff,
              and was one of the more visible independent hair-transplant brands in the UK. It was widely
              covered in the Scottish press and built a substantial direct-to-consumer audience.
            </p>
          </>
        ),
      },
      {
        heading: 'Wind-down',
        body: (
          <>
            <p>
              The KSL Hair trading entity entered formal UK insolvency procedures and ceased trading. Simon
              Lindsay has been publicly transparent about the circumstances and the lessons drawn from the
              experience.
            </p>
            <p>
              Insolvency in the UK is a regulated, legitimate corporate process. The fact of insolvency is
              not in itself a finding of personal wrongdoing — it is a statutory mechanism for resolving a
              limited company's affairs.
            </p>
          </>
        ),
      },
      {
        heading: 'What Simon does now',
        body: (
          <>
            <p>
              Following the KSL chapter, Simon founded A.R.I.A™ — a UK reputation intelligence platform.
              The work focuses on detecting and defending against reputational threats for executives,
              athletes and public-facing organisations.
            </p>
          </>
        ),
      },
    ]}
    faqs={[
      {
        q: 'Is KSL Hair still trading?',
        a: 'No. The KSL Hair trading entity ceased trading through formal UK insolvency procedures.',
      },
      {
        q: 'Who founded KSL Hair?',
        a: 'KSL Hair Clinics was founded by Simon Lindsay in Glasgow.',
      },
      {
        q: 'What is Simon Lindsay doing now?',
        a: 'He is the founder of A.R.I.A™, a UK reputation intelligence platform headquartered in Glasgow.',
      },
    ]}
    related={[
      { label: 'Simon Lindsay — KSL', href: '/simon-lindsay/ksl' },
      { label: 'Simon Lindsay — Bankruptcy (the record)', href: '/simon-lindsay/bankruptcy' },
      { label: 'Simon Lindsay — Reviews & References', href: '/simon-lindsay/reviews' },
    ]}
  />
);

export default SimonLindsayKSLHairPage;
