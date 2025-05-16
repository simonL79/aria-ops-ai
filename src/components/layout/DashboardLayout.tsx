
import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center py-4 mb-6 justify-between">
            <div>
              <SidebarTrigger />
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Last scan:</span> Today, 10:30 AM
            </div>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
