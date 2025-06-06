
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const EnhancedFooter = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleAdminAccess = () => {
    console.log('Admin button clicked', { isAuthenticated, isAdmin });
    if (isAuthenticated && isAdmin) {
      console.log('Navigating to /admin');
      navigate('/admin');
    } else {
      console.log('Navigating to /admin/login');
      navigate('/admin/login');
    }
  };

  const scrollToServices = () => {
    // Check if we're on the home page
    if (window.location.pathname === '/') {
      const servicesElement = document.getElementById('services');
      if (servicesElement) {
        servicesElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page with services hash
      navigate('/#services');
    }
  };

  return (
    <footer className="bg-[#1C1C1E]/90 backdrop-blur-sm border-t border-[#247CFF]/20 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Brand Column */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#247CFF] to-[#38C172] rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="text-lg md:text-xl font-bold text-white font-['Space_Grotesk'] tracking-wide">A.R.I.A™</span>
            </div>
            <p className="text-[#D8DEE9] text-sm font-['Inter']">
              Adaptive Reputation Intelligence & Analysis - Protecting what matters most.
            </p>
          </div>

          {/* Company Column */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold mb-4 font-['Space_Grotesk']">Company</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-[#D8DEE9] hover:text-white transition-colors text-sm font-['Inter']">About</a></li>
              <li><a href="/simon-lindsay" className="text-[#D8DEE9] hover:text-white transition-colors text-sm font-['Inter']">Simon Lindsay</a></li>
              <li><a href="/blog" className="text-[#D8DEE9] hover:text-white transition-colors text-sm font-['Inter']">Blog</a></li>
              <li><button onClick={scrollToServices} className="text-[#D8DEE9] hover:text-white transition-colors text-sm font-['Inter'] text-left">Services</button></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold mb-4 font-['Space_Grotesk']">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/contact" className="text-[#D8DEE9] hover:text-white transition-colors text-sm font-['Inter']">Contact</a></li>
              <li><a href="/pricing" className="text-[#D8DEE9] hover:text-white transition-colors text-sm font-['Inter']">Pricing</a></li>
              <li><span className="text-[#D8DEE9]/60 text-sm font-['Inter']">Privacy Policy</span></li>
              <li><span className="text-[#D8DEE9]/60 text-sm font-['Inter']">Terms of Service</span></li>
            </ul>
          </div>

          {/* Access Column */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold mb-4 font-['Space_Grotesk']">Get Started</h3>
            <ul className="space-y-2">
              <li><a href="/scan" className="text-[#D8DEE9] hover:text-white transition-colors text-sm font-['Inter']">Request Scan</a></li>
              <li><a href="/pricing" className="text-[#D8DEE9] hover:text-white transition-colors text-sm font-['Inter']">Pricing</a></li>
              <li><button onClick={handleAdminAccess} className="text-[#D8DEE9] hover:text-white transition-colors text-sm font-['Inter'] text-left">Admin Access</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#247CFF]/20 pt-6 md:pt-8 mt-6 md:mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[#D8DEE9] text-sm font-['Inter'] text-center md:text-left">
              &copy; 2025 A.R.I.A™ — AI Reputation Intelligence Agent. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center space-x-4 md:space-x-6">
              <span className="text-xs text-[#D8DEE9]/60 font-['Inter']">🔒 GDPR Compliant</span>
              <span className="text-xs text-[#D8DEE9]/60 font-['Inter']">🛡️ Enterprise Security</span>
              <span className="text-xs text-[#D8DEE9]/60 font-['Inter']">🇬🇧 Built in UK</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EnhancedFooter;
