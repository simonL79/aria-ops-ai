
import React from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton, useUser } from '@clerk/clerk-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useUser();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center py-4 mb-6 justify-between">
            <div>
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Last scan:</span> Today, 10:30 AM
              </div>
              <div className="flex items-center gap-2">
                {user && (
                  <span className="text-sm hidden md:inline-block">
                    {user.firstName || user.emailAddresses?.[0]?.emailAddress}
                  </span>
                )}
                <UserButton afterSignOutUrl="/home" />
              </div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
