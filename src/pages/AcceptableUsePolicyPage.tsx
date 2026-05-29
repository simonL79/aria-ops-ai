import React from 'react';
import { Link } from 'react-router-dom';
import LegalDocument, { LegalSectionBlock, LegalSection } from '@/components/legal/LegalDocument';

const sections: LegalSection[] = [
  { id: 'scope', title: 'Scope' },
  { id: 'permitted', title: 'Permitted Use' },
  { id: 'prohibited', title: 'Prohibited Use' },
  { id: 'content-integrity', title: 'Content Integrity' },
  { id: 'legal-compliance', title: 'Legal Compliance' },
  { id: 'enforcement', title: 'Enforcement' },
  { id: 'reporting', title: 'Reporting Abuse' },
  { id: 'acceptance', title: 'Acceptance' },
];

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc pl-6 space-y-1.5 marker:text-primary/70">{children}</ul>
);

const AcceptableUsePolicyPage = () => {
  return (
    <LegalDocument
      title="Acceptable Use Policy"
      seoTitle="Acceptable Use Policy — A.R.I.A™"
      seoDescription="Acceptable Use Policy for A.R.I.A™ (AI Reputation Intelligence Agent). Prohibits unlawful suppression, harassment, impersonation, misleading content and review manipulation."
      path="/acceptable-use"
      seoImage="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Acceptable Use Policy — A.R.I.A™',
        description:
          'Acceptable Use Policy for A.R.I.A™. Prohibits unlawful suppression, harassment, impersonation, misleading content and review manipulation.',
        url: 'https://www.ariaops.co.uk/acceptable-use',
        publisher: {
          '@type': 'Organization',
          name: 'A.R.I.A™',
          url: 'https://www.ariaops.co.uk/',
        },
      }}
      sections={sections}
      intro="This Acceptable Use Policy governs how clients and users may use A.R.I.A™ (AI Reputation Intelligence Agent) services. Reputation work carries real-world consequences, and these rules exist to ensure our services are used lawfully, ethically and only for legitimate reputation protection."
      footerLinks={[
        { to: '/terms', label: 'Terms & Conditions' },
        { to: '/disclaimer', label: 'Service Disclaimer' },
        { to: '/privacy-policy', label: 'Privacy Policy' },
      ]}
    >
      <LegalSectionBlock id="scope" index={1} title="Scope">
        <p>
          This policy applies to everyone who accesses or uses A.R.I.A™ services, reports, tools or
          deliverables, whether as a client, an authorised representative or a visitor to
          ariaops.co.uk. It supplements our{' '}
          <Link to="/terms" className="text-primary hover:underline">Terms &amp; Conditions</Link> and{' '}
          <Link to="/disclaimer" className="text-primary hover:underline">Service Disclaimer</Link>.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="permitted" index={2} title="Permitted Use">
        <p>You may use A.R.I.A™ services to:</p>
        <Bullet>
          <li>Protect your own reputation or that of a principal you are authorised to represent</li>
          <li>Monitor, assess and respond to genuine reputational threats</li>
          <li>Pursue lawful removal, correction or suppression of unlawful or inaccurate content</li>
          <li>Publish accurate, truthful and non-misleading authority content</li>
        </Bullet>
      </LegalSectionBlock>

      <LegalSectionBlock id="prohibited" index={3} title="Prohibited Use">
        <p>You must not use A.R.I.A™ services to:</p>
        <Bullet>
          <li>
            <strong>Unlawfully suppress</strong> lawful criticism, journalism, public-interest
            reporting or whistleblowing
          </li>
          <li><strong>Harass</strong>, threaten, stalk, dox or intimidate any individual</li>
          <li>
            <strong>Impersonate</strong> any person, brand or organisation, or misrepresent your
            identity or authority
          </li>
          <li>
            Create, commission or distribute <strong>misleading, deceptive or knowingly false
            content</strong>
          </li>
          <li>
            Engage in <strong>review manipulation</strong>, including fake, incentivised or
            astroturfed reviews and ratings
          </li>
          <li>Interfere with lawful legal, regulatory or law-enforcement proceedings</li>
          <li>Conceal fraud, criminal conduct or genuine consumer-safety information</li>
          <li>Breach the terms, policies or technical controls of any third-party platform</li>
          <li>Infringe intellectual-property, privacy, data-protection or defamation laws</li>
        </Bullet>
      </LegalSectionBlock>

      <LegalSectionBlock id="content-integrity" index={4} title="Content Integrity">
        <p>
          A.R.I.A™ operates to evidence-based standards. We will not manufacture false narratives,
          fabricate testimonials or deploy deceptive tactics on behalf of any client. Any content
          produced or coordinated through our services must be accurate and lawful.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="legal-compliance" index={5} title="Legal Compliance">
        <p>
          You are responsible for ensuring your use of A.R.I.A™ complies with all applicable laws in
          every relevant jurisdiction, including data-protection, consumer-protection, defamation and
          anti-harassment law. You must hold the necessary rights and authority for any data or
          instructions you provide.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="enforcement" index={6} title="Enforcement">
        <p>
          Breach of this policy entitles A.R.I.A™ to suspend or terminate the engagement immediately,
          without refund, to withdraw access to any deliverable, and to report unlawful activity to the
          relevant platform, regulator or authority. We reserve the right to decline or discontinue any
          engagement at our sole discretion.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="reporting" index={7} title="Reporting Abuse">
        <p>
          If you believe A.R.I.A™ services are being misused, or that content associated with us
          breaches this policy, please report it via our{' '}
          <Link to="/contact" className="text-primary hover:underline">contact page</Link>. We
          investigate all credible reports.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="acceptance" index={8} title="Acceptance">
        <p>
          Using the A.R.I.A™ platform, services or any deliverable indicates your agreement to this
          Acceptable Use Policy alongside our{' '}
          <Link to="/terms" className="text-primary hover:underline">Terms &amp; Conditions</Link>,{' '}
          <Link to="/disclaimer" className="text-primary hover:underline">Service Disclaimer</Link> and{' '}
          <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </LegalSectionBlock>
    </LegalDocument>
  );
};

export default AcceptableUsePolicyPage;
