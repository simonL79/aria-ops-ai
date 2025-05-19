
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/ui/logo';

const Footer = () => {
  return (
    <footer className="bg-premium-black text-premium-silver py-16 text-center">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-6 md:mb-0">
            <Logo variant="light" size="md" />
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link to="/about" className="text-premium-silver hover:text-white transition-colors">About</Link>
            <Link to="/biography" className="text-premium-silver hover:text-white transition-colors">Simon Lindsay</Link>
            <Link to="/privacy-policy" className="text-premium-silver hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/disclaimer" className="text-premium-silver hover:text-white transition-colors">Disclaimer</Link>
            <Link to="/auth" className="text-premium-silver hover:text-white transition-colors">Login</Link>
          </div>
        </div>
        <div className="border-t border-premium-darkGray pt-8 mt-8">
          <p>&copy; 2025 A.R.I.A™ — AI Reputation Intelligence Agent</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
