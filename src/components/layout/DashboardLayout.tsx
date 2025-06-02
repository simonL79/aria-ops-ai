
import React from 'react';
import { ReactNode } from 'react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarRail
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { useCurrentPage } from '@/hooks/useCurrentPage';
import { toast } from 'sonner';
import DashboardSidebarContent from './DashboardSidebarContent';
import DashboardMainHeader from './DashboardMainHeader';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { signOut } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { title, description } = useCurrentPage();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  // Add debugging to track route changes
  React.useEffect(() => {
    console.log('🔄 Route changed to:', pathname);
    console.log('📍 Current page info:', { title, description });
  }, [pathname, title, description]);

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-black">
          <Sidebar className="bg-black border-r border-gray-800">
            <SidebarRail />
            <DashboardSidebarContent onSignOut={handleSignOut} />
          </Sidebar>
          <main className="flex-1 p-4 md:p-6 bg-black">
            <DashboardMainHeader />
            <div className="bg-black text-white">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default DashboardLayout;
