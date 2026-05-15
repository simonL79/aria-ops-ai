import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import SEO from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ShieldAlert, FileSearch, Gavel, ArrowRight } from 'lucide-react';

const faqs: { q: string; a: string }[] = [
  {
    q: 'Is online impersonation a crime in the UK?',
    a: 'It can be. There is no single "impersonation" offence, but the conduct usually triggers one or more of: fraud by false representation (Fraud Act 2006, s.2) where the impersonator gains or causes loss; harassment (Protection from Harassment Act 1997); malicious communications (Malicious Communications Act 1988); or computer misuse (Computer Misuse Act 1990) where accounts are accessed or created using your personal data.',
  },
  {
    q: 'How do I prove someone is impersonating me online?',
    a: 'Build an evidence file before reporting: full-page screenshots with visible URL and timestamp, archive copies via the Wayback Machine or archive.today, the impersonator\'s profile URL, dates of first appearance, and copies of any messages sent to your contacts. UK police and platforms both refuse cases with weak evidence — preparation is the difference between action and dismissal.',
  },
  {
    q: 'Will Meta, X, LinkedIn or TikTok actually remove an impersonation account?',
    a: 'Yes, when the report is correctly framed. Each platform has a dedicated impersonation form (not the generic "report account" button) that requires government-issued ID matching the name being impersonated. Meta and LinkedIn typically act within 48 hours. X and TikTok are slower (5–10 days) and routinely require escalation.',
  },
  {
    q: 'Should I report online impersonation to the police?',
    a: 'Yes, if there is fraud, harassment, or financial loss involved. Report via Action Fraud (0300 123 2040) for fraud-led cases, or 101 for harassment. Get a crime reference number — platforms accelerate removal when one is provided. The ICO also accepts complaints where personal data has been misused.',
  },
  {
    q: 'Can I sue an anonymous impersonator?',
    a: 'Yes. A Norwich Pharmacal Order compels the platform to disclose the account holder\'s identifying data (IP, email, phone). Costs typically £4,000–£8,000 in legal fees but unmasks the impersonator and unlocks claims for defamation, harassment, or passing off.',
  },
];

const OnlineImpersonationUKPage = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ariaops.co.uk/' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.ariaops.co.uk/services/online-impersonation-uk' },
      { '@type': 'ListItem', position: 3, name: 'Online Impersonation UK' },
    ],
  };

  return (
    <PublicLayout>
      <SEO
        title="Online Impersonation — UK Legal Guide & Removal Steps (2026)"
        description="UK guide to online impersonation: what counts as a crime, how to gather evidence, platform reporting routes (Meta, X, LinkedIn, TikTok), and Action Fraud + ICO escalation."
        path="/services/online-impersonation-uk"
        jsonLd={[faqJsonLd, breadcrumbJsonLd]}
      />

      <article className="bg-background text-foreground">
        {/* Hero */}
        <section className="container mx-auto px-6 pt-20 pb-12 max-w-4xl">
          <p className="text-sm uppercase tracking-widest text-primary mb-4">UK Legal Guide</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Online impersonation — your UK legal options when someone steals your identity
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Fake LinkedIn profiles, cloned X accounts, deepfake CEO videos, WhatsApp message
            scams in your name. UK law gives you more recourse than most people realise — but
            only if you act in the right order.
          </p>
        </section>

        {/* What counts */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Gavel className="h-7 w-7 text-primary" /> What counts as impersonation under UK law
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            There is no single "impersonation offence" in England & Wales. Instead the conduct
            usually triggers one or more of these statutes — pick the one that best fits the
            facts before approaching police or platforms:
          </p>
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-bold mb-1">Fraud Act 2006, s.2 — Fraud by false representation</h3>
              <p className="text-sm text-muted-foreground">Used where the impersonator gains money, services, or causes loss. Maximum penalty: 10 years.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-bold mb-1">Protection from Harassment Act 1997</h3>
              <p className="text-sm text-muted-foreground">Two or more incidents that cause alarm or distress. Civil and criminal remedies available.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-bold mb-1">Malicious Communications Act 1988</h3>
              <p className="text-sm text-muted-foreground">Sending a single message that is indecent, grossly offensive, or designed to cause distress.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-bold mb-1">Computer Misuse Act 1990</h3>
              <p className="text-sm text-muted-foreground">Where accounts have been accessed without permission, or created using your personal data.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-bold mb-1">UK GDPR / Data Protection Act 2018</h3>
              <p className="text-sm text-muted-foreground">Misuse of your personal data is reportable to the ICO and can support a civil claim.</p>
            </div>
          </div>
        </section>

        {/* Evidence */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <FileSearch className="h-7 w-7 text-primary" /> Step 1 — Build an evidence file
          </h2>
          <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
            Before reporting anything, capture:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-lg">
            <li>Full-page screenshots showing the URL, timestamp, and browser address bar.</li>
            <li>Archive snapshots from <a className="text-primary hover:underline" href="https://web.archive.org" rel="noopener">web.archive.org</a> and <a className="text-primary hover:underline" href="https://archive.today" rel="noopener">archive.today</a>.</li>
            <li>The impersonator\'s profile URL and any account ID/handle.</li>
            <li>Date you first became aware. Date of first known impersonation post.</li>
            <li>Copies of any messages sent to your contacts in your name.</li>
            <li>Witness statements from contacts who were deceived.</li>
          </ul>
        </section>

        {/* Platform routes */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <ShieldAlert className="h-7 w-7 text-primary" /> Step 2 — Platform takedown routes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-bold mb-2">Meta (Facebook & Instagram)</h3>
              <p className="text-sm text-muted-foreground">Use the dedicated <em>"Report an account that\'s pretending to be you or someone you know"</em> form. Requires government photo ID. Typical action: 24–72 hours.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-bold mb-2">LinkedIn</h3>
              <p className="text-sm text-muted-foreground">Use the <em>"Report an impersonation profile"</em> Help Center form. LinkedIn cross-checks employment data — fastest of all platforms (often &lt;24h).</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-bold mb-2">X (Twitter)</h3>
              <p className="text-sm text-muted-foreground">Submit through the impersonation form. X is slower (5–10 days) and often requires evidence of <em>commercial</em> harm. Verified accounts get faster triage.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-bold mb-2">TikTok</h3>
              <p className="text-sm text-muted-foreground">Use the impersonation report form (not the in-app "report"). Requires ID and clear evidence the account is not parody/fan content.</p>
            </div>
          </div>
        </section>

        {/* Authorities */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Step 3 — UK authorities</h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p><strong className="text-foreground">Action Fraud (0300 123 2040)</strong> — first stop for any impersonation involving financial loss or attempted fraud. Get the crime reference number; platforms move faster with one attached.</p>
            <p><strong className="text-foreground">101 (non-emergency police)</strong> — for harassment, stalking, or threats.</p>
            <p><strong className="text-foreground">ICO (ico.org.uk)</strong> — where the impersonation involves misuse of your personal data. The ICO can fine the platform if takedown is unreasonably delayed.</p>
            <p><strong className="text-foreground">National Cyber Security Centre</strong> — report deepfake content via report@phishing.gov.uk; the NCSC routes to platform threat-intel teams.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 py-16 max-w-4xl">
          <div className="bg-card border border-primary/40 rounded-lg p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Need this handled today?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              A.R.I.A™ Legal Ops takes over end-to-end: evidence preparation, platform escalation,
              Action Fraud filing, and where needed Norwich Pharmacal Orders to unmask anonymous
              impersonators. Median resolution: 7 days.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/scan">
                Start with a free threat scan <ArrowRight className="ml-2 h-4 w-4" />
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

        {/* Related */}
        <section className="container mx-auto px-6 pb-20 max-w-4xl">
          <h2 className="text-xl font-bold mb-4">Related services</h2>
          <ul className="space-y-2 text-primary">
            <li><Link to="/services/brand-protection" className="hover:underline">→ Brand protection</Link></li>
            <li><Link to="/services/remove-google-reviews" className="hover:underline">→ How to remove fake Google reviews</Link></li>
          </ul>
        </section>
      </article>
    </PublicLayout>
  );
};

export default OnlineImpersonationUKPage;
