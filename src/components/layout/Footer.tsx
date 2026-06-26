import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/ui/logo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FooterLink {
  to: string;
  label: string;
}

interface FooterGroup {
  title: string;
  links: FooterLink[];
}

const Footer = () => {
  const { pathname } = useLocation();
  const [openItem, setOpenItem] = useState('');

  useEffect(() => {
    setOpenItem('');
  }, [pathname]);

  const legalPaths = new Set([
    '/privacy-policy',
    '/terms',
    '/disclaimer',
    '/cookie-policy',
    '/acceptable-use',
  ]);

  const linkClass = (path: string) => {
    const isLegalActive = legalPaths.has(path) && pathname === path;
    return isLegalActive
      ? 'text-[#C6A15B] font-medium'
      : 'text-premium-silver hover:text-foreground transition-colors';
  };

  const groups: FooterGroup[] = [
    {
      title: 'Services',
      links: [
        { to: '/services/brand-protection', label: 'Brand Protection' },
        { to: '/services/legal-shield', label: 'ARIA Legal Shield' },
        { to: '/services/remove-google-reviews', label: 'Remove Google Reviews' },
        { to: '/services/online-impersonation-uk', label: 'Online Impersonation (UK)' },
        { to: '/scan', label: 'Free Threat Scan' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { to: '/ai-reputation-readiness', label: 'AI Reputation Readiness' },
        { to: '/ai-reputation-management', label: 'AI Reputation Management' },
        { to: '/online-reputation-management-uk', label: 'Online Reputation Management UK' },
        { to: '/llm-reputation-management', label: 'LLM Reputation Management' },
        { to: '/ai-search-visibility', label: 'AI Search Visibility' },
        { to: '/generative-engine-optimisation', label: 'Generative Engine Optimisation' },
        { to: '/reputation-threat-score', label: 'Reputation Threat Score' },
        { to: '/legal-defence-compliance', label: 'Legal Defence & Compliance' },
      ],
    },
    {
      title: 'For',
      links: [
        { to: '/founder-reputation-protection', label: 'Founders' },
        { to: '/athlete-reputation-management', label: 'Athletes' },
        { to: '/executive-reputation-protection', label: 'Executives' },
        { to: '/crisis-reputation-management', label: 'Crisis Response' },
        { to: '/suppress-negative-google-results', label: 'Suppress Google Results' },
        { to: '/negative-search-result-suppression', label: 'Negative Search Suppression' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { to: '/resources/ai-reputation-readiness-checklist', label: 'AI Readiness Checklist' },
        { to: '/resources/founder-reputation-risk-report', label: 'Founder Risk Report' },
        { to: '/resources/athlete-reputation-protection-guide', label: 'Athlete Protection Guide' },
        { to: '/resources/llm-visibility-audit-template', label: 'LLM Visibility Audit' },
        { to: '/resources/negative-search-suppression-guide', label: 'Suppression Guide' },
        { to: '/resources/crisis-reputation-response-checklist', label: 'Crisis Checklist' },
        { to: '/resources/ai-search-visibility-glossary', label: 'AI Search Glossary' },
      ],
    },
    {
      title: 'Company',
      links: [
        { to: '/about', label: 'About' },
        { to: '/simon-lindsay', label: 'Simon Lindsay' },
        { to: '/home#pricing', label: 'Pricing' },
        { to: '/blog', label: 'Blog' },
        { to: '/contact', label: 'Contact' },
        { to: '/cybersecurity-framework', label: 'Security' },
        { to: '/privacy-policy', label: 'Privacy' },
        { to: '/terms', label: 'Terms' },
        { to: '/disclaimer', label: 'Disclaimer' },
        { to: '/cookie-policy', label: 'Cookie Policy' },
        { to: '/acceptable-use', label: 'Acceptable Use' },
      ],
    },
  ];

  return (
    <footer className="bg-premium-black text-premium-silver py-8 text-center">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-8">
          <div className="flex items-center mb-2 md:mb-0">
            <Logo variant="light" size="xl" />
          </div>
          <Accordion
            type="single"
            collapsible
            value={openItem}
            onValueChange={setOpenItem}
            className="w-full md:w-auto md:grid md:grid-cols-5 gap-x-8 gap-y-3 text-sm text-left"
          >
            {groups.map((group) => (
              <AccordionItem
                key={group.title}
                value={group.title}
                className="border-b border-premium-darkGray md:border-none"
              >
                <AccordionTrigger className="text-foreground/60 uppercase tracking-wider text-xs py-3 hover:no-underline">
                  {group.title}
                </AccordionTrigger>
                <AccordionContent className="pb-3 pt-0">
                  <div className="flex flex-col gap-2">
                    {group.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={linkClass(link.to)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="border-t border-premium-darkGray pt-6 mt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center items-center gap-4">
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-700/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                <span className="font-semibold tracking-wide">GDPR</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs bg-blue-900/40 text-blue-400 border border-blue-700/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                <span className="font-semibold tracking-wide">SOC II</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs bg-amber-900/40 text-amber-400 border border-amber-700/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                <span className="font-semibold tracking-wide">ISO 27001</span>
              </div>
            </div>
            <p>&copy; {new Date().getFullYear()} A.R.I.A™ — AI Reputation Intelligence Agent</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
