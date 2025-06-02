
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ClientManagement from '@/components/clients/ClientManagement';

const ClientsPage = () => {
  return (
    <DashboardLayout>
      <div className="bg-black text-white min-h-screen">
        <ClientManagement />
      </div>
    </DashboardLayout>
  );
};

export default ClientsPage;
