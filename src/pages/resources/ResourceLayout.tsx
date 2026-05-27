import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import SEO from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export interface ResourceConfig {
  path: string;
  title: string; // <60 chars
  metaDescription: string; // <160 chars
  h1: string;
  eyebrow: string;
  tldr: string;
  /** Renderable body — already structured with semantic H2s and content */
  body: React.ReactNode;
  /** Primary CTA — usually to a matching target page with rotated anchor */
  ctaHeading: string;
  ctaBody: string;
  ctaLabel: string;
  ctaTo: string;
  /** JSON-LD schema type and extra fields */
  schemaType: 'Article' | 'HowTo' | 'DefinedTermSet';
  schemaExtras?: Record<string, unknown>;
  /** Related resource / target links for the bottom rail */
  related: { to: string; label: string }[];
  breadcrumbName: string;
}

const SITE = 'https://www.ariaops.co.uk';

const ResourceLayout: React.FC<{ cfg: ResourceConfig }> = ({ cfg }) => {
  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': cfg.schemaType,
      name: cfg.h1,
      headline: cfg.h1,
      description: cfg.metaDescription,
      url: `${SITE}${cfg.path}`,
      author: { '@type': 'Organization', name: 'A.R.I.A™' },
      publisher: { '@type': 'Organization', name: 'A.R.I.A™', url: `${SITE}/` },
      ...(cfg.schemaExtras ?? {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Resources', item: `${SITE}/resources` },
        { '@type': 'ListItem', position: 3, name: cfg.breadcrumbName },
      ],
    },
  ];

  return (
    <PublicLayout>
      <SEO
        title={cfg.title}
        description={cfg.metaDescription}
        path={cfg.path}
        ogType="article"
        jsonLd={jsonLd}
      />
      <article className="bg-background text-foreground">
        <header className="container mx-auto px-6 pt-20 pb-10 max-w-4xl">
          <p className="text-sm uppercase tracking-widest text-primary mb-4">{cfg.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{cfg.h1}</h1>
          <div className="border-l-4 border-primary pl-6 py-2 mb-2">
            <p className="text-lg text-muted-foreground leading-relaxed">
              <span className="text-primary font-semibold">TL;DR — </span>
              {cfg.tldr}
            </p>
          </div>
        </header>

        <section className="container mx-auto px-6 py-8 max-w-3xl prose prose-invert prose-headings:font-bold prose-headings:text-foreground prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary">
          {cfg.body}
        </section>

        <section className="container mx-auto px-6 py-16 max-w-4xl">
          <div className="bg-card border border-primary/40 rounded-lg p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{cfg.ctaHeading}</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">{cfg.ctaBody}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to={cfg.ctaTo}>
                  {cfg.ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/scan">Run a free threat scan</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-12 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">More from A.R.I.A</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cfg.related.map((l) => (
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
      </article>
    </PublicLayout>
  );
};

export default ResourceLayout;
