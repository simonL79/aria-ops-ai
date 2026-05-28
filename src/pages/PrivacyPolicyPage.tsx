import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, FileText } from 'lucide-react';
import LegalDocument, { LegalSectionBlock, LegalSection } from '@/components/legal/LegalDocument';

const sections: LegalSection[] = [
  { id: 'who-we-are', title: 'Who We Are' },
  { id: 'data-collected', title: 'What Information We Collect' },
  { id: 'lawful-basis', title: 'Lawful Basis for Processing' },
  { id: 'use', title: 'How We Use Your Information' },
  { id: 'storage', title: 'Storage, Security & Retention' },
  { id: 'sharing', title: 'Sharing & Third-Party Processors' },
  { id: 'rights', title: 'Your Rights Under UK GDPR' },
  { id: 'cookies', title: 'Cookies' },
  { id: 'changes', title: 'Changes & Contact' },
];

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc pl-6 space-y-1.5 marker:text-primary/70">{children}</ul>
);

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <LegalDocument
      title="Privacy Policy"
      seoTitle="Privacy Policy — A.R.I.A™"
      seoDescription="How A.R.I.A™ collects, processes and protects personal data in line with UK GDPR and ICO guidance."
      path="/privacy-policy"
      seoImage="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Privacy Policy — A.R.I.A™",
        "description": "How A.R.I.A™ collects, processes and protects personal data in line with UK GDPR and ICO guidance.",
        "url": "https://www.ariaops.co.uk/privacy-policy",
        "publisher": {
          "@type": "Organization",
          "name": "A.R.I.A™",
          "url": "https://www.ariaops.co.uk/",
        },
      }}
      sections={sections}
      intro="This Privacy Policy explains how A.R.I.A™ collects, uses and protects personal data when you visit ariaops.co.uk or engage our reputation intelligence services. We process data in line with the UK GDPR and the Data Protection Act 2018."
      footerLinks={[
        { to: '/terms', label: 'Terms & Conditions' },
        { to: '/disclaimer', label: 'Acceptable Use & Disclaimer' },
        { to: '/request-data-access', label: 'Submit Data Request' },
      ]}
    >
      <LegalSectionBlock id="who-we-are" index={1} title="Who We Are">
        <p>
          This website is operated by <strong>Simon Lindsay Consultancy, trading as A.R.I.A™</strong>.
          We are the data controller for personal data collected through ariaops.co.uk and our
          client engagements.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="data-collected" index={2} title="What Information We Collect">
        <Bullet>
          <li>Name and contact details (email, phone, company)</li>
          <li>Keywords, names or brands you ask us to monitor</li>
          <li>Public reputation signals collected from open sources on your behalf</li>
          <li>IP address, browser metadata and basic device data</li>
          <li>Communications you send to us (emails, messages, form submissions)</li>
          <li>Billing details processed by our payment provider</li>
        </Bullet>
      </LegalSectionBlock>

      <LegalSectionBlock id="lawful-basis" index={3} title="Lawful Basis for Processing">
        <p>We process personal data under the following bases:</p>
        <Bullet>
          <li><strong>Contract</strong> — to deliver services you have engaged us for.</li>
          <li><strong>Legitimate interests</strong> — to monitor publicly available information for reputation risk.</li>
          <li><strong>Consent</strong> — where you opt in to communications or specific processing.</li>
          <li><strong>Legal obligation</strong> — to meet tax, accounting and regulatory duties.</li>
        </Bullet>
      </LegalSectionBlock>

      <LegalSectionBlock id="use" index={4} title="How We Use Your Information">
        <Bullet>
          <li>Deliver monitoring, analysis and reporting services</li>
          <li>Notify you of mentions, risks or escalations</li>
          <li>Operate, secure and improve the platform</li>
          <li>Communicate about your engagement, invoices and updates</li>
          <li>Comply with legal and regulatory obligations</li>
        </Bullet>
        <p>We do <strong>not</strong> sell personal data to third parties.</p>
      </LegalSectionBlock>

      <LegalSectionBlock id="storage" index={5} title="Storage, Security & Retention">
        <p>
          Data is stored in access-controlled, encrypted systems hosted by our infrastructure
          providers. We retain personal data only for as long as necessary to deliver the service
          and to meet legal obligations, after which it is securely deleted or anonymised.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="sharing" index={6} title="Sharing & Third-Party Processors">
        <p>
          We share data only with vetted processors needed to run the service, including hosting
          providers, database providers, email/transactional services, analytics tools and AI
          providers used to generate analysis. Each processor is bound by their own data-processing
          terms. We may also disclose data where required by law.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="rights" index={7} title="Your Rights Under UK GDPR">
        <Bullet>
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate or incomplete data</li>
          <li>Request deletion ("right to be forgotten") where applicable</li>
          <li>Restrict or object to processing</li>
          <li>Withdraw consent at any time</li>
          <li>Lodge a complaint with the UK Information Commissioner's Office (ICO)</li>
        </Bullet>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => navigate('/request-data-access')}
          >
            <Shield className="h-4 w-4" />
            GDPR Compliance
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate('/request-data-access')}
          >
            <FileText className="h-4 w-4" />
            Submit Data Request
          </Button>
        </div>
      </LegalSectionBlock>

      <LegalSectionBlock id="cookies" index={8} title="Cookies">
        <p>
          We use a small number of cookies to operate the site, remember preferences and measure
          aggregate traffic. You can manage cookie behaviour through your browser settings.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="changes" index={9} title="Changes & Contact">
        <p>
          We may update this policy from time to time. Material changes will be posted here with a
          revised "last updated" date. For privacy queries, use our{' '}
          <a href="/contact" className="text-primary hover:underline">
            contact page
          </a>{' '}
          or the data-request form linked above.
        </p>
      </LegalSectionBlock>
    </LegalDocument>
  );
};

export default PrivacyPolicyPage;
