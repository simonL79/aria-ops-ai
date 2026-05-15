import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import SEO from '@/components/seo/SEO';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ClusterSection {
  heading: string;
  body: React.ReactNode;
}

export interface SimonClusterPageProps {
  title: string;
  description: string;
  path: string;
  eyebrow: string;
  h1: string;
  lede: string;
  sections: ClusterSection[];
  faqs?: { q: string; a: string }[];
  related?: { label: string; href: string }[];
  /** Person JSON-LD knowsAbout / jobTitle override for keyword targeting. */
  personJobTitle?: string;
  personKnowsAbout?: string[];
  /** Hero image — rendered above the H1 and emitted as og:image / twitter:image. */
  heroImage?: string;
  heroAlt?: string;
}

const PERSON_BASE = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Simon Lindsay',
  url: 'https://www.ariaops.co.uk/simon-lindsay',
  worksFor: {
    '@type': 'Organization',
    name: 'A.R.I.A™',
    url: 'https://www.ariaops.co.uk/',
  },
  sameAs: [
    'https://www.ariaops.co.uk/simon-lindsay',
    'https://www.ariaops.co.uk/biography',
  ],
};

const SimonClusterPage: React.FC<SimonClusterPageProps> = ({
  title,
  description,
  path,
  eyebrow,
  h1,
  lede,
  sections,
  faqs = [],
  related = [],
  personJobTitle = 'Founder, A.R.I.A™ Reputation Intelligence',
  personKnowsAbout = [],
  heroImage,
  heroAlt,
}) => {
  const heroAbsUrl = heroImage ? `https://www.ariaops.co.uk${heroImage}` : undefined;
  const imageObjectJsonLd = heroAbsUrl
    ? {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        contentUrl: heroAbsUrl,
        url: heroAbsUrl,
        width: 1920,
        height: 1080,
        encodingFormat: 'image/jpeg',
        caption: heroAlt || h1,
        representativeOfPage: true,
      }
    : null;

  const personJsonLd = {
    ...PERSON_BASE,
    jobTitle: personJobTitle,
    knowsAbout: personKnowsAbout,
    mainEntityOfPage: `https://www.ariaops.co.uk${path}`,
    ...(imageObjectJsonLd ? { image: imageObjectJsonLd } : {}),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ariaops.co.uk/' },
      { '@type': 'ListItem', position: 2, name: 'Simon Lindsay', item: 'https://www.ariaops.co.uk/simon-lindsay' },
      { '@type': 'ListItem', position: 3, name: h1 },
    ],
  };

  const faqJsonLd = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  const jsonLd = [
    personJsonLd,
    breadcrumbJsonLd,
    ...(imageObjectJsonLd ? [imageObjectJsonLd] : []),
    ...(faqJsonLd ? [faqJsonLd] : []),
  ];

  return (
    <PublicLayout>
      <SEO title={title} description={description} path={path} ogType="article" image={heroImage} jsonLd={jsonLd} />

      <article className="bg-background text-foreground">
        {heroImage && (
          <div className="w-full border-b border-border/40">
            <img
              src={heroImage}
              alt={heroAlt || h1}
              width={1920}
              height={1080}
              className="w-full h-auto object-cover max-h-[480px]"
            />
          </div>
        )}
        <section className="container mx-auto px-6 pt-20 pb-10 max-w-4xl">
          <p className="text-sm uppercase tracking-widest text-primary mb-4">{eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{h1}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">{lede}</p>
        </section>

        {sections.map(({ heading, body }) => (
          <section key={heading} className="container mx-auto px-6 py-8 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{heading}</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">{body}</div>
          </section>
        ))}

        {faqs.length > 0 && (
          <section className="container mx-auto px-6 py-10 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Frequently asked questions</h2>
            <div className="space-y-6">
              {faqs.map((f) => (
                <div key={f.q} className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{f.q}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="bg-card border border-primary/40 rounded-lg p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Work with Simon's team.</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Run a free A.R.I.A™ reputation scan or open a confidential brief.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/scan">Run free scan <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Contact Simon</Link>
              </Button>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="container mx-auto px-6 pb-20 max-w-4xl">
            <h2 className="text-xl font-bold mb-4">Related</h2>
            <ul className="space-y-2 text-primary">
              {related.map((r) => (
                <li key={r.href}>
                  <Link to={r.href} className="hover:underline">→ {r.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </PublicLayout>
  );
};

export default SimonClusterPage;
