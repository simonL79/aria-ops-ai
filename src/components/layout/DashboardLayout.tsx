
import React from 'react';
import AdminSidebar from './AdminSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const DashboardLayout = ({ children, showSidebar = true }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-corporate-dark flex w-full">
      {showSidebar && <AdminSidebar />}
      <main className="flex-1 overflow-auto relative">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
