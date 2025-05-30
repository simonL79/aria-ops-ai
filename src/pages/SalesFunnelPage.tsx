
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminDashboardWelcome from "@/components/salesFunnel/AdminDashboardWelcome";
import ScanRequestForm from "@/components/salesFunnel/ScanRequestForm";

const SalesFunnelPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <AdminDashboardWelcome />;
  }

  return (
    <div className="min-h-screen bg-[#0A0F2C]">
      <ScanRequestForm />
    </div>
  );
};

export default SalesFunnelPage;
