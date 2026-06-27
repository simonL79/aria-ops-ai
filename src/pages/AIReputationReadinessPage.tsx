import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import SEO from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Search, Brain, Bot, CheckCircle2 } from 'lucide-react';

const PATH = '/ai-reputation-readiness';
const TITLE = 'AI Reputation Readiness — A.R.I.A™';
const DESCRIPTION =
  'AI reputation management, monitoring and repair for founders, executives, athletes and brands. A.R.I.A™ protects how Google, ChatGPT, Gemini and Perplexity understand you — across the human, LLM and agentic web.';

const CAPABILITY_CLUSTERS: { title: string; items: string[] }[] = [
  {
    title: 'AI Reputation Management & Intelligence',
    items: [
      'AI reputation management',
      'AI reputation intelligence',
      'AI reputation protection',
      'AI reputation monitoring',
      'AI reputation defence',
      'AI reputation repair',
      'AI-powered reputation management',
      'Reputation intelligence platform',
      'Reputation command centre',
      'Autonomous reputation monitoring',
    ],
  },
  {
    title: 'Online Reputation Management (UK & Global)',
    items: [
      'Online reputation management',
      'Online reputation management UK',
      'Reputation management agency',
      'Reputation management company UK',
      'Reputation repair UK',
      'Online reputation repair',
      'ORM consultant UK',
      'Online reputation consultant UK',
      'Reputation specialist UK',
      'Reputation management Glasgow',
      'Reputation management Scotland',
    ],
  },
  {
    title: 'Personal, Executive & Public-Figure Protection',
    items: [
      'Personal reputation management',
      'Executive reputation management',
      'Founder reputation management',
      'Celebrity reputation management',
      'Athlete reputation management',
      'Public figure reputation management',
      'High-profile individual reputation management',
      'Family reputation protection',
      'Reputation protection for founders',
      'Reputation protection for athletes',
      'Reputation protection for public figures',
    ],
  },
  {
    title: 'Brand, Corporate & Digital Reputation',
    items: [
      'Brand reputation management',
      'Corporate reputation management',
      'Digital reputation management',
      'Digital reputation protection',
      'Reputation protection service',
      'Reputation defence service',
      'Personal brand protection',
      'Influencer reputation management',
      'Sports reputation management',
    ],
  },
  {
    title: 'Monitoring, Threat Scoring & Risk Audits',
    items: [
      'Reputation monitoring software',
      'Reputation monitoring platform',
      'Real-time reputation monitoring',
      'Reputation threat monitoring',
      'Online threat monitoring',
      'Digital threat intelligence',
      'Reputation risk analysis',
      'Reputation risk score',
      'Online threat score',
      'Digital threat score',
      'AI threat score',
      'Reputation audit',
      'Online reputation audit',
      'Personal brand audit',
      'Executive reputation audit',
      'Brand risk audit',
    ],
  },
  {
    title: 'Search Suppression & Content Removal',
    items: [
      'Google reputation management',
      'Google search reputation repair',
      'Negative search result suppression',
      'Search result suppression',
      'SEO suppression',
      'Negative article suppression',
      'Negative content suppression',
      'Negative review suppression',
      'Remove negative search results',
      'Bury negative search results',
      'Suppress negative Google results',
      'Right to be forgotten UK',
      'Delisting request UK',
      'Content removal UK',
      'Harmful content removal',
      'Defamation removal',
      'False content removal',
      'Outdated content removal',
    ],
  },
  {
    title: 'Crisis Response & Narrative Defence',
    items: [
      'Crisis reputation management',
      'Reputation crisis response',
      'Media crisis management',
      'Online crisis management',
      'Smear campaign response',
      'False allegation response',
      'Online attack response',
      'Digital PR for reputation',
      'Positive content strategy',
      'Authority content strategy',
      'AI narrative control',
      'Online narrative monitoring',
    ],
  },
  {
    title: 'AI Search, LLM & Generative Engine Visibility',
    items: [
      'AI search visibility',
      'AI search optimisation',
      'AI search reputation',
      'LLM reputation management',
      'LLM visibility',
      'Generative engine optimisation (GEO)',
      'GEO agency',
      'Answer engine optimisation',
      'AI Overview optimisation',
      'Google AI Overview reputation',
      'ChatGPT reputation visibility',
      'Perplexity visibility',
      'Gemini search visibility',
      'Brand visibility in AI search',
      'AI brand monitoring',
      'AI misinformation monitoring',
      'AI hallucination monitoring',
    ],
  },
  {
    title: 'Entity, Schema & Machine-Readable Identity',
    items: [
      'Entity optimisation',
      'Knowledge panel optimisation',
      'Entity reputation management',
      'Machine-readable brand data',
      'Data provenance SEO',
      'Structured data reputation',
      'Schema markup reputation',
      'Reputation SEO',
    ],
  },
  {
    title: 'Privacy, Identity & Harassment Protection',
    items: [
      'Digital identity protection',
      'Personal data removal',
      'Data broker removal',
      'Privacy protection service',
      'Executive privacy protection',
      'Founder privacy protection',
      'Doxxing protection',
      'Online harassment protection',
      'Athlete digital protection',
    ],
  },
  {
    title: 'Listening, Detection & Predictive Intelligence',
    items: [
      'Social media reputation monitoring',
      'Brand sentiment monitoring',
      'Media monitoring AI',
      'Social listening reputation',
      'Dark web reputation monitoring',
      'Public perception monitoring',
      'AI crisis detection',
      'Predictive reputation analysis',
      'Early warning reputation system',
    ],
  },
  {
    title: 'Recovery, Trust & Authority Rebuilding',
    items: [
      'Reputation recovery strategy',
      'Trust rebuilding strategy',
      'Digital credibility strategy',
      'Authority rebuilding',
      'AI ORM UK',
    ],
  },
];

const WEBS = [
  {
    icon: Search,
    label: 'The Human Web',
    question: 'Can people find me?',
    body:
      "Today's layer: Google, news, social, reviews and comparison sites. A.R.I.A monitors what surfaces against your name, scores reputation risk, and outranks hostile content with authority assets.",
  },
  {
    icon: Brain,
    label: 'The LLM Web',
    question: 'What does AI think I am?',
    body:
      'ChatGPT, Gemini, Copilot and Perplexity now answer the credibility question before any human ever clicks. A.R.I.A makes sure the open web contains enough structured, accurate, positive context for AI systems to interpret you correctly.',
  },
  {
    icon: Bot,
    label: 'The Agentic Web',
    question: 'Would an AI choose me?',
    body:
      'AI agents are starting to act — selecting partners, vendors and people on behalf of users. A.R.I.A prepares your digital footprint so agents recommend you, not filter you out, when the brief lands.',
  },
];

const AUDIT_CHECKS = [
  'What Google shows when your name, brand or company is searched',
  'What ChatGPT, Gemini, Copilot and Perplexity say about you today',
  'Negative associations, stale controversies and hostile content',
  'Missing authority content and weak trust signals',
  'Whether your digital identity is structured enough for AI to parse',
  'Likelihood an AI agent would recommend, ignore or reject you',
];

const FAQS = [
  {
    q: 'How is this different from normal reputation management?',
    a: 'Traditional ORM targets Google search results. AI Reputation Readiness extends that to the LLM Web (how ChatGPT, Gemini and Perplexity describe you) and the Agentic Web (whether AI agents recommend you when acting on a user\'s behalf).',
  },
  {
    q: 'Who is the audit for?',
    a: 'Executives, founders, investors, athletes, public figures and brands whose reputation has commercial consequences — anyone whose name is being queried by humans and AI systems with real money or trust on the line.',
  },
  {
    q: 'What do I receive?',
    a: 'A confidential readiness report covering your Human Web surface, LLM interpretation, agent-recommendation likelihood, and a prioritised plan to close the gaps. Delivered with an A.R.I.A operator briefing.',
  },
  {
    q: 'Why now?',
    a: 'The next web will not just be searched — it will be interpreted by AI. Once an LLM or agent forms a view of you, that view propagates. Getting in front of it is the work.',
  },
];

const AIReputationReadinessPage: React.FC = () => {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'AI Reputation Readiness',
      provider: {
        '@type': 'Organization',
        name: 'A.R.I.A™',
        url: 'https://www.ariaops.co.uk/',
      },
      areaServed: 'Worldwide',
      serviceType: 'Reputation intelligence for the AI-driven internet',
      description: DESCRIPTION,
      url: `https://www.ariaops.co.uk${PATH}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ariaops.co.uk/' },
        { '@type': 'ListItem', position: 2, name: 'AI Reputation Readiness' },
      ],
    },
  ];

  return (
    <PublicLayout>
      <SEO title={TITLE} description={DESCRIPTION} path={PATH} ogType="website" jsonLd={jsonLd} />

      <article className="text-foreground">
        {/* Hero */}
        <section className="container mx-auto px-6 pt-20 pb-12 max-w-5xl text-center">
          <p className="text-sm uppercase tracking-widest text-primary mb-4">
            A new service category
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Reputation intelligence for the <span className="text-primary">AI-driven internet</span>.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            The next web will not just be searched. It will be interpreted by AI. A.R.I.A™ helps
            ensure you are understood correctly, trusted quickly, and protected before reputation
            risk becomes commercial damage.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-10">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/scan">
                Request the readiness audit <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Talk to an operator</Link>
            </Button>
          </div>
        </section>

        {/* Three Webs */}
        <section className="container mx-auto px-6 py-16 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The three webs you now live on</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your reputation is no longer one surface. It's three — and each one is being read by
              a different kind of intelligence.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {WEBS.map(({ icon: Icon, label, question, body }) => (
              <Card
                key={label}
                className="bg-card border-border p-8 hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm uppercase tracking-widest text-primary mb-2">{label}</p>
                <h3 className="text-xl font-bold mb-3">{question}</h3>
                <p className="text-muted-foreground leading-relaxed">{body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* What we check */}
        <section className="container mx-auto px-6 py-16 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The AI Reputation Readiness Audit
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            A confidential audit across the human, LLM and agentic web. We map what's true, what's
            visible, and what AI systems are likely to conclude about you.
          </p>
          <ul className="space-y-4">
            {AUDIT_CHECKS.map((check) => (
              <li key={check} className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <span className="text-lg text-foreground">{check}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Positioning quote */}
        <section className="container mx-auto px-6 py-16 max-w-4xl">
          <blockquote className="border-l-4 border-primary pl-8 py-4">
            <p className="text-2xl md:text-3xl font-semibold leading-snug">
              "A.R.I.A protects how people, businesses and AI systems understand you."
            </p>
          </blockquote>
        </section>

        {/* Capabilities / keyword coverage */}
        <section className="container mx-auto px-6 py-16 max-w-6xl">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-widest text-primary mb-3">What A.R.I.A covers</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The full reputation surface — human, AI and agentic.
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl">
              A.R.I.A operates across every discipline modern reputation defence now touches:
              from classical online reputation management and Google search suppression, to LLM
              visibility, generative engine optimisation, entity and schema work, privacy and
              identity protection, predictive crisis detection and authority rebuilding.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITY_CLUSTERS.map((cluster) => (
              <Card
                key={cluster.title}
                className="bg-card border-border p-6 hover:border-primary/40 transition-colors"
              >
                <h3 className="text-lg font-semibold mb-4 text-foreground">{cluster.title}</h3>
                <ul className="space-y-2">
                  {cluster.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Frequently asked questions</h2>

          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.q}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 py-16 max-w-4xl">
          <div className="bg-card border border-primary/40 rounded-lg p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Find out what AI thinks of you.
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Request the A.R.I.A AI Reputation Readiness Audit. Confidential. Operator-delivered.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/scan">
                  Request audit <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Contact A.R.I.A</Link>
              </Button>
            </div>
          </div>
        </section>
      </article>
    </PublicLayout>
  );
};

export default AIReputationReadinessPage;
