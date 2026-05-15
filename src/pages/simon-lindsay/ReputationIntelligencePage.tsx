import React from 'react';
import SimonClusterPage from '@/components/seo/SimonClusterPage';

const SimonLindsayReputationIntelligencePage = () => (
  <SimonClusterPage
    title="Simon Lindsay — Reputation Intelligence (UK)"
    description="Simon Lindsay leads A.R.I.A™ reputation intelligence — combining AI threat detection, narrative defence, and UK legal removal for executives and public figures."
    path="/simon-lindsay/reputation-intelligence"
    eyebrow="Simon Lindsay · Reputation Intelligence"
    h1="Simon Lindsay — reputation intelligence operator"
    lede="Reputation intelligence is the discipline of turning ambient signal — search results, social mentions, forum chatter, dark-web leaks — into actionable defence. Simon Lindsay leads this practice at A.R.I.A™, serving UK executives, athletes, and public figures."
    personJobTitle="Reputation Intelligence Operator & Founder, A.R.I.A™"
    personKnowsAbout={[
      'Reputation Intelligence',
      'OSINT',
      'Narrative Defence',
      'Threat Detection',
      'Crisis Communications',
      'UK Defamation Law',
    ]}
    sections={[
      {
        heading: 'What reputation intelligence actually is',
        body: (
          <>
            <p>
              Reputation intelligence is not PR. It is not crisis communications. It is the systematic
              collection, scoring, and counter-action layer that sits underneath both. Done properly it
              answers four questions in real time: <em>who is talking, what are they saying, how serious is
              it, and what do we do next?</em>
            </p>
            <p>
              Simon's framing: reputation is now an attack surface, not a brand asset. Treat it like
              cybersecurity — with detection, containment, eradication, and recovery — and the rest of the
              defence stack falls into place.
            </p>
          </>
        ),
      },
      {
        heading: 'The four-layer doctrine',
        body: (
          <ul className="list-disc list-inside space-y-2">
            <li><strong className="text-foreground">Detect.</strong> Continuous OSINT across news, social, forums, and surfaceable dark-web sources.</li>
            <li><strong className="text-foreground">Score.</strong> 1–10 severity scoring against the client's specific threat surface.</li>
            <li><strong className="text-foreground">Respond.</strong> Narrative defence, page-one ownership, and counter-content deployment.</li>
            <li><strong className="text-foreground">Remove.</strong> Legal Ops desk filing UK GDPR, DMCA, and Defamation Act notices end-to-end.</li>
          </ul>
        ),
      },
      {
        heading: 'Who Simon works with',
        body: (
          <p>
            UK executives navigating hostile press cycles, public figures targeted by impersonation or
            deepfake content, athletes whose reputations move markets, and family offices protecting principal
            and family members. Every engagement runs under signed NDA — anonymised case work is the only
            kind A.R.I.A™ publishes.
          </p>
        ),
      },
    ]}
    faqs={[
      {
        q: 'What\'s the difference between reputation intelligence and reputation management?',
        a: 'Reputation management is largely reactive — responding to incidents that have already surfaced. Reputation intelligence is proactive: continuous monitoring, severity scoring, and structured response before incidents reach page one. Simon\'s practice is the latter.',
      },
      {
        q: 'How fast does the team respond to a new threat?',
        a: 'A.R.I.A™ targets first alert within 6 hours of detection — usually before the story leaves its originating platform. Compare that to the industry average of 9–14 days for traditional reputation management firms.',
      },
      {
        q: 'Is reputation intelligence legal in the UK?',
        a: 'Yes. The detection layer uses publicly available OSINT sources. The removal layer operates strictly within UK statute — Defamation Act 2013, Malicious Communications Act 1988, Communications Act 2003, and UK GDPR. No grey-area tactics, no fake-review farms, no manipulated reviews.',
      },
    ]}
    related={[
      { label: 'Simon Lindsay — A.R.I.A™ Founder', href: '/simon-lindsay/aria' },
      { label: 'Simon Lindsay — AI', href: '/simon-lindsay/ai' },
      { label: 'Brand Protection (UK)', href: '/services/brand-protection' },
    ]}
  />
);

export default SimonLindsayReputationIntelligencePage;
