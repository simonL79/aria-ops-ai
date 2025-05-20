
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bell,
  CreditCard,
  Home,
  Settings,
  Users,
  Radio,
  Shield,
  Trash,
  Eye,
  FileText,
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // If not authenticated, only show limited navigation
  if (!isAuthenticated) {
    return (
      <nav className={cn("flex items-center gap-6 text-sm", className)}>
        <Link
          to="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            location.pathname === "/" ? "text-foreground font-medium" : "text-foreground/60"
          )}
        >
          Home
        </Link>
        <Link
          to="/pricing"
          className={cn(
            "transition-colors hover:text-foreground/80",
            location.pathname === "/pricing" ? "text-foreground font-medium" : "text-foreground/60"
          )}
        >
          Pricing
        </Link>
        <Link
          to="/about"
          className={cn(
            "transition-colors hover:text-foreground/80",
            location.pathname === "/about" ? "text-foreground font-medium" : "text-foreground/60"
          )}
        >
          About
        </Link>
      </nav>
    );
  }

  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    if (path !== "/dashboard" && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <nav className={cn("flex items-center gap-6 text-sm", className)}>
      <Link
        to="/dashboard"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/dashboard") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <Home className="h-4 w-4" />
        <span className="group-hover:underline">Dashboard</span>
      </Link>
      <Link
        to="/dashboard/mentions"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/dashboard/mentions") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <Bell className="h-4 w-4" />
        <span className="group-hover:underline">Mentions</span>
      </Link>
      <Link
        to="/engagement"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/engagement") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <MessageSquare className="h-4 w-4" />
        <span className="group-hover:underline">Engagement</span>
      </Link>
      <Link
        to="/dashboard/analytics"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/dashboard/analytics") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <BarChart className="h-4 w-4" />
        <span className="group-hover:underline">Analytics</span>
      </Link>
      <Link
        to="/clients"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/clients") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <Users className="h-4 w-4" />
        <span className="group-hover:underline">Clients</span>
      </Link>
      <Link
        to="/monitor"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/monitor") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <Eye className="h-4 w-4" />
        <span className="group-hover:underline">Monitor</span>
      </Link>
      <Link
        to="/dashboard/radar"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/dashboard/radar") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <Radio className="h-4 w-4" />
        <span className="group-hover:underline">Radar</span>
      </Link>
      <Link
        to="/reports"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/reports") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <FileText className="h-4 w-4" />
        <span className="group-hover:underline">Reports</span>
      </Link>
      <Link
        to="/removal"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/removal") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <Trash className="h-4 w-4" />
        <span className="group-hover:underline">Removal</span>
      </Link>
      <Link
        to="/settings"
        className={cn(
          "group flex items-center gap-1 transition-colors hover:text-foreground/80",
          isActive("/settings") ? "text-foreground font-medium" : "text-foreground/60"
        )}
      >
        <Settings className="h-4 w-4" />
        <span className="group-hover:underline">Settings</span>
      </Link>
    </nav>
  );
}
