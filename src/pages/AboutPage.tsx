import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, Gavel, Search, Eye, Lock } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import SEO from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
        {/* Hero + mission, condensed */}
        <section className="py-16 md:py-20 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
                About the platform
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Reputation intelligence, built for the AI era
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                A.R.I.A™ pairs advanced AI with strategic human expertise to monitor, protect and
                defend reputation — and to prepare solicitor-ready legal responses when it matters
                most.
              </p>
              <p className="mt-6 text-base text-foreground font-medium">
                Our mission: keep your digital narrative and legal position firmly in your control.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive defence system — everything in one viewport, no long scroll */}
        <section className="py-16 bg-card/40 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-3">An integrated defence system</h2>
              <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
                Four layers, one platform. Tap a layer to see how it protects you.
              </p>

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
                          'group flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all duration-200',
                          isActive
                            ? 'border-primary bg-primary/10 shadow-sm'
                            : 'border-border bg-card hover:border-primary/40 hover:bg-card/80',
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
                          <span className="block text-sm font-semibold">{p.title}</span>
                          <span className="block text-xs uppercase tracking-wider text-muted-foreground">
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
                  className="rounded-xl border border-border bg-card p-8 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-5">
                    <ActiveIcon className="h-7 w-7" />
                  </span>
                  <h3 className="text-2xl font-semibold mb-3">{pillars[active].title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {pillars[active].body}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who we protect + values, compact */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-3xl font-bold mb-3">Who we protect</h2>
                <p className="text-muted-foreground">
                  Built for high-profile individuals, executives, brands and organisations that
                  cannot afford reputational exposure — and demand discretion at every step.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                {values.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div
                      key={v.title}
                      className="bg-card border border-border rounded-lg p-6 transition-colors hover:border-primary/40"
                    >
                      <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 text-primary mb-4">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{v.body}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">See where you stand</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Run a free reputation threat scan, or speak with our team about a protection
                strategy tailored to your profile.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/scan">Run a free scan</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/contact">Talk to our team</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;
