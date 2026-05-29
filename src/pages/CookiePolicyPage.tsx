import React from 'react';
import { Link } from 'react-router-dom';
import LegalDocument, { LegalSectionBlock, LegalSection } from '@/components/legal/LegalDocument';

const sections: LegalSection[] = [
  { id: 'what-are-cookies', title: 'What Are Cookies' },
  { id: 'how-we-use', title: 'How We Use Cookies' },
  { id: 'types', title: 'Types of Cookies We Use' },
  { id: 'third-party', title: 'Third-Party Cookies' },
  { id: 'managing', title: 'Managing Your Preferences' },
  { id: 'consent', title: 'Your Consent' },
  { id: 'changes', title: 'Changes to This Policy' },
  { id: 'contact', title: 'Contact' },
];

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc pl-6 space-y-1.5 marker:text-primary/70">{children}</ul>
);

const CookiePolicyPage = () => {
  return (
    <LegalDocument
      title="Cookie Policy"
      seoTitle="Cookie Policy — A.R.I.A™"
      seoDescription="How A.R.I.A™ (AI Reputation Intelligence Agent) uses cookies and similar technologies, and how you can manage your preferences."
      path="/cookie-policy"
      seoImage="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Cookie Policy — A.R.I.A™',
        description:
          'How A.R.I.A™ uses cookies and similar technologies, and how you can manage your preferences.',
        url: 'https://www.ariaops.co.uk/cookie-policy',
        publisher: {
          '@type': 'Organization',
          name: 'A.R.I.A™',
          url: 'https://www.ariaops.co.uk/',
        },
      }}
      sections={sections}
      intro="This Cookie Policy explains how A.R.I.A™ (AI Reputation Intelligence Agent) uses cookies and similar technologies when you visit ariaops.co.uk, and the choices available to you."
      footerLinks={[
        { to: '/privacy-policy', label: 'Privacy Policy' },
        { to: '/terms', label: 'Terms & Conditions' },
        { to: '/acceptable-use', label: 'Acceptable Use Policy' },
      ]}
    >
      <LegalSectionBlock id="what-are-cookies" index={1} title="What Are Cookies">
        <p>
          Cookies are small text files placed on your device when you visit a website. They are widely
          used to make websites work, to improve performance, and to provide information to site
          operators. Similar technologies include local storage, pixels and tags, which we refer to
          collectively as "cookies" in this policy.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="how-we-use" index={2} title="How We Use Cookies">
        <p>A.R.I.A™ uses cookies to:</p>
        <Bullet>
          <li>Keep the platform secure and operate authenticated sessions</li>
          <li>Remember your preferences and settings</li>
          <li>Understand how the site is used so we can improve it</li>
          <li>Measure the effectiveness of our content and campaigns</li>
        </Bullet>
      </LegalSectionBlock>

      <LegalSectionBlock id="types" index={3} title="Types of Cookies We Use">
        <Bullet>
          <li>
            <strong>Strictly necessary</strong> — required for core functionality such as security,
            session management and load balancing. These cannot be switched off.
          </li>
          <li>
            <strong>Performance &amp; analytics</strong> — help us understand traffic and usage so we
            can improve the platform. Set only with your consent where required.
          </li>
          <li>
            <strong>Functional</strong> — remember choices you make to provide a more personalised
            experience.
          </li>
        </Bullet>
      </LegalSectionBlock>

      <LegalSectionBlock id="third-party" index={4} title="Third-Party Cookies">
        <p>
          Some cookies may be set by third-party services we use, for example analytics or content
          delivery providers. We do not control these cookies; please review the relevant provider's
          own cookie and privacy policies for further detail.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="managing" index={5} title="Managing Your Preferences">
        <p>
          Most browsers let you refuse or delete cookies through their settings. Blocking strictly
          necessary cookies may affect how the site functions. You can usually find these controls in
          your browser's "Settings" or "Privacy" menu.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="consent" index={6} title="Your Consent">
        <p>
          Where required by the UK GDPR and the Privacy and Electronic Communications Regulations
          (PECR), we set non-essential cookies only with your consent. You may withdraw consent at any
          time by adjusting your browser settings.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="changes" index={7} title="Changes to This Policy">
        <p>
          We may update this Cookie Policy from time to time to reflect changes in technology, law or
          our practices. The "last updated" date above indicates when this policy was last revised.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="contact" index={8} title="Contact">
        <p>
          Questions about this policy can be sent via our{' '}
          <Link to="/contact" className="text-primary hover:underline">contact page</Link>. See also
          our{' '}
          <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </LegalSectionBlock>
    </LegalDocument>
  );
};

export default CookiePolicyPage;
