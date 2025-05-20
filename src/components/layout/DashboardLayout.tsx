
import React from 'react';
import { ReactNode } from 'react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarHeader, 
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail
} from "@/components/ui/sidebar";
import { 
  Home, 
  Search, 
  Brain, 
  Radar, 
  Activity, 
  Building2, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };
  
  // Get display name from user object, safely handling different user object structures
  const getUserDisplayName = () => {
    if (!user) return '';
    
    // Try to get name from various possible properties
    // @ts-ignore - We need to handle different user shapes
    return user.firstName || user.user_metadata?.firstName || user.email || '';
  };
  
  // Get first letter for avatar
  const getAvatarInitial = () => {
    const displayName = getUserDisplayName();
    return displayName ? displayName[0] : (user?.email?.[0] || '?');
  };
  
  const routes = [
    {
      label: "Dashboard",
      icon: <Home className="h-4 w-4" />,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Intelligence",
      icon: <Brain className="h-4 w-4" />,
      href: "/dashboard/intelligence",
      active: pathname === "/dashboard/intelligence",
    },
    {
      label: "Radar",
      icon: <Radar className="h-4 w-4" />,
      href: "/dashboard/radar",
      active: pathname === "/dashboard/radar",
    },
    {
      label: "AI Scraping",
      icon: <Search className="h-4 w-4" />,
      href: "/dashboard/ai-scraping",
      active: pathname === "/dashboard/ai-scraping",
    },
    {
      label: "Monitor",
      icon: <Activity className="h-4 w-4" />,
      href: "/dashboard/monitor",
      active: pathname === "/dashboard/monitor",
    },
    {
      label: "New Companies",
      icon: <Building2 className="h-4 w-4" />,
      href: "/dashboard/new-companies",
      active: pathname === "/dashboard/new-companies",
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <SidebarRail />
          <SidebarHeader className="border-b">
            <div className="px-4 py-3">
              <h1 className="font-bold text-xl">A.R.I.A.™</h1>
              <p className="text-muted-foreground text-sm">
                Advanced Reputation Intelligence Assistant
              </p>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 py-2">
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton
                    isActive={route.active}
                    tooltip={route.label}
                    onClick={() => navigate(route.href)}
                  >
                    {route.icon}
                    <span>{route.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Sign Out"
                  onClick={handleSignOut}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-2 p-2">
              {user && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              )}
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {getAvatarInitial()}
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center py-4 mb-6 justify-between">
            <div>
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Last scan:</span> Today, 10:30 AM
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
