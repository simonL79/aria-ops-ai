import React from 'react';
import SimonClusterPage from '@/components/seo/SimonClusterPage';
import heroAvif from '@/assets/hero-simon-reviews.jpg?w=640;1280;1920&format=avif&quality=60&as=srcset';
import heroWebp from '@/assets/hero-simon-reviews.jpg?w=640;1280;1920&format=webp&quality=72&as=srcset';
import heroFallback from '@/assets/hero-simon-reviews.jpg?w=1280&quality=72';

const SimonLindsayReviewsPage = () => (
  <SimonClusterPage
    heroImage={{ avif: heroAvif, webp: heroWebp, fallback: heroFallback }}
    heroAlt="Simon Lindsay — reviews, references and verification"
    title="Simon Lindsay Reviews — Professional References & Client Feedback"
    description="Professional references and client feedback for Simon Lindsay, founder of A.R.I.A™ reputation intelligence. How to verify, how to request a reference, how reviews are handled."
    path="/simon-lindsay/reviews"
    eyebrow="Simon Lindsay · Reviews"
    h1="Simon Lindsay — reviews, references and how to verify them"
    lede="Reputation work is a trust business. This page sets out how Simon Lindsay handles reviews and references for his current work at A.R.I.A™, and how prospective clients can verify him directly."
    personJobTitle="Founder, A.R.I.A™ Reputation Intelligence"
    personKnowsAbout={[
      'Professional references',
      'Client testimonials',
      'Trust and verification',
      'Reputation management',
      'A.R.I.A™ platform',
    ]}
    sections={[
      {
        heading: 'How references work at A.R.I.A™',
        body: (
          <>
            <p>
              Almost all A.R.I.A™ engagements are run under NDA. Most clients are public-facing individuals
              or organisations who do not want their reputation work named publicly. As a result, formal
              client references are provided privately on request, not published as marketing.
            </p>
            <p>
              Prospective clients can request reference contacts during the brief stage. References are
              shared with the prospective client's named decision-maker, under reciprocal confidentiality.
            </p>
          </>
        ),
      },
      {
        heading: 'Verifying Simon Lindsay directly',
        body: (
          <>
            <p>
              Before engaging, prospective clients are encouraged to verify the founder personally. The
              fastest paths are: a video call arranged through the contact form, a request for a reference
              call with a current client, or a meeting in Glasgow.
            </p>
          </>
        ),
      },
      {
        heading: 'How third-party reviews are handled',
        body: (
          <>
            <p>
              A.R.I.A™ does not pay for, incentivise or solicit fake reviews. UK consumer-protection law
              prohibits this and it is contrary to the firm's published standards.
            </p>
            <p>
              Where third-party search results contain inaccurate, defamatory or impersonating content
              about Simon Lindsay, those items are addressed through the same legal and platform channels
              the firm operates for its clients — UK Defamation Act 2013, UK GDPR Article 17, and
              platform-specific reporting routes.
            </p>
          </>
        ),
      },
    ]}
    faqs={[
      {
        q: 'Where can I read public reviews of Simon Lindsay?',
        a: 'A.R.I.A™ does not run a public testimonial page because almost all client work is under NDA. References are provided privately on request to prospective clients.',
      },
      {
        q: 'Can I speak to a current client before engaging?',
        a: 'Yes. Reference calls with consenting current clients can be arranged after an initial brief.',
      },
      {
        q: 'How do you handle inaccurate reviews about Simon Lindsay personally?',
        a: 'Through the same UK legal and platform channels A.R.I.A™ uses for its clients: Defamation Act 2013, UK GDPR erasure requests, and platform reporting.',
      },
    ]}
    related={[
      { label: 'Simon Lindsay — KSL', href: '/simon-lindsay/ksl' },
      { label: 'Simon Lindsay — Reputation Intelligence', href: '/simon-lindsay/reputation-intelligence' },
      { label: 'Remove Google Reviews (UK)', href: '/services/remove-google-reviews' },
    ]}
  />
);

export default SimonLindsayReviewsPage;
