import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, Gavel, Search, Eye, Lock } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import SEO from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';

const pillars = [
  {
    icon: Brain,
    title: 'AI Reputation Intelligence',
    body: 'Continuous monitoring across news, search engines, social platforms and large language models — surfacing emerging narrative risk before it escalates.',
  },
  {
    icon: Eye,
    title: 'Threat Detection',
    body: 'Live OSINT scanning with severity scoring identifies hostile content, coordinated campaigns and reputational threats as they form.',
  },
  {
    icon: Gavel,
    title: 'Legal Response',
    body: 'ARIA Legal Shield™ organises evidence, drafts documentation and assembles solicitor-ready case files when a threat crosses into legal exposure.',
  },
  {
    icon: Search,
    title: 'Search Positioning',
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
    body: 'Built for high-profile clients who require confidentiality, security and complete control over their digital narrative.',
  },
  {
    icon: Brain,
    title: 'Intelligence over noise',
    body: 'AI does the watching at scale; human expertise decides what matters and how to respond.',
  },
];

const AboutPage = () => {
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
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <section className="py-20 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
                About the platform
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Reputation intelligence, built for the AI era
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                A.R.I.A™ (Adaptive Reputation Intelligence &amp; Analysis) combines advanced
                artificial intelligence with strategic human expertise to monitor, protect and
                defend reputation — and to prepare solicitor-ready legal responses when it matters
                most.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                Reputation and legal position are two of the most valuable assets in the modern
                world — and the most exposed. News cycles, search engines, social platforms and now
                generative AI form opinions about people and organisations faster than any individual
                can track.
              </p>
              <p>
                A.R.I.A™ was built to close that gap. The platform delivers real-time intelligence on
                emerging reputation risks across the global digital ecosystem, and when a threat
                crosses into legal exposure, ARIA Legal Shield™ turns scattered evidence into a
                structured case file ready for regulated legal advice.
              </p>
              <p className="text-foreground font-medium">
                Our mission is simple: to ensure your digital narrative and legal position remain in
                your control — protecting what matters most in the age of information.
              </p>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-16 bg-card/40 border-y border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">An integrated defence system</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {pillars.map((p) => (
                  <div
                    key={p.title}
                    className="bg-card border border-border rounded-lg p-8 flex gap-5"
                  >
                    <div className="shrink-0">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                        <p.icon className="h-6 w-6" />
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                      <p className="text-muted-foreground">{p.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Who it's for + Values */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Who we protect</h2>
              <p className="text-lg text-muted-foreground mb-12">
                A.R.I.A™ is designed for high-profile individuals, executives, public figures, brands
                and organisations that cannot afford reputational exposure — and who require
                discretion, security and complete control over their digital narrative.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {values.map((v) => (
                  <div key={v.title} className="bg-card border border-border rounded-lg p-6">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 text-primary mb-4">
                      <v.icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{v.body}</p>
                  </div>
                ))}
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
