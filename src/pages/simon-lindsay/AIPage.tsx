import React from 'react';
import SimonClusterPage from '@/components/seo/SimonClusterPage';

const SimonLindsayAIPage = () => (
  <SimonClusterPage
    title="Simon Lindsay AI — Founder of A.R.I.A™ Reputation Intelligence"
    description="Simon Lindsay is the founder of A.R.I.A™, an AI reputation intelligence platform applying machine learning to threat detection, narrative defence, and brand protection."
    path="/simon-lindsay/ai"
    eyebrow="Simon Lindsay · AI"
    h1="Simon Lindsay and the rise of AI-driven reputation intelligence"
    lede="Simon Lindsay is the founder of A.R.I.A™ (AI Reputation Intelligence Agent) — a system that applies LLM analysis, OSINT scanning, and autonomous response to reputational threats faced by executives, athletes, and high-profile UK clients."
    personJobTitle="Founder, A.R.I.A™ — AI Reputation Intelligence"
    personKnowsAbout={[
      'Artificial Intelligence',
      'Reputation Intelligence',
      'OSINT',
      'Large Language Models',
      'Threat Detection',
      'Narrative Defence',
    ]}
    sections={[
      {
        heading: 'Why Simon built an AI-first reputation platform',
        body: (
          <>
            <p>
              Traditional reputation management is reactive — alerts arrive after the story is already on
              page one. Simon Lindsay built A.R.I.A™ to invert that loop. The platform uses an OpenAI-based
              primary model with a hardened local Mixtral fallback to score severity, cluster threat actors,
              and trigger response within hours rather than weeks.
            </p>
            <p>
              The thesis: in an AI-driven information environment, defence has to operate at machine speed.
              Human-only PR teams can't keep pace with coordinated bot networks, deepfakes, or LLM-generated
              defamation at scale.
            </p>
          </>
        ),
      },
      {
        heading: 'How A.R.I.A™ uses AI day-to-day',
        body: (
          <>
            <p>
              <strong className="text-foreground">Threat detection.</strong> Continuous scanning of news, social,
              forums and dark-web mentions, severity-scored 1–10 against the client's specific threat surface.
            </p>
            <p>
              <strong className="text-foreground">Narrative analysis.</strong> Entity clustering identifies
              hostile campaigns — distinguishing organic criticism from coordinated brigading.
            </p>
            <p>
              <strong className="text-foreground">Counter-content generation.</strong> Page-one defence content
              is engineered to outrank harmful results and reclaim search territory.
            </p>
            <p>
              <strong className="text-foreground">Legal Ops automation.</strong> GDPR removal requests, DMCA
              notices, and Defamation Act letters generated and tracked end-to-end.
            </p>
          </>
        ),
      },
      {
        heading: 'Public statements on AI and reputation',
        body: (
          <p className="italic text-foreground">
            "AI didn't create the reputation problem — it just industrialised it. The only honest defence is
            to industrialise the response. Protect reputation. Control narrative. Unlock strategic opportunity."
            <span className="block mt-2 not-italic text-muted-foreground">— Simon Lindsay, Founder, A.R.I.A™</span>
          </p>
        ),
      },
    ]}
    faqs={[
      {
        q: 'Is Simon Lindsay an AI engineer?',
        a: 'Simon is the founder and product architect behind A.R.I.A™. He sets the operational doctrine and threat-scoring framework, working with engineers and OSINT specialists to build the platform. His background combines commercial strategy with hands-on threat operations rather than pure ML research.',
      },
      {
        q: 'What AI models does A.R.I.A™ use?',
        a: 'A.R.I.A™ runs a hybrid stack: a primary OpenAI model for nuanced narrative analysis with a local Mixtral fallback for resilience and sovereignty. The orchestration layer (codenamed Anubis) decides which model handles which task based on sensitivity and latency.',
      },
      {
        q: 'Where can I read more about Simon Lindsay\'s AI work?',
        a: 'The biography page on ariaops.co.uk and the platform features section cover the technical architecture in more depth, including the threat-detection suite and the autonomous Requiem pipeline.',
      },
    ]}
    related={[
      { label: 'Simon Lindsay — Reputation Intelligence', href: '/simon-lindsay/reputation-intelligence' },
      { label: 'Simon Lindsay — A.R.I.A™ Founder', href: '/simon-lindsay/aria' },
      { label: 'Brand Protection (UK)', href: '/services/brand-protection' },
    ]}
  />
);

export default SimonLindsayAIPage;
