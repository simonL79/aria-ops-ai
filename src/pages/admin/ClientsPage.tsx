
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ClientManagement from '@/components/clients/ClientManagement';

const ClientsPage = () => {
  return (
    <DashboardLayout>
      <ClientManagement />
    </DashboardLayout>
  );
};

export default ClientsPage;
