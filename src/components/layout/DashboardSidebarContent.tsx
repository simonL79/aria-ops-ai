
import React from 'react';
import { 
  SidebarContent,
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { 
  Home, 
  Shield, 
  Users, 
  Settings, 
  LogOut,
  FileText,
  Mail,
  Satellite,
  Brain,
  Globe,
  Scale,
  TestTube
} from 'lucide-react';
import { useLocation, Link } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface DashboardSidebarContentProps {
  onSignOut: () => Promise<void>;
}

const DashboardSidebarContent = ({ onSignOut }: DashboardSidebarContentProps) => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  
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
  
  // Get routes for sidebar
  const routes = [
    {
      label: "Dashboard",
      icon: <Home className="h-4 w-4" />,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Genesis Sentinel",
      icon: <Shield className="h-4 w-4" />,
      href: "/admin/genesis-sentinel",
      active: pathname === "/admin/genesis-sentinel",
    },
    {
      label: "Watchtower",
      icon: <Satellite className="h-4 w-4" />,
      href: "/admin/watchtower",
      active: pathname === "/admin/watchtower",
    },
    {
      label: "Intelligence Core",
      icon: <Brain className="h-4 w-4" />,
      href: "/admin/intelligence-core",
      active: pathname === "/admin/intelligence-core",
    },
    {
      label: "Persona Saturation",
      icon: <Globe className="h-4 w-4" />,
      href: "/admin/persona-saturation",
      active: pathname === "/admin/persona-saturation",
    },
    {
      label: "Legal + Tactical Ops",
      icon: <Scale className="h-4 w-4" />,
      href: "/admin/legal-ops",
      active: pathname === "/admin/legal-ops",
    },
    {
      label: "Clients",
      icon: <Users className="h-4 w-4" />,
      href: "/admin/clients",
      active: pathname === "/admin/clients",
    },
    {
      label: "QA Testing",
      icon: <TestTube className="h-4 w-4" />,
      href: "/admin/qa-testing",
      active: pathname === "/admin/qa-testing",
    },
    {
      label: "Blog",
      icon: <FileText className="h-4 w-4" />,
      href: "/blog",
      active: pathname === "/blog",
    },
    {
      label: "Contact",
      icon: <Mail className="h-4 w-4" />,
      href: "/contact",
      active: pathname === "/contact",
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    }
  ];

  return (
    <>
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
                asChild
                isActive={route.active}
                tooltip={route.label}
              >
                <Link 
                  to={route.href}
                  onClick={() => {
                    console.log('🔍 Navigating to:', route.href);
                  }}
                >
                  {route.icon}
                  <span>{route.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              onClick={onSignOut}
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
    </>
  );
};

export default DashboardSidebarContent;
