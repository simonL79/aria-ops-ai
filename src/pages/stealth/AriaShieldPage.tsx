import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import SEO from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, XCircle, type LucideIcon } from 'lucide-react';
import {
  Radar,
  BellRing,
  Archive,
  ClipboardCheck,
  FileEdit,
  Zap,
  Scale,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import ScrollSpy from '@/components/sections/ScrollSpy';
import SectionDivider from '@/components/ui/SectionDivider';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import CinematicImage from '@/components/ui/CinematicImage';
import LeadCaptureSection, { type LeadCaptureConfig } from '@/components/sections/LeadCaptureSection';
import ogImage from '@/assets/og/aria-shield.png';

const SITE = 'https://www.ariaops.co.uk';

const leadCapture: LeadCaptureConfig = {
  eyebrow: 'Protect your name before the damage is done',
  heading: 'Apply for A.R.I.A Shield',
  subtext:
    'Tell us about your profile, your concerns and the surfaces that matter to you. A Shield operator reviews every application and responds with a protection plan tailored to your risk.',
  urgencyNote: 'Facing an active attack now? Flag it as breaking below and we prioritise your application.',
  submitLabel: 'Apply for Shield',
  sourceTag: 'A.R.I.A Shield lead — /aria-shield',
};

const capabilities: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Radar, title: '24/7 threat monitoring', body: 'Continuous monitoring across news, search, social media, forums and emerging narratives — so threats are found before they find you.' },
  { icon: BellRing, title: 'Early-warning alerts', body: 'Alerts the moment harmful content, allegations or coordinated attacks begin gaining traction — not after they have already shaped the story.' },
  { icon: Archive, title: 'Evidence Vault', body: 'Automatic capture of URLs, screenshots, timestamps, engagement data and publication history — preservation that holds up when it matters.' },
  { icon: ClipboardCheck, title: 'Risk assessment', body: 'Every threat classified by credibility, reach, velocity and potential commercial damage — so response is proportionate and noise is filtered out.' },
  { icon: FileEdit, title: 'Pre-publication protection', body: 'Review of sensitive statements, interviews, articles and campaigns before they go live — catching the line that becomes tomorrow\'s headline.' },
  { icon: Zap, title: 'Rapid-response strategy', body: 'Holding statements, platform reports, publisher contact and stakeholder communications — activated in hours, not days.' },
  { icon: Scale, title: 'Legal escalation', body: 'Access to an approved network of media, defamation, privacy and intellectual-property lawyers — retained directly by you to preserve privilege.' },
  { icon: TrendingUp, title: 'Search recovery', body: 'Authority-building and content infrastructure that prevents damaging narratives from dominating Google and AI search results.' },
  { icon: RefreshCw, title: 'Post-crisis rehabilitation', body: 'Rebuilding public confidence, commercial relationships and search visibility after the immediate threat has passed.' },
];

const methodology: { step: string; title: string; body: string }[] = [
  { step: '01', title: 'Shield Onboarding', body: 'A.R.I.A maps the client\'s identity, businesses, aliases, key relationships, historic risks and priority search terms — building a complete picture of what needs protecting.' },
  { step: '02', title: 'Continuous Protection', body: 'The system monitors for unusual mentions, negative sentiment, misleading claims, impersonation and coordinated activity across every relevant surface.' },
  { step: '03', title: 'Threat Verification', body: 'A.R.I.A distinguishes genuine reputational risks from low-value criticism that should not be amplified — protecting you from amplifying the wrong thing.' },
  { step: '04', title: 'Shield Response', body: 'Evidence is preserved and the appropriate technical, communications, platform or legal response is activated — measured, evidence-backed, and fast.' },
  { step: '05', title: 'Recovery and Suppression', body: 'A.R.I.A strengthens authoritative content and trusted digital assets around the client, so damaging narratives lose their grip on search and AI surfaces.' },
];

const membershipTiers = [
  {
    name: 'Shield Essential',
    client: 'Emerging creators, athletes and professionals',
    price: '£299–£499/month',
    features: [
      '24/7 threat monitoring across core surfaces',
      'Early-warning alerts on mentions and sentiment shifts',
      'Evidence Vault with automated capture',
      'Risk assessment and monthly threat report',
      'Email and chat operator support',
    ],
  },
  {
    name: 'Shield Professional',
    client: 'Established talent, executives and brands',
    price: '£995–£1,500/month',
    features: [
      'Everything in Essential, plus:',
      'Pre-publication review of statements and campaigns',
      'Rapid-response strategy with named operator lead',
      'Platform escalation routes (trust & safety)',
      'Search recovery and authority-building programme',
      'Quarterly stakeholder reputation briefing',
    ],
    featured: true,
  },
  {
    name: 'Shield Elite',
    client: 'High-profile individuals and organisations',
    price: '£2,500+/month',
    features: [
      'Everything in Professional, plus:',
      'Dedicated operator and crisis-comms lead',
      'Full legal escalation network access',
      'Post-crisis rehabilitation programme',
      'Executive and family identity protection',
      'Bespoke monitoring footprint and reporting',
    ],
  },
  {
    name: 'Shield Event',
    client: 'One-off crisis or active attack',
    price: 'Assessed individually',
    features: [
      'Immediate crisis activation',
      'First-72-hours response playbook',
      'Evidence preservation and platform escalation',
      'Stakeholder briefing pack',
      'Defined engagement scope and timeline',
    ],
  },
];

const faqs = [
  { q: 'What is A.R.I.A Shield?', a: 'A.R.I.A Shield is a membership-based reputation-protection service that combines AI monitoring, reputation intelligence, crisis response and access to specialist legal support. Unlike services that only react after a lawsuit arrives, Shield protects public figures, athletes, creators, executives and brands across the entire threat cycle — before, during and after a reputational threat.' },
  { q: 'How is Shield different from Substack Defender?', a: 'Substack Defender gives qualifying publishers pre-publication review, legal advice and financial support when facing defamation, copyright or trademark claims. A.R.I.A Shield takes the strongest parts of that model — early intervention, legal support, evidence preservation — and builds a far broader service around them, covering the full threat lifecycle for any public-facing individual or brand, not just platform publishers.' },
  { q: 'Does Shield pay my legal fees?', a: 'No. Legal fees are initially separate or subject to a clearly defined discretionary contribution. Guaranteeing to pay legal defence costs in return for membership fees could be treated as insurance activity, which is regulated in the UK by the FCA. Once Shield has sufficient membership volume and claims data, A.R.I.A could introduce formal legal-expenses insurance through an FCA-authorised insurance partner.' },
  { q: 'Do I get my own lawyer through Shield?', a: 'Lawyers are retained directly by you, the client, when legal advice is needed — not by A.R.I.A. This preserves legal professional privilege and avoids A.R.I.A presenting itself as a law firm. A.R.I.A coordinates with your lawyer and can introduce specialist UK media, defamation, privacy and IP solicitors from its approved network if you do not already have representation.' },
  { q: 'What does the Evidence Vault capture?', a: 'The Evidence Vault automatically captures URLs, screenshots, timestamps, engagement data and publication history for every flagged threat. This preservation is critical for platform escalations, legal pre-action, and demonstrating the trajectory of a coordinated campaign — and it happens automatically, before content is edited or deleted.' },
  { q: 'How quickly can Shield respond to a live threat?', a: 'Shield Event activations and Shield Elite members receive immediate crisis response. A named operator lead is on the line within hours, the first-72-hours response playbook is activated, evidence preservation begins immediately, and the appropriate communications, platform and legal responses are deployed in parallel.' },
  { q: 'Can Shield help before anything goes wrong?', a: 'Yes — pre-publication protection is a core Shield capability. Sensitive statements, interviews, articles and campaigns are reviewed before they go live, catching the line that could become tomorrow\'s headline. Combined with continuous monitoring, Shield is designed to intervene before damage is done.' },
  { q: 'What happens after a crisis is contained?', a: 'Shield moves into post-crisis rehabilitation: rebuilding public confidence, commercial relationships and search visibility. A.R.I.A strengthens authoritative content and trusted digital assets around you so damaging narratives lose their grip on Google and AI search results, and monitors for resurfacing so the same story cannot return through a different door.' },
];

const AriaShieldPage: React.FC = () => {
  const hero = useScrollReveal(0.1);

  const jsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'A.R.I.A Shield',
        provider: { '@type': 'Organization', name: 'A.R.I.A™', url: `${SITE}/` },
        areaServed: 'Worldwide',
        serviceType: 'Reputation protection membership',
        description:
          'A membership-based protection service combining AI monitoring, reputation intelligence, crisis response and access to specialist legal support — protecting public figures, athletes, creators, executives and brands across the entire threat cycle.',
        url: `${SITE}/aria-shield`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
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
          { '@type': 'ListItem', position: 3, name: 'A.R.I.A Shield' },
        ],
      },
    ],
    [],
  );

  const scrollSections = useMemo(
    () => [
      { id: 'problem', label: 'The gap' },
      { id: 'capabilities', label: 'Protection' },
      { id: 'membership', label: 'Membership' },
      { id: 'methodology', label: 'How it works' },
      { id: 'structure', label: 'Structure' },
      { id: 'comparison', label: 'Comparison' },
      { id: 'faq', label: 'FAQ' },
      { id: 'get-help', label: 'Apply' },
    ],
    [],
  );

  return (
    <PublicLayout>
      <SEO
        title="A.R.I.A Shield: Reputation Protection Membership | A.R.I.A™"
        description="Membership-based reputation protection: AI monitoring, evidence vault, crisis response and specialist legal support — before, during and after a threat."
        path="/aria-shield"
        ogType="website"
        image={ogImage}
        imageWidth={1200}
        imageHeight={630}
        imageType="image/png"
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
              Reputation protected. Evidence secured. Response ready.
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold mt-5 mb-6 leading-tight text-shadow">
              A.R.I.A Shield
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              A membership-based protection service combining AI monitoring, reputation
              intelligence, crisis response and access to specialist legal support — protecting
              you before, during and after a reputational threat.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-10">
              <a
                href="#get-help"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-7 py-3.5 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
              >
                Apply for Shield
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
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
              When your name is your business, reputation protection cannot begin after the
              damage is done.
            </p>
          </blockquote>
        </section>

        <ScrollSpy sections={scrollSections} />

        {/* Problem */}
        <section id="problem" data-scrollspy-section tabIndex={-1} className="container mx-auto px-6 py-20 max-w-4xl scroll-mt-24">
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/70">The gap</span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold mt-4 mb-6 leading-tight">
            Existing protection starts after the lawsuit arrives.
          </h2>
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Services like Substack Defender give qualifying publishers pre-publication review,
              legal advice and financial support when facing defamation, copyright or trademark
              claims. That model works — but only for a narrow group, and only once a legal threat
              has already materialised.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A.R.I.A Shield takes the strongest parts of that approach — early intervention,
              evidence preservation, access to specialist legal support — and builds a far broader
              reputation-protection service around them. It protects public figures, athletes,
              creators, executives and brands across the entire threat cycle: monitoring before
              anything breaks, responding when it does, and rebuilding after it passes.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Most reputational damage is preventable. The problem is that protection typically
              begins too late — after a story has spread, after AI search has summarised it as
              fact, and after the narrative has hardened. Shield is built to close that gap.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-6 max-w-5xl"><SectionDivider /></div>

        {/* Capabilities */}
        <section id="capabilities" data-scrollspy-section tabIndex={-1} className="container mx-auto px-6 py-20 max-w-6xl scroll-mt-24">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">Protection</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold mt-4 leading-tight">What Shield provides</h2>
            <p className="text-muted-foreground text-lg mt-5 leading-relaxed">
              Nine protection layers covering the full threat cycle — from continuous monitoring
              to post-crisis recovery.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {capabilities.map(({ icon: Icon, title, body }) => (
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

        {/* Membership tiers */}
        <section id="membership" data-scrollspy-section tabIndex={-1} className="container mx-auto px-6 py-20 max-w-6xl scroll-mt-24">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">Membership</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold mt-4 leading-tight">Membership structure</h2>
            <p className="text-muted-foreground text-lg mt-5 leading-relaxed">
              Protection scaled to your profile and exposure. Legal fees are separate or subject
              to a clearly defined discretionary contribution.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipTiers.map((tier) => (
              <div
                key={tier.name}
                className={`glass-card p-7 flex flex-col transition-all duration-300 hover:border-primary/30 ${
                  tier.featured ? 'border-primary/40 ring-1 ring-primary/20' : ''
                }`}
              >
                {tier.featured && (
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-3">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-xl font-semibold mb-1">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{tier.client}</p>
                <p className="font-display text-lg font-semibold text-primary mb-5">{tier.price}</p>
                <ul className="space-y-2 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#get-help"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-medium px-4 py-2.5 text-sm transition-all duration-300"
                >
                  Apply
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-10 max-w-3xl mx-auto leading-relaxed">
            Legal fees are initially separate or subject to a clearly defined discretionary
            contribution. Guaranteeing legal defence costs in return for membership fees could be
            treated as insurance activity, regulated in the UK by the FCA. Once Shield has
            sufficient volume and claims data, A.R.I.A could introduce formal legal-expenses
            insurance through an FCA-authorised partner.
          </p>
        </section>

        <div className="container mx-auto px-6 max-w-5xl"><SectionDivider /></div>

        {/* Methodology / How it works */}
        <section id="methodology" data-scrollspy-section tabIndex={-1} className="container mx-auto px-6 py-20 max-w-5xl scroll-mt-24">
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">How it works</span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold mt-4 mb-12 leading-tight">The Shield cycle</h2>
          <ol className="space-y-6">
            {methodology.map((m) => (
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

        {/* Launch structure */}
        <section id="structure" data-scrollspy-section tabIndex={-1} className="container mx-auto px-6 py-20 max-w-5xl scroll-mt-24">
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">Structure</span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold mt-4 mb-6 leading-tight">
            Three connected entities
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-3xl leading-relaxed">
            Shield is delivered through a deliberate separation of roles — keeping intelligence,
            legal advice and insurance distinct so privilege and regulatory boundaries are
            preserved.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-8">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-5">
                <Radar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">A.R.I.A</h3>
              <p className="text-muted-foreground leading-relaxed">
                Intelligence, monitoring, evidence preservation, communications and search
                recovery. The operational core of Shield.
              </p>
            </div>
            <div className="glass-card p-8">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-5">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Partner law firm</h3>
              <p className="text-muted-foreground leading-relaxed">
                Independent legal advice, pre-publication review and case representation. Retained
                directly by the client to preserve legal privilege.
              </p>
            </div>
            <div className="glass-card p-8">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-5">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Insurance partner</h3>
              <p className="text-muted-foreground leading-relaxed">
                Introduced later for formal legal-expenses cover, through an FCA-authorised
                insurance partner, once volume and claims data support it.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-8 max-w-3xl leading-relaxed">
            The lawyers are retained directly by the client when legal advice is needed, preserving
            legal privilege and avoiding A.R.I.A presenting itself as a law firm.
          </p>
        </section>

        <div className="container mx-auto px-6 max-w-5xl"><SectionDivider /></div>

        {/* Comparison */}
        <section id="comparison" data-scrollspy-section tabIndex={-1} className="container mx-auto px-6 py-20 max-w-5xl scroll-mt-24">
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">Comparison</span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold mt-4 mb-6 leading-tight">
            A.R.I.A Shield vs traditional reputation management
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-3xl leading-relaxed">
            Most reputation services start after the damage is done. Shield starts before — and
            stays through recovery.
          </p>
          <div className="overflow-x-auto glass-card p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="px-4 py-4 text-sm font-semibold">Capability</th>
                  <th className="px-4 py-4 text-sm font-semibold text-muted-foreground">Traditional reputation management</th>
                  <th className="px-4 py-4 text-sm font-semibold text-primary">A.R.I.A Shield</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Continuous 24/7 threat monitoring', competitor: false, aria: true },
                  { feature: 'Early-warning alerts before damage spreads', competitor: 'Rare', aria: true },
                  { feature: 'Automated evidence preservation (Evidence Vault)', competitor: false, aria: true },
                  { feature: 'Risk assessment with credibility/velocity scoring', competitor: 'Limited', aria: true },
                  { feature: 'Pre-publication protection', competitor: false, aria: true },
                  { feature: 'Rapid-response crisis strategy', competitor: 'After the fact', aria: true },
                  { feature: 'Access to specialist legal network', competitor: 'Via referral', aria: true },
                  { feature: 'Search recovery (Google + AI search)', competitor: 'Limited', aria: true },
                  { feature: 'Post-crisis rehabilitation', competitor: false, aria: true },
                  { feature: 'Membership pricing with clear tiers', competitor: 'Project-based', aria: true },
                ].map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-border/40 ${i % 2 === 1 ? 'bg-muted/5' : ''}`}
                  >
                    <td className="px-4 py-4 text-sm">{row.feature}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {typeof row.competitor === 'boolean' ? (
                        row.competitor ? (
                          <CheckCircle2 className="h-5 w-5 text-muted-foreground/60" aria-label="Yes" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground/30" aria-label="No" />
                        )
                      ) : (
                        row.competitor
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {typeof row.aria === 'boolean' ? (
                        row.aria ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" aria-label="Yes" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground/50" aria-label="No" />
                        )
                      ) : (
                        <span className="text-primary font-medium">{row.aria}</span>
                      )}
                    </td>
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
          <h2 className="font-display text-3xl md:text-5xl font-semibold mt-4 mb-10 leading-tight">
            A.R.I.A Shield — frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="glass-card p-6 group">
                <summary className="font-display text-lg font-semibold cursor-pointer list-none flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-primary text-2xl shrink-0 transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="text-muted-foreground leading-relaxed mt-4">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="container mx-auto px-6 max-w-5xl"><SectionDivider /></div>

        {/* Lead capture */}
        <section id="get-help" data-scrollspy-section tabIndex={-1} className="container mx-auto px-6 py-20 max-w-3xl scroll-mt-24">
          <LeadCaptureSection cfg={leadCapture} />
        </section>

        {/* Related links */}
        <section className="container mx-auto px-6 py-20 max-w-5xl">
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">Explore</span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mt-4 mb-10 leading-tight">
            Related protection services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { to: '/crisis-reputation-management', label: 'Crisis PR & Reputation Management' },
              { to: '/executive-reputation-protection', label: 'Executive Reputation Protection' },
              { to: '/founder-reputation-protection', label: 'Founder Reputation Protection' },
              { to: '/athlete-reputation-management', label: 'Athlete Reputation Management' },
              { to: '/corporate-reputation-management', label: 'Corporate Reputation Management' },
              { to: '/services/legal-shield', label: 'Legal Shield' },
              { to: '/services/brand-protection', label: 'Brand Protection' },
              { to: '/negative-search-result-suppression', label: 'Negative Search Result Suppression' },
              { to: '/legal-defence-compliance', label: 'Legal Defence & Compliance' },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="group glass-card p-5 transition-all duration-300 hover:border-primary/30 flex items-center justify-between gap-3"
              >
                <span className="text-sm font-medium">{l.label}</span>
                <ArrowRight className="h-4 w-4 text-primary shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>
      </article>
    </PublicLayout>
  );
};

export default AriaShieldPage;
