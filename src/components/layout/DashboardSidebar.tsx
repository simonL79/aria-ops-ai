
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  Bell,
  Trash2,
  Settings,
  Users,
  Shield,
  Eye,
  MonitorCheck,
  MessageCircle
} from "lucide-react";
import { useRbac } from "@/hooks/useRbac";
import { Role } from "@/types";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground"
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

interface ProtectedNavItemProps {
  roles: Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const ProtectedNavItem = ({ roles, fallback, children }: ProtectedNavItemProps) => {
  const { hasPermission } = useRbac();
  
  if (hasPermission(roles)) {
    return <>{children}</>;
  }
  
  return fallback ? <>{fallback}</> : null;
};

export function DashboardSidebar() {
  return (
    <div className="flex h-screen flex-col border-r">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Dashboard
        </h2>
        <div className="space-y-1">
          <NavItem to="/dashboard" icon={<Home className="h-4 w-4" />} label="Overview" />
          <NavItem to="/dashboard/mentions" icon={<MessageCircle className="h-4 w-4" />} label="Mentions" />
          <NavItem
            to="/dashboard/command-center"
            icon={<MonitorCheck className="h-4 w-4" />}
            label="Command Center"
          />
          <NavItem to="/monitor" icon={<Eye className="h-4 w-4" />} label="Monitor" />
        </div>
      </div>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Management
        </h2>
        <div className="space-y-1">
          <ProtectedNavItem roles={["admin", "manager"]}>
            <NavItem to="/clients" icon={<Users className="h-4 w-4" />} label="Clients" />
          </ProtectedNavItem>
          
          <ProtectedNavItem roles={["admin", "manager", "analyst"]}>
            <NavItem to="/removal" icon={<Trash2 className="h-4 w-4" />} label="Removal" />
          </ProtectedNavItem>
          
          <ProtectedNavItem roles={["admin"]}>
            <NavItem to="/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />
          </ProtectedNavItem>
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Alerts
        </h2>
        <div className="space-y-1">
          <NavItem to="/dashboard" icon={<Bell className="h-4 w-4" />} label="Notifications" />
          <NavItem to="/dashboard" icon={<Shield className="h-4 w-4" />} label="Security" />
        </div>
      </div>
    </div>
  );
}
