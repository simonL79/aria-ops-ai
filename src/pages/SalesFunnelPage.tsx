
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminDashboardWelcome from "@/components/salesFunnel/AdminDashboardWelcome";
import ScanRequestForm from "@/components/salesFunnel/ScanRequestForm";
import PageLayout from "@/components/layout/PageLayout";
import Header from "@/components/layout/Header";
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

  if (isAuthenticated) {
    return <AdminDashboardWelcome />;
  }

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
    <PageLayout>
      <Header />
      <main className="flex-1">
        <HeroSection onScrollToForm={scrollToForm} />
        <CapabilitiesSection />
        <ThreatTypesSection />
        <ClientTypesSection />
        <ServicesSection />
        <PrivacySection />
        <ProcessSection />
        <FinalCTASection onScrollToForm={scrollToForm} />
        <TrustBadgesSection />
        <ScanRequestForm />
      </main>
    </PageLayout>
  );
};

export default SalesFunnelPage;
