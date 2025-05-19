
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  LineChart, 
  Users, 
  Shield, 
  AlertTriangle, 
  Settings, 
  Trash2, 
  Search, 
  MessageSquare, 
  Clock
} from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup } from "@/components/ui/sidebar";
import { useRbac, RoleProtected } from '@/hooks/useRbac';

const DashboardSidebar = () => {
  const isActive = (path: string) => {
    return window.location.pathname === path;
  };
  
  const { hasRole } = useRbac();

  const NavItem = ({ href, icon: Icon, children, requiredRole }: { 
    href: string; 
    icon: any; 
    children: React.ReactNode;
    requiredRole?: string;
  }) => {
    // If requiredRole is specified and user doesn't have it, don't show the item
    if (requiredRole && !hasRole(requiredRole as any)) {
      return null;
    }
    
    return (
      <NavLink
        to={href}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
            isActive
              ? "text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-primary"
          )
        }
      >
        <Icon className="h-4 w-4" />
        <span>{children}</span>
      </NavLink>
    );
  };

  return (
    <Sidebar>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <div className="py-2 px-4 mb-2 flex items-center">
            <Shield className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-xl">A.R.I.A.</span>
          </div>
          <div className="space-y-1 mt-2">
            <NavItem href="/" icon={Home}>
              Dashboard
            </NavItem>
            <NavItem href="/command-center" icon={AlertTriangle}>
              Command Center
            </NavItem>
            <NavItem href="/monitor" icon={LineChart}>
              Monitor
            </NavItem>
            <NavItem href="/clients" icon={Users} requiredRole="analyst">
              Clients
            </NavItem>
            <NavItem href="/removal" icon={Trash2}>
              Removal
            </NavItem>
          </div>
        </SidebarGroup>

        <SidebarGroup className="mt-6 py-2">
          <h3 className="px-4 text-xs font-medium text-muted-foreground mb-2">TOOLS</h3>
          <div className="space-y-1 mt-2">
            <NavItem href="/command-center" icon={AlertTriangle}>
              Threat Feed
            </NavItem>
            <NavItem href="/command-center" icon={Clock}>
              Timeline View
            </NavItem>
            <RoleProtected requiredRoles={['analyst', 'manager', 'admin']}>
              <NavItem href="/command-center" icon={MessageSquare}>
                Action Panel
              </NavItem>
            </RoleProtected>
            <RoleProtected requiredRoles={['manager', 'admin']}>
              <NavItem href="/command-center" icon={Search}>
                SEO Tracker
              </NavItem>
            </RoleProtected>
          </div>
        </SidebarGroup>

        <SidebarGroup className="mt-6 py-2">
          <h3 className="px-4 text-xs font-medium text-muted-foreground mb-2">SETTINGS</h3>
          <div className="space-y-1 mt-2">
            <NavItem href="/settings" icon={Settings}>
              Account
            </NavItem>
            <RoleProtected requiredRoles={['admin']}>
              <NavItem href="/settings/security" icon={Shield}>
                Security
              </NavItem>
            </RoleProtected>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
