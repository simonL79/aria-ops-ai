import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import SEO from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, XCircle, type LucideIcon } from 'lucide-react';
import StatDisclaimer from '@/components/legal/StatDisclaimer';
import ScrollSpy from '@/components/sections/ScrollSpy';
import SectionDivider from '@/components/ui/SectionDivider';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import CinematicImage from '@/components/ui/CinematicImage';

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
  const hero = useScrollReveal(0.1);

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

      <article className="text-foreground">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <CinematicImage variant="hero" priority className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.10),transparent_60%)]" aria-hidden />
          <div
            ref={hero.ref}
            className={`container relative mx-auto px-6 pt-28 pb-16 max-w-5xl text-center transition-all duration-700 ${
              hero.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">
              {cfg.heroEyebrow}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold mt-5 mb-6 leading-tight text-shadow">
              {cfg.h1}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {cfg.heroSubhead}
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-10">
              <Link
                to="/scan"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-7 py-3.5 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
              >
                Request the readiness audit
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Talk to an operator</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Positioning quote */}
        <section className="container mx-auto px-6 pb-4 max-w-4xl">
          <blockquote className="glass-card px-8 py-6 border-l-2 border-l-primary/60">
            <p className="font-display text-lg md:text-xl text-foreground/90 leading-snug">
              {positioning}
            </p>
          </blockquote>
        </section>

        <ScrollSpy sections={scrollSections} />

        {/* Problem */}
        <section id="problem" data-scrollspy-section tabIndex={-1} className="container mx-auto px-6 py-20 max-w-4xl scroll-mt-24">
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/70">The issue</span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold mt-4 mb-6 leading-tight">{cfg.problem.heading}</h2>
          <div className="space-y-4">
            {cfg.problem.body.map((p, i) => (
              <p key={i} className="text-lg text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>

        <div className="container mx-auto px-6 max-w-5xl"><SectionDivider /></div>

        {/* Capabilities */}
        <section id="capabilities" data-scrollspy-section tabIndex={-1} className="container mx-auto px-6 py-20 max-w-6xl scroll-mt-24">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">Approach</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold mt-4 leading-tight">The A.R.I.A approach</h2>
            <p className="text-muted-foreground text-lg mt-5 leading-relaxed">
              Three operating layers working together — detection, defence and authority.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {cfg.capabilities.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="glass-card p-8 transition-all duration-300 hover:border-primary/30"
              >
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="container mx-auto px-6 max-w-5xl"><SectionDivider /></div>

        {/* Keyword cluster grid */}
        <section id="coverage" data-scrollspy-section tabIndex={-1} className="container mx-auto px-6 py-20 max-w-6xl scroll-mt-24">
          <div className="mb-12 max-w-3xl">
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">Coverage</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold mt-4 mb-5 leading-tight">
              The full surface of this discipline.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              A.R.I.A operates across every sub-discipline this category now touches. The list
              below is what's in scope when you engage us on this lane.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cfg.keywordClusters.map((cluster) => (
              <div
                key={cluster.title}
                className="glass-card p-6 transition-all duration-300 hover:border-primary/30"
              >
                <h3 className="font-display text-lg font-semibold mb-4 text-foreground">{cluster.title}</h3>
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
              </div>
            ))}
          </div>
        </section>

        <div className="container mx-auto px-6 max-w-5xl"><SectionDivider /></div>

        {/* Methodology */}
        <section id="methodology" data-scrollspy-section tabIndex={-1} className="container mx-auto px-6 py-20 max-w-5xl scroll-mt-24">
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">Execution</span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold mt-4 mb-12 leading-tight">How A.R.I.A executes</h2>
          <ol className="space-y-6">
            {cfg.methodology.map((m) => (
              <li key={m.title} className="glass-card p-6 flex gap-5">
                <div className="shrink-0 w-12 h-12 rounded-xl border border-primary/30 bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {m.step}
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-2">{m.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{m.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="container mx-auto px-6 max-w-5xl"><SectionDivider /></div>

        {/* Comparison table */}
        <section id="comparison" data-scrollspy-section tabIndex={-1} className="container mx-auto px-6 py-20 max-w-5xl scroll-mt-24">
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">Comparison</span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold mt-4 mb-6 leading-tight">
            A.R.I.A vs {cfg.comparison.competitorLabel}
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-3xl leading-relaxed">
            Where the rest of the market stops, A.R.I.A keeps going. Side-by-side, what the two
            approaches actually deliver.
          </p>
          <div className="overflow-x-auto glass-card p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="px-4 py-4 text-sm font-semibold">Capability</th>
                  <th className="px-4 py-4 text-sm font-semibold text-muted-foreground">
                    {cfg.comparison.competitorLabel}
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-primary">A.R.I.A™</th>
                </tr>
              </thead>
              <tbody>
                {cfg.comparison.rows.map((r, i) => (
                  <tr key={i} className="border-t border-border/40">
                    <td className="px-4 py-3 text-sm font-medium">{r.feature}</td>
                    <td className="px-4 py-3">{renderCell(r.competitor)}</td>
                    <td className="px-4 py-3">{renderCell(r.aria)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="container mx-auto px-6 max-w-5xl"><SectionDivider /></div>

        {/* FAQ */}
        <section id="faq" data-scrollspy-section tabIndex={-1} className="container mx-auto px-6 py-20 max-w-4xl scroll-mt-24">
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">FAQ</span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold mt-4 mb-8 leading-tight">Frequently asked questions</h2>
          <div className="space-y-4">
            {cfg.faqs.map((f) => (
              <div key={f.q} className="glass-card p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.q}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="container mx-auto px-6 py-12 max-w-5xl">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6">Related A.R.I.A solutions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cfg.relatedLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="glass-card flex items-center justify-between p-4 transition-all duration-300 hover:border-primary/30"
              >
                <span className="text-sm font-medium text-foreground">{l.label}</span>
                <ArrowRight className="h-4 w-4 text-primary shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 py-16 max-w-4xl">
          <div className="glass-card border-primary/30 p-10 md:p-14 text-center relative overflow-hidden">
            <CinematicImage variant="cta" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.12),transparent_70%)]" aria-hidden />
            <div className="relative">
              <h2 className="font-display text-2xl md:text-4xl font-semibold mb-4">
                Find out what AI thinks of you.
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Request the A.R.I.A AI Reputation Readiness Audit. Confidential.
                Operator-delivered.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  to="/scan"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-7 py-3.5 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
                >
                  Request audit
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Button asChild size="lg" variant="outline">
                  <Link to="/contact">Contact A.R.I.A</Link>
                </Button>
              </div>
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
