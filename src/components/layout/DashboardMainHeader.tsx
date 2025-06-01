
import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCurrentPage } from '@/hooks/useCurrentPage';

const DashboardMainHeader = () => {
  const { title, description } = useCurrentPage();

  return (
    <div className="flex items-center py-4 mb-6 justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Last scan:</span> Today, 10:30 AM
        </div>
      </div>
    </div>
  );
};

export default DashboardMainHeader;
