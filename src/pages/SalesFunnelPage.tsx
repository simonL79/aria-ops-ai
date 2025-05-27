
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import AdminDashboardWelcome from "@/components/salesFunnel/AdminDashboardWelcome";
import ScanRequestForm from "@/components/salesFunnel/ScanRequestForm";
import Logo from "@/components/ui/logo";
import HeroSection from "@/components/landing/HeroSection";
import CapabilitiesSection from "@/components/landing/CapabilitiesSection";
import ThreatTypesSection from "@/components/landing/ThreatTypesSection";
import ClientTypesSection from "@/components/landing/ClientTypesSection";
import ServicesSection from "@/components/landing/ServicesSection";
import PrivacySection from "@/components/landing/PrivacySection";
import ProcessSection from "@/components/landing/ProcessSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import TrustBadgesSection from "@/components/landing/TrustBadgesSection";

const SalesFunnelPage = () => {
  const { isAuthenticated } = useAuth();

  // If authenticated, show admin dashboard walkthrough
  if (isAuthenticated) {
    return <AdminDashboardWelcome />;
  }

  // Handle smooth scroll to form
  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const formElement = document.getElementById('scan-form');
    if (formElement) {
      formElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen scroll-smooth">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center space-x-2">
              <Logo variant="default" size="sm" />
            </a>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/about" className="text-sm font-medium hover:text-primary">About</a>
            <a href="/blog" className="text-sm font-medium hover:text-primary">Blog</a>
            <a href="/simon-lindsay" className="text-sm font-medium hover:text-primary">Simon Lindsay</a>
            <a href="/admin/login" className="text-sm font-medium text-blue-600 hover:text-blue-700">Admin Login</a>
          </nav>
        </div>
      </header>

      {/* Main Content Sections */}
      <HeroSection onScrollToForm={scrollToForm} />
      <CapabilitiesSection />
      <ThreatTypesSection />
      <ClientTypesSection />
      <ServicesSection />
      <PrivacySection />
      <ProcessSection />
      <FinalCTASection onScrollToForm={scrollToForm} />
      <TrustBadgesSection />

      {/* Scan Request Form */}
      <ScanRequestForm />
    </div>
  );
};

export default SalesFunnelPage;
