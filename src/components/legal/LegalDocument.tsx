import React from 'react';
import { Link } from 'react-router-dom';
import StickyHeader from '@/components/layout/StickyHeader';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/seo/SEO';

export interface LegalSection {
  id: string;
  title: string;
}

interface LegalDocumentProps {
  title: string;
  intro?: string;
  lastUpdated?: string;
  seoTitle: string;
  seoDescription: string;
  path: string;
  sections: LegalSection[];
  children: React.ReactNode;
  footerLinks?: { to: string; label: string }[];
  /** Root-relative or absolute image path for Open Graph / Twitter cards. */
  seoImage?: string;
  /** Optional JSON-LD structured data object(s). */
  jsonLd?: object | object[];
}

const LegalDocument: React.FC<LegalDocumentProps> = ({
  title,
  intro,
  lastUpdated,
  seoTitle,
  seoDescription,
  path,
  sections,
  children,
  footerLinks,
}) => {
  const updated =
    lastUpdated ??
    new Date().toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title={seoTitle} description={seoDescription} path={path} />
      <StickyHeader isScrolled={true} />

      <main className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
          {/* Sticky ToC */}
          <aside className="lg:sticky lg:top-28 self-start">
            <div className="rounded-xl border border-border/40 bg-card/60 backdrop-blur p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-primary/80 font-semibold mb-3">
                Contents
              </p>
              <nav className="flex flex-col gap-1.5 text-sm">
                {sections.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors leading-snug"
                  >
                    <span className="text-primary/70 mr-2 font-medium">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Document body */}
          <article className="rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm p-8 md:p-12 shadow-2xl">
            <header className="mb-10 pb-8 border-b border-border/40">
              <p className="text-xs uppercase tracking-[0.22em] text-primary font-semibold mb-3">
                A.R.I.A™ Legal
              </p>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                {title}
              </h1>
              <div className="mt-4 h-px w-24 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
              <p className="mt-4 text-sm text-muted-foreground">
                Last updated: {updated}
              </p>
              {intro && (
                <p className="mt-6 text-base md:text-lg text-secondary-foreground/90 leading-relaxed">
                  {intro}
                </p>
              )}
            </header>

            <div className="legal-prose space-y-10 text-foreground/90 leading-relaxed">
              {children}
            </div>

            {footerLinks && footerLinks.length > 0 && (
              <footer className="mt-14 pt-8 border-t border-border/40 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <span className="text-muted-foreground">Related documents:</span>
                {footerLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                  >
                    {l.label}
                  </Link>
                ))}
              </footer>
            )}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export const LegalSectionBlock: React.FC<{
  id: string;
  index: number;
  title: string;
  children: React.ReactNode;
}> = ({ id, index, title, children }) => (
  <section id={id} className="scroll-mt-28">
    <h2 className="flex items-baseline gap-3 text-xl md:text-2xl font-semibold text-foreground mb-4">
      <span className="text-primary font-mono text-base md:text-lg">
        {String(index).padStart(2, '0')}
      </span>
      {title}
    </h2>
    <div className="space-y-3 text-[15px] text-foreground/85 leading-7">
      {children}
    </div>
  </section>
);

export default LegalDocument;
