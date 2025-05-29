
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import HeroSection from "@/components/landing/HeroSection";
import TrustBadgesSection from "@/components/landing/TrustBadgesSection";
import ClientTypesSection from "@/components/landing/ClientTypesSection";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const scanFormRef = useRef<HTMLDivElement>(null);

  const handleScrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // For now, navigate to scan page since the form isn't on this page
    navigate('/scan');
  };

  const handleAdminAccess = () => {
    if (isAuthenticated && isAdmin) {
      navigate('/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F2C]">
      {/* Hero Section with sophisticated A.R.I.A™ design */}
      <HeroSection onScrollToForm={handleScrollToForm} />
      
      {/* Trust Badges */}
      <TrustBadgesSection />
      
      {/* Client Types */}
      <ClientTypesSection />
      
      {/* Admin Access Section */}
      <section className="py-16 px-6 bg-[#0A0F2C] border-t border-[#247CFF]/20">
        <div className="container mx-auto text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-r from-[#1C1C1E]/40 via-[#0A0F2C]/60 to-[#1C1C1E]/40 border border-[#247CFF]/30 p-8 rounded-2xl backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-4 text-[#247CFF] font-['Space_Grotesk'] tracking-wide">
                SECURE ADMIN PORTAL
              </h3>
              <p className="text-sm text-[#D8DEE9] mb-6 font-['Inter']">
                Access the A.R.I.A™ intelligence platform. All access is logged and monitored.
              </p>
              <button
                onClick={handleAdminAccess}
                className="w-full bg-[#247CFF] hover:bg-[#1c63cc] text-white px-6 py-3 text-sm font-bold rounded-xl border-2 border-[#247CFF] hover:border-[#1c63cc] hover:shadow-[0_0_20px_rgba(36,124,255,0.4)] transform hover:scale-105 transition-all duration-300 font-['Space_Grotesk'] tracking-wide uppercase"
              >
                {isAuthenticated && isAdmin ? 'Enter Dashboard' : 'Admin Access'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C1C1E]/40 backdrop-blur-sm border-t border-[#247CFF]/20 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-[#247CFF] to-[#38C172] rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-white font-['Space_Grotesk'] tracking-wide">A.R.I.A™</span>
          </div>
          <p className="text-sm text-[#D8DEE9] font-['Inter']">
            Adaptive Reputation Intelligence & Analysis • Secure • Autonomous • Intelligent
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
