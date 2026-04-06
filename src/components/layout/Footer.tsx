
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/ui/logo';

const Footer = () => {
  return (
    <footer className="bg-premium-black text-premium-silver py-8 text-center">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center mb-6 md:mb-0">
            <Logo variant="light" size="xl" />
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link to="/about" className="text-premium-silver hover:text-white transition-colors">About</Link>
            <Link to="/simon-lindsay" className="text-premium-silver hover:text-white transition-colors">Simon Lindsay</Link>
            <Link to="/pricing" className="text-premium-silver hover:text-white transition-colors">Pricing</Link>
            <Link to="/blog" className="text-premium-silver hover:text-white transition-colors">Blog</Link>
            <Link to="/contact" className="text-premium-silver hover:text-white transition-colors">Contact</Link>
            <Link to="/admin/login" className="text-premium-silver hover:text-white transition-colors">Admin Login</Link>
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
