import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Scale, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/*
  Two ways ARIA protects you — story-driven, card-light.
  Replaces the busy six-card grid with two clear narrative paths:
   1. AI Reputation Intelligence (monitoring)
   2. Legal Protection & Response (Legal Shield + Defence)
*/

const PATHS = [
  {
    id: 'intelligence',
    icon: Eye,
    eyebrow: 'Intelligence',
    title: 'AI Reputation Intelligence',
    body:
      'ARIA watches every surface that shapes how the world sees you — search, AI answers, news, social and the dark web — and surfaces risk before it escalates.',
    points: [
      'Emerging narrative & threat detection',
      'What ChatGPT, Gemini & Perplexity say about you',
      'Impersonation & synthetic-content monitoring',
      'Defensive search positioning',
    ],
    cta: { label: 'Request a confidential assessment', href: '/scan' },
    secondary: { label: 'Explore monitoring', href: '/reputation-threat-score' },
  },
  {
    id: 'legal',
    icon: Scale,
    eyebrow: 'Legal',
    title: 'Legal Protection & Response',
    body:
      'When something crosses the line, ARIA turns evidence into action — from solicitor-ready case prep to statutory takedowns and regulatory-grade audit trails.',
    points: [
      'Evidence building & case threading',
      'GDPR takedowns & right-to-erasure enforcement',
      'Cease & desist automation with evidence pack',
      'Defamation prep & counsel hand-off',
    ],
    cta: { label: 'Open ARIA Legal Shield', href: '/services/legal-shield' },
    secondary: { label: 'Legal Defence & Compliance', href: '/legal-defence-compliance' },
  },
];

const ServicesSection = () => {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <section className="bg-background py-28 md:py-36 relative" id="services">
      <div ref={ref} className="container mx-auto px-6">
        <div
          className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">
            One platform, two disciplines
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-4 leading-tight">
            Intelligence to see it. Power to act on it.
          </h2>
          <p className="text-muted-foreground text-lg mt-5 leading-relaxed">
            ARIA pairs always-on AI monitoring with solicitor-ready legal response —
            so reputational and legal risk is handled inside one system.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {PATHS.map((path, index) => (
            <div
              key={path.id}
              className={`glass-card p-8 md:p-10 flex flex-col transition-all duration-700 hover:border-primary/30 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: visible ? `${index * 140}ms` : '0ms' }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <path.icon className="h-6 w-6 text-primary" />
              </div>

              <span className="text-[11px] font-medium tracking-[0.22em] uppercase text-primary/70">
                {path.eyebrow}
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-2">
                {path.title}
              </h3>
              <p className="text-muted-foreground mt-4 leading-relaxed">{path.body}</p>

              <ul className="mt-6 space-y-3 flex-1">
                {path.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-sm text-foreground/80">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to={path.cta.href}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3.5 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
                >
                  {path.cta.label}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to={path.secondary.href}
                  className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors text-center sm:text-left"
                >
                  {path.secondary.label} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
