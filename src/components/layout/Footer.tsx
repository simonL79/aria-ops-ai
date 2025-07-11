
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
          <p>&copy; 2025 A.R.I.A™ — AI Reputation Intelligence Agent</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
