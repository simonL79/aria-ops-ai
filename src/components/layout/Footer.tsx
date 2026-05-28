
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/ui/logo';

const Footer = () => {
  return (
    <footer className="bg-premium-black text-premium-silver py-8 text-center">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-8">
          <div className="flex items-center mb-2 md:mb-0">
            <Logo variant="light" size="xl" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-3 text-sm">
            <div className="flex flex-col gap-2">
              <span className="text-white/60 uppercase tracking-wider text-xs mb-1">Services</span>
              <Link to="/services/brand-protection" className="text-premium-silver hover:text-white transition-colors">Brand Protection</Link>
              <Link to="/services/remove-google-reviews" className="text-premium-silver hover:text-white transition-colors">Remove Google Reviews</Link>
              <Link to="/services/online-impersonation-uk" className="text-premium-silver hover:text-white transition-colors">Online Impersonation (UK)</Link>
              <Link to="/scan" className="text-premium-silver hover:text-white transition-colors">Free Threat Scan</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white/60 uppercase tracking-wider text-xs mb-1">Solutions</span>
              <Link to="/ai-reputation-readiness" className="text-premium-silver hover:text-white transition-colors">AI Reputation Readiness</Link>
              <Link to="/ai-reputation-management" className="text-premium-silver hover:text-white transition-colors">AI Reputation Management</Link>
              <Link to="/online-reputation-management-uk" className="text-premium-silver hover:text-white transition-colors">Online Reputation Management UK</Link>
              <Link to="/llm-reputation-management" className="text-premium-silver hover:text-white transition-colors">LLM Reputation Management</Link>
              <Link to="/ai-search-visibility" className="text-premium-silver hover:text-white transition-colors">AI Search Visibility</Link>
              <Link to="/generative-engine-optimisation" className="text-premium-silver hover:text-white transition-colors">Generative Engine Optimisation</Link>
              <Link to="/reputation-threat-score" className="text-premium-silver hover:text-white transition-colors">Reputation Threat Score</Link>
              <Link to="/legal-defence-compliance" className="text-premium-silver hover:text-white transition-colors">Legal Defence & Compliance</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white/60 uppercase tracking-wider text-xs mb-1">For</span>
              <Link to="/founder-reputation-protection" className="text-premium-silver hover:text-white transition-colors">Founders</Link>
              <Link to="/athlete-reputation-management" className="text-premium-silver hover:text-white transition-colors">Athletes</Link>
              <Link to="/executive-reputation-protection" className="text-premium-silver hover:text-white transition-colors">Executives</Link>
              <Link to="/crisis-reputation-management" className="text-premium-silver hover:text-white transition-colors">Crisis Response</Link>
              <Link to="/suppress-negative-google-results" className="text-premium-silver hover:text-white transition-colors">Suppress Google Results</Link>
              <Link to="/negative-search-result-suppression" className="text-premium-silver hover:text-white transition-colors">Negative Search Suppression</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white/60 uppercase tracking-wider text-xs mb-1">Resources</span>
              <Link to="/resources/ai-reputation-readiness-checklist" className="text-premium-silver hover:text-white transition-colors">AI Readiness Checklist</Link>
              <Link to="/resources/founder-reputation-risk-report" className="text-premium-silver hover:text-white transition-colors">Founder Risk Report</Link>
              <Link to="/resources/athlete-reputation-protection-guide" className="text-premium-silver hover:text-white transition-colors">Athlete Protection Guide</Link>
              <Link to="/resources/llm-visibility-audit-template" className="text-premium-silver hover:text-white transition-colors">LLM Visibility Audit</Link>
              <Link to="/resources/negative-search-suppression-guide" className="text-premium-silver hover:text-white transition-colors">Suppression Guide</Link>
              <Link to="/resources/crisis-reputation-response-checklist" className="text-premium-silver hover:text-white transition-colors">Crisis Checklist</Link>
              <Link to="/resources/ai-search-visibility-glossary" className="text-premium-silver hover:text-white transition-colors">AI Search Glossary</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white/60 uppercase tracking-wider text-xs mb-1">Company</span>
              <Link to="/about" className="text-premium-silver hover:text-white transition-colors">About</Link>
              <Link to="/simon-lindsay" className="text-premium-silver hover:text-white transition-colors">Simon Lindsay</Link>
              <Link to="/home#pricing" className="text-premium-silver hover:text-white transition-colors">Pricing</Link>
              <Link to="/blog" className="text-premium-silver hover:text-white transition-colors">Blog</Link>
              <Link to="/contact" className="text-premium-silver hover:text-white transition-colors">Contact</Link>
              <Link to="/cybersecurity-framework" className="text-premium-silver hover:text-white transition-colors">Security</Link>
              <Link to="/privacy-policy" className="text-premium-silver hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="text-premium-silver hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
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
