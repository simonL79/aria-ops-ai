import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import SEO from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, XCircle, type LucideIcon } from 'lucide-react';
import StatDisclaimer from '@/components/legal/StatDisclaimer';
import ScrollSpy from '@/components/sections/ScrollSpy';

export interface StealthPageConfig {
  path: string;
  title: string; // <60 chars — full <title>
  metaDescription: string; // <160 chars
  h1: React.ReactNode;
  heroEyebrow: string;
  heroSubhead: string;
  problem: { heading: string; body: string[] };
  capabilities: { icon: LucideIcon; title: string; body: string }[];
  keywordClusters: { title: string; items: string[] }[];
  methodology: { step: string; title: string; body: string }[];
  comparison: {
    competitorLabel: string;
    rows: { feature: string; competitor: string | boolean; aria: string | boolean }[];
  };
  faqs: { q: string; a: string }[];
  relatedLinks: { to: string; label: string }[];
  serviceType: string;
  breadcrumbName: string;
  positioningQuote?: string;
}

const SITE = 'https://www.ariaops.co.uk';
const POSITIONING_DEFAULT =
  'AI-era reputation intelligence for founders, athletes, public figures and brands — combining online reputation protection, AI search visibility, threat scoring and human-led crisis response.';

const renderCell = (v: string | boolean) => {
  if (typeof v === 'boolean') {
    return v ? (
      <CheckCircle2 className="h-5 w-5 text-primary" aria-label="Yes" />
    ) : (
      <XCircle className="h-5 w-5 text-muted-foreground/50" aria-label="No" />
    );
  }
  return <span className="text-sm">{v}</span>;
};

const StealthLandingPage: React.FC<{ cfg: StealthPageConfig }> = ({ cfg }) => {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: cfg.breadcrumbName,
      provider: {
        '@type': 'Organization',
        name: 'A.R.I.A™',
        url: `${SITE}/`,
      },
      areaServed: 'Worldwide',
      serviceType: cfg.serviceType,
      description: cfg.metaDescription,
      url: `${SITE}${cfg.path}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: cfg.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'AI Reputation Readiness',
          item: `${SITE}/ai-reputation-readiness`,
        },
        { '@type': 'ListItem', position: 3, name: cfg.breadcrumbName },
      ],
    },
  ];

  const positioning = cfg.positioningQuote ?? POSITIONING_DEFAULT;

  const scrollSections = useMemo(
    () => [
      { id: 'problem', label: 'The issue' },
      { id: 'capabilities', label: 'Approach' },
      { id: 'coverage', label: 'Coverage' },
      { id: 'methodology', label: 'Execution' },
      { id: 'comparison', label: 'Comparison' },
      { id: 'faq', label: 'FAQ' },
    ],
    []
  );

  return (
    <PublicLayout>
      <SEO
        title={cfg.title}
        description={cfg.metaDescription}
        path={cfg.path}
        ogType="website"
        jsonLd={jsonLd}
      />

      <article className="bg-background text-foreground">
        {/* Hero */}
        <section className="container mx-auto px-6 pt-20 pb-12 max-w-5xl text-center">
          <p className="text-sm uppercase tracking-widest text-primary mb-4">{cfg.heroEyebrow}</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{cfg.h1}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {cfg.heroSubhead}
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-10">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/scan">
                Request the readiness audit <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Talk to an operator</Link>
            </Button>
          </div>
        </section>

        {/* Positioning quote */}
        <section className="container mx-auto px-6 py-8 max-w-4xl">
          <blockquote className="border-l-4 border-primary pl-8 py-2">
            <p className="text-lg md:text-xl italic text-muted-foreground leading-snug">
              {positioning}
            </p>
          </blockquote>
        </section>

        {/* Problem */}
        <section id="problem" tabIndex={-1} className="container mx-auto px-6 py-16 max-w-4xl scroll-mt-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{cfg.problem.heading}</h2>
          <div className="space-y-4">
            {cfg.problem.body.map((p, i) => (
              <p key={i} className="text-lg text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section id="capabilities" tabIndex={-1} className="container mx-auto px-6 py-16 max-w-6xl scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The A.R.I.A approach</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three operating layers working together — detection, defence and authority.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {cfg.capabilities.map(({ icon: Icon, title, body }) => (
              <Card
                key={title}
                className="bg-card border-border p-8 hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Keyword cluster grid */}
        <section id="coverage" tabIndex={-1} className="container mx-auto px-6 py-16 max-w-6xl scroll-mt-24">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-widest text-primary mb-3">What's covered</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The full surface of this discipline.
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl">
              A.R.I.A operates across every sub-discipline this category now touches. The list
              below is what's in scope when you engage us on this lane.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cfg.keywordClusters.map((cluster) => (
              <Card
                key={cluster.title}
                className="bg-card border-border p-6 hover:border-primary/40 transition-colors"
              >
                <h3 className="text-lg font-semibold mb-4 text-foreground">{cluster.title}</h3>
                <ul className="space-y-2">
                  {cluster.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section id="methodology" tabIndex={-1} className="container mx-auto px-6 py-16 max-w-5xl scroll-mt-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">How A.R.I.A executes</h2>
          <ol className="space-y-6">
            {cfg.methodology.map((m) => (
              <li key={m.title} className="flex gap-5">
                <div className="shrink-0 w-12 h-12 rounded-xl border border-primary/30 bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {m.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{m.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{m.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Comparison table */}
        <section id="comparison" tabIndex={-1} className="container mx-auto px-6 py-16 max-w-5xl scroll-mt-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            A.R.I.A vs {cfg.comparison.competitorLabel}
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-3xl">
            Where the rest of the market stops, A.R.I.A keeps going. Side-by-side, what the two
            approaches actually deliver.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left">
              <thead className="bg-card">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold">Capability</th>
                  <th className="px-4 py-3 text-sm font-semibold text-muted-foreground">
                    {cfg.comparison.competitorLabel}
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-primary">A.R.I.A™</th>
                </tr>
              </thead>
              <tbody>
                {cfg.comparison.rows.map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3 text-sm font-medium">{r.feature}</td>
                    <td className="px-4 py-3">{renderCell(r.competitor)}</td>
                    <td className="px-4 py-3">{renderCell(r.aria)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" tabIndex={-1} className="container mx-auto px-6 py-12 max-w-4xl scroll-mt-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Frequently asked questions</h2>
          <div className="space-y-4">
            {cfg.faqs.map((f) => (
              <div key={f.q} className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.q}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="container mx-auto px-6 py-12 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Related A.R.I.A solutions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cfg.relatedLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block p-4 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors"
              >
                <span className="text-sm font-medium text-foreground">{l.label}</span>
                <ArrowRight className="inline ml-2 h-4 w-4 text-primary" />
              </Link>
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
              Request the A.R.I.A AI Reputation Readiness Audit. Confidential.
              Operator-delivered.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
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

        {/* Site-wide outcome disclaimer */}
        <section className="container mx-auto px-6 pb-16 max-w-4xl">
          <StatDisclaimer />
        </section>
      </article>
    </PublicLayout>
  );
};

export default StealthLandingPage;
