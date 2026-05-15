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
import { ShieldAlert, Scale, Search, ArrowRight } from 'lucide-react';

const faqs: { q: string; a: string }[] = [
  {
    q: 'Can Google remove fake reviews?',
    a: 'Yes — but only when the review breaches Google\'s prohibited & restricted content policies. The most common qualifying breaches are: fake engagement (a review left by someone with no genuine experience), conflict of interest (left by a competitor or ex-employee), harassment, hate speech, off-topic content, or impersonation. Reviews you simply disagree with do not qualify.',
  },
  {
    q: 'How long does Google take to remove a flagged review?',
    a: 'Initial automated triage usually happens within 24–72 hours. If Google sides with the reviewer, you can request a manual escalation through Google Business Profile support, which typically takes a further 5–10 working days. In our experience around 35–40% of policy-valid flags succeed on first attempt; most successful removals come after escalation with documented evidence.',
  },
  {
    q: 'Does Google remove reviews after I report them?',
    a: 'Not automatically. Reporting a review opens an investigation; Google\'s reviewers (a mix of automated systems and human moderators) then decide whether the content breaches policy. A clean, evidenced report dramatically improves the success rate.',
  },
  {
    q: 'What can I do if Google refuses to remove a defamatory review?',
    a: 'Under UK law you have several escalation routes: a Defamation Act 2013 notice of complaint to Google as the operator (which can compel removal or unmask the author), a claim under the Malicious Communications Act 1988, or a Section 127 Communications Act 2003 complaint where the content is grossly offensive. A.R.I.A™ Legal Ops handles these end-to-end.',
  },
  {
    q: 'Will the reviewer know I reported them?',
    a: 'No. Google does not notify the author when a review is flagged or removed. The review simply disappears from your profile if action is taken.',
  },
];

const RemoveGoogleReviewsPage = () => {
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
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.ariaops.co.uk/services/remove-google-reviews' },
      { '@type': 'ListItem', position: 3, name: 'Remove Google Reviews' },
    ],
  };

  return (
    <PublicLayout>
      <SEO
        title="How to Remove Fake Google Reviews — UK 2026 Guide"
        description="Step-by-step UK guide to removing fake or defamatory Google reviews: policy flagging, escalation, and when to bring in legal action under UK defamation law."
        path="/services/remove-google-reviews"
        jsonLd={[faqJsonLd, breadcrumbJsonLd]}
      />

      <article className="bg-background text-foreground">
        {/* Hero */}
        <section className="container mx-auto px-6 pt-20 pb-12 max-w-4xl">
          <p className="text-sm uppercase tracking-widest text-primary mb-4">UK Reputation Guide</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            How to remove a fake Google review — the UK 2026 playbook
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Fake, malicious, or off-topic Google reviews can cost a UK business 30%+ of new
            enquiries. Here's exactly how to get them removed — the official Google route first,
            UK legal escalation second, and what to do when both fail.
          </p>
        </section>

        {/* Step-by-step */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Search className="h-7 w-7 text-primary" /> Step 1 — Flag the review through Google
          </h2>
          <ol className="space-y-4 text-muted-foreground text-lg leading-relaxed list-decimal pl-6">
            <li>Sign in to <strong>Google Business Profile</strong> at business.google.com.</li>
            <li>Open <strong>Reviews</strong> → find the review → click the three-dot menu → <strong>Report review</strong>.</li>
            <li>
              Pick the most accurate category. The categories Google actually acts on are:
              <em>off-topic</em>, <em>spam</em>, <em>conflict of interest</em>, <em>profanity</em>,
              <em>harassment or hate speech</em>, and <em>personal information</em>. "Inaccurate"
              is not a category — Google does not arbitrate truthfulness.
            </li>
            <li>
              Submit. Initial automated triage takes 24–72 hours. If nothing happens, move to
              Step 2.
            </li>
          </ol>
        </section>

        {/* Escalation */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <ShieldAlert className="h-7 w-7 text-primary" /> Step 2 — Escalate inside Google
          </h2>
          <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
            From your Business Profile, open <strong>Support → Contact us → Reviews and photos →
            Manage customer reviews</strong>. Choose <em>"A review on my Business Profile"</em> and
            request a human moderator. Attach evidence: screenshots showing the reviewer was never
            a customer, dated booking systems, CCTV reference numbers, or proof the review names
            an employee who did not work that day.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Most successful removals happen here, not at Step 1. The quality of your evidence
            file is the single biggest predictor of success.
          </p>
        </section>

        {/* Legal route */}
        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Scale className="h-7 w-7 text-primary" /> Step 3 — UK legal escalation
          </h2>
          <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
            If Google refuses and the review is genuinely false or harassing, UK law gives you
            three routes:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">Defamation Act 2013, s.5</h3>
              <p className="text-sm text-muted-foreground">
                Serve a <em>notice of complaint</em> on Google as the operator. Google must either
                remove the content or pass your complaint to the author within 48 hours — or lose
                its statutory defence.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">Malicious Communications Act 1988</h3>
              <p className="text-sm text-muted-foreground">
                Where the review is indecent, grossly offensive, or sent with intent to cause
                distress, this is a criminal matter. Report via Action Fraud (101) or your local
                force.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">Communications Act 2003, s.127</h3>
              <p className="text-sm text-muted-foreground">
                Covers grossly offensive or menacing electronic messages. Lower threshold than
                defamation — useful when the harm is reputational but the content sits in a grey
                area.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 py-16 max-w-4xl">
          <div className="bg-card border border-primary/40 rounded-lg p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">When Google won't act, A.R.I.A™ does.</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Our Legal Ops team handles Defamation Act notices, evidence preparation, and direct
              negotiation with Google's legal team. Average resolution time: 14 days.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/scan">
                Run a free reputation scan <ArrowRight className="ml-2 h-4 w-4" />
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
            <li><Link to="/services/online-impersonation-uk" className="hover:underline">→ Online impersonation — UK legal guide</Link></li>
            <li><Link to="/services/brand-protection" className="hover:underline">→ Brand protection</Link></li>
          </ul>
        </section>
      </article>
    </PublicLayout>
  );
};

export default RemoveGoogleReviewsPage;
