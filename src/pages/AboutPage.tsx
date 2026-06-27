import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, Gavel, Search, Eye, Lock, ArrowRight } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import SEO from '@/components/seo/SEO';
import SectionDivider from '@/components/ui/SectionDivider';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';
import heroBg from '@/assets/cinematic-hero-bg.jpg';
import ctaBg from '@/assets/cinematic-cta-bg.jpg';

const pillars = [
  {
    icon: Brain,
    title: 'AI Reputation Intelligence',
    tag: 'Monitor',
    body: 'Continuous monitoring across news, search engines, social platforms and large language models — surfacing emerging narrative risk before it escalates.',
  },
  {
    icon: Eye,
    title: 'Threat Detection',
    tag: 'Detect',
    body: 'Live OSINT scanning with severity scoring identifies hostile content, coordinated campaigns and reputational threats as they form.',
  },
  {
    icon: Gavel,
    title: 'Legal Response',
    tag: 'Defend',
    body: 'ARIA Legal Shield™ organises evidence, drafts documentation and assembles solicitor-ready case files when a threat crosses into legal exposure.',
  },
  {
    icon: Search,
    title: 'Search Positioning',
    tag: 'Restore',
    body: 'Suppression of harmful results and authority-building content keep your narrative accurate across Google and the AI answer layer.',
  },
];

const values = [
  {
    icon: Shield,
    title: 'Protection first',
    body: 'Every capability exists to defend reputation, identity and legal position — not to chase vanity metrics.',
  },
  {
    icon: Lock,
    title: 'Discretion by design',
    body: 'Built for high-profile clients who require confidentiality, security and complete control.',
  },
  {
    icon: Brain,
    title: 'Intelligence over noise',
    body: 'AI does the watching at scale; human expertise decides what matters and how to respond.',
  },
];

const AboutPage = () => {
  const [active, setActive] = useState(0);
  const ActiveIcon = pillars[active].icon;
  const hero = useScrollReveal(0.1);

  return (
    <PublicLayout>
      <SEO
        title="About A.R.I.A™ — AI Reputation & Legal Intelligence Platform"
        description="A.R.I.A™ is an enterprise-grade AI platform that pairs real-time reputation monitoring with solicitor-ready legal response, protecting executives, public figures and organisations worldwide."
        path="/about"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'A.R.I.A™',
          description:
            'AI reputation intelligence and legal defence platform for high-profile individuals, brands and organisations.',
          url: 'https://www.ariaops.co.uk/about',
        }}
      />
      <div className="min-h-screen text-foreground">
        {/* Hero + mission */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <img
            src={heroBg}
            alt=""
            aria-hidden="true"
            loading="eager"
            width={1920}
            height={1088}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.10),transparent_60%)]"
            aria-hidden
          />
          <div
            ref={hero.ref}
            className={cn(
              'container mx-auto px-6 relative transition-all duration-700',
              hero.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
            )}
          >
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">
                About the platform
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-semibold mt-5 mb-6 leading-tight text-shadow">
                Reputation intelligence, built for the AI era
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                A.R.I.A™ pairs advanced AI with strategic human expertise to monitor, protect and
                defend reputation — and to prepare solicitor-ready legal responses when it matters
                most.
              </p>
              <p className="mt-6 text-base text-foreground/90 font-medium">
                Our mission: keep your digital narrative and legal position firmly in your control.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 max-w-5xl">
          <SectionDivider />
        </div>

        {/* Interactive defence system */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">
                  The system
                </span>
                <h2 className="font-display text-3xl md:text-5xl font-semibold mt-4 mb-4 leading-tight">
                  An integrated defence system
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Four layers, one platform. Tap a layer to see how it protects you.
                </p>
              </div>

              <div className="grid md:grid-cols-[1fr_1.4fr] gap-6 items-stretch">
                {/* Selector list */}
                <div className="flex flex-col gap-2">
                  {pillars.map((p, i) => {
                    const Icon = p.icon;
                    const isActive = i === active;
                    return (
                      <button
                        key={p.title}
                        onClick={() => setActive(i)}
                        aria-pressed={isActive}
                        className={cn(
                          'group flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-300',
                          isActive
                            ? 'glass-card border-primary/40 shadow-[0_0_30px_hsl(var(--primary)/0.15)]'
                            : 'glass-card hover:border-primary/30',
                        )}
                      >
                        <span
                          className={cn(
                            'inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors',
                            isActive
                              ? 'bg-primary/20 text-primary'
                              : 'bg-primary/10 text-primary/80',
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="flex-1">
                          <span className="block font-display text-sm font-semibold">{p.title}</span>
                          <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            {p.tag}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Detail panel */}
                <div
                  key={active}
                  className="glass-card p-8 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-5">
                    <ActiveIcon className="h-7 w-7" />
                  </span>
                  <h3 className="font-display text-2xl font-semibold mb-3">{pillars[active].title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {pillars[active].body}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 max-w-5xl">
          <SectionDivider />
        </div>

        {/* Who we protect + values */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">
                  Who we protect
                </span>
                <h2 className="font-display text-3xl md:text-5xl font-semibold mt-4 mb-4 leading-tight">
                  Built for those who cannot afford exposure
                </h2>
                <p className="text-muted-foreground">
                  High-profile individuals, executives, brands and organisations that demand
                  discretion at every step.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                {values.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div
                      key={v.title}
                      className="glass-card p-6 transition-all duration-300 hover:border-primary/30"
                    >
                      <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 text-primary mb-4">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="font-display text-lg font-semibold mb-2">{v.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{v.body}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 max-w-5xl">
          <SectionDivider />
        </div>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="glass-card border-primary/30 p-10 md:p-14 text-center relative overflow-hidden">
              <CinematicImage
                variant="cta"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50"
              />
              <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.12),transparent_70%)]"
                aria-hidden
              />
              <div className="relative">
                <h2 className="font-display text-2xl md:text-4xl font-semibold mb-4">
                  See where you stand
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Run a free reputation threat scan, or speak with our team about a protection
                  strategy tailored to your profile.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/scan"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-7 py-3.5 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
                  >
                    Run a free scan
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border hover:border-primary/40 text-foreground font-medium px-7 py-3.5 transition-all duration-300"
                  >
                    Talk to our team
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;
