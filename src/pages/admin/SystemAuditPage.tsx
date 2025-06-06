
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminGuard from '@/components/auth/AdminGuard';
import SystemAuditDashboard from '@/components/admin/system-audit/SystemAuditDashboard';

const SystemAuditPage = () => {
  return (
    <>
      <Helmet>
        <title>A.R.I.A™ System Audit - Live Data Compliance Verification</title>
        <meta name="description" content="Comprehensive audit of A.R.I.A™ system components to verify 100% live data compliance" />
      </Helmet>
      
      <AdminGuard>
        <div className="container mx-auto py-8">
          <SystemAuditDashboard />
        </div>
      </AdminGuard>
    </>
  );
};

export default SystemAuditPage;
