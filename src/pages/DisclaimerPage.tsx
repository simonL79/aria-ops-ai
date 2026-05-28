import React from 'react';
import { Link } from 'react-router-dom';
import LegalDocument, { LegalSectionBlock, LegalSection } from '@/components/legal/LegalDocument';

const sections: LegalSection[] = [
  { id: 'purpose', title: 'Purpose of This Document' },
  { id: 'ai-limits', title: 'AI Limitations' },
  { id: 'no-guarantees', title: 'No Guaranteed Outcomes' },
  { id: 'not-advice', title: 'Not Legal, Financial or Medical Advice' },
  { id: 'acceptable-use', title: 'Acceptable Use' },
  { id: 'prohibited', title: 'Prohibited Use' },
  { id: 'third-parties', title: 'Third-Party Platforms & Links' },
  { id: 'liability', title: 'Liability' },
  { id: 'acceptance', title: 'Acceptance' },
];

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc pl-6 space-y-1.5 marker:text-primary/70">{children}</ul>
);

const DisclaimerPage = () => {
  return (
    <LegalDocument
      title="Acceptable Use & Service Disclaimer"
      seoTitle="Acceptable Use & Disclaimer — A.R.I.A™"
      seoDescription="Acceptable use rules and service disclaimer for the A.R.I.A™ reputation intelligence platform."
      path="/disclaimer"
      sections={sections}
      intro="This document sets out the acceptable use of A.R.I.A™ services and the disclaimers that apply to information, reports and AI-generated outputs supplied through ariaops.co.uk."
      footerLinks={[
        { to: '/terms', label: 'Terms & Conditions' },
        { to: '/privacy-policy', label: 'Privacy Policy' },
        { to: '/contact', label: 'Contact' },
      ]}
    >
      <LegalSectionBlock id="purpose" index={1} title="Purpose of This Document">
        <p>
          A.R.I.A™ provides AI-assisted reputation intelligence and protection services. Information
          on this site and within client reports is provided in good faith for general informational
          and operational purposes. It does not replace professional legal, financial or medical
          advice.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="ai-limits" index={2} title="AI Limitations">
        <p>
          A.R.I.A™ uses artificial intelligence to detect, score and classify reputation signals.
          AI outputs are generated from third-party and publicly available data, and may be:
        </p>
        <Bullet>
          <li>Incomplete, delayed or out of date</li>
          <li>Inaccurate or misclassified</li>
          <li>Affected by platform changes or rate limits</li>
          <li>Influenced by upstream model behaviour we do not control</li>
        </Bullet>
        <p>AI outputs should be treated as advisory inputs, not as findings of fact.</p>
      </LegalSectionBlock>

      <LegalSectionBlock id="no-guarantees" index={3} title="No Guaranteed Outcomes">
        <p>A.R.I.A™ does not guarantee any specific outcome, including:</p>
        <Bullet>
          <li>Removal of any specific content</li>
          <li>Changes to search-engine rankings or AI search results</li>
          <li>Decisions by any third-party platform, publisher or regulator</li>
          <li>Changes in public sentiment or media response</li>
          <li>Any specific timeframe for reputation recovery</li>
        </Bullet>
      </LegalSectionBlock>

      <LegalSectionBlock id="not-advice" index={4} title="Not Legal, Financial or Medical Advice">
        <p>
          Nothing on this site or within A.R.I.A™ deliverables constitutes legal, financial or
          medical advice. For defamation, regulatory or other legal matters, instruct a qualified
          solicitor admitted in the relevant jurisdiction.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="acceptable-use" index={5} title="Acceptable Use">
        <p>Clients and users of A.R.I.A™ must:</p>
        <Bullet>
          <li>Provide accurate, lawful and non-misleading information</li>
          <li>Be authorised to share any data submitted to the platform</li>
          <li>Use outputs solely to protect their own or their authorised principal's reputation</li>
          <li>Comply with applicable laws and third-party platform terms</li>
        </Bullet>
      </LegalSectionBlock>

      <LegalSectionBlock id="prohibited" index={6} title="Prohibited Use">
        <p>A.R.I.A™ services must not be used to:</p>
        <Bullet>
          <li>Silence lawful criticism, journalism or whistleblowing</li>
          <li>Harass, threaten, dox or intimidate any individual</li>
          <li>Impersonate or misrepresent any person or organisation</li>
          <li>Manipulate reviews or publish knowingly false positive content</li>
          <li>Mislead the public or interfere with lawful proceedings</li>
          <li>Breach the terms of any third-party platform</li>
        </Bullet>
        <p>
          Breach of these rules entitles A.R.I.A™ to suspend or terminate the engagement
          immediately, without refund, and to report unlawful activity to the relevant authority.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="third-parties" index={7} title="Third-Party Platforms & Links">
        <p>
          A.R.I.A™ has no control over third-party platforms — including Google, Meta, TikTok, X,
          YouTube, Reddit, news publishers, review sites and AI platforms such as ChatGPT, Gemini,
          Perplexity and Copilot — and assumes no responsibility for their content, policies or
          decisions. Outbound links are provided for convenience only.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="liability" index={8} title="Liability">
        <p>
          To the maximum extent permitted by law, A.R.I.A™, Simon Lindsay Consultancy and
          associated partners shall not be liable for loss, damage or liability arising from
          reliance on tools, reports, AI outputs or services. Nothing in this disclaimer excludes
          liability that cannot lawfully be excluded, including liability for death or personal
          injury caused by negligence, or for fraud.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="acceptance" index={9} title="Acceptance">
        <p>
          Using the A.R.I.A™ platform, services or any deliverable indicates your agreement to this
          Acceptable Use & Service Disclaimer alongside our{' '}
          <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link> and{' '}
          <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </LegalSectionBlock>
    </LegalDocument>
  );
};

export default DisclaimerPage;
