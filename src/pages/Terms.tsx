import React from 'react';
import LegalDocument, { LegalSectionBlock, LegalSection } from '@/components/legal/LegalDocument';

const sections: LegalSection[] = [
  { id: 'identity', title: 'Business Identity' },
  { id: 'services', title: 'What A.R.I.A Provides' },
  { id: 'no-guarantee', title: 'No Guaranteed Outcome' },
  { id: 'ai-disclaimer', title: 'AI Disclaimer' },
  { id: 'not-advice', title: 'Not Legal, Financial or Medical Advice' },
  { id: 'client-responsibility', title: 'Client Responsibilities' },
  { id: 'lawful-use', title: 'Lawful Use' },
  { id: 'third-parties', title: 'Third-Party Platforms' },
  { id: 'payments', title: 'Payments & Cancellations' },
  { id: 'confidentiality', title: 'Confidentiality' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'governing-law', title: 'Governing Law & Contact' },
];

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc pl-6 space-y-1.5 marker:text-primary/70">{children}</ul>
);

const Terms = () => {
  return (
    <LegalDocument
      title="Terms & Conditions"
      seoTitle="Terms & Conditions — A.R.I.A™"
      seoDescription="Terms and conditions governing the use of A.R.I.A™ reputation intelligence and defence services, operated by Simon Lindsay Consultancy."
      path="/terms"
      seoImage="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Terms & Conditions — A.R.I.A™",
        "description": "Terms and conditions governing the use of A.R.I.A™ reputation intelligence and defence services.",
        "url": "https://www.ariaops.co.uk/terms",
        "publisher": {
          "@type": "Organization",
          "name": "A.R.I.A™",
          "url": "https://www.ariaops.co.uk/",
        },
      }}
      sections={sections}
      intro="These Terms govern your access to and use of A.R.I.A™ reputation intelligence, monitoring, suppression-support and advisory services. By engaging A.R.I.A™ or using ariaops.co.uk, you accept these Terms in full."
      footerLinks={[
        { to: '/privacy-policy', label: 'Privacy Policy' },
        { to: '/disclaimer', label: 'Acceptable Use & Disclaimer' },
        { to: '/contact', label: 'Contact' },
      ]}
    >
      <LegalSectionBlock id="identity" index={1} title="Business Identity">
        <p>
          This website and the A.R.I.A™ service are operated by{' '}
          <strong>Simon Lindsay Consultancy, trading as A.R.I.A™</strong>{' '}
          ("A.R.I.A", "we", "our", "us").
        </p>
        <Bullet>
          <li>Website: <span className="text-primary">ariaops.co.uk</span></li>
          <li>Governing law: Scotland</li>
          <li>Jurisdiction: the Scottish courts have exclusive jurisdiction</li>
        </Bullet>
      </LegalSectionBlock>

      <LegalSectionBlock id="services" index={2} title="What A.R.I.A Provides">
        <p>A.R.I.A™ provides AI-assisted reputation services, including:</p>
        <Bullet>
          <li>Reputation monitoring and online risk analysis</li>
          <li>Threat scoring and reputation reporting</li>
          <li>Strategic response guidance and narrative defence</li>
          <li>Content strategy and search-positioning support</li>
          <li>Suppression support and removal/reporting assistance</li>
          <li>Ongoing digital reputation protection</li>
        </Bullet>
        <p>
          A.R.I.A™ does <strong>not</strong> guarantee removal or suppression of content, does not
          control Google, social platforms or AI search engines, and does not erase content from the
          internet.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="no-guarantee" index={3} title="No Guaranteed Outcome">
        <p>A.R.I.A™ cannot and does not guarantee:</p>
        <Bullet>
          <li>Removal of any specific content</li>
          <li>Changes to search-engine rankings</li>
          <li>Search suppression results</li>
          <li>Decisions made by third-party platforms</li>
          <li>Responses from media outlets or journalists</li>
          <li>Changes in public sentiment</li>
          <li>The output of AI search engines or large language models</li>
          <li>Any specific timeframe for reputation recovery</li>
        </Bullet>
      </LegalSectionBlock>

      <LegalSectionBlock id="ai-disclaimer" index={4} title="AI Disclaimer">
        <p>
          A.R.I.A™ uses artificial intelligence to support analysis of publicly available
          information, risk signals, search results, social content and online mentions. AI outputs
          are <strong>support tools only</strong> and may be incomplete, delayed, inaccurate or
          affected by third-party data. They must not be treated as definitive findings.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="not-advice" index={5} title="Not Legal, Financial or Medical Advice">
        <p>
          A.R.I.A™ is not a law firm, financial adviser or medical practice. Nothing supplied by
          A.R.I.A™ constitutes:
        </p>
        <Bullet>
          <li>Legal advice or a guaranteed defamation outcome</li>
          <li>Financial or investment advice</li>
          <li>Medical advice</li>
        </Bullet>
        <p>
          Where legal action is required, clients should instruct a qualified solicitor admitted in
          the relevant jurisdiction.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="client-responsibility" index={6} title="Client Responsibilities">
        <p>By engaging A.R.I.A™, the client confirms that any information they provide is:</p>
        <Bullet>
          <li>Accurate and not misleading</li>
          <li>Lawful to share and use</li>
          <li>Not confidential, unless they are authorised to disclose it</li>
          <li>
            Not supplied for the purpose of harassment, intimidation or unlawful targeting of any
            person or organisation
          </li>
        </Bullet>
      </LegalSectionBlock>

      <LegalSectionBlock id="lawful-use" index={7} title="Lawful Use">
        <p>A.R.I.A™ services must not be used to:</p>
        <Bullet>
          <li>Silence lawful criticism or whistleblowing</li>
          <li>Mislead the public or manipulate reviews dishonestly</li>
          <li>Impersonate or misrepresent any person or organisation</li>
          <li>Harass, threaten or intimidate any individual</li>
          <li>Publish knowingly false positive content</li>
          <li>Interfere with lawful journalism</li>
          <li>Breach the rules of any third-party platform</li>
        </Bullet>
        <p>
          We reserve the right to refuse, suspend or terminate engagements where these conditions
          are breached, without refund.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="third-parties" index={8} title="Third-Party Platforms">
        <p>
          A.R.I.A™ has no control over, and accepts no responsibility for, the decisions, policies
          or behaviour of third-party platforms, including but not limited to:
        </p>
        <Bullet>
          <li>Google, Bing and other search engines</li>
          <li>Meta (Facebook, Instagram, Threads), TikTok, X, YouTube, Reddit</li>
          <li>News publishers and review sites</li>
          <li>AI platforms such as ChatGPT, Gemini, Perplexity and Copilot</li>
        </Bullet>
      </LegalSectionBlock>

      <LegalSectionBlock id="payments" index={9} title="Payments & Cancellations">
        <Bullet>
          <li>Fees are payable in advance unless otherwise agreed in writing.</li>
          <li>Onboarding may take up to <strong>3 business days</strong> after payment is received.</li>
          <li>
            The initial engagement period is <strong>90 days</strong>, after which the client may
            cancel on reasonable notice unless an alternative term has been agreed.
          </li>
          <li>
            <strong>No refunds</strong> are issued for work already started, including strategy
            time, monitoring, analysis, reports or content already produced.
          </li>
        </Bullet>
      </LegalSectionBlock>

      <LegalSectionBlock id="confidentiality" index={10} title="Confidentiality">
        <p>
          A.R.I.A™ treats client matters as confidential and will not disclose them, except where
          disclosure is:
        </p>
        <Bullet>
          <li>Required by law, regulation or a competent authority</li>
          <li>Required by a platform process used to perform the service</li>
          <li>Made to professional advisers under a duty of confidentiality</li>
          <li>Necessary to deliver the service to the client</li>
        </Bullet>
        <p>
          The client agrees to maintain the confidentiality of A.R.I.A™'s methods, reports and
          proprietary materials.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="liability" index={11} title="Limitation of Liability">
        <p>
          To the maximum extent permitted by law, A.R.I.A™'s total liability arising under or in
          connection with the engagement is limited to the fees paid by the client in the{' '}
          <strong>3 months</strong> preceding the event giving rise to the claim.
        </p>
        <p>A.R.I.A™ shall not be liable for:</p>
        <Bullet>
          <li>Loss of profits, business, opportunity or anticipated savings</li>
          <li>Reputational loss</li>
          <li>Decisions made by third-party platforms or search engines</li>
          <li>Changes to search-engine rankings</li>
          <li>The content or accuracy of AI-generated outputs</li>
          <li>Any indirect, special or consequential loss</li>
        </Bullet>
        <p>
          Nothing in these Terms excludes or limits liability for death or personal injury caused by
          negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be
          excluded or limited under applicable law.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="governing-law" index={12} title="Governing Law & Contact">
        <p>
          These Terms and any dispute arising from them are governed by the laws of{' '}
          <strong>Scotland</strong>, and the parties submit to the exclusive jurisdiction of the
          Scottish courts.
        </p>
        <p>
          Questions about these Terms can be sent via our{' '}
          <a href="/contact" className="text-primary hover:underline">
            contact page
          </a>
          .
        </p>
      </LegalSectionBlock>
    </LegalDocument>
  );
};

export default Terms;
