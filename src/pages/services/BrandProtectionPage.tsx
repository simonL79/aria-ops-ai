import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import SEO from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Brain, ShieldCheck, Scale, Activity, Search, Sparkles, ArrowRight } from 'lucide-react';

const faqs: { q: string; a: string }[] = [
  {
    q: 'What does brand protection actually cover?',
    a: 'In the A.R.I.A™ model, brand protection covers six overlapping disciplines: AI-driven threat detection (catching attacks before they escalate), narrative defence (counter-content that pushes harmful material off page one), identity protection (executive impersonation and deepfake monitoring), search positioning (defensive page-one ranking), AI reputation readiness (how ChatGPT, Gemini and Perplexity describe you), and legal removal & compliance (DMCA, defamation notices, GDPR takedowns, trademark enforcement). Most agencies only deliver the last one.',
  },
  {
    q: 'How is brand protection different from PR or reputation management?',
    a: 'PR builds reputation, reputation management responds to incidents, brand protection prevents them. The difference is monitoring depth, response speed, and whether the operator can actually take harmful content down — not just write a press release about it.',
  },
  {
    q: 'Do I need brand protection if I\'m not a public figure?',
    a: 'Yes if your brand is the target of impersonation, fake reviews, deepfakes, or coordinated negative SEO — none of which require fame. Companies under £10M revenue are now the most common targets because their defence budgets are smaller and the attack tooling is cheap.',
  },
  {
    q: 'What\'s the cost of brand protection in the UK?',
    a: 'Entry-level monitoring starts around £97/month. Full-service AI threat detection plus active defence sits in the £297–£2,000/month range depending on profile size and threat surface. Enterprise (executive teams, listed companies, family offices) is typically priced annually.',
  },
];

const BrandProtectionPage = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Brand Protection',
    serviceType: 'Brand Protection',
    provider: { '@type': 'Organization', name: 'A.R.I.A™', url: 'https://www.ariaops.co.uk/' },
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    description:
      'AI-driven brand protection across six disciplines: threat detection, narrative defence, identity protection, search positioning, AI reputation readiness, and legal removal & compliance — for UK businesses, executives, and public figures.',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ariaops.co.uk/' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.ariaops.co.uk/services/brand-protection' },
      { '@type': 'ListItem', position: 3, name: 'Brand Protection' },
    ],
  };

  const pillars = [
    {
      icon: Brain,
      title: 'AI Threat Detection',
      body: 'Continuous OSINT scanning of news, social, forums, and dark-web mentions. Severity-scored 1–10 against your specific threat surface, surfaced before incidents go viral.',
    },
    {
      icon: Activity,
      title: 'Narrative Defence',
      body: 'When a hostile narrative starts, we deploy counter-content engineered to outrank it. Page-one ownership is the only durable defence against negative search results.',
    },
    {
      icon: ShieldCheck,
      title: 'Identity Protection',
      body: 'Executive impersonation, deepfake voice/video monitoring, fake-account discovery across Meta, X, LinkedIn, TikTok, and Telegram. Takedown lifecycle handled end-to-end.',
    },
    {
      icon: Search,
      title: 'Search Positioning',
      body: 'Defensive ranking strategy and authority content layering that keeps page one yours — the only durable way to suppress hostile search results long-term.',
    },
    {
      icon: Sparkles,
      title: 'AI Reputation Readiness',
      body: 'Audit and shape how ChatGPT, Gemini, Perplexity and agentic search interpret you. Structured presence, citation control, and trust-signal optimisation for the agentic web.',
    },
    {
      icon: Scale,
      title: 'Legal Removal & Compliance',
      body: 'Defamation Act notices, DMCA takedowns, GDPR right-to-erasure, trademark enforcement, and Norwich Pharmacal Orders — backed by SOC II / ISO 27001-aligned audit trails.',
    },
  ];

  return (
    <PublicLayout>
      <SEO
        title="Brand Protection UK — AI Threat Detection & Reputation Defence"
        description="UK brand protection across six disciplines: AI threat detection, narrative defence, identity protection, search positioning, AI reputation readiness, and legal removal & compliance."
        path="/services/brand-protection"
        jsonLd={[faqJsonLd, serviceJsonLd, breadcrumbJsonLd]}
      />

      <article className="bg-background text-foreground">
        {/* Hero */}
        <section className="container mx-auto px-6 pt-20 pb-12 max-w-4xl">
          <p className="text-sm uppercase tracking-widest text-primary mb-4">UK Brand Protection</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Brand protection — built for an AI-driven attack surface
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Most UK brand-protection services are dressed-up press monitoring with a takedown
            form attached. A.R.I.A™ is different: autonomous AI threat detection, real-time
            narrative defence, and a Legal Ops desk that actually files notices — all under one
            operator-led roof.
          </p>
        </section>

        {/* Pillars */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Six pillars, one system</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-card border border-border rounded-lg p-6">
                <Icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why us */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Why A.R.I.A™ vs the incumbents</h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              <strong className="text-foreground">Detection in hours, not weeks.</strong> The
              average UK reputation-management firm reacts to incidents 9–14 days after they
              surface. A.R.I.A™ alerts inside 6 hours — usually before the story leaves its
              originating platform.
            </p>
            <p>
              <strong className="text-foreground">Operator-led, not template-led.</strong> Every
              client engages with a real operator. No tickets, no offshore call centre, no
              boilerplate cease-and-desist letters that nobody reads.
            </p>
            <p>
              <strong className="text-foreground">Anonymity by design.</strong> We do not name
              clients in case studies, never publish testimonials with real surnames, and operate
              under signed NDAs as standard. Reputation work that gets boasted about defeats its
              own purpose.
            </p>
            <p>
              <strong className="text-foreground">Legally grounded.</strong> Our removal pipeline
              is built around UK statute (Defamation Act 2013, Malicious Communications Act 1988,
              Communications Act 2003 s.127, UK GDPR) — not "best practice" PR theatre.
            </p>
          </div>
        </section>

        {/* Threat surface */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">What we protect against</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Fake Google reviews',
              'Executive impersonation',
              'Deepfake video & voice',
              'Coordinated negative SEO',
              'Doxxing & data leaks',
              'Trademark squatting',
              'Counterfeit listings',
              'Hostile press cycles',
              'Defamatory blog content',
              'Phishing domains',
              'Cloned social accounts',
              'Forum brigading',
            ].map((t) => (
              <div key={t} className="bg-card border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground">
                {t}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 py-16 max-w-4xl">
          <div className="bg-card border border-primary/40 rounded-lg p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">See your live threat surface in 2 minutes.</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Free reputation scan — no credit card, no sales call. Get a graded view of the
              public-facing threats targeting you or your brand right now.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/scan">
                Run my free scan <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`q-${i}`}>
                <AccordionTrigger className="text-left text-lg">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Related */}
        <section className="container mx-auto px-6 pb-20 max-w-4xl">
          <h2 className="text-xl font-bold mb-4">Related services</h2>
          <ul className="space-y-2 text-primary">
            <li><Link to="/services/online-impersonation-uk" className="hover:underline">→ Online impersonation — UK legal guide</Link></li>
            <li><Link to="/services/remove-google-reviews" className="hover:underline">→ How to remove fake Google reviews</Link></li>
          </ul>
        </section>
      </article>
    </PublicLayout>
  );
};

export default BrandProtectionPage;
