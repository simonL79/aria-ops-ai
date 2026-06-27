import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import SEO from '@/components/seo/SEO';
import LegalShieldEscalationWorkflow from '@/components/services/LegalShieldEscalationWorkflow';
import SectionDivider from '@/components/ui/SectionDivider';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Scale,
  FileText,
  ListChecks,
  Clock,
  AlertTriangle,
  Mail,
  ArrowRight,
  ShieldCheck,
  FileSearch,
  Users,
  Home,
  Briefcase,
  Trophy,
  Building2,
  HeartHandshake,
  Globe,
  Check,
  Smartphone,
  BrainCircuit,
} from 'lucide-react';

const supportAreas: { icon: React.ElementType; title: string; items: string[]; href: string; linkLabel: string }[] = [
  {
    icon: ShieldCheck,
    title: 'Personal Legal Protection',
    items: ['Consumer disputes', 'Debt and finance', 'Insurance issues', 'Parking appeals', 'Small claims preparation', 'Identity theft', 'Fraud guidance', 'Neighbour disputes', 'Harassment evidence organisation'],
    href: '/legal-defence-compliance#capabilities',
    linkLabel: 'Explore legal defence',
  },
  {
    icon: Home,
    title: 'Home & Property',
    items: ['Boundary disputes', 'Home improvement disputes', 'Builder disagreements', 'Landlord and tenant matters', 'Housing issues', 'Property damage claims', 'Insurance documentation'],
    href: '/legal-defence-compliance#coverage',
    linkLabel: 'Explore property legal support',
  },
  {
    icon: Briefcase,
    title: 'Employment',
    items: ['Workplace grievances', 'Disciplinary preparation', 'Redundancy guidance', 'Employment rights information', 'Settlement agreement preparation', 'Evidence organisation'],
    href: '/legal-defence-compliance#problem',
    linkLabel: 'Explore employment support',
  },
  {
    icon: Trophy,
    title: 'Sports & Entertainment',
    items: ['Athlete contracts', 'Sponsorship agreements', 'Image rights', 'Commercial partnerships', 'Management agreements', 'Intellectual property awareness', 'Dispute preparation'],
    href: '/athlete-reputation-management#capabilities',
    linkLabel: 'Explore athlete reputation',
  },
  {
    icon: Building2,
    title: 'Business Protection',
    items: ['Contract reviews', 'Supplier disputes', 'Client disputes', 'Late payment documentation', 'Terms and conditions guidance', 'HR documentation', 'Compliance checklists'],
    href: '/legal-defence-compliance#methodology',
    linkLabel: 'Explore business legal defence',
  },
  {
    icon: HeartHandshake,
    title: 'Family & Everyday Legal Matters',
    items: ['Consumer rights', 'Travel disputes', 'Warranty claims', 'School complaints', 'Local authority complaints', 'Financial disagreements'],
    href: '/legal-defence-compliance#faq',
    linkLabel: 'Explore everyday legal support',
  },
  {
    icon: Globe,
    title: 'Reputation & Digital Protection',
    items: ['Online abuse evidence packs', 'Defamation preparation', 'Privacy concerns', 'Copyright issues', 'Platform complaints', 'Digital evidence preservation'],
    href: '/reputation-threat-score#capabilities',
    linkLabel: 'Explore reputation threat scoring',
  },
];

const membershipBenefits: string[] = [
  'Unlimited AI legal guidance and explanations',
  'Unlimited document drafting',
  'Contract analysis',
  'Evidence vault with timestamps',
  'Case timelines',
  'Deadline reminders',
  'Risk assessments',
  'Letter generation',
  'Solicitor-ready case packs',
  'Secure storage of legal documents',
  'Escalation guidance when a regulated professional is likely to be needed',
];

const ecosystem: { icon: React.ElementType; name: string; body: string }[] = [
  { icon: ShieldCheck, name: 'ARIA Reputation™', body: 'Protects your name.' },
  { icon: Smartphone, name: 'ARIA Mobile™', body: 'Keeps you connected.' },
  { icon: Scale, name: 'ARIA Legal Shield™', body: 'Protects your legal position.' },
  { icon: BrainCircuit, name: 'ARIA Intelligence™', body: 'Helps you make informed decisions.' },
  { icon: Building2, name: 'ARIA Business™', body: 'Supports organisations with AI-powered operations.' },
];


const faqs: { q: string; a: string }[] = [
  {
    q: 'Is ARIA Legal Shield a law firm?',
    a: 'No. ARIA Legal Shield is not a law firm and does not replace a solicitor. It provides AI-powered legal information, document preparation and evidence organisation to help you understand your position and prepare before taking professional legal advice. When a matter needs a regulated professional, we tell you — and hand over a solicitor-ready case pack.',
  },
  {
    q: 'What does ARIA Legal Shield actually produce?',
    a: 'A plain-English legal issue summary, an evidence checklist, a timeline of events, a draft complaint or response letter, risk flags, suggested next steps, a "speak to a solicitor if…" escalation trigger, and a downloadable PDF case pack you can hand to a regulated solicitor.',
  },
  {
    q: 'Can it conduct legal proceedings or go to court for me?',
    a: 'No. In England & Wales certain activities are "reserved legal activities" — conducting litigation, rights of audience, probate, conveyancing, notarial work and administering oaths. ARIA does not perform these and does not act as a solicitor. It prepares you so a regulated firm can act faster and at lower cost.',
  },
  {
    q: 'Who is it for?',
    a: 'Consumers, tenants and employees dealing with complaints and disputes; small businesses facing unpaid invoices, bad reviews or supplier issues; and creators, public figures and athletes dealing with defamation, harassment or reputation attacks.',
  },
  {
    q: 'How does billing work?',
    a: 'Personal Shield (£29/mo), Creator Shield (£97/mo) and Business Shield (£397/mo) are billed monthly by subscription. You can manage or cancel your membership from your account portal at any time. The Crisis Pack is a one-off £99 purchase — no recurring commitment.',
  },
  {
    q: 'What is the £99 Crisis Pack?',
    a: 'The Crisis Pack is a single, one-off purchase for urgent situations. It includes an emergency evidence pack, a draft letter tailored to your facts, a timeline of events, a risk summary and a solicitor handover file — so you can move quickly when a legal issue needs immediate attention.',
  },
  {
    q: 'How does this connect to the rest of A.R.I.A™?',
    a: 'Legal Shield plugs directly into reputation monitoring, crisis response and evidence protection. When a threat surfaces, you already have the structure to act — clarity first, evidence organised, and a clean handover file if escalation is needed.',
  },
];

const produces = [
  { icon: FileSearch, title: 'Legal issue summary', body: 'Your situation explained in plain English — what it means and where you stand.' },
  { icon: ListChecks, title: 'Evidence checklist', body: 'Exactly what to gather and keep, so nothing critical is lost.' },
  { icon: Clock, title: 'Timeline of events', body: 'A structured chronology that turns scattered messages into a clear record.' },
  { icon: FileText, title: 'Draft complaint / response letter', body: 'Ready-to-send wording for complaints, responses, disputes or allegations.' },
  { icon: AlertTriangle, title: 'Risk flags', body: 'Where the real exposure is — and what to be careful about before you act.' },
  { icon: Scale, title: 'Solicitor-ready case pack', body: 'A clean PDF handover file with a "speak to a solicitor if…" escalation trigger.' },
];

const workflow: string[] = [
  'You start a guided interview',
  'ARIA builds a complete timeline',
  'Collects and organises your evidence',
  'Finds the applicable legislation',
  'Explains the law in plain English',
  'Identifies your possible options',
  'Generates documents and letters',
  'Produces a solicitor-ready case file',
  'Tells you when to speak to a regulated professional',
];

const scopeLevels: {
  tone: 'green' | 'amber' | 'red';
  badge: string;
  title: string;
  body: string;
  items: string[];
}[] = [
  {
    tone: 'green',
    badge: 'What ARIA does',
    title: 'AI Legal Intelligence',
    body: 'ARIA asks questions, then helps you understand and prepare — you stay in control of every decision.',
    items: [
      'Explains the relevant law',
      'Points to applicable legislation',
      'Organises your evidence',
      'Drafts letters from your facts',
      'Builds timelines and chronologies',
      'Generates court forms from your information',
      'Suggests possible options',
      'Produces a solicitor-ready case file',
    ],
  },
  {
    tone: 'amber',
    badge: 'Where we draw the line',
    title: 'Personalised legal advice',
    body: 'ARIA does not tell you what to decide. It informs — it does not direct.',
    items: [
      'No "accept this settlement"',
      'No "reject this contract"',
      'No "this clause is unenforceable"',
      'No "you have a 95% chance of winning"',
    ],
  },
  {
    tone: 'red',
    badge: 'Not what we do',
    title: 'Regulated legal practice',
    body: 'These are reserved legal activities for authorised firms — ARIA hands over to a regulated professional instead.',
    items: [
      'Representing clients',
      'Filing proceedings on your behalf',
      'Negotiating legal settlements',
      'Appearing before courts or tribunals',
      'Holding itself out as a law firm',
    ],
  },
];

const packages = [
  {
    name: 'Personal Shield',
    price: '£29',
    cadence: '/month',
    for: 'Consumers, tenants, employees, online abuse, complaints and disputes.',
    icon: ShieldCheck,
    featured: false,
  },
  {
    name: 'Creator Shield',
    price: '£97',
    cadence: '/month',
    for: 'Influencers, fighters and public figures — reputation attacks, defamation prep, takedowns and harassment evidence.',
    icon: Users,
    featured: true,
  },
  {
    name: 'Business Shield',
    price: '£397',
    cadence: '/month',
    for: 'Small businesses — unpaid invoices, bad reviews, supplier issues, contracts and complaints.',
    icon: Scale,
    featured: false,
  },
  {
    name: 'Crisis Pack',
    price: '£99',
    cadence: 'one-off',
    for: 'Emergency evidence pack, letter draft, timeline, risk summary and solicitor handover file.',
    icon: AlertTriangle,
    featured: false,
  },
];

const LegalShieldPage = () => {
  const hero = useScrollReveal(0.1);
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'ARIA Legal Shield',
    serviceType: 'Legal information & document preparation',
    provider: { '@type': 'Organization', name: 'A.R.I.A™', url: 'https://www.ariaops.co.uk/' },
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    description:
      'AI-powered legal protection, evidence building and solicitor-ready case preparation for individuals, creators and businesses. Not a law firm; does not replace a solicitor.',
    offers: packages.map((p) => ({
      '@type': 'Offer',
      name: p.name,
      price: p.price.replace('£', ''),
      priceCurrency: 'GBP',
      description: p.for,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ariaops.co.uk/' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.ariaops.co.uk/services/legal-shield' },
      { '@type': 'ListItem', position: 3, name: 'ARIA Legal Shield' },
    ],
  };

  return (
    <PublicLayout>
      <SEO
        title="ARIA Legal Shield™ — AI-Powered Legal Support Before You Need a Solicitor"
        description="AI-powered legal information, document preparation and case organisation for individuals, creators and businesses. Understand your rights, organise evidence, and approach solicitors fully prepared. Not a law firm."
        path="/services/legal-shield"
        jsonLd={[faqJsonLd, serviceJsonLd, breadcrumbJsonLd]}
      />

      <article className="text-foreground">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.10),transparent_60%)]" aria-hidden />
          <div
            ref={hero.ref}
            className={`container relative mx-auto px-6 pt-28 pb-12 max-w-4xl transition-all duration-700 ${
              hero.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">ARIA Legal Shield™ — Your AI Legal Protection Platform</span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold mt-5 mb-6 leading-tight text-shadow">
              Make legal understanding accessible to everyone
            </h1>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                At ARIA, we believe that understanding your legal position should never depend solely
                on your ability to afford expensive legal fees.
              </p>
              <p>
                Every day, individuals, families, athletes, creators, homeowners and businesses face
                legal questions that leave them uncertain about their rights, responsibilities and the
                best course of action. For many, the first obstacle isn't the legal issue itself — it's
                the cost of knowing where they stand.
              </p>
              <p>
                That's why we created ARIA Legal Shield™ — an AI-powered legal intelligence and case
                preparation platform designed to help people understand complex legal matters, organise
                evidence, prepare professional documentation and make informed decisions before seeking
                regulated legal representation where necessary.
              </p>
              <p>
                Whether you're negotiating a contract, dealing with a dispute, protecting your
                reputation, resolving a consumer issue, challenging a parking charge, navigating
                employment concerns, managing a property dispute, preparing a sports management
                agreement or understanding business obligations, ARIA Legal Shield™ provides intelligent
                guidance, structured preparation and practical support.
              </p>
              <p>
                Rather than replacing legal professionals, ARIA Legal Shield™ helps users become better
                prepared — saving time, reducing unnecessary costs and ensuring that when specialist
                legal advice is required, they approach it with organised evidence, clear timelines and
                professionally prepared documentation.
              </p>
              <p className="text-foreground font-medium">
                Because confidence should begin with clarity — not uncertainty.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/services/legal-shield/intake"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-7 py-3.5 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
              >
                Start your guided intake
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Button asChild size="lg" variant="outline">
                <a href="#packages">See packages</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Positioning notice */}
        <section className="container mx-auto px-6 pb-4 max-w-4xl">
          <div className="bg-card border border-primary/40 rounded-lg p-6">
            <p className="text-muted-foreground leading-relaxed">
              ARIA Legal Shield™ provides AI-powered legal information, document preparation and
              case organisation. It is not a law firm and does not provide regulated legal services
              or act as a substitute for independent legal advice. Where appropriate, you will be
              encouraged to seek advice from a qualified legal professional.
            </p>
          </div>
        </section>

        {/* What it helps you do */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">What ARIA Legal Shield helps you do</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Understand your rights in plain English',
              'Build an evidence timeline',
              'Draft complaint letters',
              'Prepare solicitor-ready case packs',
              'Respond to threats, reviews, disputes or allegations',
              'Track deadlines and next steps',
              'Escalate to a regulated solicitor when needed',
            ].map((t) => (
              <div key={t} className="flex items-start gap-3 bg-card border border-border rounded-lg px-4 py-3 text-muted-foreground">
                <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </section>

        {/* What the product produces */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">What the product produces</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {produces.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-card border border-border rounded-lg p-6">
                <Icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works — workflow */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <p className="text-sm uppercase tracking-widest text-primary mb-3">How it works</p>
          <h2 className="text-3xl font-bold mb-4">From scattered facts to a solicitor-ready case file</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-3xl">
            ARIA handles everything <span className="text-foreground font-medium">before</span> you
            instruct a solicitor — the preparation that normally takes hours, done in minutes. You
            stay in control of every decision.
          </p>
          <ol className="space-y-3">
            {workflow.map((step, i) => (
              <li key={step} className="flex items-start gap-4 bg-card border border-border rounded-lg px-5 py-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-sm">
                  {i + 1}
                </span>
                <span className="text-muted-foreground pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Escalation workflow */}
        <section className="container mx-auto px-6 py-12 max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-widest text-primary mb-3">When the issue goes further</p>
            <h2 className="text-3xl font-bold mb-4">From Legal Shield to Legal Defence & Compliance</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
              Most matters stay inside Legal Shield: preparation, guidance and solicitor-ready packs.
              When a case involves defamation, unlawful personal data, platform abuse or regulatory
              exposure, it escalates into the statutory layer without losing context.
            </p>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-card p-6 md:p-10 mb-12">
            <LegalShieldEscalationWorkflow />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Triage inside Legal Shield',
                body: 'After the intake and case pack are built, ARIA flags whether the issue is a routine dispute or needs statutory force — takedown, defamation, GDPR or regulator action.',
              },
              {
                step: '02',
                title: 'Evidence transfers intact',
                body: 'The timeline, screenshots, documents, hash records and risk flags move into Legal Defence & Compliance as a single, auditable file — no rebuilding, no lost context.',
              },
              {
                step: '03',
                title: 'Statutory action begins',
                body: 'Legal Defence files GDPR Article 17 requests, dispatches pre-action/C&D letters, escalates to platforms and data brokers, and opens ICO or regulator channels where needed.',
              },
              {
                step: '04',
                title: 'Parallel suppression runs',
                body: 'While legal action removes what can be removed at source, SEO suppression and narrative defence push down anything that remains visible — closing both the legal and visibility surfaces.',
              },
              {
                step: '05',
                title: 'Compliance-grade close',
                body: 'Every action is logged to a SOC II / ISO 27001-aligned audit trail. Boards, principals or instructed counsel receive a signed, chain-of-custody report on request.',
              },
              {
                step: '06',
                title: 'Loop back to protection',
                body: 'Once resolved, the outcome feeds back into your ARIA record — so future monitoring, threat scoring and case files already know what happened and what worked.',
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="bg-card border border-border rounded-lg p-6">
                <span className="text-xs uppercase tracking-wider text-primary font-semibold">{step}</span>
                <h3 className="text-lg font-bold mt-2 mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/legal-defence-compliance">
                Explore Legal Defence & Compliance <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Scope — what we do and don't do */}
        <section className="container mx-auto px-6 py-12 max-w-5xl">
          <h2 className="text-3xl font-bold mb-2">AI Legal Intelligence — not an "AI lawyer"</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            We are deliberate about scope. ARIA informs and prepares; it never directs your decisions
            or acts as a regulated legal practice. That clear boundary is what keeps you protected.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {scopeLevels.map(({ tone, badge, title, body, items }) => {
              const accent =
                tone === 'green'
                  ? 'border-primary/50'
                  : tone === 'amber'
                  ? 'border-amber-500/40'
                  : 'border-destructive/40';
              const dot =
                tone === 'green'
                  ? 'bg-primary'
                  : tone === 'amber'
                  ? 'bg-amber-500'
                  : 'bg-destructive';
              return (
                <div key={title} className={`bg-card border ${accent} rounded-lg p-6 flex flex-col`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">{badge}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{body}</p>
                  <ul className="space-y-1.5 mt-auto">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Solicitor network */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="rounded-2xl border border-primary/40 bg-card p-8 md:p-12">
            <p className="text-sm uppercase tracking-widest text-primary mb-3">Partner solicitor network</p>
            <h2 className="text-3xl font-bold mb-4">When you do need a solicitor, they start hours ahead</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-3xl">
              Instead of handing a solicitor 400 random emails, ARIA hands them an organised case pack —
              so their time goes on legal analysis, strategy and representation, not admin.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Timeline of events',
                'Evidence, indexed and timestamped',
                'Draft letters',
                'Contract summary',
                'Relevant legislation',
                'Witness list',
                'Supporting documents',
                'Plain-English issue summary',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-muted-foreground">
                  <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Areas we support */}
        <section className="container mx-auto px-6 py-12 max-w-5xl">
          <h2 className="text-3xl font-bold mb-2">Areas ARIA Legal Shield™ can support</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            From everyday consumer issues to complex commercial matters — intelligent guidance and
            structured preparation across the situations that matter most.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportAreas.map(({ icon: Icon, title, items, href, linkLabel }) => (
              <div key={title} className="bg-card border border-border rounded-lg p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="h-6 w-6 text-primary shrink-0" />
                  <h3 className="text-lg font-bold">{title}</h3>
                </div>
                <ul className="space-y-1.5 mb-6">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="mt-auto w-full group">
                  <Link to={href}>
                    {linkLabel}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Membership vision */}
        <section className="container mx-auto px-6 py-12 max-w-5xl">
          <div className="rounded-2xl border border-primary/40 bg-card p-8 md:p-12">
            <p className="text-sm uppercase tracking-widest text-primary mb-3">Always-on legal protection</p>
            <h2 className="text-3xl font-bold mb-4">Not "AI legal advice" — continuous legal protection</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-3xl">
              ARIA Legal Shield™ shifts the value from asking an AI a one-off legal question to having
              an always-on legal support system. One membership keeps your rights, evidence and
              documents organised — ready the moment you need them.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 mb-8">
              <span className="text-5xl font-bold">£29</span>
              <span className="text-muted-foreground mb-1">/ month — membership</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {membershipBenefits.map((b) => (
                <div key={b} className="flex items-start gap-3 text-muted-foreground">
                  <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/services/legal-shield/intake">
                  Start your guided intake <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>


        <section id="packages" className="container mx-auto px-6 py-12 max-w-4xl scroll-mt-24">
          <h2 className="text-3xl font-bold mb-2">Packages</h2>
          <p className="text-muted-foreground mb-8">Choose the level of protection that fits your situation.</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {packages.map(({ icon: Icon, name, price, cadence, for: forWho, featured }) => (
              <div
                key={name}
                className={`relative rounded-lg p-6 border ${
                  featured ? 'border-primary bg-card' : 'border-border bg-card'
                }`}
              >
                {featured && (
                  <span className="absolute -top-3 left-6 text-xs uppercase tracking-wider bg-primary text-primary-foreground px-3 py-1 rounded-full">
                    Most popular
                  </span>
                )}
                <Icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-1">{name}</h3>
                <p className="mb-3">
                  <span className="text-3xl font-bold">{price}</span>
                  <span className="text-muted-foreground"> {cadence}</span>
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">{forWho}</p>
                <Button asChild variant={featured ? 'default' : 'outline'} className="w-full">
                  <Link to="/services/legal-shield/intake">Get {name}</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Reserved activities note */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Built to launch faster — and safer</h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              In England & Wales, only certain activities are{' '}
              <strong className="text-foreground">reserved legal activities</strong> — conducting
              litigation, rights of audience, probate, conveyancing, notarial work and administering
              oaths. ARIA does not perform these and does not act as a solicitor or conduct legal
              proceedings unless partnered with a regulated firm.
            </p>
            <p>
              The SRA has authorised AI-driven law firms, but those are regulated legal practices.
              ARIA Legal Shield launches as a legal information and protection layer — giving you
              clarity, structure and preparation, so if you do need legal advice, you are ready.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 py-16 max-w-4xl">
          <div className="bg-card border border-primary/40 rounded-lg p-10 text-center">
            <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Take control before it escalates.</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Get clarity, organise your evidence and prepare a solicitor-ready case pack — before
              legal costs spiral.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/services/legal-shield/intake">
                Start your guided intake <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`q-${i}`}>
                <AccordionTrigger className="text-left text-lg">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* ARIA ecosystem */}
        <section className="container mx-auto px-6 py-12 max-w-5xl">
          <h2 className="text-3xl font-bold mb-2">Part of the wider ARIA ecosystem</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Legal Shield is one layer of an integrated platform built to protect every part of your
            personal and professional life.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystem.map(({ icon: Icon, name, body }) => (
              <div
                key={name}
                className={`bg-card border rounded-lg p-6 ${
                  name === 'ARIA Legal Shield™' ? 'border-primary' : 'border-border'
                }`}
              >
                <Icon className="h-7 w-7 text-primary mb-3" />
                <h3 className="text-lg font-bold mb-1">{name}</h3>
                <p className="text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>



        {/* Related */}
        <section className="container mx-auto px-6 pb-20 max-w-4xl">
          <h2 className="text-xl font-bold mb-4">Related services</h2>
          <ul className="space-y-2 text-primary">
            <li><Link to="/services/brand-protection" className="hover:underline">→ Brand protection</Link></li>
            <li><Link to="/legal-defence-compliance" className="hover:underline">→ Legal defence & compliance</Link></li>
            <li><Link to="/crisis-reputation-management" className="hover:underline">→ Crisis reputation management</Link></li>
          </ul>
        </section>
      </article>
    </PublicLayout>
  );
};

export default LegalShieldPage;
